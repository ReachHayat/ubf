
import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useCommunity } from "@/hooks/useCommunity";
import { CommunitySidebar } from "@/components/community/CommunitySidebar";
import { ChatArea } from "@/components/community/ChatArea";
import { ActiveUsersList } from "@/components/community/ActiveUsersList";
import { ChannelDialog } from "@/components/community/ChannelDialog";

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

  // Convert the isAdmin function to a boolean for component props
  const isAdminValue = typeof isAdmin === 'function' ? isAdmin() : Boolean(isAdmin);

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-4xl font-bold">Community</h1>
        <p className="text-muted-foreground">Connect and collaborate with other learners</p>
      </header>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar */}
        <div className="w-full lg:w-1/4">
          <CommunitySidebar 
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            channels={channels}
            activeChannel={activeChannel}
            setActiveChannel={setActiveChannel}
            directMessages={directMessages}
            activeDM={activeDM}
            setActiveDM={setActiveDM}
            isAdmin={isAdminValue}
            loading={loading}
            onNewChannel={() => setNewChannelDialogOpen(true)}
            onEditChannel={openEditChannelDialog}
            onDeleteChannel={handleDeleteChannel}
            getInitials={getInitials}
          />
        </div>
        
        {/* Main Chat Area */}
        <div className="w-full lg:w-2/4">
          <ChatArea 
            activeChannel={activeChannel}
            messages={messages}
            messageText={messageText}
            setMessageText={setMessageText}
            loading={loading}
            handleSendMessage={handleSendMessage}
            isAdmin={isAdminValue}
            onEditChannel={openEditChannelDialog}
            onDeleteChannel={handleDeleteChannel}
            user={user}
            getInitials={getInitials}
            messagesEndRef={messagesEndRef}
          />
        </div>
        
        {/* Active Users */}
        <div className="w-full lg:w-1/4">
          <ActiveUsersList 
            activeUsers={activeUsers}
            loading={loading}
            getInitials={getInitials}
          />
        </div>
      </div>
      
      {/* Create Channel Dialog */}
      <ChannelDialog 
        open={newChannelDialogOpen}
        onOpenChange={setNewChannelDialogOpen}
        title="Create a new channel"
        channelName={newChannelName}
        setChannelName={setNewChannelName}
        onSave={handleCreateChannel}
        saveButtonText="Create Channel"
      />
      
      {/* Edit Channel Dialog */}
      <ChannelDialog
        open={editChannelDialogOpen}
        onOpenChange={setEditChannelDialogOpen}
        title="Edit channel"
        channelName={editChannelName}
        setChannelName={setEditChannelName}
        onSave={handleEditChannel}
        saveButtonText="Save Changes"
      />
    </div>
  );
};

export default Community;
