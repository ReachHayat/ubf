
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Filter, ChevronDown, Grid, List } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Link, Routes, Route, useNavigate } from "react-router-dom";
import CourseDetail from "./CourseDetail";
import { Badge } from "@/components/ui/badge";

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
    enrolled: true,
    rating: 4.7,
    reviews: 256
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
    enrolled: true,
    rating: 4.8,
    reviews: 126
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
    enrolled: true,
    rating: 4.6,
    reviews: 98
  },
  {
    id: 4,
    title: "React Hooks Mastery",
    category: "Frontend Development",
    logo: "R",
    bgColor: "bg-cyan-500",
    instructor: "Peter Russell",
    totalHours: 6.2,
    enrolled: false,
    rating: 4.9,
    reviews: 312
  },
  {
    id: 5,
    title: "Node.js API Development",
    category: "Backend Development",
    logo: "N",
    bgColor: "bg-green-500",
    instructor: "Melissa Stevens",
    totalHours: 8.5,
    enrolled: false,
    rating: 4.5,
    reviews: 187
  },
  {
    id: 6,
    title: "Docker for Beginners",
    category: "DevOps",
    logo: "D",
    bgColor: "bg-blue-400",
    instructor: "Guy Hawkins",
    totalHours: 5.0,
    enrolled: false,
    rating: 4.4,
    reviews: 143
  },
  {
    id: 7,
    title: "Advanced CSS Layouts",
    category: "Frontend Development",
    logo: "C",
    bgColor: "bg-purple-500",
    instructor: "Crystal Lucas",
    totalHours: 4.8,
    enrolled: false,
    rating: 4.7,
    reviews: 205
  },
  {
    id: 8,
    title: "Python Data Science Fundamentals",
    category: "Data Science",
    logo: "P",
    bgColor: "bg-yellow-500",
    instructor: "Peter Russell",
    totalHours: 10.5,
    enrolled: false,
    rating: 4.8,
    reviews: 276
  }
];

const categories = [
  "All Categories",
  "Frontend Development",
  "Backend Development",
  "UI/UX Design",
  "DevOps",
  "Data Science"
];

const sortOptions = [
  "Most Popular",
  "Highest Rated",
  "Newest",
  "Oldest",
  "Price Low to High",
  "Price High to Low"
];

const CoursesArchive = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [selectedSort, setSelectedSort] = useState("Most Popular");

  const enrolledCourses = allCourses.filter(course => course.enrolled);
  
  // Filter available courses based on search query and category
  const filteredCourses = allCourses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        course.instructor.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        course.category.toLowerCase().includes(searchQuery.toLowerCase());
                        
    const matchesCategory = selectedCategory === "All Categories" || 
                          course.category === selectedCategory;
                          
    return matchesSearch && matchesCategory;
  });
  
  const availableCourses = filteredCourses.filter(course => !course.enrolled);

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
        <div className="flex flex-wrap gap-2">
          <div className="relative">
            <Button variant="outline" className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              Category: {selectedCategory}
              <ChevronDown className="h-4 w-4" />
            </Button>
            <div className="absolute top-full right-0 z-10 mt-1 w-56 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none hidden">
              {categories.map((category) => (
                <button
                  key={category}
                  className="block w-full px-4 py-2 text-left text-sm hover:bg-gray-100"
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
          <div className="relative">
            <Button variant="outline" className="flex items-center gap-2">
              Sort: {selectedSort}
              <ChevronDown className="h-4 w-4" />
            </Button>
            <div className="absolute top-full right-0 z-10 mt-1 w-56 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none hidden">
              {sortOptions.map((option) => (
                <button
                  key={option}
                  className="block w-full px-4 py-2 text-left text-sm hover:bg-gray-100"
                  onClick={() => setSelectedSort(option)}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
          <div className="flex border rounded-md">
            <Button
              variant={viewMode === "grid" ? "default" : "ghost"}
              size="icon"
              className="rounded-none rounded-l-md"
              onClick={() => setViewMode("grid")}
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "ghost"}
              size="icon"
              className="rounded-none rounded-r-md"
              onClick={() => setViewMode("list")}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <Tabs defaultValue="enrolled" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="enrolled">My Courses</TabsTrigger>
          <TabsTrigger value="all">Course Archive</TabsTrigger>
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
                  
                  <Link to={`/courses/${course.id}`}>
                    <Button variant="default" className="w-full mt-4">
                      Continue
                    </Button>
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="all">
          {viewMode === "grid" ? (
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
                    
                    <h3 className="text-lg font-semibold mb-2">{course.title}</h3>
                    
                    <div className="flex items-center gap-2 mb-4">
                      <div className="flex items-center">
                        {"★".repeat(Math.floor(course.rating))}
                        {"☆".repeat(5 - Math.floor(course.rating))}
                      </div>
                      <span className="text-sm text-muted-foreground">({course.reviews} reviews)</span>
                    </div>
                    
                    <p className="text-sm text-muted-foreground mb-4">Instructor: {course.instructor}</p>
                    <p className="text-sm text-muted-foreground mb-4">Duration: {course.totalHours} hours</p>
                    
                    <Link to={`/courses/${course.id}`}>
                      <Button variant="outline" className="w-full mt-4">
                        View Course
                      </Button>
                    </Link>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {availableCourses.map((course) => (
                <Card key={course.id} className="overflow-hidden">
                  <div className="p-4 flex items-center">
                    <div className={`${course.bgColor} text-white h-16 w-16 rounded-md flex items-center justify-center font-bold mr-4`}>
                      {course.logo}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">{course.category}</Badge>
                        <div className="flex items-center ml-auto">
                          <div className="flex items-center">
                            {"★".repeat(Math.floor(course.rating))}
                            {"☆".repeat(5 - Math.floor(course.rating))}
                          </div>
                          <span className="text-sm text-muted-foreground ml-1">({course.reviews})</span>
                        </div>
                      </div>
                      
                      <h3 className="text-lg font-semibold mt-1">{course.title}</h3>
                      
                      <div className="flex items-center text-sm text-muted-foreground mt-1">
                        <p>By {course.instructor}</p>
                        <span className="mx-2">•</span>
                        <p>{course.totalHours} hours</p>
                      </div>
                    </div>
                    
                    <Link to={`/courses/${course.id}`} className="ml-4">
                      <Button>View Course</Button>
                    </Link>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

const Courses = () => {
  return (
    <Routes>
      <Route index element={<CoursesArchive />} />
      <Route path=":id" element={<CourseDetail />} />
    </Routes>
  );
};

export default Courses;
