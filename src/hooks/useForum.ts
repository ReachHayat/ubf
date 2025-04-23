
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useBookmarks } from "./useBookmarks";
import { forumService } from "@/services/forumService";

export interface Category {
  id: string;
  name: string;
  description?: string;
}

export interface Comment {
  id: string;
  post_id: string;
  user_id: string;
  content: string;
  approved: boolean;
  created_at: string;
  user?: {
    id: string;
    email: string;
    full_name?: string;
    name?: string;
    avatar_url?: string;
  };
  likes?: number;
}

export interface Post {
  id: string;
  title: string;
  content: string;
  user_id: string;
  category_id: string;
  approved: boolean;
  created_at: string;
  likes: number;
  comments?: Comment[];
  user?: {
    id: string;
    email: string;
    full_name?: string;
    name?: string;
    avatar_url?: string;
  };
  category?: Category;
  media?: {type: string, url: string}[];
}

export const useForum = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [categories, setCategories] = useState<Category[]>([
    { id: "general", name: "General Discussion" },
    { id: "questions", name: "Questions & Answers" },
    { id: "resources", name: "Resources & Materials" }
  ]);
  const [loading, setLoading] = useState(false);
  const { bookmarks, toggleBookmark, isBookmarked } = useBookmarks();
  
  // Update this to use BookmarkItem instead of Course
  const bookmarkedPosts = bookmarks
    .filter(b => b.content_type === 'post')
    .map(b => b.content_id);

  useEffect(() => {
    fetchPosts();
  }, [user]);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      
      const postsData = await forumService.getForumPosts();
      setPosts(postsData || []);
    } catch (error) {
      console.error("Error fetching posts:", error);
      toast({
        variant: "destructive",
        title: "Failed to load posts",
        description: "Please try again or contact support if the problem persists."
      });
    } finally {
      setLoading(false);
    }
  };

  const createPost = async (title: string, content: string, categoryId: string, media?: any[]) => {
    if (!user) {
      toast({
        variant: "destructive",
        title: "Authentication required",
        description: "You must be logged in to create a post."
      });
      return;
    }
    
    try {
      const data = await forumService.createForumPost(title, content, categoryId, media);
      
      if (data) {
        setPosts([data, ...posts]);
        
        toast({
          title: user.user_metadata?.is_admin ? "Post created" : "Post submitted for approval",
          description: user.user_metadata?.is_admin 
            ? "Your post has been published." 
            : "Your post will be visible after admin approval."
        });
        
        return data;
      }
    } catch (error) {
      console.error("Error creating post:", error);
      toast({
        variant: "destructive",
        title: "Failed to create post",
        description: "Please try again or contact support if the problem persists."
      });
      throw error;
    }
  };

  const approvePost = async (postId: string) => {
    try {
      const success = await forumService.approveForumPost(postId);
      
      if (success) {
        setPosts(posts.map(post => 
          post.id === postId 
            ? { ...post, approved: true } 
            : post
        ));
        
        toast({
          title: "Post approved",
          description: "The post is now visible to all users."
        });
      }
    } catch (error) {
      console.error("Error approving post:", error);
      toast({
        variant: "destructive",
        title: "Failed to approve post",
        description: "Please try again or contact support if the problem persists."
      });
    }
  };

  const deletePost = async (postId: string) => {
    try {
      const success = await forumService.deleteForumPost(postId);
      
      if (success) {
        setPosts(posts.filter(post => post.id !== postId));
        
        toast({
          title: "Post deleted",
          description: "The post has been removed."
        });
      }
    } catch (error) {
      console.error("Error deleting post:", error);
      toast({
        variant: "destructive",
        title: "Failed to delete post",
        description: "Please try again or contact support if the problem persists."
      });
    }
  };

  const likePost = async (postId: string) => {
    if (!user) {
      toast({
        variant: "destructive",
        title: "Authentication required",
        description: "Please log in to like posts."
      });
      return false;
    }
    
    try {
      const isLiked = await forumService.checkPostLike(user.id, postId);
      
      if (isLiked) {
        const success = await forumService.removePostLike(user.id, postId);
        
        if (success) {
          setPosts(posts.map(post => 
            post.id === postId 
              ? { ...post, likes: Math.max(0, post.likes - 1) } 
              : post
          ));
          
          return false;
        }
      } else {
        const success = await forumService.addPostLike(user.id, postId);
        
        if (success) {
          setPosts(posts.map(post => 
            post.id === postId 
              ? { ...post, likes: post.likes + 1 } 
              : post
          ));
          
          return true;
        }
      }
      
      return null;
    } catch (error) {
      console.error("Error toggling post like:", error);
      toast({
        variant: "destructive",
        title: "Failed to like post",
        description: "Please try again or contact support if the problem persists."
      });
      return null;
    }
  };

  const isLiked = async (postId: string) => {
    if (!user) return false;
    return await forumService.checkPostLike(user.id, postId);
  };

  const addComment = async (postId: string, content: string) => {
    if (!user) {
      toast({
        variant: "destructive",
        title: "Authentication required",
        description: "Please log in to comment on posts."
      });
      return null;
    }
    
    try {
      const newComment = await forumService.addComment(postId, user.id, content);
      
      if (newComment) {
        setPosts(posts.map(post => {
          if (post.id === postId) {
            return {
              ...post,
              comments: [...(post.comments || []), newComment]
            };
          }
          return post;
        }));
        
        toast({
          title: "Comment added",
          description: "Your comment has been posted successfully."
        });
        
        return newComment;
      }
      
      return null;
    } catch (error) {
      console.error("Error adding comment:", error);
      toast({
        variant: "destructive",
        title: "Failed to add comment",
        description: "Please try again or contact support if the problem persists."
      });
      return null;
    }
  };

  const getInitials = (name: string) => {
    if (!name) return "U";
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  return {
    posts,
    categories,
    loading,
    createPost,
    approvePost,
    deletePost,
    fetchPosts,
    getInitials,
    toggleBookmark: (postId: string, title: string, content: string) => 
      toggleBookmark(postId, 'post', title, content),
    isBookmarked: (postId: string) => isBookmarked(postId, 'post'),
    bookmarkedPosts,
    likePost,
    isLiked,
    addComment
  };
};
