import { ObjectId } from "mongodb";
import Message from "./Message";

export default interface Chat{
    // no id, because it is not needed for any operation
    _id?: ObjectId,
    participants: ObjectId[],
    messages: Message[]
};