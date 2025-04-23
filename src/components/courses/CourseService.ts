// Import statements
import { Course, CourseSection, CourseLesson } from '@/types/course';
import { bookmarkService } from '@/services/bookmarkService';
import { courseNotesService } from '@/services/courseNotesService';

// Start of fixed mock data
const mockCourses: Course[] = [
  {
    id: "1",
    title: "Ultimate Brand Framework",
    category: "Business",
    instructor: {
      id: "101",
      name: "Sarah Johnson",
      role: "Brand Strategist",
      avatar: "/lovable-uploads/e98cd24b-ef7d-485c-b055-e522a1b42a50.png",
    },
    description: "Learn the essential frameworks for building a strong brand identity from the ground up.",
    thumbnail: "/lovable-uploads/225b2ac5-0ee7-49a0-ab7c-8110e42dc865.png",
    rating: 4.8,
    reviews: 243,
    progress: 35,
    hoursCompleted: 2.5,
    totalHours: 12,
    enrolled: true,
    status: "published" as const,
    lastUpdated: "2023-04-15",
    price: 49.99,
    tags: ["branding", "marketing", "business"],
    bgColor: "#FFE4E1",
    sections: [
      {
        id: "s1",
        title: "Introduction to Branding",
        duration: "2h 15m",
        expanded: true,
        lessons: [
          {
            id: "l1",
            title: "What is a Brand?",
            duration: "15m",
            isCompleted: true,
            content: "A brand is more than just a logo or visual identity. It's the entire experience that customers have with your company, product, or service. This includes visual elements, messaging, values, and the emotions your brand evokes.",
            videoUrl: "https://example.com/video1.mp4",
            section_title: "Introduction to Branding"
          },
          {
            id: "l2",
            title: "Brand vs Branding",
            duration: "20m",
            isCompleted: true,
            content: "While a brand is the perception of your company, branding is the process of building and shaping that perception. Branding involves strategic decisions about positioning, messaging, visual identity, and customer experience.",
            videoUrl: "https://example.com/video2.mp4",
            section_title: "Introduction to Branding"
          },
          {
            id: "l3",
            title: "Why Branding Matters",
            duration: "25m",
            isCompleted: false,
            content: "Strong branding builds recognition, trust, and loyalty. It differentiates you from competitors, commands premium pricing, and creates emotional connections with customers. Effective branding also provides internal benefits by guiding company culture and decision-making.",
            videoUrl: "https://example.com/video3.mp4",
            section_title: "Introduction to Branding"
          }
        ]
      },
      {
        id: "s2",
        title: "Brand Strategy Fundamentals",
        duration: "3h 45m",
        expanded: false,
        lessons: [
          {
            id: "l4",
            title: "Brand Purpose and Vision",
            duration: "30m",
            isCompleted: false,
            content: "Your brand purpose is why your brand exists beyond making money. It's the positive impact you aim to have on customers and society. Your brand vision is what you aspire to achieve in the future. Together, they guide your brand's direction and decisions.",
            videoUrl: "https://example.com/video4.mp4",
            section_title: "Brand Strategy Fundamentals"
          },
          {
            id: "l5",
            title: "Target Audience and Personas",
            duration: "45m",
            isCompleted: false,
            content: "Defining your target audience is crucial for effective branding. Create detailed buyer personas that include demographics, psychographics, behaviors, needs, and pain points. Understanding your audience deeply allows you to create more relevant and resonant brand experiences.",
            videoUrl: "https://example.com/video5.mp4",
            section_title: "Brand Strategy Fundamentals"
          }
        ]
      }
    ],
    assignments: [
      {
        id: "a1",
        title: "Brand Audit",
        description: "Conduct a comprehensive audit of an existing brand of your choice. Analyze their visual identity, messaging, positioning, and customer experience. Identify strengths and areas for improvement.",
        dueDate: "2023-05-15",
        status: "pending"
      },
      {
        id: "a2",
        title: "Brand Strategy Document",
        description: "Create a complete brand strategy document for a fictional company. Include purpose, vision, mission, values, positioning, messaging, and target audience personas.",
        dueDate: "2023-06-01",
        status: "pending"
      }
    ],
    quizzes: [
      {
        id: "q1",
        title: "Branding Fundamentals Quiz",
        description: "Test your understanding of basic branding concepts and principles.",
        timeLimit: 15,
        questions: [
          {
            id: "q1-1",
            question: "What is a brand?",
            type: "multiple_choice",
            options: [
              "Just a logo and visual elements",
              "The entire experience customers have with your company",
              "A marketing campaign",
              "A product or service"
            ],
            correctAnswer: "The entire experience customers have with your company"
          },
          {
            id: "q1-2",
            question: "Brand positioning is:",
            type: "multiple_choice",
            options: [
              "Where your logo appears on marketing materials",
              "How your brand is placed on store shelves",
              "How your brand is perceived in relation to competitors",
              "The physical location of your business"
            ],
            correctAnswer: "How your brand is perceived in relation to competitors"
          }
        ],
        status: "not_started"
      }
    ]
  },
  {
    id: "2",
    title: "Digital Marketing Essentials",
    category: "Marketing",
    instructor: {
      id: "102",
      name: "Michael Brown",
      role: "Marketing Director",
      avatar: "/lovable-uploads/e98cd24b-ef7d-485c-b055-e522a1b42a50.png",
    },
    description: "Master the fundamentals of digital marketing including SEO, social media, and content strategy.",
    thumbnail: "/lovable-uploads/225b2ac5-0ee7-49a0-ab7c-8110e42dc865.png",
    rating: 4.6,
    reviews: 189,
    totalHours: 15,
    enrolled: false,
    status: "published" as const,
    lastUpdated: "2023-03-20",
    price: 59.99,
    tags: ["digital marketing", "SEO", "social media"],
    bgColor: "#E6E6FA",
  },
  {
    id: "3",
    title: "Product Photography Masterclass",
    category: "Photography",
    instructor: {
      id: "103",
      name: "Emma Rodriguez",
      role: "Professional Photographer",
      avatar: "/lovable-uploads/e98cd24b-ef7d-485c-b055-e522a1b42a50.png",
    },
    description: "Learn how to capture stunning product photos for your brand or clients using simple equipment.",
    thumbnail: "/lovable-uploads/225b2ac5-0ee7-49a0-ab7c-8110e42dc865.png",
    rating: 4.9,
    reviews: 127,
    totalHours: 8,
    enrolled: false,
    status: "draft" as const,
    lastUpdated: "2023-05-02",
    price: 39.99,
    tags: ["photography", "product", "visual"],
    bgColor: "#F0F8FF",
  }
];

