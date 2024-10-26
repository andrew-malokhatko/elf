"use client"

import Contact from '@/components/Contact';
import UserClient from "@/types/client/UserClient";

import {Search} from "lucide-react";

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area"
import { ResizablePanel } from "@/components/ui/resizable"

import { useEffect, useState } from 'react';

import {getContacts} from "@/actions/actions";

interface ContactSectionProps {
  userName: string,
  userId: string,
  selectedChat: {id: string | null, name: string | null},
  setSelectedChat: (chat: { id: string, name: string }) => void;
  //search: string;
  //setSearch: (value: string) => void;
  //contacts: Map<string, any>; // Adjust the type based on your data structure
  //selectedChat: string;
  //contactOnclick: (contactId: string) => void;
}

const ContactSection: React.FC<ContactSectionProps> = ({userName, userId, selectedChat, setSelectedChat}: ContactSectionProps) => {
  const [search, setSearch] = useState("");
  const [contacts, setContacts] = useState<Map<string, UserClient>>();

  const fetchData = async () => {
    const loadedContacts = await getContacts(userId);
    setContacts(loadedContacts);
  }

  const contactOnclick = async (contactId: string, contactName: string) => {
    setSelectedChat({id: contactId, name: contactName});
    //const messages = await loadMessages(contactId);
    //setChatHistory(messages);
  }

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <ResizablePanel defaultSize={25} maxSize={60} minSize={20} className="flex bg-primary-foreground border-r border-contactsfg">
      <div className="flex flex-col w-full gap-3 pt-3">
        <div className="flex flex-row w-full justify-center items-center gap-2 px-3">
          <Input 
            placeholder="Search" 
            type="text" 
            spellCheck={false} 
            className="h-8 font-extralight bg-gray-200 rounded-md"
            onChange={(e) => setSearch(e.target.value)} 
            value={search} 
            onBlur={() => setSearch("")}
          />
          <Button variant="ghost" className="hover:scale-110 h-8 transition-transform">
            <Search className="w-6 h-6" />
          </Button>
        </div>
        <ScrollArea className="flex flex-col">
          {contacts && Array.from(contacts.values()).map((contact) => (
            contact._id &&
            (search.length === 0 || contact.name.toLowerCase().includes(search.toLowerCase())) &&
            <Contact 
              key={contact._id}
              name={contact.name}
              selected={contact._id === selectedChat.id}
              onclick={() => contactOnclick(contact._id, contact.name)}
            />
          ))}
        </ScrollArea>
      </div>
    </ResizablePanel>
  );
};

export default ContactSection;