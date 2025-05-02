
import { useState, useEffect } from "react";
import { Routes, Route, useSearchParams } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2 } from "lucide-react";
import CourseDetail from "./CourseDetail";
import { 
  getCourses, 
  filterAndSortCourses, 
  getAllCategories,
  getEnrolledCourses
} from "@/components/courses/CourseService";
import { Course } from "@/types/course";
import { EmptyState } from "@/components/ui/empty-state";
import CourseFilters from "@/components/courses/CourseFilters";
import CourseGrid from "@/components/courses/CourseGrid";
import CourseList from "@/components/courses/CourseList";
import EnrolledCoursesList from "@/components/courses/EnrolledCoursesList";

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

  // Clear filters
  const handleClearFilters = () => {
    setSearchQuery("");
    setSelectedCategory("All Categories");
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

      <CourseFilters 
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        selectedSort={selectedSort}
        setSelectedSort={setSelectedSort}
        viewMode={viewMode}
        setViewMode={setViewMode}
        categories={categories}
        sortOptions={sortOptions}
      />

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
          <EnrolledCoursesList courses={enrolledCourses} />
        </TabsContent>
        
        <TabsContent value="all">
          {viewMode === "grid" ? (
            <CourseGrid 
              courses={availableCourses} 
              onClearFilters={handleClearFilters}
            />
          ) : (
            <CourseList 
              courses={availableCourses} 
              onClearFilters={handleClearFilters}
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
