
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";

export interface Note {
  id: string;
  lesson_id: string;
  course_id: string;
  content: string;
  created_at: string;
  updated_at: string;
}

export const useNotes = () => {
  const { user } = useAuth();
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      fetchNotes();
    }
  }, [user]);

  const fetchNotes = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      
      const { data, error } = await supabase.rpc('get_user_notes') as any;
        
      if (error) throw error;
      
      setNotes(data || []);
    } catch (error) {
      console.error("Error fetching notes:", error);
      toast({
        variant: "destructive",
        title: "Failed to load notes",
        description: "Please try again or contact support if the problem persists."
      });
    } finally {
      setLoading(false);
    }
  };

  const updateNote = async (lessonId: string, courseId: string, content: string) => {
    if (!user) {
      toast({
        variant: "destructive",
        title: "Authentication required",
        description: "Please log in to save notes."
      });
      return null;
    }
    
    try {
      const { data, error } = await supabase.rpc('update_note', {
        lesson_id_param: lessonId,
        course_id_param: courseId,
        content_param: content,
        user_id_param: user.id
      }) as any;
      
      if (error) throw error;
      
      if (data) {
        const existingNoteIndex = notes.findIndex(
          n => n.lesson_id === lessonId && n.course_id === courseId
        );
        
        if (existingNoteIndex >= 0) {
          // Update existing note
          setNotes(notes.map((n, i) => i === existingNoteIndex ? data : n));
        } else {
          // Add new note
          setNotes([...notes, data]);
        }
        
        toast({
          title: "Note saved",
          description: "Your notes have been saved."
        });
        
        return data;
      }
      
      return null;
    } catch (error) {
      console.error("Error saving notes:", error);
      toast({
        variant: "destructive",
        title: "Failed to save notes",
        description: "Please try again or contact support if the problem persists."
      });
      return null;
    }
  };

  const getNote = (lessonId: string, courseId: string) => {
    return notes.find(n => n.lesson_id === lessonId && n.course_id === courseId);
  };

  const deleteNote = async (noteId: string) => {
    if (!user) return false;
    
    try {
      const { error } = await supabase.rpc('delete_note', {
        note_id_param: noteId,
        user_id_param: user.id
      }) as any;
        
      if (error) throw error;
      
      setNotes(notes.filter(n => n.id !== noteId));
      
      toast({
        title: "Note deleted",
        description: "Your note has been deleted."
      });
      
      return true;
    } catch (error) {
      console.error("Error deleting note:", error);
      toast({
        variant: "destructive",
        title: "Failed to delete note",
        description: "Please try again or contact support if the problem persists."
      });
      return false;
    }
  };

  return {
    notes,
    loading,
    fetchNotes,
    updateNote,
    getNote,
    deleteNote
  };
};
