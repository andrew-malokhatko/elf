"use server"

import client from "@/lib/db";
import User from "@/types/server/User";
import UserClient from "@/types/client/UserClient";
import { ObjectId } from "mongodb";

export default async function getcontacts(userId: string) {

    // Convert string to ObjectId
    const userObjectId = new ObjectId(userId);

    const db = client.db('elfdb');
    const users = db.collection<User>('users');

    const contacts = await users.find({}, { projection: { _id: 1, name: 1, email: 1 } }).toArray();
    
    // Convert ObjectIds to strings and create a serializable object
    const serializedContacts = contacts.map(contact => ({
        ...contact,
        _id: contact._id.toString() // Convert ObjectId to string
    }));

    // Create map with string keys instead of ObjectId
    const contactsMap = new Map (
        serializedContacts.map(contact => [contact._id, contact])
    );

    return contactsMap;
}

