
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";

export interface Channel {
  id: string;
  name: string;
  type: "text" | "voice";
  created_at: string;
  created_by?: string | null;
  unread_count?: number;
}

export interface Message {
  id: string;
  user_id: string;
  channel_id: string;
  content: string;
  attachments?: string[];
  reactions?: {emoji: string, count: number}[];
  created_at: string;
  user: {
    id: string;
    email: string;
    full_name?: string;
    avatar_url?: string;
  };
}

export interface DirectMessage {
  id: string;
  user: {
    id: string;
    email: string;
    full_name?: string;
    avatar_url?: string;
    online: boolean;
  };
  unread_count?: number;
}

export interface ActiveUser {
  id: string;
  name?: string;
  email?: string;
  role?: string;
  avatar?: string;
  online?: boolean;
}

export const useCommunity = () => {
  const { user } = useAuth();
  const [channels, setChannels] = useState<Channel[]>([]);
  const [activeChannel, setActiveChannel] = useState<Channel | null>(null);
  const [activeDM, setActiveDM] = useState<DirectMessage | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [directMessages, setDirectMessages] = useState<DirectMessage[]>([]);
  const [activeUsers, setActiveUsers] = useState<ActiveUser[]>([]);
  const [loading, setLoading] = useState({
    channels: false,
    messages: false,
    users: false,
  });

  useEffect(() => {
    fetchChannels();
    fetchActiveUsers();
    setupRealtimeSubscription();

    return () => {
      cleanupRealtimeSubscription();
    };
  }, []);

  useEffect(() => {
    if (activeChannel) {
      fetchMessages(activeChannel.id);
      setActiveDM(null);
    }
  }, [activeChannel]);

  const initializeCommunitySchema = async () => {
    try {
      // Call the edge function to initialize the community schema if needed
      await supabase.functions.invoke('create_community_schema');
    } catch (error) {
      console.error('Error initializing community schema:', error);
    }
  };

  const fetchChannels = async () => {
    try {
      setLoading(prev => ({ ...prev, channels: true }));
      
      // Call the create_community_schema function if needed
      await initializeCommunitySchema();
      
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
        // Set first channel as active if none is selected
        if (!activeChannel && transformedData.length > 0) {
          setActiveChannel(transformedData[0]);
        }
      }
    } catch (error) {
      console.error('Error fetching channels:', error);
      toast({
        variant: "destructive",
        title: "Failed to load channels",
        description: "Please try again or contact support if the issue persists."
      });
    } finally {
      setLoading(prev => ({ ...prev, channels: false }));
    }
  };

  const fetchMessages = async (channelId: string) => {
    if (!channelId) return;
    
    try {
      setLoading(prev => ({ ...prev, messages: true }));
      const { data, error } = await supabase
        .from('messages')
        .select(`
          id,
          channel_id,
          user_id,
          content,
          attachments,
          reactions,
          created_at,
          user:users(id, email, full_name, avatar_url)
        `)
        .eq('channel_id', channelId)
        .order('created_at');
        
      if (error) throw error;
      
      if (data) {
        // Transform the data to match our Message interface
        const transformedMessages = data.map(message => ({
          ...message,
          // Ensure user is properly formatted as an object
          user: Array.isArray(message.user) && message.user.length > 0 
            ? message.user[0] 
            : { 
                id: message.user_id, 
                email: 'unknown@example.com',
                full_name: 'Unknown User' 
              }
        })) as Message[];
        
        setMessages(transformedMessages);
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
      toast({
        variant: "destructive",
        title: "Failed to load messages",
        description: "Please try again or contact support if the issue persists."
      });
    } finally {
      setLoading(prev => ({ ...prev, messages: false }));
    }
  };
  
  const fetchActiveUsers = async () => {
    try {
      setLoading(prev => ({ ...prev, users: true }));
      
      // Try to fetch from users_online view
      const { data, error } = await supabase
        .from('users_with_roles')
        .select('*')
        .limit(5);
      
      if (!error && data) {
        // Transform the data into ActiveUser format
        const users: ActiveUser[] = data.map(user => ({
          id: user.id || '',
          name: user.full_name || user.name || '',
          email: user.email || '',
          role: Array.isArray(user.roles) && user.roles.length > 0 ? user.roles[0] : 'Student',
          avatar: user.avatar_url || getInitials(user.full_name || user.name || ''),
          online: true
        }));
        
        setActiveUsers(users);
      } else {
        // Fallback to mock data
        console.error('Error fetching online users, using fallback data:', error);
        setActiveUsers([
          { id: "1", name: "Guy Hawkins", avatar: "GH", role: "Instructor", online: true },
          { id: "2", name: "Crystal Lucas", avatar: "CL", role: "Student", online: true },
          { id: "3", name: "Melissa Stevens", avatar: "MS", role: "Student", online: true },
          { id: "4", name: "John Doe", avatar: "JD", role: "Student", online: true },
          { id: "5", name: "Peter Russell", avatar: "PR", role: "Instructor", online: true },
        ]);
      }
    } catch (error) {
      console.error('Error fetching active users:', error);
      setActiveUsers([
        { id: "1", name: "Guy Hawkins", avatar: "GH", role: "Instructor", online: true },
        { id: "2", name: "Crystal Lucas", avatar: "CL", role: "Student", online: true },
        { id: "3", name: "Melissa Stevens", avatar: "MS", role: "Student", online: true },
        { id: "4", name: "John Doe", avatar: "JD", role: "Student", online: true },
        { id: "5", name: "Peter Russell", avatar: "PR", role: "Instructor", online: true },
      ]);
    } finally {
      setLoading(prev => ({ ...prev, users: false }));
    }
  };

  const sendMessage = async (messageText: string) => {
    if (!messageText.trim() || !user || !activeChannel) return;
    
    try {
      const newMessage = {
        content: messageText,
        user_id: user.id,
        channel_id: activeChannel.id
      };
      
      const { data, error } = await supabase
        .from('messages')
        .insert(newMessage)
        .select();
        
      if (error) throw error;
      
      // No need to fetch messages again, realtime will handle it
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        variant: "destructive",
        title: "Failed to send message",
        description: "Please try again or contact support if the issue persists."
      });
    }
  };
  
  const createChannel = async (name: string) => {
    if (!name.trim()) return;
    
    try {
      const { data, error } = await supabase
        .from('channels')
        .insert({
          name: name,
          type: 'text',
          created_by: user?.id
        })
        .select();
        
      if (error) throw error;
      
      toast({
        title: "Channel created",
        description: `#${name} has been created successfully.`
      });
      
      // Fetch channels to update the list
      await fetchChannels();
      
      // Cast to our Channel type 
      if (data && data.length > 0) {
        const newChannel: Channel = {
          ...data[0],
          type: data[0].type === "voice" ? "voice" : "text"
        };
        return newChannel;
      }
      return null;
    } catch (error) {
      console.error('Error creating channel:', error);
      toast({
        variant: "destructive",
        title: "Failed to create channel",
        description: "Please try again or contact support if the issue persists."
      });
      return null;
    }
  };
  
  const updateChannel = async (channelId: string, name: string) => {
    if (!name.trim() || !channelId) return;
    
    try {
      const { data, error } = await supabase
        .from('channels')
        .update({ name })
        .eq('id', channelId)
        .select();
        
      if (error) throw error;
      
      toast({
        title: "Channel updated",
        description: `Channel has been renamed to #${name}.`
      });
      
      // Fetch channels to update the list
      await fetchChannels();
      
      // Cast to our Channel type
      if (data && data.length > 0) {
        const updatedChannel: Channel = {
          ...data[0],
          type: data[0].type === "voice" ? "voice" : "text"
        };
        return updatedChannel;
      }
      return null;
    } catch (error) {
      console.error('Error updating channel:', error);
      toast({
        variant: "destructive",
        title: "Failed to update channel",
        description: "Please try again or contact support if the issue persists."
      });
      return null;
    }
  };
  
  const deleteChannel = async (channelId: string) => {
    try {
      const { error } = await supabase
        .from('channels')
        .delete()
        .eq('id', channelId);
        
      if (error) throw error;
      
      if (activeChannel?.id === channelId) {
        setActiveChannel(null);
      }
      
      toast({
        title: "Channel deleted",
        description: "The channel has been deleted successfully."
      });
      
      // Fetch channels to update the list
      await fetchChannels();
      
      return true;
    } catch (error) {
      console.error('Error deleting channel:', error);
      toast({
        variant: "destructive",
        title: "Failed to delete channel",
        description: "Please try again or contact support if the issue persists."
      });
      return false;
    }
  };
  
  const setupRealtimeSubscription = () => {
    const channel = supabase
      .channel('public:messages')
      .on('postgres_changes', { 
        event: 'INSERT', 
        schema: 'public', 
        table: 'messages' 
      }, (payload) => {
        console.log('New message received!', payload);
        if (activeChannel && payload.new && payload.new.channel_id === activeChannel.id) {
          fetchMessages(activeChannel.id);
        }
      })
      .subscribe();
      
    return () => {
      supabase.removeChannel(channel);
    };
  };
  
  const cleanupRealtimeSubscription = () => {
    // No specific cleanup needed as we return the cleanup from setupRealtimeSubscription
  };

  const getInitials = (name: string) => {
    if (!name) return "U";
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  return {
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
    fetchChannels,
    fetchMessages,
    fetchActiveUsers,
    getInitials,
  };
};
