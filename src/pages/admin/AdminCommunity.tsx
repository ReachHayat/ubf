
import React, { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Category, Post } from "@/hooks/useForum";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter 
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { 
  Edit,
  Trash2,
  CheckCircle,
  MessageSquare
} from "lucide-react";

const AdminCommunity: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [pendingPosts, setPendingPosts] = useState<Post[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [categoryDialogOpen, setCategoryDialogOpen] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newCategoryDescription, setNewCategoryDescription] = useState("");
  
  useEffect(() => {
    fetchData();
  }, []);
  
  const fetchData = () => {
    setLoading(true);
    // Mock data - in a real app this would come from Supabase
    const mockCategories: Category[] = [
      { id: "general", name: "General Discussion", description: "General topics about the platform" },
      { id: "questions", name: "Questions & Answers", description: "Get help with your questions" },
      { id: "resources", name: "Resources & Materials", description: "Share helpful resources" }
    ];
    
    const mockPosts: Post[] = [
      {
        id: "1",
        title: "Welcome to the Community Forum!",
        content: "This is the official community forum for our platform.",
        author: {
          id: "admin-123",
          name: "Admin User",
          avatar: "",
        },
        created_at: new Date().toISOString(),
        likes: 15,
        comments: [],
        tags: ["welcome"],
        approved: true,
        user: {
          id: "admin-123",
          full_name: "Admin User",
          name: "Admin User"
        },
        category: mockCategories[0]
      },
      {
        id: "3",
        title: "Free UX Design Resources",
        content: "I've compiled a list of free UX design resources.",
        author: {
          id: "user-789",
          name: "Design Enthusiast",
          avatar: "",
        },
        created_at: new Date(Date.now() - 172800000).toISOString(),
        likes: 0,
        comments: [],
        tags: ["design", "resources"],
        approved: false,
        user: {
          id: "user-789",
          full_name: "Design Enthusiast",
          name: "Design Enthusiast"
        },
        category: mockCategories[2]
      }
    ];
    
    setCategories(mockCategories);
    setPosts(mockPosts.filter(post => post.approved));
    setPendingPosts(mockPosts.filter(post => !post.approved));
    setLoading(false);
  };
  
  const handleCreateCategory = () => {
    if (!newCategoryName.trim()) return;
    
    const newCategory: Category = {
      id: `category-${Date.now()}`,
      name: newCategoryName,
      description: newCategoryDescription
    };
    
    setCategories([...categories, newCategory]);
    setNewCategoryName("");
    setNewCategoryDescription("");
    setCategoryDialogOpen(false);
    
    toast({
      title: "Category created",
      description: `${newCategoryName} has been created successfully.`
    });
  };
  
  const handleDeleteCategory = (categoryId: string) => {
    if (!confirm("Are you sure you want to delete this category? All posts in this category will be lost.")) {
      return;
    }
    
    setCategories(categories.filter(category => category.id !== categoryId));
    
    toast({
      title: "Category deleted",
      description: "The category has been deleted successfully."
    });
  };
  
  const handleApprovePost = (postId: string) => {
    const postToApprove = pendingPosts.find(post => post.id === postId);
    if (!postToApprove) return;
    
    setPendingPosts(pendingPosts.filter(post => post.id !== postId));
    setPosts([{ ...postToApprove, approved: true }, ...posts]);
    
    toast({
      title: "Post approved",
      description: "The post is now visible to all users."
    });
  };
  
  const handleDeletePost = (postId: string, isPending: boolean) => {
    if (!confirm("Are you sure you want to delete this post?")) {
      return;
    }
    
    if (isPending) {
      setPendingPosts(pendingPosts.filter(post => post.id !== postId));
    } else {
      setPosts(posts.filter(post => post.id !== postId));
    }
    
    toast({
      title: "Post deleted",
      description: "The post has been deleted successfully."
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Community Management</h1>
      </div>
      
      <Tabs defaultValue="categories">
        <TabsList>
          <TabsTrigger value="categories">Categories</TabsTrigger>
          <TabsTrigger value="pending">
            Pending Posts 
            {pendingPosts.length > 0 && (
              <Badge className="ml-2 bg-red-500">{pendingPosts.length}</Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="approved">Approved Posts</TabsTrigger>
        </TabsList>
        
        <TabsContent value="categories" className="mt-4">
          <Card className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Forum Categories</h2>
              <Button onClick={() => setCategoryDialogOpen(true)}>
                Add Category
              </Button>
            </div>
            
            {loading ? (
              <p>Loading categories...</p>
            ) : categories.length > 0 ? (
              <div className="divide-y">
                {categories.map(category => (
                  <div key={category.id} className="py-3 flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">{category.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {category.description || "No description"}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4 mr-1" /> Edit
                      </Button>
                      <Button 
                        variant="destructive" 
                        size="sm"
                        onClick={() => handleDeleteCategory(category.id)}
                      >
                        <Trash2 className="h-4 w-4 mr-1" /> Delete
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p>No categories found. Create your first category!</p>
            )}
          </Card>
        </TabsContent>
        
        <TabsContent value="pending" className="mt-4">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Posts Waiting for Approval</h2>
            
            {loading ? (
              <p>Loading pending posts...</p>
            ) : pendingPosts.length > 0 ? (
              <div className="divide-y">
                {pendingPosts.map(post => (
                  <div key={post.id} className="py-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-medium">{post.title}</h3>
                      <Badge className="bg-amber-500">Pending</Badge>
                    </div>
                    <p className="text-sm mb-2 line-clamp-2">{post.content}</p>
                    <div className="flex justify-between items-center">
                      <div className="text-xs text-muted-foreground">
                        By {post.user?.full_name || "Unknown"} • {new Date(post.created_at).toLocaleDateString()} • 
                        <Badge variant="outline" className="ml-2">
                          {post.category?.name || "Uncategorized"}
                        </Badge>
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleApprovePost(post.id)}
                        >
                          <CheckCircle className="h-4 w-4 mr-1" /> Approve
                        </Button>
                        <Button 
                          variant="destructive" 
                          size="sm"
                          onClick={() => handleDeletePost(post.id, true)}
                        >
                          <Trash2 className="h-4 w-4 mr-1" /> Delete
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <MessageSquare className="h-16 w-16 mx-auto text-muted-foreground/30" />
                <p className="mt-2 text-muted-foreground">No posts waiting for approval</p>
              </div>
            )}
          </Card>
        </TabsContent>
        
        <TabsContent value="approved" className="mt-4">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Approved Posts</h2>
            
            {loading ? (
              <p>Loading approved posts...</p>
            ) : posts.length > 0 ? (
              <div className="divide-y">
                {posts.map(post => (
                  <div key={post.id} className="py-4">
                    <h3 className="font-medium">{post.title}</h3>
                    <p className="text-sm mb-2 line-clamp-2">{post.content}</p>
                    <div className="flex justify-between items-center">
                      <div className="text-xs text-muted-foreground">
                        By {post.user?.full_name || "Unknown"} • {new Date(post.created_at).toLocaleDateString()} • 
                        <Badge variant="outline" className="ml-2">
                          {post.category?.name || "Uncategorized"}
                        </Badge>
                      </div>
                      <Button 
                        variant="destructive" 
                        size="sm"
                        onClick={() => handleDeletePost(post.id, false)}
                      >
                        <Trash2 className="h-4 w-4 mr-1" /> Delete
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <MessageSquare className="h-16 w-16 mx-auto text-muted-foreground/30" />
                <p className="mt-2 text-muted-foreground">No approved posts yet</p>
              </div>
            )}
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* Category Dialog */}
      <Dialog open={categoryDialogOpen} onOpenChange={setCategoryDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create a new category</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="name">Category Name</Label>
              <Input 
                id="name" 
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                placeholder="e.g., Announcements, Help & Support"
              />
            </div>
            <div>
              <Label htmlFor="description">Description (optional)</Label>
              <Input 
                id="description" 
                value={newCategoryDescription}
                onChange={(e) => setNewCategoryDescription(e.target.value)}
                placeholder="Brief description of this category"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCategoryDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleCreateCategory} disabled={!newCategoryName.trim()}>Create Category</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminCommunity;
