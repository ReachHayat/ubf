
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Loader2, Clock, Book, Users, Star, ChevronRight } from "lucide-react";
import { courseService } from "@/services/courseService";
import { enrollmentService } from "@/services/enrollmentService";
import { useAuth } from "@/contexts/AuthContext";
import { Course } from "@/types/course";
import { useToast } from "@/components/ui/use-toast";

const CoursePreview: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const fetchCourseData = async () => {
      if (!courseId) return;

      setLoading(true);
      try {
        const courseData = await courseService.getCourseById(courseId);
        setCourse(courseData);

        // Check if user is enrolled
        if (user && user.id) {
          const enrollments = await enrollmentService.getEnrollments(user.id);
          const enrolled = enrollments.some(enrollment => enrollment.course_id === courseId);
          setIsEnrolled(enrolled);
        }
      } catch (error) {
        console.error("Error fetching course details:", error);
        toast({
          title: "Error",
          description: "Failed to load course details. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchCourseData();
  }, [courseId, user, toast]);

  const handleEnroll = async () => {
    if (!courseId || !user) return;

    setEnrolling(true);
    try {
      const success = await enrollmentService.enrollInCourse(courseId);
      if (success) {
        setIsEnrolled(true);
        toast({
          title: "Success",
          description: "You have successfully enrolled in this course!",
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to enroll in course. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error enrolling in course:", error);
      toast({
        title: "Error",
        description: "An error occurred while enrolling. Please try again.",
        variant: "destructive",
      });
    } finally {
      setEnrolling(false);
    }
  };

  const handleStartCourse = () => {
    if (courseId) {
      // Find first section and lesson
      if (course?.sections && course.sections.length > 0) {
        const firstSection = course.sections[0];
        if (firstSection.lessons && firstSection.lessons.length > 0) {
          const firstLesson = firstSection.lessons[0];
          navigate(`/course/${courseId}/${firstLesson.id}`);
          return;
        }
      }
      
      // If no lessons found, just go to course content page
      navigate(`/course/${courseId}`);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[70vh]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!course) {
    return (
      <div className="text-center py-16">
        <h2 className="text-2xl font-bold">Course not found</h2>
        <p className="text-muted-foreground mt-2">The course you're looking for doesn't exist or has been removed.</p>
        <Button className="mt-4" onClick={() => navigate("/courses")}>Browse Courses</Button>
      </div>
    );
  }

  const totalLessons = course.sections?.reduce((total, section) => total + section.lessons.length, 0) || 0;

  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Course Info */}
        <div className="md:col-span-2 space-y-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="outline">{course.category}</Badge>
              {course.status === "published" ? (
                <Badge className="bg-green-500">Published</Badge>
              ) : (
                <Badge variant="outline">Draft</Badge>
              )}
            </div>
            <h1 className="text-3xl md:text-4xl font-bold">{course.title}</h1>
            <p className="text-muted-foreground mt-2">{course.description}</p>
          </div>

          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span>{course.totalHours} hours</span>
            </div>
            <div className="flex items-center gap-2">
              <Book className="h-4 w-4 text-muted-foreground" />
              <span>{totalLessons} lessons</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-muted-foreground" />
              <span>{course.reviews || 0} students</span>
            </div>
            <div className="flex items-center gap-2">
              <Star className="h-4 w-4 text-yellow-500" />
              <span>{course.rating || 0}</span>
            </div>
          </div>

          <Separator />

          <div>
            <h3 className="text-xl font-semibold mb-4">What you'll learn</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {course.tags?.map((tag, index) => (
                <div key={index} className="flex items-start gap-2">
                  <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center">
                    <ChevronRight className="h-4 w-4 text-primary" />
                  </div>
                  <span>{tag}</span>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {course.sections && course.sections.length > 0 && (
            <div>
              <h3 className="text-xl font-semibold mb-4">Course Content</h3>
              <div className="space-y-3">
                {course.sections.map((section, index) => (
                  <Card key={section.id}>
                    <CardHeader className="py-3">
                      <CardTitle className="text-base">
                        Section {index + 1}: {section.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="py-0 text-sm text-muted-foreground">
                      {section.lessons.length} lessons • {section.duration || "N/A"}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Enrollment Card */}
        <div>
          <Card className="sticky top-6">
            {course.thumbnail && (
              <div className="aspect-video w-full overflow-hidden rounded-t-lg">
                <img 
                  src={course.thumbnail} 
                  alt={course.title} 
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <CardContent className="p-6 space-y-4">
              {course.price ? (
                <div className="text-3xl font-bold">${course.price}</div>
              ) : (
                <div className="text-3xl font-bold text-green-600">Free</div>
              )}
              
              {isEnrolled ? (
                <Button 
                  className="w-full" 
                  onClick={handleStartCourse}
                >
                  Continue Learning
                </Button>
              ) : (
                <Button 
                  className="w-full" 
                  onClick={handleEnroll}
                  disabled={enrolling}
                >
                  {enrolling ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Enrolling...
                    </>
                  ) : (
                    'Enroll Now'
                  )}
                </Button>
              )}
            </CardContent>

            <CardFooter className="flex flex-col items-start p-6 pt-0 space-y-4">
              <div>
                <h4 className="font-medium">Instructor</h4>
                <div className="flex items-center gap-2 mt-2">
                  <div className="h-10 w-10 rounded-full bg-gray-200 overflow-hidden">
                    {course.instructor?.avatar ? (
                      <img 
                        src={course.instructor.avatar} 
                        alt={course.instructor.name} 
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center bg-primary text-primary-foreground">
                        {course.instructor?.name?.[0] || "?"}
                      </div>
                    )}
                  </div>
                  <div>
                    <p className="font-medium">{course.instructor?.name}</p>
                    <p className="text-sm text-muted-foreground">{course.instructor?.role}</p>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-medium">Last Updated</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  {course.lastUpdated ? new Date(course.lastUpdated).toLocaleDateString() : "N/A"}
                </p>
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CoursePreview;
