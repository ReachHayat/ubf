
export interface Assignment {
  id: string;
  title: string;
  description?: string;
  course_id: string;
  section_id: string;
  due_date?: string;
  max_points: number;
  submission_type: 'file' | 'text' | 'url';
}

export interface AssignmentSubmission {
  id: string;
  user_id: string;
  assignment_id: string;
  submission_text?: string;
  submission_url?: string;
  submission_file_path?: string;
  grade?: number;
  status: 'submitted' | 'graded' | 'rejected';
  feedback?: string;
  submitted_at: string;
  graded_at?: string;
}
