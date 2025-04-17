
import { supabase } from "@/integrations/supabase/client";

export interface CourseNote {
  id: string;
  user_id: string;
  lesson_id: string;
  course_id: string;
  content: string;
  created_at: string;
  updated_at: string;
}

export const courseNotesService = {
  getNotes: async (courseId?: string, lessonId?: string): Promise<CourseNote[]> => {
    try {
      let query = supabase
        .from('course_notes')
        .select('*')
        .order('updated_at', { ascending: false });

      if (courseId) {
        query = query.eq('course_id', courseId);
      }

      if (lessonId) {
        query = query.eq('lesson_id', lessonId);
      }

      const { data: notes, error } = await query;

      if (error) throw error;
      return notes || [];
    } catch (error) {
      console.error("Error fetching notes:", error);
      return [];
    }
  },

  createNote: async (noteData: Omit<CourseNote, 'id' | 'created_at' | 'updated_at'>): Promise<CourseNote | null> => {
    try {
      const { data: note, error } = await supabase
        .from('course_notes')
        .insert([noteData])
        .select()
        .single();

      if (error) throw error;
      return note;
    } catch (error) {
      console.error("Error creating note:", error);
      return null;
    }
  },

  updateNote: async (id: string, content: string): Promise<CourseNote | null> => {
    try {
      const { data: note, error } = await supabase
        .from('course_notes')
        .update({ content, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return note;
    } catch (error) {
      console.error("Error updating note:", error);
      return null;
    }
  },

  deleteNote: async (id: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('course_notes')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error("Error deleting note:", error);
      return false;
    }
  }
};
