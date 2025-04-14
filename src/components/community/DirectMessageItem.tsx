
import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { DirectMessage } from "@/hooks/useCommunity";

interface DirectMessageItemProps {
  dm: DirectMessage;
  isActive: boolean;
  onSelect: (dm: DirectMessage) => void;
  getInitials: (name: string) => string;
}

export const DirectMessageItem: React.FC<DirectMessageItemProps> = ({ 
  dm, 
  isActive, 
  onSelect, 
  getInitials 
}) => {
  return (
    <Button
      key={dm.id}
      variant={isActive ? "secondary" : "ghost"}
      className="w-full justify-start text-sm h-9"
      onClick={() => onSelect(dm)}
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
  );
};
