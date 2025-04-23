
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
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, newSession) => {
        console.log("Auth state changed:", event, newSession?.user?.id);
        setSession(newSession);
        
        if (newSession?.user) {
          const enhancedUser: UserWithRoles = {
            ...newSession.user,
            fullName: newSession.user.user_metadata?.full_name || '',
            roles: [] // Initialize with empty roles array
          };
          setUser(enhancedUser);
          
          // Use setTimeout to prevent potential deadlock with Supabase client
          setTimeout(() => {
            fetchUserRoles(newSession.user.id, enhancedUser)
              .then(userRoles => {
                if (userRoles.length > 0) {
                  setUser(prev => {
                    if (!prev) return null;
                    return { ...prev, roles: userRoles };
                  });
                }
                // Ensure loading state is turned off after roles are fetched
                setIsLoading(false);
              });
          }, 0);
        } else {
          setUser(null);
          setIsLoading(false);
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(async ({ data: { session: currentSession } }) => {
      console.log("Getting initial session:", currentSession?.user?.id);
      setSession(currentSession);
      
      if (currentSession?.user) {
        const enhancedUser: UserWithRoles = {
          ...currentSession.user,
          fullName: currentSession.user.user_metadata?.full_name || '',
          roles: [] // Initialize with empty roles array
        };
        setUser(enhancedUser);
        
        try {
          await fetchUserRoles(currentSession.user.id, enhancedUser);
        } catch (error) {
          console.error("Error fetching user roles:", error);
        } finally {
          setIsLoading(false);
        }
      } else {
        setUser(null);
        setIsLoading(false);
      }
    }).catch(error => {
      console.error("Error getting session:", error);
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
