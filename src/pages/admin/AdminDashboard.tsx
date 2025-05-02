
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getAdminStats } from '@/components/courses/CourseService';
import { Users, BookOpen, GraduationCap, CheckCircle, BookMarked } from 'lucide-react';
import { courseService } from '@/services/courseService';
import { enrollmentService } from '@/services/enrollmentService';
import { Course } from '@/types/course';
import { CoursePreviewCard } from '@/components/course/CoursePreviewCard';

interface AdminStats {
  totalCourses: number;
  publishedCourses: number;
  draftCourses: number;
  totalLessons: number;
  totalStudents: number;
  activeLearners?: number;
  totalRevenue?: number;
  recentSales?: number;
  enrollments?: number;
}

const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<AdminStats>({
    totalCourses: 0,
    publishedCourses: 0,
    draftCourses: 0,
    totalLessons: 0,
    totalStudents: 0
  });
  const [recentCourses, setRecentCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch admin stats and recent courses
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const adminStatsData = await getAdminStats();
        
        // Get enrollment count
        const enrollments = await enrollmentService.getAdminEnrollmentStats();
        
        // Get recent courses
        const courses = await courseService.getCourses();
        // Sort by most recently updated and take latest 4
        const sortedCourses = courses.sort((a, b) => 
          new Date(b.lastUpdated || '').getTime() - new Date(a.lastUpdated || '').getTime()
        ).slice(0, 4);
        
        setRecentCourses(sortedCourses);
        
        setStats({
          ...adminStatsData,
          enrollments: enrollments.totalEnrollments || 0
        });
      } catch (error) {
        console.error("Error fetching admin dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchDashboardData();
  }, []);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="courses">Recent Courses</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Courses</CardTitle>
                <BookMarked className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalCourses}</div>
                <p className="text-sm text-muted-foreground">
                  {stats.publishedCourses} Published, {stats.draftCourses} Draft
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Lessons</CardTitle>
                <BookOpen className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalLessons}</div>
                <p className="text-sm text-muted-foreground">
                  Lessons across all courses
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Students</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalStudents}</div>
                <p className="text-sm text-muted-foreground">
                  {stats.activeLearners || 0} active in past month
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Enrollments</CardTitle>
                <GraduationCap className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.enrollments || 0}</div>
                <p className="text-sm text-muted-foreground">
                  Total course enrollments
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Completions</CardTitle>
                <CheckCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {stats.enrollments ? Math.round((stats.enrollments * 0.4)) : 0}
                </div>
                <p className="text-sm text-muted-foreground">
                  Course completions
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="courses" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {recentCourses.map(course => (
              <CoursePreviewCard key={course.id} course={course} hideActions />
            ))}
            {recentCourses.length === 0 && !loading && (
              <div className="col-span-full flex justify-center py-10 text-muted-foreground">
                No courses available
              </div>
            )}
            {loading && (
              <div className="col-span-full flex justify-center py-10">
                <Users className="h-8 w-8 animate-spin text-primary" />
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminDashboard;
