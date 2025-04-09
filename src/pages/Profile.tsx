
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  User, 
  Mail, 
  Calendar,
  BookOpen,
  Award,
  Clock,
  GraduationCap,
  MapPin,
  Github,
  Linkedin,
  Twitter,
  ExternalLink,
  Pencil
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const userProfile = {
  name: "John Doe",
  username: "johndoe",
  email: "john.doe@example.com",
  avatar: "JD",
  location: "San Francisco, CA",
  joinDate: "January 2024",
  bio: "Frontend developer passionate about creating beautiful user experiences. Currently improving my Angular and React skills.",
  socialLinks: {
    github: "github.com/johndoe",
    linkedin: "linkedin.com/in/johndoe",
    twitter: "twitter.com/johndoe"
  },
  stats: {
    coursesCompleted: 3,
    coursesInProgress: 2,
    certificatesEarned: 1,
    totalHoursLearned: 48
  },
  skills: [
    { name: "JavaScript", level: 85 },
    { name: "HTML/CSS", level: 90 },
    { name: "React", level: 75 },
    { name: "Angular", level: 60 },
    { name: "Node.js", level: 50 }
  ],
  certificates: [
    {
      id: 1,
      title: "Frontend Web Development",
      issueDate: "March 2024",
      issuer: "CodeLingo"
    }
  ],
  recentActivity: [
    { id: 1, type: "course-progress", title: "Completed Module 3 of Angular.js Fundamentals", date: "2 days ago" },
    { id: 2, type: "assignment", title: "Submitted assignment 'Build an Angular Todo App'", date: "5 days ago" },
    { id: 3, type: "achievement", title: "Earned 'Perfect Score' achievement", date: "1 week ago" },
    { id: 4, type: "certificate", title: "Earned Frontend Web Development Certificate", date: "2 weeks ago" }
  ]
};

