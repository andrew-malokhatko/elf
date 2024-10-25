"use client"

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { signIn, useSession } from "next-auth/react";

import {
    Card,
    CardContent,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import Logo from "@/public/logo.png";
import { register } from "@/pages/api/auth/register";


export default function RegistrationPage() {

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('')
    const router = useRouter();
    const {data: session, status} = useSession();

    if (status === "authenticated")
    {
        router.push('/');
    }

    const validateForm = () => { // called inside handle submit

        if (!name) {
            setError('Name is required');
            return false;
        } else if (name.length < 3) {
            setError('Name must be at least 3 characters long');
            return false;
        }
        
        if (!email) {
           setError('Email is required');
           return false;
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            setError('Email is invalid');
            return false;
        }
        
        if (!password) {
          setError('Password is required');
          return false;
        } else if (password.length < 6) {
          setError('Password must be at least 6 characters long');
          return false;
        }
    
        return true;
      };

    const handleSubmit = async(event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (validateForm())
        {
            const response = await register(name, email, password);

            if (response.ok)
            {
                await signIn('credentials', {
                    email,
                    password,
                    redirect: true,
                    callbackUrl: "/"
                })
            }
            else
            {
                setError(response.error || 'Registration failed. Try again');
            }
        }
    };

    return (
        <div className="h-screen relative flex flex-col items-center bg-gray-50 py-12 px-4 overflow-hidden">

            <div className="absolute -left-[10%] w-[40%] opacity-30 blur-3xl aspect-square rounded-full bg-gradient-to-tr from-emerald-400 to-blue-200 z-10"></div>
            <div className="absolute left-[70%] w-[30%] opacity-20 blur-3xl aspect-square rounded-full bg-gradient-to-tr from-emerald-500 to-teal-200 z-10"></div>
            <div className="absolute left-[30%] top-[80%] w-[50%] opacity-30 blur-3xl aspect-square rounded-full bg-gradient-to-tr from-teal-400 to-cyan-300 z-10"></div>
            <div className="absolute left-[30%] top-[-10%] w-[20%] opacity-30 blur-3xl aspect-square rounded-full bg-gradient-to-tr from-teal-400 to-cyan-300 z-10"></div>

            <Image src={Logo} alt="logo" className="w-16 h-16 m-5 z-20"></Image>
            <h1 className="text-2xl mb-5 z-20">Create new account</h1>

            <Card className="max-w-[300px] w-full bg-gray-200 z-20">
                <CardContent>
                    <form className="space-y-6 mt-4" onSubmit={handleSubmit} noValidate>
                        <div className="rounded-md flex flex-col gap-3">
                            <div>
                                <label htmlFor="name" className="text-xs text-gray-600">Name</label>
                                <Input className="h-8 p-1 text-sm border border-black rounded-md focus-visible:border-blue-500 focus-visible:border-2" id="name" name="name" type="text" autoFocus
                                        value={name} onChange={(e) => setName(e.target.value)}/>
                            </div>

                            <div>
                                <label htmlFor="email" className="text-xs text-gray-600">Email</label>
                                <Input className="h-8 p-1 text-sm border border-black rounded-md focus-visible:border-blue-500 focus-visible:border-2" id="email" name="email" type="email"
                                        value={email} onChange={(e) => setEmail(e.target.value)}/>
                            </div>

                            <div>
                                <label htmlFor="password" className="text-xs text-gray-600">Password</label>
                                <Input className="h-8 p-1 text-sm border border-black rounded-md focus-visible:border-blue-500 focus-visible:border-2" id="password" name="password" type="password"
                                value={password} onChange={(e) => setPassword(e.target.value)}/>
                            </div>

                            {error && (
                                <div className="text-red-500 text-sm mt-2">{error}</div>
                            )}
                        </div>

                        <Button type="submit" className="w-full">Register</Button>

                        <p className="text-center text-sm">Already have an account?<Link href={'/login'} className="text-blue-500"> Sign in</Link></p>  
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}