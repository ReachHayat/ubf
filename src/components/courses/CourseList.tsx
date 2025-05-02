
import React from "react";
import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Course } from "@/types/course";
import { EmptyState } from "@/components/ui/empty-state";

interface CourseListProps {
  courses: Course[];
  onClearFilters: () => void;
}

const CourseList: React.FC<CourseListProps> = ({ courses, onClearFilters }) => {
  if (courses.length === 0) {
    return (
      <EmptyState
        title="No courses found"
        description="No courses match your search criteria."
        actionLabel="Clear Filters"
        onAction={onClearFilters}
      />
    );
  }

  return (
    <div className="space-y-4">
      {courses.map((course) => (
        <Card key={course.id} className="overflow-hidden">
          <div className="p-4 flex items-center">
            <div className={`${course.bgColor} text-white h-16 w-16 rounded-md flex items-center justify-center font-bold mr-4`}>
              {course.logo || course.title.substring(0, 1)}
            </div>
            
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <Badge variant="outline">{course.category}</Badge>
                <div className="flex items-center ml-auto">
                  <div className="flex items-center">
                    {"★".repeat(Math.floor(course.rating || 0))}
                    {"☆".repeat(5 - Math.floor(course.rating || 0))}
                  </div>
                  <span className="text-sm text-muted-foreground ml-1">({course.reviews || 0})</span>
                </div>
              </div>
              
              <h3 className="text-lg font-semibold mt-1">{course.title}</h3>
              
              <div className="flex items-center text-sm text-muted-foreground mt-1">
                <p>By {course.instructor.name}</p>
                <span className="mx-2">•</span>
                <p>{course.totalHours} hours</p>
              </div>
            </div>
            
            <Link to={`/course/${course.id}`} className="ml-4">
              <Button>View Course</Button>
            </Link>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default CourseList;
