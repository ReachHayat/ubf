
import React from "react";
import { Badge } from "@/components/ui/badge";
import { Course } from "@/types/course";

interface CourseOverviewProps {
  course: Course;
  sections: any[];
}

export const CourseOverview: React.FC<CourseOverviewProps> = ({ course, sections }) => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-4">About Course</h2>
        <p className="text-muted-foreground">
          {course.description || "No description available for this course."}
        </p>
      </div>
      
      {course.tags && course.tags.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold mb-4">Tags</h2>
          <div className="flex flex-wrap gap-2">
            {course.tags.map(tag => (
              <Badge key={tag} variant="secondary">{tag}</Badge>
            ))}
          </div>
        </div>
      )}
      
      <div>
        <h2 className="text-xl font-semibold mb-4">What You'll Learn</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {sections.flatMap(section => 
            section.lessons.slice(0, 2).map(lesson => (
              <div key={lesson.id} className="flex items-start gap-2">
                <div className="mt-1 text-green-500">✓</div>
                <p>{lesson.title}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
