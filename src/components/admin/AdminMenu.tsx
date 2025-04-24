
import { Link } from "react-router-dom";
import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Users, 
  BookOpen, 
  FileText, 
  Settings as SettingsIcon,
  LayoutDashboard
} from "lucide-react";

interface AdminMenuProps {
  activeTab: string;
  setActiveTab: (value: string) => void;
}

const AdminMenu = ({ activeTab, setActiveTab }: AdminMenuProps) => {
  const menuItems = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/admin", id: "dashboard" },
    { icon: Users, label: "Users", path: "/admin/users", id: "users" },
    { icon: BookOpen, label: "Courses", path: "/admin/courses", id: "courses" },
    { icon: FileText, label: "Assignments", path: "/admin/assignments", id: "assignments" },
    { icon: SettingsIcon, label: "Settings", path: "/admin/settings", id: "settings" },
  ];

  return (
    <TabsList className="grid grid-cols-3 md:grid-cols-5 gap-2 mb-6">
      {menuItems.map((item) => (
        <Link key={item.id} to={item.path} className="w-full">
          <TabsTrigger 
            value={item.id}
            className="w-full"
            onClick={() => setActiveTab(item.id)}
          >
            <div className="flex items-center space-x-2">
              <item.icon className="h-4 w-4" />
              <span className="hidden md:inline">{item.label}</span>
            </div>
          </TabsTrigger>
        </Link>
      ))}
    </TabsList>
  );
};

export default AdminMenu;
