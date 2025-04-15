
import React from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle, Trash2 } from "lucide-react";
import { Comment } from "@/hooks/useForum";

interface CommentListProps {
  comments: Comment[];
  getInitials: (name: string) => string;
  isAdmin: boolean;
}

export const CommentList: React.FC<CommentListProps> = ({ 
  comments, 
  getInitials,
  isAdmin 
}) => {
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

  if (comments.length === 0) {
    return <p className="text-center text-muted-foreground py-4">No comments yet</p>;
  }

  return (
    <div className="space-y-4 pt-2">
      {comments.map((comment) => (
        <div key={comment.id} className="flex gap-3">
          <Avatar className="h-8 w-8">
            <AvatarFallback>{getInitials(comment.user?.full_name || 'User')}</AvatarFallback>
          </Avatar>
          <div className="flex-1 bg-muted/30 p-3 rounded-lg">
            <div className="flex justify-between items-start">
              <div>
                <span className="font-medium text-sm">
                  {comment.user?.full_name || 'Unknown User'}
                </span>
                <span className="text-xs text-muted-foreground ml-2">
                  {formatDate(comment.created_at)}
                </span>
              </div>
              
              <div className="flex items-center gap-2">
                {!comment.approved && (
                  <Badge variant="outline" className="bg-amber-50 text-amber-800 border-amber-300">
                    Pending
                  </Badge>
                )}
                
                {isAdmin && (
                  <div className="flex gap-1">
                    {!comment.approved && (
                      <Button variant="ghost" size="icon" className="h-6 w-6">
                        <CheckCircle className="h-3.5 w-3.5" />
                      </Button>
                    )}
                    <Button variant="ghost" size="icon" className="h-6 w-6 text-red-500">
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                )}
              </div>
            </div>
            
            <p className="text-sm mt-1">{comment.content}</p>
          </div>
        </div>
      ))}
    </div>
  );
};
