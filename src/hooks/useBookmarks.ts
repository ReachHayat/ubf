
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
      
      const { data, error } = await supabase.rpc('get_user_bookmarks') as any;
        
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
      const { data, error } = await supabase.rpc('toggle_bookmark', {
        user_id_param: user.id,
        content_id_param: contentId,
        content_type_param: contentType,
        title_param: title,
        description_param: description || '',
        thumbnail_param: thumbnail || ''
      }) as any;
      
      if (error) throw error;
      
      if (data === true) {
        // Bookmark was added - fetch the new bookmark to add to state
        const { data: newBookmark } = await supabase.rpc('get_bookmark', {
          user_id_param: user.id,
          content_id_param: contentId,
          content_type_param: contentType
        }) as any;
        
        if (newBookmark) {
          setBookmarks([...bookmarks, newBookmark]);
        }
        
        toast({
          title: "Bookmarked",
          description: `Item added to your bookmarks.`
        });
        
        return true;
      } else {
        // Bookmark was removed
        setBookmarks(bookmarks.filter(b => 
          !(b.content_id === contentId && b.content_type === contentType)
        ));
        
        toast({
          title: "Bookmark removed",
          description: `Item removed from your bookmarks.`
        });
        
        return false;
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
