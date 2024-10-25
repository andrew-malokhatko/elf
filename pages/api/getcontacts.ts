"use server"

import client from "@/lib/db";
import User from "@/types/User";
import { ObjectId } from "mongodb";

export default async function getcontacts(userId: ObjectId)
{
    const db = client.db('elfdb');
    const users = db.collection<User>('users');

    const contacts = await users.find({}, {projection:{_id: 1, name: 1, email: 1}}).toArray();
    console.log(contacts);

    const contactsMap = new Map<ObjectId, User>(
        contacts.map(contact => [contact._id, contact]) // Create tuples [key, value]
      );
    //const contactsMap = new Map<ObjectId, User>(Object.entries(contacts));
    console.log(contactsMap);

    if (!contactsMap)
    {
        return new Map<ObjectId, User>();
    }

    return contactsMap;
}