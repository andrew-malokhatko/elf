import { Input } from "@/components/ui/input";
import { SendHorizonal } from "lucide-react";

interface ChatInputProps {
  message: string; 
  setMessage: (message: string) => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
}

export const ChatInput: React.FC<ChatInputProps> = ({ message, setMessage, onKeyDown }) => {
  return (
    <div className="w-full flex items-center bg-white z-20 px-4">
      <Input
        type="text"  
        autoFocus={true}
        placeholder="Write a message..."
        className="flex-grow h-12 w-full text-black"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={onKeyDown}
      />
      {message.length !== 0 && (
        <SendHorizonal className="h-3/4 w-auto p-1.5 rounded-md text-white bg-emerald-200" />
      )}
    </div>
  );
};
