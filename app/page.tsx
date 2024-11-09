"use client"

import { useSession } from 'next-auth/react';
import Header from '@/components/ui/Header';
import ContactSection from '@/components/sections/ContactSection';
import ChatSection from '@/components/sections/ChatSection';
import LoadingPage from '@/components/Loading';
import { ResizableHandle, ResizablePanelGroup } from '@/components/ui/resizable';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { disconnectSocket, initSocket } from "@/client/socket";
import { Socket } from 'socket.io-client';


export default function Home() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [isConnected, setIsConnected] = useState(false);
  const [selectedChat, setSelectedChat] = useState<{ id: string | null, name: string | null }>({ id: null, name: null });


  useEffect(() => {
    console.log("called use effect")

    if (!session || !session.user._id) {
      console.log("not session")
      return;
    }

    const socket: Socket = initSocket(session.user._id);

    console.log(`Actual userId: ${session.user._id}`);
    socket.connect();
    console.log("Connect called")

    return () => {
      console.log("socket closed")
      disconnectSocket();
    }
  }, [session?.user._id]);

  if (status == "loading") {
    return <LoadingPage />;
  }
  
  if (!session) {
    router.push("/login");
    return;
  }

  const userId = session.user._id;
  const userName = session.user.name;
  return (
    <div className="h-screen flex flex-col">
      <Header userName={userName}></Header>

      <main className="flex flex-1 overflow-hidden">
        <ResizablePanelGroup direction="horizontal">
          <ContactSection
            userName={userName}
            userId={userId}
            selectedChat={selectedChat}
            setSelectedChat={setSelectedChat} />

          <ResizableHandle />
          <ChatSection
            selectedChat={selectedChat}
            session={session} />

        </ResizablePanelGroup>
      </main>
    </div>
  );
}