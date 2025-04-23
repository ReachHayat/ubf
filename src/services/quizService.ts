
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

    // Ensure types match by casting as needed
    return (data || []).map(quiz => ({
      ...quiz,
      questions: quiz.questions?.map(question => ({
        ...question,
        question_type: question.question_type as 'multiple_choice' | 'true_false' | 'text'
      }))
    })) as Quiz[];
  },

  createQuizAttempt: async (quizId: string): Promise<QuizAttempt | null> => {
    const { data, error } = await supabase
      .from('quiz_attempts')
      .insert({
        quiz_id: quizId,
        user_id: (await supabase.auth.getUser()).data.user?.id,
        status: 'in_progress' as const
      })
      .select()
      .single();

    if (error) {
      console.error("Error creating quiz attempt:", error);
      return null;
    }

    return {
      ...data,
      status: data.status as 'in_progress' | 'completed' | 'abandoned'
    };
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
        status: 'completed' as const,
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

    return {
      ...data,
      status: data.status as 'in_progress' | 'completed' | 'abandoned'
    };
  }
};
