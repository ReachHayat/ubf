
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Loader2, ArrowRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { enrollmentService, CourseEnrollment } from '@/services/enrollmentService';
import { useAuth } from '@/contexts/AuthContext';
import { EmptyState } from '@/components/ui/empty-state';

const EnrolledCoursesPreview: React.FC = () => {
  const [enrollments, setEnrollments] = useState<CourseEnrollment[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEnrollments = async () => {
      if (!user?.id) return;
      
      setLoading(true);
      try {
        const userEnrollments = await enrollmentService.getEnrollments(user.id);
        // Sort by most recently accessed
        userEnrollments.sort((a, b) => 
          new Date(b.last_accessed_at).getTime() - new Date(a.last_accessed_at).getTime()
        );
        // Take only the 3 most recent enrollments
        setEnrollments(userEnrollments.slice(0, 3));
      } catch (error) {
        console.error("Error fetching enrolled courses:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchEnrollments();
  }, [user]);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>My Courses</CardTitle>
          <CardDescription>Continue your learning journey</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center py-10">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </CardContent>
      </Card>
    );
  }

  if (!enrollments.length) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>My Courses</CardTitle>
          <CardDescription>Continue your learning journey</CardDescription>
        </CardHeader>
        <CardContent>
          <EmptyState
            title="No courses yet"
            description="You haven't enrolled in any courses yet"
            actionLabel="Browse Courses"
            actionHref="/courses"
          />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>My Courses</CardTitle>
          <CardDescription>Continue your learning journey</CardDescription>
        </div>
        <Button 
          variant="ghost" 
          size="sm"
          onClick={() => navigate('/courses')}
          className="hidden sm:flex"
        >
          View All <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent className="space-y-5">
        {enrollments.map((enrollment) => (
          <div key={enrollment.id} className="group">
            <Link to={`/course/${enrollment.course_id}`}>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 group-hover:bg-accent/50 p-2 rounded-md transition-colors">
                <div className={`h-12 w-12 rounded-md text-white flex items-center justify-center shrink-0 ${enrollment.courses?.bgColor || 'bg-primary'}`}>
                  {enrollment.courses?.logo || enrollment.courses?.title?.charAt(0) || 'C'}
                </div>
                <div className="flex-grow w-full">
                  <div className="flex items-start justify-between w-full mb-1">
                    <h4 className="font-medium group-hover:text-primary transition-colors line-clamp-1">
                      {enrollment.courses?.title || 'Untitled Course'}
                    </h4>
                    <span className="text-xs text-muted-foreground whitespace-nowrap">
                      {enrollment.progress}%
                    </span>
                  </div>
                  <Progress value={enrollment.progress} className="h-2" />
                  <p className="text-xs text-muted-foreground mt-1">
                    {enrollment.completion_status === 'completed' 
                      ? 'Completed'
                      : enrollment.completion_status === 'not_started' 
                        ? 'Not started yet'
                        : `In progress`
                    }
                  </p>
                </div>
              </div>
            </Link>
          </div>
        ))}
        <Button 
          variant="outline" 
          className="w-full sm:hidden"
          onClick={() => navigate('/courses')}
        >
          View All Courses
        </Button>
      </CardContent>
    </Card>
  );
};

export default EnrolledCoursesPreview;
