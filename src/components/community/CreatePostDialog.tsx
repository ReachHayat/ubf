
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Image, X, FilePlus, Loader2 } from "lucide-react";

interface Category {
  id: string;
  name: string;
  description?: string;
}

interface CreatePostDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (title: string, content: string, categoryId: string, media?: any[]) => void;
  categories: Category[];
}

export const CreatePostDialog: React.FC<CreatePostDialogProps> = ({
  open,
  onOpenChange,
  onSubmit,
  categories
}) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [media, setMedia] = useState<{file: File, preview: string, type: string}[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Reset form when dialog opens/closes
  React.useEffect(() => {
    if (!open) {
      setTimeout(() => {
        setTitle("");
        setContent("");
        setCategoryId("");
        setMedia([]);
        setIsSubmitting(false);
      }, 300);
    }
  }, [open]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim() || !categoryId) return;
    
    setIsSubmitting(true);
    
    // Process the media uploads
    const processedMedia = media.map(item => ({
      url: item.preview, // In a real app, this would be the uploaded file URL
      type: item.type // "image" or "video"
    }));
    
    // Call the parent's onSubmit handler
    onSubmit(title, content, categoryId, processedMedia);
    
    // Close dialog automatically
    onOpenChange(false);
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    const file = files[0];
    const fileType = file.type.startsWith('image/') ? 'image' : file.type.startsWith('video/') ? 'video' : null;
    
    if (!fileType) {
      alert("Please upload an image or video file.");
      return;
    }
    
    // Create a preview URL for the file
    const previewUrl = URL.createObjectURL(file);
    
    setMedia([...media, {
      file,
      preview: previewUrl,
      type: fileType
    }]);
    
    // Reset the input to allow selecting the same file again
    e.target.value = '';
  };
  
  const removeMedia = (index: number) => {
    const newMedia = [...media];
    
    // Revoke object URL to prevent memory leaks
    URL.revokeObjectURL(newMedia[index].preview);
    
    newMedia.splice(index, 1);
    setMedia(newMedia);
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Create New Post</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                placeholder="Post Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="content">Content</Label>
              <Textarea
                id="content"
                placeholder="What's on your mind?"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={5}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select value={categoryId} onValueChange={setCategoryId} required>
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {/* Media uploads */}
            <div className="space-y-2">
              <Label>Media (Optional)</Label>
              
              {/* Media preview */}
              {media.length > 0 && (
                <div className="grid grid-cols-2 gap-2 mb-2">
                  {media.map((item, index) => (
                    <div key={index} className="relative group border rounded-md overflow-hidden">
                      {item.type === "image" ? (
                        <img 
                          src={item.preview} 
                          alt={`Media ${index}`} 
                          className="w-full h-32 object-cover"
                        />
                      ) : (
                        <video 
                          src={item.preview} 
                          className="w-full h-32 object-cover" 
                          controls
                        />
                      )}
                      <Button 
                        type="button"
                        size="icon"
                        variant="destructive"
                        className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => removeMedia(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
              
              {media.length < 4 && (
                <div className="flex items-center gap-4">
                  <Label 
                    htmlFor="media-upload" 
                    className="cursor-pointer flex items-center justify-center gap-2 border border-dashed rounded-lg p-4 hover:bg-accent/50 transition-colors"
                  >
                    <Image className="h-4 w-4" />
                    <span>Add Image</span>
                    <Input 
                      id="media-upload" 
                      type="file" 
                      className="hidden" 
                      accept="image/*, video/*"
                      onChange={handleFileChange}
                    />
                  </Label>
                </div>
              )}
              
              {media.length > 0 && (
                <p className="text-xs text-muted-foreground">
                  {media.length}/4 media items added
                </p>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={!title.trim() || !content.trim() || !categoryId || isSubmitting}
              className="min-w-[100px]"
            >
              {isSubmitting ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <>Submit</>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
