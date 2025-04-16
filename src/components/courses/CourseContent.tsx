
import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CourseSection, CourseLesson } from "@/types/course";
import { Plus, ChevronUp, ChevronDown, Edit, Trash2, PlayCircle, Check } from "lucide-react";

interface CourseContentProps {
  sections: CourseSection[];
  isAdmin: boolean;
  onAddSection: () => void;
  onEditSection: (section: CourseSection) => void;
  onDeleteSection: (sectionId: string) => void;
  onEditLesson: (lesson: CourseLesson | null, sectionId: string) => void;
  onDeleteLesson: (sectionId: string, lessonId: string) => void;
  onPlayVideo: (lessonId: string, title: string) => void;
  onToggleSection: (sectionId: string) => void;
  courseId?: string;
  isVideoWatched: (courseId: string, lessonId: string) => boolean;
}

export const CourseContent: React.FC<CourseContentProps> = ({
  sections,
  isAdmin,
  onAddSection,
  onEditSection,
  onDeleteSection,
  onEditLesson,
  onDeleteLesson,
  onPlayVideo,
  onToggleSection,
  courseId,
  isVideoWatched
}) => {
  return (
    <Card className="p-6 sticky top-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Course content</h2>
        {isAdmin && (
          <Button variant="outline" size="sm" onClick={onAddSection}>
            <Plus className="h-4 w-4 mr-1" />
            Add Section
          </Button>
        )}
      </div>
      
      <div className="space-y-2 max-h-[600px] overflow-y-auto pr-2">
        {sections.length === 0 ? (
          <p className="text-muted-foreground text-center py-4">
            No content available for this course yet.
          </p>
        ) : (
          sections.map((section) => (
            <div key={section.id} className="border rounded-lg">
              <div 
                className="p-3 flex items-center justify-between cursor-pointer hover:bg-accent/50"
                onClick={() => onToggleSection(section.id)}
              >
                <div className="flex items-center gap-1">
                  <span className="font-medium">{section.title}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">{section.duration}</span>
                  {isAdmin && (
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" className="h-6 w-6" onClick={(e) => {
                        e.stopPropagation();
                        onEditSection(section);
                      }}>
                        <Edit className="h-3 w-3" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-6 w-6" onClick={(e) => {
                        e.stopPropagation();
                        onDeleteSection(section.id);
                      }}>
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  )}
                  {section.expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </div>
              </div>
              
              {section.expanded && (
                <div className="border-t">
                  {section.lessons.map((lesson) => {
                    const watched = courseId ? isVideoWatched(courseId, lesson.id) : lesson.isCompleted;
                    
                    return (
                      <div 
                        key={lesson.id}
                        className="p-3 hover:bg-accent/20 flex items-center gap-3 cursor-pointer group"
                        onClick={() => onPlayVideo(lesson.id, lesson.title)}
                      >
                        {watched ? (
                          <div className="h-4 w-4 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0">
                            <Check className="h-3 w-3 text-white" />
                          </div>
                        ) : (
                          <PlayCircle className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
                        )}
                        <div className="flex flex-1 items-center justify-between">
                          <span className={`text-sm ${watched ? "line-through text-muted-foreground" : ""}`}>
                            {lesson.title}
                          </span>
                          <div className="flex items-center">
                            <span className="text-xs text-muted-foreground">{lesson.duration}</span>
                            {isAdmin && (
                              <div className="flex gap-1 ml-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <Button variant="ghost" size="icon" className="h-6 w-6" 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    onEditLesson(lesson, section.id);
                                  }}
                                >
                                  <Edit className="h-3 w-3" />
                                </Button>
                                <Button variant="ghost" size="icon" className="h-6 w-6" 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    onDeleteLesson(section.id, lesson.id);
                                  }}
                                >
                                  <Trash2 className="h-3 w-3" />
                                </Button>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  
                  {isAdmin && (
                    <div className="px-3 pb-3 pt-1">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="w-full" 
                        onClick={() => onEditLesson(null, section.id)}
                      >
                        <Plus className="h-3 w-3 mr-1" />
                        Add Lesson
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </Card>
  );
};
