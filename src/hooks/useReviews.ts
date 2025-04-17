
import { useState, useEffect } from "react";
import { toast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { reviewService, CourseReview } from "@/services/reviewService";

// Use export type instead of export for re-exporting types
export type { CourseReview } from "@/services/reviewService";

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
      
      const courseReviews = await reviewService.getCourseReviews(courseIdToFetch);
      setReviews(courseReviews);
      
      // Set user's own review if exists
      if (user) {
        const ownReview = courseReviews.find(review => review.user_id === user.id);
        if (ownReview) {
          setUserReview(ownReview);
        } else {
          const userReview = await reviewService.getUserReview(user.id, courseIdToFetch);
          setUserReview(userReview);
        }
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
      const updatedReview = await reviewService.submitReview(
        courseIdToReview,
        rating,
        comment,
        userReview?.id
      );
      
      if (updatedReview) {
        if (userReview) {
          // Update existing review in state
          setReviews(reviews.map(r => r.id === userReview.id ? updatedReview : r));
        } else {
          // Add new review to state
          setReviews([updatedReview, ...reviews]);
        }
        
        setUserReview(updatedReview);
        
        toast({
          title: "Review submitted",
          description: "Thank you for your feedback!"
        });
        
        return true;
      }
      
      return false;
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
      const success = await reviewService.deleteReview(reviewId);
      
      if (success) {
        setReviews(reviews.filter(r => r.id !== reviewId));
        
        if (userReview && userReview.id === reviewId) {
          setUserReview(null);
        }
        
        toast({
          title: "Review deleted",
          description: "Your review has been removed."
        });
      }
      
      return success;
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
