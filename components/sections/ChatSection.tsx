"use client"

import { ResizablePanel } from "@/components/ui/resizable";
import { loadMessages, sendMessage } from "@/actions/actions";
import { Session } from "next-auth";
import MessageClient from "@/types/client/MessageClient";
import { useEffect, useState, useRef } from "react";
import { ChatHeader } from "./chat/ChatHeader";
import { ChatMessages } from "./chat/ChatMessages";
import { ChatInput } from "./chat/ChatInput";
import { getSocket, initSocket, disconnectSocket, socket } from "@/client/socket";

interface ChatSectionProps {
  selectedChat: { id: string | null; name: string | null };
  session: Session;
}

const ChatSection: React.FC<ChatSectionProps> = ({ selectedChat, session }) => {
  const [message, setMessage] = useState("");
  const [history, setHistory] = useState<MessageClient[]>([]);
  const endOfChatRef = useRef<HTMLDivElement>(null);

  const inputOnKeyDown = async (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && selectedChat.id) {

      await fetch('/api/socket/io');

      const socket = getSocket()
      if (!socket)
      {
        return;
      }

      console.log("emmited ")
      console.log(socket.id);
      console.log(socket);

      socket.emit("sendmessage", {
        text: message,
        sentAt: new Date(),
        to: selectedChat.id
      })
      console.log("set history");

      setHistory([...history, { from: session.user.name, text: message, sentAt: new Date() }]);
      setMessage("");
    }
  };

  useEffect(() =>
    {
    const fetchChatHistory = async () =>
      {
        if (selectedChat.id)
        {
          const history = await loadMessages(session.user._id, selectedChat.id);
          setHistory(history);
        }
      };

    fetchChatHistory();
  }, [selectedChat]);


  useEffect(() =>
  {
    endOfChatRef.current?.scrollIntoView(false);
  }, [history]);

  useEffect(() => {
    if (!socket)
    {
      return;
    }

    console.log("socket is ready for recieving");

    socket.on("receivemessage", (from: string, text: string, sentAt: Date) => {
      console.log(sentAt);
      const message = {
        from: from,
        text: text,
        sentAt: sentAt
      } as MessageClient

      setHistory([...history, message]);
    })
  }, [socket])

  /*useEffect(() => {
    const socket = getSocket();

    if (!socket)
    {
        console.log("No socket");
        return
    }

    console.log("recieve set successfully")
    
    socket.on("recievemessage", (data: {from: string, text: string, sentAt: Date}) => {
      setHistory(prev => [...prev, {
        from: data.from,
        text: data.text,
        sentAt: data.sentAt
      }]);
    });

    return () => {
      disconnectSocket();
    };
  }, [socket]);*/

  return (
    <ResizablePanel
      defaultSize={75}
      maxSize={80}
      minSize={40}
      className="relative flex flex-col justify-between items-center overflow-hidden bg-emerald-100"
    >

      {/* Div tags for gradient background*/}
      <div className="absolute -left-[10%] w-[40%] opacity-60 blur-3xl aspect-square rounded-full bg-gradient-to-tr from-emerald-400 to-blue-100 z-10"></div>
      <div className="absolute left-[70%] w-[40%] opacity-40 blur-3xl aspect-square rounded-full bg-gradient-to-tr from-emerald-500 to-green-300 z-10"></div>
      <div className="absolute left-[30%] top-[70%] w-[50%] opacity-70 blur-3xl aspect-square rounded-full bg-gradient-to-tr from-teal-400 to-cyan-300 z-10"></div>

      <ChatHeader selectedChat={selectedChat} session={session} />
      <ChatMessages history={history} currentUserName={session.user.name} endOfChatRef={endOfChatRef} />
      <ChatInput message={message} setMessage={setMessage} onKeyDown={inputOnKeyDown} />
    </ResizablePanel>
  );
};

export default ChatSection;