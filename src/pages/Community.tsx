
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PlusCircle, Search, Bookmark } from "lucide-react";
import { ForumPost } from "@/components/community/ForumPost";
import { CreatePostDialog } from "@/components/community/CreatePostDialog";
import { useForum } from "@/hooks/useForum";

const Community = () => {
  const { user, isAdmin } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [createPostDialogOpen, setCreatePostDialogOpen] = useState(false);
  
  const { 
    posts,
    categories,
    loading,
    createPost,
    approvePost,
    deletePost,
    getInitials,
    fetchPosts,
    toggleBookmark,
    isBookmarked,
    bookmarkedPosts
  } = useForum();
  
  // Filter posts based on search query
  const filteredPosts = posts.filter(post => 
    post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.content.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Get posts that need approval (for admins)
  const pendingPosts = isAdmin() ? posts.filter(post => !post.approved) : [];
  
  // Get approved posts (for all users)
  const approvedPosts = posts.filter(post => post.approved);
  
  // Get bookmarked posts
  const userBookmarkedPosts = approvedPosts.filter(post => bookmarkedPosts.includes(post.id));
  
  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-4xl font-bold">Community Forum</h1>
        <p className="text-muted-foreground">Discuss and share with other community members</p>
      </header>

      <div className="flex flex-col gap-6">
        {/* Search and Create Post */}
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search posts..." 
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button 
            onClick={() => setCreatePostDialogOpen(true)}
            className="w-full sm:w-auto"
          >
            <PlusCircle className="h-4 w-4 mr-2" />
            Create Post
          </Button>
        </div>
        
        {/* Posts Area */}
        <Card className="p-4">
          <Tabs defaultValue="all">
            <TabsList>
              <TabsTrigger value="all">All Posts</TabsTrigger>
              {categories.map(category => (
                <TabsTrigger key={category.id} value={category.id}>
                  {category.name}
                </TabsTrigger>
              ))}
              <TabsTrigger value="bookmarks" className="relative">
                <Bookmark className="h-4 w-4 mr-2" />
                Bookmarks
                {userBookmarkedPosts.length > 0 && (
                  <span className="ml-1 text-xs opacity-70">
                    ({userBookmarkedPosts.length})
                  </span>
                )}
              </TabsTrigger>
              {isAdmin() && (
                <TabsTrigger value="pending" className="relative">
                  Pending Approval
                  {pendingPosts.length > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {pendingPosts.length}
                    </span>
                  )}
                </TabsTrigger>
              )}
            </TabsList>
            
            <TabsContent value="all" className="mt-4 space-y-4">
              {loading ? (
                <div className="text-center py-8">
                  <p>Loading posts...</p>
                </div>
              ) : approvedPosts.length > 0 ? (
                approvedPosts.map(post => (
                  <ForumPost 
                    key={post.id} 
                    post={post} 
                    isAdmin={isAdmin()} 
                    getInitials={getInitials}
                    onApprove={approvePost}
                    onDelete={deletePost}
                  />
                ))
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No posts available</p>
                  <Button 
                    variant="outline" 
                    className="mt-4"
                    onClick={() => setCreatePostDialogOpen(true)}
                  >
                    Create the first post
                  </Button>
                </div>
              )}
            </TabsContent>
            
            {categories.map(category => (
              <TabsContent key={category.id} value={category.id} className="mt-4 space-y-4">
                {loading ? (
                  <div className="text-center py-8">
                    <p>Loading posts...</p>
                  </div>
                ) : approvedPosts.filter(post => post.category_id === category.id).length > 0 ? (
                  approvedPosts
                    .filter(post => post.category_id === category.id)
                    .map(post => (
                      <ForumPost 
                        key={post.id} 
                        post={post} 
                        isAdmin={isAdmin()} 
                        getInitials={getInitials}
                        onApprove={approvePost}
                        onDelete={deletePost}
                      />
                    ))
                ) : (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">No posts in this category</p>
                    <Button 
                      variant="outline" 
                      className="mt-4"
                      onClick={() => setCreatePostDialogOpen(true)}
                    >
                      Create the first post in this category
                    </Button>
                  </div>
                )}
              </TabsContent>
            ))}
            
            <TabsContent value="bookmarks" className="mt-4 space-y-4">
              {loading ? (
                <div className="text-center py-8">
                  <p>Loading bookmarked posts...</p>
                </div>
              ) : userBookmarkedPosts.length > 0 ? (
                userBookmarkedPosts.map(post => (
                  <ForumPost 
                    key={post.id} 
                    post={post} 
                    isAdmin={isAdmin()} 
                    getInitials={getInitials}
                    onApprove={approvePost}
                    onDelete={deletePost}
                  />
                ))
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">You haven't bookmarked any posts yet</p>
                  <p className="text-sm mt-2">
                    Browse posts and click the bookmark icon to save them for later
                  </p>
                </div>
              )}
            </TabsContent>
            
            {isAdmin() && (
              <TabsContent value="pending" className="mt-4 space-y-4">
                {loading ? (
                  <div className="text-center py-8">
                    <p>Loading posts...</p>
                  </div>
                ) : pendingPosts.length > 0 ? (
                  pendingPosts.map(post => (
                    <ForumPost 
                      key={post.id} 
                      post={post} 
                      isAdmin={true}
                      getInitials={getInitials}
                      onApprove={approvePost}
                      onDelete={deletePost}
                      isPending
                    />
                  ))
                ) : (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">No posts waiting for approval</p>
                  </div>
                )}
              </TabsContent>
            )}
          </Tabs>
        </Card>
      </div>
      
      {/* Create Post Dialog */}
      <CreatePostDialog
        open={createPostDialogOpen}
        onOpenChange={setCreatePostDialogOpen}
        onSubmit={(title, content, categoryId, media) => createPost(title, content, categoryId, media)}
        categories={categories}
      />
    </div>
  );
};

export default Community;
