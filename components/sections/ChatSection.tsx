"use client"

import { ResizablePanel } from "@/components/ui/resizable";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";

import { Wallet, ClipboardList, Clock, Coins, SendHorizonal } from "lucide-react";

import { loadMessages, sendMessage } from "@/actions/actions";
import { Session } from "next-auth";
import MessageClient from "@/types/client/MessageClient";

import { useEffect, useState, useRef } from "react";
import Message from "@/components/Message";

interface ChatSectionProps {
    selectedChat: {id: string | null, name: string | null},
    session: Session;
}

/*
    from: string,
    text: string,
    sentAt: Date
*/

const ChatSection: React.FC<ChatSectionProps> = ({selectedChat, session} : ChatSectionProps) => {
    const [message, setMessage] = useState("");
    const [history, setHistory] = useState<MessageClient[]>([]);

    const endOfChatRef = useRef<HTMLDivElement>(null);

    const inputOnKeyDown = async (e: React.KeyboardEvent) => {
        if (e.key == "Enter" && selectedChat.id)
        {
            await sendMessage(session.user._id, selectedChat.id, message);
            setMessage("");
            setHistory([...history, {from: session.user.name, text: message, sentAt: new Date()}]);
        }
    }

    useEffect(() => {
        const fetchChatHistory = async () => {
            if (selectedChat.id)
            {
                const history = await loadMessages(session.user._id, selectedChat.id);
                //console.log(history);
                setHistory(history);
            }
        };

        fetchChatHistory();
    }, [selectedChat]);

    useEffect(() => {
      endOfChatRef.current?.scrollIntoView(false);
    }, [history])
  
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

      <ScrollArea className="w-full z-20">
        <div className="flex relative flex-col h-full p-4 space-y-4" >
          <div className="flex w-full flex-col space-y-2">
            {history.length > 0 ? (
              history.map(({ from, text, sentAt }, index) => {
                const isCurrentUser = (from === session.user.name);
                return (
                  <Message
                    key={index}
                    text={text}
                    sentAt={sentAt}
                    fromThisUser={isCurrentUser}
                  />
                )
              })
            ) : (
              <h1 className="text-gray-600 bg-white bg-opacity-40 p-3 rounded-3xl w-fit mx-auto">
                Start Messaging...
              </h1>
            )}
            <div className="absolute bottom-0" ref={endOfChatRef} />
          </div>
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
          <SendHorizonal className="h-3/4 w-auto p-1.5 rounded-md text-white bg-emerald-200" />
        )}
      </div>
</ResizablePanel>
  );
};


export default ChatSection;