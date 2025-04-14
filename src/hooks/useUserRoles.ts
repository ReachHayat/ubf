
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
        return;
      }

      if (data && data.roles) {
        let userRoles = data.roles as UserRole[];
        if (isAdminData === true && !userRoles.includes('admin')) {
          userRoles.push('admin');
        }
        
        setRoles(userRoles);
        return userRoles;
      } else if (isAdminData === true) {
        setRoles(['admin']);
        return ['admin'];
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
