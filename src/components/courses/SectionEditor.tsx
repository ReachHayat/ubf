
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CourseSection } from "@/types/course";

interface SectionEditorProps {
  section: CourseSection | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (section: CourseSection) => void;
}

export function SectionEditor({ section, open, onOpenChange, onSave }: SectionEditorProps) {
  const [formData, setFormData] = useState<CourseSection>({
    id: "",
    title: "",
    duration: "",
    lessons: []
  });

  useEffect(() => {
    if (section) {
      setFormData({
        ...section
      });
    } else {
      // New section with default values and generated ID
      setFormData({
        id: Math.random().toString(36).substring(2, 9),
        title: "",
        duration: "0 min",
        lessons: []
      });
    }
  }, [section, open]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{section ? "Edit Section" : "Add New Section"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Section Title</Label>
            <Input
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter section title"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="duration">Duration (e.g., "1h 20min")</Label>
            <Input
              id="duration"
              name="duration"
              value={formData.duration}
              onChange={handleChange}
              placeholder="Enter duration"
              required
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">Save Section</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
