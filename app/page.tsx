"use client"

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area"

import Contact from "@/components/Contact";

import { Clock, Coins, Search} from "lucide-react";
import { Wallet } from "lucide-react";
import { ClipboardList } from "lucide-react";
import { Loader } from "lucide-react";
import { SendHorizonal } from "lucide-react";

import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useState } from "react";

import User from "@/types/User";
import Message from "@/types/Message";
import { ObjectId } from "mongodb";

import { getContacts, loadMessages, sendMessage } from "@/actions/actions";


export default function Home() {

  const {data: session, status} = useSession();
  const router = useRouter();
  const [contacts, setContacts] = useState<Map<ObjectId, User>>();
  const [selectedChat, setSelectedChat] = useState<ObjectId>();
  const [message, setMessage] = useState("");
  const [search, setSearch] = useState("");
  const [chatHistory, setChatHistory] = useState<Message[]>([]);

  const fetchData = async () =>
  {
      const loadedContacts = await getContacts(userId);
      setContacts(loadedContacts);
      console.log(loadedContacts);
  };
    
  // Handle authentication
  let userName : string | undefined;
  let userId : ObjectId;
  let userEmail : string;
  let userBalance : number;

  useEffect(() => {
    console.log(status);
      if (status === 'authenticated' && session.user)
      {
        userName = session.user.name;
        userId = session.user.id;
        userEmail = session.user.email;
        userBalance = session.user.balance;

        fetchData();
      }
      else if (status === 'unauthenticated')
      {
          router.push('/login');
          return;
      }
      else if (status === 'loading')
      {
        return;
        /*return (
          <div className="h-screen flex justify-center items-center">
            <Loader className="h-6 w-6" />
          </div>)*/
      }
      else
      {
        console.error("Authentication status is wrong");
        return;
    }
  }, [status]);


  // Components functions 
  const contactCallback = async (contactId: ObjectId) => {
    if (selectedChat && selectedChat == contactId)
    {
      setSelectedChat(contactId);
      const messages = await loadMessages(selectedChat)
      setChatHistory(messages);
    }
  }

  const inputOnKeyDown = (e: React.KeyboardEvent) => {
    if (e.key == "Enter" && selectedChat)
    {
      sendMessage(userId, selectedChat, message)
    }
  }
  
  return (
    <div className="h-screen flex flex-col">
      <header className="bg-primary text-white p-2 text-center">
        <h1 className="text-sm font-bold">🧝🧝 Signed in as {userName ? userName : "" }, <Link className="text-emerald-300" href={'/login'} onClick={async (e) => {await signOut()}}>Sign out</Link> 🧝🧝</h1>
      </header>

      <main className="flex flex-1 overflow-hidden">
        <ResizablePanelGroup direction="horizontal">
          <ResizablePanel defaultSize={25} maxSize={60} minSize={20}  className="flex bg-primary-foreground border-r border-contactsfg">
            <div className="flex flex-col w-full gap-3 pt-3">
              <div className="flex flex-row w-full justify-center items-center gap-2 px-3">
                <Input placeholder="Search" type="text" spellCheck={false} className="h-8 font-extralight bg-gray-200 rounded-md"
                  onChange={(e) => setSearch(e.target.value)} value={search} onBlur={(e) => setSearch("")}/>
                <Button variant="ghost" className="hover:scale-110 h-8 transition-transform">
                  <Search className="w-6 h-6" />
                </Button>
              </div>
              <ScrollArea className="flex flex-col">
              {/*<Contact name="EVERYONE" selected={"EVERYONE" == selectedChat} callback={() => contactCallback("EVERYONE")}/>*/}

                {contacts && Array.from(contacts.values()).map((contact) => (
                  contact._id &&
                  (search.length == 0 || contact.name.toLowerCase().includes(search.toLocaleLowerCase())) &&

                   <Contact key={contact._id.toString()}
                            name={contact.name}
                            selected={contact._id == selectedChat}
                            callback={() => contactCallback(contact._id)}/>
                ))}

              </ScrollArea>
            </div>
          </ResizablePanel>

          <ResizableHandle/>

          <ResizablePanel defaultSize={75} maxSize={80} minSize={40}
                          className="relative flex flex-col justify-between items-center overflow-hidden bg-emerald-100">

            <div className="absolute -left-[10%] w-[40%] opacity-60 blur-3xl aspect-square rounded-full bg-gradient-to-tr from-emerald-400 to-blue-100 z-10"></div>
            <div className="absolute left-[70%] w-[40%] opacity-40 blur-3xl aspect-square rounded-full bg-gradient-to-tr from-emerald-500 to-green-300 z-10"></div>
            <div className="absolute left-[30%] top-[70%] w-[50%] opacity-70 blur-3xl aspect-square rounded-full bg-gradient-to-tr from-teal-400 to-cyan-300 z-10"></div>

            <div className="w-full flex justify-between items-center bg-primary-foreground p-2 z-20">

            {contacts && selectedChat ? (
              <h2 className="text-base font-bold p-2">{contacts.get(selectedChat)?.name} 🧝</h2>
              ) : (
                <h2 className="text-base font-bold p-2">Select a chat to start messaging 🧝</h2>
              )}

              <div className="flex justify-center items-center gap-6 px-2">
                <Wallet className="w-6 h-6" />
                <ClipboardList className="w-6 h-6"/>
                <Clock className="w-6 h-6"/>
                <div className="flex rounded-md px-2 py-1.5 gap-1 bg-gradient-to-tr from-emerald-100 to-green-300">
                  <span className="font-semibold">1000</span>
                  <Coins className="w-6 h-6" />
                </div>
              </div>
            </div>

            <ScrollArea className="flex-1 w-full z-20">
              {/*<div className="flex flex-col justify-end h-full text-right p-4">
                {chatHistory && chatHistory.map(({from, text}, index) => (
                  <div className="w-full h-5" key={index}> {from} : {message} </div>
                ))}
              </div>*/}
            </ScrollArea>

            <div className="w-full flex items-center bg-white z-20 px-4">
              <Input type="text" autoFocus={true/*add Onblur*/} placeholder="Write a message..." className="flex-grow h-12 w-full text-black"
                      value={message} onChange={(e) => setMessage(e.target.value)} onKeyDown={inputOnKeyDown}/>
              {message.length != 0 && <SendHorizonal className="h-3/4 w-auto p-1.5 rounded-md bg-emerald-200" />}
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </main>
    </div>
  );
}
