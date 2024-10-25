"use server"

import { ObjectId } from "mongodb";
import Message from "@/types/server/Message";

import sendmessage from "@/pages/api/sendmessage";
import loadmessages from "@/pages/api/loadmessages";
import getcontacts from "@/pages/api/getcontacts";

export async function sendMessage(from: string, to: string, message: string)
{
    return await sendmessage(from, to, message);
}

export async function loadMessages(chat: string)
{
    return await loadmessages(chat);
}

export async function getContacts(userId: string)
{
    return await getcontacts(userId);
}