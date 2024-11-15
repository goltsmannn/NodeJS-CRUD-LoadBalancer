import Database from "../Models/Database";
import * as http from "node:http";
import User from "../Models/User";

export default class Handler <Type>{
    private database: Database<Type>;

    constructor(database: Database<Type>) {
        this.database = database;
    }

    public handlePostRequest(req: http.IncomingMessage, res: http.ServerResponse, data: object, params: String[]) {
        let userData: {[key: string]: string | number | string[]} = {};
        params.map((param) => {
            const [key, value] = param.split('=');
            userData[key] = value;
        });
        const user = <Type>new User(
            userData['username'] as string,
            userData['age'] as number,
            userData['hobbies'] as string[]);

        const response: string = this.database.create(user);
        console.log("Created user: ", this.database.read(response));
    }
}