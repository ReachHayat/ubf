
export interface CourseLesson {
  id: string;
  title: string;
  duration: string;
  isCompleted?: boolean;
  content?: string;
  videoUrl?: string;
  thumbnail?: string;
  transcript?: string;
  section_title?: string;
}

export interface CourseSection {
  id: string;
  title: string;
  duration: string;
  expanded?: boolean;
  lessons: CourseLesson[];
}

export interface CourseAssignment {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  status: 'pending' | 'submitted' | 'graded';
  grade?: number;
  feedbackFromInstructor?: string;
}

export interface CourseQuiz {
  id: string;
  title: string;
  description: string;
  timeLimit: number; // in minutes
  questions: QuizQuestion[];
  status: 'not_started' | 'in_progress' | 'completed';
  score?: number;
}

export interface QuizQuestion {
  id: string;
  question: string;
  type: 'multiple_choice' | 'true_false' | 'short_answer';
  options?: string[];
  correctAnswer?: string | string[];
  userAnswer?: string | string[];
}

export interface Course {
  id: string;
  title: string;
  category: string;
  instructor: {
    id: string;
    name: string;
    role: string;
    avatar: string;
  };
  description: string;
  thumbnail?: string;
  rating?: number;
  reviews?: number;
  progress?: number;
  hoursCompleted?: number;
  totalHours: number;
  enrolled?: boolean;
  status?: 'published' | 'draft';  // Ensuring this is correctly typed
  lastUpdated?: string;
  price?: number;
  tags?: string[];
  logo?: string;
  bgColor?: string;
  sections?: CourseSection[];
  assignments?: CourseAssignment[];
  quizzes?: CourseQuiz[];
}

export interface CourseFilterOptions {
  categories: string[];
  instructors: string[];
  duration: {
    min: number;
    max: number;
  };
  price: {
    min: number;
    max: number;
  };
  rating: number;
}

// Add bookmark related interfaces
export interface BookmarkItem {
  content_id: string;
  content_type: string;
  title: string;
  description: string;
  thumbnail?: string;
}
