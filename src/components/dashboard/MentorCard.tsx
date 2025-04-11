
import React from "react";
import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";

type MentorCardProps = {
  id: number;
  name: string;
  areas: string[];
  courses: number;
  followers: number;
  rating: number;
  path: string;
};

const MentorCard = ({
  id,
  name,
  areas,
  courses,
  followers,
  rating,
  path,
}: MentorCardProps) => {
  return (
    <Link to={path} key={id}>
      <Card className="p-4 hover:shadow-md transition-shadow duration-200">
        <div className="flex items-center">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-accent flex items-center justify-center">
              {name.charAt(0)}
            </div>
            <div>
              <h3 className="font-medium">{name}</h3>
              <div className="flex flex-wrap gap-1 mt-1">
                {areas.map((area, index) => (
                  <span key={index} className="text-xs bg-secondary py-0.5 px-2 rounded-full">
                    {area}
                  </span>
                ))}
              </div>
            </div>
          </div>
          
          <div className="ml-auto flex items-center gap-6">
            <span className="text-xs text-muted-foreground">{courses} Courses</span>
            <div className="flex items-center gap-1">
              <span className="text-xs bg-secondary py-0.5 px-2 rounded-full">
                +{followers}
              </span>
            </div>
            <div className="flex items-center">
              {"★".repeat(Math.floor(rating))}
              {"☆".repeat(5 - Math.floor(rating))}
              <span className="ml-1 text-sm">({rating.toFixed(1)})</span>
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
};

export default MentorCard;
