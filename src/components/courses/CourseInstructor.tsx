
import React from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { User, Star } from "lucide-react";

interface CourseInstructorProps {
  instructor: {
    id: string;
    name: string;
    role: string;
    avatar?: string;
  };
  rating?: number;
  category: string;
  onViewProfile: (userId: string) => void;
}

export const CourseInstructor: React.FC<CourseInstructorProps> = ({
  instructor,
  rating,
  category,
  onViewProfile
}) => {
  return (
    <Card className="p-6">
      <div className="flex items-center gap-4">
        <Avatar className="h-16 w-16 cursor-pointer" onClick={() => onViewProfile(instructor.id)}>
          {instructor.avatar ? (
            <AvatarImage src={instructor.avatar} />
          ) : (
            <AvatarFallback className="text-xl">{instructor.name.charAt(0)}</AvatarFallback>
          )}
        </Avatar>
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-bold" onClick={() => onViewProfile(instructor.id)} style={{ cursor: "pointer" }}>
              {instructor.name}
            </h3>
            <User className="h-4 w-4 text-muted-foreground cursor-pointer" onClick={() => onViewProfile(instructor.id)} />
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span className="font-medium">({rating || 4.5})</span>
          </div>
          <p className="text-muted-foreground">{instructor.role}</p>
        </div>
      </div>
      
      <p className="mt-4 text-muted-foreground">
        {instructor.name} is an experienced instructor specializing in {category}. 
        With numerous courses and high student satisfaction, they're committed to providing 
        high-quality educational content.
      </p>
      
      <div className="mt-4 flex flex-wrap gap-2">
        <Badge variant="secondary">{category} Expert</Badge>
        <Badge variant="secondary">Course Creator</Badge>
        <Badge variant="secondary">Professional Instructor</Badge>
      </div>
    </Card>
  );
};
