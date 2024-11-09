import { Wallet, ClipboardList, Clock, Coins } from "lucide-react";
import { Session } from "next-auth";

interface ChatHeaderProps {
  selectedChat: { id: string | null; name: string | null };
  session: Session;
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({ selectedChat, session }) => {
  return (
    <div className="w-full flex justify-between items-center bg-primary-foreground p-2 z-20">
      {selectedChat.id ? (
        <h2 className="text-base font-bold p-2">{selectedChat.name} 🧝</h2>
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
  );
};
