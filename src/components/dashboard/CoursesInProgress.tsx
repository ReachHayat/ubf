
import React, { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import CourseProgressCard from "./CourseProgressCard";

const coursesInProgress = [
  {
    id: 1,
    title: "Learn Angular.js from scratch to experts",
    category: "Frontend Development",
    logo: "A",
    bgColor: "bg-red-500",
    progress: 80,
    hoursCompleted: 2.5,
    totalHours: 4.5
  },
  {
    id: 2,
    title: "Figma from A to Z",
    category: "UI/UX Design",
    logo: "F",
    bgColor: "bg-blue-500",
    progress: 35,
    hoursCompleted: 2.35,
    totalHours: 4.3
  },
  {
    id: 3,
    title: "Bitbucket, the complete guide with real world projects",
    category: "Backend Development",
    logo: "B",
    bgColor: "bg-blue-600",
    progress: 80,
    hoursCompleted: 2.35,
    totalHours: 4.3
  }
];

const CoursesInProgress = () => {
  const [courseStartIndex, setCourseStartIndex] = useState(0);
  
  const handleNextCourse = () => {
    if (courseStartIndex + 3 < coursesInProgress.length) {
      setCourseStartIndex(courseStartIndex + 1);
    }
  };

  const handlePrevCourse = () => {
    if (courseStartIndex > 0) {
      setCourseStartIndex(courseStartIndex - 1);
    }
  };

  const visibleCourses = coursesInProgress.slice(courseStartIndex, courseStartIndex + 3);

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">Courses In Progress</h2>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="icon" 
            className="rounded-full" 
            onClick={handlePrevCourse}
            disabled={courseStartIndex === 0}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button 
            variant="outline" 
            size="icon" 
            className="rounded-full"
            onClick={handleNextCourse}
            disabled={courseStartIndex + 3 >= coursesInProgress.length}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {visibleCourses.map((course) => (
          <CourseProgressCard key={course.id} {...course} />
        ))}
      </div>
    </div>
  );
};

export default CoursesInProgress;
