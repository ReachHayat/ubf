
import React from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ActiveUserItem } from "./ActiveUserItem";
import { ActiveUser } from "@/hooks/useCommunity";

interface ActiveUsersListProps {
  activeUsers: ActiveUser[];
  loading: { users: boolean };
  getInitials: (name: string) => string;
}

export const ActiveUsersList: React.FC<ActiveUsersListProps> = ({ 
  activeUsers, 
  loading, 
  getInitials 
}) => {
  return (
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
            <ActiveUserItem 
              key={user.id} 
              user={user} 
              getInitials={getInitials} 
            />
          ))
        ) : (
          <div className="flex justify-center py-4">
            <p className="text-sm text-muted-foreground">No active users</p>
          </div>
        )}
      </div>
    </Card>
  );
};
