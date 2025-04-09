
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Search, 
  Send, 
  Users, 
  MessageSquare, 
  User, 
  Hash,
  Image,
  Paperclip,
  Smile,
  Settings as SettingsIcon,
  Bell
} from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

const channels = [
  { id: 1, name: "general", unread: 0, type: "text" },
  { id: 2, name: "help", unread: 2, type: "text" },
  { id: 3, name: "angular", unread: 5, type: "text" },
  { id: 4, name: "ui-ux", unread: 0, type: "text" },
  { id: 5, name: "jobs", unread: 0, type: "text" },
];

const directMessages = [
  { id: 1, name: "Guy Hawkins", online: true, unread: 2, avatar: "GH" },
  { id: 2, name: "Crystal Lucas", online: true, unread: 0, avatar: "CL" },
  { id: 3, name: "Melissa Stevens", online: false, unread: 0, avatar: "MS" },
  { id: 4, name: "Peter Russell", online: false, unread: 0, avatar: "PR" },
];

const messages = [
  { 
    id: 1, 
    user: "Guy Hawkins", 
    avatar: "GH",
    content: "Has anyone completed the Angular authentication assignment yet? I'm stuck on implementing the JWT token validation.", 
    timestamp: "10:32 AM", 
    reactions: [
      { emoji: "👍", count: 3 },
      { emoji: "❤️", count: 1 }
    ]
  },
  { 
    id: 2, 
    user: "Crystal Lucas", 
    avatar: "CL",
    content: "I finished it yesterday. The key is to use the HTTP interceptor to add the token to every request.", 
    timestamp: "10:35 AM",
    reactions: [
      { emoji: "👍", count: 2 }
    ]
  },
  { 
    id: 3, 
    user: "John Doe", 
    avatar: "JD",
    content: "Here's a link to some documentation that might help: https://angular.io/guide/http-intercept-requests-and-responses", 
    timestamp: "10:38 AM",
    reactions: [
      { emoji: "🙏", count: 4 }
    ]
  },
  { 
    id: 4, 
    user: "Guy Hawkins", 
    avatar: "GH",
    content: "Thanks a lot! I'll check it out.", 
    timestamp: "10:40 AM",
    reactions: []
  }
];

const activeUsers = [
  { id: 1, name: "Guy Hawkins", avatar: "GH", role: "Instructor" },
  { id: 2, name: "Crystal Lucas", avatar: "CL", role: "Student" },
  { id: 3, name: "Melissa Stevens", avatar: "MS", role: "Student" },
  { id: 4, name: "John Doe", avatar: "JD", role: "Student" },
  { id: 5, name: "Peter Russell", avatar: "PR", role: "Instructor" },
];

const Community = () => {
  const [messageText, setMessageText] = useState("");
  const [activeChannel, setActiveChannel] = useState("angular");
  
  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-4xl font-bold">Community</h1>
        <p className="text-muted-foreground">Connect and collaborate with other learners</p>
      </header>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar */}
        <div className="w-full lg:w-1/4">
          <Card className="p-4 h-[calc(100vh-200px)]">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold">CodeLingo Community</h2>
              <Button variant="ghost" size="icon" className="rounded-full">
                <SettingsIcon className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="relative mb-4">
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search" className="pl-8" />
            </div>
            
            <Tabs defaultValue="channels">
              <TabsList className="w-full mb-4 grid grid-cols-2">
                <TabsTrigger value="channels" className="text-xs">
                  <Hash className="h-3 w-3 mr-1" />
                  Channels
                </TabsTrigger>
                <TabsTrigger value="direct" className="text-xs">
                  <User className="h-3 w-3 mr-1" />
                  Direct Messages
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="channels" className="mt-0">
                <div className="space-y-1 max-h-[calc(100vh-360px)] overflow-y-auto">
                  {channels.map((channel) => (
                    <Button
                      key={channel.id}
                      variant={activeChannel === channel.name ? "secondary" : "ghost"}
                      className="w-full justify-start text-sm h-9"
                      onClick={() => setActiveChannel(channel.name)}
                    >
                      <Hash className="h-4 w-4 mr-2" />
                      <span className="truncate">{channel.name}</span>
                      {channel.unread > 0 && (
                        <Badge variant="destructive" className="ml-auto">
                          {channel.unread}
                        </Badge>
                      )}
                    </Button>
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="direct" className="mt-0">
                <div className="space-y-1 max-h-[calc(100vh-360px)] overflow-y-auto">
                  {directMessages.map((dm) => (
                    <Button
                      key={dm.id}
                      variant="ghost"
                      className="w-full justify-start text-sm h-9"
                    >
                      <div className="relative">
                        <Avatar className="h-6 w-6 mr-2">
                          <AvatarFallback>{dm.avatar}</AvatarFallback>
                        </Avatar>
                        {dm.online && (
                          <span className="absolute bottom-0 right-1 block h-2 w-2 rounded-full bg-green-500 ring-1 ring-background"></span>
                        )}
                      </div>
                      <span className="truncate">{dm.name}</span>
                      {dm.unread > 0 && (
                        <Badge variant="destructive" className="ml-auto">
                          {dm.unread}
                        </Badge>
                      )}
                    </Button>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </Card>
        </div>
        
        {/* Main Chat Area */}
        <div className="w-full lg:w-2/4">
          <Card className="h-[calc(100vh-200px)] flex flex-col">
            <div className="p-4 border-b flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Hash className="h-5 w-5" />
                <h2 className="font-semibold">{activeChannel}</h2>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon">
                  <Users className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon">
                  <Bell className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <div className="flex-1 p-4 overflow-y-auto space-y-4">
              {messages.map((message) => (
                <div key={message.id} className="flex gap-3">
                  <Avatar>
                    <AvatarFallback>{message.avatar}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{message.user}</span>
                      <span className="text-xs text-muted-foreground">{message.timestamp}</span>
                    </div>
                    <p className="mt-1">{message.content}</p>
                    {message.reactions.length > 0 && (
                      <div className="flex gap-1 mt-2">
                        {message.reactions.map((reaction, idx) => (
                          <span 
                            key={idx} 
                            className="text-xs inline-flex items-center gap-1 bg-accent px-2 py-1 rounded-full"
                          >
                            {reaction.emoji} <span>{reaction.count}</span>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="p-4 border-t">
              <div className="flex gap-3">
                <Avatar>
                  <AvatarFallback>JD</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <Textarea 
                    placeholder={`Message #${activeChannel}`}
                    className="min-h-12 resize-none"
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
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
                    >
                      <Send className="h-4 w-4" />
                      Send
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
        
        {/* Active Users */}
        <div className="w-full lg:w-1/4">
          <Card className="p-4 h-[calc(100vh-200px)]">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold">Active Now</h2>
              <Badge variant="outline" className="rounded-full">
                {activeUsers.length}
              </Badge>
            </div>
            
            <div className="space-y-4 max-h-[calc(100vh-280px)] overflow-y-auto">
              {activeUsers.map((user) => (
                <div key={user.id} className="flex items-center gap-3">
                  <div className="relative">
                    <Avatar>
                      <AvatarFallback>{user.avatar}</AvatarFallback>
                    </Avatar>
                    <span className="absolute bottom-0 right-0 block h-2 w-2 rounded-full bg-green-500 ring-1 ring-background"></span>
                  </div>
                  <div>
                    <div className="font-medium">{user.name}</div>
                    <div className="text-xs text-muted-foreground">{user.role}</div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Community;
