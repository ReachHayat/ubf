
import React from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Message } from "@/hooks/useCommunity";

interface MessageItemProps {
  message: Message;
  getInitials: (name: string) => string;
}

export const MessageItem: React.FC<MessageItemProps> = ({ message, getInitials }) => {
  return (
    <div className="flex gap-3">
      <Avatar>
        <AvatarFallback>{getInitials(message.user?.full_name || 'User')}</AvatarFallback>
      </Avatar>
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <span className="font-medium">{message.user?.full_name || 'Unknown User'}</span>
          <span className="text-xs text-muted-foreground">
            {new Date(message.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
        <p className="mt-1">{message.content}</p>
        {message.reactions && message.reactions.length > 0 && (
          <div className="flex gap-1 mt-2">
            {message.reactions.map((reaction, idx) => (
              <span 
                key={idx} 
                className="text-xs inline-flex items-center gap-1 bg-accent px-2 py-1 rounded-full cursor-pointer"
              >
                {reaction.emoji} <span>{reaction.count}</span>
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
