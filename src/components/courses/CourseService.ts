import { Course, CourseSection, CourseLesson, CourseAssignment, CourseQuiz } from "@/types/course";
import { supabase } from "@/integrations/supabase/client";

// Local storage keys
const COURSES_STORAGE_KEY = "ubf_courses";
const ENROLLED_COURSES_KEY = "ubf_enrolled_courses";
const WATCHED_VIDEOS_KEY = "ubf_watched_videos";

// Get courses from localStorage or return default
export const getCourses = (): Course[] => {
  const storedCourses = localStorage.getItem(COURSES_STORAGE_KEY);
  return storedCourses ? JSON.parse(storedCourses) : mockCourses;
};

// Save courses to localStorage
export const saveCourses = (courses: Course[]): void => {
  localStorage.setItem(COURSES_STORAGE_KEY, JSON.stringify(courses));
};

// Get course by ID
export const getCourseById = (id: string): Course | undefined => {
  const courses = getCourses();
  return courses.find(course => course.id === id);
};

// Filter and sort courses
export const filterAndSortCourses = (
  courses: Course[],
  searchQuery: string = "",
  category: string = "All Categories",
  sortOption: string = "Most Popular"
): Course[] => {
  let filteredCourses = [...courses];
  
  // Filter by search query
  if (searchQuery) {
    filteredCourses = filteredCourses.filter(course => 
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.instructor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.category.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }
  
  // Filter by category
  if (category !== "All Categories") {
    filteredCourses = filteredCourses.filter(course => course.category === category);
  }
  
  // Sort courses
  switch (sortOption) {
    case "Most Popular":
      filteredCourses.sort((a, b) => (b.reviews || 0) - (a.reviews || 0));
      break;
    case "Highest Rated":
      filteredCourses.sort((a, b) => (b.rating || 0) - (a.rating || 0));
      break;
    case "Newest":
      filteredCourses.sort((a, b) => {
        const dateA = a.lastUpdated ? new Date(a.lastUpdated) : new Date(0);
        const dateB = b.lastUpdated ? new Date(b.lastUpdated) : new Date(0);
        return dateB.getTime() - dateA.getTime();
      });
      break;
    case "Oldest":
      filteredCourses.sort((a, b) => {
        const dateA = a.lastUpdated ? new Date(a.lastUpdated) : new Date(0);
        const dateB = b.lastUpdated ? new Date(b.lastUpdated) : new Date(0);
        return dateA.getTime() - dateB.getTime();
      });
      break;
    case "Price Low to High":
      filteredCourses.sort((a, b) => (a.price || 0) - (b.price || 0));
      break;
    case "Price High to Low":
      filteredCourses.sort((a, b) => (b.price || 0) - (a.price || 0));
      break;
  }
  
  return filteredCourses;
};

// Get all available categories
export const getAllCategories = (): string[] => {
  const courses = getCourses();
  const categories = ["All Categories", ...new Set(courses.map(course => course.category))];
  return categories;
};

// Update course by ID
export const updateCourse = (updatedCourse: Course): void => {
  const courses = getCourses();
  const index = courses.findIndex(course => course.id === updatedCourse.id);
  
  if (index !== -1) {
    courses[index] = updatedCourse;
    saveCourses(courses);
  }
};

// Add new course
export const addCourse = (course: Course): Course => {
  const courses = getCourses();
  const newCourse = {
    ...course,
    id: course.id || Math.random().toString(36).substring(2, 9),
    lastUpdated: new Date().toISOString().split('T')[0]
  };
  
  courses.push(newCourse);
  saveCourses(courses);
  return newCourse;
};

// Delete course by ID
export const deleteCourse = (id: string): void => {
  const courses = getCourses();
  const filteredCourses = courses.filter(course => course.id !== id);
  saveCourses(filteredCourses);
  
  // Also remove from enrolled courses if present
  const enrolledIds = getEnrolledCourseIds();
  if (enrolledIds.includes(id)) {
    setEnrolledCourseIds(enrolledIds.filter(courseId => courseId !== id));
  }
};

// Get enrolled course IDs
export const getEnrolledCourseIds = (): string[] => {
  const storedIds = localStorage.getItem(ENROLLED_COURSES_KEY);
  return storedIds ? JSON.parse(storedIds) : [];
};

// Set enrolled course IDs
export const setEnrolledCourseIds = (ids: string[]): void => {
  localStorage.setItem(ENROLLED_COURSES_KEY, JSON.stringify(ids));
};

// Get enrolled courses
export const getEnrolledCourses = (): Course[] => {
  const enrolledIds = getEnrolledCourseIds();
  const allCourses = getCourses();
  return allCourses.filter(course => enrolledIds.includes(course.id));
};

// Track watched videos
export const markVideoAsWatched = (courseId: string, lessonId: string): void => {
  const watchedVideos = getWatchedVideos();
  if (!watchedVideos[courseId]) {
    watchedVideos[courseId] = [];
  }
  
  if (!watchedVideos[courseId].includes(lessonId)) {
    watchedVideos[courseId].push(lessonId);
    setWatchedVideos(watchedVideos);
    
    // Update course progress
    const course = getCourseById(courseId);
    if (course && course.sections) {
      let totalLessons = 0;
      let completedLessons = 0;
      
      course.sections.forEach(section => {
        section.lessons.forEach(lesson => {
          totalLessons++;
          if (watchedVideos[courseId].includes(lesson.id)) {
            completedLessons++;
            // Update lesson completion status
            lesson.isCompleted = true;
          }
        });
      });
      
      const progress = Math.round((completedLessons / totalLessons) * 100);
      
      updateCourse({
        ...course,
        progress,
        hoursCompleted: (course.totalHours * progress) / 100
      });
    }
  }
};

// Check if video is watched
export const isVideoWatched = (courseId: string, lessonId: string): boolean => {
  const watchedVideos = getWatchedVideos();
  return watchedVideos[courseId] && watchedVideos[courseId].includes(lessonId);
};

// Get all watched videos
export const getWatchedVideos = (): Record<string, string[]> => {
  const storedVideos = localStorage.getItem(WATCHED_VIDEOS_KEY);
  return storedVideos ? JSON.parse(storedVideos) : {};
};

// Set watched videos
export const setWatchedVideos = (videos: Record<string, string[]>): void => {
  localStorage.setItem(WATCHED_VIDEOS_KEY, JSON.stringify(videos));
};

// Enroll in a course
export const enrollInCourse = (courseId: string): void => {
  const enrolledIds = getEnrolledCourseIds();
  if (!enrolledIds.includes(courseId)) {
    enrolledIds.push(courseId);
    setEnrolledCourseIds(enrolledIds);
    
    // Update the course to mark it as enrolled
    const course = getCourseById(courseId);
    if (course) {
      updateCourse({
        ...course,
        enrolled: true,
        progress: 0,
        hoursCompleted: 0
      });
    }
  }
};

// Unenroll from a course
export const unenrollFromCourse = (courseId: string): void => {
  const enrolledIds = getEnrolledCourseIds();
  setEnrolledCourseIds(enrolledIds.filter(id => id !== courseId));
  
  // Update the course to mark it as not enrolled
  const course = getCourseById(courseId);
  if (course) {
    const { enrolled, progress, hoursCompleted, ...courseWithoutEnrollmentData } = course;
    updateCourse({
      ...courseWithoutEnrollmentData,
      enrolled: false
    });
  }
};

// Share course
export const shareCourse = (courseId: string): void => {
  const url = `${window.location.origin}/courses/${courseId}`;
  navigator.clipboard.writeText(url)
    .catch(err => console.error('Could not copy URL: ', err));
};

// Update course section
export const updateCourseSection = (courseId: string, section: CourseSection): void => {
  const course = getCourseById(courseId);
  if (course && course.sections) {
    const index = course.sections.findIndex(s => s.id === section.id);
    
    if (index !== -1) {
      // Update existing section
      course.sections[index] = section;
    } else {
      // Add new section
      course.sections.push(section);
    }
    
    updateCourse(course);
  }
};

// Delete course section
export const deleteCourseSection = (courseId: string, sectionId: string): void => {
  const course = getCourseById(courseId);
  if (course && course.sections) {
    course.sections = course.sections.filter(section => section.id !== sectionId);
    updateCourse(course);
  }
};

// Update course lesson
export const updateCourseLesson = (
  courseId: string, 
  sectionId: string, 
  lesson: CourseLesson
): void => {
  const course = getCourseById(courseId);
  if (course && course.sections) {
    const sectionIndex = course.sections.findIndex(s => s.id === sectionId);
    
    if (sectionIndex !== -1) {
      const lessonIndex = course.sections[sectionIndex].lessons.findIndex(l => l.id === lesson.id);
      
      if (lessonIndex !== -1) {
        // Update existing lesson
        course.sections[sectionIndex].lessons[lessonIndex] = lesson;
      } else {
        // Add new lesson
        course.sections[sectionIndex].lessons.push(lesson);
      }
      
      updateCourse(course);
    }
  }
};

// Delete course lesson
export const deleteCourseLesson = (
  courseId: string, 
  sectionId: string, 
  lessonId: string
): void => {
  const course = getCourseById(courseId);
  if (course && course.sections) {
    const sectionIndex = course.sections.findIndex(s => s.id === sectionId);
    
    if (sectionIndex !== -1) {
      course.sections[sectionIndex].lessons = course.sections[sectionIndex].lessons.filter(
        lesson => lesson.id !== lessonId
      );
      
      updateCourse(course);
    }
  }
};

// Update course assignment
export const updateCourseAssignment = (
  courseId: string,
  assignment: CourseAssignment
): void => {
  const course = getCourseById(courseId);
  if (course) {
    if (!course.assignments) {
      course.assignments = [];
    }
    
    const index = course.assignments.findIndex(a => a.id === assignment.id);
    
    if (index !== -1) {
      // Update existing assignment
      course.assignments[index] = assignment;
    } else {
      // Add new assignment
      course.assignments.push(assignment);
    }
    
    updateCourse(course);
  }
};

// Delete course assignment
export const deleteCourseAssignment = (courseId: string, assignmentId: string): void => {
  const course = getCourseById(courseId);
  if (course && course.assignments) {
    course.assignments = course.assignments.filter(assignment => assignment.id !== assignmentId);
    updateCourse(course);
  }
};

// Get stats for admin dashboard
export const getAdminStats = () => {
  const courses = getCourses();
  const enrolledCourses = getEnrolledCourses();
  
  // Count total assignments across all courses
  const totalAssignments = courses.reduce((total, course) => {
    return total + (course.assignments?.length || 0);
  }, 0);
  
  // Get users from Supabase (if available)
  const getUserCount = async () => {
    try {
      const { count } = await supabase
        .from('users')
        .select('id', { count: 'exact' });
      
      return count || 0;
    } catch (error) {
      console.error("Error fetching user count:", error);
      return 0;
    }
  };
  
  // Get messages count (community posts)
  const getMessagesCount = async () => {
    try {
      const { count } = await supabase
        .from('messages')
        .select('id', { count: 'exact' });
      
      return count || 0;
    } catch (error) {
      console.error("Error fetching messages count:", error);
      return 0;
    }
  };
  
  return {
    courseCount: courses.length,
    assignmentCount: totalAssignments,
    enrollmentCount: enrolledCourses.length,
    getUserCount,
    getMessagesCount
  };
};

// Mock data
export const mockCourses: Course[] = [
  {
    id: "1",
    title: "The Brand Strategy Masterclass",
    category: "Marketing",
    instructor: {
      id: "i1",
      name: "John Doe",
      role: "Instructor",
      avatar: "JD"
    },
    description: "Learn how to create and implement effective brand strategies that drive business growth.",
    thumbnail: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80",
    rating: 4.8,
    reviews: 124,
    totalHours: 4.5,
    status: "published",
    lastUpdated: "2024-03-15",
    tags: ["branding", "marketing", "strategy"],
    logo: "B",
    bgColor: "bg-blue-500",
    price: 49.99,
    sections: [
      {
        id: "s1",
        title: "01: Introduction to Brand Strategy",
        duration: "55min",
        expanded: true,
        lessons: [
          { id: "l1", title: "Welcome to the Course", duration: "5 min", isCompleted: false },
          { id: "l2", title: "What is Brand Strategy?", duration: "15 min", isCompleted: false },
          { id: "l3", title: "The Importance of Brand Positioning", duration: "20 min", isCompleted: false },
          { id: "l4", title: "Brand Strategy Framework", duration: "15 min", isCompleted: false }
        ]
      },
      {
        id: "s2",
        title: "02: Brand Research & Analysis",
        duration: "1h 10min",
        expanded: false,
        lessons: [
          { id: "l5", title: "Market Research Techniques", duration: "25 min", isCompleted: false },
          { id: "l6", title: "Competitor Analysis", duration: "20 min", isCompleted: false },
          { id: "l7", title: "Customer Insight Research", duration: "25 min", isCompleted: false }
        ]
      },
      {
        id: "s3",
        title: "03: Brand Positioning",
        duration: "1h 25min",
        expanded: false,
        lessons: [
          { id: "l8", title: "Defining Your Brand Position", duration: "30 min", isCompleted: false },
          { id: "l9", title: "Creating a Unique Value Proposition", duration: "25 min", isCompleted: false },
          { id: "l10", title: "Brand Positioning Statement Workshop", duration: "30 min", isCompleted: false }
        ]
      },
      {
        id: "s4",
        title: "04: Brand Messaging Strategy",
        duration: "50min",
        expanded: false,
        lessons: [
          { id: "l11", title: "Core Brand Messaging", duration: "20 min", isCompleted: false },
          { id: "l12", title: "Creating Your Brand Voice", duration: "15 min", isCompleted: false },
          { id: "l13", title: "Brand Messaging Framework", duration: "15 min", isCompleted: false }
        ]
      }
    ],
    assignments: [
      {
        id: "a1",
        title: "Brand Strategy Analysis",
        description: "Analyze a brand of your choice using the framework discussed in the course.",
        dueDate: "2024-05-01",
        status: "pending"
      },
      {
        id: "a2",
        title: "Create Your Brand Positioning Statement",
        description: "Based on the lectures, create a compelling brand positioning statement for your business or personal brand.",
        dueDate: "2024-05-15",
        status: "pending"
      }
    ],
    quizzes: [
      {
        id: "q1",
        title: "Brand Strategy Fundamentals",
        description: "Test your knowledge of brand strategy concepts.",
        timeLimit: 15,
        status: "not_started",
        questions: [
          {
            id: "qu1",
            question: "What is the primary purpose of brand positioning?",
            type: "multiple_choice",
            options: [
              "To increase sales immediately",
              "To establish a unique place in the mind of the customer",
              "To create a logo",
              "To hire more employees"
            ],
            correctAnswer: "To establish a unique place in the mind of the customer"
          },
          {
            id: "qu2",
            question: "A strong brand strategy helps with customer retention.",
            type: "true_false",
            options: ["True", "False"],
            correctAnswer: "True"
          }
        ]
      }
    ]
  },
  {
    id: "2",
    title: "Brand Identity Design Essentials",
    category: "Design",
    instructor: {
      id: "i2",
      name: "Jane Smith",
      role: "Designer",
      avatar: "JS"
    },
    description: "Master the fundamentals of brand identity design, from logos to visual systems.",
    thumbnail: "https://images.unsplash.com/photo-1626785774573-4b799315345d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1471&q=80",
    rating: 4.5,
    reviews: 86,
    totalHours: 5.2,
    status: "published",
    lastUpdated: "2024-02-22",
    tags: ["design", "branding", "identity"],
    logo: "D",
    bgColor: "bg-purple-500",
    price: 59.99
  },
  {
    id: "3",
    title: "Brand Storytelling Workshop",
    category: "Communication",
    instructor: {
      id: "i3",
      name: "Robert Johnson",
      role: "Communication Expert",
      avatar: "RJ"
    },
    description: "Learn how to craft compelling brand stories that connect with your audience.",
    thumbnail: "https://images.unsplash.com/photo-1553877522-43269d4ea984?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
    rating: 4.7,
    reviews: 54,
    totalHours: 3.5,
    status: "published",
    lastUpdated: "2024-03-10",
    tags: ["storytelling", "communication", "content"],
    logo: "S",
    bgColor: "bg-yellow-500",
    price: 39.99
  },
  {
    id: "4",
    title: "Digital Brand Management",
    category: "Marketing",
    instructor: {
      id: "i4",
      name: "Emily Wilson",
      role: "Digital Marketer",
      avatar: "EW"
    },
    description: "Learn strategies for managing and growing your brand in the digital landscape.",
    thumbnail: "https://images.unsplash.com/photo-1557804506-669a67965ba0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1374&q=80",
    totalHours: 6.0,
    status: "draft",
    lastUpdated: "2024-04-02",
    tags: ["digital", "management", "social media"],
    logo: "D",
    bgColor: "bg-green-500",
    price: 79.99
  }
];

// Initialize storage with mock data if not already done
if (!localStorage.getItem(COURSES_STORAGE_KEY)) {
  saveCourses(mockCourses);
}

if (!localStorage.getItem(ENROLLED_COURSES_KEY)) {
  // Default to the first course being enrolled
  setEnrolledCourseIds(["1"]);
}

// Update user's notes for a specific lesson
export const updateUserNotes = async (userId: string, lessonId: string, courseId: string, noteContent: string): Promise<void> => {
  try {
    if (!userId) {
      console.error("User ID is required to update notes");
      return;
    }
    
    // Check if note already exists
    const { data: existingNotes, error: fetchError } = await supabase
      .from('notes')
      .select('id')
      .eq('user_id', userId)
      .eq('lesson_id', lessonId)
      .eq('course_id', courseId);
      
    if (fetchError) throw fetchError;
    
    if (existingNotes && existingNotes.length > 0) {
      // Update existing note
      const { error: updateError } = await supabase
        .from('notes')
        .update({
          content: noteContent,
          updated_at: new Date().toISOString()
        })
        .eq('id', existingNotes[0].id);
        
      if (updateError) throw updateError;
    } else {
      // Create new note
      const { error: insertError } = await supabase
        .from('notes')
        .insert({
          user_id: userId,
          lesson_id: lessonId,
          course_id: courseId,
          content: noteContent
        });
        
      if (insertError) throw insertError;
    }
    
    // Also update localStorage for offline access
    const notesKey = `user-notes-${userId}`;
    const userNotes = JSON.parse(localStorage.getItem(notesKey) || "{}");
    
    userNotes[lessonId] = {
      content: noteContent,
      updatedAt: new Date().toISOString(),
    };
    
    localStorage.setItem(notesKey, JSON.stringify(userNotes));
  } catch (error) {
    console.error("Error updating user notes:", error);
  }
};

// Get user notes for a specific lesson
export const getUserNotes = async (userId: string, lessonId: string, courseId: string): Promise<string> => {
  try {
    if (!userId) {
      return "";
    }
    
    const { data, error } = await supabase
      .from('notes')
      .select('content')
      .eq('user_id', userId)
      .eq('lesson_id', lessonId)
      .eq('course_id', courseId)
      .single();
    
    if (error && error.code !== 'PGRST116') { // PGRST116 is "no rows returned" error
      throw error;
    }
    
    if (data) {
      return data.content;
    }
    
    // Fallback to localStorage if not found in DB
    const notesKey = `user-notes-${userId}`;
    const userNotes = JSON.parse(localStorage.getItem(notesKey) || "{}");
    return userNotes[lessonId]?.content || "";
    
  } catch (error) {
    console.error("Error getting user notes:", error);
    return "";
  }
};

// Get all user notes
export const getAllUserNotes = async (userId: string): Promise<{ lessonId: string, courseId: string, content: string, updatedAt: string }[]> => {
  try {
    if (!userId) {
      return [];
    }
    
    const { data, error } = await supabase
      .from('notes')
      .select('lesson_id, course_id, content, updated_at')
      .eq('user_id', userId)
      .order('updated_at', { ascending: false });
    
    if (error) throw error;
    
    if (data && data.length > 0) {
      return data.map(note => ({
        lessonId: note.lesson_id,
        courseId: note.course_id,
        content: note.content,
        updatedAt: note.updated_at
      }));
    }
    
    // Fallback to localStorage if not found in DB
    const notesKey = `user-notes-${userId}`;
    const userNotes = JSON.parse(localStorage.getItem(notesKey) || "{}");
    
    return Object.entries(userNotes).map(([lessonId, noteData]: [string, any]) => ({
      lessonId,
      courseId: "", // Not available in localStorage version
      content: noteData.content,
      updatedAt: noteData.updatedAt
    }));
    
  } catch (error) {
    console.error("Error getting all user notes:", error);
    return [];
  }
};

// Check if course is bookmarked
export const isCourseSaved = async (userId: string, courseId: string): Promise<boolean> => {
  try {
    if (!userId) {
      return false;
    }
    
    const { data, error } = await supabase
      .from('bookmarks')
      .select('id')
      .eq('user_id', userId)
      .eq('content_id', courseId)
      .eq('content_type', 'course')
      .single();
    
    if (error && error.code !== 'PGRST116') {
      throw error;
    }
    
    return !!data;
  } catch (error) {
    console.error("Error checking if course is bookmarked:", error);
    return false;
  }
};

// Toggle course bookmark
export const toggleCourseSaved = async (userId: string, course: Course): Promise<boolean> => {
  try {
    if (!userId) {
      return false;
    }
    
    // Check if already bookmarked
    const { data: existingBookmark, error: checkError } = await supabase
      .from('bookmarks')
      .select('id')
      .eq('user_id', userId)
      .eq('content_id', course.id)
      .eq('content_type', 'course');
    
    if (checkError) throw checkError;
    
    if (existingBookmark && existingBookmark.length > 0) {
      // Remove bookmark
      const { error: deleteError } = await supabase
        .from('bookmarks')
        .delete()
        .eq('id', existingBookmark[0].id);
      
      if (deleteError) throw deleteError;
      return false; // Not bookmarked anymore
    } else {
      // Add bookmark
      const { error: insertError } = await supabase
        .from('bookmarks')
        .insert({
          user_id: userId,
          content_id: course.id,
          content_type: 'course',
          title: course.title,
          description: course.description,
          thumbnail: course.thumbnail
        });
      
      if (insertError) throw insertError;
      return true; // Bookmarked
    }
  } catch (error) {
    console.error("Error toggling course bookmark:", error);
    return false;
  }
};

// Toggle lesson bookmark
export const toggleLessonSaved = async (
  userId: string, 
  courseId: string, 
  lessonId: string,
  title: string,
  thumbnail?: string
): Promise<boolean> => {
  try {
    if (!userId) {
      return false;
    }
    
    // Check if already bookmarked
    const { data: existingBookmark, error: checkError } = await supabase
      .from('bookmarks')
      .select('id')
      .eq('user_id', userId)
      .eq('content_id', lessonId)
      .eq('content_type', 'lesson');
    
    if (checkError) throw checkError;
    
    if (existingBookmark && existingBookmark.length > 0) {
      // Remove bookmark
      const { error: deleteError } = await supabase
        .from('bookmarks')
        .delete()
        .eq('id', existingBookmark[0].id);
      
      if (deleteError) throw deleteError;
      return false; // Not bookmarked anymore
    } else {
      // Add bookmark
      const { error: insertError } = await supabase
        .from('bookmarks')
        .insert({
          user_id: userId,
          content_id: lessonId,
          content_type: 'lesson',
          title: title,
          description: `Course: ${getCourseById(courseId)?.title || courseId}`,
          thumbnail: thumbnail
        });
      
      if (insertError) throw insertError;
      return true; // Bookmarked
    }
  } catch (error) {
    console.error("Error toggling lesson bookmark:", error);
    return false;
  }
};

// Check if lesson is bookmarked
export const isLessonSaved = async (userId: string, lessonId: string): Promise<boolean> => {
  try {
    if (!userId) {
      return false;
    }
    
    const { data, error } = await supabase
      .from('bookmarks')
      .select('id')
      .eq('user_id', userId)
      .eq('content_id', lessonId)
      .eq('content_type', 'lesson')
      .single();
    
    if (error && error.code !== 'PGRST116') {
      throw error;
    }
    
    return !!data;
  } catch (error) {
    console.error("Error checking if lesson is bookmarked:", error);
    return false;
  }
};
