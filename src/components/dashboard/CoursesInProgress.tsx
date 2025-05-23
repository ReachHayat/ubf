import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Clock, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { Course } from "@/types/course";
import CourseProgressCard from "./CourseProgressCard";
import { getEnrolledCourses } from "@/components/courses/CourseService";

interface CoursesInProgressProps {
  courses?: Course[];
}

const CoursesInProgress = ({ courses: propsCourses }: CoursesInProgressProps) => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        if (propsCourses && propsCourses.length > 0) {
          setCourses(propsCourses.filter(course => course.enrolled));
          setIsLoading(false);
          return;
        }
        
        const enrolledCourses = await getEnrolledCourses();
        setCourses(enrolledCourses);
      } catch (err) {
        console.error("Error fetching enrolled courses:", err);
        setError("Failed to load your courses");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchCourses();
  }, [propsCourses]);

  return (
    <section className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Courses in Progress</h2>
        <Button variant="ghost" asChild>
          <Link to="/courses">View All</Link>
        </Button>
      </div>
      
      {isLoading ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center p-6">
            <Loader2 className="h-12 w-12 text-muted-foreground mb-2 animate-spin" />
            <h3 className="text-lg font-medium">Loading your courses...</h3>
          </CardContent>
        </Card>
      ) : error ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center p-6">
            <h3 className="text-lg font-medium text-destructive">Error</h3>
            <p className="text-muted-foreground text-center mb-4">{error}</p>
            <Button onClick={() => window.location.reload()}>
              Try Again
            </Button>
          </CardContent>
        </Card>
      ) : courses.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center p-6">
            <Clock className="h-12 w-12 text-muted-foreground mb-2" />
            <h3 className="text-lg font-medium">No courses in progress</h3>
            <p className="text-muted-foreground text-center mb-4">
              You haven't started any courses yet. Browse our courses and enroll to get started.
            </p>
            <Button asChild>
              <Link to="/courses">Browse Courses</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {courses.slice(0, 3).map(course => (
            <CourseProgressCard key={course.id} course={course} />
          ))}
        </div>
      )}
    </section>
  );
};

export default CoursesInProgress;
