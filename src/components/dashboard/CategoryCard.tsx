
import React from "react";
import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";

type CategoryCardProps = {
  id: number;
  name: string;
  courses: number;
  hours: string;
  logo: string;
  bgColor: string;
  path: string;
};

const CategoryCard = ({
  id,
  name,
  courses,
  hours,
  logo,
  bgColor,
  path,
}: CategoryCardProps) => {
  return (
    <Link to={path} key={id}>
      <Card className="p-6 hover:shadow-md transition-shadow duration-200">
        <div className="flex flex-col items-start gap-4">
          <div
            className={`${bgColor} text-white h-12 w-12 rounded-md flex items-center justify-center font-bold`}
          >
            {logo}
          </div>
          <h3 className="text-lg font-semibold">{name}</h3>
          <div className="flex items-center text-muted-foreground text-sm">
            <span>{courses} Courses</span>
            <span className="mx-2">•</span>
            <span>{hours}</span>
          </div>
        </div>
      </Card>
    </Link>
  );
};

export default CategoryCard;
