import * as http from "node:http";
import User from "./Models/User";
import Database from "./Models/Database";
import 'dotenv/config';
import Router from "./Router/Router";

const PORT = process.env.PORT || 3000;
let db: Database<User> = new Database<User>();
const router: Router<User> = new Router<User>(db);


http.createServer((request, response)=> {
    request.on('error', (err:Error) => {
        response.writeHead(404, {"Content-type": "text/plain"});
        response.end(err.message);
    });
    router.handleRequest(request, response);
}).listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});