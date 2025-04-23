
import { useState } from 'react';
import { useBookmarks } from '@/hooks/useBookmarks';
import { BookmarkItem } from '@/types/course';

// Forum types
export interface Comment {
  id: string;
  content: string;
  created_at: string;
  user?: {
    id: string;
    full_name: string;
  };
  approved: boolean;
}

export interface Post {
  id: string;
  title: string;
  content: string;
  author: {
    id: string;
    name: string;
    avatar: string;
  };
  created_at: string;
  likes: number;
  comments: Comment[] | null;
  tags: string[];
  user?: {
    id: string;
    full_name: string;
    name: string;
  };
  approved: boolean;
  category?: {
    id: string;
    name: string;
  };
  media?: Array<{
    type: string;
    url: string;
  }>;
}

export interface Category {
  id: string;
  name: string;
  description?: string;
}

export const useForum = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const { toggleBookmark, isBookmarked } = useBookmarks();
  
  // Function to handle bookmarking a forum post
  const bookmarkPost = async (post: Post) => {
    try {
      await toggleBookmark(
        post.id, 
        'forum', 
        post.title, 
        post.content.substring(0, 100)
      );
      return true;
    } catch (error) {
      console.error('Error bookmarking post:', error);
      return false;
    }
  };
  
  // Function to check if a post is bookmarked
  const isPostBookmarked = (postId: string) => {
    return isBookmarked(postId);
  };

  // More forum related functions would go here
  
  return {
    posts,
    loading,
    bookmarkPost,
    isPostBookmarked
  };
};
