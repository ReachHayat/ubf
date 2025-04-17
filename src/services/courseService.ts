
import { supabase } from "@/integrations/supabase/client";
import { Course, CourseSection, CourseLesson } from "@/types/course";

export const courseService = {
  getCourses: async (): Promise<Course[]> => {
    try {
      const { data: coursesData, error } = await supabase
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
        status: courseData.status,
        lastUpdated: courseData.updated_at,
        price: courseData.price || 0,
        tags: courseData.tags || [],
        logo: courseData.logo || "",
        bgColor: courseData.bg_color || "bg-blue-500",
        sections: (courseData.sections || []).map(section => ({
          id: section.id,
          title: section.title,
          duration: section.duration || "",
          lessons: (section.lessons || []).map(lesson => ({
            id: lesson.id,
            title: lesson.title,
            duration: lesson.duration || "",
            content: lesson.content || "",
            videoUrl: lesson.video_url || "",
            section_title: section.title
          }))
        }))
      }));
      
      return courses;
    } catch (error) {
      console.error("Error fetching courses:", error);
      return [];
    }
  },

  getCourseById: async (id: string): Promise<Course | null> => {
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
      
      if (!courseData) return null;
      
      // Transform the data to match the Course type
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
        status: courseData.status,
        lastUpdated: courseData.updated_at,
        price: courseData.price || 0,
        tags: courseData.tags || [],
        logo: courseData.logo || "",
        bgColor: courseData.bg_color || "bg-blue-500",
        sections: (courseData.sections || []).map(section => ({
          id: section.id,
          title: section.title,
          duration: section.duration || "",
          lessons: (section.lessons || []).map(lesson => ({
            id: lesson.id,
            title: lesson.title,
            duration: lesson.duration || "",
            content: lesson.content || "",
            videoUrl: lesson.video_url || "",
            section_title: section.title
          }))
        }))
      };
      
      return course;
    } catch (error) {
      console.error("Error fetching course:", error);
      return null;
    }
  },

  createCourse: async (courseData: Partial<Course>): Promise<Course | null> => {
    try {
      // Transform the Course type to match the database schema
      const dbCourseData = {
        title: courseData.title || "New Course",
        description: courseData.description,
        category_id: courseData.category ? "some-default-id" : "some-default-id", // This needs to be a valid UUID
        instructor_id: "some-default-id", // This needs to be a valid UUID
        thumbnail: courseData.thumbnail,
        logo: courseData.logo,
        status: courseData.status || "draft",
        rating: courseData.rating,
        reviews: courseData.reviews,
        total_hours: courseData.totalHours,
        price: courseData.price,
        tags: courseData.tags,
        bg_color: courseData.bgColor
      };

      const { data, error } = await supabase
        .from('courses')
        .insert([dbCourseData])
        .select()
        .single();

      if (error) throw error;
      
      if (!data) return null;
      
      // We need to fetch the complete course with related data
      return this.getCourseById(data.id);
    } catch (error) {
      console.error("Error creating course:", error);
      return null;
    }
  },

  updateCourse: async (id: string, courseData: Partial<Course>): Promise<Course | null> => {
    try {
      // Transform the Course type to match the database schema
      const dbCourseData: Record<string, any> = {};
      
      if (courseData.title) dbCourseData.title = courseData.title;
      if (courseData.description !== undefined) dbCourseData.description = courseData.description;
      if (courseData.thumbnail !== undefined) dbCourseData.thumbnail = courseData.thumbnail;
      if (courseData.logo !== undefined) dbCourseData.logo = courseData.logo;
      if (courseData.status !== undefined) dbCourseData.status = courseData.status;
      if (courseData.rating !== undefined) dbCourseData.rating = courseData.rating;
      if (courseData.reviews !== undefined) dbCourseData.reviews = courseData.reviews;
      if (courseData.totalHours !== undefined) dbCourseData.total_hours = courseData.totalHours;
      if (courseData.price !== undefined) dbCourseData.price = courseData.price;
      if (courseData.tags !== undefined) dbCourseData.tags = courseData.tags;
      if (courseData.bgColor !== undefined) dbCourseData.bg_color = courseData.bgColor;

      const { error } = await supabase
        .from('courses')
        .update(dbCourseData)
        .eq('id', id);

      if (error) throw error;
      
      // Fetch the updated course with all related data
      return this.getCourseById(id);
    } catch (error) {
      console.error("Error updating course:", error);
      return null;
    }
  },

  deleteCourse: async (id: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('courses')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error("Error deleting course:", error);
      return false;
    }
  }
};

// We're now using the courseNotesService for notes functionality
import { courseNotesService } from "@/services/courseNotesService";
import { bookmarkService } from "@/services/bookmarkService";

// Update user's notes for a specific lesson
export const updateUserNotes = async (userId: string, lessonId: string, courseId: string, noteContent: string): Promise<void> => {
  return courseNotesService.updateUserNotes(userId, lessonId, courseId, noteContent);
};

// Get user notes for a specific lesson
export const getUserNotes = async (userId: string, lessonId: string, courseId: string): Promise<string> => {
  return courseNotesService.getUserNotes(userId, lessonId, courseId);
};

// Get all user notes
export const getAllUserNotes = async (userId: string): Promise<{ lessonId: string, courseId: string, content: string, updatedAt: string }[]> => {
  return courseNotesService.getAllUserNotes(userId);
};

// Check if course is bookmarked
export const isCourseSaved = async (userId: string, courseId: string): Promise<boolean> => {
  try {
    if (!userId) {
      return false;
    }
    
    return bookmarkService.checkBookmark(courseId, 'course');
  } catch (error) {
    console.error("Error checking if course is bookmarked:", error);
    return false;
  }
};

// Toggle course bookmark
export const toggleCourseSaved = async (userId: string, course: Course): Promise<boolean> => {
  try {
    if (!userId) {
      return false;
    }
    
    return bookmarkService.toggleBookmark(
      course.id,
      'course',
      course.title,
      course.description || '',
      course.thumbnail || ''
    );
  } catch (error) {
    console.error("Error toggling course bookmark:", error);
    return false;
  }
};

// Toggle lesson bookmark
export const toggleLessonSaved = async (
  userId: string, 
  courseId: string, 
  lessonId: string,
  title: string,
  thumbnail?: string
): Promise<boolean> => {
  try {
    if (!userId) {
      return false;
    }
    
    const course = await getCourseById(courseId);
    const description = `Course: ${course?.title || courseId}`;
    
    return bookmarkService.toggleBookmark(
      lessonId,
      'lesson',
      title,
      description,
      thumbnail || ''
    );
  } catch (error) {
    console.error("Error toggling lesson bookmark:", error);
    return false;
  }
};

// Check if lesson is bookmarked
export const isLessonSaved = async (userId: string, lessonId: string): Promise<boolean> => {
  try {
    if (!userId) {
      return false;
    }
    
    return bookmarkService.checkBookmark(lessonId, 'lesson');
  } catch (error) {
    console.error("Error checking if lesson is bookmarked:", error);
    return false;
  }
};
