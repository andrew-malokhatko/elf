import React from 'react';
import ResizablePanel from './ResizablePanel'; // Adjust the import path as necessary
import Input from './Input'; // Adjust the import path as necessary
import Button from './Button'; // Adjust the import path as necessary
import Search from './Search'; // Adjust the import path as necessary
import ScrollArea from './ScrollArea'; // Adjust the import path as necessary
import Contact from './Contact'; // Adjust the import path as necessary

interface ContactSectionProps {
  search: string;
  setSearch: (value: string) => void;
  contacts: Map<string, any>; // Adjust the type based on your data structure
  selectedChat: string;
  contactOnclick: (contactId: string) => void;
}

const ContactSection: React.FC<ContactSectionProps> = ({
  search,
  setSearch,
  contacts,
  selectedChat,
  contactOnclick
}) => {
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
              selected={contact._id === selectedChat}
              onclick={() => contactOnclick(contact._id)}
            />
          ))}
        </ScrollArea>
      </div>
          </ResizablePanel>
  );
};

export default ContactSection;