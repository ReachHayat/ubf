
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";

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

export const useReviews = (courseId?: string) => {
  const { user } = useAuth();
  const [reviews, setReviews] = useState<CourseReview[]>([]);
  const [userReview, setUserReview] = useState<CourseReview | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (courseId) {
      fetchReviews(courseId);
    }
  }, [courseId, user]);

  const fetchReviews = async (courseIdToFetch: string) => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('course_reviews')
        .select(`
          *,
          user:users(name, full_name, avatar_url)
        `)
        .eq('course_id', courseIdToFetch)
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      
      setReviews(data || []);
      
      // Set user's own review if exists
      if (user) {
        const ownReview = data?.find(review => review.user_id === user.id);
        setUserReview(ownReview || null);
      }
    } catch (error) {
      console.error("Error fetching reviews:", error);
      toast({
        variant: "destructive",
        title: "Failed to load reviews",
        description: "Please try again or contact support if the problem persists."
      });
    } finally {
      setLoading(false);
    }
  };

  const submitReview = async (courseIdToReview: string, rating: number, comment?: string) => {
    if (!user) {
      toast({
        variant: "destructive",
        title: "Authentication required",
        description: "Please log in to submit reviews."
      });
      return false;
    }
    
    try {
      if (userReview) {
        // Update existing review
        const { data, error } = await supabase
          .from('course_reviews')
          .update({ 
            rating,
            comment,
            updated_at: new Date().toISOString()
          })
          .eq('id', userReview.id)
          .select();
          
        if (error) throw error;
        
        if (data && data.length > 0) {
          setUserReview(data[0] as CourseReview);
          setReviews(reviews.map(r => r.id === userReview.id ? data[0] as CourseReview : r));
        }
      } else {
        // Create new review
        const newReview = {
          user_id: user.id,
          course_id: courseIdToReview,
          rating,
          comment
        };
        
        const { data, error } = await supabase
          .from('course_reviews')
          .insert(newReview)
          .select();
          
        if (error) throw error;
        
        if (data && data.length > 0) {
          const reviewWithUser = {
            ...data[0],
            user: {
              name: user.user_metadata?.name,
              full_name: user.user_metadata?.full_name,
              avatar_url: user.user_metadata?.avatar_url
            }
          } as CourseReview;
          
          setUserReview(reviewWithUser);
          setReviews([reviewWithUser, ...reviews]);
        }
      }
      
      toast({
        title: "Review submitted",
        description: "Thank you for your feedback!"
      });
      
      return true;
    } catch (error) {
      console.error("Error submitting review:", error);
      toast({
        variant: "destructive",
        title: "Failed to submit review",
        description: "Please try again or contact support if the problem persists."
      });
      return false;
    }
  };

  const deleteReview = async (reviewId: string) => {
    if (!user) return false;
    
    try {
      const { error } = await supabase
        .from('course_reviews')
        .delete()
        .eq('id', reviewId);
        
      if (error) throw error;
      
      setReviews(reviews.filter(r => r.id !== reviewId));
      
      if (userReview && userReview.id === reviewId) {
        setUserReview(null);
      }
      
      toast({
        title: "Review deleted",
        description: "Your review has been removed."
      });
      
      return true;
    } catch (error) {
      console.error("Error deleting review:", error);
      toast({
        variant: "destructive",
        title: "Failed to delete review",
        description: "Please try again or contact support if the problem persists."
      });
      return false;
    }
  };

  return {
    reviews,
    userReview,
    loading,
    fetchReviews,
    submitReview,
    deleteReview
  };
};
