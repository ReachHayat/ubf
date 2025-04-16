
import React, { useState } from "react";
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

interface ForumPostProps {
  post: Post;
  isAdmin: boolean;
  getInitials: (name: string) => string;
  onApprove: (postId: string) => void;
  onDelete: (postId: string) => void;
  isPending?: boolean;
}

export const ForumPost: React.FC<ForumPostProps> = ({
  post,
  isAdmin,
  getInitials,
  onApprove,
  onDelete,
  isPending = false
}) => {
  const { user } = useAuth();
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(post.likes || 0);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);
  const [shareUrl, setShareUrl] = useState("");
  const [shareSuccess, setShareSuccess] = useState(false);
  
  const handleComment = () => {
    if (commentText.trim()) {
      // Add the comment to the post
      if (!post.comments) {
        post.comments = [];
      }
      
      post.comments.push({
        id: `comment-${Date.now()}`,
        post_id: post.id,
        user_id: user?.id || "unknown",
        content: commentText,
        approved: true,
        created_at: new Date().toISOString(),
        user: {
          id: user?.id || "unknown",
          email: user?.email || "unknown",
          full_name: user?.user_metadata?.full_name || "User"
        }
      });
      
      setCommentText("");
      toast({
        title: "Comment submitted",
        description: "Your comment has been added to the post."
      });
    }
  };
  
  const toggleLike = () => {
    if (liked) {
      setLikeCount(likeCount - 1);
    } else {
      setLikeCount(likeCount + 1);
    }
    setLiked(!liked);
    
    toast({
      title: liked ? "Post unliked" : "Post liked",
      description: liked ? "You have removed your like from this post" : "You have liked this post"
    });
  };
  
  const toggleBookmark = () => {
    setIsBookmarked(!isBookmarked);
    
    toast({
      title: isBookmarked ? "Post removed from bookmarks" : "Post bookmarked",
      description: isBookmarked 
        ? "This post has been removed from your bookmarks" 
        : "This post has been added to your bookmarks"
    });
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
            <AvatarFallback>{getInitials(post.user?.full_name || 'User')}</AvatarFallback>
          </Avatar>
          
          <div className="flex-1">
            <div className="flex justify-between items-start">
              <div>
                <div className="font-medium">{post.user?.full_name || 'Unknown User'}</div>
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
                className={`text-muted-foreground ${isBookmarked ? 'text-primary' : ''}`} 
                onClick={toggleBookmark}
              >
                {isBookmarked ? (
                  <BookmarkCheck className="h-4 w-4 mr-2 fill-primary" />
                ) : (
                  <Bookmark className="h-4 w-4 mr-2" />
                )}
                {isBookmarked ? "Saved" : "Save"}
              </Button>
            </div>
            
            {showComments && (
              <div className="mt-4 space-y-4">
                {post.approved && (
                  <div className="flex gap-3 mt-4">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>{getInitials("You")}</AvatarFallback>
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
