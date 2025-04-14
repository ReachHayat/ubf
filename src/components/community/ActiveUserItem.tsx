
import React from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ActiveUser } from "@/hooks/useCommunity";

interface ActiveUserItemProps {
  user: ActiveUser;
  getInitials: (name: string) => string;
}

export const ActiveUserItem: React.FC<ActiveUserItemProps> = ({ user, getInitials }) => {
  return (
    <div className="flex items-center gap-3">
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
  );
};
