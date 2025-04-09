
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  ChevronDown, 
  Play, 
  CheckCircle,
  Clock,
  File,
  Download
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const courseLessons = [
  {
    id: 1,
    title: "Angular.js Fundamentals",
    modules: [
      {
        id: "module-1",
        title: "Introduction to Angular",
        lessons: [
          { id: "1-1", title: "What is Angular?", duration: "10:25", completed: true, type: "video" },
          { id: "1-2", title: "Setting up the Development Environment", duration: "15:40", completed: true, type: "video" },
          { id: "1-3", title: "Your First Angular App", duration: "20:15", completed: false, type: "video" },
          { id: "1-4", title: "Module Resources", duration: "5 pages", completed: false, type: "pdf" }
        ]
      },
      {
        id: "module-2",
        title: "Components and Templates",
        lessons: [
          { id: "2-1", title: "Creating Components", duration: "12:30", completed: false, type: "video" },
          { id: "2-2", title: "Component Lifecycle", duration: "18:45", completed: false, type: "video" },
          { id: "2-3", title: "Templates and Data Binding", duration: "22:10", completed: false, type: "video" },
          { id: "2-4", title: "Exercise Files", duration: "3 files", completed: false, type: "code" }
        ]
      },
      {
        id: "module-3",
        title: "Services and Dependency Injection",
        lessons: [
          { id: "3-1", title: "Creating Services", duration: "14:20", completed: false, type: "video" },
          { id: "3-2", title: "Dependency Injection", duration: "16:55", completed: false, type: "video" },
          { id: "3-3", title: "HTTP Client Module", duration: "19:30", completed: false, type: "video" }
        ]
      }
    ],
    totalCompleted: 2,
    totalLessons: 11
  },
  {
    id: 2,
    title: "Figma from A to Z",
    modules: [
      {
        id: "module-1",
        title: "Getting Started with Figma",
        lessons: [
          { id: "1-1", title: "Introduction to Figma", duration: "08:20", completed: true, type: "video" },
          { id: "1-2", title: "Figma Interface Overview", duration: "14:10", completed: true, type: "video" },
          { id: "1-3", title: "Setting Up Your First Project", duration: "12:45", completed: false, type: "video" }
        ]
      }
    ],
    totalCompleted: 2,
    totalLessons: 3
  }
];

const Lessons = () => {
  const [selectedCourse, setSelectedCourse] = useState(courseLessons[0]);

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-4xl font-bold">Lessons</h1>
        <p className="text-muted-foreground">Access course materials and track your progress</p>
      </header>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="w-full lg:w-1/3">
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">My Courses</h2>
            <div className="space-y-4">
              {courseLessons.map((course) => (
                <Button 
                  key={course.id}
                  variant={selectedCourse.id === course.id ? "default" : "outline"}
                  className="w-full justify-between"
                  onClick={() => setSelectedCourse(course)}
                >
                  <span>{course.title}</span>
                  <span className="text-xs bg-secondary py-0.5 px-2 rounded-full">
                    {course.totalCompleted}/{course.totalLessons}
                  </span>
                </Button>
              ))}
            </div>
          </Card>
        </div>

        <div className="w-full lg:w-2/3">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-semibold">{selectedCourse.title}</h2>
                <p className="text-sm text-muted-foreground">
                  {selectedCourse.totalCompleted} of {selectedCourse.totalLessons} lessons completed
                </p>
              </div>
              <Button variant="outline">
                Course Overview
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </div>

            <Accordion type="single" collapsible className="w-full">
              {selectedCourse.modules.map((module) => (
                <AccordionItem key={module.id} value={module.id}>
                  <AccordionTrigger className="hover:no-underline hover:bg-accent/20 px-4 py-2 rounded-lg">
                    <div className="flex items-center">
                      <span>{module.title}</span>
                      <span className="text-xs bg-secondary py-0.5 px-2 rounded-full ml-2">
                        {module.lessons.filter(lesson => lesson.completed).length}/{module.lessons.length}
                      </span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-4">
                    <div className="space-y-2 mt-2">
                      {module.lessons.map((lesson) => (
                        <div key={lesson.id} className="flex items-center justify-between p-3 hover:bg-accent/10 rounded-lg">
                          <div className="flex items-center gap-3">
                            {lesson.type === "video" ? (
                              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                                <Play className="h-4 w-4 text-primary" />
                              </div>
                            ) : lesson.type === "pdf" ? (
                              <div className="h-8 w-8 rounded-full bg-red-500/10 flex items-center justify-center">
                                <File className="h-4 w-4 text-red-500" />
                              </div>
                            ) : (
                              <div className="h-8 w-8 rounded-full bg-blue-500/10 flex items-center justify-center">
                                <Download className="h-4 w-4 text-blue-500" />
                              </div>
                            )}
                            <div>
                              <p className={`${lesson.completed ? "line-through text-muted-foreground" : ""}`}>
                                {lesson.title}
                              </p>
                              <div className="flex items-center text-xs text-muted-foreground">
                                <Clock className="h-3 w-3 mr-1" />
                                <span>{lesson.duration}</span>
                              </div>
                            </div>
                          </div>
                          <div>
                            {lesson.completed ? (
                              <CheckCircle className="h-5 w-5 text-green-500" />
                            ) : (
                              <Button variant="ghost" size="sm">Start</Button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Lessons;
