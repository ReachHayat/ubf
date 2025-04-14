
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Clock } from "lucide-react";
import { Link } from "react-router-dom";
import { Course } from "@/types/course";
import CourseProgressCard from "./CourseProgressCard";

interface CoursesInProgressProps {
  courses: Course[];
}

const CoursesInProgress = ({ courses = [] }: CoursesInProgressProps) => {
  // Show only enrolled courses with some progress
  const inProgressCourses = courses.filter(course => course.enrolled);

  return (
    <section className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Courses in Progress</h2>
        <Button variant="ghost" asChild>
          <Link to="/courses">View All</Link>
        </Button>
      </div>
      
      {inProgressCourses.length === 0 ? (
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
          {inProgressCourses.slice(0, 3).map(course => (
            <CourseProgressCard key={course.id} course={course} />
          ))}
        </div>
      )}
    </section>
  );
};

export default CoursesInProgress;
