
export interface QuizOption {
  id: string;
  option_text: string;
  is_correct: boolean;
  position: number;
}

export interface QuizQuestion {
  id: string;
  quiz_id: string;
  question: string;
  question_type: 'multiple_choice' | 'true_false' | 'text';
  points: number;
  position: number;
  options?: QuizOption[];
}

export interface Quiz {
  id: string;
  title: string;
  description?: string;
  course_id: string;
  section_id: string;
  time_limit?: number;
  passing_score: number;
  questions?: QuizQuestion[];
}

export interface QuizAttempt {
  id: string;
  user_id: string;
  quiz_id: string;
  score?: number;
  status: 'in_progress' | 'completed' | 'abandoned';
  started_at: string;
  completed_at?: string;
}

export interface QuizAnswer {
  id: string;
  attempt_id: string;
  question_id: string;
  selected_option_id?: string;
  text_answer?: string;
  is_correct?: boolean;
  points_earned?: number;
}
