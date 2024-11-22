import Database, {DatabaseError, UUID} from "../Models/Database";
import * as http from "node:http";
import User, {hasId} from "../Models/User";
import {RequestMessage, updateInitiationMessage} from "../Models/Cluster.interfaces";
import 'dotenv/config'

export default class Handler <Type extends hasId>{
    private database: Database<Type>;
    private PORT = Number(process.env.PORT) || 3000;
    constructor(database: Database<Type>) {
        this.database = database;
    }

    private initiateDatabaseSync(data: updateInitiationMessage<Type>) {
        if (process.send) {
            console.log(`Initiating database update from ${data.type} method`);
            process.send(data);
        }
    }


    private writeResponse(response: {status: number, message: any, data?: updateInitiationMessage<Type> | undefined}, successCode: number, res: http.ServerResponse) {
        if (response.status === successCode) {
            res.writeHead(response.status);
            res.write(JSON.stringify(response.message));
            res.end();
        }
    }

    private writeError(error: unknown, res: http.ServerResponse) {
        if (error instanceof DatabaseError) {
            res.writeHead(error.code);
            res.write(DatabaseError.statusCodes[error.code]);
            res.end();
        }
        console.error(error);
    }

    public handlePostRequest(req: http.IncomingMessage, res: http.ServerResponse, data: object) {
        const user = <Type>(data);
        try {
            const response: {status: number, message: string, data: updateInitiationMessage<Type>}  = this.database.create(user);
            this.writeResponse(response, 201, res);
            this.initiateDatabaseSync(response.data);
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

    public handleGetUserRequest(req: http.IncomingMessage, res: http.ServerResponse, userId: UUID) {
        try {
            const response: {status: number, message: Type} = this.database.read(userId);
            this.writeResponse(response, 200, res)
        } catch (error: unknown) {
            this.writeError(error, res);
        }
    }

    public handleDeleteUserRequest(req: http.IncomingMessage, res: http.ServerResponse, userID: UUID) {
        try {
            const response: {status: number, message: string, data: updateInitiationMessage<Type>} = this.database.delete(userID);
            this.writeResponse(response, 204, res);
            this.initiateDatabaseSync(response.data);

        } catch (error: unknown) {
            this.writeError(error, res);
        }
    }

    public handlePutUserRequest(req: http.IncomingMessage, res: http.ServerResponse, userId: UUID, data: object) {
        try {
            const user = <Type>(data);
            const response: {status: number, message: Type, data: updateInitiationMessage<Type>} = this.database.update(userId, user);
            this.writeResponse(response, 200, res);
            this.initiateDatabaseSync(response.data);
        } catch (error: unknown) {
            this.writeError(error, res);
        }
    }

}