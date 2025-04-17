
import { supabase } from "@/integrations/supabase/client";
import { Note } from "./notesService";

export interface NoteResult {
  lessonId: string;
  courseId: string;
  content: string;
  updatedAt: string;
}

export const courseNotesService = {
  updateUserNotes: async (userId: string, lessonId: string, courseId: string, noteContent: string): Promise<void> => {
    try {
      if (!userId) {
        console.error("User ID is required to update notes");
        return;
      }
      
      await supabase.functions.invoke('update_note', {
        body: {
          lesson_id_param: lessonId,
          course_id_param: courseId,
          content_param: noteContent
        }
      });
      
      // Also update localStorage for offline access
      const notesKey = `user-notes-${userId}`;
      const userNotes = JSON.parse(localStorage.getItem(notesKey) || "{}");
      
      userNotes[lessonId] = {
        content: noteContent,
        updatedAt: new Date().toISOString(),
      };
      
      localStorage.setItem(notesKey, JSON.stringify(userNotes));
    } catch (error) {
      console.error("Error updating user notes:", error);
    }
  },

  getUserNotes: async (userId: string, lessonId: string, courseId: string): Promise<string> => {
    try {
      if (!userId) {
        return "";
      }
      
      const { data, error } = await supabase.functions.invoke('get_lesson_note', {
        body: {
          lesson_id_param: lessonId,
          course_id_param: courseId
        }
      }) as any;
      
      if (error) {
        throw error;
      }
      
      if (data && data.content) {
        return data.content;
      }
      
      // Fallback to localStorage if not found in DB
      const notesKey = `user-notes-${userId}`;
      const userNotes = JSON.parse(localStorage.getItem(notesKey) || "{}");
      return userNotes[lessonId]?.content || "";
      
    } catch (error) {
      console.error("Error getting user notes:", error);
      return "";
    }
  },

  getAllUserNotes: async (userId: string): Promise<NoteResult[]> => {
    try {
      if (!userId) {
        return [];
      }
      
      const { data, error } = await supabase.functions.invoke('get_user_notes') as any;
      
      if (error) throw error;
      
      if (data && data.length > 0) {
        return data.map((note: Note) => ({
          lessonId: note.lesson_id,
          courseId: note.course_id,
          content: note.content,
          updatedAt: note.updated_at
        }));
      }
      
      // Fallback to localStorage if not found in DB
      const notesKey = `user-notes-${userId}`;
      const userNotes = JSON.parse(localStorage.getItem(notesKey) || "{}");
      
      return Object.entries(userNotes).map(([lessonId, noteData]: [string, any]) => ({
        lessonId,
        courseId: "", // Not available in localStorage version
        content: noteData.content,
        updatedAt: noteData.updatedAt
      }));
      
    } catch (error) {
      console.error("Error getting all user notes:", error);
      return [];
    }
  }
};
