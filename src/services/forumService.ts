
import { supabase } from "@/integrations/supabase/client";
import { Post, Comment } from "@/hooks/useForum";

// Generic types for our RPC responses
interface RPCResponse<T> {
  data: T | null;
  error: any;
}

export const forumService = {
  // Likes
  checkPostLike: async (userId: string, postId: string): Promise<boolean> => {
    try {
      const response = await supabase.functions.invoke('get_post_like', {
        body: { 
          user_id_param: userId, 
          post_id_param: postId 
        }
      }) as RPCResponse<any>;
      
      return !!response.data;
    } catch (error) {
      console.error("Error checking post like:", error);
      return false;
    }
  },
  
  addPostLike: async (userId: string, postId: string): Promise<boolean> => {
    try {
      const response = await supabase.functions.invoke('toggle_post_like', { 
        body: {
          user_id_param: userId, 
          post_id_param: postId,
          like_state_param: true
        }
      }) as RPCResponse<boolean>;
      
      return !!response.data;
    } catch (error) {
      console.error("Error adding post like:", error);
      return false;
    }
  },
  
  removePostLike: async (userId: string, postId: string): Promise<boolean> => {
    try {
      const response = await supabase.functions.invoke('toggle_post_like', {
        body: {
          user_id_param: userId, 
          post_id_param: postId,
          like_state_param: false
        }
      }) as RPCResponse<boolean>;
      
      return response.data === false;
    } catch (error) {
      console.error("Error removing post like:", error);
      return false;
    }
  },
  
  // Comments
  addComment: async (postId: string, userId: string, content: string): Promise<Comment | null> => {
    try {
      const response = await supabase.functions.invoke('add_comment', {
        body: {
          post_id_param: postId,
          user_id_param: userId,
          content_param: content
        }
      }) as RPCResponse<Comment>;
      
      return response.data;
    } catch (error) {
      console.error("Error adding comment:", error);
      return null;
    }
  },
  
  getPostComments: async (postId: string): Promise<Comment[]> => {
    try {
      const response = await supabase.functions.invoke('get_post_comments', {
        body: {
          post_id_param: postId
        }
      }) as RPCResponse<Comment[]>;
      
      return response.data || [];
    } catch (error) {
      console.error("Error getting post comments:", error);
      return [];
    }
  },
  
  getForumPosts: async (): Promise<Post[]> => {
    try {
      const response = await supabase.functions.invoke('get_forum_posts') as RPCResponse<Post[]>;
      return response.data || [];
    } catch (error) {
      console.error("Error fetching forum posts:", error);
      return [];
    }
  },
  
  createForumPost: async (title: string, content: string, categoryId: string, media?: any[]): Promise<Post | null> => {
    try {
      const response = await supabase.functions.invoke('create_forum_post', {
        body: {
          title_param: title,
          content_param: content,
          category_id_param: categoryId,
          media_param: media || []
        }
      }) as RPCResponse<Post>;
      
      return response.data;
    } catch (error) {
      console.error("Error creating forum post:", error);
      return null;
    }
  },
  
  approveForumPost: async (postId: string): Promise<boolean> => {
    try {
      const response = await supabase.functions.invoke('approve_forum_post', {
        body: {
          post_id_param: postId
        }
      }) as RPCResponse<boolean>;
      
      return !!response.data;
    } catch (error) {
      console.error("Error approving forum post:", error);
      return false;
    }
  },
  
  deleteForumPost: async (postId: string): Promise<boolean> => {
    try {
      const response = await supabase.functions.invoke('delete_forum_post', {
        body: {
          post_id_param: postId
        }
      }) as RPCResponse<boolean>;
      
      return !!response.data;
    } catch (error) {
      console.error("Error deleting forum post:", error);
      return false;
    }
  }
};
