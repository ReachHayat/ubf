
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  CalendarClock,
  Clock,
  FileCheck,
  CheckCircle,
  XCircle,
  AlertCircle,
  ChevronRight,
  BookOpen,
  FileText,
  HelpCircle
} from "lucide-react";
import { cn } from "@/lib/utils";

type Assignment = {
  id: number;
  title: string;
  courseName: string;
  dueDate: string;
  status: "completed" | "pending" | "overdue" | "graded";
  grade?: number;
  totalPoints: number;
  progress?: number;
};

type Quiz = {
  id: number;
  title: string;
  courseName: string;
  dueDate: string;
  status: "completed" | "pending" | "available" | "graded";
  timeLimit: string;
  questions: number;
  grade?: number;
};

const assignments: Assignment[] = [
  {
    id: 1,
    title: "Build an Angular Authentication System",
    courseName: "Angular.js from scratch",
    dueDate: "Apr 15, 2025",
    status: "completed",
    grade: 92,
    totalPoints: 100,
    progress: 100
  },
  {
    id: 2,
    title: "Design a Mobile App Prototype",
    courseName: "Figma from A to Z",
    dueDate: "Apr 20, 2025",
    status: "pending",
    totalPoints: 100,
    progress: 65
  },
  {
    id: 3,
    title: "Create a Bitbucket Pipeline",
    courseName: "Bitbucket Guide",
    dueDate: "Apr 12, 2025",
    status: "pending",
    totalPoints: 100,
    progress: 30
  },
  {
    id: 4,
    title: "Custom React Hooks Implementation",
    courseName: "React Hooks Mastery",
    dueDate: "Apr 5, 2025",
    status: "overdue",
    totalPoints: 100,
    progress: 0
  },
  {
    id: 5,
    title: "RESTful API with Node.js",
    courseName: "Node.js API Development",
    dueDate: "Mar 25, 2025",
    status: "graded",
    grade: 88,
    totalPoints: 100,
    progress: 100
  }
];

const quizzes: Quiz[] = [
  {
    id: 1,
    title: "Angular Fundamentals Quiz",
    courseName: "Angular.js from scratch",
    dueDate: "Apr 13, 2025",
    status: "completed",
    timeLimit: "30 minutes",
    questions: 20,
    grade: 18
  },
  {
    id: 2,
    title: "Figma Interface Quiz",
    courseName: "Figma from A to Z",
    dueDate: "Apr 18, 2025",
    status: "pending",
    timeLimit: "15 minutes",
    questions: 10
  },
  {
    id: 3,
    title: "Git Branching Strategy Quiz",
    courseName: "Bitbucket Guide",
    dueDate: "Apr 10, 2025",
    status: "available",
    timeLimit: "20 minutes",
    questions: 15
  },
  {
    id: 4,
    title: "React State Management Quiz",
    courseName: "React Hooks Mastery",
    dueDate: "Apr 7, 2025",
    status: "graded",
    timeLimit: "45 minutes",
    questions: 25,
    grade: 23
  }
];

const statusColor = (status: string) => {
  switch(status) {
    case 'completed':
      return 'bg-green-500/10 text-green-500 border-green-500/20';
    case 'pending':
      return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
    case 'overdue':
      return 'bg-red-500/10 text-red-500 border-red-500/20';
    case 'graded':
      return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
    case 'available':
      return 'bg-purple-500/10 text-purple-500 border-purple-500/20';
    default:
      return 'bg-gray-500/10 text-gray-500 border-gray-500/20';
  }
};

const statusIcon = (status: string) => {
  switch(status) {
    case 'completed':
      return <CheckCircle className="h-4 w-4" />;
    case 'pending':
      return <Clock className="h-4 w-4" />;
    case 'overdue':
      return <XCircle className="h-4 w-4" />;
    case 'graded':
      return <FileCheck className="h-4 w-4" />;
    case 'available':
      return <AlertCircle className="h-4 w-4" />;
    default:
      return <HelpCircle className="h-4 w-4" />;
  }
};

