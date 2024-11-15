import {v4 as uuid, validate} from "uuid";
import User from "./User";
//import {} from "../Errors/getErrors";


export type UUID = string;
export type statusCodes = 200 | 201 | 204 | 400 | 404

export class DatabaseError extends Error {
    static get statusCodes(): { [key in statusCodes]: string } {
        return this._statusCodes;
    }
    get code(): statusCodes {
        return this._code;
    }
    private _code: statusCodes;

    private static _statusCodes: {[key in statusCodes] : string } = {
        200: "Successfully retrieved data",
        201: "Successfully created entry",
        204: "Successfully deleted data",
        400: "Invalid input. Request failed",
        404: "Data not found"
    }

    constructor(code: statusCodes, message: string = DatabaseError._statusCodes[code]) {
        super(message);
        this._code = code;
    }
}


export default class Database <Type> {
    protected data: { [key: UUID]: Type };

    constructor(data?:{ [key: UUID] : Type}) {
        this.data = data || {};
    }

    private fieldValidator(entry: Type) {
        if (!Object.keys(this.data).every((key: UUID) => this.data[key])
            || typeof (entry as User)['username'] !== "string"
            || typeof (entry as User)['age'] !== "number"
            || (entry as User)['hobbies'].every((hobby) => typeof hobby !== "string")
        ) {
            throw new DatabaseError(400);
        }
    }

    public read(entryId: UUID) {
        if (!validate(entryId)) {
            throw new DatabaseError(400);
        }
        try {
            let entry: Type = this.data[entryId];
            return {status: 200, message: entry};
        } catch (e) {
            throw new DatabaseError(404);
        }
    }

    public readAll() {
        return {status: 200, message: this.data};
    }

    public create(entry: Type) {
        try{
            this.fieldValidator(entry);
        } catch (err) {
            throw err;
        }
        let id: UUID = uuid();
        this.data[id] = entry;
        return {status: 201, message: id}; // 201
    }

    public update(entryId: UUID, entry: Type)  {
        try{
            this.fieldValidator(entry);
            if(!this.read(entryId)) {
                throw new DatabaseError(404);
            }
            this.data[entryId] = entry;
            return {status: 200, message: this.data[entryId]};
        } catch(e) {
            throw e;
        }

    }

    public delete(entryId: UUID) {
        if(!validate(entryId)) {
            throw new DatabaseError(400);
        }
        if(!this.read(entryId)) {
            throw new DatabaseError(404);
        }
        delete this.data[entryId];
        return {status: 204, message: DatabaseError.statusCodes[204]}; // 204
    }
}