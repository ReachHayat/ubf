
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { 
  Search, 
  Star, 
  Clock, 
  Archive, 
  Trash2, 
  MoreVertical,
  Paperclip,
  Send
} from "lucide-react";
import { Textarea } from "@/components/ui/textarea";

const mockMessages = [
  {
    id: 1,
    sender: "Crystal Lucas",
    avatar: "CL",
    subject: "UI/UX Design Course Feedback",
    preview: "I wanted to share some thoughts about the recent UI/UX design course materials...",
    time: "11:42 AM",
    read: false,
    starred: true,
  },
  {
    id: 2,
    sender: "Guy Hawkins",
    avatar: "GH",
    subject: "Your Angular Assignment",
    preview: "I've reviewed your Angular authentication implementation and I have a few suggestions...",
    time: "Yesterday",
    read: true,
    starred: false,
  },
  {
    id: 3,
    sender: "Melissa Stevens",
    avatar: "MS",
    subject: "Community Event - Design Workshop",
    preview: "We're planning a design workshop next week and would love to have you join us...",
    time: "Mar 27",
    read: true,
    starred: false,
  },
  {
    id: 4,
    sender: "CodeLingo Team",
    avatar: "CL",
    subject: "New Course Available: Figma Masterclass",
    preview: "We're excited to announce our new Figma Masterclass course is now available...",
    time: "Mar 25",
    read: true,
    starred: true,
  },
  {
    id: 5,
    sender: "Peter Russell",
    avatar: "PR",
    subject: "React Native Workshop",
    preview: "Following up on your interest in mobile development, I wanted to invite you...",
    time: "Mar 23",
    read: true,
    starred: false,
  },
];

