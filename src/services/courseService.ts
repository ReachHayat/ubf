
import { supabase } from "@/integrations/supabase/client";
import { Course } from "@/types/course";
import { enrollmentService } from "./enrollmentService";

export const courseService = {
  getCourses: async (): Promise<Course[]> => {
    try {
      const { data: coursesData, error } = await supabase
        .from('courses')
        .select(`
          *,
          category:course_categories(name),
          instructor:instructors(*)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Transform the data to match the Course type
      const courses: Course[] = (coursesData || []).map(courseData => ({
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
        status: (courseData.status === 'published' || courseData.status === 'draft') 
          ? courseData.status 
          : "draft", // Ensure status is either 'published' or 'draft'
        lastUpdated: courseData.updated_at,
        price: courseData.price || 0,
        tags: courseData.tags || [],
        logo: courseData.logo || "",
        bgColor: courseData.bg_color || "bg-blue-500"
      }));
      
      return courses;
    } catch (error) {
      console.error("Error fetching courses:", error);
      return [];
    }
  },

  getCourseById: async (courseId: string): Promise<Course | null> => {
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
        .eq('id', courseId)
        .single();
      
      if (error) {
        console.error(`Error fetching course with ID ${courseId}:`, error);
        return null;
      }
      
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
        status: (courseData.status === 'published' || courseData.status === 'draft') 
          ? courseData.status 
          : "draft",
        lastUpdated: courseData.updated_at,
        price: courseData.price || 0,
        tags: courseData.tags || [],
        logo: courseData.logo || "",
        bgColor: courseData.bg_color || "bg-blue-500",
        sections: (courseData.sections || []).map(section => ({
          id: section.id,
          title: section.title,
          duration: section.duration || "",
          expanded: false,
          lessons: (section.lessons || []).map(lesson => ({
            id: lesson.id,
            title: lesson.title,
            duration: lesson.duration || "",
            content: lesson.content || "",
            videoUrl: lesson.video_url || ""
          }))
        }))
      };
      
      return course;
    } catch (error) {
      console.error(`Error fetching course with ID ${courseId}:`, error);
      return null;
    }
  },

  filterAndSortCourses: (
    courses: Course[],
    searchQuery: string = "",
    category: string = "All Categories",
    sortBy: string = "Most Popular"
  ): Course[] => {
    let filteredCourses = courses;
    
    if (searchQuery) {
      searchQuery = searchQuery.toLowerCase();
      filteredCourses = filteredCourses.filter(
        course => course.title.toLowerCase().includes(searchQuery) ||
                course.description.toLowerCase().includes(searchQuery)
      );
    }
    
    if (category !== "All Categories") {
      filteredCourses = filteredCourses.filter(
        course => course.category === category
      );
    }
    
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
  },

  getAllCategories: async (): Promise<string[]> => {
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
  },

  markLessonComplete: async (courseId: string, lessonId: string): Promise<boolean> => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;

    const { error } = await supabase
      .from('lesson_completions')
      .insert({
        user_id: user.id,
        lesson_id: lessonId
      });

    if (error && error.code !== '23505') { // Ignore unique violation errors
      console.error('Error marking lesson as complete:', error);
      return false;
    }

    // Update enrollment progress
    const { data: progress } = await supabase
      .rpc('get_course_progress', {
        user_id: user.id,
        course_id: courseId
      });

    if (progress !== null) {
      await enrollmentService.updateProgress(courseId, progress);
    }

    return true;
  },

  isLessonCompleted: async (lessonId: string): Promise<boolean> => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;

    const { data, error } = await supabase
      .from('lesson_completions')
      .select('id')
      .eq('user_id', user.id)
      .eq('lesson_id', lessonId)
      .maybeSingle();

    if (error) {
      console.error('Error checking lesson completion:', error);
      return false;
    }

    return !!data;
  }
};
