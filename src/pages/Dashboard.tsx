
import React, { Fragment, useEffect, useState } from "react";
import WelcomeHeader from "@/components/WelcomeHeader";
import CoursesInProgress from "@/components/dashboard/CoursesInProgress";
import PopularCategories from "@/components/dashboard/PopularCategories";
import TopMentors from "@/components/dashboard/TopMentors";
import { getCourses, getEnrolledCourses } from "@/components/courses/CourseService";
import { Course } from "@/types/course";
import { useAuth } from "@/contexts/AuthContext";

const Dashboard = () => {
  const { user } = useAuth();
  const [enrolledCourses, setEnrolledCourses] = useState<Course[]>([]);
  const [allCourses, setAllCourses] = useState<Course[]>([]);
  
  useEffect(() => {
    // Get courses data
    const courses = getCourses();
    setAllCourses(courses);
    
    // Get enrolled courses
    const userEnrolledCourses = getEnrolledCourses();
    setEnrolledCourses(userEnrolledCourses);
  }, []);
  
  // Extract categories from all courses
  const categories = Array.from(new Set(allCourses.map(course => course.category)));
  
  // Extract instructors as mentors
  const mentors = Array.from(
    new Map(allCourses.map(course => [course.instructor.id, course.instructor])).values()
  );
  
  return (
    <Fragment>
      <WelcomeHeader />
      
      <div className="space-y-8">
        <CoursesInProgress courses={enrolledCourses} />
        <PopularCategories categories={categories} />
        <TopMentors mentors={mentors} />
      </div>
    </Fragment>
  );
};

export default Dashboard;
