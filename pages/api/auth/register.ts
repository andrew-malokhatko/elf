"use server"

import client from "@/lib/db";
import User from "@/types/User";
import { ObjectId } from "mongodb";

export async function register(name: string, email: string, password: string) {
    console.log("Registering")

    if (!name || !email || !password) {
        return {ok: false, error: "All fields are required"};
    }

    const db = client.db('elfdb');
    const users = db.collection<User>('users');

    const existingUser = await users.findOne({email : email});
    if (existingUser) {
        return {ok: false, error: "User alredy exists"};
    }

    const result = await users.insertOne({
        _id: new ObjectId(),
        name: name,
        email: email,
        password: password,
        balance: 0,
        chats: []
    })

    if (!result)
    {
        return {ok: false, error: "Failed to insert user in Elf Database"};
    }

    console.log("registered succesfully");
    return {ok: true};

}