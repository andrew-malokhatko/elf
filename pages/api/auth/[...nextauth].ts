"use server"

import NextAuth from "next-auth";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import CredentialsProvider from "next-auth/providers/credentials";
import User from "@/types/User";
import client from "@/lib/db";

export default NextAuth({
    //adapter: MongoDBAdapter(client),

    providers: [
        // TODO add a google provider

        CredentialsProvider({
            name: 'Credentials',

            credentials: {
                email: {label: 'Email', type: 'email'},
                password: {label: 'Password', type: 'password'}
            },

            async authorize(credentials, req) {

                console.log("Authorizing")

                if (!credentials?.email || !credentials?.password) {
                    throw new Error('Email and password are required')
                }

                console.log("Reached authorization function")

                const db = client.db('elfdb');
                const users = db.collection<User>('users');
                
                const user = await users.findOne({email: credentials.email});
                console.log(credentials.email);

                if (!user) {
                    console.log("Not user");
                    throw new Error('No user found for this email');
                }
                console.log("passed not user");

                if (user.password == credentials.password)
                {
                    console.log("Authorized");
                    return ({
                        id: user._id,
                        email: user.email,
                        name: user.name,
                        balance: 0,
                        
                    })
                }
                return null;
            }
        })
    ],


    
    callbacks: {
        async session({ session, user, token }) {

        console.log("Session Callback")

          const users = client.db().collection('users');
          const dbUser = await users.findOne({ email: session.user?.email });

          if (!dbUser)
          {
            return session;
          }
    
          session.user.id = dbUser._id;
          session.user.balance = dbUser.balance;
    
          return session;
        },
        async jwt({ token, user })
        {
            if (user) {
              token.id = user.id;
              token.balance = user.balance; // Add custom fields to the JWT token
            }
            return token;
        },
    },

    session: {
        strategy: "jwt"
    },
})