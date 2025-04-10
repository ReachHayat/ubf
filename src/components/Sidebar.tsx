import { 
  LayoutDashboard, 
  BookOpen, 
  FileCheck, 
  Users, 
  Settings,
  ChevronLeft,
  ChevronRight,
  Inbox,
  LogOut,
  ShieldCheck
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Link, useLocation } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/" },
  { icon: BookOpen, label: "Courses", path: "/courses" },
  { icon: FileCheck, label: "Assignments", path: "/assignments" },
  { icon: Users, label: "Community", path: "/community" },
  { icon: Inbox, label: "Inbox", path: "/inbox" },
  { icon: Settings, label: "Settings", path: "/settings" },
];

interface SidebarProps {
  collapsed?: boolean;
  onToggle?: () => void;
}

const Sidebar = ({ collapsed = false, onToggle }: SidebarProps) => {
  const location = useLocation();
  const { user, signOut, isAdmin, roles } = useAuth();
  
  if (!user) return null;

  const getInitials = () => {
    const name = user?.user_metadata?.full_name || 'User';
    return name
      .split(' ')
      .map((n: string) => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <div 
      className={cn(
        "fixed left-0 top-0 h-full border-r bg-background transition-all duration-300",
        collapsed ? "w-16" : "w-64"
      )}
    >
      <div className="flex flex-col h-full">
        <div className={cn("p-4 flex items-center", collapsed ? "justify-center" : "justify-between")}>
          {!collapsed && (
            <Link to="/" className="flex items-center gap-2">
              <div className="bg-primary text-primary-foreground p-1.5 rounded-lg">
                <BookOpen className="h-5 w-5" />
              </div>
              <h2 className="text-xl font-bold">UBF</h2>
            </Link>
          )}
          {collapsed && (
            <Link to="/" className="flex items-center justify-center">
              <div className="bg-primary text-primary-foreground p-1.5 rounded-lg">
                <BookOpen className="h-5 w-5" />
              </div>
            </Link>
          )}
          <Button 
            variant="ghost" 
            size="icon"
            onClick={onToggle}
            className={collapsed ? "mx-auto" : "ml-auto"}
          >
            {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </Button>
        </div>
        
        <nav className="flex-1 px-2 py-4 overflow-y-auto">
          <ul className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path || 
                              (item.path !== "/" && location.pathname.startsWith(item.path));
              
              return (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className={cn(
                      "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200",
                      "hover:bg-accent/50",
                      isActive 
                        ? "bg-accent text-accent-foreground" 
                        : "text-muted-foreground",
                      collapsed && "justify-center px-2"
                    )}
                  >
                    <Icon className="h-5 w-5" />
                    {!collapsed && <span>{item.label}</span>}
                  </Link>
                </li>
              );
            })}
            
            {isAdmin() && (
              <li>
                <Link
                  to="/admin"
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200",
                    "hover:bg-accent/50",
                    location.pathname.startsWith("/admin")
                      ? "bg-accent text-accent-foreground" 
                      : "text-muted-foreground",
                    collapsed && "justify-center px-2"
                  )}
                >
                  <ShieldCheck className="h-5 w-5" />
                  {!collapsed && <span>Admin</span>}
                </Link>
              </li>
            )}
          </ul>
        </nav>

        <div className={cn("p-4 mt-auto border-t", collapsed ? "text-center" : "")}>
          {collapsed ? (
            <div className="flex justify-center">
              <Link to="/profile">
                <Avatar className="h-10 w-10 cursor-pointer">
                  <AvatarFallback>{getInitials()}</AvatarFallback>
                </Avatar>
              </Link>
            </div>
          ) : (
            <div>
              <Link to="/profile" className="block">
                <div className="flex items-center gap-3 px-4 py-3">
                  <Avatar className="h-10 w-10 cursor-pointer">
                    <AvatarFallback>{getInitials()}</AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium">
                      {user?.user_metadata?.full_name || 'User'}
                    </span>
                    <span className="text-xs text-muted-foreground capitalize">
                      {roles[0] || "Student"}
                    </span>
                  </div>
                </div>
              </Link>
              <Button 
                variant="ghost" 
                className="w-full mt-2 text-muted-foreground justify-start"
                onClick={signOut}
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
