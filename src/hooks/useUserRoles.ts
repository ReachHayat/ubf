
import { useState } from "react";
import { UserRole, UserWithRoles } from "@/types/auth";
import { supabase } from "@/integrations/supabase/client";

export const useUserRoles = () => {
  const [roles, setRoles] = useState<UserRole[]>([]);

  const fetchUserRoles = async (userId: string, user: UserWithRoles | null) => {
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
        return [];
      }

      if (data && data.roles) {
        // Convert string array to UserRole array
        let userRoles = (data.roles as string[]).filter(role => 
          role === 'admin' || role === 'tutor' || role === 'student'
        ) as UserRole[];
        
        if (isAdminData === true && !userRoles.includes('admin')) {
          userRoles.push('admin');
        }
        
        setRoles(userRoles);
        return userRoles;
      } else if (isAdminData === true) {
        const adminRole: UserRole[] = ['admin'];
        setRoles(adminRole);
        return adminRole;
      }
      
      return [];
    } catch (error) {
      console.error("Error in fetchUserRoles:", error);
      return [];
    }
  };

  return {
    roles,
    fetchUserRoles,
  };
};
