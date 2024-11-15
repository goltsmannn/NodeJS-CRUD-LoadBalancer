import Database from "../Models/Database";
import * as http from "node:http";
import Handler from "../Handler/Handler";

export default class Router <Type> {
    private database: Database<Type>;
    private handler: Handler;

    constructor(database: Database<Type>, handler: Handler) {
        this.database = database;
        this.handler = handler;
    }

    public handleRequest(req: http.IncomingMessage, res: http.ServerResponse) {
        let data: string = '';
        req.on('data', (chunk: Buffer) => {data += chunk.toString();});
        req.on('end', () => {
            console.log(data);
            try {
                this.redirectRequest(req, res, data ? JSON.parse(data) : {});
            } catch (e) {
                req.emit('error', e);
            }
        })
    }

    public redirectRequest(req: http.IncomingMessage, res: http.ServerResponse, data: object) {
        if(request.method === 'POST') {
            this.
        }
        const url = req.url? <String[]>req.url.split('/') : [];
        console.log(url);
    }
}
