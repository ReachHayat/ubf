
import { supabase } from "@/integrations/supabase/client";

export interface AssignmentSubmission {
  id: string;
  assignment_id: string;
  user_id: string;
  submission_text?: string;
  submission_file_path?: string;
  submission_url?: string;
  status: 'submitted' | 'graded';
  grade?: number;
  feedback?: string;
  submitted_at: string;
  graded_at?: string;
}

export const submissionService = {
  submitAssignment: async (
    assignmentId: string,
    submission: {
      text?: string;
      filePath?: string;
      url?: string;
    }
  ): Promise<boolean> => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;

    const { error } = await supabase
      .from('assignment_submissions')
      .insert({
        assignment_id: assignmentId,
        user_id: user.id,
        submission_text: submission.text,
        submission_file_path: submission.filePath,
        submission_url: submission.url
      });

    if (error) {
      console.error('Error submitting assignment:', error);
      return false;
    }

    return true;
  },

  getSubmissionsByAssignment: async (assignmentId: string): Promise<AssignmentSubmission[]> => {
    const { data, error } = await supabase
      .from('assignment_submissions')
      .select('*')
      .eq('assignment_id', assignmentId);

    if (error) {
      console.error('Error fetching submissions:', error);
      return [];
    }

    return data || [];
  },

  gradeSubmission: async (
    submissionId: string,
    grade: number,
    feedback: string
  ): Promise<boolean> => {
    const { error } = await supabase
      .from('assignment_submissions')
      .update({
        grade,
        feedback,
        status: 'graded',
        graded_at: new Date().toISOString()
      })
      .eq('id', submissionId);

    if (error) {
      console.error('Error grading submission:', error);
      return false;
    }

    return true;
  }
};
