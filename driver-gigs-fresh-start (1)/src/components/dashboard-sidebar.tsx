"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/ui/logo";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  LayoutDashboard,
  Briefcase,
  BookOpen,
  UserCheck,
  Users,
  CheckSquare,
  Bell,
  Truck,
  CreditCard,
  Building,
  DollarSign,
} from "lucide-react";

const navigationItems = [
  {
    title: "Dashboard",
    subtitle: "Overview & Stats",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Driver Opportunities",
    subtitle: "Job Opportunities",
    href: "/dashboard/opportunities",
    icon: Briefcase
  },
  {
    title: "Driver Resources",
    subtitle: "Tools & Services for Drivers",
    href: "/dashboard/resources",
    icon: BookOpen,
  },
  {
    title: "Step by Step",
    subtitle: "Guided Setup",
    href: "/dashboard/onboarding",
    icon: UserCheck,
  },
  {
    title: "Networking Groups",
    subtitle: "Professional Networks",
    href: "/dashboard/network",
    icon: Users,
  },
  {
    title: "Task Management",
    subtitle: "Project Planning",
    href: "/dashboard/tasks",
    icon: CheckSquare,
  },
  {
    title: "Reminders",
    subtitle: "Upcoming Tasks & Follow-ups",
    href: "/dashboard/reminders",
    icon: Bell,
  },
  {
    title: "My Fleet",
    subtitle: "Vehicle Management",
    href: "/dashboard/fleet",
    icon: Truck,
  },
  {
    title: "Personal Credit",
    subtitle: "Credit Score & Monitoring",
    href: "/dashboard/credit",
    icon: CreditCard,
  },
  {
    title: "My Business",
    subtitle: "Business Profile Management",
    href: "/dashboard/business",
    icon: Building,
  },
  {
    title: "Pricing Table",
    subtitle: "Plans & Billing",
    href: "/dashboard/pricing",
    icon: DollarSign,
  },
];

export function DashboardSidebar() {
  const pathname = usePathname();

  return (
    <div className="flex h-full w-64 flex-col bg-card border-r">
      {/* Logo */}
      <div className="flex h-16 items-center px-6 border-b">
        <Logo size="md" />
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-3 py-4">
        {navigationItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link key={item.href} href={item.href}>
              <Button
                variant={isActive ? "secondary" : "ghost"}
                className={cn(
                  "w-full justify-start gap-3 px-3 py-3 h-auto",
                  isActive && "bg-primary/10 text-primary hover:bg-primary/15"
                )}
              >
                <Icon className="size-4 mt-0.5" />
                <div className="flex-1 text-left">
                  <div className="font-medium text-sm">{item.title}</div>
                  <div className="text-xs text-muted-foreground">{item.subtitle}</div>
                </div>
              </Button>
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t">
        <div className="text-xs text-muted-foreground text-center">
          Pro Hub
        </div>
      </div>
    </div>
  );
}
