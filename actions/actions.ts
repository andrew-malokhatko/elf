"use server"

import { ObjectId } from "mongodb";
import Message from "@/types/Message";

import sendmessage from "@/pages/api/sendmessage";
import loadmessages from "@/pages/api/loadmessages";
import getcontacts from "@/pages/api/getcontacts";

export async function sendMessage(from: ObjectId, to: ObjectId, message: string)
{
    return await sendmessage(from, to, message);
}

export async function loadMessages(chat: ObjectId)
{
    return await loadmessages(chat);
}

export async function getContacts(userId: ObjectId)
{
    return await getcontacts(userId);
}