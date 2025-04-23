
import { supabase } from "@/integrations/supabase/client";
import { Quiz, QuizAttempt, QuizAnswer } from "@/types/quiz";

export const quizService = {
  getQuizzesForCourse: async (courseId: string): Promise<Quiz[]> => {
    const { data, error } = await supabase
      .from('quizzes')
      .select(`
        *,
        questions:quiz_questions(
          *,
          options:quiz_options(*)
        )
      `)
      .eq('course_id', courseId)
      .order('created_at');

    if (error) {
      console.error("Error fetching quizzes:", error);
      return [];
    }

    return data || [];
  },

  createQuizAttempt: async (quizId: string): Promise<QuizAttempt | null> => {
    const { data, error } = await supabase
      .from('quiz_attempts')
      .insert({
        quiz_id: quizId,
        user_id: (await supabase.auth.getUser()).data.user?.id,
        status: 'in_progress'
      })
      .select()
      .single();

    if (error) {
      console.error("Error creating quiz attempt:", error);
      return null;
    }

    return data;
  },

  submitQuizAnswer: async (answer: Omit<QuizAnswer, 'id'>): Promise<QuizAnswer | null> => {
    const { data, error } = await supabase
      .from('quiz_answers')
      .insert(answer)
      .select()
      .single();

    if (error) {
      console.error("Error submitting quiz answer:", error);
      return null;
    }

    return data;
  },

  completeQuizAttempt: async (attemptId: string, score: number): Promise<QuizAttempt | null> => {
    const { data, error } = await supabase
      .from('quiz_attempts')
      .update({
        status: 'completed',
        score,
        completed_at: new Date().toISOString()
      })
      .eq('id', attemptId)
      .select()
      .single();

    if (error) {
      console.error("Error completing quiz attempt:", error);
      return null;
    }

    return data;
  }
};
