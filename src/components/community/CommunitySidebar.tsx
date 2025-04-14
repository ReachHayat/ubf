
import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Hash, User, Settings as SettingsIcon, PlusCircle } from "lucide-react";
import { ChannelItem } from "./ChannelItem";
import { DirectMessageItem } from "./DirectMessageItem";
import { Channel, DirectMessage } from "@/hooks/useCommunity";

interface CommunitySidebarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  channels: Channel[];
  activeChannel: Channel | null;
  setActiveChannel: (channel: Channel) => void;
  directMessages: DirectMessage[];
  activeDM: DirectMessage | null;
  setActiveDM: (dm: DirectMessage) => void;
  isAdmin: boolean;
  loading: { channels: boolean };
  onNewChannel: () => void;
  onEditChannel: (channel: Channel) => void;
  onDeleteChannel: (channelId: string) => void;
  getInitials: (name: string) => string;
}

export const CommunitySidebar: React.FC<CommunitySidebarProps> = ({
  searchQuery,
  setSearchQuery,
  channels,
  activeChannel,
  setActiveChannel,
  directMessages,
  activeDM,
  setActiveDM,
  isAdmin,
  loading,
  onNewChannel,
  onEditChannel,
  onDeleteChannel,
  getInitials,
}) => {
  const filteredChannels = channels.filter(channel => 
    channel.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
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
                onClick={onNewChannel}
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
                <ChannelItem
                  key={channel.id}
                  channel={channel}
                  isActive={activeChannel?.id === channel.id}
                  isAdmin={isAdmin()}
                  onSelect={setActiveChannel}
                  onEdit={onEditChannel}
                  onDelete={onDeleteChannel}
                />
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
              <DirectMessageItem
                key={dm.id}
                dm={dm}
                isActive={activeDM?.id === dm.id}
                onSelect={setActiveDM}
                getInitials={getInitials}
              />
            )) : (
              <div className="flex justify-center py-4">
                <p className="text-sm text-muted-foreground">No direct messages</p>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </Card>
  );
};