const Profile = () => {
  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-4xl font-bold">Profile</h1>
        <p className="text-muted-foreground">Manage your personal information and track your progress</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Info Card */}
        <Card className="p-6 lg:col-span-1">
          <div className="flex flex-col items-center text-center mb-6">
            <div className="relative">
              <Avatar className="h-24 w-24 mb-4">
                <AvatarFallback className="text-2xl">{userProfile.avatar}</AvatarFallback>
              </Avatar>
              <Button variant="outline" size="icon" className="absolute bottom-0 right-0 rounded-full h-8 w-8">
                <Pencil className="h-4 w-4" />
              </Button>
            </div>
            <h2 className="text-xl font-bold">{userProfile.name}</h2>
            <p className="text-muted-foreground">@{userProfile.username}</p>
            <Button variant="outline" className="mt-4">Edit Profile</Button>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Mail className="h-5 w-5 text-muted-foreground" />
              <span>{userProfile.email}</span>
            </div>
            <div className="flex items-center gap-3">
              <MapPin className="h-5 w-5 text-muted-foreground" />
              <span>{userProfile.location}</span>
            </div>
            <div className="flex items-center gap-3">
              <Calendar className="h-5 w-5 text-muted-foreground" />
              <span>Joined {userProfile.joinDate}</span>
            </div>
          </div>
          
          <div className="mt-6">
            <h3 className="text-sm font-medium mb-2">About</h3>
            <p className="text-sm text-muted-foreground">{userProfile.bio}</p>
          </div>
          
          <div className="mt-6">
            <h3 className="text-sm font-medium mb-2">Connect</h3>
            <div className="flex gap-2">
              <Button variant="outline" size="icon" className="rounded-full">
                <Github className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" className="rounded-full">
                <Linkedin className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" className="rounded-full">
                <Twitter className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </Card>

        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="p-4">
              <div className="flex flex-col items-center text-center">
                <div className="p-2 rounded-full bg-primary/10 mb-2">
                  <BookOpen className="h-5 w-5 text-primary" />
                </div>
                <span className="text-2xl font-bold">{userProfile.stats.coursesCompleted}</span>
                <span className="text-xs text-muted-foreground">Courses Completed</span>
              </div>
            </Card>
            <Card className="p-4">
              <div className="flex flex-col items-center text-center">
                <div className="p-2 rounded-full bg-primary/10 mb-2">
                  <Clock className="h-5 w-5 text-primary" />
                </div>
                <span className="text-2xl font-bold">{userProfile.stats.coursesInProgress}</span>
                <span className="text-xs text-muted-foreground">In Progress</span>
              </div>
            </Card>
            <Card className="p-4">
              <div className="flex flex-col items-center text-center">
                <div className="p-2 rounded-full bg-primary/10 mb-2">
                  <Award className="h-5 w-5 text-primary" />
                </div>
                <span className="text-2xl font-bold">{userProfile.stats.certificatesEarned}</span>
                <span className="text-xs text-muted-foreground">Certificates</span>
              </div>
            </Card>
            <Card className="p-4">
              <div className="flex flex-col items-center text-center">
                <div className="p-2 rounded-full bg-primary/10 mb-2">
                  <Clock className="h-5 w-5 text-primary" />
                </div>
                <span className="text-2xl font-bold">{userProfile.stats.totalHoursLearned}h</span>
                <span className="text-xs text-muted-foreground">Hours Learned</span>
              </div>
            </Card>
          </div>

          {/* Tabs for Skills, Certificates, Activity */}
          <Tabs defaultValue="skills">
            <TabsList className="mb-4">
              <TabsTrigger value="skills">Skills</TabsTrigger>
              <TabsTrigger value="certificates">Certificates</TabsTrigger>
              <TabsTrigger value="activity">Recent Activity</TabsTrigger>
            </TabsList>
            
            <TabsContent value="skills">
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">My Skills</h3>
                <div className="space-y-6">
                  {userProfile.skills.map((skill, index) => (
                    <div key={index}>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium">{skill.name}</span>
                        <span className="text-sm text-muted-foreground">{skill.level}%</span>
                      </div>
                      <Progress value={skill.level} className="h-2" />
                    </div>
                  ))}
                </div>
              </Card>
            </TabsContent>
            
            <TabsContent value="certificates">
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">Certificates</h3>
                {userProfile.certificates.length > 0 ? (
                  <div className="space-y-4">
                    {userProfile.certificates.map((certificate) => (
                      <div key={certificate.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-4">
                          <div className="p-2 rounded-full bg-green-500/10">
                            <GraduationCap className="h-6 w-6 text-green-500" />
                          </div>
                          <div>
                            <h4 className="font-medium">{certificate.title}</h4>
                            <p className="text-sm text-muted-foreground">
                              Issued by {certificate.issuer} • {certificate.issueDate}
                            </p>
                          </div>
                        </div>
                        <Button variant="outline" size="sm" className="flex items-center gap-1">
                          View
                          <ExternalLink className="h-3 w-3 ml-1" />
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-10">
                    <GraduationCap className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h4 className="text-lg font-medium">No Certificates Yet</h4>
                    <p className="text-muted-foreground mt-1">Complete courses to earn certificates</p>
                    <Button variant="outline" className="mt-4">Browse Courses</Button>
                  </div>
                )}
              </Card>
            </TabsContent>
            
            <TabsContent value="activity">
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
                <div className="space-y-4">
                  {userProfile.recentActivity.map((activity) => {
                    let Icon;
                    let color;
                    
                    switch(activity.type) {
                      case "course-progress":
                        Icon = BookOpen;
                        color = "text-blue-500";
                        break;
                      case "assignment":
                        Icon = Clock;
                        color = "text-yellow-500";
                        break;
                      case "achievement":
                        Icon = Award;
                        color = "text-orange-500";
                        break;
                      case "certificate":
                        Icon = GraduationCap;
                        color = "text-green-500";
                        break;
                      default:
                        Icon = BookOpen;
                        color = "text-primary";
                    }
                    
                    return (
                      <div key={activity.id} className="flex gap-3">
                        <div className="p-2 rounded-full bg-accent h-fit">
                          <Icon className={`h-4 w-4 ${color}`} />
                        </div>
                        <div>
                          <p className="font-medium">{activity.title}</p>
                          <p className="text-sm text-muted-foreground">{activity.date}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Profile;
