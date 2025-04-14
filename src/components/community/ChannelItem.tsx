
import React from "react";
import { Hash, MoreVertical, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Channel } from "@/hooks/useCommunity";

interface ChannelItemProps {
  channel: Channel;
  isActive: boolean;
  isAdmin: boolean;
  onSelect: (channel: Channel) => void;
  onEdit: (channel: Channel) => void;
  onDelete: (channelId: string) => void;
}

export const ChannelItem: React.FC<ChannelItemProps> = ({ 
  channel, 
  isActive, 
  isAdmin, 
  onSelect, 
  onEdit, 
  onDelete 
}) => {
  return (
    <div key={channel.id} className="flex items-center gap-1">
      <Button
        variant={isActive ? "secondary" : "ghost"}
        className="w-full justify-start text-sm h-9 mr-1"
        onClick={() => onSelect(channel)}
      >
        <Hash className="h-4 w-4 mr-2" />
        <span className="truncate">{channel.name}</span>
        {channel.unread_count && channel.unread_count > 0 && (
          <Badge variant="destructive" className="ml-auto">
            {channel.unread_count}
          </Badge>
        )}
      </Button>
      
      {isAdmin && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onEdit(channel)}>
              <Edit className="h-4 w-4 mr-2" />
              Edit Channel
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onDelete(channel.id)}>
              <Trash2 className="h-4 w-4 mr-2" />
              Delete Channel
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
};