const Inbox = () => {
  const [messages, setMessages] = useState(mockMessages);
  const [selectedMessage, setSelectedMessage] = useState(mockMessages[0]);
  const [replyText, setReplyText] = useState("");
  const unreadCount = messages.filter(msg => !msg.read).length;

  const handleStarMessage = (id: number) => {
    setMessages(messages.map(msg => 
      msg.id === id ? {...msg, starred: !msg.starred} : msg
    ));
    if (selectedMessage?.id === id) {
      setSelectedMessage({...selectedMessage, starred: !selectedMessage.starred});
    }
  };

  const handleSelectMessage = (message: any) => {
    if (!message.read) {
      setMessages(messages.map(msg => 
        msg.id === message.id ? {...msg, read: true} : msg
      ));
    }
    setSelectedMessage(message);
  };

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-4xl font-bold">Inbox</h1>
        <p className="text-muted-foreground">Manage your messages and notifications</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Message List */}
        <div className="lg:col-span-1">
          <Card className="p-4">
            <div className="relative mb-4">
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search messages..." className="pl-8" />
            </div>
            
            <Tabs defaultValue="inbox">
              <TabsList className="w-full grid grid-cols-3">
                <TabsTrigger value="inbox" className="relative">
                  Inbox
                  {unreadCount > 0 && (
                    <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs">
                      {unreadCount}
                    </Badge>
                  )}
                </TabsTrigger>
                <TabsTrigger value="starred">Starred</TabsTrigger>
                <TabsTrigger value="sent">Sent</TabsTrigger>
              </TabsList>
              
              <TabsContent value="inbox" className="mt-4 space-y-1 max-h-[calc(100vh-380px)] overflow-y-auto">
                {messages.map(message => (
                  <div 
                    key={message.id} 
                    className={cn(
                      "p-3 rounded-md cursor-pointer transition-colors",
                      message.read ? "hover:bg-accent/50" : "bg-accent/20 hover:bg-accent/30 font-medium",
                      selectedMessage?.id === message.id ? "bg-accent/80 hover:bg-accent/80 border border-accent" : ""
                    )}
                    onClick={() => handleSelectMessage(message)}
                  >
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback>{message.avatar}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-center">
                          <span className={cn("text-sm", !message.read && "font-medium")}>{message.sender}</span>
                          <span className="text-xs text-muted-foreground">{message.time}</span>
                        </div>
                        <h4 className={cn("text-sm truncate", !message.read && "font-medium")}>{message.subject}</h4>
                        <p className="text-xs text-muted-foreground truncate">{message.preview}</p>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-6 w-6 text-muted-foreground"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleStarMessage(message.id);
                        }}
                      >
                        <Star className={cn("h-4 w-4", message.starred ? "fill-yellow-400 text-yellow-400" : "")} />
                      </Button>
                    </div>
                  </div>
                ))}
              </TabsContent>
              
              <TabsContent value="starred" className="mt-4 max-h-[calc(100vh-380px)] overflow-y-auto">
                {messages.filter(m => m.starred).length > 0 ? (
                  <div className="space-y-1">
                    {messages.filter(m => m.starred).map(message => (
                      <div 
                        key={message.id} 
                        className={cn(
                          "p-3 rounded-md cursor-pointer transition-colors hover:bg-accent/50",
                          selectedMessage?.id === message.id ? "bg-accent/80 hover:bg-accent/80 border border-accent" : ""
                        )}
                        onClick={() => handleSelectMessage(message)}
                      >
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback>{message.avatar}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-center">
                              <span className="text-sm">{message.sender}</span>
                              <span className="text-xs text-muted-foreground">{message.time}</span>
                            </div>
                            <h4 className="text-sm truncate">{message.subject}</h4>
                            <p className="text-xs text-muted-foreground truncate">{message.preview}</p>
                          </div>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-6 w-6 text-muted-foreground"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleStarMessage(message.id);
                            }}
                          >
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Star className="mx-auto h-12 w-12 text-muted-foreground/30" />
                    <h3 className="mt-2 font-medium text-muted-foreground">No starred messages</h3>
                    <p className="text-sm text-muted-foreground/70">Messages you star will appear here</p>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="sent" className="mt-4 max-h-[calc(100vh-380px)] overflow-y-auto">
                <div className="text-center py-8">
                  <Send className="mx-auto h-12 w-12 text-muted-foreground/30" />
                  <h3 className="mt-2 font-medium text-muted-foreground">No sent messages</h3>
                  <p className="text-sm text-muted-foreground/70">Messages you send will appear here</p>
                </div>
              </TabsContent>
            </Tabs>
          </Card>
        </div>
        
        {/* Message Content */}
        <div className="lg:col-span-2">
          {selectedMessage ? (
            <Card className="flex flex-col h-[calc(100vh-200px)]">
              <div className="p-4 border-b flex items-center justify-between">
                <h3 className="text-lg font-medium">{selectedMessage.subject}</h3>
                <div className="flex items-center gap-1">
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => handleStarMessage(selectedMessage.id)}
                  >
                    <Star className={cn("h-4 w-4", selectedMessage.starred ? "fill-yellow-400 text-yellow-400" : "")} />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <Archive className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <div className="p-4 flex-1 overflow-y-auto">
                <div className="flex gap-3 mb-6">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback>{selectedMessage.avatar}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{selectedMessage.sender}</span>
                      <span className="text-xs text-muted-foreground">{selectedMessage.time}</span>
                    </div>
                    <span className="text-xs text-muted-foreground">To: me</span>
                  </div>
                </div>
                
                <div className="prose max-w-none">
                  <p>Hello John,</p>
                  <p>{selectedMessage.preview}</p>
                  <p>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et 
                    dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip 
                    ex ea commodo consequat.
                  </p>
                  <p>
                    Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. 
                    Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                  </p>
                  <p>Best regards,<br/>{selectedMessage.sender}</p>
                </div>
              </div>
              
              <div className="p-4 border-t">
                <Textarea 
                  placeholder="Write a reply..." 
                  className="min-h-24 mb-2" 
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                />
                <div className="flex justify-between">
                  <Button variant="ghost" size="icon">
                    <Paperclip className="h-4 w-4" />
                  </Button>
                  <Button 
                    className="flex items-center gap-2" 
                    disabled={!replyText.trim()}
                  >
                    <Send className="h-4 w-4" />
                    Send Reply
                  </Button>
                </div>
              </div>
            </Card>
          ) : (
            <Card className="h-[calc(100vh-200px)] flex items-center justify-center">
              <div className="text-center">
                <Clock className="mx-auto h-16 w-16 text-muted-foreground/30 mb-4" />
                <h3 className="text-lg font-medium">Select a message</h3>
                <p className="text-muted-foreground">Choose a conversation from the list</p>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

// Import the missing cn function if needed
const cn = (...classes: any[]) => {
  return classes.filter(Boolean).join(' ');
};

export default Inbox;
