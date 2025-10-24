"use client";

import { useState, useEffect } from "react";
import { Search, Truck, X, ArrowUp } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  DRIVER_CATEGORIES, 
  FINANCIAL_INSTITUTIONS, 
  FINANCIAL_TOOLS, 
  FUEL_CARDS,
  JOB_BOARDS,
  JOB_POSTING_PLATFORMS,
  INSURANCE_COMPANIES,
  LOAD_BOARDS_FOR_FREIGHT,
  MEDICAL_INSURANCE_HEALTH,
  ONLINE_TRAINING_COURSES,
  TRAINING_TRADE_ASSOCIATIONS
} from "@/data/resources";
import { ResourceCard } from "@/app/dashboard/resources/_components/resource-card";

export default function ResourcesPage() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setShowScrollTop(scrollTop > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const getCategoryData = (categoryId: string) => {
    switch (categoryId) {
      case "financial-institutions":
        return FINANCIAL_INSTITUTIONS;
      case "financial-tools":
        return FINANCIAL_TOOLS;
      case "fuel-cards":
        return FUEL_CARDS;
      case "job-boards":
        return JOB_BOARDS;
      case "job-posting-platforms":
        return JOB_POSTING_PLATFORMS;
      case "insurance-tax":
        return INSURANCE_COMPANIES;
      case "driver-loadboards":
        return LOAD_BOARDS_FOR_FREIGHT;
      case "medical-insurance":
        return MEDICAL_INSURANCE_HEALTH;
      case "online-resources":
        return ONLINE_TRAINING_COURSES;
      case "training-associations":
        return TRAINING_TRADE_ASSOCIATIONS;
      default:
        return [];
    }
  };

  const selectedCategoryData = selectedCategory ? getCategoryData(selectedCategory) : [];
  const currentCategory = selectedCategory ? DRIVER_CATEGORIES.find(cat => cat.id === selectedCategory) : null;

  const filteredCategories = DRIVER_CATEGORIES.filter(category =>
    category.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getColorClasses = (color: string) => {
    const colorMap: Record<string, string> = {
      blue: "bg-blue-100 text-blue-700 border-blue-200 hover:bg-blue-200 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800",
      green: "bg-green-100 text-green-700 border-green-200 hover:bg-green-200 dark:bg-green-900/20 dark:text-green-300 dark:border-green-800",
      purple: "bg-purple-100 text-purple-700 border-purple-200 hover:bg-purple-200 dark:bg-purple-900/20 dark:text-purple-300 dark:border-purple-800",
      orange: "bg-orange-100 text-orange-700 border-orange-200 hover:bg-orange-200 dark:bg-orange-900/20 dark:text-orange-300 dark:border-orange-800",
      red: "bg-red-100 text-red-700 border-red-200 hover:bg-red-200 dark:bg-red-900/20 dark:text-red-300 dark:border-red-800",
      yellow: "bg-yellow-100 text-yellow-700 border-yellow-200 hover:bg-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-300 dark:border-yellow-800",
      cyan: "bg-cyan-100 text-cyan-700 border-cyan-200 hover:bg-cyan-200 dark:bg-cyan-900/20 dark:text-cyan-300 dark:border-cyan-800",
      teal: "bg-teal-100 text-teal-700 border-teal-200 hover:bg-teal-200 dark:bg-teal-900/20 dark:text-teal-300 dark:border-teal-800",
      violet: "bg-violet-100 text-violet-700 border-violet-200 hover:bg-violet-200 dark:bg-violet-900/20 dark:text-violet-300 dark:border-violet-800",
      rose: "bg-rose-100 text-rose-700 border-rose-200 hover:bg-rose-200 dark:bg-rose-900/20 dark:text-rose-300 dark:border-rose-800",
      amber: "bg-amber-100 text-amber-700 border-amber-200 hover:bg-amber-200 dark:bg-amber-900/20 dark:text-amber-300 dark:border-amber-800",
      navy: "bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200 dark:bg-slate-900/20 dark:text-slate-300 dark:border-slate-800",
      brown: "bg-amber-100 text-amber-700 border-amber-200 hover:bg-amber-200 dark:bg-amber-900/20 dark:text-amber-300 dark:border-amber-800",
      gray: "bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-200 dark:bg-gray-900/20 dark:text-gray-300 dark:border-gray-800",
      pink: "bg-pink-100 text-pink-700 border-pink-200 hover:bg-pink-200 dark:bg-pink-900/20 dark:text-pink-300 dark:border-pink-800"
    };
    return colorMap[color] || colorMap.blue;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-neutral-100 dark:from-neutral-900 dark:to-neutral-800">
      {/* Header Section */}
      <div className="bg-white/90 dark:bg-neutral-800/90 backdrop-blur-sm border-b">
        <div className="container mx-auto px-4 py-6">
          {/* Title and Search */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div className="flex items-center gap-3 min-w-0 flex-1">
              <div className="p-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-sm flex-shrink-0">
                <Truck className="h-5 w-5 text-white" />
              </div>
              <div className="min-w-0 flex-1">
                <h1 className="text-lg sm:text-xl font-bold text-neutral-900 dark:text-white truncate">
                  Driver Resources
                </h1>
                <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 line-clamp-1">
                  Professional tools and platforms for your driving business
                </p>
              </div>
            </div>
            
            {/* Search */}
            <div className="w-full sm:w-80 flex-shrink-0">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-neutral-400" />
                <Input
                  placeholder="Search categories..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 h-9 bg-white/60 dark:bg-neutral-700/60 border-neutral-200 dark:border-neutral-600 focus:ring-2 focus:ring-blue-500/20"
                />
              </div>
            </div>
          </div>

          {/* Categories Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                Browse Categories
              </span>
              {selectedCategory && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedCategory(null)}
                  className="text-xs text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200 h-7 px-2"
                >
                  <X className="h-3 w-3 mr-1" />
                  Clear Filter
                </Button>
              )}
            </div>
            
            {/* Category Badges - Horizontal Scroll */}
            <div className="overflow-x-auto scrollbar-hide">
              <div className="flex gap-2 pb-2 min-w-max">
                {filteredCategories.map((category) => {
                  const Icon = category.icon;
                  const isSelected = selectedCategory === category.id;
                  
                  return (
                    <div
                      key={category.id}
                      onClick={() => setSelectedCategory(isSelected ? null : category.id)}
                      className={`
                        flex items-center gap-2 px-3 py-2 rounded-full border cursor-pointer transition-all duration-200 whitespace-nowrap flex-shrink-0
                        ${isSelected 
                          ? getColorClasses(category.color) + " shadow-md scale-105" 
                          : "bg-white/60 text-neutral-700 border-neutral-200 hover:bg-white hover:shadow-sm dark:bg-neutral-700/60 dark:text-neutral-300 dark:border-neutral-600 dark:hover:bg-neutral-700"
                        }
                      `}
                    >
                      <Icon className="h-4 w-4 flex-shrink-0" />
                      <span className="font-medium text-sm">{category.name}</span>
                      <Badge 
                        variant="secondary" 
                        className={`
                          text-xs px-2 py-0.5
                          ${isSelected 
                            ? "bg-white/50 text-current" 
                            : "bg-neutral-100 text-neutral-600 dark:bg-neutral-600 dark:text-neutral-300"
                          }
                        `}
                      >
                        {category.count}
                      </Badge>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll to Top Button */}
      {showScrollTop && (
        <Button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 h-12 w-12 rounded-full shadow-lg bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 z-50"
          size="icon"
        >
          <ArrowUp className="h-5 w-5 text-white" />
        </Button>
      )}

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6">
        {!selectedCategory ? (
          /* Overview Section */
          <div className="space-y-6">
           

            {/* Category Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredCategories.map((category) => {
                const Icon = category.icon;
                
                return (
                  <Card 
                    key={category.id} 
                    className="hover:shadow-lg transition-all duration-200 cursor-pointer group border-0 bg-white/60 dark:bg-neutral-800/60 backdrop-blur-sm hover:bg-white/80 dark:hover:bg-neutral-800/80"
                    onClick={() => setSelectedCategory(category.id)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3 mb-3">
                        <div className={`p-2 rounded-lg ${getColorClasses(category.color)}`}>
                          <Icon className="h-5 w-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-neutral-900 dark:text-white truncate text-sm">
                            {category.name}
                          </h3>
                          <Badge variant="secondary" className="text-xs">
                            {category.count} resources
                          </Badge>
                        </div>
                      </div>
                      <p className="text-xs text-neutral-600 dark:text-neutral-400 line-clamp-2">
                        {category.description}
                      </p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        ) : (
          /* Category Detail Section */
          <div className="space-y-6">
            {/* Category Header */}
            {currentCategory && (
              <Card className="bg-gradient-to-r from-white/80 to-neutral-50/80 dark:from-neutral-800/80 dark:to-neutral-700/80 backdrop-blur-sm border-0">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-xl ${getColorClasses(currentCategory.color)}`}>
                      <currentCategory.icon className="h-6 w-6" />
                    </div>
                    <div className="flex-1">
                      <h2 className="text-2xl font-bold text-neutral-900 dark:text-white">
                        {currentCategory.name}
                      </h2>
                      <p className="text-neutral-600 dark:text-neutral-400">
                        {currentCategory.description}
                      </p>
                    </div>
                    <Badge variant="secondary" className="text-lg px-4 py-2">
                      {currentCategory.count} Resources
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Resources Grid */}
            {selectedCategoryData.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {selectedCategoryData.map((resource, index) => (
                  <div key={(resource as any).id || resource.name || index} className="h-full">
                    <ResourceCard resource={resource} />
                  </div>
                ))}
              </div>
            ) : (
              <Card className="bg-white/60 dark:bg-neutral-800/60 backdrop-blur-sm border-0">
                <CardContent className="p-12 text-center">
                  <div className="text-neutral-400 dark:text-neutral-500 mb-6">
                    <svg className="h-16 w-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-neutral-900 dark:text-white mb-3">
                    Coming Soon
                  </h3>
                  <p className="text-neutral-600 dark:text-neutral-400 max-w-md mx-auto">
                    We're working on adding resources for this category. Check back soon for updates!
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
