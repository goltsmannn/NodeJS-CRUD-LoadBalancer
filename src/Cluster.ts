import * as http from "node:http";
import cluster, {Worker} from 'node:cluster';
import * as os from "node:os";
import 'dotenv/config'
import Database from "./Models/Database";
import User from "./Models/User";
import Handler from "./Handler/Handler";
import Router from "./Router/Router";
import {RequestMessage, ResponseMessage} from "./Models/Cluster.interfaces";

const PORT = Number(process.env.PORT) || 3000;
const db: Database<User> = new Database<User>();
const handler = new Handler<User>(db);
const router: Router<User> = new Router<User>(handler);


if (cluster.isPrimary) {

    const CPUNum = os.availableParallelism();
    for (let i = 1; i <= CPUNum;  i++) {
        const worker = cluster.fork();
    }
    let currentPort = PORT + 1;


    const server = http.createServer((req: http.IncomingMessage, res: http.ServerResponse) => {
     //   console.log(req.url);
        const method = req.method || "GET";
        const url = req.url || "/api/users";
        const headers = req.headers || {};


        const requestSerialized: RequestMessage = {
            hostname: "localhost",
            port: PORT + (currentPort++ % CPUNum),
            path: url,
            method: method,
            headers: headers
        };

        const proxy = http.request(requestSerialized, (workerResponse) => {
            res.writeHead(workerResponse.statusCode || 500, workerResponse.headers);
            workerResponse.pipe(res, {end: true});
        })
            .on('error', (err: Error) => {
                res.writeHead(500);
                res.write(err.message);
                res.end();
            });

        req.pipe(proxy);
    });
    server.listen(PORT, () => {
            console.log(`Primary server live on port ${PORT}`);
    });

} else  {
    const server = http.createServer((req, res) => {
        console.log(req.url);
        router.handleRequest(req, res);
        console.log(`Received request on worker at port ${PORT + cluster.worker!.id}`);
        req.on('error', (err:Error) => {
            res.writeHead(404, {"Content-type": "text/plain"});
            res.end(err.message);
        });
    })
        .listen(PORT + cluster.worker!.id, () => {
            console.log(`Worker listening on ${PORT + cluster.worker!.id}`)
        })
}