export const getCourses = () => {
  return mockCourses;
};

export const getCourseById = (id: string) => {
  return mockCourses.find(course => course.id === id);
};

export const getEnrolledCourses = () => {
  return mockCourses.filter(course => course.enrolled);
};

export const getLessonById = (courseId: string, lessonId: string) => {
  const course = getCourseById(courseId);
  if (!course || !course.sections) return null;
  
  for (const section of course.sections) {
    const lesson = section.lessons.find(lesson => lesson.id === lessonId);
    if (lesson) return lesson;
  }
  
  return null;
};

export const getNextLesson = (courseId: string, currentLessonId: string) => {
  const course = getCourseById(courseId);
  if (!course || !course.sections) return null;
  
  let foundCurrent = false;
  
  for (const section of course.sections) {
    for (const lesson of section.lessons) {
      if (foundCurrent) {
        return lesson;
      }
      if (lesson.id === currentLessonId) {
        foundCurrent = true;
      }
    }
  }
  
  return null;
};

export const getPreviousLesson = (courseId: string, currentLessonId: string) => {
  const course = getCourseById(courseId);
  if (!course || !course.sections) return null;
  
  let previousLesson = null;
  
  for (const section of course.sections) {
    for (const lesson of section.lessons) {
      if (lesson.id === currentLessonId) {
        return previousLesson;
      }
      previousLesson = lesson;
    }
  }
  
  return null;
};

export const markLessonAsCompleted = (courseId: string, lessonId: string) => {
  // In a real app, this would make an API call to update the database
  console.log(`Marking lesson ${lessonId} as completed for course ${courseId}`);
  return true;
};

export const getCourseSections = (courseId: string) => {
  const course = getCourseById(courseId);
  return course?.sections || [];
};

export const getFirstLesson = (courseId: string) => {
  const course = getCourseById(courseId);
  if (!course || !course.sections || course.sections.length === 0) return null;
  
  const firstSection = course.sections[0];
  if (!firstSection.lessons || firstSection.lessons.length === 0) return null;
  
  return firstSection.lessons[0];
};

export const getUserNotes = async (userId: string, lessonId: string, courseId: string) => {
  return await courseNotesService.getUserNotes(userId, lessonId, courseId);
};

export const saveUserNotes = async (userId: string, lessonId: string, courseId: string, content: string) => {
  return await courseNotesService.updateUserNotes(userId, lessonId, courseId, content);
};

export const getAdminStats = () => {
  return {
    totalCourses: mockCourses.length,
    publishedCourses: mockCourses.filter(c => c.status === 'published').length,
    totalStudents: 239,
    activeLearners: 156,
    totalRevenue: 12580,
    recentSales: 2340
  };
};

export const updateCourseAssignment = (courseId: string, assignmentId: string, data: any) => {
  console.log(`Updating assignment ${assignmentId} in course ${courseId}`);
  return true;
};

export const deleteCourseAssignment = (courseId: string, assignmentId: string) => {
  console.log(`Deleting assignment ${assignmentId} from course ${courseId}`);
  return true;
};

export const getRecentCourses = () => {
  return mockCourses.slice(0, 3);
};
