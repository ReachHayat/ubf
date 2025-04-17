
import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { 
  MessageSquare, 
  ThumbsUp, 
  Share, 
  MoreVertical,
  CheckCircle,
  Trash2,
  Bookmark,
  BookmarkCheck,
  Image,
  X,
  ExternalLink
} from "lucide-react";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { CommentList } from "./CommentList";
import { Post } from "@/hooks/useForum";
import { toast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { supabase } from "@/integrations/supabase/client";

interface ForumPostProps {
  post: Post;
  isAdmin: boolean;
  getInitials: (name: string) => string;
  onApprove: (postId: string) => void;
  onDelete: (postId: string) => void;
  onLike?: (postId: string) => Promise<boolean | null>;
  onBookmark?: (postId: string, title: string, content: string) => Promise<boolean | null>;
  isBookmarked?: boolean;
  isPending?: boolean;
}

export const ForumPost: React.FC<ForumPostProps> = ({
  post,
  isAdmin,
  getInitials,
  onApprove,
  onDelete,
  onLike,
  onBookmark,
  isBookmarked = false,
  isPending = false
}) => {
  const { user } = useAuth();
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(post.likes || 0);
  const [bookmarked, setBookmarked] = useState(isBookmarked);
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);
  const [shareUrl, setShareUrl] = useState("");
  const [shareSuccess, setShareSuccess] = useState(false);
  
  // Check if user has liked the post
  useEffect(() => {
    const checkIfLiked = async () => {
      if (user) {
        try {
          const { data } = await supabase
            .from('post_likes')
            .select('id')
            .eq('user_id', user.id)
            .eq('post_id', post.id)
            .single();
            
          setLiked(!!data);
        } catch (error) {
          // Not liked yet
          setLiked(false);
        }
      }
    };
    
    checkIfLiked();
  }, [user, post.id]);
  
  // Update bookmarked status when isBookmarked prop changes
  useEffect(() => {
    setBookmarked(isBookmarked);
  }, [isBookmarked]);
  
  const handleComment = async () => {
    if (!commentText.trim()) return;
    
    try {
      const newComment = {
        post_id: post.id,
        user_id: user?.id || "unknown",
        content: commentText,
        approved: true
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
        // Add the comment to the post
        if (!post.comments) {
          post.comments = [];
        }
        
        post.comments.push(data[0]);
      }
      
      setCommentText("");
      toast({
        title: "Comment submitted",
        description: "Your comment has been added to the post."
      });
    } catch (error) {
      console.error("Error submitting comment:", error);
      toast({
        variant: "destructive",
        title: "Failed to add comment",
        description: "Please try again or contact support if the problem persists."
      });
    }
  };
  
  const toggleLike = async () => {
    if (!user) {
      toast({
        variant: "destructive",
        title: "Authentication required",
        description: "Please log in to like posts"
      });
      return;
    }
    
    if (onLike) {
      const result = await onLike(post.id);
      
      if (result !== null) {
        setLiked(result);
        setLikeCount(prev => result ? prev + 1 : prev - 1);
        
        toast({
          title: result ? "Post liked" : "Like removed",
          description: result ? "You have liked this post" : "You have removed your like from this post"
        });
      }
    } else {
      try {
        // Check if user has already liked this post
        const { data: existingLike, error: checkError } = await supabase
          .from('post_likes')
          .select('*')
          .eq('user_id', user.id)
          .eq('post_id', post.id);
        
        if (checkError) throw checkError;
        
        if (existingLike && existingLike.length > 0) {
          // User already liked this post, remove the like
          const { error: deleteError } = await supabase
            .from('post_likes')
            .delete()
            .eq('id', existingLike[0].id);
          
          if (deleteError) throw deleteError;
          
          setLiked(false);
          setLikeCount(prev => Math.max(0, prev - 1));
          
          toast({
            title: "Like removed",
            description: "You have removed your like from this post"
          });
        } else {
          // Add new like
          const { error: insertError } = await supabase
            .from('post_likes')
            .insert({ user_id: user.id, post_id: post.id });
          
          if (insertError) throw insertError;
          
          setLiked(true);
          setLikeCount(prev => prev + 1);
          
          toast({
            title: "Post liked",
            description: "You have liked this post"
          });
        }
      } catch (error) {
        console.error("Error toggling like:", error);
        toast({
          variant: "destructive",
          title: "Failed to update like",
          description: "Please try again later"
        });
      }
    }
  };
  
  const toggleBookmark = async () => {
    if (!user) {
      toast({
        variant: "destructive",
        title: "Authentication required",
        description: "Please log in to bookmark posts"
      });
      return;
    }
    
    if (onBookmark) {
      const result = await onBookmark(post.id, post.title, post.content);
      
      if (result !== null) {
        setBookmarked(result);
        
        toast({
          title: result ? "Post bookmarked" : "Bookmark removed",
          description: result 
            ? "This post has been added to your bookmarks" 
            : "This post has been removed from your bookmarks"
        });
      }
    } else {
      try {
        // Check if post is already bookmarked
        const { data: existingBookmark, error: checkError } = await supabase
          .from('bookmarks')
          .select('*')
          .eq('user_id', user.id)
          .eq('content_id', post.id)
          .eq('content_type', 'post');
        
        if (checkError) throw checkError;
        
        if (existingBookmark && existingBookmark.length > 0) {
          // Remove bookmark
          const { error: deleteError } = await supabase
            .from('bookmarks')
            .delete()
            .eq('id', existingBookmark[0].id);
          
          if (deleteError) throw deleteError;
          
          setBookmarked(false);
          
          toast({
            title: "Bookmark removed",
            description: "This post has been removed from your bookmarks"
          });
        } else {
          // Add bookmark
          const { error: insertError } = await supabase
            .from('bookmarks')
            .insert({
              user_id: user.id,
              content_id: post.id,
              content_type: 'post',
              title: post.title,
              description: post.content
            });
          
          if (insertError) throw insertError;
          
          setBookmarked(true);
          
          toast({
            title: "Post bookmarked",
            description: "This post has been added to your bookmarks"
          });
        }
      } catch (error) {
        console.error("Error toggling bookmark:", error);
        toast({
          variant: "destructive",
          title: "Failed to update bookmark",
          description: "Please try again later"
        });
      }
    }
  };
  
  const handleShare = () => {
    // Generate a shareable URL
    const url = `${window.location.origin}/community/post/${post.id}`;
    setShareUrl(url);
    setShareSuccess(false);
    setIsShareDialogOpen(true);
  };
  
  const copyShareLink = () => {
    navigator.clipboard.writeText(shareUrl).then(() => {
      setShareSuccess(true);
      toast({
        title: "Link copied!",
        description: "Post link copied to clipboard"
      });
    });
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  return (
    <>
      <Card className={`p-4 ${isPending ? "border-amber-300 border-2" : ""}`}>
        <div className="flex gap-4">
          <Avatar>
            <AvatarFallback>{getInitials(post.user?.full_name || post.user?.name || 'User')}</AvatarFallback>
          </Avatar>
          
          <div className="flex-1">
            <div className="flex justify-between items-start">
              <div>
                <div className="font-medium">{post.user?.full_name || post.user?.name || 'Unknown User'}</div>
                <div className="text-xs text-muted-foreground">{formatDate(post.created_at)}</div>
              </div>
              
              <div className="flex items-center gap-2">
                {isPending && (
                  <Badge variant="outline" className="bg-amber-50 text-amber-800 border-amber-300">
                    Pending Approval
                  </Badge>
                )}
                
                {isAdmin && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      {!post.approved && (
                        <DropdownMenuItem onClick={() => onApprove(post.id)}>
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Approve Post
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem onClick={() => onDelete(post.id)} className="text-red-500">
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete Post
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </div>
            </div>
            
            <h3 className="font-semibold mt-2 text-lg">{post.title}</h3>
            <p className="mt-2">{post.content}</p>
            
            {/* Media display (images or videos) */}
            {post.media && post.media.length > 0 && (
              <div className="mt-4 space-y-2">
                {post.media.map((media: any, index: number) => (
                  <div key={index} className="rounded-lg overflow-hidden">
                    {media.type === "image" ? (
                      <img 
                        src={media.url} 
                        alt={`Post media ${index + 1}`} 
                        className="max-h-96 object-contain mx-auto"
                      />
                    ) : media.type === "video" ? (
                      <video 
                        controls
                        src={media.url}
                        className="max-h-96 w-full object-contain"
                      />
                    ) : null}
                  </div>
                ))}
              </div>
            )}
            
            {post.category && (
              <Badge variant="secondary" className="mt-3">
                {post.category.name}
              </Badge>
            )}
            
            <div className="flex gap-4 mt-4">
              <Button 
                variant="ghost" 
                size="sm" 
                className={`text-muted-foreground ${liked ? 'text-primary' : ''}`} 
                onClick={toggleLike}
              >
                <ThumbsUp className={`h-4 w-4 mr-2 ${liked ? 'fill-primary' : ''}`} />
                {likeCount}
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-muted-foreground"
                onClick={() => setShowComments(!showComments)}
              >
                <MessageSquare className="h-4 w-4 mr-2" />
                {post.comments?.length || 0} Comments
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-muted-foreground"
                onClick={handleShare}
              >
                <Share className="h-4 w-4 mr-2" />
                Share
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                className={`text-muted-foreground ${bookmarked ? 'text-primary' : ''}`} 
                onClick={toggleBookmark}
              >
                {bookmarked ? (
                  <BookmarkCheck className="h-4 w-4 mr-2 fill-primary" />
                ) : (
                  <Bookmark className="h-4 w-4 mr-2" />
                )}
                {bookmarked ? "Saved" : "Save"}
              </Button>
            </div>
            
            {showComments && (
              <div className="mt-4 space-y-4">
                {post.approved && (
                  <div className="flex gap-3 mt-4">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>{getInitials(user?.user_metadata?.full_name || user?.user_metadata?.name || "You")}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <Textarea 
                        placeholder="Write a comment..."
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                        className="min-h-12 resize-none"
                      />
                      <div className="flex justify-end mt-2">
                        <Button size="sm" disabled={!commentText.trim()} onClick={handleComment}>
                          Comment
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
                
                <CommentList 
                  comments={post.comments || []}
                  getInitials={getInitials}
                  isAdmin={isAdmin}
                />
              </div>
            )}
          </div>
        </div>
      </Card>
      
      <Dialog open={isShareDialogOpen} onOpenChange={setIsShareDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Share this post</DialogTitle>
          </DialogHeader>
          <div className="flex items-center space-x-2 mt-2">
            <div className="grid flex-1 gap-2">
              <Input
                className="w-full"
                value={shareUrl}
                readOnly
              />
            </div>
            <Button 
              type="button" 
              size="sm" 
              className="px-3" 
              onClick={copyShareLink}
              disabled={shareSuccess}
            >
              {shareSuccess ? (
                <span className="flex items-center">
                  <CheckCircle className="h-4 w-4 mr-1" />
                  Copied
                </span>
              ) : (
                <span>Copy</span>
              )}
            </Button>
          </div>
          <div className="mt-4">
            <p className="text-sm text-muted-foreground">Or share directly:</p>
            <div className="flex gap-2 mt-2">
              <Button variant="outline" size="sm" className="flex-1">
                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                Facebook
              </Button>
              <Button variant="outline" size="sm" className="flex-1">
                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                </svg>
                Twitter
              </Button>
              <Button variant="outline" size="sm" className="flex-1">
                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
                LinkedIn
              </Button>
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setIsShareDialogOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
