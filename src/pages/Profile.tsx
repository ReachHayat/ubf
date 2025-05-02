
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { InstructorProfileForm } from "@/components/instructor/InstructorProfileForm";
import { UserProfilePreview } from "@/components/profile/UserProfilePreview";
import { useAuth } from "@/contexts/AuthContext";

const Profile: React.FC = () => {
  const { user, roles } = useAuth();
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Profile Settings</h1>
      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="profile">User Profile</TabsTrigger>
          {(roles.includes('admin') || roles.includes('tutor')) && (
            <TabsTrigger value="instructor">Instructor Profile</TabsTrigger>
          )}
        </TabsList>
        <TabsContent value="profile">
          <UserProfilePreview 
            userId={user?.id || ''} 
            open={isProfileOpen} 
            onOpenChange={setIsProfileOpen} 
          />
        </TabsContent>
        {(roles.includes('admin') || roles.includes('tutor')) && (
          <TabsContent value="instructor">
            <InstructorProfileForm />
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
};

export default Profile;
