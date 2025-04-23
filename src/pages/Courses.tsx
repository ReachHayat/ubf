
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Filter, ChevronDown, Grid, List, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Link, Routes, Route, useNavigate, useSearchParams } from "react-router-dom";
import CourseDetail from "./CourseDetail";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  getCourses, 
  filterAndSortCourses, 
  getAllCategories,
  getEnrolledCourses
} from "@/components/courses/CourseService";
import { Course } from "@/types/course";
import { EmptyState } from "@/components/ui/empty-state";

const CoursesArchive = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get("tab") || "enrolled";
  
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [selectedSort, setSelectedSort] = useState("Most Popular");
  const [categories, setCategories] = useState<string[]>(["All Categories"]);
  const [allCourses, setAllCourses] = useState<Course[]>([]);
  const [enrolledCourses, setEnrolledCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const sortOptions = [
    "Most Popular",
    "Highest Rated",
    "Newest",
    "Oldest",
    "Price Low to High",
    "Price High to Low"
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        
        // Load all courses and categories
        const coursesList = await getCourses();
        setAllCourses(coursesList);
        
        // Get enrolled courses
        const userEnrolledCourses = await getEnrolledCourses();
        setEnrolledCourses(userEnrolledCourses);
        
        // Get all categories
        const categoriesList = await getAllCategories();
        setCategories(categoriesList);
      } catch (err) {
        console.error("Error fetching courses data:", err);
        setError("Failed to load courses");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  // Handle tab change
  const handleTabChange = (value: string) => {
    setSearchParams({ tab: value });
  };

  // Filter and sort the courses based on current criteria
  const filteredCourses = filterAndSortCourses(
    allCourses, 
    searchQuery, 
    selectedCategory, 
    selectedSort
  );
  
  // Separate enrolled from available courses
  const availableCourses = filteredCourses.filter(course => 
    !enrolledCourses.some(enrolledCourse => enrolledCourse.id === course.id)
  );

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin mb-4" />
        <p className="text-muted-foreground">Loading courses...</p>
      </div>
    );
  }

  if (error) {
    return (
      <EmptyState
        title="Failed to load courses"
        description={error}
        actionLabel="Try again"
        onAction={() => window.location.reload()}
      />
    );
  }

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
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                Category: {selectedCategory}
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {categories.map((category) => (
                <DropdownMenuItem
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                Sort: {selectedSort}
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {sortOptions.map((option) => (
                <DropdownMenuItem
                  key={option}
                  onClick={() => setSelectedSort(option)}
                >
                  {option}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          
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

      <Tabs 
        value={activeTab} 
        className="w-full"
        onValueChange={handleTabChange}
      >
        <TabsList className="mb-6">
          <TabsTrigger value="enrolled">My Courses</TabsTrigger>
          <TabsTrigger value="all">Course Archive</TabsTrigger>
        </TabsList>
        
        <TabsContent value="enrolled">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {enrolledCourses.length > 0 ? (
              enrolledCourses.map((course) => (
                <Card key={course.id} className="overflow-hidden">
                  <div className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className={`${course.bgColor} text-white h-10 w-10 rounded-md flex items-center justify-center font-bold`}>
                        {course.logo || course.title.substring(0, 1)}
                      </div>
                      <span className="text-sm text-muted-foreground">{course.category}</span>
                    </div>
                    
                    <h3 className="text-lg font-semibold mb-4">{course.title}</h3>
                    <p className="text-sm text-muted-foreground mb-4">Instructor: {course.instructor.name}</p>
                    
                    <Progress value={course.progress || 0} className="h-2 mb-2" />
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">
                        {course.hoursCompleted?.toFixed(1) || 0}h of {course.totalHours}h
                      </span>
                      <span className="text-sm font-medium">{course.progress || 0}%</span>
                    </div>
                    
                    <Link to={`/course/${course.id}`}>
                      <Button variant="default" className="w-full mt-4">
                        Continue
                      </Button>
                    </Link>
                  </div>
                </Card>
              ))
            ) : (
              <div className="col-span-3">
                <EmptyState
                  title="No enrolled courses"
                  description="You haven't enrolled in any courses yet."
                  actionLabel="Browse Courses"
                  actionHref="/courses?tab=all"
                />
              </div>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="all">
          {availableCourses.length > 0 ? (
            viewMode === "grid" ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {availableCourses.map((course) => (
                  <Card key={course.id} className="overflow-hidden">
                    <div className="p-6">
                      <div className="flex items-center gap-3 mb-4">
                        <div className={`${course.bgColor} text-white h-10 w-10 rounded-md flex items-center justify-center font-bold`}>
                          {course.logo || course.title.substring(0, 1)}
                        </div>
                        <span className="text-sm text-muted-foreground">{course.category}</span>
                      </div>
                      
                      <h3 className="text-lg font-semibold mb-2">{course.title}</h3>
                      
                      <div className="flex items-center gap-2 mb-4">
                        <div className="flex items-center">
                          {"★".repeat(Math.floor(course.rating || 0))}
                          {"☆".repeat(5 - Math.floor(course.rating || 0))}
                        </div>
                        <span className="text-sm text-muted-foreground">({course.reviews || 0} reviews)</span>
                      </div>
                      
                      <p className="text-sm text-muted-foreground mb-4">Instructor: {course.instructor.name}</p>
                      <p className="text-sm text-muted-foreground mb-4">Duration: {course.totalHours} hours</p>
                      
                      <Link to={`/course/${course.id}`}>
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
                        {course.logo || course.title.substring(0, 1)}
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">{course.category}</Badge>
                          <div className="flex items-center ml-auto">
                            <div className="flex items-center">
                              {"★".repeat(Math.floor(course.rating || 0))}
                              {"☆".repeat(5 - Math.floor(course.rating || 0))}
                            </div>
                            <span className="text-sm text-muted-foreground ml-1">({course.reviews || 0})</span>
                          </div>
                        </div>
                        
                        <h3 className="text-lg font-semibold mt-1">{course.title}</h3>
                        
                        <div className="flex items-center text-sm text-muted-foreground mt-1">
                          <p>By {course.instructor.name}</p>
                          <span className="mx-2">•</span>
                          <p>{course.totalHours} hours</p>
                        </div>
                      </div>
                      
                      <Link to={`/course/${course.id}`} className="ml-4">
                        <Button>View Course</Button>
                      </Link>
                    </div>
                  </Card>
                ))}
              </div>
            )
          ) : (
            <EmptyState
              title="No courses found"
              description="No courses match your search criteria."
              actionLabel="Clear Filters"
              onAction={() => {
                setSearchQuery("");
                setSelectedCategory("All Categories");
              }}
            />
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
