export default interface UserClient{
    // Omits password
    // Id's in string format
    _id: string;
    email: string,
    name: string,
    balance?: number,
    chats?: string[];
};