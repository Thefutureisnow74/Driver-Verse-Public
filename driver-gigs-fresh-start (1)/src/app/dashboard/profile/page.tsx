"use client";

import { useState } from "react";
import { 
  User, 
  Edit3, 
  Lock, 
  Target,
  FileText,
  Heart,
  Phone,
  Shield
} from "lucide-react";
import { useUser } from "@/hooks/use-user";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardAction } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import UserProfileModal from "@/components/user-profile-modal";
import LicenseCertifications from "@/components/license-certifications";
import MedicalCertifications from "@/components/medical-certifications";
import ContactInformation from "@/components/contact-information";
import SecuritySettings from "@/components/security-settings";

function formatJoinDate(isoString: string): string {
  const date = new Date(isoString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long'
  });
}

function ProfileSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header Skeleton */}
      <div className="space-y-2">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-96" />
      </div>

      {/* Profile Overview Skeleton */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <Skeleton className="size-20 rounded-full" />
            <div className="space-y-2 flex-1">
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-4 w-20" />
            </div>
            <Skeleton className="h-9 w-24" />
          </div>
        </CardHeader>
      </Card>

      {/* Tabs Skeleton */}
      <div className="space-y-4">
        <Skeleton className="h-9 w-full" />
        <Skeleton className="h-32 w-full" />
      </div>
    </div>
  );
}

