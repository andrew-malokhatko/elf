import MessageClient from "./MessageClient";

export default interface ChatClient{
    // no id, because it is not needed for any operation
    _id?: string,
    participiants: string[],
    messages: MessageClient[]
};