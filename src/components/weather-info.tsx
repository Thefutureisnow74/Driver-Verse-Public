"use client";

import { useQuery } from "@tanstack/react-query";
import { MapPin, Thermometer, Car, Clock, Droplets, Wind, Cloud, Sun, CloudRain, CloudSnow } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useState, useEffect } from "react";

interface WeatherData {
  location: string;
  temperature: string;
  condition: string;
  trafficStatus: "Light Traffic" | "Moderate Traffic" | "Heavy Traffic";
  notifications: number;
  forecast?: DayForecast[];
  windSpeed?: string;
}

interface DayForecast {
  day: string;
  high: number;
  low: number;
  precipitation: number;
  condition: string;
}

interface WeatherInfoProps {
  location?: string;
  compact?: boolean; // For mobile header
  headerMode?: boolean; // For simple header display
}

async function fetchWeatherData(location: string): Promise<WeatherData> {
  const response = await fetch(`/api/weather?location=${encodeURIComponent(location)}`);
  if (!response.ok) {
    throw new Error('Failed to fetch weather data');
  }
  return response.json();
}

// Custom hook for current time
function useCurrentTime() {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return currentTime;
}

// Function to get weather icon based on condition with enhanced styling
function getWeatherIcon(condition: string, size: string = "size-5") {
  switch (condition.toLowerCase()) {
    case 'sunny':
      return <Sun className={`${size} text-yellow-500 drop-shadow-sm`} />;
    case 'partly cloudy':
      return <Cloud className={`${size} text-blue-400 drop-shadow-sm`} />;
    case 'cloudy':
      return <Cloud className={`${size} text-gray-500 drop-shadow-sm`} />;
    case 'rainy':
    case 'rain':
      return <CloudRain className={`${size} text-blue-600 drop-shadow-sm`} />;
    case 'snowy':
    case 'snow':
      return <CloudSnow className={`${size} text-blue-200 drop-shadow-sm`} />;
    default:
      return <Cloud className={`${size} text-gray-400 drop-shadow-sm`} />;
  }
}

