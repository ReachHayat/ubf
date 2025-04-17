
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
  },
  
  // Add the legacy method names for backward compatibility
  getUserNotes: async (userId: string, lessonId: string, courseId: string): Promise<string> => {
    try {
      const { data: notes, error } = await supabase
        .from('course_notes')
        .select('*')
        .eq('user_id', userId)
        .eq('lesson_id', lessonId)
        .eq('course_id', courseId)
        .maybeSingle();

      if (error) throw error;
      return notes?.content || '';
    } catch (error) {
      console.error("Error fetching user note:", error);
      return '';
    }
  },
  
  updateUserNotes: async (userId: string, lessonId: string, courseId: string, content: string): Promise<void> => {
    try {
      // Check if note exists
      const { data: existingNote } = await supabase
        .from('course_notes')
        .select('id')
        .eq('user_id', userId)
        .eq('lesson_id', lessonId)
        .eq('course_id', courseId)
        .maybeSingle();

      if (existingNote) {
        // Update existing note
        await supabase
          .from('course_notes')
          .update({ content, updated_at: new Date().toISOString() })
          .eq('id', existingNote.id);
      } else {
        // Create new note
        await supabase
          .from('course_notes')
          .insert([{ user_id: userId, lesson_id: lessonId, course_id: courseId, content }]);
      }
    } catch (error) {
      console.error("Error updating user note:", error);
    }
  },
  
  getAllUserNotes: async (userId: string): Promise<{ lessonId: string, courseId: string, content: string, updatedAt: string }[]> => {
    try {
      const { data: notes, error } = await supabase
        .from('course_notes')
        .select('*')
        .eq('user_id', userId)
        .order('updated_at', { ascending: false });

      if (error) throw error;
      
      return (notes || []).map(note => ({
        lessonId: note.lesson_id,
        courseId: note.course_id,
        content: note.content,
        updatedAt: note.updated_at
      }));
    } catch (error) {
      console.error("Error fetching all user notes:", error);
      return [];
    }
  }
};
