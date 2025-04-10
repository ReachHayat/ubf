
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const AdminSettings = () => {
  return (
    <Tabs defaultValue="general">
      <TabsList className="mb-6">
        <TabsTrigger value="general">General</TabsTrigger>
        <TabsTrigger value="branding">Branding</TabsTrigger>
        <TabsTrigger value="email">Email</TabsTrigger>
        <TabsTrigger value="security">Security</TabsTrigger>
      </TabsList>
      
      <TabsContent value="general">
        <Card>
          <CardHeader>
            <CardTitle>Platform Settings</CardTitle>
            <CardDescription>
              Configure general settings for The Ultimate Brand Framework platform
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="site-name">Platform Name</Label>
                <Input id="site-name" defaultValue="The Ultimate Brand Framework" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="site-desc">Description</Label>
                <Input id="site-desc" defaultValue="The most comprehensive brand building platform" />
              </div>
              
              <Separator className="my-6" />
              
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Features</h3>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="public-course-directory">Public Course Directory</Label>
                    <p className="text-sm text-muted-foreground">Allow non-registered users to browse courses</p>
                  </div>
                  <Switch id="public-course-directory" defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="community-forum">Community Forum</Label>
                    <p className="text-sm text-muted-foreground">Enable the community discussion forum</p>
                  </div>
                  <Switch id="community-forum" defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="user-registration">User Registration</Label>
                    <p className="text-sm text-muted-foreground">Allow new user registration</p>
                  </div>
                  <Switch id="user-registration" defaultChecked />
                </div>
              </div>
              
              <Button className="mt-6">Save Changes</Button>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="branding">
        <Card>
          <CardHeader>
            <CardTitle>Branding Settings</CardTitle>
            <CardDescription>
              Customize the look and feel of your platform
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="space-y-2">
                <Label>Logo</Label>
                <div className="flex items-center gap-4">
                  <div className="h-16 w-16 rounded-md bg-primary flex items-center justify-center text-primary-foreground text-lg font-bold">
                    UBF
                  </div>
                  <Button variant="outline">Upload Logo</Button>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Favicon</Label>
                <div className="flex items-center gap-4">
                  <div className="h-8 w-8 rounded-sm bg-primary flex items-center justify-center text-primary-foreground text-xs font-bold">
                    UBF
                  </div>
                  <Button variant="outline">Upload Favicon</Button>
                </div>
              </div>
              
              <Separator className="my-6" />
              
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Colors</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="primary-color">Primary Color</Label>
                    <div className="flex">
                      <Input id="primary-color" defaultValue="#8A2BE2" />
                      <div className="ml-2 h-10 w-10 rounded bg-primary" />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="secondary-color">Secondary Color</Label>
                    <div className="flex">
                      <Input id="secondary-color" defaultValue="#F5F5F5" />
                      <div className="ml-2 h-10 w-10 rounded bg-secondary" />
                    </div>
                  </div>
                </div>
              </div>
              
              <Button className="mt-6">Save Changes</Button>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="email">
        <Card>
          <CardHeader>
            <CardTitle>Email Settings</CardTitle>
            <CardDescription>
              Configure email notifications and templates
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email-from">From Email Address</Label>
                <Input id="email-from" defaultValue="noreply@ultimatebrand.com" />
              </div>
              
              <Separator className="my-6" />
              
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Email Notifications</h3>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="welcome-email">Welcome Email</Label>
                    <p className="text-sm text-muted-foreground">Send welcome email to new users</p>
                  </div>
                  <Switch id="welcome-email" defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="course-completion">Course Completion</Label>
                    <p className="text-sm text-muted-foreground">Send email when user completes a course</p>
                  </div>
                  <Switch id="course-completion" defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="assignment-reminder">Assignment Reminders</Label>
                    <p className="text-sm text-muted-foreground">Send reminders for upcoming assignments</p>
                  </div>
                  <Switch id="assignment-reminder" defaultChecked />
                </div>
              </div>
              
              <Button className="mt-6">Save Changes</Button>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="security">
        <Card>
          <CardHeader>
            <CardTitle>Security Settings</CardTitle>
            <CardDescription>
              Configure security settings for your platform
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="two-factor">Two-Factor Authentication</Label>
                  <p className="text-sm text-muted-foreground">
                    Require two-factor authentication for admin accounts
                  </p>
                </div>
                <Switch id="two-factor" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password-policy">Password Policy</Label>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Switch id="min-length" defaultChecked />
                    <Label htmlFor="min-length">Minimum 8 characters</Label>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Switch id="uppercase" defaultChecked />
                    <Label htmlFor="uppercase">Require uppercase letter</Label>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Switch id="number-symbol" defaultChecked />
                    <Label htmlFor="number-symbol">Require number or symbol</Label>
                  </div>
                </div>
              </div>
              
              <Separator className="my-6" />
              
              <div className="space-y-2">
                <Label htmlFor="session-timeout">Session Timeout (minutes)</Label>
                <Input id="session-timeout" type="number" defaultValue="60" />
              </div>
              
              <Button className="mt-6">Save Changes</Button>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
};

export default AdminSettings;
