
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
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

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

const AdminCommunity = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Community Management</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="discussions">
          <TabsList>
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
    </Card>
  );
};

export default AdminCommunity;
