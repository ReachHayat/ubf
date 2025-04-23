
import { Course } from "@/types/course";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

// Get all courses
export const getCourses = async (): Promise<Course[]> => {
  try {
    const { data: coursesData, error } = await supabase
      .from('courses')
      .select(`
        *,
        category:course_categories(name),
        instructor:instructors(*)
      `)
      .eq('status', 'published')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    
    if (!coursesData || coursesData.length === 0) {
      return [];
    }
    
    const courses: Course[] = coursesData.map((course) => ({
      id: course.id,
      title: course.title,
      description: course.description || "",
      category: course.category?.name || "Uncategorized",
      instructor: {
        id: course.instructor?.id || "",
        name: course.instructor?.name || "Unknown",
        role: course.instructor?.role || "Instructor",
        avatar: course.instructor?.avatar || "",
      },
      thumbnail: course.thumbnail || "",
      rating: course.rating || 0,
      reviews: course.reviews || 0,
      totalHours: Number(course.total_hours) || 0,
      status: course.status as 'published' | 'draft',
      lastUpdated: course.updated_at,
      price: course.price || 0,
      tags: course.tags || [],
      logo: course.logo || "",
      bgColor: course.bg_color || "bg-blue-500",
    }));
    
    return courses;
  } catch (error) {
    console.error("Error fetching courses:", error);
    toast({
      title: "Error fetching courses",
      description: "Please try again later",
      variant: "destructive",
    });
    return [];
  }
};

// Get courses that the current user is enrolled in
export const getEnrolledCourses = async (): Promise<Course[]> => {
  try {
    // First, get the current user's ID
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return [];
    }
    
    // For now, we'll return a subset of all courses as "enrolled"
    // In a real implementation, you would have an enrollments table to track this
    const allCourses = await getCourses();
    
    // Simulate enrollment (in real app, fetch from enrollments table)
    const enrolledCourses = allCourses.slice(0, 2).map(course => ({
      ...course,
      enrolled: true,
      progress: Math.floor(Math.random() * 100),
      hoursCompleted: Math.floor(course.totalHours * Math.random() * 10) / 10
    }));
    
    return enrolledCourses;
  } catch (error) {
    console.error("Error fetching enrolled courses:", error);
    toast({
      title: "Error fetching your courses",
      description: "Please try again later",
      variant: "destructive",
    });
    return [];
  }
};

// Filter and sort courses based on search query, category, etc.
export const filterAndSortCourses = (
  courses: Course[],
  searchQuery: string = "",
  category: string = "All Categories",
  sortBy: string = "Most Popular"
): Course[] => {
  // Filter by search query
  let filteredCourses = courses;
  
  if (searchQuery) {
    searchQuery = searchQuery.toLowerCase();
    filteredCourses = filteredCourses.filter(
      course => course.title.toLowerCase().includes(searchQuery) ||
              course.description.toLowerCase().includes(searchQuery)
    );
  }
  
  // Filter by category
  if (category !== "All Categories") {
    filteredCourses = filteredCourses.filter(
      course => course.category === category
    );
  }
  
  // Sort courses
  switch (sortBy) {
    case "Most Popular":
      filteredCourses.sort((a, b) => (b.reviews || 0) - (a.reviews || 0));
      break;
    case "Highest Rated":
      filteredCourses.sort((a, b) => (b.rating || 0) - (a.rating || 0));
      break;
    case "Newest":
      filteredCourses.sort((a, b) => {
        return new Date(b.lastUpdated || "").getTime() - new Date(a.lastUpdated || "").getTime();
      });
      break;
    case "Oldest":
      filteredCourses.sort((a, b) => {
        return new Date(a.lastUpdated || "").getTime() - new Date(b.lastUpdated || "").getTime();
      });
      break;
    case "Price Low to High":
      filteredCourses.sort((a, b) => (a.price || 0) - (b.price || 0));
      break;
    case "Price High to Low":
      filteredCourses.sort((a, b) => (b.price || 0) - (a.price || 0));
      break;
    default:
      break;
  }
  
  return filteredCourses;
};

