type MessageProps = {
  text: string;
  sentAt: Date;
  fromThisUser: boolean;
}

const Message = ({ text, sentAt, fromThisUser }: MessageProps) => {
  return (
    <div 
      className={`max-w-[70%] rounded-xl px-3 py-1.5 break-words
        ${fromThisUser 
          ? 'bg-emerald-300 text-black ml-auto' 
          : 'bg-gray-100 text-black mr-auto'
        }`}
    >
      <p className="text-sm">{text}</p>
      <span className="text-xs opacity-70 select-none">
        {sentAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </span>
    </div>
  );
};

export default Message;
