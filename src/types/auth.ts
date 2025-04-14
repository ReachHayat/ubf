
import { Session, User } from "@supabase/supabase-js";

export type UserRole = "admin" | "tutor" | "student";

export interface UserWithRoles extends User {
  roles?: UserRole[];
  fullName?: string;
}

export interface AuthContextType {
  session: Session | null;
  user: UserWithRoles | null;
  roles: UserRole[];
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, fullName: string) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updatePassword: (password: string) => Promise<void>;
  isAdmin: () => boolean;
  isTutor: () => boolean;
  updateUserProfile: (data: { full_name?: string }) => Promise<void>;
}
