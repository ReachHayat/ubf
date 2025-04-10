
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, PlusCircle } from "lucide-react";
import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const mockAssignments = [
  {
    id: "1",
    title: "Brand Analysis Report",
    course: "The Brand Strategy Masterclass",
    dueDate: "2024-04-20",
    submissions: 87,
    totalStudents: 124,
  },
  {
    id: "2",
    title: "Brand Identity Design Project",
    course: "Brand Identity Design Essentials",
    dueDate: "2024-04-25",
    submissions: 56,
    totalStudents: 86,
  },
  {
    id: "3",
    title: "Brand Storytelling Exercise",
    course: "Brand Storytelling Workshop",
    dueDate: "2024-04-18",
    submissions: 32,
    totalStudents: 54,
  },
  {
    id: "4",
    title: "Digital Brand Audit",
    course: "Digital Brand Management",
    dueDate: "2024-05-05",
    submissions: 24,
    totalStudents: 42,
  },
  {
    id: "5",
    title: "Brand Analytics Case Study",
    course: "Brand Analytics and Measurement",
    dueDate: "2024-04-30",
    submissions: 18,
    totalStudents: 31,
  }
];

const AdminAssignments = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const filteredAssignments = mockAssignments.filter(assignment => 
    assignment.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    assignment.course.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Assignment Management</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center mb-6">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search assignments..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Create Assignment
          </Button>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Course</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Submissions</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAssignments.map((assignment) => (
                <TableRow key={assignment.id}>
                  <TableCell className="font-medium">{assignment.title}</TableCell>
                  <TableCell>{assignment.course}</TableCell>
                  <TableCell>{assignment.dueDate}</TableCell>
                  <TableCell>
                    {assignment.submissions}/{assignment.totalStudents} ({Math.round(assignment.submissions / assignment.totalStudents * 100)}%)
                  </TableCell>
                  <TableCell>
                    <Button variant="outline" size="sm">View Submissions</Button>
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

export default AdminAssignments;
