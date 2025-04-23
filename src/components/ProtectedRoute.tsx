
import React, { useState, useEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2 } from "lucide-react";

interface ProtectedRouteProps {
  requiredRole?: "admin" | "tutor";
  redirectTo?: string;
}

const ProtectedRoute = ({ 
  requiredRole, 
  redirectTo = "/auth" 
}: ProtectedRouteProps) => {
  const { user, isLoading, roles } = useAuth();
  const [localLoading, setLocalLoading] = useState(true);
  
  // Add a timeout to prevent infinite loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setLocalLoading(false);
    }, 5000);  // 5 seconds timeout
    
    if (!isLoading) {
      setLocalLoading(false);
      clearTimeout(timer);
    }
    
    return () => clearTimeout(timer);
  }, [isLoading]);

  if (isLoading || localLoading) {
    return (
      <div className="h-screen flex flex-col items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
        <p className="text-sm text-muted-foreground">Loading your profile...</p>
      </div>
    );
  }

  // If not authenticated, redirect to login
  if (!user) {
    return <Navigate to={redirectTo} replace />;
  }

  // If role is required and user doesn't have it
  if (requiredRole && !roles.includes(requiredRole)) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
