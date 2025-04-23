import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/contexts/AuthContext";
import { 
  getCourseById,
  markVideoAsWatched,
  isVideoWatched
} from "@/components/courses/CourseService";
import { Course, CourseSection, CourseLesson } from "@/types/course";
import { ScrollArea } from "@/components/ui/scroll-area";

const CourseViewer = () => {
  const { courseId, lessonId } = useParams<{ courseId: string; lessonId: string }>();
  const navigate = useNavigate();
  const [course, setCourse] = useState<Course | null>(null);
  const [sections, setSections] = useState<CourseSection[]>([]);
  const [currentSection, setCurrentSection] = useState<CourseSection | null>(null);
  const [currentLesson, setCurrentLesson] = useState<CourseLesson | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState<number>(0);
  const { user } = useAuth();

  useEffect(() => {
    const fetchCourseData = async () => {
      if (!courseId) return;
      
      setLoading(true);
      try {
        const courseData = await getCourseById(courseId);
        
        if (courseData) {
          setCourse(courseData);
          setSections(courseData.sections || []);
          
          // Find the current section and lesson
          if (courseData.sections && lessonId) {
            let foundSection = null;
            let foundLesson = null;
            
            for (const section of courseData.sections) {
              const lesson = section.lessons.find(l => l.id === lessonId);
              if (lesson) {
                foundSection = section;
                foundLesson = lesson;
                break;
              }
            }
            
            if (foundSection && foundLesson) {
              setCurrentSection(foundSection);
              setCurrentLesson(foundLesson);
              
              // Mark video as watched
              if (courseData.id) {
                await markVideoAsWatched(courseData.id, foundLesson.id);
              }
            } else {
              // If lesson not found, redirect to first lesson
              if (courseData.sections[0] && courseData.sections[0].lessons[0]) {
                navigate(`/course-viewer/${courseId}/${courseData.sections[0].lessons[0].id}`);
              }
            }
          }
          
          // Calculate progress
          if (user && courseData.id) {
            const totalLessons = courseData.sections?.reduce((acc, section) => acc + section.lessons.length, 0) || 0;
            let watchedLessons = 0;
            
            for (const section of courseData.sections) {
              for (const lesson of section.lessons) {
                if (isVideoWatched(courseData.id, lesson.id)) {
                  watchedLessons++;
                }
              }
            }
            
            setProgress(Math.round((watchedLessons / totalLessons) * 100));
          }
        }
      } catch (error) {
        console.error("Error fetching course:", error);
        setError("Failed to load course data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    
    fetchCourseData();
  }, [courseId, lessonId, navigate, user]);

  const handleNavigation = (direction: 'prev' | 'next') => {
    if (!course || !currentSection || !currentLesson) return;
    
    const currentSectionIndex = course.sections?.findIndex(section => section.id === currentSection.id) || -1;
    const currentLessonIndex = currentSection.lessons.findIndex(lesson => lesson.id === currentLesson.id);
    
    if (direction === 'next') {
      if (currentLessonIndex < currentSection.lessons.length - 1) {
        // Navigate to the next lesson in the current section
        navigate(`/course-viewer/${courseId}/${currentSection.lessons[currentLessonIndex + 1].id}`);
      } else if (currentSectionIndex < (course.sections?.length || 0) - 1) {
        // Navigate to the first lesson in the next section
        const nextSection = course.sections?.[currentSectionIndex + 1];
        if (nextSection && nextSection.lessons.length > 0) {
          navigate(`/course-viewer/${courseId}/${nextSection.lessons[0].id}`);
        }
      } else {
        // Optionally, navigate to a course completion page or display a message
        alert("Course completed!");
      }
    } else if (direction === 'prev') {
      if (currentLessonIndex > 0) {
        // Navigate to the previous lesson in the current section
        navigate(`/course-viewer/${courseId}/${currentSection.lessons[currentLessonIndex - 1].id}`);
      } else if (currentSectionIndex > 0) {
        // Navigate to the last lesson in the previous section
        const prevSection = course.sections?.[currentSectionIndex - 1];
        if (prevSection && prevSection.lessons.length > 0) {
          navigate(`/course-viewer/${courseId}/${prevSection.lessons[prevSection.lessons.length - 1].id}`);
        }
      } else {
        // Optionally, navigate back to the course details page or display a message
        navigate(`/courses/${courseId}`);
      }
    }
  };

  if (loading) {
    return <div className="text-center">Loading course content...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  if (!course || !currentLesson) {
    return <div className="text-center">Course or lesson not found.</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Course Content Sidebar */}
        <div className="md:col-span-1">
          <Card>
            <CardContent className="p-3">
              <ScrollArea className="h-[500px] w-full">
                <div className="text-sm font-semibold mb-2">Course Content</div>
                <Separator className="mb-2" />
                {sections.map((section) => (
                  <div key={section.id} className="mb-3">
                    <div className="font-medium">{section.title}</div>
                    {section.lessons.map((lesson) => (
                      <Button
                        key={lesson.id}
                        variant="ghost"
                        className={`w-full justify-start text-sm ${lesson.id === currentLesson.id ? 'text-blue-500' : ''}`}
                        onClick={() => navigate(`/course-viewer/${courseId}/${lesson.id}`)}
                      >
                        {lesson.id === currentLesson.id && <Check className="h-4 w-4 mr-2 text-blue-500" />}
                        {lesson.title}
                        {isVideoWatched(courseId, lesson.id) && lesson.id !== currentLesson.id && <Check className="h-4 w-4 ml-auto text-green-500" />}
                      </Button>
                    ))}
                  </div>
                ))}
              </ScrollArea>
            </CardContent>
          </Card>
        </div>

        {/* Lesson Content */}
        <div className="md:col-span-3">
          <Card>
            <CardContent>
              <h2 className="text-2xl font-semibold mb-4">{currentLesson.title}</h2>
              <div className="mb-4">
                {currentLesson.videoUrl ? (
                  <video controls className="w-full aspect-video">
                    <source src={currentLesson.videoUrl} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                ) : (
                  <p>No video available for this lesson.</p>
                )}
              </div>
              <p>{currentLesson.content || 'No content available for this lesson.'}</p>
              <Separator className="my-4" />
              <div className="flex justify-between">
                <Button onClick={() => handleNavigation('prev')}><ArrowLeft className="mr-2" />Previous</Button>
                <Button onClick={() => handleNavigation('next')}>Next<ArrowRight className="ml-2" /></Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CourseViewer;
