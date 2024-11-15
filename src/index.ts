import * as http from "node:http";
import User from "./Models/User";
import Database from "./Models/Database";
import 'dotenv/config';
import Router from "./Router/Router";
import Handler from "./Handler/Handler";

const PORT = process.env.PORT || 3000;
const db: Database<User> = new Database<User>();
const handler = new Handler<User>(db);
const router: Router<User> = new Router<User>(handler);


http.createServer((request: http.IncomingMessage, response: http.ServerResponse)=> {
    router.handleRequest(request, response);

    request.on('error', (err:Error) => {
        response.writeHead(404, {"Content-type": "text/plain"});
        response.end(err.message);
    });
})
    .listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});