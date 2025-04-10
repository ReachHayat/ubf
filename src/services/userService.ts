
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

export interface User {
  id: string;
  name?: string;
  email?: string;
  full_name?: string;
  roles: string[];
  created_at: string;
  last_login?: string;
  status: "active" | "inactive";
}

export const fetchUsers = async (): Promise<User[]> => {
  try {
    const { data, error } = await supabase
      .from('users_with_roles')
      .select('*');

    if (error) {
      throw error;
    }

    if (data) {
      return data.map((user: any) => ({
        id: user.id,
        name: user.name || user.full_name || 'Unknown',
        email: user.email || '',
        full_name: user.full_name || '',
        roles: user.roles || ['student'],
        created_at: new Date().toISOString(),
        status: 'active',
      }));
    }
    
    return [];
  } catch (error) {
    console.error('Error fetching users:', error);
    toast({
      title: "Failed to load users",
      description: "There was an error loading the users. Please try again.",
      variant: "destructive",
    });
    return [];
  }
};

export const updateUserRole = async (userId: string, role: "admin" | "tutor" | "student"): Promise<boolean> => {
  try {
    // First delete existing roles
    const { error: deleteError } = await supabase
      .from('user_roles')
      .delete()
      .eq('user_id', userId);

    if (deleteError) {
      throw deleteError;
    }

    // Then insert the new role
    const { error: insertError } = await supabase
      .from('user_roles')
      .insert({
        user_id: userId,
        role: role as any
      });

    if (insertError) {
      throw insertError;
    }
    
    return true;
  } catch (error) {
    console.error('Error updating user role:', error);
    toast({
      title: "Failed to update user",
      description: "There was an error updating the user's role. Please try again.",
      variant: "destructive",
    });
    return false;
  }
};
