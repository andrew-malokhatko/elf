"use server"

import client from "@/lib/db";
import { ObjectId } from "mongodb";

import Chat from "@/types/server/Chat";
import Message from "@/types/server/Message";

export default async function loadmessages(chatId: string)
{
    // Convert string to ObjectId
    const chatObjectId = new ObjectId(chatId);

    const db = client.db("elfdb");
    const chats = db.collection<Chat>("chats");

    console.log(chatObjectId);
    console.log(chatId);

    const chat = await chats.findOne({_id: chatObjectId});

    if (!chat)
    {
        console.error("MY: Could't load messages. Send messages first. Please go to pages/api/loadmessages.ts");
        return [];
    }

    const serializedMessages = chat.messages.map((message) => ({
        ...message,
        from: message.from.toString()
    }));

    return serializedMessages.slice(0, 100);
}