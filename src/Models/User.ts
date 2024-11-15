export default class User {
    private id: string | undefined;
    private username: string;
    private age: number;
    private hobbies: Array<string>;

    constructor(username: string, age: number, hobbies: Array<string>) {
        this.username = username;
        this.age = age;
        this.hobbies = hobbies;
    }

}