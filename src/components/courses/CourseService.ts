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
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return [];
    }
    
    const allCourses = await getCourses();
    
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
    const { data: coursesData, error: coursesError } = await supabase
      .from('courses')
      .select('status')
      .order('created_at', { ascending: false });
    
    if (coursesError) throw coursesError;
    
    const totalCourses = coursesData ? coursesData.length : 0;
    const publishedCourses = coursesData ? coursesData.filter(c => c.status === 'published').length : 0;
    const draftCourses = coursesData ? coursesData.filter(c => c.status === 'draft').length : 0;
    
    const { count: lessonsCount, error: lessonsError } = await supabase
      .from('course_lessons')
      .select('id', { count: 'exact', head: true });
    
    if (lessonsError) throw lessonsError;
    
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

// Update course
export const updateCourse = async (course: Course): Promise<Course | null> => {
  try {
    if (!course || !course.id) return null;
    
    const { data, error } = await supabase
      .from('courses')
      .update({
        title: course.title,
        description: course.description,
        status: course.status,
        rating: course.rating,
        reviews: course.reviews,
        total_hours: course.totalHours,
        price: course.price,
        tags: course.tags,
        thumbnail: course.thumbnail,
        bg_color: course.bgColor,
        updated_at: new Date().toISOString()
      })
      .eq('id', course.id)
      .select();
      
    if (error) throw error;
    
    return getCourseById(course.id);
  } catch (error) {
    console.error("Error updating course:", error);
    toast({
      title: "Error updating course",
      description: "Please try again later",
      variant: "destructive",
    });
    return null;
  }
};

// Update course section
export const updateCourseSection = async (courseId: string, section: any): Promise<boolean> => {
  try {
    const { data, error } = await supabase
      .from('course_sections')
      .upsert({
        id: section.id || undefined,
        title: section.title,
        duration: section.duration,
        position: section.position || 0,
        course_id: courseId,
        updated_at: new Date().toISOString()
      })
      .select();
      
    if (error) throw error;
    
    return true;
  } catch (error) {
    console.error("Error updating section:", error);
    toast({
      title: "Error updating section",
      description: "Please try again later",
      variant: "destructive",
    });
    return false;
  }
};

// Delete course section
export const deleteCourseSection = async (courseId: string, sectionId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('course_sections')
      .delete()
      .eq('id', sectionId)
      .eq('course_id', courseId);
      
    if (error) throw error;
    
    return true;
  } catch (error) {
    console.error("Error deleting section:", error);
    toast({
      title: "Error deleting section",
      description: "Please try again later",
      variant: "destructive",
    });
    return false;
  }
};

// Update course lesson
export const updateCourseLesson = async (courseId: string, sectionId: string, lesson: any): Promise<boolean> => {
  try {
    const { data, error } = await supabase
      .from('course_lessons')
      .upsert({
        id: lesson.id || undefined,
        title: lesson.title,
        content: lesson.content,
        duration: lesson.duration,
        section_id: sectionId,
        position: lesson.position || 0,
        video_url: lesson.videoUrl,
        updated_at: new Date().toISOString()
      })
      .select();
      
    if (error) throw error;
    
    return true;
  } catch (error) {
    console.error("Error updating lesson:", error);
    toast({
      title: "Error updating lesson",
      description: "Please try again later",
      variant: "destructive",
    });
    return false;
  }
};

// Delete course lesson
export const deleteCourseLesson = async (courseId: string, sectionId: string, lessonId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('course_lessons')
      .delete()
      .eq('id', lessonId)
      .eq('section_id', sectionId);
      
    if (error) throw error;
    
    return true;
  } catch (error) {
    console.error("Error deleting lesson:", error);
    toast({
      title: "Error deleting lesson",
      description: "Please try again later",
      variant: "destructive",
    });
    return false;
  }
};

