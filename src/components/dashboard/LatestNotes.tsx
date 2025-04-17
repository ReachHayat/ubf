
import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { getCourses } from "@/components/courses/CourseService";
import { notesService } from "@/services/notesService";

interface LatestNote {
  id: string;
  lessonId: string;
  courseId: string;
  courseName: string;
  lessonName: string;
  content: string;
  updatedAt: string;
}

const LatestNotes: React.FC = () => {
  const { user } = useAuth();
  const [latestNotes, setLatestNotes] = useState<LatestNote[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotes = async () => {
      if (!user) return;
      
      try {
        setLoading(true);
        const notes = await notesService.getUserNotes();
        
        if (notes && notes.length > 0) {
          const processedNotes = await Promise.all(notes.slice(0, 3).map(async (note) => {
            // Find course and lesson info
            const course = getCourses().find((c) => c.id === note.course_id);
            let lessonName = "Unknown Lesson";
            
            if (course && course.sections) {
              // Find the lesson in the course sections
              for (const section of course.sections) {
                const lesson = section.lessons.find(l => l.id === note.lesson_id);
                if (lesson) {
                  lessonName = lesson.title;
                  break;
                }
              }
            }
            
            return {
              id: note.id,
              lessonId: note.lesson_id,
              courseId: note.course_id,
              courseName: course?.title || "Unknown Course",
              lessonName: lessonName,
              content: note.content,
              updatedAt: note.updated_at
            };
          }));
          
          setLatestNotes(processedNotes);
        } else {
          // Fallback to using mock data if no notes in database
          const mockNotes = [
            {
              id: "note-1",
              lessonId: "lesson-1",
              courseId: "1",
              courseName: "Design Principles",
              lessonName: "Introduction to Design Thinking",
              content: "Design thinking is a process for creative problem solving. It emphasizes observation, empathy, finding patterns...",
              updatedAt: new Date(Date.now() - 86400000).toISOString() // 1 day ago
            },
            {
              id: "note-2",
              lessonId: "lesson-2",
              courseId: "1",
              courseName: "Design Principles",
              lessonName: "User-Centered Design",
              content: "User-centered design (UCD) is an iterative design process in which designers focus on the users and their needs...",
              updatedAt: new Date(Date.now() - 172800000).toISOString() // 2 days ago
            }
          ];
          
          setLatestNotes(mockNotes);
        }
      } catch (error) {
        console.error("Error fetching notes:", error);
        // Fallback to mock data
        const mockNotes = [
          {
            id: "note-1",
            lessonId: "lesson-1",
            courseId: "1",
            courseName: "Design Principles",
            lessonName: "Introduction to Design Thinking",
            content: "Design thinking is a process for creative problem solving. It emphasizes observation, empathy, finding patterns...",
            updatedAt: new Date(Date.now() - 86400000).toISOString() // 1 day ago
          },
          {
            id: "note-2",
            lessonId: "lesson-2",
            courseId: "1",
            courseName: "Design Principles",
            lessonName: "User-Centered Design",
            content: "User-centered design (UCD) is an iterative design process in which designers focus on the users and their needs...",
            updatedAt: new Date(Date.now() - 172800000).toISOString() // 2 days ago
          }
        ];
        
        setLatestNotes(mockNotes);
      } finally {
        setLoading(false);
      }
    };
    
    fetchNotes();
  }, [user]);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Latest Notes</CardTitle>
        <Button variant="ghost" size="sm" asChild>
          <Link to="/notes">
            View All <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-4">
            {[1, 2].map(i => (
              <div key={i} className="border rounded-lg p-4 animate-pulse">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="h-4 w-32 bg-gray-200 rounded mb-2"></div>
                    <div className="h-3 w-24 bg-gray-100 rounded"></div>
                  </div>
                  <div className="h-8 w-20 bg-gray-100 rounded"></div>
                </div>
                <div className="mt-2 h-10 bg-gray-100 rounded"></div>
                <div className="mt-2 h-3 w-32 bg-gray-100 rounded"></div>
              </div>
            ))}
          </div>
        ) : latestNotes.length > 0 ? (
          <div className="space-y-4">
            {latestNotes.map(note => (
              <div key={note.id} className="border rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium">{note.lessonName}</h3>
                    <p className="text-sm text-muted-foreground">{note.courseName}</p>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    asChild
                  >
                    <Link to={`/course-viewer/${note.courseId}/${note.lessonId}`}>
                      View Lesson
                    </Link>
                  </Button>
                </div>
                <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
                  {note.content}
                </p>
                <p className="text-xs text-muted-foreground mt-2">
                  Updated {new Date(note.updatedAt).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6">
            <p className="text-muted-foreground">You haven't taken any notes yet.</p>
            <Link to="/courses" className="text-primary hover:underline text-sm mt-1 inline-block">
              Browse courses to start learning
            </Link>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default LatestNotes;
