"use client";

import { 
  User, 
  Settings, 
  CreditCard, 
  HelpCircle, 
  LogOut, 
  Star,
  DollarSign,
  Calendar
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useUser } from "@/hooks/use-user";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { signOut } from "@/lib/auth-client";

interface UserProfile {
  id: string;
  name: string;
  email: string;
  image?: string;
  role: string;
  joinedAt: string;
  stats: {
    totalEarnings: string;
    completedGigs: number;
    rating: number;
  };
}

// Moved to useUser hook

function formatJoinDate(isoString: string): string {
  const date = new Date(isoString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long'
  });
}

function UserProfileSkeleton() {
  return (
    <DropdownMenuContent className="w-80" align="end">
      <DropdownMenuLabel className="pb-2">
        <div className="flex items-center gap-3">
          <Skeleton className="size-10 rounded-full" />
          <div className="space-y-1">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-3 w-32" />
          </div>
        </div>
      </DropdownMenuLabel>
      <DropdownMenuSeparator />
      <div className="p-2 space-y-2">
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-8 w-full" />
      </div>
    </DropdownMenuContent>
  );
}

export function UserProfileDropdown() {
  const { profile: user, isLoading, error, isAuthenticated } = useUser();
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      // Uncomment for real auth integration:
      await signOut();
      console.log('Sign out clicked');
      window.location.href = '/sign-in';
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  if (isLoading) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative size-8 rounded-full">
            <Skeleton className="size-8 rounded-full" />
          </Button>
        </DropdownMenuTrigger>
        <UserProfileSkeleton />
      </DropdownMenu>
    );
  }

  if (error || !user) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative size-8 rounded-full">
            <Avatar className="size-8">
              <AvatarFallback className="bg-primary text-primary-foreground text-sm">
                ?
              </AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end">
          <DropdownMenuLabel>Profile Error</DropdownMenuLabel>
          <DropdownMenuItem>Failed to load profile</DropdownMenuItem>
          <DropdownMenuItem onClick={handleSignOut}>Sign out</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  const userInitials = user.name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 rounded-full px-2 gap-2">
          <Avatar className="size-8">
            {user.image && (
              <AvatarImage 
                src={user.image} 
                alt={user.name}
                className="object-cover"
              />
            )}
            <AvatarFallback className="bg-primary text-primary-foreground text-sm">
              {userInitials}
            </AvatarFallback>
          </Avatar>
          {/* Show name and status on desktop only */}
          <div className="hidden md:flex flex-col items-start">
            <span className="text-xs font-medium truncate max-w-20">
              {user.name}
            </span>
            <span className="text-xs text-muted-foreground">
              Member
            </span>
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-80" align="end">
        {/* User Info Header */}
        <DropdownMenuLabel className="pb-2">
          <div className="flex items-center gap-3">
            <Avatar className="size-10">
              {user.image && (
                <AvatarImage 
                  src={user.image} 
                  alt={user.name}
                  className="object-cover"
                />
              )}
              <AvatarFallback className="bg-primary text-primary-foreground">
                {userInitials}
              </AvatarFallback>
            </Avatar>
            <div className="space-y-1">
              <p className="text-sm font-medium leading-none">{user.name}</p>
              <p className="text-xs text-muted-foreground">{user.email}</p>
              {/* <div className="flex items-center gap-2">
                <Badge variant="secondary" className="text-xs px-1.5 py-0.5">
                  {user.role}
                </Badge>
                <div className="flex items-center gap-1">
                  <Star className="size-3 text-chart-4 fill-current" />
                  <span className="text-xs text-muted-foreground">{user.stats.rating}</span>
                </div>
              </div> */}
            </div>
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        {/* Stats Section */}
        <div className="px-2 py-2">
          <div className="grid grid-cols-2 gap-4 p-2 bg-muted/50 rounded-lg">
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 text-primary">
                <DollarSign className="size-3" />
                <span className="text-sm font-semibold">{user.totalEarnings}</span>
              </div>
              <p className="text-xs text-muted-foreground">Total Earnings</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 text-primary">
                <span className="text-sm font-semibold">{user.completedGigs}</span>
              </div>
              <p className="text-xs text-muted-foreground">Completed Gigs</p>
            </div>
          </div>
          <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground justify-center">
            <Calendar className="size-3" />
            <span>Member since {formatJoinDate(user.createdAt.toString())}</span>
          </div>
        </div>

        <DropdownMenuSeparator />

        {/* Menu Items */}
        <DropdownMenuItem 
          className="cursor-pointer"
          onClick={() => router.push('/dashboard/profile')}
        >
          <User className="mr-2 size-4" />
          <span className="font-medium">Profile</span>
        </DropdownMenuItem>
        
        {/* <DropdownMenuItem 
          className="cursor-pointer"
          onClick={() => router.push('/dashboard/settings')}
        >
          <Settings className="mr-2 size-4" />
          <span>Settings</span>
        </DropdownMenuItem> */}
        
        <DropdownMenuItem 
          className="cursor-pointer"
          onClick={() => router.push('/dashboard/billing')}
          disabled
        >
          <CreditCard className="mr-2 size-4" />
          <span className="font-medium">Billing (Coming Soon)</span>
        </DropdownMenuItem>
        
        <DropdownMenuItem 
          className="cursor-pointer"
          onClick={() => router.push('/dashboard/support')}
          disabled
        >
          <HelpCircle className="mr-2 size-4" />
          <span className="font-medium">Help & Support (Coming Soon)</span>
        </DropdownMenuItem>

        <DropdownMenuSeparator />
        
        <DropdownMenuItem 
          className="cursor-pointer text-destructive focus:text-destructive"
          onClick={handleSignOut}
        >
          <LogOut className="mr-2 size-4" />
          <span className="font-medium">Sign out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
