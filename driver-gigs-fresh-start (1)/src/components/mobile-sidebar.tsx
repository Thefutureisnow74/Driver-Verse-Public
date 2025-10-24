"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/ui/logo";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
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
  Menu,
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
    icon: Briefcase,
    badge: "12",
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

interface MobileSidebarProps {
  children?: React.ReactNode;
}

export function MobileSidebar({ children }: MobileSidebarProps) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const handleLinkClick = () => {
    setOpen(false);
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        {children || (
          <Button variant="ghost" size="icon">
            <Menu className="size-5" />
          </Button>
        )}
      </SheetTrigger>
      <SheetContent side="left" className="w-64 p-0">
        <div className="flex h-full flex-col">
          {/* Header */}
          <SheetHeader className="p-6 border-b">
            <SheetTitle>
              <Logo size="md" />
            </SheetTitle>
          </SheetHeader>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 px-3 py-4">
            {navigationItems.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              
              return (
                <Link key={item.href} href={item.href} onClick={handleLinkClick}>
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
                    {item.badge && (
                      <Badge 
                        variant="secondary" 
                        className="ml-auto bg-primary/10 text-primary text-xs px-1.5 py-0.5 h-5"
                      >
                        {item.badge}
                      </Badge>
                    )}
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
      </SheetContent>
    </Sheet>
  );
}
