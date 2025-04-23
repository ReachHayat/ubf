
import { supabase } from "@/integrations/supabase/client";

export const courseNotesService = {
  getUserNotes: async (userId: string, lessonId: string, courseId: string): Promise<string | null> => {
    const { data, error } = await supabase
      .from('course_notes')
      .select('content')
      .eq('user_id', userId)
      .eq('lesson_id', lessonId)
      .eq('course_id', courseId)
      .single();
    
    if (error && error.code !== 'PGRST116') {
      // PGRST116 is "No rows found" which is fine
      console.error("Error fetching notes:", error);
    }
    
    return data?.content || null;
  },
  
  updateUserNotes: async (userId: string, lessonId: string, courseId: string, content: string): Promise<void> => {
    // Check if a note already exists
    const { data: existingNote } = await supabase
      .from('course_notes')
      .select('id')
      .eq('user_id', userId)
      .eq('lesson_id', lessonId)
      .eq('course_id', courseId)
      .single();
    
    if (existingNote) {
      // Update existing note
      const { error } = await supabase
        .from('course_notes')
        .update({ content, updated_at: new Date().toISOString() })
        .eq('id', existingNote.id);
      
      if (error) throw error;
    } else {
      // Create new note
      const { error } = await supabase
        .from('course_notes')
        .insert({
          user_id: userId,
          lesson_id: lessonId,
          course_id: courseId,
          content
        });
      
      if (error) throw error;
    }
  },
  
  deleteUserNotes: async (userId: string, lessonId: string, courseId: string): Promise<void> => {
    const { error } = await supabase
      .from('course_notes')
      .delete()
      .eq('user_id', userId)
      .eq('lesson_id', lessonId)
      .eq('course_id', courseId);
    
    if (error) throw error;
  }
};
