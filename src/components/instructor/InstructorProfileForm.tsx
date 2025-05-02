
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { instructorService, InstructorProfile } from "@/services/instructorService";
import { useAuth } from "@/contexts/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";

export const InstructorProfileForm: React.FC = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Partial<InstructorProfile>>({});
  const { register, handleSubmit, setValue } = useForm<InstructorProfile>();

  useEffect(() => {
    const fetchProfile = async () => {
      if (user) {
        const currentProfile = await instructorService.getInstructorProfile(user.id);
        if (currentProfile) {
          setProfile(currentProfile);
          setValue('bio', currentProfile.bio || '');
          setValue('website', currentProfile.website || '');
          // Convert arrays to string for the form if they exist
          setValue('expertise', currentProfile.expertise ? currentProfile.expertise.join(', ') : '');
          setValue('education', currentProfile.education ? currentProfile.education.join(', ') : '');
        }
      }
    };
    fetchProfile();
  }, [user]);

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const avatarUrl = await instructorService.uploadAvatarImage(file);
      if (avatarUrl) {
        setProfile(prev => ({ ...prev, avatar_url: avatarUrl }));
      }
    }
  };

  const onSubmit = async (data: any) => {
    const profileData = {
      ...data,
      // Convert comma-separated strings back to arrays
      expertise: data.expertise ? data.expertise.split(',').map((e: string) => e.trim()) : [],
      education: data.education ? data.education.split(',').map((e: string) => e.trim()) : []
    };

    const updatedProfile = await instructorService.createOrUpdateInstructorProfile(profileData);
    if (updatedProfile) {
      toast({
        title: "Profile Updated",
        description: "Your instructor profile has been successfully updated"
      });
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <div className="flex flex-col items-center mb-6">
        <Avatar className="w-24 h-24 mb-4">
          <AvatarImage 
            src={profile.avatar_url || user?.user_metadata?.avatar_url} 
            alt="Profile Avatar" 
          />
          <AvatarFallback>{user?.user_metadata?.full_name?.[0] || 'IN'}</AvatarFallback>
        </Avatar>
        <Input 
          type="file" 
          accept="image/*" 
          className="hidden" 
          id="avatar-upload"
          onChange={handleAvatarUpload}
        />
        <Label 
          htmlFor="avatar-upload" 
          className="cursor-pointer text-primary hover:underline"
        >
          Update Avatar
        </Label>
      </div>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <Label>Bio</Label>
          <Textarea 
            {...register('bio')} 
            placeholder="Tell us about yourself" 
          />
        </div>
        <div>
          <Label>Website</Label>
          <Input 
            {...register('website')} 
            placeholder="Your professional website" 
          />
        </div>
        <div>
          <Label>Expertise (comma-separated)</Label>
          <Input 
            {...register('expertise')} 
            placeholder="e.g., Machine Learning, Web Development" 
          />
        </div>
        <div>
          <Label>Education (comma-separated)</Label>
          <Input 
            {...register('education')} 
            placeholder="e.g., PhD Computer Science, Stanford University" 
          />
        </div>
        <Button type="submit" className="w-full">Save Profile</Button>
      </form>
    </div>
  );
};
