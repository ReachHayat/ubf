
import { 
  LayoutDashboard, 
  BookOpen, 
  FileCheck, 
  Users, 
  User, 
  Settings, 
  BookText,
  Medal
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Link, useLocation } from "react-router-dom";

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/" },
  { icon: BookOpen, label: "Courses", path: "/courses" },
  { icon: BookText, label: "Lessons", path: "/lessons" },
  { icon: FileCheck, label: "Assignments", path: "/assignments" },
  { icon: Medal, label: "Achievements", path: "/achievements" },
  { icon: Users, label: "Community", path: "/community" },
  { icon: User, label: "Profile", path: "/profile" },
  { icon: Settings, label: "Settings", path: "/settings" },
];

const Sidebar = () => {
  const location = useLocation();

  return (
    <div className="fixed left-0 top-0 h-full w-64 bg-background border-r">
      <div className="flex flex-col h-full">
        <div className="p-6">
          <Link to="/" className="flex items-center gap-2">
            <div className="bg-primary text-primary-foreground p-1.5 rounded-lg">
              <BookOpen className="h-5 w-5" />
            </div>
            <h2 className="text-2xl font-bold">CodeLingo</h2>
          </Link>
        </div>
        
        <nav className="flex-1 px-4">
          <ul className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              
              return (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className={cn(
                      "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200",
                      "hover:bg-accent/50",
                      isActive 
                        ? "bg-accent text-accent-foreground" 
                        : "text-muted-foreground"
                    )}
                  >
                    <Icon className="h-5 w-5" />
                    <span>{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="p-4 mt-auto">
          <div className="flex items-center gap-3 px-4 py-3">
            <User className="h-8 w-8 rounded-full bg-accent p-1" />
            <div className="flex flex-col">
              <span className="text-sm font-medium">John Doe</span>
              <span className="text-xs text-muted-foreground">Pro Member</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