export default function ProfilePage() {
  const { profile: user, isLoading, error } = useUser();
  const [activeTab, setActiveTab] = useState("personal-info");
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  if (isLoading) {
    return <ProfileSkeleton />;
  }

  if (error || !user) {
    return (
      <div className="space-y-6">
        <div className="space-y-2">
          <h1 className="text-2xl font-bold">User Profile</h1>
          <p className="text-muted-foreground">Failed to load profile data</p>
        </div>
      </div>
    );
  }

  const userInitials = user.name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  const handleMedicalCertsClick = () => {
    setActiveTab("medical-certs");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <User className="size-6" />
          <h1 className="text-2xl font-bold">User Profile</h1>
        </div>
        <p className="text-muted-foreground">
          Manage your personal information and account settings
        </p>
      </div>

      {/* Profile Overview - Mobile Responsive */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
            <Avatar className="size-16 sm:size-20">
              {user.image && (
                <AvatarImage 
                  src={user.image} 
                  alt={user.name}
                  className="object-cover"
                />
              )}
              <AvatarFallback className="bg-primary text-primary-foreground text-lg">
                {userInitials}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1 space-y-1 text-center sm:text-left">
              <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3">
                <h2 className="text-lg sm:text-xl font-semibold">{user.name}</h2>
                <Badge variant="secondary" className="bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300">
                  Free
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground break-all">{user.email}</p>
              <p className="text-sm text-muted-foreground">
                Member since {formatJoinDate(user.createdAt.toString())}
              </p>
            </div>

            <CardAction className="w-full sm:w-auto">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setIsProfileModalOpen(true)}
                className="w-full sm:w-auto"
              >
                <Edit3 className="size-4" />
                <span className="sm:inline">Edit Profile</span>
              </Button>
            </CardAction>
          </div>
        </CardHeader>
      </Card>

      {/* Tabs - Mobile Responsive */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 h-auto gap-1">
          <TabsTrigger value="personal-info" className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 p-2 sm:p-3">
            <User className="size-4" />
            <span className="text-xs sm:text-sm text-center">
              <span className="sm:hidden">Personal</span>
              <span className="hidden sm:inline">Personal Info</span>
            </span>
          </TabsTrigger>
          <TabsTrigger value="license-certs" className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 p-2 sm:p-3">
            <FileText className="size-4" />
            <span className="text-xs sm:text-sm text-center">
              <span className="sm:hidden">License</span>
              <span className="hidden sm:inline">License & Certs</span>
            </span>
          </TabsTrigger>
          <TabsTrigger 
            value="medical-certs" 
            className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 p-2 sm:p-3"
            onClick={handleMedicalCertsClick}
          >
            <Heart className="size-4" />
            <span className="text-xs sm:text-sm text-center">
              <span className="sm:hidden">Medical</span>
              <span className="hidden sm:inline">Medical Certs</span>
            </span>
          </TabsTrigger>
          <TabsTrigger value="contact" className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 p-2 sm:p-3">
            <Phone className="size-4" />
            <span className="text-xs sm:text-sm text-center">Contact</span>
          </TabsTrigger>
          <TabsTrigger value="security" className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 p-2 sm:p-3">
            <Shield className="size-4" />
            <span className="text-xs sm:text-sm text-center">Security</span>
          </TabsTrigger>
        </TabsList>

        {/* Personal Info Tab */}
        <TabsContent value="personal-info">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Personal Information</CardTitle>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setIsProfileModalOpen(true)}
                >
                  <Edit3 className="size-4" />
                  Edit Information
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                Manage your personal details and preferences here.
              </p>
              
              {/* Display job preferences if available */}
              {user.jobPreferences ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium text-sm text-muted-foreground">Primary Goal</h4>
                      <p className="text-sm">
                        {user.jobPreferences.primaryGoal === 'full-time-income' && 'Full-time income replacement'}
                        {user.jobPreferences.primaryGoal === 'part-time-supplemental' && 'Part-time supplemental income'}
                        {user.jobPreferences.primaryGoal === 'flexible-schedule' && 'Flexible schedule control'}
                        {user.jobPreferences.primaryGoal === 'experience-industries' && 'Experience different industries'}
                      </p>
                    </div>
                    <div>
                      <h4 className="font-medium text-sm text-muted-foreground">Target Income</h4>
                      <p className="text-sm">
                        {user.jobPreferences.targetIncome === '500-1500' && '$500 - $1,500/month'}
                        {user.jobPreferences.targetIncome === '1500-3000' && '$1,500 - $3,000/month'}
                        {user.jobPreferences.targetIncome === '3000-5000' && '$3,000 - $5,000/month'}
                        {user.jobPreferences.targetIncome === '5000-plus' && '$5,000+/month'}
                      </p>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-sm text-muted-foreground">Interested Industries</h4>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {user.jobPreferences.interestedIndustries?.map((industry: string) => (
                        <Badge key={industry} variant="secondary" className="text-xs">
                          {industry.replace('-', ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-sm text-muted-foreground">Available Vehicles</h4>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {user.jobPreferences.availableVehicles?.map((vehicle: string) => (
                        <Badge key={vehicle} variant="outline" className="text-xs">
                          {vehicle.replace('-', ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-sm text-muted-foreground">Travel Distance</h4>
                    <p className="text-sm">
                      {user.jobPreferences.travelDistance === 'local' && 'Local only (within 15 miles)'}
                      {user.jobPreferences.travelDistance === 'regional' && 'Regional (15-50 miles)'}
                      {user.jobPreferences.travelDistance === 'long-distance' && 'Long distance (50+ miles)'}
                      {user.jobPreferences.travelDistance === 'flexible' && 'Flexible/Variable distance'}
                    </p>
                  </div>
                </div>
              ) : (
                /* Goals & Objectives Questionnaire */
                <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg">
                  <Target className="size-5 text-primary" />
                  <div>
                    <h4 className="font-medium">Goals & Objectives Questionnaire</h4>
                    <p className="text-sm text-muted-foreground">
                      Help us understand your goals and preferences to provide personalized recommendations.
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* License & Certs Tab */}
        <TabsContent value="license-certs">
          <LicenseCertifications onUploadComplete={() => {
            // Optionally refresh data or show success message
          }} />
        </TabsContent>

        {/* Medical Certs Tab */}
        <TabsContent value="medical-certs">
          <MedicalCertifications onUploadComplete={() => {
            // Optionally refresh data or show success message
          }} />
        </TabsContent>

        {/* Contact Tab */}
        <TabsContent value="contact">
          <ContactInformation onUpdateComplete={() => {
            // Optionally refresh data or show success message
          }} />
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security">
          <SecuritySettings onUpdateComplete={() => {
            // Optionally refresh data or show success message
          }} />
        </TabsContent>
      </Tabs>

      {/* Profile Modal */}
      <UserProfileModal 
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
      />
    </div>
  );
}