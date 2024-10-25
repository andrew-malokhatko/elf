import NextAuth from 'next-auth';
import { ObjectId } from 'mongodb';

declare module 'next-auth' {
  interface Session {
    user: {
      _id: string;
      balance: number;
      email: string;
      name: string;
      image?: string;
    };
  }

  interface User {
    _id: string;
    email: string,
    name: string,
    balance: number,
    image?: string
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    _id: string
    balance: number
  }
}