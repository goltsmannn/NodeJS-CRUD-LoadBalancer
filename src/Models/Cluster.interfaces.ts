import * as http from "node:http";

export interface RequestMessage {
    hostname: string;
    port: number;
    path: string;
    method: string;
    headers: http.IncomingHttpHeaders;
}

export interface updateInitiationMessage <Type>{
    key: string;
    entry: Type;
    type: string;
}