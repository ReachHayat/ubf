
import React from "react";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, Clock, Edit, ChevronLeft } from "lucide-react";

interface CourseHeaderProps {
  course: {
    id: string;
    title: string;
    category: string;
    rating?: number;
    reviews?: number;
    totalHours: number;
    sections: any[];
    thumbnail?: string;
  };
  isAdmin: boolean;
  onEdit: () => void;
}

export const CourseHeader: React.FC<CourseHeaderProps> = ({ course, isAdmin, onEdit }) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Link to="/courses" className="flex items-center">
          <ChevronLeft className="h-4 w-4 mr-1" />
          Courses
        </Link>
        <span>/</span>
        <Link to="/courses" className="hover:underline">{course.category}</Link>
        <span>/</span>
        <span className="text-foreground">{course.title}</span>
      </div>

      <div className="relative">
        {course.thumbnail && (
          <div className="rounded-lg overflow-hidden relative aspect-video">
            <img 
              src={course.thumbnail} 
              alt={course.title} 
              className="w-full h-full object-cover"
            />
          </div>
        )}
        
        {isAdmin && (
          <Button 
            variant="outline" 
            className="absolute top-4 right-4" 
            onClick={onEdit}
          >
            <Edit className="h-4 w-4 mr-2" />
            Edit Course
          </Button>
        )}
      </div>

      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
        <Badge variant="outline">{course.category}</Badge>
        <div className="flex items-center gap-1">
          <span>{course.sections.reduce((total, section) => total + section.lessons.length, 0)} lessons</span>
          <span>•</span>
          <Clock className="h-3 w-3" />
          <span>{course.totalHours}h</span>
        </div>
        <div className="flex items-center gap-1">
          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
          <span>{course.rating || 0} ({course.reviews || 0} reviews)</span>
        </div>
      </div>
    </div>
  );
};
