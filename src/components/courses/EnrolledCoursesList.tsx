
import React from "react";
import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Course } from "@/types/course";
import { EmptyState } from "@/components/ui/empty-state";

interface EnrolledCoursesListProps {
  courses: Course[];
}

const EnrolledCoursesList: React.FC<EnrolledCoursesListProps> = ({ courses }) => {
  if (courses.length === 0) {
    return (
      <div className="col-span-3">
        <EmptyState
          title="No enrolled courses"
          description="You haven't enrolled in any courses yet."
          actionLabel="Browse Courses"
          actionHref="/courses?tab=all"
        />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {courses.map((course) => (
        <Card key={course.id} className="overflow-hidden">
          <div className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className={`${course.bgColor} text-white h-10 w-10 rounded-md flex items-center justify-center font-bold`}>
                {course.logo || course.title.substring(0, 1)}
              </div>
              <span className="text-sm text-muted-foreground">{course.category}</span>
            </div>
            
            <h3 className="text-lg font-semibold mb-4">{course.title}</h3>
            <p className="text-sm text-muted-foreground mb-4">Instructor: {course.instructor.name}</p>
            
            <Progress value={course.progress || 0} className="h-2 mb-2" />
            
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                {course.hoursCompleted?.toFixed(1) || 0}h of {course.totalHours}h
              </span>
              <span className="text-sm font-medium">{course.progress || 0}%</span>
            </div>
            
            <Link to={`/course/${course.id}`}>
              <Button variant="default" className="w-full mt-4">
                Continue
              </Button>
            </Link>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default EnrolledCoursesList;
