"use server"

import NextAuth, {User} from "next-auth";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import CredentialsProvider from "next-auth/providers/credentials";
import client from "@/lib/db";
import myUser from "@/types/server/User";

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

                if (!credentials?.email || !credentials?.password) {
                    throw new Error('Email and password are required')
                }

                const db = client.db('elfdb');
                const users = db.collection<myUser>('users');
                
                const user = await users.findOne({email: credentials.email});
                console.log(credentials.email);

                if (!user) {
                    throw new Error('No user found for this email');
                }

                if (user.password == credentials.password)
                {
                    console.log("Authorized");
                    return ({
                        _id: user._id.toString(),
                        email: user.email,
                        name: user.name,
                        balance: user.balance || 0
                    }) as User
                }
                return null;
            }
        })
    ],


    callbacks: {
        async jwt({ token, user, account }) {
            //console.log("JWT Callback Input:", { token, user, account })
            
            if (user) {
              // First sign in
              token._id = user._id
              token.balance = user.balance
              token.email = user.email
              token.name = user.name
            }
            
            //console.log("JWT Callback Output:", token)
            return token
          },

        async session({ session, token }) {
          //console.log('Session Callback Input:', { session, token })
          session.user._id = token._id;
          session.user.balance = token.balance;
          //console.log("Session Callback Output:", session)
          return session;
        }
    },

    session: {
        strategy: "jwt"
    },
})