
import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import CoursesInProgress from "@/components/dashboard/CoursesInProgress";
import PopularCategories from "@/components/dashboard/PopularCategories";
import TopMentors from "@/components/dashboard/TopMentors";
import LatestNotes from "@/components/dashboard/LatestNotes";
import { useAuth } from "@/contexts/AuthContext";
import { Link } from "react-router-dom";
import { getCourses, getEnrolledCourses } from "@/components/courses/CourseService";

const Dashboard = () => {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [mentors, setMentors] = useState([]);

  useEffect(() => {
    // Fetch all courses
    const allCourses = getCourses();
    // Filter for enrolled courses
    const enrolledCourses = getEnrolledCourses();
    setCourses(enrolledCourses);
    
    // Extract unique categories from courses
    const uniqueCategories = [...new Set(allCourses.map(course => course.category))];
    setCategories(uniqueCategories);
    
    // Create list of mentors from course instructors
    const instructors = allCourses.map(course => ({
      id: course.instructor.id,
      name: course.instructor.name,
      role: course.instructor.role,
      avatar: course.instructor.avatar
    }));
    // Remove duplicates based on id
    const uniqueMentors = instructors.filter((mentor, index, self) => 
      index === self.findIndex(m => m.id === mentor.id)
    );
    setMentors(uniqueMentors);
  }, [user]);

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
