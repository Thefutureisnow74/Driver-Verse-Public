"use client";

import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Building2, 
  Briefcase, 
  Search, 
  FileText, 
  Clock, 
  Users,
  AlertTriangle,
  TrendingUp,
  TrendingDown
} from "lucide-react";
import { DashboardData } from "@/app/api/dashboard/route";

async function fetchDashboardData(): Promise<DashboardData> {
  const response = await fetch('/api/dashboard');
  if (!response.ok) {
    throw new Error('Failed to fetch dashboard data');
  }
  return response.json();
}

function formatTimeAgo(isoString: string): string {
  const now = new Date();
  const updated = new Date(isoString);
  const diffInMinutes = Math.floor((now.getTime() - updated.getTime()) / (1000 * 60));
  
  if (diffInMinutes < 1) return 'Just now';
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
  
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours}h ago`;
  
  const diffInDays = Math.floor(diffInHours / 24);
  return `${diffInDays}d ago`;
}

function DashboardCardSkeleton() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-4" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-8 w-16 mb-2" />
        <Skeleton className="h-3 w-20" />
      </CardContent>
    </Card>
  );
}

export function DashboardCards() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['dashboard-data'],
    queryFn: fetchDashboardData,
    refetchInterval: 2 * 60 * 1000, // Refetch every 2 minutes
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold">Overview</h2>
          <Skeleton className="h-4 w-24" />
        </div>
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4">
          {Array.from({ length: 7 }).map((_, i) => (
            <DashboardCardSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-semibold">Overview</h2>
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">
              Failed to load dashboard data. Please try again.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const { overview } = data!;

  type CardTrend = "up" | "down" | "neutral";
  
  interface DashboardCard {
    title: string;
    value: string | number;
    change?: string;
    status?: string;
    icon: React.ComponentType<{ className?: string }>;
    trend?: CardTrend;
    highlight?: boolean;
  }

  const cards: DashboardCard[] = [
    {
      title: "Active Companies",
      value: overview.activeCompanies.count,
      change: overview.activeCompanies.change,
      icon: Building2,
      trend: overview.activeCompanies.change.includes("+") ? "up" : overview.activeCompanies.change.includes("-") ? "down" : "neutral",
    },
    {
      title: "New Opportunities", 
      value: overview.newOpportunities.count,
      change: overview.newOpportunities.change,
      icon: Briefcase,
      trend: overview.newOpportunities.change.includes("+") ? "up" : "neutral",
    },
    {
      title: "Researching",
      value: overview.researching.count,
      status: overview.researching.status,
      icon: Search,
      trend: "neutral",
    },
    {
      title: "Applied",
      value: overview.applied.count,
      status: overview.applied.status,
      icon: FileText,
      trend: "neutral",
    },
    {
      title: "Wait List",
      value: overview.waitList.count,
      status: overview.waitList.status,
      icon: Clock,
      trend: "neutral",
    },
    {
      title: "Other",
      value: overview.other.count,
      status: overview.other.status,
      icon: Users,
      trend: "neutral",
    },
    {
      title: "Vehicle Alerts",
      value: overview.vehicleAlerts.count,
      status: overview.vehicleAlerts.status,
      icon: AlertTriangle,
      trend: "neutral",
      highlight: overview.vehicleAlerts.count > 0,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Overview</h2>
        <Badge variant="secondary" className="text-xs">
          Updated {formatTimeAgo(overview.updatedAt)}
        </Badge>
      </div>

      {/* Cards Grid - Responsive with flex grow */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4">
        {cards.map((card) => {
          const Icon = card.icon;
          const isHighlighted = card.highlight;
          
          return (
            <Card key={card.title} className={`flex flex-col h-full ${isHighlighted ? "border-orange-200 dark:border-orange-600 bg-orange-50/50 dark:bg-orange-900/20" : ""}`}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {card.title}
                </CardTitle>
                <Icon className={`size-4 ${isHighlighted ? "text-orange-600 dark:text-orange-400" : "text-muted-foreground"}`} />
              </CardHeader>
              <CardContent className="flex-1 flex flex-col justify-between">
                <div className="text-2xl font-bold">
                  {card.value}
                </div>
                <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                  {card.change && card.trend && (
                    <>
                      {card.trend === "up" && (
                        <TrendingUp className="size-3 text-primary" />
                      )}
                      {card.trend === "down" && (
                        <TrendingDown className="size-3 text-destructive" />
                      )}
                      <span className={
                        card.trend === "up" 
                          ? "text-primary" 
                          : card.trend === "down" 
                          ? "text-destructive" 
                          : "text-muted-foreground"
                      }>
                        {card.change}
                      </span>
                    </>
                  )}
                  {card.status && (
                    <span>{card.status}</span>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
