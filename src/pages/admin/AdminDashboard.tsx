
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getAdminStats } from '@/components/courses/CourseService';
import { Users, BookOpen, GraduationCap } from 'lucide-react';

interface AdminStats {
  totalCourses: number;
  publishedCourses: number;
  draftCourses: number;
  totalLessons: number;
  totalStudents: number;
  activeLearners?: number;
  totalRevenue?: number;
  recentSales?: number;
}

const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<AdminStats>({
    totalCourses: 0,
    publishedCourses: 0,
    draftCourses: 0,
    totalLessons: 0,
    totalStudents: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch admin stats
    const fetchAdminStats = async () => {
      try {
        const adminStatsData = await getAdminStats();
        setStats({
          totalCourses: adminStatsData.totalCourses || 0,
          publishedCourses: adminStatsData.publishedCourses || 0,
          draftCourses: adminStatsData.draftCourses || 0,
          totalLessons: adminStatsData.totalLessons || 0,
          totalStudents: adminStatsData.totalStudents || 0,
          activeLearners: adminStatsData.activeLearners,
          recentSales: adminStatsData.recentSales
        });
      } catch (error) {
        console.error("Error fetching admin stats:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchAdminStats();
  }, []);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          {/* Add more tabs here if needed */}
        </TabsList>
        <TabsContent value="overview" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Courses</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
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
                  Lessons available across all courses
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Students</CardTitle>
                <GraduationCap className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalStudents}</div>
                <p className="text-sm text-muted-foreground">
                  Students enrolled in all courses
                </p>
              </CardContent>
            </Card>
            {/* Add more cards for other stats as needed */}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default AdminDashboard;
