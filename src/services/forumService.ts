
import { supabase } from "@/integrations/supabase/client";
import { Post, Comment } from "@/hooks/useForum";

// Generic types for our tables that aren't in the Supabase type definitions
interface GenericResponse<T> {
  data: T[] | null;
  error: any;
}

export const forumService = {
  // Likes
  checkPostLike: async (userId: string, postId: string): Promise<boolean> => {
    try {
      const response = await supabase
        .rpc('get_post_like', { user_id_param: userId, post_id_param: postId }) as any;
      
      return response?.data ? true : false;
    } catch (error) {
      console.error("Error checking post like:", error);
      return false;
    }
  },
  
  addPostLike: async (userId: string, postId: string): Promise<boolean> => {
    try {
      await supabase.rpc('toggle_post_like', { 
        user_id_param: userId, 
        post_id_param: postId,
        like_state_param: true
      });
      return true;
    } catch (error) {
      console.error("Error adding post like:", error);
      return false;
    }
  },
  
  removePostLike: async (userId: string, postId: string): Promise<boolean> => {
    try {
      await supabase.rpc('toggle_post_like', { 
        user_id_param: userId, 
        post_id_param: postId,
        like_state_param: false
      });
      return true;
    } catch (error) {
      console.error("Error removing post like:", error);
      return false;
    }
  },
  
  // Comments
  addComment: async (postId: string, userId: string, content: string): Promise<Comment | null> => {
    try {
      const response = await supabase.rpc('add_comment', {
        post_id_param: postId,
        user_id_param: userId,
        content_param: content
      }) as any;
      
      if (response?.data) {
        return response.data as Comment;
      }
      return null;
    } catch (error) {
      console.error("Error adding comment:", error);
      return null;
    }
  },
  
  getPostComments: async (postId: string): Promise<Comment[]> => {
    try {
      const response = await supabase.rpc('get_post_comments', {
        post_id_param: postId
      }) as any;
      
      return response?.data || [];
    } catch (error) {
      console.error("Error getting post comments:", error);
      return [];
    }
  },
  
  // Bookmarks
  checkBookmark: async (userId: string, contentId: string, contentType: string): Promise<boolean> => {
    try {
      const response = await supabase.rpc('check_bookmark', {
        user_id_param: userId,
        content_id_param: contentId,
        content_type_param: contentType
      }) as any;
      
      return response?.data ? true : false;
    } catch (error) {
      console.error("Error checking bookmark:", error);
      return false;
    }
  },
  
  toggleBookmark: async (
    userId: string, 
    contentId: string, 
    contentType: string, 
    title: string, 
    description?: string,
    thumbnail?: string
  ): Promise<boolean> => {
    try {
      const response = await supabase.rpc('toggle_bookmark', {
        user_id_param: userId,
        content_id_param: contentId,
        content_type_param: contentType,
        title_param: title,
        description_param: description || '',
        thumbnail_param: thumbnail || ''
      }) as any;
      
      return response?.data === true;
    } catch (error) {
      console.error("Error toggling bookmark:", error);
      return false;
    }
  }
};
