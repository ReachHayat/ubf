import React, { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Session, User } from "@supabase/supabase-js";
import { toast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";

export type UserRole = "admin" | "tutor" | "student";

interface UserWithRoles extends User {
  roles?: UserRole[];
  fullName?: string;
}

interface AuthContextType {
  session: Session | null;
  user: UserWithRoles | null;
  roles: UserRole[];
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, fullName: string) => Promise<void>;
  signOut: () => Promise<void>;
  isAdmin: () => boolean;
  isTutor: () => boolean;
  updateUserProfile: (data: { full_name?: string }) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<UserWithRoles | null>(null);
  const [roles, setRoles] = useState<UserRole[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, newSession) => {
        console.log("Auth state changed:", event, newSession?.user?.id);
        setSession(newSession);
        
        if (newSession?.user) {
          const enhancedUser = {
            ...newSession.user,
            fullName: newSession.user.user_metadata?.full_name || ''
          };
          setUser(enhancedUser);
          fetchUserRoles(newSession.user.id);
        } else {
          setUser(null);
          setRoles([]);
        }
      }
    );

    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      console.log("Getting initial session:", currentSession?.user?.id);
      setSession(currentSession);
      
      if (currentSession?.user) {
        const enhancedUser = {
          ...currentSession.user,
          fullName: currentSession.user.user_metadata?.full_name || ''
        };
        setUser(enhancedUser);
        fetchUserRoles(currentSession.user.id);
      } else {
        setUser(null);
      }
      setIsLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const fetchUserRoles = async (userId: string) => {
    try {
      const { data: isAdminData, error: isAdminError } = await supabase.rpc('is_admin', { user_id: userId });
      
      if (isAdminError) {
        console.error("Error checking admin status:", isAdminError);
      }
      
      const { data, error } = await supabase
        .from('users_with_roles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error("Error fetching user roles:", error);
        return;
      }

      if (data && data.roles) {
        let userRoles = data.roles as UserRole[];
        if (isAdminData === true && !userRoles.includes('admin')) {
          userRoles.push('admin');
        }
        
        setRoles(userRoles);
        
        if (user) {
          setUser({
            ...user,
            roles: userRoles,
            fullName: data.full_name || user.user_metadata?.full_name || ''
          });
        }
      } else if (isAdminData === true) {
        setRoles(['admin']);
        
        if (user) {
          setUser({
            ...user,
            roles: ['admin'],
            fullName: user.user_metadata?.full_name || ''
          });
        }
      }
    } catch (error) {
      console.error("Error in fetchUserRoles:", error);
    }
  };

  const updateUserProfile = async (data: { full_name?: string }) => {
    if (!user) return;
    
    try {
      const { error } = await supabase.auth.updateUser({
        data: data
      });

      if (error) {
        toast({
          title: "Profile update failed",
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      setUser(prev => {
        if (!prev) return null;
        
        return {
          ...prev,
          fullName: data.full_name || prev.fullName,
          user_metadata: {
            ...prev.user_metadata,
            full_name: data.full_name || prev.user_metadata?.full_name
          }
        };
      });

      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      });
    } catch (error) {
      console.error("Profile update error:", error);
      toast({
        title: "Profile update failed",
        description: "An unexpected error occurred.",
        variant: "destructive",
      });
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        toast({
          title: "Sign in failed",
          description: error.message,
          variant: "destructive",
        });
        throw error;
      }

      toast({
        title: "Signed in successfully",
        description: "Welcome back!",
      });
      navigate("/");
    } catch (error) {
      console.error("Sign in error:", error);
      toast({
        title: "Sign in failed",
        description: "An unexpected error occurred.",
        variant: "destructive",
      });
      throw error;
    }
  };

  const signUp = async (email: string, password: string, fullName: string) => {
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      });

      if (error) {
        toast({
          title: "Sign up failed",
          description: error.message,
          variant: "destructive",
        });
        throw error;
      }

      toast({
        title: "Sign up successful",
        description: "Please check your email to confirm your account.",
      });
      navigate("/auth");
    } catch (error) {
      console.error("Sign up error:", error);
      toast({
        title: "Sign up failed",
        description: "An unexpected error occurred.",
        variant: "destructive",
      });
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      toast({
        title: "Signed out successfully",
      });
      navigate("/auth");
    } catch (error) {
      console.error("Sign out error:", error);
      toast({
        title: "Sign out failed",
        description: "An unexpected error occurred.",
        variant: "destructive",
      });
    }
  };

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
