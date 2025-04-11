import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { 
  Bell, 
  Moon, 
  Globe, 
  Lock, 
  User, 
  Mail,
  ShieldCheck,
  Save as SaveIcon,
  Smartphone,
  BookOpen,
  Eye,
  Volume2,
  Clock,
  Github,
  Twitter,
  Linkedin,
  MessageSquare,
  UserCog
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ThemeToggle } from "@/components/theme-toggle";
import { updateUserRole } from "@/services/userService";

const Settings = () => {
  const { user, roles, updateUserProfile } = useAuth();
  const [fullName, setFullName] = useState("");
  const [location, setLocation] = useState("San Francisco, CA");
  const [bio, setBio] = useState("");
  const [saving, setSaving] = useState(false);
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<string>("");

  useEffect(() => {
    if (user) {
      setFullName(user.user_metadata?.full_name || "");
      setEmail(user.email || "");
      if (roles && roles.length > 0) {
        setRole(roles[0]);
      }
    }
  }, [user, roles]);

  const handleSaveProfile = async () => {
    if (!user) return;

    setSaving(true);
    try {
      await updateUserProfile({
        full_name: fullName
      });

      toast({
        title: "Profile updated",
        description: "Your profile information has been updated successfully."
      });
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        title: "Update failed",
        description: "There was a problem updating your profile.",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  const handleRoleChange = async (newRole: string) => {
    if (!user) return;
    
    try {
      const success = await updateUserRole(user.id, newRole as "admin" | "tutor" | "student");
      if (success) {
        setRole(newRole);
        toast({
          title: "Role updated",
          description: `Your role has been updated to ${newRole}.`
        });
      }
    } catch (error) {
      console.error("Error updating role:", error);
      toast({
        title: "Role update failed",
        description: "There was a problem updating your role.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-4xl font-bold">Settings</h1>
        <p className="text-muted-foreground">Customize your account preferences</p>
      </header>

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="roles">Roles</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
        </TabsList>
        
        <TabsContent value="profile">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-6">Profile Settings</h2>
            
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input 
                    id="fullName" 
                    value={fullName} 
                    onChange={(e) => setFullName(e.target.value)} 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input id="email" type="email" value={email} disabled />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input 
                  id="location" 
                  value={location} 
                  onChange={(e) => setLocation(e.target.value)} 
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="min-h-24"
                />
              </div>
              
              <div className="space-y-2">
                <Label>Social Profiles</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <Github className="h-5 w-5" />
                    <Input defaultValue="github.com/username" />
                  </div>
                  <div className="flex items-center gap-2">
                    <Linkedin className="h-5 w-5" />
                    <Input defaultValue="linkedin.com/in/username" />
                  </div>
                  <div className="flex items-center gap-2">
                    <Twitter className="h-5 w-5" />
                    <Input defaultValue="twitter.com/username" />
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end">
                <Button 
                  className="flex items-center gap-2" 
                  onClick={handleSaveProfile}
                  disabled={saving}
                >
                  <SaveIcon className="h-4 w-4" />
                  {saving ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </div>
          </Card>
        </TabsContent>
        
        <TabsContent value="account">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-6">Account Settings</h2>
            
            <div className="space-y-8">
              <div>
                <h3 className="text-lg font-medium mb-4">Password</h3>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="currentPassword">Current Password</Label>
                    <Input id="currentPassword" type="password" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="newPassword">New Password</Label>
                    <Input id="newPassword" type="password" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <Input id="confirmPassword" type="password" />
                  </div>
                  <Button variant="outline">Change Password</Button>
                </div>
              </div>
              
              <div className="border-t pt-6">
                <h3 className="text-lg font-medium mb-4">Two-Factor Authentication</h3>
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="h-5 w-5 text-muted-foreground" />
                      <h4 className="font-medium">Two-Factor Authentication</h4>
                    </div>
                    <p className="text-sm text-muted-foreground">Add an extra layer of security to your account</p>
                  </div>
                  <Switch />
                </div>
              </div>
              
              <div className="border-t pt-6">
                <h3 className="text-lg font-medium mb-4">Danger Zone</h3>
                <div className="bg-red-500/10 p-4 rounded-lg border border-red-500/20">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                      <h4 className="font-medium text-red-500">Delete Account</h4>
                      <p className="text-sm text-muted-foreground">
                        Once you delete your account, there is no going back. Please be certain.
                      </p>
                    </div>
                    <Button variant="destructive">Delete Account</Button>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>
        
        <TabsContent value="roles">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-6">Role Management</h2>
            
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <UserCog className="h-5 w-5 text-muted-foreground" />
                    <h4 className="font-medium">Current Role</h4>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Your current role determines your permissions in the system
                  </p>
                </div>
                
                <Select 
                  value={role} 
                  onValueChange={handleRoleChange}
                  disabled={!user?.email?.includes("admin@example.com")}
                >
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="student">Student</SelectItem>
                    <SelectItem value="tutor">Tutor</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {!user?.email?.includes("admin@example.com") && (
                <div className="bg-yellow-50 p-4 rounded-md border border-yellow-200">
                  <p className="text-sm text-yellow-800">
                    Only admin users can change roles. If you need a role change, please contact an administrator.
                  </p>
                </div>
              )}
              
              <div className="border-t pt-6">
                <h3 className="text-lg font-medium mb-4">Role Permissions</h3>
                
                <div className="space-y-4">
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium">Student</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      Can access and participate in courses, submit assignments, and engage with the community.
                    </p>
                  </div>
                  
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium">Tutor</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      Can create courses, grade assignments, and provide feedback to students.
                    </p>
                  </div>
                  
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium">Admin</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      Has full access to the platform, including user management, configuration, and all other features.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>
        
        <TabsContent value="notifications">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-6">Notification Settings</h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-4">Email Notifications</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <BookOpen className="h-5 w-5 text-muted-foreground" />
                        <h4 className="font-medium">Course Updates</h4>
                      </div>
                      <p className="text-sm text-muted-foreground">Receive notifications about course content updates</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Clock className="h-5 w-5 text-muted-foreground" />
                        <h4 className="font-medium">Assignment Reminders</h4>
                      </div>
                      <p className="text-sm text-muted-foreground">Receive reminders about upcoming assignment deadlines</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <MessageSquare className="h-5 w-5 text-muted-foreground" />
                        <h4 className="font-medium">Community Messages</h4>
                      </div>
                      <p className="text-sm text-muted-foreground">Receive notifications about new messages</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>
              </div>
              
              <div className="border-t pt-6">
                <h3 className="text-lg font-medium mb-4">Push Notifications</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Smartphone className="h-5 w-5 text-muted-foreground" />
                        <h4 className="font-medium">Mobile Notifications</h4>
                      </div>
                      <p className="text-sm text-muted-foreground">Enable push notifications on your mobile device</p>
                    </div>
                    <Switch />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Bell className="h-5 w-5 text-muted-foreground" />
                        <h4 className="font-medium">Browser Notifications</h4>
                      </div>
                      <p className="text-sm text-muted-foreground">Enable desktop notifications in your browser</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end">
                <Button className="flex items-center gap-2">
                  <SaveIcon className="h-4 w-4" />
                  Save Changes
                </Button>
              </div>
            </div>
          </Card>
        </TabsContent>
        
        <TabsContent value="appearance">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-6">Appearance Settings</h2>
            
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Moon className="h-5 w-5 text-muted-foreground" />
                    <h4 className="font-medium">Theme</h4>
                  </div>
                  <p className="text-sm text-muted-foreground">Toggle between light and dark mode</p>
                </div>
                <ThemeToggle />
              </div>
              
              <div className="border-t pt-6">
                <h3 className="text-lg font-medium mb-4">Language</h3>
                <div className="space-y-2">
                  <Label htmlFor="language">Select Language</Label>
                  <Select defaultValue="en-US">
                    <SelectTrigger className="w-full sm:w-72">
                      <SelectValue placeholder="Select Language" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Languages</SelectLabel>
                        <SelectItem value="en-US">English (US)</SelectItem>
                        <SelectItem value="en-GB">English (UK)</SelectItem>
                        <SelectItem value="fr">French</SelectItem>
                        <SelectItem value="de">German</SelectItem>
                        <SelectItem value="es">Spanish</SelectItem>
                        <SelectItem value="ja">Japanese</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="border-t pt-6">
                <h3 className="text-lg font-medium mb-4">Accessibility</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Eye className="h-5 w-5 text-muted-foreground" />
                        <h4 className="font-medium">Reduced Motion</h4>
                      </div>
                      <p className="text-sm text-muted-foreground">Minimize animations throughout the interface</p>
                    </div>
                    <Switch />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Volume2 className="h-5 w-5 text-muted-foreground" />
                        <h4 className="font-medium">Screen Reader Optimizations</h4>
                      </div>
                      <p className="text-sm text-muted-foreground">Improve compatibility with screen readers</p>
                    </div>
                    <Switch />
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end">
                <Button className="flex items-center gap-2">
                  <SaveIcon className="h-4 w-4" />
                  Save Changes
                </Button>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;
