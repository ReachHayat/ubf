import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

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
  avatar_url?: string;
  title?: string;
  specialization?: string[];
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
      social_links: socialLinks,
      // Ensure expertise and education are arrays
      expertise: Array.isArray(data.expertise) ? data.expertise : [],
      education: Array.isArray(data.education) ? data.education : []
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
  },

  createOrUpdateInstructorProfile: async (profileData: Partial<InstructorProfile>): Promise<InstructorProfile | null> => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "You must be logged in to update your profile",
        variant: "destructive"
      });
      return null;
    }

    // Ensure social_links is properly formatted as an object
    const socialLinks = profileData.social_links || { linkedin: '', twitter: '', website: '' };

    const { data, error } = await supabase
      .from('instructor_profiles')
      .upsert({
        user_id: user.id,
        ...profileData,
        social_links: socialLinks,
        updated_at: new Date().toISOString()
      })
      .select('*')
      .single();

    if (error) {
      console.error('Error updating instructor profile:', error);
      toast({
        title: "Profile Update Failed",
        description: error.message,
        variant: "destructive"
      });
      return null;
    }

    toast({
      title: "Profile Updated",
      description: "Your instructor profile has been successfully updated",
    });

    // Ensure we format the returned data correctly
    return {
      ...data,
      social_links: typeof data.social_links === 'object' ? 
        data.social_links as InstructorProfile['social_links'] : 
        { linkedin: '', twitter: '', website: '' },
      expertise: Array.isArray(data.expertise) ? data.expertise : [],
      education: Array.isArray(data.education) ? data.education : []
    };
  },

  uploadAvatarImage: async (file: File): Promise<string | null> => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const fileExt = file.name.split('.').pop();
    const fileName = `${user.id}/avatar.${fileExt}`;
    const filePath = `${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(filePath, file, {
        upsert: true
      });

    if (uploadError) {
      console.error('Error uploading avatar:', uploadError);
      toast({
        title: "Upload Failed",
        description: "Could not upload avatar image",
        variant: "destructive"
      });
      return null;
    }

    const { data } = supabase.storage.from('avatars').getPublicUrl(filePath);

    // Update profile with new avatar URL
    await instructorService.createOrUpdateInstructorProfile({
      avatar_url: data.publicUrl
    });

    return data.publicUrl;
  }
};
