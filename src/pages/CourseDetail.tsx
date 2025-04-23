import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Share2, Check, Plus, Edit, Trash2, ChevronUp, ChevronDown, PlayCircle } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
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
  unenrollFromCourse,
  markVideoAsWatched,
  isVideoWatched,
  shareCourse
} from "@/components/courses/CourseService";
import { Course, CourseSection, CourseLesson, CourseAssignment } from "@/types/course";
import { CourseHeader } from "@/components/courses/CourseHeader";
import { CourseContent } from "@/components/courses/CourseContent";
import { CourseOverview } from "@/components/courses/CourseOverview";
import { CourseInstructor } from "@/components/courses/CourseInstructor";
import { CourseEditDialog, CourseData } from "@/components/admin/CourseEditDialog";
import { SectionEditor } from "@/components/courses/SectionEditor";
import { LessonEditor } from "@/components/courses/LessonEditor";
import { AssignmentEditor } from "@/components/courses/AssignmentEditor";
import { QuizEditor } from "@/components/courses/QuizEditor";
import { UserProfilePreview } from "@/components/profile/UserProfilePreview";

interface VideoData {
  lessonId: string;
  title: string;
  videoUrl: string;
}

const CourseDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, isAdmin } = useAuth();
  
  const [course, setCourse] = useState<Course | null>(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [loading, setLoading] = useState(true);
  const [sections, setSections] = useState<CourseSection[]>([]);
  
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
  
  const [isProfilePreviewOpen, setIsProfilePreviewOpen] = useState(false);
  const [previewUserId, setPreviewUserId] = useState<string>("");
  
  const [isVideoDialogOpen, setIsVideoDialogOpen] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [currentVideo, setCurrentVideo] = useState<VideoData | null>(null);
  
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);
  const [shareUrl, setShareUrl] = useState("");
  const [shareSuccess, setShareSuccess] = useState(false);

  useEffect(() => {
    const fetchCourseData = async () => {
      if (id) {
        setLoading(true);
        try {
          const courseData = await getCourseById(id);
          
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
        } catch (error) {
          console.error("Error fetching course:", error);
          toast({
            variant: "destructive",
            title: "Error loading course",
            description: "Please try again later."
          });
        } finally {
          setLoading(false);
        }
      }
    };
    
    fetchCourseData();
  }, [id, navigate]);

  const toggleSection = (sectionId: string) => {
    setSections(sections.map(section => 
      section.id === sectionId 
        ? { ...section, expanded: !section.expanded }
        : section
    ));
    
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

  const handleSaveSection = async (section: CourseSection) => {
    if (!course || !course.id) return;
    
    if (!course.sections) {
      course.sections = [];
    }
    
    try {
      const success = await updateCourseSection(course.id, section);
      
      if (success) {
        const updatedCourseData = await getCourseById(course.id);
        if (updatedCourseData) {
          setCourse(updatedCourseData);
          setSections(updatedCourseData.sections || []);
        }
        
        toast({
          title: "Section updated",
          description: "The section has been updated successfully."
        });
      }
    } catch (error) {
      console.error("Error saving section:", error);
      toast({
        variant: "destructive",
        title: "Error saving section",
        description: "Please try again later."
      });
    }
  };

  const handleDeleteSection = async (sectionId: string) => {
    if (!course || !course.id) return;
    
    if (confirm("Are you sure you want to delete this section?")) {
      try {
        const success = await deleteCourseSection(course.id, sectionId);
        
        if (success) {
          const updatedCourseData = await getCourseById(course.id);
          if (updatedCourseData) {
            setCourse(updatedCourseData);
            setSections(updatedCourseData.sections || []);
          }
          
          toast({
            title: "Section deleted",
            description: "The section has been deleted successfully."
          });
        }
      } catch (error) {
        console.error("Error deleting section:", error);
        toast({
          variant: "destructive",
          title: "Error deleting section",
          description: "Please try again later."
        });
      }
    }
  };

  const handleEditLesson = (lesson: CourseLesson | null, sectionId: string) => {
    setEditLessonData(lesson);
    setCurrentSectionId(sectionId);
    setIsEditingLesson(true);
  };

  const handleSaveLesson = async (lesson: CourseLesson) => {
    if (!course || !course.id || !currentSectionId) return;
    
    try {
      const success = await updateCourseLesson(course.id, currentSectionId, lesson);
      
      if (success) {
        const updatedCourseData = await getCourseById(course.id);
        if (updatedCourseData) {
          setCourse(updatedCourseData);
          setSections(updatedCourseData.sections || []);
        }
        
        toast({
          title: "Lesson updated",
          description: "The lesson has been updated successfully."
        });
      }
    } catch (error) {
      console.error("Error saving lesson:", error);
      toast({
        variant: "destructive",
        title: "Error saving lesson",
        description: "Please try again later."
      });
    }
  };

  const handleDeleteLesson = async (sectionId: string, lessonId: string) => {
    if (!course || !course.id) return;
    
    if (confirm("Are you sure you want to delete this lesson?")) {
      try {
        const success = await deleteCourseLesson(course.id, sectionId, lessonId);
        
        if (success) {
          const updatedCourseData = await getCourseById(course.id);
          if (updatedCourseData) {
            setCourse(updatedCourseData);
            setSections(updatedCourseData.sections || []);
          }
          
          toast({
            title: "Lesson deleted",
            description: "The lesson has been deleted successfully."
          });
        }
      } catch (error) {
        console.error("Error deleting lesson:", error);
        toast({
          variant: "destructive",
          title: "Error deleting lesson",
          description: "Please try again later."
        });
      }
    }
  };

  const handleEditAssignment = (assignment: CourseAssignment | null) => {
    setEditAssignmentData(assignment);
    setIsEditingAssignment(true);
  };

  const handleSaveAssignment = async (assignment: CourseAssignment) => {
    if (!course || !course.id) return;
    
    try {
      const success = await updateCourseAssignment(course.id, assignment);
      
      if (success) {
        const updatedCourseData = await getCourseById(course.id);
        if (updatedCourseData) {
          setCourse(updatedCourseData);
        }
        
        toast({
          title: "Assignment updated",
          description: "The assignment has been updated successfully."
        });
      }
    } catch (error) {
      console.error("Error saving assignment:", error);
      toast({
        variant: "destructive",
        title: "Error saving assignment",
        description: "Please try again later."
      });
    }
  };

  const handleDeleteAssignment = async (assignmentId: string) => {
    if (!course || !course.id) return;
    
    if (confirm("Are you sure you want to delete this assignment?")) {
      try {
        const success = await deleteCourseAssignment(course.id, assignmentId);
        
        if (success) {
          const updatedCourseData = await getCourseById(course.id);
          if (updatedCourseData) {
            setCourse(updatedCourseData);
          }
          
          toast({
            title: "Assignment deleted",
            description: "The assignment has been deleted successfully."
          });
        }
      } catch (error) {
        console.error("Error deleting assignment:", error);
        toast({
          variant: "destructive",
          title: "Error deleting assignment",
          description: "Please try again later."
        });
      }
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

  const handleEnrollment = async () => {
    if (!course) return;
    
    if (course.enrolled) {
      handleContinueLearning();
    } else {
      try {
        const success = await enrollInCourse(course.id);
        if (success) {
          toast({
            title: "Enrolled",
            description: "You have successfully enrolled in this course!"
          });
          
          const updatedCourseData = await getCourseById(course.id);
          if (updatedCourseData) {
            setCourse(updatedCourseData);
          }
        }
      } catch (error) {
        console.error("Error enrolling in course:", error);
        toast({
          variant: "destructive",
          title: "Error enrolling in course",
          description: "Please try again later."
        });
      }
    }
  };

  const handleViewProfile = (userId: string) => {
    setPreviewUserId(userId);
    setIsProfilePreviewOpen(true);
  };
  
  const handlePlayVideo = (lessonId: string, title: string) => {
    const videoUrl = "https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4";
    
    if (course && course.sections) {
      for (const section of course.sections) {
        const lesson = section.lessons.find(l => l.id === lessonId);
        if (lesson && lesson.videoUrl) {
          setCurrentVideo({
            lessonId,
            title: lesson.title,
            videoUrl: lesson.videoUrl
          });
          setIsVideoDialogOpen(true);
          
          if (course.id) {
            markVideoAsWatched(course.id, lessonId);
          }
          return;
        }
      }
    }
    
    setCurrentVideo({
      lessonId,
      title,
      videoUrl
    });
    setIsVideoDialogOpen(true);
    
    if (course && course.id) {
      markVideoAsWatched(course.id, lessonId);
      
      const updatedCourse = getCourseById(course.id);
      if (updatedCourse) {
        setCourse(updatedCourse);
      }
    }
  };
  
  const handleShareCourse = () => {
    if (!course) return;
    
    const url = `${window.location.origin}/courses/${course.id}`;
    setShareUrl(url);
    setShareSuccess(false);
    setIsShareDialogOpen(true);
  };
  
  const copyShareLink = () => {
    shareCourse(course?.id || "");
    setShareSuccess(true);
    
    toast({
      title: "Link copied!",
      description: "Course link copied to clipboard"
    });
  };

  const handleContinueLearning = () => {
    if (course && course.sections && course.sections.length > 0) {
      const firstSection = course.sections[0];
      if (firstSection.lessons && firstSection.lessons.length > 0) {
        navigate(`/course-viewer/${course.id}/${firstSection.lessons[0].id}`);
      }
    }
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
      <CourseHeader 
        course={{
          id: course.id,
          title: course.title,
          category: course.category,
          rating: course.rating,
          reviews: course.reviews,
          totalHours: course.totalHours,
          sections: course.sections || [],
          thumbnail: course.thumbnail
        }}
        isAdmin={isAdmin()} 
        onEdit={handleEditCourse}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div>
            <h1 className="text-3xl font-bold mb-4">{course.title}</h1>
            
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="w-full grid grid-cols-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="instructor">Instructor</TabsTrigger>
                <TabsTrigger value="assignments">Assignments</TabsTrigger>
                <TabsTrigger value="quizzes">Quizzes</TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview" className="mt-6">
                <CourseOverview course={course} sections={sections} />
              </TabsContent>
              
              <TabsContent value="instructor" className="mt-6">
                <CourseInstructor 
                  instructor={course.instructor}
                  rating={course.rating}
                  category={course.category}
                  onViewProfile={handleViewProfile}
                />
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
                                    'default'
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
                                    'default'
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
        
        <div className="lg:col-span-1">
          <CourseContent
            sections={sections}
            isAdmin={isAdmin()}
            onAddSection={() => handleEditSection(null)}
            onEditSection={handleEditSection}
            onDeleteSection={handleDeleteSection}
            onEditLesson={handleEditLesson}
            onDeleteLesson={handleDeleteLesson}
            onPlayVideo={handlePlayVideo}
            onToggleSection={toggleSection}
            courseId={course.id}
            isVideoWatched={isVideoWatched}
          />
          
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
              <Button 
                variant="link" 
                className="text-muted-foreground text-sm"
                onClick={handleShareCourse}
              >
                <Share2 className="h-4 w-4 mr-1" />
                Share Course
              </Button>
            </div>
          </div>
        </div>
      </div>

      <Dialog open={isVideoDialogOpen} onOpenChange={setIsVideoDialogOpen}>
        <DialogContent className="max-w-4xl w-full p-0">
          <DialogHeader className="p-4">
            <DialogTitle>{currentVideo?.title}</DialogTitle>
            <DialogDescription>
              Watch this lesson to learn more about the course content.
            </DialogDescription>
          </DialogHeader>
          <div className="relative aspect-video w-full">
            <video
              ref={videoRef}
              className="w-full h-full"
              controls
              autoPlay
              src={currentVideo?.videoUrl}
            >
              Your browser does not support the video tag.
            </video>
          </div>
        </DialogContent>
      </Dialog>
      
      <Dialog open={isShareDialogOpen} onOpenChange={setIsShareDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Share this course</DialogTitle>
            <DialogDescription>
              Copy the link below to share this course with your friends or colleagues.
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center space-x-2 mt-2">
            <div className="grid flex-1 gap-2">
              <input
                className="flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 w-full"
                value={shareUrl}
                readOnly
              />
            </div>
            <Button 
              type="button" 
              size="sm" 
              className="px-3" 
              onClick={copyShareLink}
              disabled={shareSuccess}
            >
              {shareSuccess ? (
                <span className="flex items-center">
                  <Check className="h-4 w-4 mr-1" />
                  Copied
                </span>
              ) : (
                <span>Copy</span>
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

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
