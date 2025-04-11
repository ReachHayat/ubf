
import React from "react";
import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";

type CourseProgressProps = {
  id: number;
  title: string;
  category: string;
  logo: string;
  bgColor: string;
  progress: number;
  hoursCompleted: number;
  totalHours: number;
};

const CourseProgressCard = ({
  id,
  title,
  category,
  logo,
  bgColor,
  progress,
  hoursCompleted,
  totalHours,
}: CourseProgressProps) => {
  return (
    <Card className="overflow-hidden">
      <div className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <div
            className={`${bgColor} text-white h-10 w-10 rounded-md flex items-center justify-center font-bold`}
          >
            {logo}
          </div>
          <span className="text-sm text-muted-foreground">{category}</span>
        </div>

        <h3 className="text-lg font-semibold mb-4">{title}</h3>

        <Progress value={progress} className="h-2 mb-2" />

        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">
            {hoursCompleted}h of {totalHours}h
          </span>
          <span className="text-sm font-medium">{progress}%</span>
        </div>

        <Link to={`/courses/${id}`}>
          <Button variant="outline" className="w-full mt-4">
            Continue
          </Button>
        </Link>
      </div>
    </Card>
  );
};

export default CourseProgressCard;
