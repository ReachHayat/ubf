
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";

export interface Bookmark {
  id: string;
  content_id: string;
  content_type: 'post' | 'course' | 'lesson' | 'quiz' | 'assignment';
  title: string;
  description?: string;
  thumbnail?: string;
  created_at: string;
}

export const useBookmarks = () => {
  const { user } = useAuth();
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      fetchBookmarks();
    }
  }, [user]);

  const fetchBookmarks = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      
      // Using the generic query method to avoid TypeScript errors with tables not in types.ts
      const { data, error } = await supabase
        .from('bookmarks')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false }) as { data: Bookmark[] | null, error: any };
        
      if (error) throw error;
      
      setBookmarks(data || []);
    } catch (error) {
      console.error("Error fetching bookmarks:", error);
      toast({
        variant: "destructive",
        title: "Failed to load bookmarks",
        description: "Please try again or contact support if the problem persists."
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleBookmark = async (
    contentId: string, 
    contentType: 'post' | 'course' | 'lesson' | 'quiz' | 'assignment',
    title: string,
    description?: string,
    thumbnail?: string
  ) => {
    if (!user) {
      toast({
        variant: "destructive",
        title: "Authentication required",
        description: "Please log in to bookmark items."
      });
      return false;
    }
    
    try {
      // Check if item is already bookmarked
      const existingBookmark = bookmarks.find(
        b => b.content_id === contentId && b.content_type === contentType
      );
      
      if (existingBookmark) {
        // Remove bookmark - using generic query to avoid TypeScript errors
        const { error } = await supabase
          .from('bookmarks')
          .delete()
          .eq('id', existingBookmark.id) as { error: any };
          
        if (error) throw error;
        
        setBookmarks(bookmarks.filter(b => b.id !== existingBookmark.id));
        
        toast({
          title: "Bookmark removed",
          description: `Item removed from your bookmarks.`
        });
        
        return false;
      } else {
        // Add bookmark - using generic query to avoid TypeScript errors
        const newBookmark = {
          user_id: user.id,
          content_id: contentId,
          content_type: contentType,
          title,
          description,
          thumbnail
        };
        
        const { data, error } = await supabase
          .from('bookmarks')
          .insert(newBookmark)
          .select() as { data: Bookmark[] | null, error: any };
          
        if (error) throw error;
        
        if (data && data.length > 0) {
          setBookmarks([...bookmarks, data[0] as Bookmark]);
        }
        
        toast({
          title: "Bookmarked",
          description: `Item added to your bookmarks.`
        });
        
        return true;
      }
    } catch (error) {
      console.error("Error toggling bookmark:", error);
      toast({
        variant: "destructive",
        title: "Failed to update bookmark",
        description: "Please try again or contact support if the problem persists."
      });
      return null;
    }
  };

  const isBookmarked = (contentId: string, contentType: 'post' | 'course' | 'lesson' | 'quiz' | 'assignment') => {
    return bookmarks.some(b => b.content_id === contentId && b.content_type === contentType);
  };

  return {
    bookmarks,
    loading,
    fetchBookmarks,
    toggleBookmark,
    isBookmarked
  };
};
