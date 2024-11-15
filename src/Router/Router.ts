import Database from "../Models/Database";
import * as http from "node:http";
import Handler from "../Handler/Handler";

export default class Router <Type> {
    private handler: Handler<Type>;

    constructor(handler: Handler<Type>) {
        this.handler = handler;
    }

    public handleRequest(req: http.IncomingMessage, res: http.ServerResponse) {
        let data = '';
        req.on('data', (chunk: Buffer) => {
            data += chunk;
        });
        req.on('end', () => {
            try {
                this.redirectRequest(req, res, data ? JSON.parse(data) : {});
            } catch (e) {
                req.emit('error', e);
            }
        })
    }

    public redirectRequest(req: http.IncomingMessage, res: http.ServerResponse, data: object) {
        const url = req.url? <string[]>req.url.split('/').slice(1) : [];

        if(req.method === 'POST') {
            if (url.length === 2 && url[0] === 'api' && url[1] === 'users') {
                this.handler.handlePostRequest(req, res, data);
            } else {
                res.writeHead(400);
                res.write("Request doesn't contain required fields");
                res.end();
            }
        } else if (req.method === 'GET'
            && url.length === 2
            && url[0] === 'api'
            && url[1] === 'users') {
                this.handler.handleGetAllRequest(req, res);
        } else if(req.method === 'GET'
            && url.length === 3
            && url[0] === 'api'
            && url[1] === 'users') {
            this.handler.handleGetUserRequest(req, res, url[2]);
        } else if(req.method === 'PUT'
            && url.length === 3
            && url[0] === 'api'
            && url[1] === 'users') {
            this.handler.handlePutUserRequest(req, res, url[2], data);
        } else if(req.method === 'DELETE'
            && url.length === 3
            && url[0] === 'api'
            && url[1] === 'users') {
            this.handler.handleDeleteUserRequest(req, res, url[2]);
        } else {
            res.writeHead(404);
            res.write("Invalid URL");
            res.end();
        }
    }
}
