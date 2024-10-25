import { ObjectId } from "mongodb";

export default interface User{
    // no id, because it is not needed for any operation
    _id: ObjectId;
    email: string,
    name: string,
    password: string,
    balance: number,
    chats: ObjectId[];
};