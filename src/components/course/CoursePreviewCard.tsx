
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, Clock, Users } from 'lucide-react';
import { Course } from '@/types/course';

interface CoursePreviewCardProps {
  course: Course;
  isEnrolled?: boolean;
  hideActions?: boolean;
}

export const CoursePreviewCard: React.FC<CoursePreviewCardProps> = ({
  course,
  isEnrolled = false,
  hideActions = false
}) => {
  const navigate = useNavigate();

  const handleViewCourse = () => {
    navigate(`/course/preview/${course.id}`);
  };
  
  const handleContinueLearning = () => {
    navigate(`/course/${course.id}`);
  };

  return (
    <Card className="h-full flex flex-col overflow-hidden hover:shadow-md transition-shadow">
      <div className="relative">
        {course.thumbnail ? (
          <div className="aspect-video overflow-hidden">
            <img 
              src={course.thumbnail} 
              alt={course.title} 
              className="w-full h-full object-cover transition-transform hover:scale-105"
            />
          </div>
        ) : (
          <div className={`aspect-video ${course.bgColor || 'bg-primary'} flex items-center justify-center`}>
            <div className="text-3xl font-bold text-white">
              {course.logo || course.title.substring(0, 1)}
            </div>
          </div>
        )}
        
        <Badge 
          className="absolute top-2 right-2"
          variant={isEnrolled ? "secondary" : "outline"}
        >
          {isEnrolled ? 'Enrolled' : course.category}
        </Badge>
      </div>
      
      <CardContent className="pt-4 flex-grow">
        <h3 className="font-semibold text-lg mb-2">{course.title}</h3>
        
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
          <div className="flex items-center">
            <Clock className="w-3 h-3 mr-1" />
            {course.totalHours}h
          </div>
          <div className="flex items-center">
            <Users className="w-3 h-3 mr-1" />
            {course.reviews || 0}
          </div>
        </div>
        
        {course.rating ? (
          <div className="flex items-center text-sm">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star 
                  key={i}
                  className={`w-3 h-3 ${i < Math.round(course.rating) ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}`}
                />
              ))}
            </div>
            <span className="ml-1 text-muted-foreground">({course.rating.toFixed(1)})</span>
          </div>
        ) : null}
        
        <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
          {course.description || "No description available"}
        </p>
      </CardContent>
      
      {!hideActions && (
        <CardFooter className="pt-0">
          {isEnrolled ? (
            <Button 
              variant="outline" 
              className="w-full"
              onClick={handleContinueLearning}
            >
              Continue Learning
            </Button>
          ) : (
            <Button 
              variant="outline" 
              className="w-full"
              onClick={handleViewCourse}
            >
              View Course
            </Button>
          )}
        </CardFooter>
      )}
    </Card>
  );
};
