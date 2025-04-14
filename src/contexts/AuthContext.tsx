
import React, { createContext, useContext, useState, useEffect } from "react";
import { Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { AuthContextType, UserWithRoles, UserRole } from "@/types/auth";
import { useUserRoles } from "@/hooks/useUserRoles";
import { useAuthActions } from "@/hooks/useAuthActions";
import { usePasswordManagement } from "@/hooks/usePasswordManagement";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<UserWithRoles | null>(null);
  const { roles, fetchUserRoles } = useUserRoles();
  const { isLoading, setIsLoading, signIn, signUp, signOut, updateUserProfile } = useAuthActions(setUser);
  const { resetPassword, updatePassword } = usePasswordManagement();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, newSession) => {
        console.log("Auth state changed:", event, newSession?.user?.id);
        setSession(newSession);
        
        if (newSession?.user) {
          const enhancedUser = {
            ...newSession.user,
            fullName: newSession.user.user_metadata?.full_name || ''
          };
          setUser(enhancedUser);
          const userRoles = await fetchUserRoles(newSession.user.id, enhancedUser);
          if (user) {
            setUser(prev => prev ? { ...prev, roles: userRoles } : null);
          }
        } else {
          setUser(null);
        }
      }
    );

    supabase.auth.getSession().then(async ({ data: { session: currentSession } }) => {
      console.log("Getting initial session:", currentSession?.user?.id);
      setSession(currentSession);
      
      if (currentSession?.user) {
        const enhancedUser = {
          ...currentSession.user,
          fullName: currentSession.user.user_metadata?.full_name || ''
        };
        setUser(enhancedUser);
        await fetchUserRoles(currentSession.user.id, enhancedUser);
      } else {
        setUser(null);
      }
      setIsLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const isAdmin = () => roles.includes("admin");
  const isTutor = () => roles.includes("tutor");

  return (
    <AuthContext.Provider
      value={{
        session,
        user,
        roles,
        isLoading,
        signIn,
        signUp,
        signOut,
        resetPassword,
        updatePassword,
        isAdmin,
        isTutor,
        updateUserProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
