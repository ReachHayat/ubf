
import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import CoursesInProgress from "@/components/dashboard/CoursesInProgress";
import PopularCategories from "@/components/dashboard/PopularCategories";
import TopMentors from "@/components/dashboard/TopMentors";
import BookmarkedCourses from "@/components/dashboard/BookmarkedCourses";
import { useAuth } from "@/contexts/AuthContext";
import { Link } from "react-router-dom";
import { getCourses, getEnrolledCourses } from "@/components/courses/CourseService";

const Dashboard = () => {
  const { user } = useAuth();
  const [latestNotes, setLatestNotes] = useState<{
    id: string;
    lessonId: string;
    courseId: string;
    courseName: string;
    lessonName: string;
    content: string;
    updatedAt: string;
  }[]>([]);
  const [courses, setCourses] = useState([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [mentors, setMentors] = useState([]);

  useEffect(() => {
    // Fetch all courses
    const allCourses = getCourses();
    // Filter for enrolled courses
    const enrolledCourses = getEnrolledCourses();
    setCourses(enrolledCourses);
    
    // Extract unique categories from courses
    const uniqueCategories = [...new Set(allCourses.map(course => course.category))];
    setCategories(uniqueCategories);
    
    // Create list of mentors from course instructors
    const instructors = allCourses.map(course => ({
      id: course.instructor.id,
      name: course.instructor.name,
      role: course.instructor.role,
      avatar: course.instructor.avatar
    }));
    // Remove duplicates based on id
    const uniqueMentors = instructors.filter((mentor, index, self) => 
      index === self.findIndex(m => m.id === mentor.id)
    );
    setMentors(uniqueMentors);

    // Fetch latest notes (mock data for now)
    if (user) {
      // In a real app, we'd fetch from Supabase
      // For now, let's generate some mock data
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
  }, [user]);

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-4xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome to your learning dashboard
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <CoursesInProgress courses={courses} />
          
          {/* Latest Notes */}
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
              {latestNotes.length > 0 ? (
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
          
          <PopularCategories categories={categories} />
        </div>
        <div className="space-y-6">
          <BookmarkedCourses />
          <TopMentors mentors={mentors} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