const Assignments = () => {
  const [activeTab, setActiveTab] = useState<string>("assignments");
  const [filterStatus, setFilterStatus] = useState<string>("all");

  // Filter assignments and quizzes based on selected status
  const filteredAssignments = filterStatus === "all"
    ? assignments
    : assignments.filter(a => a.status === filterStatus);

  const filteredQuizzes = filterStatus === "all"
    ? quizzes
    : quizzes.filter(q => q.status === filterStatus);

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-4xl font-bold">Assignments & Quizzes</h1>
        <p className="text-muted-foreground">Manage your assignments and take quizzes</p>
      </header>

      <div className="flex flex-wrap gap-2">
        <Button 
          variant={filterStatus === "all" ? "default" : "outline"}
          size="sm"
          onClick={() => setFilterStatus("all")}
        >
          All
        </Button>
        <Button 
          variant={filterStatus === "pending" ? "default" : "outline"}
          size="sm"
          onClick={() => setFilterStatus("pending")}
          className="flex items-center gap-2"
        >
          <Clock className="h-4 w-4" />
          <span>Pending</span>
        </Button>
        <Button 
          variant={filterStatus === "completed" ? "default" : "outline"}
          size="sm"
          onClick={() => setFilterStatus("completed")}
          className="flex items-center gap-2"
        >
          <CheckCircle className="h-4 w-4" />
          <span>Completed</span>
        </Button>
        <Button 
          variant={filterStatus === "graded" ? "default" : "outline"}
          size="sm"
          onClick={() => setFilterStatus("graded")}
          className="flex items-center gap-2"
        >
          <FileCheck className="h-4 w-4" />
          <span>Graded</span>
        </Button>
        <Button 
          variant={filterStatus === "overdue" ? "default" : "outline"}
          size="sm"
          onClick={() => setFilterStatus("overdue")}
          className="flex items-center gap-2"
        >
          <XCircle className="h-4 w-4" />
          <span>Overdue</span>
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="assignments" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Assignments
          </TabsTrigger>
          <TabsTrigger value="quizzes" className="flex items-center gap-2">
            <HelpCircle className="h-4 w-4" />
            Quizzes
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="assignments">
          <div className="space-y-4">
            {filteredAssignments.length > 0 ? (
              filteredAssignments.map(assignment => (
                <Card key={assignment.id} className="overflow-hidden">
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <div className="bg-primary/10 p-2 rounded-full">
                          <FileText className="h-5 w-5 text-primary" />
                        </div>
                        <Badge variant="outline">{assignment.courseName}</Badge>
                      </div>
                      <Badge className={cn("rounded-full border px-3", statusColor(assignment.status))}>
                        <div className="flex items-center gap-1">
                          {statusIcon(assignment.status)}
                          <span className="capitalize">{assignment.status}</span>
                        </div>
                      </Badge>
                    </div>
                    
                    <h3 className="text-xl font-semibold mb-3">{assignment.title}</h3>
                    
                    <div className="flex items-center gap-6 mb-4">
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <CalendarClock className="h-4 w-4" />
                        <span>Due: {assignment.dueDate}</span>
                      </div>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <FileCheck className="h-4 w-4" />
                        <span>{assignment.totalPoints} Points</span>
                      </div>
                    </div>
                    
                    {assignment.status !== "graded" && assignment.status !== "completed" && (
                      <div className="mb-4">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm">Progress</span>
                          <span className="text-sm font-medium">{assignment.progress}%</span>
                        </div>
                        <Progress value={assignment.progress} className="h-2" />
                      </div>
                    )}
                    
                    {assignment.grade && (
                      <div className="mb-4">
                        <div className="flex items-center gap-2 text-lg">
                          <span className="font-semibold">Grade:</span>
                          <span className={cn(
                            assignment.grade >= 90 ? "text-green-500" : 
                            assignment.grade >= 80 ? "text-blue-500" : 
                            assignment.grade >= 70 ? "text-yellow-500" : "text-red-500"
                          )}>
                            {assignment.grade}/{assignment.totalPoints}
                          </span>
                        </div>
                      </div>
                    )}
                    
                    <div className="flex justify-end">
                      {(assignment.status === "pending" || assignment.status === "overdue") && (
                        <Button className="flex items-center gap-2">
                          Continue Assignment
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      )}
                      
                      {(assignment.status === "completed" || assignment.status === "graded") && (
                        <Button variant="outline" className="flex items-center gap-2">
                          View Submission
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                </Card>
              ))
            ) : (
              <Card className="p-8 text-center">
                <div className="flex flex-col items-center">
                  <FileText className="h-12 w-12 text-muted-foreground/30 mb-4" />
                  <h3 className="text-lg font-medium">No assignments found</h3>
                  <p className="text-muted-foreground mt-1">
                    {filterStatus === "all" 
                      ? "You don't have any assignments yet." 
                      : `You don't have any ${filterStatus} assignments.`}
                  </p>
                </div>
              </Card>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="quizzes">
          <div className="space-y-4">
            {filteredQuizzes.length > 0 ? (
              filteredQuizzes.map(quiz => (
                <Card key={quiz.id} className="overflow-hidden">
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <div className="bg-primary/10 p-2 rounded-full">
                          <HelpCircle className="h-5 w-5 text-primary" />
                        </div>
                        <Badge variant="outline">{quiz.courseName}</Badge>
                      </div>
                      <Badge className={cn("rounded-full border px-3", statusColor(quiz.status))}>
                        <div className="flex items-center gap-1">
                          {statusIcon(quiz.status)}
                          <span className="capitalize">{quiz.status}</span>
                        </div>
                      </Badge>
                    </div>
                    
                    <h3 className="text-xl font-semibold mb-3">{quiz.title}</h3>
                    
                    <div className="flex items-center gap-6 mb-4">
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <CalendarClock className="h-4 w-4" />
                        <span>Due: {quiz.dueDate}</span>
                      </div>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        <span>{quiz.timeLimit}</span>
                      </div>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <BookOpen className="h-4 w-4" />
                        <span>{quiz.questions} Questions</span>
                      </div>
                    </div>
                    
                    {quiz.grade && (
                      <div className="mb-4">
                        <div className="flex items-center gap-2 text-lg">
                          <span className="font-semibold">Score:</span>
                          <span className={cn(
                            (quiz.grade / quiz.questions) >= 0.9 ? "text-green-500" : 
                            (quiz.grade / quiz.questions) >= 0.8 ? "text-blue-500" : 
                            (quiz.grade / quiz.questions) >= 0.7 ? "text-yellow-500" : "text-red-500"
                          )}>
                            {quiz.grade}/{quiz.questions}
                          </span>
                        </div>
                      </div>
                    )}
                    
                    <div className="flex justify-end">
                      {quiz.status === "pending" && (
                        <Button className="flex items-center gap-2">
                          Start Quiz
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      )}
                      
                      {quiz.status === "available" && (
                        <Button className="flex items-center gap-2">
                          Take Quiz
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      )}
                      
                      {(quiz.status === "completed" || quiz.status === "graded") && (
                        <Button variant="outline" className="flex items-center gap-2">
                          View Results
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                </Card>
              ))
            ) : (
              <Card className="p-8 text-center">
                <div className="flex flex-col items-center">
                  <HelpCircle className="h-12 w-12 text-muted-foreground/30 mb-4" />
                  <h3 className="text-lg font-medium">No quizzes found</h3>
                  <p className="text-muted-foreground mt-1">
                    {filterStatus === "all" 
                      ? "You don't have any quizzes yet." 
                      : `You don't have any ${filterStatus} quizzes.`}
                  </p>
                </div>
              </Card>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Assignments;