// Get all categories
export const getAllCategories = async (): Promise<string[]> => {
  try {
    const { data, error } = await supabase
      .from('course_categories')
      .select('name');
    
    if (error) throw error;
    
    if (!data || data.length === 0) {
      return ["All Categories"];
    }
    
    return ["All Categories", ...data.map(category => category.name)];
  } catch (error) {
    console.error("Error fetching categories:", error);
    return ["All Categories"];
  }
};

// Get admin stats
export const getAdminStats = async () => {
  try {
    // Get courses count stats
    const { data: coursesData, error: coursesError } = await supabase
      .from('courses')
      .select('status')
      .order('created_at', { ascending: false });
    
    if (coursesError) throw coursesError;
    
    const totalCourses = coursesData ? coursesData.length : 0;
    const publishedCourses = coursesData ? coursesData.filter(c => c.status === 'published').length : 0;
    const draftCourses = coursesData ? coursesData.filter(c => c.status === 'draft').length : 0;
    
    // Get lessons count
    const { count: lessonsCount, error: lessonsError } = await supabase
      .from('course_lessons')
      .select('id', { count: 'exact', head: true });
    
    if (lessonsError) throw lessonsError;
    
    // Get students count (for demo, all non-admin users)
    const { data: usersWithRoles, error: usersError } = await supabase
      .from('users_with_roles')
      .select('*');
    
    if (usersError) throw usersError;
    
    const totalStudents = usersWithRoles ? 
      usersWithRoles.filter(u => !u.roles?.includes('admin')).length : 0;
    
    return {
      totalCourses,
      publishedCourses,
      draftCourses,
      totalLessons: lessonsCount || 0,
      totalStudents,
      // These could come from additional queries in a real app
      activeLearners: Math.round(totalStudents * 0.6),
      recentSales: 12,
    };
  } catch (error) {
    console.error("Error fetching admin stats:", error);
    return {
      totalCourses: 0,
      publishedCourses: 0,
      draftCourses: 0,
      totalLessons: 0,
      totalStudents: 0
    };
  }
};

// Get course details by ID
export const getCourseById = async (id: string): Promise<Course | null> => {
  try {
    const { data: courseData, error } = await supabase
      .from('courses')
      .select(`
        *,
        category:course_categories(name),
        instructor:instructors(*),
        sections:course_sections(
          *,
          lessons:course_lessons(*)
        )
      `)
      .eq('id', id)
      .single();
    
    if (error) throw error;
    
    if (!courseData) {
      return null;
    }
    
    const course: Course = {
      id: courseData.id,
      title: courseData.title,
      description: courseData.description || "",
      category: courseData.category?.name || "Uncategorized",
      instructor: {
        id: courseData.instructor?.id || "",
        name: courseData.instructor?.name || "Unknown",
        role: courseData.instructor?.role || "Instructor",
        avatar: courseData.instructor?.avatar || "",
      },
      thumbnail: courseData.thumbnail || "",
      rating: courseData.rating || 0,
      reviews: courseData.reviews || 0,
      totalHours: Number(courseData.total_hours) || 0,
      status: courseData.status as 'published' | 'draft',
      lastUpdated: courseData.updated_at,
      price: courseData.price || 0,
      tags: courseData.tags || [],
      logo: courseData.logo || "",
      bgColor: courseData.bg_color || "bg-blue-500",
      sections: courseData.sections?.map(section => ({
        id: section.id,
        title: section.title,
        duration: section.duration || "",
        lessons: section.lessons?.map(lesson => ({
          id: lesson.id,
          title: lesson.title,
          duration: lesson.duration || "",
          content: lesson.content || "",
          videoUrl: lesson.video_url || "",
          section_title: section.title
        })) || []
      })) || []
    };
    
    return course;
  } catch (error) {
    console.error(`Error fetching course with ID ${id}:`, error);
    toast({
      title: "Error fetching course",
      description: "Please try again later",
      variant: "destructive",
    });
    return null;
  }
};
