"use server"

import client from "@/lib/db";
import { ObjectId } from "mongodb";
import Chat from "@/types/server/Chat";

export default async function loadmessages(fromId: string, toId: string)
{
    const db = client.db("elfdb");
    const chats = db.collection<Chat>("chats");
    const users = db.collection("users");

    console.log(fromId, toId)

    // Convert ObjectIds to numbers for sorting and create unique ID for each chat using XOR
    const fromIdNum = parseInt(fromId, 16);
    const toIdNum = parseInt(toId, 16);

    // Get user names from db and store in map
    const userMap = new Map<string, string>();

    const [fromUser, toUser] = await Promise.all([
        users.findOne({ _id: new ObjectId(fromId) }),
        users.findOne({ _id: new ObjectId(toId) })
    ]);

    if (fromUser && toUser) {
        userMap.set(fromId, fromUser.name);
        userMap.set(toId, toUser.name);
    }
    

    const chatId = new ObjectId(
        Buffer.from(
            ((BigInt(fromIdNum) ^ BigInt(toIdNum)) + 
            (BigInt(Math.min(fromIdNum, toIdNum)) * BigInt(Number.MAX_SAFE_INTEGER)))
            .toString(16)
            .slice(0, 24)
        , 'hex')
    );

    const chat = await chats.findOne({_id: chatId});

    if (!chat)
    {
        //console.error("MY: Could't load messages. Send messages first. Please go to pages/api/loadmessages.ts");
        return [];
    }

    const serializedMessages = chat.messages.map((message) => ({
        ...message,
        from: userMap.get((message.from).toString()) || "Deleted user"
    }));

    return serializedMessages.slice(0, 100);
}