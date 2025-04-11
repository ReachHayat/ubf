import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
  Pencil,
  Medal,
  Trophy,
  Target,
  Zap,
  Star,
  Save
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

const profileFormSchema = z.object({
  full_name: z.string().min(2, "Name must be at least 2 characters.").optional(),
  bio: z.string().optional(),
  location: z.string().optional(),
  github: z.string().optional(),
  linkedin: z.string().optional(),
  twitter: z.string().optional(),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

const defaultUserProfile = {
  bio: "Frontend developer passionate about creating beautiful user experiences. Currently improving my Angular and React skills.",
  location: "San Francisco, CA",
  joinDate: "January 2024",
  socialLinks: {
    github: "github.com/username",
    linkedin: "linkedin.com/in/username",
    twitter: "twitter.com/username"
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
  achievements: [
    {
      id: 1,
      title: "Perfect Score",
      description: "Achieved 100% on an assignment",
      icon: <Award />,
      color: "bg-yellow-500",
      date: "April 2, 2024",
      unlocked: true
    },
    {
      id: 2,
      title: "Fast Learner",
      description: "Completed 5 lessons in a day",
      icon: <Zap />,
      color: "bg-blue-500",
      date: "March 28, 2024",
      unlocked: true
    },
    {
      id: 3,
      title: "Code Maestro",
      description: "Submitted 10 perfect assignments",
      icon: <Trophy />,
      color: "bg-purple-500",
      date: null,
      progress: 4,
      total: 10,
      unlocked: false
    },
    {
      id: 4,
      title: "Helping Hand",
      description: "Answered 25 questions in the community",
      icon: <Target />,
      color: "bg-green-500",
      date: null,
      progress: 12,
      total: 25,
      unlocked: false
    },
    {
      id: 5,
      title: "Course Champion",
      description: "Completed all courses in a category",
      icon: <Medal />,
      color: "bg-orange-500",
      date: null,
      unlocked: false
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
  const { user, updateUserProfile } = useAuth();
  const [editMode, setEditMode] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const userProfile = {
    ...defaultUserProfile,
    name: user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User',
    username: user?.email?.split('@')[0] || 'username',
    email: user?.email || 'email@example.com',
    avatar: user?.user_metadata?.full_name ? user?.user_metadata?.full_name.split(' ').map((n: string) => n[0]).join('').toUpperCase().substring(0, 2) : 'US',
  };

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      full_name: user?.user_metadata?.full_name || '',
      bio: defaultUserProfile.bio,
      location: defaultUserProfile.location,
      github: defaultUserProfile.socialLinks.github,
      linkedin: defaultUserProfile.socialLinks.linkedin,
      twitter: defaultUserProfile.socialLinks.twitter,
    },
  });

  useEffect(() => {
    if (user) {
      form.setValue('full_name', user.user_metadata?.full_name || '');
    }
  }, [user, form]);

  const onSubmit = async (data: ProfileFormValues) => {
    setIsSubmitting(true);
    
    try {
      await updateUserProfile({
        full_name: data.full_name
      });
      setEditMode(false);
    } catch (error) {
      console.error("Error updating profile:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-4xl font-bold">Profile</h1>
        <p className="text-muted-foreground">Manage your personal information and track your progress</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="p-6 lg:col-span-1">
          <div className="flex flex-col items-center text-center mb-6">
            <div className="relative">
              <Avatar className="h-24 w-24 mb-4">
                <AvatarFallback className="text-2xl">{userProfile.avatar}</AvatarFallback>
              </Avatar>
              <Button 
                variant="outline" 
                size="icon" 
                className="absolute bottom-0 right-0 rounded-full h-8 w-8"
                onClick={() => setEditMode(!editMode)}
              >
                <Pencil className="h-4 w-4" />
              </Button>
            </div>
            <h2 className="text-xl font-bold">{userProfile.name}</h2>
            <p className="text-muted-foreground">@{userProfile.username}</p>
            {!editMode && (
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={() => setEditMode(true)}
              >
                Edit Profile
              </Button>
            )}
          </div>
          
          {editMode ? (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="full_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Your full name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="bio"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Bio</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Tell us about yourself" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Location</FormLabel>
                      <FormControl>
                        <Input placeholder="Your location" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="pt-4 flex gap-2">
                  <Button 
                    type="submit" 
                    className="flex-1"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>Saving...</>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        Save Changes
                      </>
                    )}
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setEditMode(false)}
                    disabled={isSubmitting}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </Form>
          ) : (
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
            </div>
          )}
        </Card>

        <div className="lg:col-span-2 space-y-6">
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

          <Tabs defaultValue="skills">
            <TabsList className="mb-4">
              <TabsTrigger value="skills">Skills</TabsTrigger>
              <TabsTrigger value="certificates">Certificates</TabsTrigger>
              <TabsTrigger value="achievements">Achievements</TabsTrigger>
              <TabsTrigger value="activity">Recent Activity</TabsTrigger>
            </TabsList>
            
            <TabsContent value="skills">
              <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">My Skills</h3>
                  <Button variant="outline" size="sm">
                    Add Skill
                  </Button>
                </div>
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
            
            <TabsContent value="achievements">
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">Achievements</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {userProfile.achievements.map((achievement) => (
                    <div 
                      key={achievement.id} 
                      className={`p-4 border rounded-lg ${!achievement.unlocked ? "opacity-70" : ""}`}
                    >
                      <div className="flex items-start gap-4">
                        <div className={`p-3 rounded-full ${achievement.color} text-white`}>
                          {achievement.icon}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h4 className="font-medium">{achievement.title}</h4>
                            {achievement.unlocked && <Badge>Unlocked</Badge>}
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">{achievement.description}</p>
                          
                          {achievement.unlocked && achievement.date && (
                            <p className="text-xs text-muted-foreground mt-2">Achieved on {achievement.date}</p>
                          )}
                          
                          {!achievement.unlocked && achievement.progress !== undefined && (
                            <div className="mt-2">
                              <div className="flex justify-between text-xs text-muted-foreground mb-1">
                                <span>Progress</span>
                                <span>{achievement.progress}/{achievement.total}</span>
                              </div>
                              <Progress value={(achievement.progress / achievement.total) * 100} className="h-1" />
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
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
