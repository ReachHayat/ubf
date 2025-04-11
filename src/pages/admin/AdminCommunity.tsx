
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertTriangle,
  CheckCircle,
  EyeOff,
  MessageSquare,
  Users,
  Plus,
  Trash2,
  Edit,
  RefreshCw,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useCommunity, Channel } from "@/hooks/useCommunity";

const AdminCommunity = () => {
  const [loading, setLoading] = useState(false);
  const [channels, setChannels] = useState<Channel[]>([]);
  const [newChannelDialogOpen, setNewChannelDialogOpen] = useState(false);
  const [newChannelName, setNewChannelName] = useState("");
  const [editChannelDialogOpen, setEditChannelDialogOpen] = useState(false);
  const [editChannelId, setEditChannelId] = useState("");
  const [editChannelName, setEditChannelName] = useState("");
  const { createChannel, updateChannel, deleteChannel } = useCommunity();
  
  const fetchChannels = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('channels')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      
      if (data) {
        setChannels(data);
      }
    } catch (error) {
      console.error('Error fetching channels:', error);
      toast({
        variant: "destructive",
        title: "Failed to load channels",
        description: "Please try again or contact support if the issue persists."
      });
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchChannels();
  }, []);
  
  const handleCreateChannel = async () => {
    if (!newChannelName.trim()) return;
    
    const result = await createChannel(newChannelName);
    if (result) {
      setNewChannelName("");
      setNewChannelDialogOpen(false);
      fetchChannels();
    }
  };
  
  const handleEditChannel = async () => {
    if (!editChannelName.trim() || !editChannelId) return;
    
    const result = await updateChannel(editChannelId, editChannelName);
    if (result) {
      setEditChannelDialogOpen(false);
      fetchChannels();
    }
  };
  
  const handleDeleteChannel = async (channelId: string) => {
    const result = await deleteChannel(channelId);
    if (result) {
      fetchChannels();
    }
  };
  
  const openEditChannelDialog = (channel: Channel) => {
    setEditChannelId(channel.id);
    setEditChannelName(channel.name);
    setEditChannelDialogOpen(true);
  };

  // Mock data for other sections
  const mockDiscussions = [
    {
      id: "1",
      title: "Brand strategy for startups",
      author: "John Doe",
      replies: 24,
      views: 156,
      category: "Brand Strategy",
      status: "active",
      lastActivity: "2 hours ago"
    },
    {
      id: "2",
      title: "How to create a memorable logo?",
      author: "Jane Smith",
      replies: 18,
      views: 112,
      category: "Design",
      status: "active",
      lastActivity: "5 hours ago"
    },
    {
      id: "3",
      title: "Measuring brand awareness",
      author: "Robert Johnson",
      replies: 7,
      views: 89,
      category: "Analytics",
      status: "active",
      lastActivity: "1 day ago"
    },
  ];

  const mockReports = [
    {
      id: "1",
      type: "post",
      content: "Inappropriate promotional content",
      reporter: "Emily Wilson",
      reportDate: "2024-04-08",
      status: "pending"
    },
    {
      id: "2",
      type: "comment",
      content: "Offensive language used",
      reporter: "Michael Brown",
      reportDate: "2024-04-07",
      status: "resolved"
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Community Management</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="channels">
          <TabsList>
            <TabsTrigger value="channels" className="flex items-center">
              <MessageSquare className="h-4 w-4 mr-2" />
              Channels
            </TabsTrigger>
            <TabsTrigger value="discussions" className="flex items-center">
              <MessageSquare className="h-4 w-4 mr-2" />
              Discussions
            </TabsTrigger>
            <TabsTrigger value="groups" className="flex items-center">
              <Users className="h-4 w-4 mr-2" />
              Groups
            </TabsTrigger>
            <TabsTrigger value="reports" className="flex items-center">
              <AlertTriangle className="h-4 w-4 mr-2" />
              Reports
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="channels" className="mt-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Community Channels</h3>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={fetchChannels}>
                  <RefreshCw className="h-4 w-4 mr-1" />
                  Refresh
                </Button>
                <Button size="sm" onClick={() => setNewChannelDialogOpen(true)}>
                  <Plus className="h-4 w-4 mr-1" />
                  New Channel
                </Button>
              </div>
            </div>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-8">
                        Loading channels...
                      </TableCell>
                    </TableRow>
                  ) : channels.length > 0 ? (
                    channels.map((channel) => (
                      <TableRow key={channel.id}>
                        <TableCell className="font-medium">#{channel.name}</TableCell>
                        <TableCell className="capitalize">{channel.type}</TableCell>
                        <TableCell>{new Date(channel.created_at).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button variant="outline" size="sm" onClick={() => openEditChannelDialog(channel)}>
                              <Edit className="h-4 w-4 mr-1" />
                              Edit
                            </Button>
                            <Button variant="outline" size="sm" className="text-red-500" onClick={() => handleDeleteChannel(channel.id)}>
                              <Trash2 className="h-4 w-4 mr-1" />
                              Delete
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-8">
                        No channels found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
          
          <TabsContent value="discussions" className="mt-6">
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Author</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Replies</TableHead>
                    <TableHead>Views</TableHead>
                    <TableHead>Last Activity</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockDiscussions.map((discussion) => (
                    <TableRow key={discussion.id}>
                      <TableCell className="font-medium">{discussion.title}</TableCell>
                      <TableCell>{discussion.author}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{discussion.category}</Badge>
                      </TableCell>
                      <TableCell>{discussion.replies}</TableCell>
                      <TableCell>{discussion.views}</TableCell>
                      <TableCell>{discussion.lastActivity}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm">View</Button>
                          <Button variant="outline" size="sm" className="text-red-500">
                            <EyeOff className="h-4 w-4 mr-1" />
                            Hide
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
          
          <TabsContent value="groups" className="mt-6">
            <div className="flex justify-center items-center p-6 text-center">
              <div>
                <h3 className="text-lg font-medium mb-2">Community Groups</h3>
                <p className="text-muted-foreground mb-4">Manage discussion groups and categories</p>
                <Button>Create New Group</Button>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="reports" className="mt-6">
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Type</TableHead>
                    <TableHead>Content</TableHead>
                    <TableHead>Reporter</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockReports.map((report) => (
                    <TableRow key={report.id}>
                      <TableCell className="capitalize">{report.type}</TableCell>
                      <TableCell>{report.content}</TableCell>
                      <TableCell>{report.reporter}</TableCell>
                      <TableCell>{report.reportDate}</TableCell>
                      <TableCell>
                        <Badge variant={report.status === "pending" ? "secondary" : "outline"}>
                          {report.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm">View</Button>
                          {report.status === "pending" && (
                            <Button variant="outline" size="sm" className="text-green-500">
                              <CheckCircle className="h-4 w-4 mr-1" />
                              Resolve
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      
      {/* Create Channel Dialog */}
      <Dialog open={newChannelDialogOpen} onOpenChange={setNewChannelDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create a new channel</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="channel-name" className="text-right">
                Channel name
              </Label>
              <Input
                id="channel-name"
                value={newChannelName}
                onChange={(e) => setNewChannelName(e.target.value)}
                className="col-span-3"
                placeholder="general"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setNewChannelDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateChannel}>
              Create Channel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Edit Channel Dialog */}
      <Dialog open={editChannelDialogOpen} onOpenChange={setEditChannelDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit channel</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-channel-name" className="text-right">
                Channel name
              </Label>
              <Input
                id="edit-channel-name"
                value={editChannelName}
                onChange={(e) => setEditChannelName(e.target.value)}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditChannelDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditChannel}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default AdminCommunity;
