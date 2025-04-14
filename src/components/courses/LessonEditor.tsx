
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CourseLesson } from "@/types/course";

interface LessonEditorProps {
  lesson: CourseLesson | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (lesson: CourseLesson) => void;
  sectionId: string;
}

export function LessonEditor({ lesson, open, onOpenChange, onSave, sectionId }: LessonEditorProps) {
  const [formData, setFormData] = useState<CourseLesson>({
    id: "",
    title: "",
    duration: "",
    content: "",
    videoUrl: ""
  });

  useState(() => {
    if (lesson) {
      setFormData({
        ...lesson,
        content: lesson.content || "",
        videoUrl: lesson.videoUrl || ""
      });
    } else {
      // New lesson with default values and generated ID
      setFormData({
        id: Math.random().toString(36).substring(2, 9),
        title: "",
        duration: "0 min",
        content: "",
        videoUrl: ""
      });
    }
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...formData,
      id: formData.id || Math.random().toString(36).substring(2, 9)
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{lesson ? "Edit Lesson" : "Add New Lesson"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Lesson Title</Label>
            <Input
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter lesson title"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="duration">Duration (e.g., "15 min")</Label>
            <Input
              id="duration"
              name="duration"
              value={formData.duration}
              onChange={handleChange}
              placeholder="Enter duration"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="videoUrl">Video URL (optional)</Label>
            <Input
              id="videoUrl"
              name="videoUrl"
              value={formData.videoUrl || ""}
              onChange={handleChange}
              placeholder="Enter video URL"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">Lesson Content (optional)</Label>
            <Textarea
              id="content"
              name="content"
              value={formData.content || ""}
              onChange={handleChange}
              placeholder="Enter lesson content"
              rows={8}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">Save Lesson</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
