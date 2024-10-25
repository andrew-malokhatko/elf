"use client"

import { ResizablePanel } from "@/components/ui/resizable";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";

import { Wallet, ClipboardList, Clock, Coins, SendHorizonal } from "lucide-react";

import { loadMessages, sendMessage } from "@/actions/actions";
import { Session } from "next-auth";
import MessageClient from "@/types/client/MessageClient";

import { useEffect, useState } from "react";

interface ChatSectionProps {
  //contacts: Map<string, { name: string }>;
    selectedChat: {id: string | null, name: string | null},
    session: Session;

  //session: { user: { balance: number } } | null;
  //chatHistory: Array<{ from: string; text: string; sentAt: Date }>;
  //message: string;
  //setMessage: (value: string) => void;
  //inputOnKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}

const ChatSection: React.FC<ChatSectionProps> = ({selectedChat, session} : ChatSectionProps) => {
    const [message, setMessage] = useState("");
    const [history, setHistory] = useState<MessageClient[]>([]);

    const inputOnKeyDown = async (e: React.KeyboardEvent) => {
        if (e.key == "Enter" && selectedChat.id)
        {
            await sendMessage(session.user._id, selectedChat.id, message)
        }
    }
    useEffect(() => {
        const fetchChatHistory = async () => {
            if (selectedChat.id) {
                // Assume fetchChatHistory is a function that fetches chat history for the selected chat
                const history = await loadMessages(selectedChat.id);
                console.log(history);
                setHistory(history);
            }
        };

        fetchChatHistory();
    }, [selectedChat]);
  
  return (
    <ResizablePanel
      defaultSize={75}
      maxSize={80}
      minSize={40}
      className="relative flex flex-col justify-between items-center overflow-hidden bg-emerald-100"
    >
      <div className="absolute -left-[10%] w-[40%] opacity-60 blur-3xl aspect-square rounded-full bg-gradient-to-tr from-emerald-400 to-blue-100 z-10"></div>
      <div className="absolute left-[70%] w-[40%] opacity-40 blur-3xl aspect-square rounded-full bg-gradient-to-tr from-emerald-500 to-green-300 z-10"></div>
      <div className="absolute left-[30%] top-[70%] w-[50%] opacity-70 blur-3xl aspect-square rounded-full bg-gradient-to-tr from-teal-400 to-cyan-300 z-10"></div>

      <div className="w-full flex justify-between items-center bg-primary-foreground p-2 z-20">
        {selectedChat.id ? (
          <h2 className="text-base font-bold p-2"> {selectedChat.name} 🧝</h2>
        ) : (
          <h2 className="text-base font-bold p-2">Select a chat to start messaging 🧝</h2>
        )}

        <div className="flex justify-center items-center gap-6 px-2">
          <Wallet className="w-6 h-6" />
          <ClipboardList className="w-6 h-6" />
          <Clock className="w-6 h-6" />
          <div className="flex rounded-md px-2 py-1.5 gap-1 bg-gradient-to-tr from-emerald-100 to-green-300">
            <span className="font-semibold">{session.user.balance}</span>
            <Coins className="w-6 h-6" />
          </div>
        </div>
      </div>

      <ScrollArea className="flex-1 w-full z-20">
        <div className="flex flex-col justify-end h-full text-right p-4">
          {history.length > 0 ? (
            history.map(({ from, text, sentAt }, index) => (
              <div className="w-full h-5 text-base text-black" key={index}>
                {from} : {text} : {sentAt.getDate()}
              </div>
            ))
          ) : (
            <div className="w-full h-full flex justify-center items-center">
              <h1 className="text-gray-600 bg-white bg-opacity-40 p-3 rounded-3xl">Start Messaging...</h1>
            </div>
          )}
        </div>
      </ScrollArea>

      <div className="w-full flex items-center bg-white z-20 px-4">
        <Input
          type="text"
          autoFocus={true}
          placeholder="Write a message..."
          className="flex-grow h-12 w-full text-black"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={inputOnKeyDown}
        />
        {message.length !== 0 && (
          <SendHorizonal className="h-3/4 w-auto p-1.5 rounded-md bg-emerald-200" />
        )}
      </div>
</ResizablePanel>
  );
};


export default ChatSection;