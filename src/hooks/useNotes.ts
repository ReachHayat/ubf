
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
      
      const { data, error } = await supabase
        .from('notes')
        .select('*')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false });
        
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
      // Check if note already exists
      const existingNote = notes.find(n => n.lesson_id === lessonId && n.course_id === courseId);
      
      if (existingNote) {
        // Update existing note
        const { data, error } = await supabase
          .from('notes')
          .update({ 
            content,
            updated_at: new Date().toISOString()
          })
          .eq('id', existingNote.id)
          .select();
          
        if (error) throw error;
        
        if (data && data.length > 0) {
          setNotes(notes.map(n => n.id === existingNote.id ? data[0] as Note : n));
          return data[0] as Note;
        }
      } else {
        // Create new note
        const newNote = {
          user_id: user.id,
          lesson_id: lessonId,
          course_id: courseId,
          content
        };
        
        const { data, error } = await supabase
          .from('notes')
          .insert(newNote)
          .select();
          
        if (error) throw error;
        
        if (data && data.length > 0) {
          setNotes([...notes, data[0] as Note]);
          return data[0] as Note;
        }
      }
      
      toast({
        title: "Note saved",
        description: "Your notes have been saved."
      });
      
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
      const { error } = await supabase
        .from('notes')
        .delete()
        .eq('id', noteId);
        
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
