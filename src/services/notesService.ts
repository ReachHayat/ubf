
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

export interface Note {
  id: string;
  user_id: string;
  lesson_id: string;
  course_id: string;
  content: string;
  created_at: string;
  updated_at: string;
}

// Generic types for our RPC responses
interface RPCResponse<T> {
  data: T | null;
  error: any;
}

export const notesService = {
  getUserNotes: async (): Promise<Note[]> => {
    try {
      const response = await supabase.functions.invoke('get_user_notes') as RPCResponse<Note[]>;
      
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
      const response = await supabase.functions.invoke('update_note', {
        body: {
          lesson_id_param: lessonId,
          course_id_param: courseId,
          content_param: content
        }
      }) as RPCResponse<Note>;
      
      if (response.error) throw response.error;
      
      return response.data;
    } catch (error) {
      console.error("Error updating note:", error);
      return null;
    }
  },

  getNote: async (lessonId: string, courseId: string): Promise<Note | null> => {
    try {
      const response = await supabase.functions.invoke('get_lesson_note', {
        body: {
          lesson_id_param: lessonId,
          course_id_param: courseId
        }
      }) as RPCResponse<Note>;
      
      if (response.error) throw response.error;
      
      return response.data;
    } catch (error) {
      console.error("Error fetching note:", error);
      return null;
    }
  },

  deleteNote: async (noteId: string): Promise<boolean> => {
    try {
      const response = await supabase.functions.invoke('delete_note', {
        body: {
          note_id_param: noteId
        }
      }) as RPCResponse<boolean>;
      
      if (response.error) throw response.error;
      
      return true;
    } catch (error) {
      console.error("Error deleting note:", error);
      return false;
    }
  }
};
