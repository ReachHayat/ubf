
import React from "react";
import { cn } from "@/lib/utils";
import Sidebar from "@/components/Sidebar";
import { useState } from "react";

interface AppLayoutProps {
  children: React.ReactNode;
}

export const AppLayout = ({ children }: AppLayoutProps) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  
  return (
    <div className="min-h-screen flex">
      <Sidebar 
        collapsed={sidebarCollapsed} 
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} 
      />
      
      <div className={cn(
        "flex-1 transition-all duration-300",
        sidebarCollapsed ? "ml-16" : "ml-64"
      )}>
        <div className="container py-6 max-w-7xl">
          {children}
        </div>
      </div>
    </div>
  );
};
