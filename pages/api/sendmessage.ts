"use server"

import client from "@/lib/db";
import User from "@/types/server/User";
import Chat from "@/types/server/Chat";
import { ObjectId } from "mongodb";
import Message from "@/types/server/Message";

export default async function sendmessage(fromId: string, toId: string, message: string)
{
    // Convert string to ObjectId
    const fromObjectId = new ObjectId(fromId);
    const toObjectId = new ObjectId(toId);

    const db = client.db("elfdb");
    const users = db.collection<User>("users");
    const chats = db.collection<Chat>("chats");

    const userFrom = await users.findOne({_id: fromObjectId});
    const userTo = await users.findOne({_id: toObjectId});

    if (!userFrom || !userTo)
    {
        return false;
    }

    // Convert ObjectIds to numbers for sorting and create unique ID for each chat using XOR
    const fromIdNum = parseInt(fromId, 16);
    const toIdNum = parseInt(toId, 16);

    const chatId = new ObjectId(
        Buffer.from(
            ((BigInt(fromIdNum) ^ BigInt(toIdNum)) + 
            (BigInt(Math.min(fromIdNum, toIdNum)) * BigInt(Number.MAX_SAFE_INTEGER)))
            .toString(16)
            .slice(0, 24)
        , 'hex')
    );

    let chat = await chats.findOne({_id: chatId});

    if (!chat)
    {
        const participants = [userFrom._id, userTo._id].sort();

        const newChat: Chat = {
            _id: chatId,
            participants: participants,
            messages: []
        }

        const result = await chats.insertOne(newChat);
        if (!result)
        {
            console.error("Could not insert to database")
            return false;
        }

        chat = {_id: result.insertedId, ...newChat};
    }

    const messageObject: Message = {
        from: userFrom._id,
        text: message,
        sentAt: new Date()
    }

    const updateChat = await chats.updateOne(
        {_id: chat._id},
        { $push: { messages: messageObject } }
    )

    if (!updateChat.modifiedCount)
    {
        console.error("Failed to send message");
        return false;
    }

    const addChatToUser = async (userId: ObjectId) => {
        await users.updateOne(
            { _id: userId },
            { $addToSet: { chats: chat._id } } // $addToSet ensures no duplicates
        );
    };

    addChatToUser(userFrom._id);
    addChatToUser(userTo._id);

    return true;
}