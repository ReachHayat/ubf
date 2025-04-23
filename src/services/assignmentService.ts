
import { supabase } from "@/integrations/supabase/client";
import { Assignment, AssignmentSubmission } from "@/types/assignment";

export const assignmentService = {
  getAssignmentsForCourse: async (courseId: string): Promise<Assignment[]> => {
    const { data, error } = await supabase
      .from('assignments')
      .select('*')
      .eq('course_id', courseId)
      .order('created_at');

    if (error) {
      console.error("Error fetching assignments:", error);
      return [];
    }

    return data || [];
  },

  submitAssignment: async (
    assignmentId: string, 
    submission: {
      submission_text?: string;
      submission_url?: string;
      submission_file_path?: string;
    }
  ): Promise<AssignmentSubmission | null> => {
    const { data, error } = await supabase
      .from('assignment_submissions')
      .insert({
        assignment_id: assignmentId,
        user_id: (await supabase.auth.getUser()).data.user?.id,
        ...submission
      })
      .select()
      .single();

    if (error) {
      console.error("Error submitting assignment:", error);
      return null;
    }

    return data;
  }
};
