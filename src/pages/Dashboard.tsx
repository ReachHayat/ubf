
import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import CoursesInProgress from "@/components/dashboard/CoursesInProgress";
import PopularCategories from "@/components/dashboard/PopularCategories";
import TopMentors from "@/components/dashboard/TopMentors";
import LatestNotes from "@/components/dashboard/LatestNotes";
import { useAuth } from "@/contexts/AuthContext";
import { Link } from "react-router-dom";
import { getCourses, getEnrolledCourses, getAllCategories } from "@/components/courses/CourseService";
import { Course } from "@/types/course";
import { EmptyState } from "@/components/ui/empty-state";

const Dashboard = () => {
  const { user } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [mentors, setMentors] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        
        // Fetch all courses
        const allCourses = await getCourses();
        
        // Filter for enrolled courses
        const enrolledCourses = await getEnrolledCourses();
        setCourses(enrolledCourses);
        
        // Extract unique categories
        const categoriesList = await getAllCategories();
        setCategories(categoriesList.filter(cat => cat !== "All Categories"));
        
        // Create list of mentors from course instructors
        const instructors = Array.from(
          new Map(
            allCourses.map(course => [
              course.instructor.id,
              {
                id: course.instructor.id,
                name: course.instructor.name,
                role: course.instructor.role,
                avatar: course.instructor.avatar
              }
            ])
          ).values()
        );
        setMentors(instructors);
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        setError("Failed to load dashboard data");
      } finally {
        setIsLoading(false);
      }
    };
    
    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <EmptyState
        title="Something went wrong"
        description={error}
        actionLabel="Refresh page"
        onAction={() => window.location.reload()}
      />
    );
  }

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-4xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome to your learning dashboard
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <CoursesInProgress courses={courses} />
          
          {/* Latest Notes */}
          <LatestNotes />
          
          <PopularCategories categories={categories} />
        </div>
        <div className="space-y-6">
          <TopMentors mentors={mentors} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
