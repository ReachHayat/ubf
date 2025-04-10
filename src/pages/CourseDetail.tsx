
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  ChevronLeft, 
  Star, 
  Clock, 
  PlayCircle,
  ChevronDown,
  ChevronUp
} from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

type CourseSection = {
  id: number;
  title: string;
  duration: string;
  expanded: boolean;
  lessons: {
    id: number;
    title: string;
    duration: string;
    isCompleted: boolean;
  }[];
};

const CourseDetail = () => {
  const { id } = useParams();
  
  // Course information (in a real app, this would be fetched based on the ID)
  const [course] = useState({
    id: "figma-a-to-z",
    title: "Figma from A to Z",
    category: "UI/UX Design",
    instructor: {
      name: "Crystal Lucas",
      role: "UI/UX Specialist",
      avatar: "CL"
    },
    rating: 4.8,
    reviews: 126,
    lessons: 38,
    duration: "4h 30min",
    image: "/lovable-uploads/225b2ac5-0ee7-49a0-ab7c-8110e42dc865.png",
    enrolled: true,
    progress: 35
  });

  const [activeTab, setActiveTab] = useState("overview");
  
  const [sections, setSections] = useState<CourseSection[]>([
    {
      id: 1,
      title: "01: Intro",
      duration: "22min",
      expanded: true,
      lessons: [
        { id: 101, title: "Introduction", duration: "2 min", isCompleted: true },
        { id: 102, title: "What is Figma?", duration: "5 min", isCompleted: true },
        { id: 103, title: "Understanding Figma", duration: "12 min", isCompleted: false },
        { id: 104, title: "UI tour", duration: "3 min", isCompleted: false }
      ]
    },
    {
      id: 2,
      title: "02: Intermediate Level Stuff",
      duration: "1h 20min",
      expanded: false,
      lessons: [
        { id: 201, title: "Figma Components", duration: "15 min", isCompleted: false },
        { id: 202, title: "Auto Layout", duration: "20 min", isCompleted: false },
        { id: 203, title: "Variables", duration: "25 min", isCompleted: false },
        { id: 204, title: "Working with Constraints", duration: "20 min", isCompleted: false }
      ]
    },
    {
      id: 3,
      title: "03: Advanced Stuff",
      duration: "36min",
      expanded: false,
      lessons: [
        { id: 301, title: "Prototyping Advanced Techniques", duration: "12 min", isCompleted: false },
        { id: 302, title: "Interactive Components", duration: "14 min", isCompleted: false },
        { id: 303, title: "Design System Architecture", duration: "10 min", isCompleted: false }
      ]
    },
    {
      id: 4,
      title: "04: Imports & Graphics",
      duration: "40min",
      expanded: false,
      lessons: [
        { id: 401, title: "Importing Assets", duration: "12 min", isCompleted: false },
        { id: 402, title: "Vector Networks", duration: "15 min", isCompleted: false },
        { id: 403, title: "Advanced Graphics Techniques", duration: "13 min", isCompleted: false }
      ]
    },
    {
      id: 5,
      title: "05: Component in Figma",
      duration: "1h 12min",
      expanded: false,
      lessons: [
        { id: 501, title: "Creating Component Libraries", duration: "18 min", isCompleted: false },
        { id: 502, title: "Component Properties", duration: "22 min", isCompleted: false },
        { id: 503, title: "Component Best Practices", duration: "32 min", isCompleted: false }
      ]
    },
    {
      id: 6,
      title: "06: Styles in Figma",
      duration: "41min",
      expanded: false,
      lessons: [
        { id: 601, title: "Color Styles", duration: "12 min", isCompleted: false },
        { id: 602, title: "Typography Styles", duration: "14 min", isCompleted: false },
        { id: 603, title: "Effect Styles", duration: "15 min", isCompleted: false }
      ]
    },
    {
      id: 7,
      title: "07: Summary",
      duration: "8min",
      expanded: false,
      lessons: [
        { id: 701, title: "Course Summary", duration: "5 min", isCompleted: false },
        { id: 702, title: "Next Steps", duration: "3 min", isCompleted: false }
      ]
    }
  ]);

  const toggleSection = (sectionId: number) => {
    setSections(sections.map(section => 
      section.id === sectionId 
        ? { ...section, expanded: !section.expanded }
        : section
    ));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Link to="/courses" className="flex items-center">
          <ChevronLeft className="h-4 w-4 mr-1" />
          Courses
        </Link>
        <span>/</span>
        <Link to="/courses" className="hover:underline">UI UX Design</Link>
        <span>/</span>
        <span className="text-foreground">Figma from A to Z</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Course Info */}
        <div className="lg:col-span-2 space-y-6">
          <div className="relative">
            {course.image && (
              <div className="rounded-lg overflow-hidden relative aspect-video">
                <img 
                  src={course.image} 
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
          </div>

          <div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
              <Badge variant="outline">{course.category}</Badge>
              <div className="flex items-center gap-1">
                <span>{course.lessons} lessons</span>
                <span>•</span>
                <Clock className="h-3 w-3" />
                <span>{course.duration}</span>
              </div>
              <div className="flex items-center gap-1">
                <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                <span>{course.rating} ({course.reviews} reviews)</span>
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
                <TabsTrigger value="author">Author</TabsTrigger>
                <TabsTrigger value="faq">FAQ</TabsTrigger>
                <TabsTrigger value="announcements">Announcements</TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview" className="mt-6">
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-semibold mb-4">About Course</h2>
                    <p className="text-muted-foreground">
                      Unlock the power of Figma, the leading collaborative design tool, with our comprehensive online course. 
                      Whether you're a novice or looking to enhance your skills, this course will guide you through Figma's robust 
                      features and workflows.
                    </p>
                    <p className="text-muted-foreground mt-4">
                      Perfect for UI/UX designers, product managers, and anyone interested in modern design tools. Join us to elevate 
                      your design skills and boost your productivity with Figma!
                    </p>
                  </div>
                  
                  <div>
                    <h2 className="text-xl font-semibold mb-4">What You'll Learn</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-start gap-2">
                        <div className="mt-1 text-green-500">✓</div>
                        <p>Setting up the environment</p>
                      </div>
                      <div className="flex items-start gap-2">
                        <div className="mt-1 text-green-500">✓</div>
                        <p>Understand HTML Programming</p>
                      </div>
                      <div className="flex items-start gap-2">
                        <div className="mt-1 text-green-500">✓</div>
                        <p>Advanced HTML Practices</p>
                      </div>
                      <div className="flex items-start gap-2">
                        <div className="mt-1 text-green-500">✓</div>
                        <p>Code HTML</p>
                      </div>
                      <div className="flex items-start gap-2">
                        <div className="mt-1 text-green-500">✓</div>
                        <p>Build a portfolio website</p>
                      </div>
                      <div className="flex items-start gap-2">
                        <div className="mt-1 text-green-500">✓</div>
                        <p>Start building beautiful websites</p>
                      </div>
                      <div className="flex items-start gap-2">
                        <div className="mt-1 text-green-500">✓</div>
                        <p>Responsive Designs</p>
                      </div>
                      <div className="flex items-start gap-2">
                        <div className="mt-1 text-green-500">✓</div>
                        <p>Master prototyping tools</p>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="author" className="mt-6">
                <Card className="p-6">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-16 w-16">
                      <AvatarFallback className="text-xl">{course.instructor.avatar}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg font-bold">{course.instructor.name}</h3>
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-medium">(4.8)</span>
                      </div>
                      <p className="text-muted-foreground">{course.instructor.role}</p>
                    </div>
                  </div>
                  
                  <p className="mt-4 text-muted-foreground">
                    Crystal is a seasoned UI/UX designer with over a decade of experience working with top tech companies. 
                    She specializes in creating intuitive and beautiful user interfaces that enhance user experiences across web and mobile platforms.
                  </p>
                  
                  <div className="mt-4 flex flex-wrap gap-2">
                    <Badge variant="secondary">Figma Expert</Badge>
                    <Badge variant="secondary">Design Systems</Badge>
                    <Badge variant="secondary">Prototyping</Badge>
                    <Badge variant="secondary">UI/UX Design</Badge>
                  </div>
                </Card>
              </TabsContent>
              
              <TabsContent value="faq" className="mt-6">
                <Card className="p-6">
                  <h2 className="text-xl font-semibold mb-4">Frequently Asked Questions</h2>
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-medium">Do I need prior design experience?</h3>
                      <p className="text-muted-foreground mt-1">
                        No prior design experience is needed. This course is structured for beginners but also offers advanced techniques for experienced designers.
                      </p>
                    </div>
                    <div>
                      <h3 className="font-medium">Is Figma free to use?</h3>
                      <p className="text-muted-foreground mt-1">
                        Figma offers a free tier that is quite generous and perfect for learning. You won't need a paid subscription to follow along with this course.
                      </p>
                    </div>
                    <div>
                      <h3 className="font-medium">Will I get a certificate upon completion?</h3>
                      <p className="text-muted-foreground mt-1">
                        Yes, upon successfully completing all course modules and assignments, you'll receive a certificate of completion.
                      </p>
                    </div>
                    <div>
                      <h3 className="font-medium">How long do I have access to the course?</h3>
                      <p className="text-muted-foreground mt-1">
                        Once enrolled, you have lifetime access to the course content, including any future updates.
                      </p>
                    </div>
                  </div>
                </Card>
              </TabsContent>
              
              <TabsContent value="announcements" className="mt-6">
                <Card className="p-6">
                  <h2 className="text-xl font-semibold mb-4">Course Announcements</h2>
                  {/* Course announcements can be added here */}
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium">Course Update: New Advanced Techniques Module</h3>
                        <span className="text-xs text-muted-foreground">1 week ago</span>
                      </div>
                      <p className="text-muted-foreground mt-1">
                        We've added a new module covering advanced Figma techniques, including the latest features from Figma Config 2023.
                      </p>
                    </div>
                    <div>
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium">Live Q&A Session Next Week</h3>
                        <span className="text-xs text-muted-foreground">2 weeks ago</span>
                      </div>
                      <p className="text-muted-foreground mt-1">
                        Join us for a live Q&A session with Crystal Lucas on Friday, April 18th at 2 PM EST. Bring your Figma questions!
                      </p>
                    </div>
                  </div>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
        
        {/* Course Content Sidebar */}
        <div className="lg:col-span-1">
          <Card className="p-6 sticky top-6">
            <h2 className="text-xl font-semibold mb-4">Course content</h2>
            
            <div className="space-y-2 max-h-[600px] overflow-y-auto pr-2">
              {sections.map((section) => (
                <div key={section.id} className="border rounded-lg">
                  <div 
                    className="p-3 flex items-center justify-between cursor-pointer hover:bg-accent/50"
                    onClick={() => toggleSection(section.id)}
                  >
                    <div className="flex items-center gap-1">
                      <span className="font-medium">{section.title}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-sm text-muted-foreground">{section.duration}</span>
                      {section.expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    </div>
                  </div>
                  
                  {section.expanded && (
                    <div className="border-t">
                      {section.lessons.map((lesson) => (
                        <div 
                          key={lesson.id}
                          className="p-3 hover:bg-accent/20 flex items-center gap-3 cursor-pointer"
                        >
                          <PlayCircle className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
                          <div className="flex flex-1 items-center justify-between">
                            <span className={`text-sm ${lesson.isCompleted ? "line-through text-muted-foreground" : ""}`}>
                              {lesson.title}
                            </span>
                            <span className="text-xs text-muted-foreground">{lesson.duration}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
            
            <div className="mt-6">
              <Button className="w-full" size="lg">
                Continue Learning
              </Button>
              <div className="mt-4 text-center">
                <Button variant="link" className="text-muted-foreground text-sm">
                  Share Course
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;
