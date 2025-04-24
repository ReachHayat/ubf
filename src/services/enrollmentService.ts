
import { supabase } from "@/integrations/supabase/client";

export interface CourseEnrollment {
  id: string;
  user_id: string;
  course_id: string;
  enrolled_at: string;
  progress: number;
  completion_status: 'not_started' | 'in_progress' | 'completed';
  last_accessed_at: string;
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

    return data || [];
  },

  updateProgress: async (courseId: string, progress: number): Promise<boolean> => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;

    const { error } = await supabase
      .from('course_enrollments')
      .update({
        progress,
        last_accessed_at: new Date().toISOString(),
        completion_status: progress === 100 ? 'completed' : 'in_progress'
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
