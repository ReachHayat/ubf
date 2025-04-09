
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Filter, ChevronDown } from "lucide-react";
import { Input } from "@/components/ui/input";

const allCourses = [
  {
    id: 1,
    title: "Learn Angular.js from scratch to experts",
    category: "Frontend Development",
    logo: "A",
    bgColor: "bg-red-500",
    instructor: "Guy Hawkins",
    progress: 80,
    hoursCompleted: 2.5,
    totalHours: 4.5,
    enrolled: true
  },
  {
    id: 2,
    title: "Figma from A to Z",
    category: "UI/UX Design",
    logo: "F",
    bgColor: "bg-blue-500",
    instructor: "Crystal Lucas",
    progress: 35,
    hoursCompleted: 2.35,
    totalHours: 4.3,
    enrolled: true
  },
  {
    id: 3,
    title: "Bitbucket, the complete guide with real world projects",
    category: "Backend Development",
    logo: "B",
    bgColor: "bg-blue-600",
    instructor: "Melissa Stevens",
    progress: 80,
    hoursCompleted: 2.35,
    totalHours: 4.3,
    enrolled: true
  },
  {
    id: 4,
    title: "React Hooks Mastery",
    category: "Frontend Development",
    logo: "R",
    bgColor: "bg-cyan-500",
    instructor: "Peter Russell",
    totalHours: 6.2,
    enrolled: false
  },
  {
    id: 5,
    title: "Node.js API Development",
    category: "Backend Development",
    logo: "N",
    bgColor: "bg-green-500",
    instructor: "Melissa Stevens",
    totalHours: 8.5,
    enrolled: false
  },
  {
    id: 6,
    title: "Docker for Beginners",
    category: "DevOps",
    logo: "D",
    bgColor: "bg-blue-400",
    instructor: "Guy Hawkins",
    totalHours: 5.0,
    enrolled: false
  }
];

const Courses = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const enrolledCourses = allCourses.filter(course => course.enrolled);
  const availableCourses = allCourses.filter(course => !course.enrolled);
  
  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-4xl font-bold">Courses</h1>
        <p className="text-muted-foreground">Browse and manage your courses</p>
      </header>

      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search courses..." 
            className="pl-9" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            Filters
          </Button>
          <Button variant="outline" className="flex items-center gap-2">
            Category
            <ChevronDown className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <Tabs defaultValue="enrolled" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="enrolled">My Courses</TabsTrigger>
          <TabsTrigger value="all">Available Courses</TabsTrigger>
        </TabsList>
        
        <TabsContent value="enrolled">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {enrolledCourses.map((course) => (
              <Card key={course.id} className="overflow-hidden">
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`${course.bgColor} text-white h-10 w-10 rounded-md flex items-center justify-center font-bold`}>
                      {course.logo}
                    </div>
                    <span className="text-sm text-muted-foreground">{course.category}</span>
                  </div>
                  
                  <h3 className="text-lg font-semibold mb-4">{course.title}</h3>
                  <p className="text-sm text-muted-foreground mb-4">Instructor: {course.instructor}</p>
                  
                  <Progress value={course.progress} className="h-2 mb-2" />
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      {course.hoursCompleted}h of {course.totalHours}h
                    </span>
                    <span className="text-sm font-medium">{course.progress}%</span>
                  </div>
                  
                  <Button variant="default" className="w-full mt-4">
                    Continue
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="all">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {availableCourses.map((course) => (
              <Card key={course.id} className="overflow-hidden">
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`${course.bgColor} text-white h-10 w-10 rounded-md flex items-center justify-center font-bold`}>
                      {course.logo}
                    </div>
                    <span className="text-sm text-muted-foreground">{course.category}</span>
                  </div>
                  
                  <h3 className="text-lg font-semibold mb-4">{course.title}</h3>
                  <p className="text-sm text-muted-foreground mb-4">Instructor: {course.instructor}</p>
                  <p className="text-sm text-muted-foreground mb-4">Duration: {course.totalHours} hours</p>
                  
                  <Button variant="outline" className="w-full mt-4">
                    Enroll Now
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Courses;
