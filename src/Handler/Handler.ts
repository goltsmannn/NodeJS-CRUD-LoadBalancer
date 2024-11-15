import Database, {DatabaseError, UUID} from "../Models/Database";
import * as http from "node:http";
import User from "../Models/User";

export default class Handler <Type>{
    private database: Database<Type>;

    constructor(database: Database<Type>) {
        this.database = database;
    }

    private writeResponse(response: {status: number, message: any}, successCode: number, res: http.ServerResponse) {
        if (response.status === successCode) {
            res.writeHead(response.status);
            res.write(JSON.stringify(response.message));
            res.end();
        }
    }

    private writeError(error: unknown, res: http.ServerResponse) {
        if (error instanceof DatabaseError) {
            res.writeHead(error.code);
            res.write(DatabaseError.errors[error.code]);
            res.end();
        }
        console.error(error);
    }

    public handlePostRequest(req: http.IncomingMessage, res: http.ServerResponse, data: object) {
        const user = <Type>(data);
        console.log(user)
        try {
            const response: {status: number, message: string}  = this.database.create(user);
            this.writeResponse(response, 201, res);
        } catch (error: unknown) {
            this.writeError(error, res);
        }
    }

    public handleGetAllRequest(req: http.IncomingMessage, res: http.ServerResponse) {
        try {
            const response: {status: number, message: { [key: UUID]: Type }} = this.database.readAll();
            this.writeResponse(response, 200, res)
        } catch (error: unknown) {
            this.writeError(error, res);
        }
    }


}