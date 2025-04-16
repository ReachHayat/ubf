
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";

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
  };
  category?: Category;
  media?: {type: string, url: string}[];
}

export const useForum = () => {
  const { user, isAdmin } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [bookmarkedPosts, setBookmarkedPosts] = useState<string[]>([]);
  const [categories, setCategories] = useState<Category[]>([
    { id: "general", name: "General Discussion" },
    { id: "questions", name: "Questions & Answers" },
    { id: "resources", name: "Resources & Materials" }
  ]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchPosts();
    fetchBookmarks();
  }, [user]);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      
      // Here we would normally fetch from a Supabase table
      // Since we're mocking, we'll create some sample data
      const mockPosts: Post[] = [
        {
          id: "1",
          title: "Welcome to the Community Forum!",
          content: "This is the official community forum for our platform. Feel free to ask questions, share resources, and connect with other learners.",
          user_id: "admin-123",
          category_id: "general",
          approved: true,
          created_at: new Date().toISOString(),
          likes: 15,
          user: {
            id: "admin-123",
            email: "admin@example.com",
            full_name: "Admin User"
          },
          category: { id: "general", name: "General Discussion" },
          comments: [
            {
              id: "c1",
              post_id: "1",
              user_id: "user-456",
              content: "Great to be here! Looking forward to engaging with everyone.",
              approved: true,
              created_at: new Date().toISOString(),
              user: {
                id: "user-456",
                email: "user@example.com",
                full_name: "Regular User"
              },
              likes: 2
            }
          ],
          media: [
            {
              type: "image",
              url: "https://images.unsplash.com/photo-1531482615713-2afd69097998?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
            }
          ]
        },
        {
          id: "2",
          title: "How do I get started with React?",
          content: "I'm new to React and looking for some beginner-friendly resources. Any recommendations?",
          user_id: "user-456",
          category_id: "questions",
          approved: true,
          created_at: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
          likes: 8,
          user: {
            id: "user-456",
            email: "user@example.com",
            full_name: "Regular User"
          },
          category: { id: "questions", name: "Questions & Answers" },
          comments: []
        },
        {
          id: "3",
          title: "Free UX Design Resources",
          content: "I've compiled a list of free UX design resources that I've found helpful. Check them out!",
          user_id: "user-789",
          category_id: "resources",
          approved: false,
          created_at: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
          likes: 0,
          user: {
            id: "user-789",
            email: "designer@example.com",
            full_name: "Design Enthusiast"
          },
          category: { id: "resources", name: "Resources & Materials" },
          comments: [],
          media: [
            {
              type: "image",
              url: "https://images.unsplash.com/photo-1586717799252-bd134ad00e26?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
            }
          ]
        }
      ];
      
      setPosts(mockPosts);
    } catch (error) {
      console.error("Error fetching posts:", error);
      toast({
        variant: "destructive",
        title: "Failed to load posts",
        description: "Please try again or contact support if the issue persists."
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchBookmarks = async () => {
    if (!user) return;
    
    try {
      // In a real implementation, we would fetch from Supabase
      // For now, just retrieve from localStorage
      const bookmarks = JSON.parse(localStorage.getItem(`forum-bookmarks-${user.id}`) || "[]");
      setBookmarkedPosts(bookmarks);
    } catch (error) {
      console.error("Error fetching bookmarks:", error);
    }
  };

  const toggleBookmark = async (postId: string) => {
    if (!user) return;
    
    try {
      const bookmarksKey = `forum-bookmarks-${user.id}`;
      let bookmarks = JSON.parse(localStorage.getItem(bookmarksKey) || "[]");
      
      if (bookmarks.includes(postId)) {
        // Remove bookmark
        bookmarks = bookmarks.filter((id: string) => id !== postId);
        toast({
          title: "Bookmark removed",
          description: "The post has been removed from your bookmarks."
        });
      } else {
        // Add bookmark
        bookmarks.push(postId);
        toast({
          title: "Post bookmarked",
          description: "The post has been added to your bookmarks."
        });
      }
      
      localStorage.setItem(bookmarksKey, JSON.stringify(bookmarks));
      setBookmarkedPosts(bookmarks);
    } catch (error) {
      console.error("Error toggling bookmark:", error);
      toast({
        variant: "destructive",
        title: "Failed to update bookmark",
        description: "Please try again later."
      });
    }
  };

  const isBookmarked = (postId: string) => {
    return bookmarkedPosts.includes(postId);
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
      // In a real implementation, we would insert to Supabase here
      const newPost: Post = {
        id: `new-${Date.now()}`, // This would be auto-generated by the DB
        title,
        content,
        user_id: user.id,
        category_id: categoryId,
        approved: isAdmin() ? true : false, // Auto approve if admin
        created_at: new Date().toISOString(),
        likes: 0,
        comments: [],
        user: {
          id: user.id,
          email: user.email || "",
          full_name: user.user_metadata?.full_name || ""
        },
        category: categories.find(c => c.id === categoryId),
        media: media || []
      };
      
      setPosts([newPost, ...posts]);
      
      toast({
        title: isAdmin() ? "Post created" : "Post submitted for approval",
        description: isAdmin() 
          ? "Your post has been published." 
          : "Your post will be visible after admin approval."
      });
    } catch (error) {
      console.error("Error creating post:", error);
      toast({
        variant: "destructive",
        title: "Failed to create post",
        description: "Please try again or contact support if the issue persists."
      });
      throw error;
    }
  };

  const approvePost = async (postId: string) => {
    try {
      // In a real implementation, we would update the Supabase record here
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
        description: "Please try again or contact support if the issue persists."
      });
    }
  };

  const deletePost = async (postId: string) => {
    try {
      // In a real implementation, we would delete the Supabase record here
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
        description: "Please try again or contact support if the issue persists."
      });
    }
  };

  const likePost = async (postId: string) => {
    try {
      // In a real implementation, we would update the Supabase record here
      setPosts(posts.map(post => 
        post.id === postId 
          ? { ...post, likes: post.likes + 1 } 
          : post
      ));
    } catch (error) {
      console.error("Error liking post:", error);
      toast({
        variant: "destructive",
        title: "Failed to like post",
        description: "Please try again or contact support if the issue persists."
      });
    }
  };

  const unlikePost = async (postId: string) => {
    try {
      // In a real implementation, we would update the Supabase record here
      setPosts(posts.map(post => 
        post.id === postId 
          ? { ...post, likes: Math.max(0, post.likes - 1) } 
          : post
      ));
    } catch (error) {
      console.error("Error unliking post:", error);
      toast({
        variant: "destructive",
        title: "Failed to unlike post",
        description: "Please try again or contact support if the issue persists."
      });
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
    bookmarkedPosts,
    createPost,
    approvePost,
    deletePost,
    fetchPosts,
    getInitials,
    toggleBookmark,
    isBookmarked,
    likePost,
    unlikePost
  };
};
