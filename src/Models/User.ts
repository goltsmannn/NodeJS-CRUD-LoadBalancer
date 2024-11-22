export default interface User extends hasId {
    username: string;
    age: number;
    hobbies: Array<string>;
}

export interface hasId {
    id: string | undefined;
}