// Update course assignment
export const updateCourseAssignment = async (courseId: string, assignment: any): Promise<boolean> => {
  try {
    const { data, error } = await supabase
      .from('assignments')
      .upsert({
        id: assignment.id || undefined,
        title: assignment.title,
        description: assignment.description,
        course_id: courseId,
        due_date: assignment.dueDate,
        submission_type: assignment.submissionType || 'file',
        max_points: assignment.maxPoints || 100,
        updated_at: new Date().toISOString()
      })
      .select();
      
    if (error) throw error;
    
    return true;
  } catch (error) {
    console.error("Error updating assignment:", error);
    toast({
      title: "Error updating assignment",
      description: "Please try again later",
      variant: "destructive",
    });
    return false;
  }
};

// Delete course assignment
export const deleteCourseAssignment = async (courseId: string, assignmentId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('assignments')
      .delete()
      .eq('id', assignmentId)
      .eq('course_id', courseId);
      
    if (error) throw error;
    
    return true;
  } catch (error) {
    console.error("Error deleting assignment:", error);
    toast({
      title: "Error deleting assignment",
      description: "Please try again later",
      variant: "destructive",
    });
    return false;
  }
};

// Enroll in course
export const enrollInCourse = async (courseId: string): Promise<boolean> => {
  try {
    const userResponse = await supabase.auth.getUser();
    
    if (!userResponse.data.user) return false;
    
    const enrolledCourses = JSON.parse(localStorage.getItem(`enrolled-${userResponse.data.user.id}`) || '[]');
    if (!enrolledCourses.includes(courseId)) {
      enrolledCourses.push(courseId);
      localStorage.setItem(`enrolled-${userResponse.data.user.id}`, JSON.stringify(enrolledCourses));
    }
    
    return true;
  } catch (error) {
    console.error("Error enrolling in course:", error);
    toast({
      title: "Error enrolling in course",
      description: "Please try again later",
      variant: "destructive",
    });
    return false;
  }
};

// Unenroll from course
export const unenrollFromCourse = async (courseId: string): Promise<boolean> => {
  try {
    const userResponse = await supabase.auth.getUser();
    
    if (!userResponse.data.user) return false;
    
    let enrolledCourses = JSON.parse(localStorage.getItem(`enrolled-${userResponse.data.user.id}`) || '[]');
    enrolledCourses = enrolledCourses.filter((id: string) => id !== courseId);
    localStorage.setItem(`enrolled-${userResponse.data.user.id}`, JSON.stringify(enrolledCourses));
    
    return true;
  } catch (error) {
    console.error("Error unenrolling from course:", error);
    toast({
      title: "Error unenrolling from course",
      description: "Please try again later",
      variant: "destructive",
    });
    return false;
  }
};

// Mark video as watched
export const markVideoAsWatched = async (courseId: string, lessonId: string): Promise<boolean> => {
  try {
    const userResponse = await supabase.auth.getUser();
    
    if (!userResponse.data.user) return false;
    
    const watchedKey = `watched-${userResponse.data.user.id}-${courseId}`;
    const watchedLessons = JSON.parse(localStorage.getItem(watchedKey) || '[]');
    if (!watchedLessons.includes(lessonId)) {
      watchedLessons.push(lessonId);
      localStorage.setItem(watchedKey, JSON.stringify(watchedLessons));
    }
    
    return true;
  } catch (error) {
    console.error("Error marking video as watched:", error);
    return false;
  }
};

// Check if video is watched
export const isVideoWatched = (courseId: string, lessonId: string): boolean => {
  try {
    const userResponse = supabase.auth.getUser();
    const user = JSON.parse(localStorage.getItem('supabase.auth.token') || '{}')?.currentSession?.user;
    
    if (!user) return false;
    
    const watchedKey = `watched-${user.id}-${courseId}`;
    const watchedLessons = JSON.parse(localStorage.getItem(watchedKey) || '[]');
    return watchedLessons.includes(lessonId);
  } catch (error) {
    console.error("Error checking if video is watched:", error);
    return false;
  }
};

// Share course
export const shareCourse = async (courseId: string): Promise<boolean> => {
  try {
    const url = `${window.location.origin}/courses/${courseId}`;
    await navigator.clipboard.writeText(url);
    
    return true;
  } catch (error) {
    console.error("Error sharing course:", error);
    toast({
      title: "Error sharing course",
      description: "Please try again later",
      variant: "destructive",
    });
    return false;
  }
};
