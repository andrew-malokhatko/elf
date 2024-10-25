"use server"

import client from "@/lib/db";
import { ObjectId } from "mongodb";

import Chat from "@/types/Chat";
import Message from "@/types/Message";

export default async function loadmessages(chatId: ObjectId)
{
    const db = client.db("elfdb");
    const chats = db.collection<Chat>("chats");

    const chat = await chats.findOne(ObjectId);

    if (!chat)
    {
        console.error("MY: Could't send a message. Please go to pages/api/loadmessages.ts");
        return [];
    }

    return chat.messages.slice(0, 100);
}