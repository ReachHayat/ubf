
import React from "react";
import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";

type CategoryCardProps = {
  name: string;
  count: number;
  icon: string;
  color: string;
  path?: string;
};

const CategoryCard = ({
  name,
  count,
  icon,
  color,
  path = "/courses",
}: CategoryCardProps) => {
  return (
    <Link to={path}>
      <Card className="p-6 hover:shadow-md transition-shadow duration-200">
        <div className="flex flex-col items-start gap-4">
          <div
            className={`${color} text-white h-12 w-12 rounded-md flex items-center justify-center font-bold`}
          >
            {icon}
          </div>
          <h3 className="text-lg font-semibold">{name}</h3>
          <div className="flex items-center text-muted-foreground text-sm">
            <span>{count} Courses</span>
          </div>
        </div>
      </Card>
    </Link>
  );
};

export default CategoryCard;
