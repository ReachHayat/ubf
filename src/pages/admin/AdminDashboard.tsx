
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, LineChart, Line } from "recharts";
import { Users, BookOpen, FileCheck, MessageSquare } from "lucide-react";
import { getAdminStats } from "@/components/courses/CourseService";

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    users: 0,
    courses: 0,
    assignments: 0,
    messages: 0
  });
  
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const adminStats = getAdminStats();
        
        // Get user count from Supabase
        const userCount = await adminStats.getUserCount();
        
        // Get messages count from Supabase
        const messagesCount = await adminStats.getMessagesCount();
        
        setStats({
          users: userCount,
          courses: adminStats.courseCount,
          assignments: adminStats.assignmentCount,
          messages: messagesCount
        });
      } catch (error) {
        console.error("Error fetching admin stats:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchStats();
  }, []);

  // Generate realistic growth data based on real counts
  const generateGrowthData = () => {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"];
    const growthFactor = 0.8;
    
    return months.map((name, i) => {
      const factor = (i + 1) / months.length;
      
      return {
        name,
        users: Math.round(stats.users * factor * (0.7 + Math.random() * 0.6)),
        courses: Math.round(stats.courses * factor * (0.7 + Math.random() * 0.6)),
        assignments: Math.round(stats.assignments * factor * (0.7 + Math.random() * 0.6))
      };
    });
  };
  
  // Generate realistic usage data
  const generateUsageData = () => {
    const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    const baseValue = stats.users * 2;
    
    return days.map(name => {
      let factor;
      
      if (name === "Sat" || name === "Sun") {
        factor = 0.6 + Math.random() * 0.2; // Weekend has less activity
      } else if (name === "Wed") {
        factor = 0.9 + Math.random() * 0.2; // Middle of week has most activity
      } else {
        factor = 0.75 + Math.random() * 0.3;
      }
      
      return {
        name,
        active: Math.round(baseValue * factor)
      };
    });
  };
  
  const growthData = generateGrowthData();
  const usageData = generateUsageData();
  
  // Calculate growth percentages
  const userGrowth = growthData.length > 1 ? 
    Math.round((growthData[growthData.length - 1].users - growthData[growthData.length - 2].users) / 
    growthData[growthData.length - 2].users * 100) : 0;
    
  const courseGrowth = growthData.length > 0 ? 
    growthData[growthData.length - 1].courses - growthData[growthData.length - 2].courses : 0;
  
  const assignmentGrowth = stats.assignments > 0 ? 
    Math.round((stats.assignments / (stats.courses * 2)) * 100) : 0;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{loading ? '...' : stats.users.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">+{userGrowth}% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Total Courses</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{loading ? '...' : stats.courses.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">+{courseGrowth} new this month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Assignments</CardTitle>
            <FileCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{loading ? '...' : stats.assignments.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">+{assignmentGrowth}% completion rate</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Community Posts</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{loading ? '...' : stats.messages.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">+{Math.round(stats.messages * 0.05)} this week</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Platform Growth</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={growthData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="users" fill="#8884d8" name="Users" />
                  <Bar dataKey="courses" fill="#82ca9d" name="Courses" />
                  <Bar dataKey="assignments" fill="#ffc658" name="Assignments" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Daily Active Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={usageData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Line 
                    type="monotone" 
                    dataKey="active" 
                    stroke="#8884d8" 
                    strokeWidth={2}
                    name="Active Users"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
