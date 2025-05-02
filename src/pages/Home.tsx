
import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { Link } from "react-router-dom";
import { courseService } from "@/services/courseService";
import { Course } from "@/types/course";
import { enrollmentService, CourseEnrollment } from "@/services/enrollmentService";
import EnrolledCoursesPreview from "@/components/dashboard/EnrolledCoursesPreview";
import { CoursePreviewCard } from "@/components/course/CoursePreviewCard";

export const Home: React.FC = () => {
  const [featuredCourses, setFeaturedCourses] = useState<Course[]>([]);
  const [enrollments, setEnrollments] = useState<CourseEnrollment[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchHomeData = async () => {
      setLoading(true);
      try {
        // Get all courses
        const allCourses = await courseService.getCourses();
        
        // Sort by highest rated
        const topRatedCourses = [...allCourses].sort((a, b) => (b.rating || 0) - (a.rating || 0)).slice(0, 4);
        setFeaturedCourses(topRatedCourses);
        
        // Get user enrollments if logged in
        if (user && user.id) {
          const userEnrollments = await enrollmentService.getEnrollments(user.id);
          setEnrollments(userEnrollments);
        }
      } catch (error) {
        console.error("Error fetching home data:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchHomeData();
  }, [user]);

  // Check if course is in user enrollments
  const isEnrolled = (courseId: string): boolean => {
    return enrollments.some(enrollment => enrollment.course_id === courseId);
  };

  return (
    <div className="space-y-10">
      {/* Hero Section */}
      <section className="text-center py-12 px-4 bg-gradient-to-b from-background to-muted/30 rounded-lg">
        <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-4">
          Ultimate Brand Framework
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
          Master the art of branding with expert-led courses, hands-on assignments and personalized feedback.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Button asChild size="lg">
            <Link to="/courses">Browse Courses</Link>
          </Button>
        </div>
      </section>
      
      {/* Enrolled Courses Section */}
      {user && (
        <section className="space-y-6">
          <EnrolledCoursesPreview />
        </section>
      )}
      
      {/* Featured Courses */}
      <section className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold">Featured Courses</h2>
            <p className="text-muted-foreground">Top-rated courses to help you grow</p>
          </div>
          <Button variant="outline" asChild>
            <Link to="/courses">View All</Link>
          </Button>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredCourses.map(course => (
            <CoursePreviewCard 
              key={course.id} 
              course={course} 
              isEnrolled={isEnrolled(course.id)}
            />
          ))}
          
          {featuredCourses.length === 0 && !loading && (
            <div className="col-span-full text-center py-12 text-muted-foreground">
              No featured courses available at the moment.
            </div>
          )}
        </div>
      </section>
    </div>
  );
};
