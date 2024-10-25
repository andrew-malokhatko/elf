"use client"

import { useSession } from 'next-auth/react';
import Header from '@/components/ui/Header';
import ContactSection from '@/components/ContactSection';
import ChatSection from '@/components/ChatSection';
import LoadingPage from '@/components/Loading';
import { ResizableHandle, ResizablePanelGroup } from '@/components/ui/resizable';
import { useState } from 'react';
import { useRouter } from 'next/navigation';


export default function Home() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [selectedChat, setSelectedChat] = useState<{ id: string | null, name: string | null }>({ id: null, name: null });

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