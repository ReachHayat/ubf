
import React, { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Session, User } from "@supabase/supabase-js";
import { toast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";

export type UserRole = "admin" | "tutor" | "student";

interface UserWithRoles extends User {
  roles?: UserRole[];
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
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, newSession) => {
        setSession(newSession);
        setUser(newSession?.user ?? null);
        
        if (newSession?.user) {
          fetchUserRoles(newSession.user.id);
        } else {
          setRoles([]);
        }
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      
      if (currentSession?.user) {
        fetchUserRoles(currentSession.user.id);
      }
      setIsLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const fetchUserRoles = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("users_with_roles")
        .select("roles")
        .eq("id", userId)
        .single();

      if (error) {
        console.error("Error fetching user roles:", error);
        return;
      }

      if (data && data.roles) {
        setRoles(data.roles as UserRole[]);
        
        if (user) {
          setUser({
            ...user,
            roles: data.roles as UserRole[]
          });
        }
      }
    } catch (error) {
      console.error("Error in fetchUserRoles:", error);
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
        return;
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
        return;
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
