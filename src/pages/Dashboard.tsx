
import React, { useState, Fragment } from "react";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import SearchBar from "@/components/SearchBar";
import NotificationsPopover from "@/components/NotificationsPopover";
import { ThemeToggle } from "@/components/theme-toggle";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import WelcomeHeader from "@/components/WelcomeHeader";

const coursesInProgress = [
  {
    id: 1,
    title: "Learn Angular.js from scratch to experts",
    category: "Frontend Development",
    logo: "A",
    bgColor: "bg-red-500",
    progress: 80,
    hoursCompleted: 2.5,
    totalHours: 4.5
  },
  {
    id: 2,
    title: "Figma from A to Z",
    category: "UI/UX Design",
    logo: "F",
    bgColor: "bg-blue-500",
    progress: 35,
    hoursCompleted: 2.35,
    totalHours: 4.3
  },
  {
    id: 3,
    title: "Bitbucket, the complete guide with real world projects",
    category: "Backend Development",
    logo: "B",
    bgColor: "bg-blue-600",
    progress: 80,
    hoursCompleted: 2.35,
    totalHours: 4.3
  }
];

const popularCategories = [
  {
    id: 1,
    name: "Docker",
    courses: 220,
    hours: "123:24h",
    logo: "D",
    bgColor: "bg-blue-400",
    path: "/courses?category=docker"
  },
  {
    id: 2,
    name: "GitLab",
    courses: 220,
    hours: "123:24h",
    logo: "G",
    bgColor: "bg-orange-500",
    path: "/courses?category=gitlab"
  },
  {
    id: 3,
    name: "C#",
    courses: 220,
    hours: "123:24h",
    logo: "C",
    bgColor: "bg-purple-500",
    path: "/courses?category=csharp"
  },
  {
    id: 4,
    name: "Webflow",
    courses: 220,
    hours: "123:24h",
    logo: "W",
    bgColor: "bg-blue-600",
    path: "/courses?category=webflow"
  }
];

const topMentors = [
  {
    id: 1,
    name: "Guy Hawkins",
    areas: ["Frontend Development", "Backend Development"],
    courses: 145,
    followers: 1287,
    rating: 4.5,
    path: "/profile/mentor/1"
  },
  {
    id: 2,
    name: "Crystal Lucas",
    areas: ["UI / UX Design"],
    courses: 55,
    followers: 423,
    rating: 4.8,
    path: "/profile/mentor/2"
  },
  {
    id: 3,
    name: "Melissa Stevens",
    areas: ["Interaction Design", "Web Design", "Backend Development"],
    courses: 25,
    followers: 521,
    rating: 5.0,
    path: "/profile/mentor/3"
  },
  {
    id: 4,
    name: "Peter Russell",
    areas: ["Android Development", "Version Control"],
    courses: 215,
    followers: 112,
    rating: 4.0,
    path: "/profile/mentor/4"
  }
];

const Dashboard = () => {
  const { user } = useAuth();
  const [courseStartIndex, setCourseStartIndex] = useState(0);
  
  const handleNextCourse = () => {
    if (courseStartIndex + 3 < coursesInProgress.length) {
      setCourseStartIndex(courseStartIndex + 1);
    }
  };

  const handlePrevCourse = () => {
    if (courseStartIndex > 0) {
      setCourseStartIndex(courseStartIndex - 1);
    }
  };

  const visibleCourses = coursesInProgress.slice(courseStartIndex, courseStartIndex + 3);

  return (
    <Fragment>
      <WelcomeHeader />
      
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">Courses In Progress</h2>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="icon" 
              className="rounded-full" 
              onClick={handlePrevCourse}
              disabled={courseStartIndex === 0}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button 
              variant="outline" 
              size="icon" 
              className="rounded-full"
              onClick={handleNextCourse}
              disabled={courseStartIndex + 3 >= coursesInProgress.length}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {visibleCourses.map((course) => (
            <Card key={course.id} className="overflow-hidden">
              <div className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className={`${course.bgColor} text-white h-10 w-10 rounded-md flex items-center justify-center font-bold`}>
                    {course.logo}
                  </div>
                  <span className="text-sm text-muted-foreground">{course.category}</span>
                </div>
                
                <h3 className="text-lg font-semibold mb-4">{course.title}</h3>
                
                <Progress value={course.progress} className="h-2 mb-2" />
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    {course.hoursCompleted}h of {course.totalHours}h
                  </span>
                  <span className="text-sm font-medium">{course.progress}%</span>
                </div>
                
                <Link to={`/courses/${course.id}`}>
                  <Button variant="outline" className="w-full mt-4">
                    Continue
                  </Button>
                </Link>
              </div>
            </Card>
          ))}
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">Popular Categories</h2>
          <Link to="/courses">
            <Button variant="ghost" className="text-primary" size="sm">
              View All
              <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {popularCategories.map((category) => (
            <Link to={category.path} key={category.id}>
              <Card className="p-6 hover:shadow-md transition-shadow duration-200">
                <div className="flex flex-col items-start gap-4">
                  <div className={`${category.bgColor} text-white h-12 w-12 rounded-md flex items-center justify-center font-bold`}>
                    {category.logo}
                  </div>
                  <h3 className="text-lg font-semibold">{category.name}</h3>
                  <div className="flex items-center text-muted-foreground text-sm">
                    <span>{category.courses} Courses</span>
                    <span className="mx-2">•</span>
                    <span>{category.hours}</span>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">Top Mentors</h2>
          <Link to="/community">
            <Button variant="ghost" className="text-primary" size="sm">
              View All
              <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          </Link>
        </div>

        <div className="space-y-4">
          {topMentors.map((mentor) => (
            <Link to={mentor.path} key={mentor.id}>
              <Card className="p-4 hover:shadow-md transition-shadow duration-200">
                <div className="flex items-center">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-accent flex items-center justify-center">
                      {mentor.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-medium">{mentor.name}</h3>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {mentor.areas.map((area, index) => (
                          <span key={index} className="text-xs bg-secondary py-0.5 px-2 rounded-full">
                            {area}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <div className="ml-auto flex items-center gap-6">
                    <span className="text-xs text-muted-foreground">{mentor.courses} Courses</span>
                    <div className="flex items-center gap-1">
                      <span className="text-xs bg-secondary py-0.5 px-2 rounded-full">
                        +{mentor.followers}
                      </span>
                    </div>
                    <div className="flex items-center">
                      {"★".repeat(Math.floor(mentor.rating))}
                      {"☆".repeat(5 - Math.floor(mentor.rating))}
                      <span className="ml-1 text-sm">({mentor.rating.toFixed(1)})</span>
                    </div>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </Fragment>
  );
};

export default Dashboard;
