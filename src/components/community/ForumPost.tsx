
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
  Trash2
} from "lucide-react";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { CommentList } from "./CommentList";
import { Post } from "@/hooks/useForum";

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
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState("");
  
  const handleComment = () => {
    if (commentText.trim()) {
      // Handle submitting the comment - this would be implemented in the parent
      console.log("Comment submitted:", commentText);
      setCommentText("");
    }
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
          
          {post.category && (
            <Badge variant="secondary" className="mt-3">
              {post.category.name}
            </Badge>
          )}
          
          <div className="flex gap-4 mt-4">
            <Button variant="ghost" size="sm" className="text-muted-foreground">
              <ThumbsUp className="h-4 w-4 mr-2" />
              {post.likes || 0}
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
            <Button variant="ghost" size="sm" className="text-muted-foreground">
              <Share className="h-4 w-4 mr-2" />
              Share
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
  );
};
