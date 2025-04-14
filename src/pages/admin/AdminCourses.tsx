
import { useState, useEffect } from "react";
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
import { CourseEditDialog, CourseData } from "@/components/admin/CourseEditDialog";
import { CourseDeleteDialog } from "@/components/admin/CourseDeleteDialog";
import { toast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

const AdminCourses = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [courses, setCourses] = useState<CourseData[]>([]);
  const [editCourse, setEditCourse] = useState<CourseData | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [deleteCourseName, setDeleteCourseName] = useState("");
  const [deleteCourseId, setDeleteCourseId] = useState("");
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  
  const navigate = useNavigate();

  // Load mock data initially or from localStorage if available
  useEffect(() => {
    const savedCourses = localStorage.getItem("adminCourses");
    if (savedCourses) {
      setCourses(JSON.parse(savedCourses));
    } else {
      setCourses(mockCourses);
    }
  }, []);

  // Save courses to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("adminCourses", JSON.stringify(courses));
  }, [courses]);

  const filteredCourses = courses.filter(course => 
    course.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    course.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.instructor.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenEditDialog = (course: CourseData | null = null) => {
    setEditCourse(course);
    setIsEditDialogOpen(true);
  };

  const handleSaveCourse = (courseData: CourseData) => {
    if (courseData.id) {
      // Update existing course
      setCourses(prevCourses => 
        prevCourses.map(course => 
          course.id === courseData.id ? courseData : course
        )
      );
      
      toast({
        title: "Course updated",
        description: `"${courseData.title}" has been updated successfully.`
      });
    } else {
      // Create new course with a random id
      const newCourse = {
        ...courseData,
        id: Math.random().toString(36).substring(2, 9),
        lastUpdated: new Date().toISOString().split('T')[0]
      };
      
      setCourses(prevCourses => [...prevCourses, newCourse]);
      
      toast({
        title: "Course created",
        description: `"${newCourse.title}" has been created successfully.`
      });
    }
  };

  const handleOpenDeleteDialog = (id: string, title: string) => {
    setDeleteCourseId(id);
    setDeleteCourseName(title);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteCourse = async () => {
    // Add a small delay to simulate async operation
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        setCourses(prevCourses => prevCourses.filter(course => course.id !== deleteCourseId));
        
        toast({
          title: "Course deleted",
          description: `"${deleteCourseName}" has been deleted successfully.`
        });
        
        resolve();
      }, 1000);
    });
  };

  const handleViewCourse = (courseId: string) => {
    navigate(`/courses/${courseId}`);
  };

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
          <Button onClick={() => handleOpenEditDialog()}>
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
              {filteredCourses.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-4 text-muted-foreground">
                    No courses found.
                  </TableCell>
                </TableRow>
              ) : (
                filteredCourses.map((course) => (
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
                    <TableCell>{course.status === "published" ? `${course.rating || 0}/5.0` : "N/A"}</TableCell>
                    <TableCell>{course.lastUpdated}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Button variant="ghost" size="icon" onClick={() => handleViewCourse(course.id)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleOpenEditDialog(course)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => handleOpenDeleteDialog(course.id, course.title)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>

      <CourseEditDialog
        course={editCourse}
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        onSave={handleSaveCourse}
      />
      
      <CourseDeleteDialog
        courseName={deleteCourseName}
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onDelete={handleDeleteCourse}
      />
    </Card>
  );
};

// Mock data
const mockCourses: CourseData[] = [
  {
    id: "1",
    title: "The Brand Strategy Masterclass",
    category: "Marketing",
    instructor: "John Doe",
    students: 124,
    status: "published",
    rating: 4.8,
    lastUpdated: "2024-03-15",
    description: "Learn how to create and implement effective brand strategies that drive business growth.",
    tags: ["branding", "marketing", "strategy"],
    duration: 4.5,
    price: 49.99
  },
  {
    id: "2",
    title: "Brand Identity Design Essentials",
    category: "Design",
    instructor: "Jane Smith",
    students: 86,
    status: "published",
    rating: 4.5,
    lastUpdated: "2024-02-22",
    description: "Master the fundamentals of brand identity design, from logos to visual systems.",
    tags: ["design", "branding", "identity"],
    duration: 5.2,
    price: 59.99
  },
  {
    id: "3",
    title: "Brand Storytelling Workshop",
    category: "Communication",
    instructor: "Robert Johnson",
    students: 54,
    status: "published",
    rating: 4.7,
    lastUpdated: "2024-03-10",
    description: "Learn how to craft compelling brand stories that connect with your audience.",
    tags: ["storytelling", "communication", "content"],
    duration: 3.5,
    price: 39.99
  },
  {
    id: "4",
    title: "Digital Brand Management",
    category: "Marketing",
    instructor: "Emily Wilson",
    students: 42,
    status: "draft",
    lastUpdated: "2024-04-02",
    description: "Learn strategies for managing and growing your brand in the digital landscape.",
    tags: ["digital", "management", "social media"],
    duration: 6.0,
    price: 79.99
  },
  {
    id: "5",
    title: "Brand Analytics and Measurement",
    category: "Analytics",
    instructor: "Michael Brown",
    students: 31,
    status: "published",
    rating: 4.2,
    lastUpdated: "2024-01-18",
    description: "Learn how to measure brand performance and make data-driven brand decisions.",
    tags: ["analytics", "data", "measurement"],
    duration: 4.0,
    price: 49.99
  }
];

export default AdminCourses;
