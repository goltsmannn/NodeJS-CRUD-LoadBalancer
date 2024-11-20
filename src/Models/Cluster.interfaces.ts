import * as http from "node:http";

export interface RequestMessage {
    hostname: string;
    port: number;
    path: string;
    method: string;
    headers: http.IncomingHttpHeaders;
}

