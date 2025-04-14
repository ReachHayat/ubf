
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  ChevronLeft, 
  Star, 
  Clock, 
  PlayCircle,
  ChevronDown,
  ChevronUp,
  Edit,
  Trash2,
  Plus,
  User
} from "lucide-react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "@/hooks/use-toast";
import { 
  getCourseById, 
  updateCourse, 
  updateCourseSection, 
  deleteCourseSection,
  updateCourseLesson,
  deleteCourseLesson,
  updateCourseAssignment,
  deleteCourseAssignment,
  enrollInCourse,
  unenrollFromCourse
} from "@/components/courses/CourseService";
import { Course, CourseSection, CourseLesson, CourseAssignment } from "@/types/course";
import { CourseEditDialog, CourseData } from "@/components/admin/CourseEditDialog";
import { SectionEditor } from "@/components/courses/SectionEditor";
import { LessonEditor } from "@/components/courses/LessonEditor";
import { AssignmentEditor } from "@/components/courses/AssignmentEditor";
import { QuizEditor } from "@/components/courses/QuizEditor";
import { UserProfilePreview } from "@/components/profile/UserProfilePreview";
import { useAuth } from "@/contexts/AuthContext";

const CourseDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, isAdmin } = useAuth();
  
  const [course, setCourse] = useState<Course | null>(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [loading, setLoading] = useState(true);
  const [sections, setSections] = useState<CourseSection[]>([]);
  
  // Edit dialogs state
  const [isEditing, setIsEditing] = useState(false);
  const [editSectionData, setEditSectionData] = useState<CourseSection | null>(null);
  const [isEditingSections, setIsEditingSections] = useState(false);
  const [editLessonData, setEditLessonData] = useState<CourseLesson | null>(null);
  const [isEditingLesson, setIsEditingLesson] = useState(false);
  const [currentSectionId, setCurrentSectionId] = useState<string>("");
  const [editAssignmentData, setEditAssignmentData] = useState<CourseAssignment | null>(null);
  const [isEditingAssignment, setIsEditingAssignment] = useState(false);
  const [isEditingQuiz, setIsEditingQuiz] = useState(false);
  const [editQuizData, setEditQuizData] = useState<any>(null);
  
  // Profile preview
  const [isProfilePreviewOpen, setIsProfilePreviewOpen] = useState(false);
  const [previewUserId, setPreviewUserId] = useState<string>("");

  // Load course data
  useEffect(() => {
    if (id) {
      setLoading(true);
      const courseData = getCourseById(id);
      
      if (courseData) {
        setCourse(courseData);
        setSections(courseData.sections || []);
      } else {
        toast({
          variant: "destructive",
          title: "Course not found",
          description: "The course you're looking for doesn't exist or has been removed."
        });
        navigate("/courses");
      }
      
      setLoading(false);
    }
  }, [id, navigate]);

  const toggleSection = (sectionId: string) => {
    setSections(sections.map(section => 
      section.id === sectionId 
        ? { ...section, expanded: !section.expanded }
        : section
    ));
    
    // Also update in the course object
    if (course && course.sections) {
      const updatedCourse = {
        ...course,
        sections: course.sections.map(section => 
          section.id === sectionId 
            ? { ...section, expanded: !section.expanded }
            : section
        )
      };
      setCourse(updatedCourse);
      updateCourse(updatedCourse);
    }
  };

  const handleEditCourse = () => {
    if (!course) return;
    
    const courseDataForEdit: CourseData = {
      id: course.id,
      title: course.title,
      category: course.category,
      instructor: course.instructor.name,
      students: course.enrolled ? 1 : 0, 
      status: course.status || "published",
      rating: course.rating,
      lastUpdated: course.lastUpdated || new Date().toISOString().split('T')[0],
      description: course.description,
      tags: course.tags,
      duration: course.totalHours,
      price: course.price
    };
    
    setIsEditing(true);
  };

  const handleSaveCourse = (courseData: CourseData) => {
    if (!course) return;
    
    // Transform CourseData to Course
    const updatedCourse: Course = {
      ...course,
      title: courseData.title,
      category: courseData.category,
      instructor: {
        ...course.instructor,
        name: courseData.instructor
      },
      description: courseData.description || "",
      status: courseData.status,
      rating: courseData.rating,
      lastUpdated: courseData.lastUpdated,
      tags: courseData.tags,
      totalHours: courseData.duration || 0,
      price: courseData.price,
      thumbnail: courseData.thumbnail
    };
    
    setCourse(updatedCourse);
    updateCourse(updatedCourse);
    
    toast({
      title: "Course updated",
      description: "Course details have been updated successfully."
    });
  };

  const handleEditSection = (section: CourseSection | null) => {
    setEditSectionData(section);
    setIsEditingSections(true);
  };

  const handleSaveSection = (section: CourseSection) => {
    if (!course || !course.id) return;
    
    // Add or update the section in the course
    if (!course.sections) {
      course.sections = [];
    }
    
    updateCourseSection(course.id, section);
    
    // Refresh course data
    const updatedCourse = getCourseById(course.id);
    if (updatedCourse) {
      setCourse(updatedCourse);
      setSections(updatedCourse.sections || []);
    }
    
    toast({
      title: "Section updated",
      description: "The section has been updated successfully."
    });
  };

  const handleDeleteSection = (sectionId: string) => {
    if (!course || !course.id) return;
    
    if (confirm("Are you sure you want to delete this section?")) {
      deleteCourseSection(course.id, sectionId);
      
      // Refresh course data
      const updatedCourse = getCourseById(course.id);
      if (updatedCourse) {
        setCourse(updatedCourse);
        setSections(updatedCourse.sections || []);
      }
      
      toast({
        title: "Section deleted",
        description: "The section has been deleted successfully."
      });
    }
  };

  const handleEditLesson = (lesson: CourseLesson | null, sectionId: string) => {
    setEditLessonData(lesson);
    setCurrentSectionId(sectionId);
    setIsEditingLesson(true);
  };

  const handleSaveLesson = (lesson: CourseLesson) => {
    if (!course || !course.id || !currentSectionId) return;
    
    updateCourseLesson(course.id, currentSectionId, lesson);
    
    // Refresh course data
    const updatedCourse = getCourseById(course.id);
    if (updatedCourse) {
      setCourse(updatedCourse);
      setSections(updatedCourse.sections || []);
    }
    
    toast({
      title: "Lesson updated",
      description: "The lesson has been updated successfully."
    });
  };

  const handleDeleteLesson = (sectionId: string, lessonId: string) => {
    if (!course || !course.id) return;
    
    if (confirm("Are you sure you want to delete this lesson?")) {
      deleteCourseLesson(course.id, sectionId, lessonId);
      
      // Refresh course data
      const updatedCourse = getCourseById(course.id);
      if (updatedCourse) {
        setCourse(updatedCourse);
        setSections(updatedCourse.sections || []);
      }
      
      toast({
        title: "Lesson deleted",
        description: "The lesson has been deleted successfully."
      });
    }
  };

  const handleEditAssignment = (assignment: CourseAssignment | null) => {
    setEditAssignmentData(assignment);
    setIsEditingAssignment(true);
  };

  const handleSaveAssignment = (assignment: CourseAssignment) => {
    if (!course || !course.id) return;
    
    updateCourseAssignment(course.id, assignment);
    
    // Refresh course data
    const updatedCourse = getCourseById(course.id);
    if (updatedCourse) {
      setCourse(updatedCourse);
    }
    
    toast({
      title: "Assignment updated",
      description: "The assignment has been updated successfully."
    });
  };

  const handleDeleteAssignment = (assignmentId: string) => {
    if (!course || !course.id) return;
    
    if (confirm("Are you sure you want to delete this assignment?")) {
      deleteCourseAssignment(course.id, assignmentId);
      
      // Refresh course data
      const updatedCourse = getCourseById(course.id);
      if (updatedCourse) {
        setCourse(updatedCourse);
      }
      
      toast({
        title: "Assignment deleted",
        description: "The assignment has been deleted successfully."
      });
    }
  };

  const handleEditQuiz = (quiz: any | null) => {
    setEditQuizData(quiz);
    setIsEditingQuiz(true);
  };

  const handleSaveQuiz = (quiz: any) => {
    if (!course || !course.id) return;
    
    const updatedCourse = { ...course };
    if (!updatedCourse.quizzes) {
      updatedCourse.quizzes = [];
    }
    
    // Find and update existing quiz or add new one
    const quizIndex = updatedCourse.quizzes.findIndex(q => q.id === quiz.id);
    if (quizIndex !== -1) {
      updatedCourse.quizzes[quizIndex] = quiz;
    } else {
      updatedCourse.quizzes.push(quiz);
    }
    
    setCourse(updatedCourse);
    updateCourse(updatedCourse);
    
    toast({
      title: "Quiz updated",
      description: "The quiz has been updated successfully."
    });
  };

  const handleDeleteQuiz = (quizId: string) => {
    if (!course || !course.id || !course.quizzes) return;
    
    if (confirm("Are you sure you want to delete this quiz?")) {
      const updatedCourse = { ...course };
      updatedCourse.quizzes = updatedCourse.quizzes.filter(q => q.id !== quizId);
      
      setCourse(updatedCourse);
      updateCourse(updatedCourse);
      
      toast({
        title: "Quiz deleted",
        description: "The quiz has been deleted successfully."
      });
    }
  };

  const handleEnrollment = () => {
    if (!course) return;
    
    if (course.enrolled) {
      unenrollFromCourse(course.id);
      toast({
        title: "Unenrolled",
        description: "You have successfully unenrolled from this course."
      });
    } else {
      enrollInCourse(course.id);
      toast({
        title: "Enrolled",
        description: "You have successfully enrolled in this course!"
      });
    }
    
    // Refresh course data
    const updatedCourse = getCourseById(course.id);
    if (updatedCourse) {
      setCourse(updatedCourse);
    }
  };

  const handleViewProfile = (userId: string) => {
    setPreviewUserId(userId);
    setIsProfilePreviewOpen(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold">Course not found</h2>
        <p className="text-muted-foreground mt-2">
          The course you're looking for doesn't exist or has been removed.
        </p>
        <Button className="mt-4" asChild>
          <Link to="/courses">Back to Courses</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Link to="/courses" className="flex items-center">
          <ChevronLeft className="h-4 w-4 mr-1" />
          Courses
        </Link>
        <span>/</span>
        <Link to="/courses" className="hover:underline">{course.category}</Link>
        <span>/</span>
        <span className="text-foreground">{course.title}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Course Info */}
        <div className="lg:col-span-2 space-y-6">
          <div className="relative">
            {course.thumbnail && (
              <div className="rounded-lg overflow-hidden relative aspect-video">
                <img 
                  src={course.thumbnail} 
                  alt={course.title} 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Button size="icon" className="rounded-full h-16 w-16 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white">
                    <PlayCircle className="h-10 w-10" />
                  </Button>
                </div>
              </div>
            )}
            
            {isAdmin() && (
              <Button 
                variant="outline" 
                className="absolute top-4 right-4" 
                onClick={handleEditCourse}
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit Course
              </Button>
            )}
          </div>

          <div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
              <Badge variant="outline">{course.category}</Badge>
              <div className="flex items-center gap-1">
                <span>{sections.reduce((total, section) => total + section.lessons.length, 0)} lessons</span>
                <span>•</span>
                <Clock className="h-3 w-3" />
                <span>{course.totalHours}h</span>
              </div>
              <div className="flex items-center gap-1">
                <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                <span>{course.rating || 0} ({course.reviews || 0} reviews)</span>
              </div>
            </div>
            
            <h1 className="text-3xl font-bold mb-4">{course.title}</h1>
            
            <Tabs 
              value={activeTab} 
              onValueChange={setActiveTab}
              className="w-full"
            >
              <TabsList className="w-full grid grid-cols-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="instructor">Instructor</TabsTrigger>
                <TabsTrigger value="assignments">Assignments</TabsTrigger>
                <TabsTrigger value="quizzes">Quizzes</TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview" className="mt-6">
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-semibold mb-4">About Course</h2>
                    <p className="text-muted-foreground">
                      {course.description || "No description available for this course."}
                    </p>
                  </div>
                  
                  {course.tags && course.tags.length > 0 && (
                    <div>
                      <h2 className="text-xl font-semibold mb-4">Tags</h2>
                      <div className="flex flex-wrap gap-2">
                        {course.tags.map(tag => (
                          <Badge key={tag} variant="secondary">{tag}</Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <div>
                    <h2 className="text-xl font-semibold mb-4">What You'll Learn</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {sections.flatMap(section => 
                        section.lessons.slice(0, 2).map(lesson => (
                          <div key={lesson.id} className="flex items-start gap-2">
                            <div className="mt-1 text-green-500">✓</div>
                            <p>{lesson.title}</p>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="instructor" className="mt-6">
                <Card className="p-6">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-16 w-16 cursor-pointer" onClick={() => handleViewProfile(course.instructor.id)}>
                      {course.instructor.avatar ? (
                        <AvatarImage src={course.instructor.avatar} />
                      ) : (
                        <AvatarFallback className="text-xl">{course.instructor.name.charAt(0)}</AvatarFallback>
                      )}
                    </Avatar>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg font-bold" onClick={() => handleViewProfile(course.instructor.id)} style={{ cursor: "pointer" }}>
                          {course.instructor.name}
                        </h3>
                        <User className="h-4 w-4 text-muted-foreground cursor-pointer" onClick={() => handleViewProfile(course.instructor.id)} />
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-medium">({course.rating || 4.5})</span>
                      </div>
                      <p className="text-muted-foreground">{course.instructor.role}</p>
                    </div>
                  </div>
                  
                  <p className="mt-4 text-muted-foreground">
                    {course.instructor.name} is an experienced instructor specializing in {course.category}. 
                    With numerous courses and high student satisfaction, they're committed to providing 
                    high-quality educational content.
                  </p>
                  
                  <div className="mt-4 flex flex-wrap gap-2">
                    <Badge variant="secondary">{course.category} Expert</Badge>
                    <Badge variant="secondary">Course Creator</Badge>
                    <Badge variant="secondary">Professional Instructor</Badge>
                  </div>
                </Card>
              </TabsContent>
              
              <TabsContent value="assignments" className="mt-6">
                <Card className="p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold">Course Assignments</h2>
                    {isAdmin() && (
                      <Button onClick={() => handleEditAssignment(null)}>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Assignment
                      </Button>
                    )}
                  </div>
                  
                  {(!course.assignments || course.assignments.length === 0) ? (
                    <p className="text-muted-foreground">No assignments available for this course.</p>
                  ) : (
                    <div className="space-y-4">
                      {course.assignments.map(assignment => (
                        <Card key={assignment.id} className="p-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-medium">{assignment.title}</h3>
                              <p className="text-sm text-muted-foreground mt-1">{assignment.description}</p>
                              <div className="flex items-center gap-2 mt-2">
                                <Badge variant="outline">Due: {assignment.dueDate}</Badge>
                                <Badge 
                                  variant={
                                    assignment.status === 'pending' ? 'secondary' : 
                                    assignment.status === 'submitted' ? 'default' : 
                                    'success'
                                  }
                                >
                                  {assignment.status.charAt(0).toUpperCase() + assignment.status.slice(1)}
                                </Badge>
                              </div>
                            </div>
                            
                            {isAdmin() && (
                              <div className="flex gap-2">
                                <Button variant="ghost" size="icon" onClick={() => handleEditAssignment(assignment)}>
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="icon" onClick={() => handleDeleteAssignment(assignment.id)}>
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            )}
                          </div>
                        </Card>
                      ))}
                    </div>
                  )}
                </Card>
              </TabsContent>
              
              <TabsContent value="quizzes" className="mt-6">
                <Card className="p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold">Course Quizzes</h2>
                    {isAdmin() && (
                      <Button onClick={() => handleEditQuiz(null)}>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Quiz
                      </Button>
                    )}
                  </div>
                  
                  {(!course.quizzes || course.quizzes.length === 0) ? (
                    <p className="text-muted-foreground">No quizzes available for this course.</p>
                  ) : (
                    <div className="space-y-4">
                      {course.quizzes.map(quiz => (
                        <Card key={quiz.id} className="p-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-medium">{quiz.title}</h3>
                              <p className="text-sm text-muted-foreground mt-1">{quiz.description}</p>
                              <div className="flex items-center gap-2 mt-2">
                                <Badge variant="outline">
                                  {quiz.questions.length} {quiz.questions.length === 1 ? 'Question' : 'Questions'}
                                </Badge>
                                <Badge variant="outline">
                                  {quiz.timeLimit} Minutes
                                </Badge>
                                <Badge 
                                  variant={
                                    quiz.status === 'not_started' ? 'secondary' : 
                                    quiz.status === 'in_progress' ? 'default' : 
                                    'success'
                                  }
                                >
                                  {quiz.status === 'not_started' 
                                    ? 'Not Started' 
                                    : quiz.status === 'in_progress' 
                                      ? 'In Progress' 
                                      : 'Completed'
                                  }
                                </Badge>
                              </div>
                            </div>
                            
                            {isAdmin() && (
                              <div className="flex gap-2">
                                <Button variant="ghost" size="icon" onClick={() => handleEditQuiz(quiz)}>
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="icon" onClick={() => handleDeleteQuiz(quiz.id)}>
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            )}
                          </div>
                        </Card>
                      ))}
                    </div>
                  )}
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
        
        {/* Course Content Sidebar */}
        <div className="lg:col-span-1">
          <Card className="p-6 sticky top-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Course content</h2>
              {isAdmin() && (
                <Button variant="outline" size="sm" onClick={() => handleEditSection(null)}>
                  <Plus className="h-4 w-4 mr-1" />
                  Add Section
                </Button>
              )}
            </div>
            
            <div className="space-y-2 max-h-[600px] overflow-y-auto pr-2">
              {sections.length === 0 ? (
                <p className="text-muted-foreground text-center py-4">
                  No content available for this course yet.
                </p>
              ) : (
                sections.map((section) => (
                  <div key={section.id} className="border rounded-lg">
                    <div 
                      className="p-3 flex items-center justify-between cursor-pointer hover:bg-accent/50"
                      onClick={() => toggleSection(section.id)}
                    >
                      <div className="flex items-center gap-1">
                        <span className="font-medium">{section.title}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">{section.duration}</span>
                        {isAdmin() && (
                          <div className="flex gap-1">
                            <Button variant="ghost" size="icon" className="h-6 w-6" onClick={(e) => {
                              e.stopPropagation();
                              handleEditSection(section);
                            }}>
                              <Edit className="h-3 w-3" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-6 w-6" onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteSection(section.id);
                            }}>
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        )}
                        {section.expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                      </div>
                    </div>
                    
                    {section.expanded && (
                      <div className="border-t">
                        {section.lessons.length > 0 ? (
                          section.lessons.map((lesson) => (
                            <div 
                              key={lesson.id}
                              className="p-3 hover:bg-accent/20 flex items-center gap-3 cursor-pointer group"
                            >
                              <PlayCircle className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
                              <div className="flex flex-1 items-center justify-between">
                                <span className={`text-sm ${lesson.isCompleted ? "line-through text-muted-foreground" : ""}`}>
                                  {lesson.title}
                                </span>
                                <div className="flex items-center">
                                  <span className="text-xs text-muted-foreground">{lesson.duration}</span>
                                  {isAdmin() && (
                                    <div className="flex gap-1 ml-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                      <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => handleEditLesson(lesson, section.id)}>
                                        <Edit className="h-3 w-3" />
                                      </Button>
                                      <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => handleDeleteLesson(section.id, lesson.id)}>
                                        <Trash2 className="h-3 w-3" />
                                      </Button>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="p-3 text-sm text-muted-foreground text-center">
                            No lessons in this section yet.
                            {isAdmin() && (
                              <Button 
                                variant="link" 
                                size="sm" 
                                className="p-0 h-auto ml-2" 
                                onClick={() => handleEditLesson(null, section.id)}
                              >
                                Add Lesson
                              </Button>
                            )}
                          </div>
                        )}
                        
                        {isAdmin() && section.lessons.length > 0 && (
                          <div className="px-3 pb-3 pt-1">
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="w-full" 
                              onClick={() => handleEditLesson(null, section.id)}
                            >
                              <Plus className="h-3 w-3 mr-1" />
                              Add Lesson
                            </Button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
            
            <div className="mt-6">
              <Button 
                className="w-full" 
                size="lg"
                variant={course.enrolled ? "default" : "outline"}
                onClick={handleEnrollment}
              >
                {course.enrolled ? "Continue Learning" : "Enroll Now"}
              </Button>
              {course.price && !course.enrolled && (
                <p className="mt-2 text-center text-lg font-semibold">
                  {typeof course.price === 'number' ? `$${course.price.toFixed(2)}` : course.price}
                </p>
              )}
              <div className="mt-4 text-center">
                <Button variant="link" className="text-muted-foreground text-sm">
                  Share Course
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Edit Dialogs */}
      <CourseEditDialog
        course={course ? {
          id: course.id,
          title: course.title,
          category: course.category,
          instructor: course.instructor.name,
          students: 0,
          status: course.status || "published",
          rating: course.rating,
          lastUpdated: course.lastUpdated || new Date().toISOString().split('T')[0],
          description: course.description,
          thumbnail: course.thumbnail,
          tags: course.tags,
          duration: course.totalHours,
          price: course.price
        } : null}
        open={isEditing}
        onOpenChange={setIsEditing}
        onSave={handleSaveCourse}
      />
      
      <SectionEditor
        section={editSectionData}
        open={isEditingSections}
        onOpenChange={setIsEditingSections}
        onSave={handleSaveSection}
      />
      
      <LessonEditor
        lesson={editLessonData}
        open={isEditingLesson}
        onOpenChange={setIsEditingLesson}
        onSave={handleSaveLesson}
        sectionId={currentSectionId}
      />
      
      <AssignmentEditor
        assignment={editAssignmentData}
        open={isEditingAssignment}
        onOpenChange={setIsEditingAssignment}
        onSave={handleSaveAssignment}
      />
      
      <QuizEditor
        quiz={editQuizData}
        open={isEditingQuiz}
        onOpenChange={setIsEditingQuiz}
        onSave={handleSaveQuiz}
      />

      <UserProfilePreview
        userId={previewUserId}
        open={isProfilePreviewOpen}
        onOpenChange={setIsProfilePreviewOpen}
      />
    </div>
  );
};

export default CourseDetail;
