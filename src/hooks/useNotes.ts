
import { useState, useEffect } from "react";
import { toast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { notesService } from "@/services/notesService";

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
      const data = await notesService.getUserNotes();
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
      const data = await notesService.updateNote(lessonId, courseId, content);
      
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
      const success = await notesService.deleteNote(noteId);
        
      if (success) {
        setNotes(notes.filter(n => n.id !== noteId));
        
        toast({
          title: "Note deleted",
          description: "Your note has been deleted."
        });
      }
      
      return success;
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
