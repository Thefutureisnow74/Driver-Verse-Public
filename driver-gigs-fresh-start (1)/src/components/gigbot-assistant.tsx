"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Bot, TrendingUp, MapPin, AlertTriangle } from "lucide-react";

interface AssistantAlert {
  id: string;
  title: string;
  description: string;
  priority: "High" | "Medium" | "Low";
  icon: React.ComponentType<{ className?: string }>;
  actionLabel?: string;
}

const alerts: AssistantAlert[] = [
  {
    id: "peak-hours",
    title: "Peak Hours Alert",
    description: "Lunch rush starting in 30 min. Consider heading to downtown area.",
    priority: "High",
    icon: TrendingUp,
    actionLabel: "View Route"
  },
  {
    id: "new-gig",
    title: "New Gig Match",
    description: "Instacart has openings in your area with $22/hr average.",
    priority: "Medium", 
    icon: MapPin,
    actionLabel: "Apply Now"
  },
  {
    id: "route-optimization",
    title: "Route Optimization",
    description: "Optimize your delivery route to increase earnings by 15%.",
    priority: "Medium",
    icon: AlertTriangle,
    actionLabel: "Optimize"
  }
];

export function GigBotAssistant() {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High":
        return "bg-destructive/10 text-destructive border-destructive/20";
      case "Medium":
        return "bg-chart-4/10 text-chart-4 border-chart-4/20";
      case "Low":
        return "bg-primary/10 text-primary border-primary/20";
      default:
        return "bg-muted/10 text-muted-foreground border-border";
    }
  };

  return (
    <Card className="h-fit">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-3">
          <div className="size-10 bg-primary rounded-full flex items-center justify-center">
            <Bot className="size-5 text-primary-foreground" />
          </div>
          <div className="flex-1">
            <CardTitle className="text-lg">GigBot Assistant</CardTitle>
            <Badge variant="outline" className="text-xs bg-primary/10 text-primary border-primary/20 mt-1">
              AI Powered
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Your personalized AI assistant for maximizing earnings and efficiency.
        </p>
        
        <div className="space-y-3">
          {alerts.map((alert) => {
            const Icon = alert.icon;
            
            return (
              <div key={alert.id} className="p-3 rounded-lg border bg-card/50">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5">
                    <Icon className="size-4 text-muted-foreground" />
                  </div>
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-medium">{alert.title}</h4>
                      <Badge 
                        variant="outline" 
                        className={`text-xs ${getPriorityColor(alert.priority)}`}
                      >
                        {alert.priority}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {alert.description}
                    </p>
                    {alert.actionLabel && (
                      <Button size="sm" variant="outline" className="h-6 text-xs px-2">
                        {alert.actionLabel}
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
