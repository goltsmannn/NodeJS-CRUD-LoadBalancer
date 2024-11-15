import Database from "../Models/Database";
import * as http from "node:http";
import Handler from "../Handler/Handler";

export default class Router <Type> {
    private handler: Handler<Type>;

    constructor(handler: Handler<Type>) {
        this.handler = handler;
    }

    public handleRequest(req: http.IncomingMessage, res: http.ServerResponse) {
        let data: string = '';
        req.on('data', (chunk: Buffer) => {data += chunk.toString();});
        req.on('end', () => {
            try {
                this.redirectRequest(req, res, data ? JSON.parse(data) : {});
            } catch (e) {
                req.emit('error', e);
            }
        })
    }

    public redirectRequest(req: http.IncomingMessage, res: http.ServerResponse, data: object) {
        const url = req.url? <String[]>req.url.split('/') : [];
        if(req.method === 'POST') {
            const params = <String[]>url[1].replace('?', '').split('&');
            if (params.length !== 3) {
                res.writeHead(400);
                res.write("Request doesn't contain required fields");
            } else {
                this.handler.handlePostRequest(req, res, data, params);
            }
        }
    }
}
