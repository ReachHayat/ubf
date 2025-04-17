
import { supabase } from "@/integrations/supabase/client";

export interface CourseReview {
  id: string;
  course_id: string;
  rating: number;
  comment?: string;
  created_at: string;
  updated_at: string;
  user_id: string;
  user?: {
    name?: string;
    full_name?: string;
    avatar_url?: string;
  };
}

// Generic types for our RPC responses
interface RPCResponse<T> {
  data: T | null;
  error: any;
}

export const reviewService = {
  getCourseReviews: async (courseId: string): Promise<CourseReview[]> => {
    try {
      const response = await supabase.functions.invoke('get_course_reviews', {
        body: {
          course_id_param: courseId
        }
      }) as RPCResponse<CourseReview[]>;
      
      return response.data || [];
    } catch (error) {
      console.error("Error fetching course reviews:", error);
      return [];
    }
  },
  
  getUserReview: async (userId: string, courseId: string): Promise<CourseReview | null> => {
    try {
      const response = await supabase.functions.invoke('get_user_review', {
        body: {
          user_id_param: userId,
          course_id_param: courseId
        }
      }) as RPCResponse<CourseReview>;
      
      return response.data;
    } catch (error) {
      console.error("Error fetching user review:", error);
      return null;
    }
  },
  
  submitReview: async (
    courseId: string, 
    rating: number, 
    comment?: string,
    reviewId?: string
  ): Promise<CourseReview | null> => {
    try {
      // Update existing review if reviewId is provided
      if (reviewId) {
        const response = await supabase.functions.invoke('update_review', {
          body: {
            review_id_param: reviewId,
            rating_param: rating,
            comment_param: comment || ''
          }
        }) as RPCResponse<CourseReview>;
        
        return response.data;
      } else {
        // Create new review
        const response = await supabase.functions.invoke('create_review', {
          body: {
            course_id_param: courseId,
            rating_param: rating,
            comment_param: comment || ''
          }
        }) as RPCResponse<CourseReview>;
        
        return response.data;
      }
    } catch (error) {
      console.error("Error submitting review:", error);
      return null;
    }
  },
  
  deleteReview: async (reviewId: string): Promise<boolean> => {
    try {
      const response = await supabase.functions.invoke('delete_review', {
        body: {
          review_id_param: reviewId
        }
      }) as RPCResponse<boolean>;
      
      return !!response.data;
    } catch (error) {
      console.error("Error deleting review:", error);
      return false;
    }
  }
};
