import { ObjectId } from "mongodb";

export default interface Message{
    // no id, because it is not needed for any operation
    from: ObjectId,
    text: string,
    sentAt: Date
};