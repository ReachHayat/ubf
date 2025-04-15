
import React from "react";
import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Course } from "@/types/course";

type CourseProgressProps = {
  course: Course;
};

const CourseProgressCard = ({ course }: CourseProgressProps) => {
  return (
    <Card className="overflow-hidden">
      <div className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <div
            className={`${course.bgColor || 'bg-blue-400'} text-white h-10 w-10 rounded-md flex items-center justify-center font-bold`}
          >
            {course.logo || '📚'}
          </div>
          <span className="text-sm text-muted-foreground">{course.category}</span>
        </div>

        <h3 className="text-lg font-semibold mb-4">{course.title}</h3>

        <Progress value={course.progress || 0} className="h-2 mb-2" />

        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">
            {course.hoursCompleted || 0}h of {course.totalHours}h
          </span>
          <span className="text-sm font-medium">{course.progress || 0}%</span>
        </div>

        <Link to={`/courses/${course.id}`}>
          <Button variant="outline" className="w-full mt-4">
            Continue
          </Button>
        </Link>
      </div>
    </Card>
  );
};

export default CourseProgressCard;
