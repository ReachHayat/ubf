
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useBookmarks } from "./useBookmarks";

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
  const { bookmarks: bookmarkedItems, toggleBookmark, isBookmarked } = useBookmarks();
  
  const bookmarkedPosts = bookmarkedItems
    .filter(b => b.content_type === 'post')
    .map(b => b.content_id);

  useEffect(() => {
    fetchPosts();
  }, [user]);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      
      // In a real implementation, we'd fetch from Supabase
      const { data: postsData, error: postsError } = await supabase
        .from('community_posts')
        .select(`
          *,
          user:users(id, email, name, full_name, avatar_url)
        `)
        .order('created_at', { ascending: false });
      
      if (postsError) throw postsError;
      
      // Fetch comments for each post
      let processedPosts: Post[] = [];
      
      for (const post of (postsData || [])) {
        const { data: commentsData, error: commentsError } = await supabase
          .from('post_comments')
          .select(`
            *,
            user:users(id, email, name, full_name, avatar_url)
          `)
          .eq('post_id', post.id)
          .order('created_at', { ascending: true });
          
        if (commentsError) throw commentsError;
        
        // Get like count for this post
        const { count: likesCount, error: likesError } = await supabase
          .from('post_likes')
          .select('*', { count: 'exact', head: true })
          .eq('post_id', post.id);
          
        if (likesError) throw likesError;
        
        processedPosts.push({
          ...post,
          comments: commentsData || [],
          likes: likesCount || 0
        });
      }
      
      setPosts(processedPosts);
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
      // Insert the new post to Supabase
      const newPost = {
        title,
        content,
        user_id: user.id,
        category_id: categoryId,
        approved: user.user_metadata?.is_admin ? true : false, // Auto approve if admin
        media: media || []
      };
      
      const { data, error } = await supabase
        .from('community_posts')
        .insert(newPost)
        .select(`
          *,
          user:users(id, email, name, full_name, avatar_url)
        `);
      
      if (error) throw error;
      
      if (data && data.length > 0) {
        setPosts([{...data[0], comments: [], likes: 0}, ...posts]);
      }
      
      toast({
        title: user.user_metadata?.is_admin ? "Post created" : "Post submitted for approval",
        description: user.user_metadata?.is_admin 
          ? "Your post has been published." 
          : "Your post will be visible after admin approval."
      });
      
      return data?.[0];
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
      const { data, error } = await supabase
        .from('community_posts')
        .update({ approved: true })
        .eq('id', postId)
        .select();
      
      if (error) throw error;
      
      setPosts(posts.map(post => 
        post.id === postId 
          ? { ...post, approved: true } 
          : post
      ));
      
      toast({
        title: "Post approved",
        description: "The post is now visible to all users."
      });
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
      const { error } = await supabase
        .from('community_posts')
        .delete()
        .eq('id', postId);
      
      if (error) throw error;
      
      // Delete any likes and comments associated with the post
      await Promise.all([
        supabase.from('post_likes').delete().eq('post_id', postId),
        supabase.from('post_comments').delete().eq('post_id', postId)
      ]);
      
      setPosts(posts.filter(post => post.id !== postId));
      
      toast({
        title: "Post deleted",
        description: "The post has been removed."
      });
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
      // Check if user has already liked this post
      const { data: existingLike, error: checkError } = await supabase
        .from('post_likes')
        .select('*')
        .eq('user_id', user.id)
        .eq('post_id', postId);
      
      if (checkError) throw checkError;
      
      if (existingLike && existingLike.length > 0) {
        // User already liked this post, remove the like
        const { error: deleteError } = await supabase
          .from('post_likes')
          .delete()
          .eq('id', existingLike[0].id);
        
        if (deleteError) throw deleteError;
        
        // Update like count in local state
        setPosts(posts.map(post => 
          post.id === postId 
            ? { ...post, likes: Math.max(0, post.likes - 1) } 
            : post
        ));
        
        return false; // Not liked anymore
      } else {
        // Add new like
        const { error: insertError } = await supabase
          .from('post_likes')
          .insert({ user_id: user.id, post_id: postId });
        
        if (insertError) throw insertError;
        
        // Update like count in local state
        setPosts(posts.map(post => 
          post.id === postId 
            ? { ...post, likes: post.likes + 1 } 
            : post
        ));
        
        return true; // Liked
      }
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
    
    try {
      const { data, error } = await supabase
        .from('post_likes')
        .select('*')
        .eq('user_id', user.id)
        .eq('post_id', postId);
      
      if (error) throw error;
      
      return data && data.length > 0;
    } catch (error) {
      console.error("Error checking if post is liked:", error);
      return false;
    }
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
      const newComment = {
        post_id: postId,
        user_id: user.id,
        content,
        approved: true // Comments are auto-approved by default
      };
      
      const { data, error } = await supabase
        .from('post_comments')
        .insert(newComment)
        .select(`
          *,
          user:users(id, email, name, full_name, avatar_url)
        `);
      
      if (error) throw error;
      
      if (data && data.length > 0) {
        // Update local state with the new comment
        setPosts(posts.map(post => {
          if (post.id === postId) {
            return {
              ...post,
              comments: [...(post.comments || []), data[0]]
            };
          }
          return post;
        }));
        
        toast({
          title: "Comment added",
          description: "Your comment has been posted successfully."
        });
        
        return data[0];
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
