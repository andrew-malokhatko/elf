import NextAuth from 'next-auth';
import { ObjectId } from 'mongodb';

declare module 'next-auth' {
  interface Session {
    user: {
      id: ObjectId;
      balance: number;
      email: string;
      name: string;
      image?: string;
    };
  }

  interface User {
    id: ObjectId;
    balance: number;
  }
}