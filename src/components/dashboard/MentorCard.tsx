
import React from "react";
import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";

type MentorCardProps = {
  id: string;
  name: string;
  role: string;
  avatar?: string;
};

const MentorCard = ({
  id,
  name,
  role,
  avatar,
}: MentorCardProps) => {
  return (
    <Card className="p-4 hover:shadow-md transition-shadow duration-200">
      <Link to={`/mentors/${id}`}>
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-accent flex items-center justify-center">
            {avatar ? <img src={avatar} alt={name} className="h-10 w-10 rounded-full" /> : name.charAt(0)}
          </div>
          <div>
            <h3 className="font-medium">{name}</h3>
            <span className="text-xs bg-secondary py-0.5 px-2 rounded-full">
              {role}
            </span>
          </div>
        </div>
      </Link>
    </Card>
  );
};

export default MentorCard;
