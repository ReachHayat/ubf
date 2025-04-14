
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Mail, Calendar, Briefcase, BookOpen, Star, Clock } from "lucide-react";

export interface UserProfile {
  id: string;
  name: string;
  email?: string;
  avatar?: string;
  role?: string;
  bio?: string;
  joinedDate?: string;
  website?: string;
  company?: string;
  position?: string;
  skills?: string[];
  coursesCompleted?: number;
  coursesInProgress?: number;
  averageRating?: number;
  totalHoursLearned?: number;
}

interface UserProfilePreviewProps {
  userId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function UserProfilePreview({ userId, open, onOpenChange }: UserProfilePreviewProps) {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (open && userId) {
      setLoading(true);
      // In a real app, fetch user data from API/database
      // For now, we'll use mock data
      setTimeout(() => {
        const mockUser = mockUsers.find(user => user.id === userId) || getMockUser(userId);
        setProfile(mockUser);
        setLoading(false);
      }, 500);
    }
  }, [userId, open]);

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  // Generate a mock user if ID is not found in our mock data
  const getMockUser = (id: string): UserProfile => {
    return {
      id,
      name: `User ${id.substring(0, 4)}`,
      role: "Student",
      bio: "This is a generated mock profile for demonstration purposes.",
      joinedDate: "2024-01-15",
      coursesCompleted: Math.floor(Math.random() * 5),
      coursesInProgress: Math.floor(Math.random() * 3) + 1,
      averageRating: 4.0 + Math.random(),
      totalHoursLearned: Math.floor(Math.random() * 100) + 10
    };
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>User Profile</DialogTitle>
        </DialogHeader>

        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : profile ? (
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
              <Avatar className="h-24 w-24">
                {profile.avatar ? (
                  <AvatarImage src={profile.avatar} alt={profile.name} />
                ) : (
                  <AvatarFallback className="text-2xl">{getInitials(profile.name)}</AvatarFallback>
                )}
              </Avatar>

              <div className="flex-1 text-center md:text-left">
                <h2 className="text-2xl font-bold">{profile.name}</h2>
                <p className="text-muted-foreground">{profile.role || "Student"}</p>
                
                <div className="flex flex-wrap gap-2 mt-2 justify-center md:justify-start">
                  {profile.email && (
                    <Badge variant="secondary" className="flex gap-1 items-center">
                      <Mail className="h-3 w-3" />
                      {profile.email}
                    </Badge>
                  )}
                  
                  {profile.joinedDate && (
                    <Badge variant="outline" className="flex gap-1 items-center">
                      <Calendar className="h-3 w-3" />
                      Joined {new Date(profile.joinedDate).toLocaleDateString()}
                    </Badge>
                  )}
                  
                  {profile.position && profile.company && (
                    <Badge variant="outline" className="flex gap-1 items-center">
                      <Briefcase className="h-3 w-3" />
                      {profile.position} at {profile.company}
                    </Badge>
                  )}
                </div>
                
                {profile.bio && (
                  <p className="mt-4 text-sm text-muted-foreground">{profile.bio}</p>
                )}
                
                {profile.website && (
                  <Button variant="link" className="p-0 h-auto mt-1" asChild>
                    <a href={profile.website} target="_blank" rel="noreferrer">
                      Visit Website
                    </a>
                  </Button>
                )}
              </div>
            </div>

            {profile.skills && profile.skills.length > 0 && (
              <div className="space-y-2">
                <h3 className="text-lg font-semibold">Skills</h3>
                <div className="flex flex-wrap gap-1">
                  {profile.skills.map((skill, index) => (
                    <Badge key={index} variant="secondary">{skill}</Badge>
                  ))}
                </div>
              </div>
            )}

            <div className="space-y-2">
              <h3 className="text-lg font-semibold">Learning Statistics</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="p-4 flex flex-col items-center justify-center">
                    <BookOpen className="h-8 w-8 text-primary mb-2" />
                    <div className="text-2xl font-bold">{profile.coursesCompleted || 0}</div>
                    <p className="text-xs text-muted-foreground">Courses Completed</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 flex flex-col items-center justify-center">
                    <BookOpen className="h-8 w-8 text-amber-500 mb-2" />
                    <div className="text-2xl font-bold">{profile.coursesInProgress || 0}</div>
                    <p className="text-xs text-muted-foreground">In Progress</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 flex flex-col items-center justify-center">
                    <Star className="h-8 w-8 text-yellow-500 mb-2" />
                    <div className="text-2xl font-bold">
                      {profile.averageRating ? profile.averageRating.toFixed(1) : "N/A"}
                    </div>
                    <p className="text-xs text-muted-foreground">Average Rating</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 flex flex-col items-center justify-center">
                    <Clock className="h-8 w-8 text-green-500 mb-2" />
                    <div className="text-2xl font-bold">{profile.totalHoursLearned || 0}</div>
                    <p className="text-xs text-muted-foreground">Hours Learned</p>
                  </CardContent>
                </Card>
              </div>
            </div>

            <div className="flex justify-end">
              <Button onClick={() => onOpenChange(false)}>Close</Button>
            </div>
          </div>
        ) : (
          <div className="py-8 text-center">
            <p>User profile not found.</p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

// Mock data for testing
const mockUsers: UserProfile[] = [
  {
    id: "1",
    name: "John Doe",
    email: "john.doe@example.com",
    role: "Instructor",
    bio: "Experienced marketing professional with 10+ years in brand strategy and development. I help businesses build memorable brands that connect with their target audiences.",
    joinedDate: "2023-05-12",
    website: "https://johndoe.com",
    company: "Brand Masters Agency",
    position: "Senior Brand Strategist",
    skills: ["Brand Strategy", "Marketing", "Digital Advertising", "Content Strategy"],
    coursesCompleted: 8,
    coursesInProgress: 2,
    averageRating: 4.8,
    totalHoursLearned: 120
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane.smith@example.com",
    role: "Designer",
    bio: "Award-winning graphic designer with a passion for creating beautiful, functional brand identities and visual systems.",
    joinedDate: "2023-07-23",
    company: "Creative Studio X",
    position: "Art Director",
    skills: ["Visual Design", "Brand Identity", "Typography", "Color Theory"],
    coursesCompleted: 12,
    coursesInProgress: 1,
    averageRating: 4.9,
    totalHoursLearned: 180
  }
];
