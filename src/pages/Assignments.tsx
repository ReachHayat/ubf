
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  XCircle,
  FileText
} from "lucide-react";

const assignments = [
  {
    id: 1,
    title: "Build an Angular Todo App",
    course: "Angular.js Fundamentals",
    dueDate: "2023-05-15T23:59:59",
    status: "pending",
    description: "Create a simple todo application using Angular components and services."
  },
  {
    id: 2,
    title: "Create a Responsive UI Design",
    course: "Figma from A to Z",
    dueDate: "2023-05-10T23:59:59",
    status: "submitted",
    submittedDate: "2023-05-09T14:32:00",
    description: "Design a responsive user interface for a mobile banking app."
  },
  {
    id: 3,
    title: "Implement Authentication in Angular",
    course: "Angular.js Fundamentals",
    dueDate: "2023-04-28T23:59:59",
    status: "graded",
    grade: 92,
    maxGrade: 100,
    description: "Implement user authentication using JWT tokens in your Angular application."
  },
  {
    id: 4,
    title: "Deploy Angular App to Netlify",
    course: "Angular.js Fundamentals",
    dueDate: "2023-04-20T23:59:59",
    status: "late",
    description: "Deploy your Angular application to Netlify with CI/CD pipeline."
  }
];

const Assignments = () => {
  const pendingAssignments = assignments.filter(a => a.status === "pending");
  const submittedAssignments = assignments.filter(a => a.status === "submitted");
  const gradedAssignments = assignments.filter(a => a.status === "graded");
  const lateAssignments = assignments.filter(a => a.status === "late");

  // Function to format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric'
    }).format(date);
  };

  // Function to check if assignment is due soon (within 3 days)
  const isDueSoon = (dateString: string) => {
    const dueDate = new Date(dateString);
    const now = new Date();
    const diffTime = dueDate.getTime() - now.getTime();
    const diffDays = diffTime / (1000 * 3600 * 24);
    return diffDays <= 3 && diffDays > 0;
  };

  // Function to render status badge
  const renderStatusBadge = (status: string) => {
    switch(status) {
      case "pending":
        return <Badge variant="outline" className="bg-yellow-500/10 text-yellow-500 border-yellow-500/30">Pending</Badge>;
      case "submitted":
        return <Badge variant="outline" className="bg-blue-500/10 text-blue-500 border-blue-500/30">Submitted</Badge>;
      case "graded":
        return <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/30">Graded</Badge>;
      case "late":
        return <Badge variant="outline" className="bg-red-500/10 text-red-500 border-red-500/30">Late</Badge>;
      default:
        return null;
    }
  };

  const renderAssignmentCard = (assignment: any) => (
    <Card key={assignment.id} className="p-6 mb-4">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <FileText className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold">{assignment.title}</h3>
            <p className="text-sm text-muted-foreground">{assignment.course}</p>
          </div>
        </div>
        <div className="mt-4 md:mt-0 flex items-center gap-2">
          {renderStatusBadge(assignment.status)}
          <div className="flex items-center text-sm">
            <Clock className="h-4 w-4 mr-1 text-muted-foreground" />
            <span className={`${isDueSoon(assignment.dueDate) ? "text-yellow-500 font-medium" : "text-muted-foreground"}`}>
              Due {formatDate(assignment.dueDate)}
            </span>
          </div>
        </div>
      </div>

      <p className="text-sm mb-4">{assignment.description}</p>

      {assignment.status === "graded" && (
        <div className="bg-green-500/10 p-3 rounded-lg mb-4">
          <div className="flex items-center">
            <CheckCircle2 className="h-5 w-5 text-green-500 mr-2" />
            <span className="text-green-500 font-medium">
              Grade: {assignment.grade}/{assignment.maxGrade} ({(assignment.grade / assignment.maxGrade * 100).toFixed(0)}%)
            </span>
          </div>
        </div>
      )}

      {assignment.status === "submitted" && (
        <div className="bg-blue-500/10 p-3 rounded-lg mb-4">
          <div className="flex items-center">
            <Clock className="h-5 w-5 text-blue-500 mr-2" />
            <span className="text-blue-500 font-medium">
              Submitted on {formatDate(assignment.submittedDate)}
            </span>
          </div>
        </div>
      )}

      {assignment.status === "late" && (
        <div className="bg-red-500/10 p-3 rounded-lg mb-4">
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
            <span className="text-red-500 font-medium">
              This assignment is past due
            </span>
          </div>
        </div>
      )}

      <div className="flex gap-2">
        {assignment.status === "pending" && (
          <>
            <Button>Submit Assignment</Button>
            <Button variant="outline">View Details</Button>
          </>
        )}
        {assignment.status === "submitted" && (
          <Button variant="outline">View Submission</Button>
        )}
        {assignment.status === "graded" && (
          <>
            <Button variant="outline">View Feedback</Button>
            <Button variant="outline">View Submission</Button>
          </>
        )}
        {assignment.status === "late" && (
          <Button>Submit Late</Button>
        )}
      </div>
    </Card>
  );

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-4xl font-bold">Assignments</h1>
        <p className="text-muted-foreground">View and submit your course assignments</p>
      </header>

      <Tabs defaultValue="pending" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="pending">
            Pending
            {pendingAssignments.length > 0 && (
              <span className="ml-2 bg-primary/10 text-primary text-xs py-0.5 px-2 rounded-full">
                {pendingAssignments.length}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="submitted">
            Submitted
            {submittedAssignments.length > 0 && (
              <span className="ml-2 bg-primary/10 text-primary text-xs py-0.5 px-2 rounded-full">
                {submittedAssignments.length}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="graded">
            Graded
            {gradedAssignments.length > 0 && (
              <span className="ml-2 bg-primary/10 text-primary text-xs py-0.5 px-2 rounded-full">
                {gradedAssignments.length}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="late">
            Late
            {lateAssignments.length > 0 && (
              <span className="ml-2 bg-primary/10 text-primary text-xs py-0.5 px-2 rounded-full">
                {lateAssignments.length}
              </span>
            )}
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="pending">
          {pendingAssignments.map(renderAssignmentCard)}
        </TabsContent>
        
        <TabsContent value="submitted">
          {submittedAssignments.map(renderAssignmentCard)}
        </TabsContent>
        
        <TabsContent value="graded">
          {gradedAssignments.map(renderAssignmentCard)}
        </TabsContent>
        
        <TabsContent value="late">
          {lateAssignments.map(renderAssignmentCard)}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Assignments;
