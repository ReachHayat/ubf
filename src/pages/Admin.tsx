
import { useState } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { TabsContent } from "@/components/ui/tabs";
import AdminLayout from "@/components/admin/AdminLayout";
import AdminMenu from "@/components/admin/AdminMenu";

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

  return (
    <AdminLayout 
      title="Admin Panel" 
      description="Manage your Ultimate Brand Framework platform"
      activeTab={activeTab}
    >
      <AdminMenu activeTab={activeTab} setActiveTab={setActiveTab} />
      
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
    </AdminLayout>
  );
};

export default Admin;
