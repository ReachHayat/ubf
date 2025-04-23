
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BarChart, 
  Calendar, 
  GraduationCap, 
  Users 
} from "lucide-react";
import { getAdminStats } from "@/components/courses/CourseService";
import { getRecentCourses } from "@/services/courseService";
import { Course } from "@/types/course";

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalCourses: 0,
    publishedCourses: 0,
    draftCourses: 0,
    totalLessons: 0,
    totalStudents: 0
  });
  
  const [recentCourses, setRecentCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      
      try {
        // Get statistics
        const adminStats = getAdminStats();
        setStats(adminStats);
        
        // Get recent courses
        const courses = await getRecentCourses();
        setRecentCourses(courses);
      } catch (error) {
        console.error("Error fetching admin data:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <p className="text-muted-foreground">Overview of your learning platform</p>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Courses</CardTitle>
            <GraduationCap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalCourses}</div>
            <p className="text-xs text-muted-foreground">
              {stats.publishedCourses} published, {stats.draftCourses} drafts
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Lessons</CardTitle>
            <BarChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalLessons}</div>
            <p className="text-xs text-muted-foreground">
              Across all courses
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Enrolled Students</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalStudents}</div>
            <p className="text-xs text-muted-foreground">
              Active learners on the platform
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Last Updated</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Date().toLocaleDateString()}
            </div>
            <p className="text-xs text-muted-foreground">
              Platform statistics
            </p>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="courses">
        <TabsList>
          <TabsTrigger value="courses">Recent Courses</TabsTrigger>
          <TabsTrigger value="students">Recent Students</TabsTrigger>
        </TabsList>
        <TabsContent value="courses" className="mt-6">
          {loading ? (
            <div className="flex items-center justify-center h-40">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {recentCourses.slice(0, 6).map((course) => (
                <Card key={course.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-4">
                      <div className={`h-12 w-12 rounded-lg flex items-center justify-center ${course.bgColor || 'bg-blue-500'}`}>
                        <span className="text-lg font-bold text-white">{course.logo || course.title.charAt(0)}</span>
                      </div>
                      <div className="space-y-1">
                        <h3 className="font-medium truncate">{course.title}</h3>
                        <p className="text-xs text-muted-foreground">
                          {course.status === 'published' ? 'Published' : 'Draft'} • Last updated: {course.lastUpdated || 'N/A'}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
        <TabsContent value="students" className="mt-6">
          <Card>
            <CardContent className="p-6">
              <p className="text-center text-muted-foreground">Student enrollment data will be displayed here.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminDashboard;
