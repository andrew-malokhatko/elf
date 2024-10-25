export default interface MessageClient{
    // no id, because it is not needed for any operation
    from: string,
    text: string,
    sentAt: Date
};