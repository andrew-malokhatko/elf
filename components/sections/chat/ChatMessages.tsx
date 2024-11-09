import { ScrollArea } from "@/components/ui/scroll-area";
import Message from "@/components/Message";
import MessageClient from "@/types/client/MessageClient";
import { RefObject } from "react";

interface ChatMessagesProps {
  history: MessageClient[];
  currentUserName: string; 
  endOfChatRef: RefObject<HTMLDivElement>;
}

export const ChatMessages: React.FC<ChatMessagesProps> = ({ history, currentUserName, endOfChatRef }) => {
  return (
    <ScrollArea className="w-full z-20">
      <div className="flex relative flex-col h-full p-4 space-y-4">
        <div className="flex w-full flex-col space-y-2">
          {history.length > 0 ? (
            history.map(({ from, text, sentAt }, index) => {
              const isCurrentUser = from === currentUserName;
              return (
                <Message
                  key={index}
                  text={text}
                  sentAt={sentAt}
                  fromThisUser={isCurrentUser}
                />
              );
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
  );
};
