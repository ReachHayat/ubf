
import React, { useState, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "@/components/ui/use-toast";
import { Save } from "lucide-react";
import { courseNotesService } from "@/services/courseNotesService";
import { useAuth } from "@/contexts/AuthContext";

interface CourseNotesProps {
  courseId?: string;
  lessonId?: string;
}

export const CourseNotes: React.FC<CourseNotesProps> = ({ courseId, lessonId }) => {
  const { user } = useAuth();
  const [noteContent, setNoteContent] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const loadNotes = async () => {
      if (!user || !lessonId || !courseId) return;
      
      try {
        const savedNote = await courseNotesService.getUserNotes(user.id, lessonId, courseId);
        setNoteContent(savedNote || "");
      } catch (error) {
        console.error("Error loading notes:", error);
      }
    };

    loadNotes();
  }, [user, lessonId, courseId]);

  const saveNote = async () => {
    if (!user || !lessonId || !courseId) return;
    
    setIsSaving(true);
    try {
      await courseNotesService.updateUserNotes(user.id, lessonId, courseId, noteContent);
      
      toast({
        title: "Note saved",
        description: "Your note has been saved successfully."
      });
    } catch (error) {
      console.error("Error saving note:", error);
      toast({
        variant: "destructive",
        title: "Failed to save note",
        description: "Please try again later."
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Card className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">My Notes</h3>
        <Button 
          onClick={saveNote}
          disabled={isSaving}
        >
          <Save className="h-4 w-4 mr-2" />
          {isSaving ? "Saving..." : "Save Notes"}
        </Button>
      </div>
      <Textarea
        value={noteContent}
        onChange={(e) => setNoteContent(e.target.value)}
        placeholder="Take notes for this lesson..."
        className="min-h-[300px] resize-none"
      />
    </Card>
  );
};
