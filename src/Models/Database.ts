import {v4 as uuid, validate} from "uuid";
//import {} from "../Errors/getErrors";


export type UUID = string;

export default class Database <Type> {
    protected data: { [key: UUID]: Type };

    constructor(data?:{ [key: UUID] : Type}) {
        this.data = data || {};
    }

    public read(entryId: UUID) {
        if (!validate(entryId)) {
            console.log(400); // 400
        }
        try {
            let entry: Type = this.data[entryId];
            return entry;
        } catch (e) {
            console.log(e); // 404
        }
    }

    public readAll() {
        return this.data;
    }

    public create(entry: Type) {
        if(!Object.keys(this.data).every((key: UUID) => this.data[key])) {
            return "-1"; // 400
        };
        let id: UUID = uuid();
        this.data[id] = entry;
        return id; // 201
    }

    public update(entryId: UUID, entry: Type)  {
        if(!validate(entryId)) {
            return false; //400
        }
        if(!this.read(entryId)) {
            return false; // 404
        }
        this.data[entryId] = entry;
        return this.data[entryId]; // 200
    }

    public delete(entryId: UUID) {
        if(!validate(entryId)) {
            return false; // 400
        }
        if(!this.read(entryId)) {
            return false; // 404
        }
        delete this.data[entryId];
        return true; // 204
    }
}