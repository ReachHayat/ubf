
import { useState, useEffect, useRef } from "react";
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
  Bell,
  MoreVertical,
  PlusCircle,
  Archive,
  Trash2,
  Edit,
  Bookmark
} from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { toast } from "@/components/ui/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useCommunity } from "@/hooks/useCommunity";

const Community = () => {
  const { user, isAdmin } = useAuth();
  const [messageText, setMessageText] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [newChannelDialogOpen, setNewChannelDialogOpen] = useState(false);
  const [newChannelName, setNewChannelName] = useState("");
  const [editChannelDialogOpen, setEditChannelDialogOpen] = useState(false);
  const [editChannelId, setEditChannelId] = useState("");
  const [editChannelName, setEditChannelName] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const { 
    channels,
    activeChannel,
    setActiveChannel,
    activeDM,
    setActiveDM,
    messages,
    directMessages,
    activeUsers,
    loading,
    sendMessage,
    createChannel,
    updateChannel,
    deleteChannel,
    getInitials
  } = useCommunity();
  
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  const handleSendMessage = async () => {
    if (messageText.trim()) {
      await sendMessage(messageText);
      setMessageText("");
    }
  };
  
  const handleCreateChannel = async () => {
    if (!newChannelName.trim()) return;
    
    const newChannel = await createChannel(newChannelName);
    if (newChannel) {
      setNewChannelName("");
      setNewChannelDialogOpen(false);
      setActiveChannel(newChannel);
    }
  };
  
  const handleEditChannel = async () => {
    if (!editChannelName.trim() || !editChannelId) return;
    
    const updatedChannel = await updateChannel(editChannelId, editChannelName);
    if (updatedChannel) {
      setEditChannelDialogOpen(false);
      if (activeChannel?.id === editChannelId) {
        setActiveChannel(updatedChannel);
      }
    }
  };
  
  const handleDeleteChannel = async (channelId: string) => {
    const success = await deleteChannel(channelId);
    if (success && activeChannel?.id === channelId) {
      setActiveChannel(channels[0] || null);
    }
  };
  
  const openEditChannelDialog = (channel: typeof activeChannel) => {
    if (!channel) return;
    setEditChannelId(channel.id);
    setEditChannelName(channel.name);
    setEditChannelDialogOpen(true);
  };
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  
  const filteredChannels = channels.filter(channel => 
    channel.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Mock direct messages for now
  useEffect(() => {
    // Simulate fetching direct messages
    const mockDirectMessages = [
      { 
        id: '1',
        user: {
          id: '1',
          email: 'user1@example.com',
          full_name: 'Guy Hawkins',
          avatar_url: undefined,
          online: true
        },
        unread_count: 2
      },
      { 
        id: '2',
        user: {
          id: '2',
          email: 'user2@example.com',
          full_name: 'Crystal Lucas',
          avatar_url: undefined,
          online: true
        },
        unread_count: 0
      }
    ];
    
    setActiveDM(mockDirectMessages[0]);
  }, []);
  
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
              <Input 
                placeholder="Search" 
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
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
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium">Text Channels</h3>
                  {isAdmin() && (
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-6 w-6"
                      onClick={() => setNewChannelDialogOpen(true)}
                    >
                      <PlusCircle className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                <div className="space-y-1 max-h-[calc(100vh-360px)] overflow-y-auto">
                  {loading.channels ? (
                    <div className="flex justify-center py-4">
                      <p className="text-sm text-muted-foreground">Loading channels...</p>
                    </div>
                  ) : filteredChannels.length > 0 ? (
                    filteredChannels.map((channel) => (
                      <div key={channel.id} className="flex items-center gap-1">
                        <Button
                          variant={activeChannel?.id === channel.id ? "secondary" : "ghost"}
                          className="w-full justify-start text-sm h-9 mr-1"
                          onClick={() => setActiveChannel(channel)}
                        >
                          <Hash className="h-4 w-4 mr-2" />
                          <span className="truncate">{channel.name}</span>
                          {channel.unread_count && channel.unread_count > 0 && (
                            <Badge variant="destructive" className="ml-auto">
                              {channel.unread_count}
                            </Badge>
                          )}
                        </Button>
                        
                        {isAdmin() && (
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => openEditChannelDialog(channel)}>
                                <Edit className="h-4 w-4 mr-2" />
                                Edit Channel
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleDeleteChannel(channel.id)}>
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete Channel
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="flex justify-center py-4">
                      <p className="text-sm text-muted-foreground">No channels found</p>
                    </div>
                  )}
                </div>
              </TabsContent>
              
              <TabsContent value="direct" className="mt-0">
                <div className="space-y-1 max-h-[calc(100vh-360px)] overflow-y-auto">
                  {directMessages.length > 0 ? directMessages.map((dm) => (
                    <Button
                      key={dm.id}
                      variant={activeDM?.id === dm.id ? "secondary" : "ghost"}
                      className="w-full justify-start text-sm h-9"
                      onClick={() => setActiveDM(dm)}
                    >
                      <div className="relative">
                        <Avatar className="h-6 w-6 mr-2">
                          <AvatarFallback>{getInitials(dm.user.full_name || '')}</AvatarFallback>
                        </Avatar>
                        {dm.user.online && (
                          <span className="absolute bottom-0 right-1 block h-2 w-2 rounded-full bg-green-500 ring-1 ring-background"></span>
                        )}
                      </div>
                      <span className="truncate">{dm.user.full_name}</span>
                      {dm.unread_count && dm.unread_count > 0 && (
                        <Badge variant="destructive" className="ml-auto">
                          {dm.unread_count}
                        </Badge>
                      )}
                    </Button>
                  )) : (
                    <div className="flex justify-center py-4">
                      <p className="text-sm text-muted-foreground">No direct messages</p>
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </Card>
        </div>
        
        {/* Main Chat Area */}
        <div className="w-full lg:w-2/4">
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
                          <DropdownMenuItem onClick={() => openEditChannelDialog(activeChannel)}>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit Channel
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Archive className="h-4 w-4 mr-2" />
                            Archive Channel
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDeleteChannel(activeChannel.id)}>
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
                      <div key={message.id} className="flex gap-3">
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
              {loading.users ? (
                <div className="flex justify-center py-4">
                  <p className="text-sm text-muted-foreground">Loading users...</p>
                </div>
              ) : activeUsers.length > 0 ? (
                activeUsers.map((user) => (
                  <div key={user.id} className="flex items-center gap-3">
                    <div className="relative">
                      <Avatar>
                        <AvatarFallback>{user.avatar || getInitials(user.name || '')}</AvatarFallback>
                      </Avatar>
                      <span className="absolute bottom-0 right-0 block h-2 w-2 rounded-full bg-green-500 ring-1 ring-background"></span>
                    </div>
                    <div>
                      <div className="font-medium">{user.name}</div>
                      <div className="text-xs text-muted-foreground">{user.role}</div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex justify-center py-4">
                  <p className="text-sm text-muted-foreground">No active users</p>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
      
      {/* Create Channel Dialog */}
      <Dialog open={newChannelDialogOpen} onOpenChange={setNewChannelDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create a new channel</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="channel-name" className="text-right">
                Channel name
              </Label>
              <Input
                id="channel-name"
                value={newChannelName}
                onChange={(e) => setNewChannelName(e.target.value)}
                className="col-span-3"
                placeholder="general"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setNewChannelDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateChannel}>
              Create Channel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Edit Channel Dialog */}
      <Dialog open={editChannelDialogOpen} onOpenChange={setEditChannelDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit channel</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-channel-name" className="text-right">
                Channel name
              </Label>
              <Input
                id="edit-channel-name"
                value={editChannelName}
                onChange={(e) => setEditChannelName(e.target.value)}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditChannelDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditChannel}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Community;
