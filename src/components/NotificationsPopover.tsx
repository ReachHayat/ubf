
import { useState } from "react";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from "@/components/ui/popover";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type Notification = {
  id: number;
  title: string;
  description: string;
  time: string;
  read: boolean;
  avatar?: string;
  type: "system" | "course" | "assignment" | "message";
};

const mockNotifications: Notification[] = [
  {
    id: 1,
    title: "New Course Available",
    description: "Figma Masterclass is now available. Start learning today!",
    time: "Just now",
    read: false,
    type: "course"
  },
  {
    id: 2,
    title: "Assignment Due Soon",
    description: "Your Angular Authentication assignment is due in 2 days.",
    time: "1 hour ago",
    read: false,
    type: "assignment"
  },
  {
    id: 3,
    title: "Crystal Lucas sent you a message",
    description: "I've shared some feedback on your latest design project.",
    time: "3 hours ago",
    read: true,
    avatar: "CL",
    type: "message"
  },
  {
    id: 4,
    title: "You unlocked a new achievement!",
    description: "Perfect Score: Complete an assignment with 100% accuracy.",
    time: "Yesterday",
    read: true,
    type: "system"
  }
];

const NotificationsPopover = () => {
  const [notifications, setNotifications] = useState(mockNotifications);
  const unreadCount = notifications.filter(n => !n.read).length;

  const handleMarkAsRead = (id: number) => {
    setNotifications(notifications.map(n => 
      n.id === id ? {...n, read: true} : n
    ));
  };

  const handleMarkAllAsRead = () => {
    setNotifications(notifications.map(n => ({...n, read: true})));
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs">
              {unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-80 p-0">
        <div className="flex items-center justify-between p-4 border-b">
          <h4 className="font-medium">Notifications</h4>
          {unreadCount > 0 && (
            <Button variant="ghost" size="sm" className="text-xs h-8" onClick={handleMarkAllAsRead}>
              Mark all as read
            </Button>
          )}
        </div>
        <div className="max-h-80 overflow-y-auto">
          {notifications.length > 0 ? (
            <div>
              {notifications.map((notification) => (
                <div 
                  key={notification.id} 
                  className={cn(
                    "flex gap-3 p-4 border-b cursor-pointer hover:bg-accent/50 transition-colors",
                    !notification.read && "bg-accent/20"
                  )}
                  onClick={() => handleMarkAsRead(notification.id)}
                >
                  <div className="relative">
                    {notification.avatar ? (
                      <Avatar className="h-9 w-9">
                        <AvatarFallback>{notification.avatar}</AvatarFallback>
                      </Avatar>
                    ) : (
                      <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center">
                        {notification.type === "course" && "📚"}
                        {notification.type === "assignment" && "📝"}
                        {notification.type === "system" && "🔔"}
                      </div>
                    )}
                    {!notification.read && (
                      <span className="absolute -top-1 -right-1 w-3 h-3 bg-primary rounded-full" />
                    )}
                  </div>
                  <div className="space-y-1">
                    <p className={cn("text-sm", !notification.read && "font-medium")}>
                      {notification.title}
                    </p>
                    <p className="text-xs text-muted-foreground">{notification.description}</p>
                    <p className="text-xs text-muted-foreground">{notification.time}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-8 text-center">
              <p className="text-muted-foreground">No notifications</p>
            </div>
          )}
        </div>
        <div className="p-2 border-t">
          <Button variant="outline" className="w-full text-sm h-9">
            View all notifications
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default NotificationsPopover;
