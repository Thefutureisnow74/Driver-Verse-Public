"use client";

import { MobileSidebar } from "@/components/mobile-sidebar";
import { UserProfileDropdown } from "@/components/user-profile-dropdown";

interface DashboardHeaderProps {
  userName?: string; // Optional override
}

export function DashboardHeader({ userName }: DashboardHeaderProps) {
  return (
    <header className="flex h-16 items-center justify-between border-b bg-background px-6 md:px-8 lg:px-12">
      {/* Mobile Layout */}
      <div className="flex md:hidden items-center gap-4 flex-1">
        {/* Mobile Menu Button */}
        <MobileSidebar />
        
        {/* Mobile Profile */}
        <div className="ml-auto">
          <UserProfileDropdown />
        </div>
      </div>

      {/* Desktop Layout - Simple */}
      <div className="hidden md:flex items-center justify-between w-full">
        {/* Left side - Logo/Brand space */}
        <div className="flex-1">
          <h1 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Driver Gigs
          </h1>
        </div>

        {/* Right side - Profile */}
        <div className="flex-1 flex justify-end">
          <UserProfileDropdown />
        </div>
      </div>
    </header>
  );
}

