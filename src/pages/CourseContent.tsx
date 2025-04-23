
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { 
  CheckCircle, 
  Book, 
  FileText, 
  GraduationCap,
  Clock,
  AlertCircle
} from "lucide-react";
import { courseService } from "@/services/courseService";
import { quizService } from "@/services/quizService";
import { assignmentService } from "@/services/assignmentService";
import { Course } from "@/types/course";
import { Quiz } from "@/types/quiz";
import { Assignment } from "@/types/assignment";
import { CourseNotes } from "@/components/course/CourseNotes";
import { Button } from "@/components/ui/button";

const CourseContent = () => {
  const { courseId, lessonId } = useParams();
  const [course, setCourse] = useState<Course | null>(null);
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("content");

  useEffect(() => {
    const fetchCourseData = async () => {
      if (!courseId) return;
      
      setLoading(true);
      try {
        const [courseData, quizzesData, assignmentsData] = await Promise.all([
          courseService.getCourseById(courseId),
          quizService.getQuizzesForCourse(courseId),
          assignmentService.getAssignmentsForCourse(courseId)
        ]);

        setCourse(courseData);
        setQuizzes(quizzesData);
        setAssignments(assignmentsData);
      } catch (error) {
        console.error("Error fetching course data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourseData();
  }, [courseId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!course) {
    return <div>Course not found</div>;
  }

  return (
    <div className="container mx-auto py-6 max-w-7xl">
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-2xl font-bold">{course.title}</h1>
          <p className="text-muted-foreground">{course.description}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left sidebar with sections and lessons */}
          <Card className="p-4 lg:col-span-1">
            <h2 className="font-semibold mb-4">Course Content</h2>
            <div className="space-y-4">
              {course.sections?.map((section) => (
                <div key={section.id}>
                  <h3 className="font-medium mb-2">{section.title}</h3>
                  <div className="space-y-2">
                    {section.lessons?.map((lesson) => (
                      <Button
                        key={lesson.id}
                        variant={lessonId === lesson.id ? "secondary" : "ghost"}
                        className="w-full justify-start text-sm"
                        asChild
                      >
                        <a href={`/course/${courseId}/${lesson.id}`}>
                          <Book className="h-4 w-4 mr-2" />
                          {lesson.title}
                          {lesson.duration && (
                            <span className="ml-auto flex items-center text-xs text-muted-foreground">
                              <Clock className="h-3 w-3 mr-1" />
                              {lesson.duration}
                            </span>
                          )}
                        </a>
                      </Button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Main content area */}
          <div className="lg:col-span-2">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList>
                <TabsTrigger value="content">
                  <Book className="h-4 w-4 mr-2" />
                  Content
                </TabsTrigger>
                <TabsTrigger value="notes">
                  <FileText className="h-4 w-4 mr-2" />
                  Notes
                </TabsTrigger>
                <TabsTrigger value="quizzes">
                  <GraduationCap className="h-4 w-4 mr-2" />
                  Quizzes
                </TabsTrigger>
                <TabsTrigger value="assignments">
                  <AlertCircle className="h-4 w-4 mr-2" />
                  Assignments
                </TabsTrigger>
              </TabsList>

              <TabsContent value="content" className="mt-4">
                {lessonId && course.sections?.map(section => 
                  section.lessons?.find(lesson => lesson.id === lessonId)
                ).filter(Boolean)[0] ? (
                  <Card className="p-6">
                    <div className="prose max-w-none">
                      {/* Render lesson content here */}
                    </div>
                  </Card>
                ) : (
                  <Card className="p-6">
                    <p className="text-center text-muted-foreground">
                      Select a lesson from the sidebar to begin
                    </p>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="notes" className="mt-4">
                {lessonId ? (
                  <CourseNotes 
                    courseId={courseId} 
                    lessonId={lessonId}
                  />
                ) : (
                  <Card className="p-6">
                    <p className="text-center text-muted-foreground">
                      Select a lesson to view or take notes
                    </p>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="quizzes" className="mt-4">
                <Card className="p-6">
                  {quizzes.length > 0 ? (
                    <div className="space-y-4">
                      {quizzes.map(quiz => (
                        <div key={quiz.id} className="flex items-center justify-between border-b last:border-0 pb-4 last:pb-0">
                          <div>
                            <h3 className="font-medium">{quiz.title}</h3>
                            <p className="text-sm text-muted-foreground">{quiz.description}</p>
                          </div>
                          <Button>Start Quiz</Button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-center text-muted-foreground">
                      No quizzes available for this course
                    </p>
                  )}
                </Card>
              </TabsContent>

              <TabsContent value="assignments" className="mt-4">
                <Card className="p-6">
                  {assignments.length > 0 ? (
                    <div className="space-y-4">
                      {assignments.map(assignment => (
                        <div key={assignment.id} className="flex items-center justify-between border-b last:border-0 pb-4 last:pb-0">
                          <div>
                            <h3 className="font-medium">{assignment.title}</h3>
                            <p className="text-sm text-muted-foreground">{assignment.description}</p>
                            {assignment.due_date && (
                              <p className="text-sm text-muted-foreground">
                                Due: {new Date(assignment.due_date).toLocaleDateString()}
                              </p>
                            )}
                          </div>
                          <Button>Submit Assignment</Button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-center text-muted-foreground">
                      No assignments available for this course
                    </p>
                  )}
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseContent;
