"use client";

import { ExternalLink, Play, ChevronDown } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

interface Resource {
  id?: string;
  name: string;
  type?: string;
  description: string;
  website?: string;
  url?: string;
  features?: string[];
  badges?: string[];
  color?: string;
  cashback?: string;
  rating?: number;
  jobCount?: string;
  location?: string;
  category?: string;
}

interface ResourceCardProps {
  resource: Resource;
}

export function ResourceCard({ resource }: ResourceCardProps) {
  const getColorClasses = (color?: string) => {
    const colorMap: Record<string, string> = {
      blue: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300",
      green: "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300",
      purple: "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300",
      orange: "bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300",
      red: "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300",
      yellow: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300",
      cyan: "bg-cyan-100 text-cyan-700 dark:bg-cyan-900 dark:text-cyan-300",
      teal: "bg-teal-100 text-teal-700 dark:bg-teal-900 dark:text-teal-300",
      violet: "bg-violet-100 text-violet-700 dark:bg-violet-900 dark:text-violet-300",
      rose: "bg-rose-100 text-rose-700 dark:bg-rose-900 dark:text-rose-300",
      amber: "bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300",
      navy: "bg-slate-100 text-slate-700 dark:bg-slate-900 dark:text-slate-300",
      brown: "bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300",
      gray: "bg-gray-100 text-gray-700 dark:bg-gray-900 dark:text-gray-300"
    };
    return colorMap[color || "blue"] || colorMap.blue;
  };

  const handleVisitWebsite = () => {
    const url = resource.website || resource.url;
    if (url) {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  const handleAddYouTubeEducation = () => {
    // Placeholder for YouTube education feature
    console.log('Add YouTube education for:', resource.name);
  };

  const handleBenefits = () => {
    // Placeholder for benefits feature
    console.log('Show benefits for:', resource.name);
  };

  return (
    <Card className="h-full hover:shadow-xl transition-all duration-300 border-0 bg-white/70 dark:bg-neutral-800/70 backdrop-blur-sm hover:bg-white/90 dark:hover:bg-neutral-800/90 group">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3 min-w-0 flex-1">
            <div className={cn(
              "p-3 rounded-xl flex-shrink-0",
              getColorClasses(resource.color)
            )}>
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
            </div>
            <div className="min-w-0 flex-1">
              <CardTitle className="text-lg font-semibold text-neutral-900 dark:text-white line-clamp-2 leading-tight">
                {resource.name}
              </CardTitle>
              {resource.type && (
                <Badge 
                  variant="secondary" 
                  className={cn("mt-2 text-xs", getColorClasses(resource.color))}
                >
                  {resource.type}
                </Badge>
              )}
            </div>
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity">
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleBenefits}>
                Benefits
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleAddYouTubeEducation}>
                Add YouTube Education
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4 flex flex-col h-full">
        <p className="text-sm text-neutral-600 dark:text-neutral-400 line-clamp-3 leading-relaxed">
          {resource.description}
        </p>

        {/* Additional Info */}
        <div className="space-y-2">
          {resource.cashback && (
            <div className="flex items-center gap-2 text-sm">
              <span className="font-medium text-green-600 dark:text-green-400">
                {resource.cashback}
              </span>
              <span className="text-neutral-500 dark:text-neutral-400">cashback</span>
            </div>
          )}
          
          {resource.rating && (
            <div className="flex items-center gap-2 text-sm">
              <span className="font-medium text-neutral-900 dark:text-white">
                ⭐ {resource.rating}
              </span>
              <span className="text-neutral-500 dark:text-neutral-400">rating</span>
            </div>
          )}
          
          {resource.jobCount && (
            <div className="flex items-center gap-2 text-sm">
              <span className="font-medium text-neutral-900 dark:text-white">
                {resource.jobCount}
              </span>
              <span className="text-neutral-500 dark:text-neutral-400">jobs</span>
            </div>
          )}
          
          {resource.location && (
            <div className="flex items-center gap-2 text-sm">
              <span className="text-neutral-500 dark:text-neutral-400">
                📍 {resource.location}
              </span>
            </div>
          )}
        </div>

        {/* Features */}
        {resource.features && resource.features.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-neutral-900 dark:text-white">
              Key Features:
            </h4>
            <div className="flex flex-wrap gap-1">
              {resource.features.slice(0, 3).map((feature, index) => (
                <Badge key={index} variant="outline" className="text-xs px-2 py-1">
                  {feature}
                </Badge>
              ))}
              {resource.features.length > 3 && (
                <Badge variant="outline" className="text-xs px-2 py-1">
                  +{resource.features.length - 3} more
                </Badge>
              )}
            </div>
          </div>
        )}

        {/* Badges */}
        {resource.badges && resource.badges.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {resource.badges.map((badge, index) => (
              <Badge key={index} variant="secondary" className="text-xs px-2 py-1">
                {badge}
              </Badge>
            ))}
          </div>
        )}

        {/* Spacer to push buttons to bottom */}
        <div className="flex-1"></div>

        {/* Action Buttons */}
        <div className="flex gap-2 pt-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleAddYouTubeEducation}
            className="flex-1 text-xs h-8"
          >
            <Play className="h-3 w-3 mr-1" />
            <span className="hidden sm:inline">Add YouTube Education</span>
            <span className="sm:hidden">YouTube</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleVisitWebsite}
            className="flex-1 text-xs h-8"
            disabled={!resource.website && !resource.url}
          >
            <ExternalLink className="h-3 w-3 mr-1" />
            <span className="hidden sm:inline">Visit Website</span>
            <span className="sm:hidden">Visit</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
