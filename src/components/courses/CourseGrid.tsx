
import React from "react";
import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Course } from "@/types/course";
import { EmptyState } from "@/components/ui/empty-state";
import { CoursePreviewCard } from "@/components/course/CoursePreviewCard";

interface CourseGridProps {
  courses: Course[];
  onClearFilters: () => void;
}

const CourseGrid: React.FC<CourseGridProps> = ({ courses, onClearFilters }) => {
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
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {courses.map((course) => (
        <CoursePreviewCard 
          key={course.id} 
          course={course}
          hideActions={false}
        />
      ))}
    </div>
  );
};

export default CourseGrid;
