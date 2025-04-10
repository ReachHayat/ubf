
import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Search,
  Edit,
  Trash2,
  PlusCircle,
  Eye
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const mockCourses = [
  {
    id: "1",
    title: "The Brand Strategy Masterclass",
    category: "Marketing",
    instructor: "John Doe",
    students: 124,
    status: "published",
    rating: 4.8,
    lastUpdated: "2024-03-15"
  },
  {
    id: "2",
    title: "Brand Identity Design Essentials",
    category: "Design",
    instructor: "Jane Smith",
    students: 86,
    status: "published",
    rating: 4.5,
    lastUpdated: "2024-02-22"
  },
  {
    id: "3",
    title: "Brand Storytelling Workshop",
    category: "Communication",
    instructor: "Robert Johnson",
    students: 54,
    status: "published",
    rating: 4.7,
    lastUpdated: "2024-03-10"
  },
  {
    id: "4",
    title: "Digital Brand Management",
    category: "Marketing",
    instructor: "Emily Wilson",
    students: 42,
    status: "draft",
    rating: 0,
    lastUpdated: "2024-04-02"
  },
  {
    id: "5",
    title: "Brand Analytics and Measurement",
    category: "Analytics",
    instructor: "Michael Brown",
    students: 31,
    status: "published",
    rating: 4.2,
    lastUpdated: "2024-01-18"
  }
];

const AdminCourses = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const filteredCourses = mockCourses.filter(course => 
    course.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    course.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.instructor.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Course Management</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center mb-6">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search courses..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Create Course
          </Button>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Instructor</TableHead>
                <TableHead>Students</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Rating</TableHead>
                <TableHead>Last Updated</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCourses.map((course) => (
                <TableRow key={course.id}>
                  <TableCell className="font-medium">{course.title}</TableCell>
                  <TableCell>{course.category}</TableCell>
                  <TableCell>{course.instructor}</TableCell>
                  <TableCell>{course.students}</TableCell>
                  <TableCell>
                    <Badge variant={course.status === "published" ? "default" : "secondary"}>
                      {course.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{course.status === "published" ? `${course.rating}/5.0` : "N/A"}</TableCell>
                  <TableCell>{course.lastUpdated}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button variant="ghost" size="icon">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default AdminCourses;
