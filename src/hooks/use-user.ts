"use client";

import { useQuery } from "@tanstack/react-query";
import { useSession } from "@/lib/auth-client";

interface JobPreferences {
  id: string;
  userId: string;
  dateOfBirth?: Date | null;
  primaryGoal: string;
  targetIncome: string;
  interestedIndustries: string[];
  availableVehicles: string[];
  travelDistance: string;
  additionalInfo?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

interface UserProfile {
  id: string;
  name: string;
  email: string;
  image?: string | null;
  createdAt: Date;
  updatedAt: Date;
  totalEarnings: number;
  completedGigs: number;
  rating: number;
  // Contact Information
  phoneNumber?: string | null;
  streetAddress?: string | null;
  city?: string | null;
  state?: string | null;
  zipCode?: string | null;
  jobPreferences?: JobPreferences | null;
}

async function fetchUserProfile(): Promise<UserProfile> {
  const response = await fetch('/api/user/profile');
  if (!response.ok) {
    throw new Error('Failed to fetch user profile');
  }
  return response.json();
}

export function useUser() {
  // Get session from Better-Auth
  const { data: session, isPending: isSessionLoading } = useSession();
  
  // Fetch extended user profile data
  const { 
    data: profile, 
    isLoading: isProfileLoading, 
    error 
  } = useQuery({
    queryKey: ['user-profile'],
    queryFn: fetchUserProfile,
    enabled: !!session?.user, // Only fetch if user is authenticated
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  return {
    // Basic auth info from Better-Auth
    session,
    user: session?.user,
    isAuthenticated: !!session?.user,
    
    // Extended profile data
    profile,
    
    // Loading states
    isLoading: isSessionLoading || isProfileLoading,
    isSessionLoading,
    isProfileLoading,
    
    // Error state
    error,
  };
}

// Utility hook for just checking authentication status
export function useAuth() {
  const { data: session, isPending } = useSession();
  
  return {
    user: session?.user,
    isAuthenticated: !!session?.user,
    isLoading: isPending,
    session,
  };
}
