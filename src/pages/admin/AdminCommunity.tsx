
import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { Channel } from "@/hooks/useCommunity";
import { ChannelDialog } from "@/components/community/ChannelDialog";

const AdminCommunity: React.FC = () => {
  const [channels, setChannels] = useState<Channel[]>([]);
  const [loading, setLoading] = useState(false);
  const [newChannelDialogOpen, setNewChannelDialogOpen] = useState(false);
  const [editChannelDialogOpen, setEditChannelDialogOpen] = useState(false);
  const [selectedChannel, setSelectedChannel] = useState<Channel | null>(null);
  const [channelName, setChannelName] = useState("");
  
  useEffect(() => {
    fetchChannels();
  }, []);
  
  const fetchChannels = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('channels')
        .select('*')
        .order('name');
        
      if (error) throw error;
      
      if (data) {
        // Transform data to ensure type is correct
        const transformedData: Channel[] = data.map(channel => ({
          ...channel,
          // Ensure type is cast to the correct union type
          type: channel.type === "voice" ? "voice" : "text"
        }));
        
        setChannels(transformedData);
      }
    } catch (error) {
      console.error('Error fetching channels:', error);
      toast({
        variant: "destructive",
        title: "Failed to load channels",
        description: "Please try again or contact support if the issue persists."
      });
    } finally {
      setLoading(false);
    }
  };
  
  const handleCreateChannel = async () => {
    if (!channelName.trim()) return;
    
    try {
      const { error } = await supabase
        .from('channels')
        .insert({
          name: channelName,
          type: 'text',
        });
        
      if (error) throw error;
      
      toast({
        title: "Channel created",
        description: `#${channelName} has been created successfully.`
      });
      
      setChannelName("");
      setNewChannelDialogOpen(false);
      fetchChannels();
    } catch (error) {
      console.error('Error creating channel:', error);
      toast({
        variant: "destructive",
        title: "Failed to create channel",
        description: "Please try again or contact support if the issue persists."
      });
    }
  };
  
  const handleUpdateChannel = async () => {
    if (!selectedChannel || !channelName.trim()) return;
    
    try {
      const { error } = await supabase
        .from('channels')
        .update({ name: channelName })
        .eq('id', selectedChannel.id);
        
      if (error) throw error;
      
      toast({
        title: "Channel updated",
        description: `Channel has been renamed to #${channelName}.`
      });
      
      setEditChannelDialogOpen(false);
      fetchChannels();
    } catch (error) {
      console.error('Error updating channel:', error);
      toast({
        variant: "destructive",
        title: "Failed to update channel",
        description: "Please try again or contact support if the issue persists."
      });
    }
  };
  
  const handleDeleteChannel = async (channelId: string) => {
    if (!confirm("Are you sure you want to delete this channel? This action cannot be undone.")) {
      return;
    }
    
    try {
      const { error } = await supabase
        .from('channels')
        .delete()
        .eq('id', channelId);
        
      if (error) throw error;
      
      toast({
        title: "Channel deleted",
        description: "The channel has been deleted successfully."
      });
      
      fetchChannels();
    } catch (error) {
      console.error('Error deleting channel:', error);
      toast({
        variant: "destructive",
        title: "Failed to delete channel",
        description: "Please try again or contact support if the issue persists."
      });
    }
  };
  
  const openEditDialog = (channel: Channel) => {
    setSelectedChannel(channel);
    setChannelName(channel.name);
    setEditChannelDialogOpen(true);
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Community Management</h1>
        <Button onClick={() => setNewChannelDialogOpen(true)}>Add Channel</Button>
      </div>
      
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Channels</h2>
        
        {loading ? (
          <p>Loading channels...</p>
        ) : channels.length > 0 ? (
          <div className="divide-y">
            {channels.map(channel => (
              <div key={channel.id} className="py-3 flex items-center justify-between">
                <div>
                  <h3 className="font-medium">#{channel.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    Type: {channel.type}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => openEditDialog(channel)}>
                    Edit
                  </Button>
                  <Button 
                    variant="destructive" 
                    size="sm"
                    onClick={() => handleDeleteChannel(channel.id)}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>No channels found. Create your first channel!</p>
        )}
      </Card>
      
      {/* Create Channel Dialog */}
      <ChannelDialog
        open={newChannelDialogOpen}
        onOpenChange={setNewChannelDialogOpen}
        title="Create a new channel"
        channelName={channelName}
        setChannelName={setChannelName}
        onSave={handleCreateChannel}
        saveButtonText="Create Channel"
      />
      
      {/* Edit Channel Dialog */}
      <ChannelDialog
        open={editChannelDialogOpen}
        onOpenChange={setEditChannelDialogOpen}
        title="Edit channel"
        channelName={channelName}
        setChannelName={setChannelName}
        onSave={handleUpdateChannel}
        saveButtonText="Save Changes"
      />
    </div>
  );
};

export default AdminCommunity;
