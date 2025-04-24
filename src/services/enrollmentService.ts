
import { supabase } from "@/integrations/supabase/client";

export interface CourseEnrollment {
  id: string;
  user_id: string;
  course_id: string;
  enrolled_at: string;
  progress: number;
  completion_status: 'not_started' | 'in_progress' | 'completed';
  last_accessed_at: string;
  courses?: {
    title: string;
    thumbnail: string;
    description: string;
  };
}

export const enrollmentService = {
  enrollInCourse: async (courseId: string): Promise<boolean> => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;

    const { error } = await supabase
      .from('course_enrollments')
      .insert({
        user_id: user.id,
        course_id: courseId,
      });

    if (error) {
      console.error('Error enrolling in course:', error);
      return false;
    }

    return true;
  },

  getEnrollments: async (userId: string): Promise<CourseEnrollment[]> => {
    const { data, error } = await supabase
      .from('course_enrollments')
      .select(`
        *,
        courses (
          title,
          thumbnail,
          description
        )
      `)
      .eq('user_id', userId);

    if (error) {
      console.error('Error fetching enrollments:', error);
      return [];
    }

    // Transform the data to ensure the completion_status matches the expected type
    const enrollments: CourseEnrollment[] = (data || []).map(item => {
      const status = item.completion_status || 'in_progress';
      // Ensure status is one of the allowed values
      const typedStatus: 'not_started' | 'in_progress' | 'completed' = 
        ['not_started', 'in_progress', 'completed'].includes(status) 
          ? (status as 'not_started' | 'in_progress' | 'completed') 
          : 'in_progress';
      
      return {
        ...item,
        completion_status: typedStatus
      };
    });

    return enrollments;
  },

  updateProgress: async (courseId: string, progress: number): Promise<boolean> => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;

    // Determine the completion status based on progress
    let completion_status: 'not_started' | 'in_progress' | 'completed';
    if (progress === 100) {
      completion_status = 'completed';
    } else if (progress === 0) {
      completion_status = 'not_started';
    } else {
      completion_status = 'in_progress';
    }

    const { error } = await supabase
      .from('course_enrollments')
      .update({
        progress,
        last_accessed_at: new Date().toISOString(),
        completion_status
      })
      .eq('course_id', courseId)
      .eq('user_id', user.id);

    if (error) {
      console.error('Error updating progress:', error);
      return false;
    }

    return true;
  }
};
