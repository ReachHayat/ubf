import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bookmark, PlayCircle } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Link } from "react-router-dom";
import { getCourseById } from "@/components/courses/CourseService";
import { bookmarkService, Bookmark as BookmarkType } from "@/services/bookmarkService";

interface BookmarkedLesson {
  id: string;
  title: string;
  courseId: string;
  courseName: string;
  thumbnail?: string;
  lastViewed?: string;
}

const BookmarkedCourses = () => {
  const { user } = useAuth();
  const [bookmarkedLessons, setBookmarkedLessons] = useState<BookmarkedLesson[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookmarks = async () => {
      if (!user) return;
      
      try {
        setLoading(true);
        
        const bookmarks = await bookmarkService.getUserBookmarks();
        const lessonBookmarks = bookmarks.filter(b => b.content_type === 'lesson');
        
        const fetchedBookmarks: BookmarkedLesson[] = [];
        
        for (const bookmark of lessonBookmarks) {
          const courseId = bookmark.description?.replace('Course: ', '') || '';
          const course = getCourseById(courseId.trim());
          
          fetchedBookmarks.push({
            id: bookmark.content_id,
            title: bookmark.title,
            courseId: courseId,
            courseName: course?.title || 'Unknown Course',
            thumbnail: bookmark.thumbnail,
            lastViewed: bookmark.created_at
          });
        }
        
        setBookmarkedLessons(fetchedBookmarks);
      } catch (error) {
        console.error("Error fetching bookmarks:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchBookmarks();
  }, [user]);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bookmark className="h-5 w-5" /> Bookmarked Lessons
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-4">
                <div className="w-16 h-9 bg-muted rounded animate-pulse" />
                <div className="space-y-2">
                  <div className="h-4 w-32 bg-muted rounded animate-pulse" />
                  <div className="h-3 w-24 bg-muted rounded animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bookmark className="h-5 w-5" /> Bookmarked Lessons
        </CardTitle>
      </CardHeader>
      <CardContent>
        {bookmarkedLessons.length > 0 ? (
          <div className="space-y-4">
            {bookmarkedLessons.map((lesson) => (
              <Link 
                key={lesson.id}
                to={`/course-viewer/${lesson.courseId}/${lesson.id}`}
                className="flex items-center gap-4 p-2 rounded hover:bg-accent/50"
              >
                <div className="relative w-16 h-9 bg-muted rounded overflow-hidden flex-shrink-0">
                  {lesson.thumbnail ? (
                    <img src={lesson.thumbnail} alt={lesson.title} className="object-cover w-full h-full" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-primary/10">
                      <PlayCircle className="h-4 w-4 text-primary" />
                    </div>
                  )}
                </div>
                <div>
                  <p className="text-sm font-medium line-clamp-1">{lesson.title}</p>
                  <p className="text-xs text-muted-foreground">{lesson.courseName}</p>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-6">
            <p className="text-muted-foreground">You haven't bookmarked any lessons yet.</p>
            <Link to="/courses" className="text-primary hover:underline text-sm mt-1 inline-block">
              Browse courses
            </Link>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default BookmarkedCourses;
