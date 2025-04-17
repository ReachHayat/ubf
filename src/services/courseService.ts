
import { supabase } from "@/integrations/supabase/client";
import { Course, CourseSection, CourseLesson } from "@/types/course";

export const courseService = {
  getCourses: async (): Promise<Course[]> => {
    try {
      const { data: courses, error } = await supabase
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
      return courses || [];
    } catch (error) {
      console.error("Error fetching courses:", error);
      return [];
    }
  },

  getCourseById: async (id: string): Promise<Course | null> => {
    try {
      const { data: course, error } = await supabase
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
      return course;
    } catch (error) {
      console.error("Error fetching course:", error);
      return null;
    }
  },

  createCourse: async (courseData: Partial<Course>): Promise<Course | null> => {
    try {
      const { data: course, error } = await supabase
        .from('courses')
        .insert([courseData])
        .select()
        .single();

      if (error) throw error;
      return course;
    } catch (error) {
      console.error("Error creating course:", error);
      return null;
    }
  },

  updateCourse: async (id: string, courseData: Partial<Course>): Promise<Course | null> => {
    try {
      const { data: course, error } = await supabase
        .from('courses')
        .update(courseData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return course;
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
