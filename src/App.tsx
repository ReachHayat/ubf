
import { useEffect, useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/theme-provider";
import Sidebar from "@/components/Sidebar";
import Dashboard from "./pages/Dashboard";
import Courses from "./pages/Courses";
import Assignments from "./pages/Assignments";
import Community from "./pages/Community";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import Inbox from "./pages/Inbox";
import Admin from "./pages/Admin";

const queryClient = new QueryClient();

const App = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  useEffect(() => {
    // Set document title
    document.title = "The Ultimate Brand Framework";
    
    const mainContent = document.getElementById("main-content");
    if (mainContent) {
      if (sidebarCollapsed) {
        mainContent.classList.remove("ml-64");
        mainContent.classList.add("ml-16");
      } else {
        mainContent.classList.remove("ml-16");
        mainContent.classList.add("ml-64");
      }
    }

    const handleResize = () => {
      if (window.innerWidth < 768 && !sidebarCollapsed) {
        setSidebarCollapsed(true);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [sidebarCollapsed]);

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light" storageKey="ubf-theme">
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <div className="flex min-h-screen bg-background">
              <Sidebar onToggle={toggleSidebar} collapsed={sidebarCollapsed} />
              <main className="flex-1 ml-64 p-8 transition-all duration-300" id="main-content">
                <div className="max-w-7xl mx-auto">
                  <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/courses/*" element={<Courses />} />
                    <Route path="/assignments" element={<Assignments />} />
                    <Route path="/community" element={<Community />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/settings" element={<Settings />} />
                    <Route path="/inbox" element={<Inbox />} />
                    <Route path="/admin/*" element={<Admin />} />
                  </Routes>
                </div>
              </main>
            </div>
          </BrowserRouter>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
