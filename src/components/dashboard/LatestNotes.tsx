import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { courseService } from "@/services/courseService";
import { courseNotesService, CourseNote } from "@/services/courseNotesService";
import { Course } from "@/types/course";

interface EnrichedNote extends CourseNote {
  courseName: string;
  lessonName: string;
}

const LatestNotes: React.FC = () => {
  const { user } = useAuth();
  const [latestNotes, setLatestNotes] = useState<EnrichedNote[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotes = async () => {
      if (!user) return;
      
      try {
        setLoading(true);
        const notes = await courseNotesService.getNotes();
        
        if (notes && notes.length > 0) {
          const coursesMap = new Map<string, Course>();
          
          // Get unique course IDs
          const courseIds = [...new Set(notes.map(note => note.course_id))];
          
          // Fetch all required courses in parallel
          await Promise.all(courseIds.map(async (courseId) => {
            const course = await courseService.getCourseById(courseId);
            if (course) {
              coursesMap.set(courseId, course);
            }
          }));

          const enrichedNotes = notes.slice(0, 3).map(note => {
            const course = coursesMap.get(note.course_id);
            let lessonName = "Unknown Lesson";
            
            if (course?.sections) {
              for (const section of course.sections) {
                const lesson = section.lessons.find(l => l.id === note.lesson_id);
                if (lesson) {
                  lessonName = lesson.title;
                  break;
                }
              }
            }
            
            return {
              ...note,
              courseName: course?.title || "Unknown Course",
              lessonName
            };
          });
          
          setLatestNotes(enrichedNotes);
        }
      } catch (error) {
        console.error("Error fetching notes:", error);
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
                    <Link to={`/course-viewer/${note.course_id}/${note.lesson_id}`}>
                      View Lesson
                    </Link>
                  </Button>
                </div>
                <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
                  {note.content}
                </p>
                <p className="text-xs text-muted-foreground mt-2">
                  Updated {new Date(note.updated_at).toLocaleDateString()}
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
