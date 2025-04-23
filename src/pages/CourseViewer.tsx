import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  Tabs, TabsContent, TabsList, TabsTrigger 
} from "@/components/ui/tabs";
import { 
  Card, CardContent, CardHeader, CardTitle, CardDescription
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { 
  X, Download, BookOpen, FileText, MessageSquare, 
  ExternalLink, Save, Bookmark, BookmarkCheck
} from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Course, CourseSection, CourseLesson } from "@/types/course";
import { 
  getCourseById, 
  markVideoAsWatched,
  isVideoWatched
} from "@/components/courses/CourseService";
import { notesService } from "@/services/notesService";
import { courseNotesService } from "@/services/courseNotesService";

const CourseViewer = () => {
  const { id, lessonId } = useParams<{ id: string, lessonId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const videoRef = useRef<HTMLVideoElement>(null);
  
  const [course, setCourse] = useState<Course | null>(null);
  const [sections, setSections] = useState<CourseSection[]>([]);
  const [activeTab, setActiveTab] = useState("transcript");
  const [currentLesson, setCurrentLesson] = useState<CourseLesson | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [noteContent, setNoteContent] = useState("");
  const [isSavingNote, setIsSavingNote] = useState(false);
  const [discussions, setDiscussions] = useState<any[]>([]);
  const [newComment, setNewComment] = useState("");
  const [isPostingComment, setIsPostingComment] = useState(false);
  const [resources, setResources] = useState<{name: string, type: string, url: string}[]>([]);
  const [isBookmarked, setIsBookmarked] = useState(false);

  useEffect(() => {
    const fetchCourseData = async () => {
      if (id) {
        setIsLoading(true);
        try {
          const courseData = await getCourseById(id);
          
          if (courseData) {
            setCourse(courseData);
            setSections(courseData.sections || []);
            
            if (lessonId) {
              let foundLesson = null;
              
              courseData.sections?.forEach(section => {
                section.lessons.forEach(lesson => {
                  if (lesson.id === lessonId) {
                    foundLesson = lesson;
                    markVideoAsWatched(id, lessonId);
                  }
                });
              });
              
              if (foundLesson) {
                setCurrentLesson(foundLesson);
              } else if (courseData.sections && courseData.sections.length > 0) {
                const firstSection = courseData.sections[0];
                if (firstSection.lessons && firstSection.lessons.length > 0) {
                  setCurrentLesson(firstSection.lessons[0]);
                  navigate(`/course-viewer/${id}/${firstSection.lessons[0].id}`, { replace: true });
                }
              }
            } else if (courseData.sections && courseData.sections.length > 0) {
              const firstSection = courseData.sections[0];
              if (firstSection.lessons && firstSection.lessons.length > 0) {
                setCurrentLesson(firstSection.lessons[0]);
                navigate(`/course-viewer/${id}/${firstSection.lessons[0].id}`, { replace: true });
              }
            }
            
            if (lessonId) {
              loadNotes(lessonId);
              loadDiscussions(lessonId);
              loadResources(lessonId);
              checkBookmarkStatus(lessonId);
            }
          } else {
            toast({
              variant: "destructive",
              title: "Course not found",
              description: "The course you're looking for doesn't exist or has been removed."
            });
            navigate("/courses");
          }
        } catch (error) {
          console.error("Error loading course:", error);
          toast({
            variant: "destructive",
            title: "Error loading course",
            description: "Please try again later."
          });
        } finally {
          setIsLoading(false);
        }
      }
    };
    
    fetchCourseData();
  }, [id, lessonId, navigate]);

  const loadNotes = async (lessonId: string) => {
    if (!user || !course?.id) return;
    
    try {
      const savedNote = await courseNotesService.getUserNotes(user.id, lessonId, course.id);
      setNoteContent(savedNote || "");
    } catch (error) {
      console.error("Error loading notes:", error);
    }
  };

  const saveNote = async () => {
    if (!user || !lessonId || !course?.id) return;
    
    setIsSavingNote(true);
    try {
      await courseNotesService.updateUserNotes(user.id, lessonId, course.id, noteContent);
      
      toast({
        title: "Note saved",
        description: "Your note has been saved successfully."
      });
    } catch (error) {
      console.error("Error saving note:", error);
      toast({
        variant: "destructive",
        title: "Failed to save note",
        description: "Please try again later."
      });
    } finally {
      setIsSavingNote(false);
    }
  };

  const loadDiscussions = async (lessonId: string) => {
    try {
      const mockDiscussions = [
        {
          id: "disc-1",
          user_id: "user-123",
          user_name: "John Smith",
          user_avatar: "JS",
          content: "This lesson was very helpful! I especially liked the part about component architecture.",
          created_at: new Date(Date.now() - 86400000).toISOString(),
          likes: 3,
          replies: [
            {
              id: "reply-1",
              user_id: "user-456",
              user_name: "Sarah Johnson",
              user_avatar: "SJ",
              content: "I agree! The examples were really clear.",
              created_at: new Date(Date.now() - 43200000).toISOString(),
              likes: 1,
            }
          ]
        },
        {
          id: "disc-2",
          user_id: "user-789",
          user_name: "Michael Brown",
          user_avatar: "MB",
          content: "Could you explain more about the concept discussed at 5:30?",
          created_at: new Date(Date.now() - 172800000).toISOString(),
          likes: 0,
          replies: []
        }
      ];
      
      setDiscussions(mockDiscussions);
    } catch (error) {
      console.error("Error loading discussions:", error);
    }
  };

  const postComment = async () => {
    if (!newComment.trim() || !user || !lessonId) return;
    
    setIsPostingComment(true);
    try {
      const newDiscussion = {
        id: `disc-${Date.now()}`,
        user_id: user.id,
        user_name: user.user_metadata?.full_name || "User",
        user_avatar: user.user_metadata?.full_name ? user.user_metadata.full_name.split(" ").map((n: string) => n[0]).join("") : "U",
        content: newComment,
        created_at: new Date().toISOString(),
        likes: 0,
        replies: []
      };
      
      setDiscussions([newDiscussion, ...discussions]);
      setNewComment("");
      
      toast({
        title: "Comment posted",
        description: "Your comment has been posted successfully."
      });
    } catch (error) {
      console.error("Error posting comment:", error);
      toast({
        variant: "destructive",
        title: "Failed to post comment",
        description: "Please try again later."
      });
    } finally {
      setIsPostingComment(false);
    }
  };

  const loadResources = async (lessonId: string) => {
    try {
      const mockResources = [
        {
          name: "Lesson Slides",
          type: "pdf",
          url: "https://example.com/slides.pdf"
        },
        {
          name: "Code Examples",
          type: "zip",
          url: "https://example.com/code.zip"
        },
        {
          name: "Supplementary Reading",
          type: "pdf",
          url: "https://example.com/reading.pdf"
        }
      ];
      
      setResources(mockResources);
    } catch (error) {
      console.error("Error loading resources:", error);
    }
  };

  const checkBookmarkStatus = async (lessonId: string) => {
    if (!user) return;
    
    try {
      const bookmarks = JSON.parse(localStorage.getItem(`bookmarks-${user.id}`) || "[]");
      setIsBookmarked(bookmarks.includes(lessonId));
    } catch (error) {
      console.error("Error checking bookmark status:", error);
    }
  };

  const toggleBookmark = async () => {
    if (!user || !lessonId) return;
    
    try {
      const bookmarksKey = `bookmarks-${user.id}`;
      const bookmarks = JSON.parse(localStorage.getItem(bookmarksKey) || "[]");
      
      if (isBookmarked) {
        const updatedBookmarks = bookmarks.filter((id: string) => id !== lessonId);
        localStorage.setItem(bookmarksKey, JSON.stringify(updatedBookmarks));
        setIsBookmarked(false);
        toast({
          title: "Bookmark removed",
          description: "This lesson has been removed from your bookmarks."
        });
      } else {
        bookmarks.push(lessonId);
        localStorage.setItem(bookmarksKey, JSON.stringify(bookmarks));
        setIsBookmarked(true);
        toast({
          title: "Bookmark added",
          description: "This lesson has been added to your bookmarks."
        });
      }
    } catch (error) {
      console.error("Error toggling bookmark:", error);
      toast({
        variant: "destructive",
        title: "Failed to update bookmark",
        description: "Please try again later."
      });
    }
  };

  const handleLessonChange = (newLessonId: string) => {
    navigate(`/course-viewer/${id}/${newLessonId}`);
  };

  const exitCourse = () => {
    navigate(`/courses/${id}`);
  };

  const downloadTranscript = () => {
    if (!currentLesson) return;
    
    const transcript = currentLesson.transcript || "No transcript available for this lesson.";
    const blob = new Blob([transcript], { type: "text/plain" });
    
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `${currentLesson.title.replace(/\s+/g, "-")}-transcript.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    
    toast({
      title: "Transcript downloaded",
      description: "The transcript has been downloaded successfully."
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!course || !currentLesson) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <h2 className="text-2xl font-bold mb-4">Course or lesson not found</h2>
        <Button onClick={() => navigate("/courses")}>Back to Courses</Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <header className="h-16 border-b bg-background flex items-center justify-between px-4 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="bg-primary text-primary-foreground p-1.5 rounded-lg">
            <BookOpen className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold">{course.title}</h2>
            <p className="text-xs text-muted-foreground">
              {currentLesson?.section_title || "Learning in progress"}
            </p>
          </div>
        </div>
        
        <Button variant="ghost" size="icon" onClick={exitCourse}>
          <X className="h-5 w-5" />
        </Button>
      </header>

      <div className="flex h-[calc(100vh-4rem)] overflow-hidden">
        <div className="w-64 border-r bg-muted/30 overflow-y-auto flex-shrink-0">
          <ScrollArea className="h-full">
            <div className="p-4 space-y-4">
              {sections.map((section) => (
                <div key={section.id} className="space-y-2">
                  <h3 className="font-medium text-sm">{section.title}</h3>
                  <ul className="space-y-1">
                    {section.lessons.map((lesson) => {
                      const isWatched = isVideoWatched(course.id, lesson.id);
                      const isActive = lesson.id === currentLesson.id;
                      
                      return (
                        <li key={lesson.id}>
                          <button 
                            onClick={() => handleLessonChange(lesson.id)}
                            className={`w-full text-left p-2 rounded-md text-sm flex items-center gap-2 ${
                              isActive 
                                ? "bg-primary text-primary-foreground" 
                                : "hover:bg-accent"
                            }`}
                          >
                            {isWatched && !isActive && (
                              <div className="h-2 w-2 rounded-full bg-green-500 flex-shrink-0" />
                            )}
                            <span className={`truncate ${isWatched && !isActive ? "text-muted-foreground" : ""}`}>
                              {lesson.title}
                            </span>
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>

        <div className="flex-1 overflow-y-auto">
          <div className="container max-w-5xl mx-auto p-4 space-y-6">
            <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
              <video
                ref={videoRef}
                className="w-full h-full"
                controls
                autoPlay
                src={currentLesson.videoUrl || "https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4"}
                poster={currentLesson.thumbnail}
              >
                Your browser does not support the video tag.
              </video>
            </div>
            
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold">{currentLesson.title}</h1>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={toggleBookmark}
                >
                  {isBookmarked ? (
                    <>
                      <BookmarkCheck className="h-4 w-4 mr-2" /> Bookmarked
                    </>
                  ) : (
                    <>
                      <Bookmark className="h-4 w-4 mr-2" /> Bookmark
                    </>
                  )}
                </Button>
              </div>
            </div>
            
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid grid-cols-4 w-full">
                <TabsTrigger value="transcript">Transcript</TabsTrigger>
                <TabsTrigger value="notes">Notes</TabsTrigger>
                <TabsTrigger value="resources">Resources</TabsTrigger>
                <TabsTrigger value="discussion">Discussion</TabsTrigger>
              </TabsList>
              
              <TabsContent value="transcript" className="mt-4">
                <Card className="p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold">Lesson Transcript</h3>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={downloadTranscript}
                    >
                      <Download className="h-4 w-4 mr-2" /> Download
                    </Button>
                  </div>
                  <ScrollArea className="h-[300px]">
                    <div className="space-y-4">
                      {currentLesson.transcript ? (
                        <p className="whitespace-pre-line">{currentLesson.transcript}</p>
                      ) : (
                        <p className="text-muted-foreground">No transcript available for this lesson.</p>
                      )}
                    </div>
                  </ScrollArea>
                </Card>
              </TabsContent>
              
              <TabsContent value="notes" className="mt-4">
                <Card className="p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold">My Notes</h3>
                    <Button 
                      onClick={saveNote}
                      disabled={isSavingNote}
                    >
                      <Save className="h-4 w-4 mr-2" />
                      {isSavingNote ? "Saving..." : "Save Notes"}
                    </Button>
                  </div>
                  <Textarea
                    value={noteContent}
                    onChange={(e) => setNoteContent(e.target.value)}
                    placeholder="Take notes for this lesson..."
                    className="min-h-[300px] resize-none"
                  />
                </Card>
              </TabsContent>
              
              <TabsContent value="resources" className="mt-4">
                <Card className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Lesson Resources</h3>
                  {resources.length > 0 ? (
                    <ul className="space-y-4">
                      {resources.map((resource, index) => (
                        <li key={index} className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-muted rounded-full">
                              <FileText className="h-4 w-4" />
                            </div>
                            <div>
                              <p className="font-medium">{resource.name}</p>
                              <p className="text-xs text-muted-foreground uppercase">{resource.type}</p>
                            </div>
                          </div>
                          <a 
                            href={resource.url}
                            target="_blank"
                            rel="noreferrer"
                            className="flex items-center text-primary hover:underline"
                          >
                            <Download className="h-4 w-4 mr-1" /> Download
                          </a>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-muted-foreground">No resources available for this lesson.</p>
                  )}
                </Card>
              </TabsContent>
              
              <TabsContent value="discussion" className="mt-4">
                <Card className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Discussion</h3>
                  <div className="mb-6">
                    <Textarea
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="Add to the discussion..."
                      className="mb-2"
                    />
                    <div className="flex justify-end">
                      <Button 
                        onClick={postComment}
                        disabled={!newComment.trim() || isPostingComment}
                      >
                        <MessageSquare className="h-4 w-4 mr-2" />
                        {isPostingComment ? "Posting..." : "Post Comment"}
                      </Button>
                    </div>
                  </div>
                  
                  <Separator className="my-4" />
                  
                  <ScrollArea className="max-h-[500px]">
                    <div className="space-y-6">
                      {discussions.length > 0 ? (
                        discussions.map((discussion) => (
                          <div key={discussion.id} className="space-y-3">
                            <div className="flex items-start gap-3">
                              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-medium">
                                {discussion.user_avatar}
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center gap-2">
                                  <span className="font-medium">{discussion.user_name}</span>
                                  <span className="text-xs text-muted-foreground">
                                    {new Date(discussion.created_at).toLocaleDateString()}
                                  </span>
                                </div>
                                <p className="mt-1">{discussion.content}</p>
                                <div className="flex items-center gap-4 mt-2">
                                  <button className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-3 w-3">
                                      <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
                                    </svg>
                                    Like ({discussion.likes})
                                  </button>
                                  <button className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1">
                                    <MessageSquare className="h-3 w-3" /> Reply
                                  </button>
                                </div>
                              </div>
                            </div>
                            
                            {discussion.replies && discussion.replies.length > 0 && (
                              <div className="pl-11 space-y-3 mt-3">
                                {discussion.replies.map((reply: any) => (
                                  <div key={reply.id} className="flex items-start gap-3">
                                    <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-medium">
                                      {reply.user_avatar}
                                    </div>
                                    <div className="flex-1">
                                      <div className="flex items-center gap-2">
                                        <span className="font-medium">{reply.user_name}</span>
                                        <span className="text-xs text-muted-foreground">
                                          {new Date(reply.created_at).toLocaleDateString()}
                                        </span>
                                      </div>
                                      <p className="mt-1">{reply.content}</p>
                                      <div className="flex items-center gap-4 mt-2">
                                        <button className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1">
                                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-3 w-3">
                                            <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
                                          </svg>
                                          Like ({reply.likes})
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        ))
                      ) : (
                        <p className="text-center text-muted-foreground">No comments yet. Be the first to start the discussion!</p>
                      )}
                    </div>
                  </ScrollArea>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseViewer;
