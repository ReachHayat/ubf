
import { supabase } from "@/integrations/supabase/client";
import { Note } from "@/hooks/useNotes";
import { toast } from "@/components/ui/use-toast";

// Generic types for our RPC responses
interface RPCResponse<T> {
  data: T | null;
  error: any;
}

export const notesService = {
  getUserNotes: async (): Promise<Note[]> => {
    try {
      const response = await supabase.rpc('get_user_notes') as unknown as RPCResponse<Note[]>;
      
      if (response.error) throw response.error;
      
      return response.data || [];
    } catch (error) {
      console.error("Error fetching notes:", error);
      return [];
    }
  },

  updateNote: async (
    lessonId: string,
    courseId: string,
    content: string
  ): Promise<Note | null> => {
    try {
      const response = await supabase.rpc('update_note', {
        lesson_id_param: lessonId,
        course_id_param: courseId,
        content_param: content
      }) as unknown as RPCResponse<Note>;
      
      if (response.error) throw response.error;
      
      return response.data;
    } catch (error) {
      console.error("Error updating note:", error);
      return null;
    }
  },

  getNote: async (lessonId: string, courseId: string): Promise<Note | null> => {
    try {
      const response = await supabase.rpc('get_lesson_note', {
        lesson_id_param: lessonId,
        course_id_param: courseId
      }) as unknown as RPCResponse<Note>;
      
      if (response.error) throw response.error;
      
      return response.data;
    } catch (error) {
      console.error("Error fetching note:", error);
      return null;
    }
  },

  deleteNote: async (noteId: string): Promise<boolean> => {
    try {
      const response = await supabase.rpc('delete_note', {
        note_id_param: noteId
      }) as unknown as RPCResponse<boolean>;
      
      if (response.error) throw response.error;
      
      return true;
    } catch (error) {
      console.error("Error deleting note:", error);
      return false;
    }
  }
};
