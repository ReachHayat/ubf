
import React, { useRef } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  Users, 
  Bell, 
  MoreVertical, 
  Hash, 
  MessageSquare,
  Paperclip,
  Image,
  Smile,
  Send,
  Edit,
  Archive,
  Trash2
} from "lucide-react";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { MessageItem } from "./MessageItem";
import { Channel, Message } from "@/hooks/useCommunity";

interface ChatAreaProps {
  activeChannel: Channel | null;
  messages: Message[];
  messageText: string;
  setMessageText: (text: string) => void;
  loading: { messages: boolean };
  handleSendMessage: () => void;
  isAdmin: boolean;
  onEditChannel: (channel: Channel) => void;
  onDeleteChannel: (channelId: string) => void;
  user: any;
  getInitials: (name: string) => string;
  messagesEndRef: React.RefObject<HTMLDivElement>;
}

export const ChatArea: React.FC<ChatAreaProps> = ({
  activeChannel,
  messages,
  messageText,
  setMessageText,
  loading,
  handleSendMessage,
  isAdmin,
  onEditChannel,
  onDeleteChannel,
  user,
  getInitials,
  messagesEndRef,
}) => {
  return (
    <Card className="h-[calc(100vh-200px)] flex flex-col">
      {activeChannel ? (
        <>
          <div className="p-4 border-b flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Hash className="h-5 w-5" />
              <h2 className="font-semibold">{activeChannel.name}</h2>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon">
                <Users className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon">
                <Bell className="h-4 w-4" />
              </Button>
              {isAdmin() && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onEditChannel(activeChannel)}>
                      <Edit className="h-4 w-4 mr-2" />
                      Edit Channel
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Archive className="h-4 w-4 mr-2" />
                      Archive Channel
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onDeleteChannel(activeChannel.id)}>
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete Channel
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          </div>
          
          <div className="flex-1 p-4 overflow-y-auto space-y-4">
            {loading.messages ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <p className="text-muted-foreground">Loading messages...</p>
              </div>
            ) : messages.length > 0 ? (
              messages.map((message) => (
                <MessageItem 
                  key={message.id} 
                  message={message} 
                  getInitials={getInitials} 
                />
              ))
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground">
                <MessageSquare className="h-12 w-12 mb-2 opacity-20" />
                <p>No messages yet in #{activeChannel.name}</p>
                <p className="text-sm">Be the first to send a message!</p>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
          
          <div className="p-4 border-t">
            <div className="flex gap-3">
              <Avatar>
                <AvatarFallback>
                  {user ? getInitials(user.user_metadata?.full_name || 'User') : 'U'}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <Textarea 
                  placeholder={`Message #${activeChannel.name}`}
                  className="min-h-12 resize-none"
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                />
                <div className="flex items-center justify-between mt-2">
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Paperclip className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Image className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Smile className="h-4 w-4" />
                    </Button>
                  </div>
                  <Button 
                    size="sm" 
                    className="flex items-center gap-2"
                    disabled={messageText.trim() === ""}
                    onClick={handleSendMessage}
                  >
                    <Send className="h-4 w-4" />
                    Send
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="flex flex-col items-center justify-center h-full text-center p-4">
          <MessageSquare className="h-16 w-16 mb-4 opacity-20" />
          <h3 className="text-2xl font-bold mb-2">Select a channel</h3>
          <p className="text-muted-foreground">Choose a channel from the sidebar to start chatting</p>
        </div>
      )}
    </Card>
  );
};