export function WeatherInfo({ 
  location = "Dallas, TX",
  compact = false,
  headerMode = false
}: WeatherInfoProps) {
  const currentTime = useCurrentTime();
  const { data: weather, isLoading, error } = useQuery({
    queryKey: ['weather', location],
    queryFn: () => fetchWeatherData(location),
    refetchInterval: 10 * 60 * 1000, // Refetch every 10 minutes
    staleTime: 5 * 60 * 1000, // 5 minutes stale time
  });

  const getTrafficColor = (status: string) => {
    switch (status) {
      case "Light Traffic":
        return "bg-primary/10 text-primary border-primary/20";
      case "Moderate Traffic":
        return "bg-chart-4/10 text-chart-4 border-chart-4/20";
      case "Heavy Traffic":
        return "bg-destructive/10 text-destructive border-destructive/20";
      default:
        return "bg-muted/10 text-muted-foreground border-border";
    }
  };

  if (isLoading) {
    return (
      <div className={`flex items-center gap-3 ${compact ? 'gap-2' : 'gap-6'} text-sm`}>
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-4 w-12" />
        <Skeleton className="h-6 w-24" />
      </div>
    );
  }

  if (error || !weather) {
    return (
      <div className={`flex items-center gap-3 ${compact ? 'gap-2' : 'gap-6'} text-sm`}>
        <div className="flex items-center gap-2">
          <MapPin className="size-4 text-muted-foreground" />
          <span className="font-medium">{location}</span>
        </div>
        <span className="text-muted-foreground text-xs">Weather unavailable</span>
      </div>
    );
  }

  if (compact) {
    // Mobile compact version
    return (
      <div className="flex items-center gap-3 text-sm">
        <div className="flex items-center gap-1">
          <MapPin className="size-3 text-muted-foreground" />
          <span className="text-xs font-medium">{weather.location}</span>
        </div>
        <div className="flex items-center gap-1">
          <Thermometer className="size-3 text-muted-foreground" />
          <span className="text-xs">{weather.temperature}</span>
        </div>
        <Badge variant="outline" className={`text-xs px-1.5 py-0.5 ${getTrafficColor(weather.trafficStatus)}`}>
          <Car className="size-2 mr-1" />
          {weather.trafficStatus.split(' ')[0]} {/* Show only "Light", "Moderate", "Heavy" */}
        </Badge>
      </div>
    );
  }

  if (headerMode) {
    // Simple header version
    return (
      <div className="flex items-center gap-3 text-sm">
        <div className="flex items-center gap-2">
          <Clock className="size-4 text-muted-foreground" />
          <span className="font-medium">
            {currentTime.toLocaleTimeString('en-US', { 
              hour: 'numeric', 
              minute: '2-digit',
              hour12: true 
            })}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <MapPin className="size-4 text-muted-foreground" />
          <span className="font-medium">{weather.location}</span>
          {getWeatherIcon(weather.condition, "size-4")}
          <span className="font-semibold">{weather.temperature}</span>
        </div>
      </div>
    );
  }

  // Dashboard sidebar weather card version - compact
  return (
    <div className="bg-gradient-to-br from-blue-50/50 to-indigo-50/50 dark:from-blue-950/20 dark:to-indigo-950/20 rounded-xl border border-blue-100/50 dark:border-blue-800/30 shadow-sm backdrop-blur-sm p-4">
      
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <div className="p-1.5 bg-blue-100/80 dark:bg-blue-900/40 rounded-lg">
          <MapPin className="size-3 text-blue-600 dark:text-blue-400" />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Weather</h3>
          <p className="text-xs text-muted-foreground">{weather.location}</p>
        </div>
      </div>

      {/* Current Weather */}
      <div className="text-center mb-4">
        <div className="flex items-center justify-center gap-2 mb-1">
          {getWeatherIcon(weather.condition, "size-6")}
          <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            {weather.temperature}
          </span>
        </div>
        <p className="text-xs text-muted-foreground font-medium">{weather.condition}</p>
      </div>

      {/* Compact Forecast */}
      {weather.forecast && (
        <div className="space-y-2 mb-4">
          <h4 className="text-xs font-semibold text-gray-900 dark:text-gray-100">Forecast</h4>
          <div className="space-y-1">
            {weather.forecast.slice(0, 3).map((day, index) => (
              <div key={index} className="flex items-center justify-between p-1.5 rounded-md bg-white/60 dark:bg-gray-800/40 border border-white/80 dark:border-gray-700/50">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-medium text-gray-600 dark:text-gray-300 w-8">
                    {day.day}
                  </span>
                  {getWeatherIcon(day.condition, "size-3")}
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-gray-900 dark:text-gray-100">{day.high}°</span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">{day.low}°</span>
                  {day.precipitation > 0 && (
                    <span className="text-xs text-blue-600 dark:text-blue-400">{day.precipitation}%</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Time & Wind */}
      <div className="border-t border-blue-200/50 dark:border-blue-700/30 pt-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Clock className="size-3 text-blue-600 dark:text-blue-400" />
            <div>
              <p className="text-sm font-bold text-gray-900 dark:text-gray-100">
                {currentTime.toLocaleTimeString('en-US', { 
                  hour: 'numeric', 
                  minute: '2-digit',
                  hour12: true 
                })}
              </p>
              <p className="text-xs text-muted-foreground">Local Time</p>
            </div>
          </div>
          
          {weather.windSpeed && (
            <div className="flex items-center gap-1 px-2 py-1 bg-white/60 dark:bg-gray-800/40 rounded-md border border-white/80 dark:border-gray-700/50">
              <Wind className="size-3 text-gray-600 dark:text-gray-400" />
              <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">{weather.windSpeed}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
