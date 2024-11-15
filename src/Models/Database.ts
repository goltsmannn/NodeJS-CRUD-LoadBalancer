import {v4 as uuid, validate} from "uuid";
//import {} from "../Errors/getErrors";


export type UUID = string;
export type statusCodes = 200 | 201 | 204 | 400 | 404

export class DatabaseError extends Error {
    private code: statusCodes;

    public static errors: {[key in statusCodes] : string } = {
        200: "Successfully retrieved data",
        201: "Successfully created entry",
        204: "Successfully deleted data",
        400: "Invalid input. Request failed",
        404: "Data not found"
    }

    constructor(code: statusCodes, message: string = DatabaseError.errors[code]) {
        super(message);
        this.code = code;
    }
}


export default class Database <Type> {
    protected data: { [key: UUID]: Type };

    constructor(data?:{ [key: UUID] : Type}) {
        this.data = data || {};
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
        if(!Object.keys(this.data).every((key: UUID) => this.data[key])) {
            throw new DatabaseError(400);
        };
        let id: UUID = uuid();
        this.data[id] = entry;
        return {status: 201, message: id}; // 201
    }

    public update(entryId: UUID, entry: Type)  {
        if(!validate(entryId)) {
            throw new DatabaseError(400);
        }
        if(!this.read(entryId)) {
            throw new DatabaseError(404);
        }
        this.data[entryId] = entry;
        return {status: 200, message: this.data[entryId]};
    }

    public delete(entryId: UUID) {
        if(!validate(entryId)) {
            throw new DatabaseError(400);
        }
        if(!this.read(entryId)) {
            throw new DatabaseError(400);
        }
        delete this.data[entryId];
        return {status: 204, message: DatabaseError.errors[204]}; // 204
    }
}