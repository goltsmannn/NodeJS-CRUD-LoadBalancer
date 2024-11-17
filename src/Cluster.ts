import * as http from "node:http";
import cluster from 'node:cluster';
import * as os from "node:os";
import 'dotenv/config'
import Database from "./Models/Database";
import User from "./Models/User";
import Handler from "./Handler/Handler";
import Router from "./Router/Router";

const CPUNum = os.availableParallelism();
const availableWorkers: {[key: number]: typeof cluster.worker} = {};
const PORT = Number(process.env.PORT) || 3000;
const db: Database<User> = new Database<User>();
const handler = new Handler<User>(db);
const router: Router<User> = new Router<User>(handler);
for (let i = 1; i <= CPUNum;  i++) {
    availableWorkers[i+PORT] = cluster.fork({PORT: i + PORT});
}

let currentWorkerId = PORT + 1;

if (cluster.isPrimary) {
    const server = http.createServer((req: http.IncomingMessage, res: http.ServerResponse) => {
        availableWorkers[currentWorkerId]?.send([req, res]);
        currentWorkerId = (currentWorkerId + 1) % CPUNum;
    });
} else {
    process.on('message', (message) => {
        const [req, res] = <[http.IncomingMessage, http.ServerResponse]>message;
        router.handleRequest(req, res);

        req.on('error', (err:Error) => {
            res.writeHead(404, {"Content-type": "text/plain"});
            res.end(err.message);
        });
    })
}