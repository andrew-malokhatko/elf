"use server";

import client from "@/lib/db";
import User from "@/types/server/User";
import UserClient from "@/types/client/UserClient";
import { ObjectId } from "mongodb";

export default async function getcontacts(userId: string): Promise<Map<string, UserClient>> {
    // Convert string to ObjectId
    const userObjectId = new ObjectId(userId);

    const db = client.db('elfdb');
    const users = db.collection<User>('users');

    // Fetch contacts with necessary fields
    const contacts = await users.find({}, { projection: { _id: 1, name: 1, email: 1, chats: 1 } }).toArray();
    
    // Convert ObjectIds to strings and ensure chats are strings
    const serializedContacts = contacts.map(contact => ({
        _id: contact._id.toString(),
        name: contact.name,
        email: contact.email
    }));

    // Create map with string keys instead of ObjectId
    const contactsMap = new Map<string, UserClient>(
        serializedContacts.map(contact => [contact._id, contact])
    );

    return contactsMap;
}