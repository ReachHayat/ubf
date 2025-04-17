
import { supabase } from "@/integrations/supabase/client";

export interface Bookmark {
  id: string;
  content_id: string;
  content_type: 'post' | 'course' | 'lesson' | 'quiz' | 'assignment';
  title: string;
  description?: string;
  thumbnail?: string;
  created_at: string;
}

// Generic types for our RPC responses
interface RPCResponse<T> {
  data: T | null;
  error: any;
}

export const bookmarkService = {
  getUserBookmarks: async (): Promise<Bookmark[]> => {
    try {
      const response = await supabase.functions.invoke('get_user_bookmarks') as RPCResponse<Bookmark[]>;
      
      if (response.error) throw response.error;
      
      return response.data || [];
    } catch (error) {
      console.error("Error fetching bookmarks:", error);
      return [];
    }
  },

  checkBookmark: async (contentId: string, contentType: string): Promise<boolean> => {
    try {
      const response = await supabase.functions.invoke('check_bookmark', {
        body: {
          content_id_param: contentId,
          content_type_param: contentType
        }
      }) as RPCResponse<Bookmark>;
      
      return !!response.data;
    } catch (error) {
      console.error("Error checking bookmark:", error);
      return false;
    }
  },

  toggleBookmark: async (
    contentId: string, 
    contentType: 'post' | 'course' | 'lesson' | 'quiz' | 'assignment',
    title: string,
    description?: string,
    thumbnail?: string
  ): Promise<boolean> => {
    try {
      const response = await supabase.functions.invoke('toggle_bookmark', {
        body: {
          content_id_param: contentId,
          content_type_param: contentType,
          title_param: title,
          description_param: description || '',
          thumbnail_param: thumbnail || ''
        }
      }) as RPCResponse<boolean>;
      
      if (response.error) throw response.error;
      
      return !!response.data;
    } catch (error) {
      console.error("Error toggling bookmark:", error);
      return false;
    }
  },

  getBookmark: async (contentId: string, contentType: string): Promise<Bookmark | null> => {
    try {
      const response = await supabase.functions.invoke('get_bookmark', {
        body: {
          content_id_param: contentId,
          content_type_param: contentType
        }
      }) as RPCResponse<Bookmark>;
      
      if (response.error) throw response.error;
      
      return response.data;
    } catch (error) {
      console.error("Error fetching bookmark:", error);
      return null;
    }
  }
};
