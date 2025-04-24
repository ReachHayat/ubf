
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

    // Parse social links from JSON safely
    let socialLinks = { linkedin: '', twitter: '', website: '' };
    
    // Check if social_links is a valid object first
    if (data.social_links && typeof data.social_links === 'object' && !Array.isArray(data.social_links)) {
      const links = data.social_links as Record<string, any>;
      socialLinks = {
        linkedin: typeof links.linkedin === 'string' ? links.linkedin : '',
        twitter: typeof links.twitter === 'string' ? links.twitter : '',
        website: typeof links.website === 'string' ? links.website : '',
      };
    }

    return {
      ...data,
      social_links: socialLinks
    };
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

    // Transform all profiles to ensure the correct social_links structure
    return (data || []).map(profile => {
      // Parse social links from JSON safely
      let socialLinks = { linkedin: '', twitter: '', website: '' };
      
      // Check if social_links is a valid object first
      if (profile.social_links && typeof profile.social_links === 'object' && !Array.isArray(profile.social_links)) {
        const links = profile.social_links as Record<string, any>;
        socialLinks = {
          linkedin: typeof links.linkedin === 'string' ? links.linkedin : '',
          twitter: typeof links.twitter === 'string' ? links.twitter : '',
          website: typeof links.website === 'string' ? links.website : '',
        };
      }
      
      return {
        ...profile,
        social_links: socialLinks
      };
    });
  }
};
