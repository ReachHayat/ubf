
import { useState } from "react";
import { Routes, Route, Link, useLocation } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Users, 
  BookOpen, 
  FileText, 
  MessageSquare, 
  Settings as SettingsIcon,
  Home, 
  Bell,
  BarChart
} from "lucide-react";
import { Button } from "@/components/ui/button";

// Admin sub-pages
import AdminDashboard from "./admin/AdminDashboard";
import AdminUsers from "./admin/AdminUsers";
import AdminCourses from "./admin/AdminCourses";
import AdminAssignments from "./admin/AdminAssignments";
import AdminCommunity from "./admin/AdminCommunity";
import AdminSettings from "./admin/AdminSettings";

const Admin = () => {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState("dashboard");

  const menuItems = [
    { icon: Home, label: "Dashboard", path: "/admin", id: "dashboard" },
    { icon: Users, label: "Users", path: "/admin/users", id: "users" },
    { icon: BookOpen, label: "Courses", path: "/admin/courses", id: "courses" },
    { icon: FileText, label: "Assignments", path: "/admin/assignments", id: "assignments" },
    { icon: MessageSquare, label: "Community", path: "/admin/community", id: "community" },
    { icon: SettingsIcon, label: "Settings", path: "/admin/settings", id: "settings" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-4xl font-bold">Admin Panel</h1>
        <p className="text-muted-foreground">Manage your Ultimate Brand Framework platform</p>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Administration</CardTitle>
          <CardDescription>
            Manage all aspects of The Ultimate Brand Framework platform
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs 
            defaultValue="dashboard" 
            value={activeTab}
            onValueChange={(value) => setActiveTab(value)}
            className="w-full"
          >
            <TabsList className="grid grid-cols-3 md:grid-cols-6 gap-2 mb-6">
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
            
            <div className="mt-4">
              <Routes>
                <Route path="/" element={<AdminDashboard />} />
                <Route path="/users" element={<AdminUsers />} />
                <Route path="/courses" element={<AdminCourses />} />
                <Route path="/assignments" element={<AdminAssignments />} />
                <Route path="/community" element={<AdminCommunity />} />
                <Route path="/settings" element={<AdminSettings />} />
              </Routes>
            </div>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default Admin;
