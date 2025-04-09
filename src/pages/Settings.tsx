
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { 
  Bell, 
  Moon, 
  Globe, 
  Lock, 
  User, 
  Mail,
  ShieldCheck,
  SaveIcon,
  Smartphone,
  BookOpen,
  Eye,
  Volume2,
  Clock
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

const Settings = () => {
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
                  <Input id="fullName" defaultValue="John Doe" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <Input id="username" defaultValue="johndoe" />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input id="email" type="email" defaultValue="john.doe@example.com" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input id="location" defaultValue="San Francisco, CA" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  defaultValue="Frontend developer passionate about creating beautiful user experiences. Currently improving my Angular and React skills."
                  className="min-h-24"
                />
              </div>
              
              <div className="space-y-2">
                <Label>Social Profiles</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <Github className="h-5 w-5" />
                    <Input defaultValue="github.com/johndoe" />
                  </div>
                  <div className="flex items-center gap-2">
                    <Linkedin className="h-5 w-5" />
                    <Input defaultValue="linkedin.com/in/johndoe" />
                  </div>
                  <div className="flex items-center gap-2">
                    <Twitter className="h-5 w-5" />
                    <Input defaultValue="twitter.com/johndoe" />
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

// Fix for missing imports from the code above
const Github = () => <div className="h-5 w-5"></div>;
const Twitter = () => <div className="h-5 w-5"></div>;
const Linkedin = () => <div className="h-5 w-5"></div>;
const MessageSquare = () => <div className="h-5 w-5"></div>;

export default Settings;
