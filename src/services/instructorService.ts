
import { supabase } from "@/integrations/supabase/client";

export interface InstructorProfile {
  id: string;
  user_id: string;
  bio: string;
  expertise: string[];
  education: string[];
  website: string | null;
  social_links: {
    linkedin?: string;
    twitter?: string;
    website?: string;
  };
  created_at: string;
  updated_at: string;
}

export const instructorService = {
  getInstructorProfile: async (userId: string): Promise<InstructorProfile | null> => {
    const { data, error } = await supabase
      .from('instructor_profiles')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error) {
      console.error('Error fetching instructor profile:', error);
      return null;
    }

    return data;
  },

  updateInstructorProfile: async (userId: string, profile: Partial<InstructorProfile>): Promise<boolean> => {
    const { error } = await supabase
      .from('instructor_profiles')
      .upsert({
        user_id: userId,
        ...profile,
        updated_at: new Date().toISOString()
      });

    if (error) {
      console.error('Error updating instructor profile:', error);
      return false;
    }

    return true;
  },

  getAllInstructors: async (): Promise<InstructorProfile[]> => {
    const { data, error } = await supabase
      .from('instructor_profiles')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching instructors:', error);
      return [];
    }

    return data || [];
  }
};
