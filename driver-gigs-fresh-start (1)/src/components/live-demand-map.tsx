"use client";

import { useState, useEffect, useRef } from "react";
import { MapPin, TrendingUp, Clock, Users, Car, Package, Utensils, Navigation, Maximize2, Minimize2, X } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface DemandHotspot {
  id: string;
  area: string;
  service: string;
  demand: "high" | "medium" | "low";
  distance: string;
  estimatedEarnings: string;
  activeDrivers: number;
  peakHours: string;
  icon: React.ReactNode;
}

interface BusySpot {
  id: string;
  name: string;
  type: string;
  lat: number;
  lng: number;
  busyLevel: "very_busy" | "busy" | "moderate" | "quiet";
  rating: number;
  totalRatings: number;
  peakHours: string[];
  currentWaitTime?: string;
  popularTimes?: number[];
}

interface UserLocation {
  city: string;
  state: string;
  lat: number;
  lng: number;
}

declare global {
  interface Window {
    google: any;
    initMap: () => void;
  }
}

export function LiveDemandMap() {
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null);
  const [demandData, setDemandData] = useState<DemandHotspot[]>([]);
  const [busySpots, setBusySpots] = useState<BusySpot[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [showBusySpots, setShowBusySpots] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const fullscreenRef = useRef<HTMLDivElement>(null);

  // Load Google Maps script
  useEffect(() => {
    const loadGoogleMaps = () => {
      if (window.google) {
        setMapLoaded(true);
        return;
      }

      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || 'YOUR_API_KEY'}&libraries=geometry,places`;
      script.async = true;
      script.defer = true;
      script.onload = () => setMapLoaded(true);
      script.onerror = () => {
        console.error('Failed to load Google Maps');
        setLocationError('Failed to load maps');
      };
      document.head.appendChild(script);
    };

    loadGoogleMaps();
  }, []);

  // Get user's location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          
          // Mock reverse geocoding - in real app, use a geocoding service
          const mockLocation: UserLocation = {
            city: "Dallas",
            state: "TX",
            lat: latitude,
            lng: longitude,
          };
          
          setUserLocation(mockLocation);
          generateMockDemandData(mockLocation);
          generateBusySpots(mockLocation);
          setIsLoading(false);
        },
        (error) => {
          console.error("Location error:", error);
          setLocationError("Unable to get your location");
          
          // Fallback to default location
          const defaultLocation: UserLocation = {
            city: "Dallas",
            state: "TX",
            lat: 32.7767,
            lng: -96.7970,
          };
          
          setUserLocation(defaultLocation);
          generateMockDemandData(defaultLocation);
          generateBusySpots(defaultLocation);
          setIsLoading(false);
        }
      );
    } else {
      setLocationError("Geolocation not supported");
      setIsLoading(false);
    }
  }, []);

  // Initialize Google Map when both location and maps are ready
  useEffect(() => {
    if (mapLoaded && userLocation && mapRef.current && !mapInstanceRef.current) {
      initializeMap();
    }
  }, [mapLoaded, userLocation]);

  const initializeMap = () => {
    if (!mapRef.current || !userLocation || !window.google) return;

    const map = new window.google.maps.Map(mapRef.current, {
      center: { lat: userLocation.lat, lng: userLocation.lng },
      zoom: 12,
      styles: [
        {
          featureType: "poi",
          elementType: "labels",
          stylers: [{ visibility: "off" }]
        }
      ],
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: false,
    });

    // Enable traffic layer
    const trafficLayer = new window.google.maps.TrafficLayer();
    trafficLayer.setMap(map);

    // Add user location marker
    new window.google.maps.Marker({
      position: { lat: userLocation.lat, lng: userLocation.lng },
      map: map,
      title: "Your Location",
      icon: {
        path: window.google.maps.SymbolPath.CIRCLE,
        scale: 8,
        fillColor: "#4285F4",
        fillOpacity: 1,
        strokeColor: "#ffffff",
        strokeWeight: 2,
      },
    });

    // Add demand hotspot markers
    demandData.forEach((hotspot, index) => {
      const offset = 0.02; // Small offset for demo purposes
      const lat = userLocation.lat + (Math.random() - 0.5) * offset;
      const lng = userLocation.lng + (Math.random() - 0.5) * offset;

      const color = hotspot.demand === 'high' ? '#ef4444' : 
                   hotspot.demand === 'medium' ? '#f59e0b' : '#10b981';

      new window.google.maps.Marker({
        position: { lat, lng },
        map: map,
        title: `${hotspot.area} - ${hotspot.service}`,
        icon: {
          path: window.google.maps.SymbolPath.CIRCLE,
          scale: 6,
          fillColor: color,
          fillOpacity: 0.8,
          strokeColor: "#ffffff",
          strokeWeight: 1,
        },
      });
    });

    // Add busy spots markers
    if (showBusySpots) {
      busySpots.forEach((spot) => {
        const busyColor = spot.busyLevel === 'very_busy' ? '#dc2626' :
                         spot.busyLevel === 'busy' ? '#ea580c' :
                         spot.busyLevel === 'moderate' ? '#ca8a04' : '#16a34a';

        const marker = new window.google.maps.Marker({
          position: { lat: spot.lat, lng: spot.lng },
          map: map,
          title: spot.name,
          icon: {
            path: window.google.maps.SymbolPath.BACKWARD_CLOSED_ARROW,
            scale: 8,
            fillColor: busyColor,
            fillOpacity: 0.9,
            strokeColor: "#ffffff",
            strokeWeight: 2,
            rotation: 0,
          },
        });

        // Add info window for busy spots
        const infoWindow = new window.google.maps.InfoWindow({
          content: `
            <div style="padding: 8px; max-width: 200px;">
              <h3 style="margin: 0 0 8px 0; font-size: 14px; font-weight: bold;">${spot.name}</h3>
              <p style="margin: 0 0 4px 0; font-size: 12px; color: #666;">${spot.type}</p>
              <div style="display: flex; align-items: center; margin-bottom: 4px;">
                <span style="font-size: 12px;">⭐ ${spot.rating}</span>
                <span style="font-size: 11px; color: #666; margin-left: 4px;">(${spot.totalRatings})</span>
              </div>
              <div style="font-size: 11px; color: ${busyColor}; font-weight: bold; margin-bottom: 4px;">
                ${spot.busyLevel.replace('_', ' ').toUpperCase()}
              </div>
              ${spot.currentWaitTime ? `<div style="font-size: 11px; color: #666;">Wait: ${spot.currentWaitTime}</div>` : ''}
              <div style="font-size: 11px; color: #666;">Peak: ${spot.peakHours.join(', ')}</div>
            </div>
          `
        });

        marker.addListener('click', () => {
          infoWindow.open(map, marker);
        });
      });
    }

    mapInstanceRef.current = map;
  };

  const generateMockDemandData = (location: UserLocation) => {
    const areas = [
      "Downtown", "Uptown", "Deep Ellum", "Bishop Arts District", 
      "Knox-Henderson", "Lower Greenville", "Design District"
    ];
    
    const services = [
      { name: "Food Delivery", icon: <Utensils className="size-4" />, earnings: "$18-25/hr" },
      { name: "Rideshare", icon: <Car className="size-4" />, earnings: "$15-22/hr" },
      { name: "Package Delivery", icon: <Package className="size-4" />, earnings: "$16-24/hr" },
    ];

    const mockData: DemandHotspot[] = areas.slice(0, 6).map((area, index) => {
      const service = services[index % services.length];
      const demands: ("high" | "medium" | "low")[] = ["high", "medium", "low"];
      const demand = demands[Math.floor(Math.random() * demands.length)];
      
      return {
        id: `${area}-${service.name}`,
        area,
        service: service.name,
        demand,
        distance: `${(Math.random() * 15 + 1).toFixed(1)} mi`,
        estimatedEarnings: service.earnings,
        activeDrivers: Math.floor(Math.random() * 50 + 10),
        peakHours: index % 2 === 0 ? "11AM-2PM, 5PM-9PM" : "7AM-10AM, 6PM-10PM",
        icon: service.icon,
      };
    });

    setDemandData(mockData);
  };

  const generateBusySpots = (location: UserLocation) => {
    const busyPlaces = [
      {
        name: "Dallas/Fort Worth International Airport",
        type: "Airport",
        busyLevel: "very_busy" as const,
        rating: 4.2,
        totalRatings: 15420,
        peakHours: ["6AM-9AM", "5PM-8PM"],
        currentWaitTime: "15-20 min",
      },
      {
        name: "American Airlines Center",
        type: "Sports Arena",
        busyLevel: "busy" as const,
        rating: 4.5,
        totalRatings: 8932,
        peakHours: ["7PM-11PM"],
        currentWaitTime: "10-15 min",
      },
      {
        name: "Deep Ellum",
        type: "Entertainment District",
        busyLevel: "busy" as const,
        rating: 4.3,
        totalRatings: 5621,
        peakHours: ["8PM-2AM"],
        currentWaitTime: "5-10 min",
      },
      {
        name: "Dallas Convention Center",
        type: "Convention Center",
        busyLevel: "moderate" as const,
        rating: 4.1,
        totalRatings: 3245,
        peakHours: ["9AM-5PM"],
      },
      {
        name: "Galleria Dallas",
        type: "Shopping Mall",
        busyLevel: "moderate" as const,
        rating: 4.4,
        totalRatings: 7832,
        peakHours: ["12PM-8PM"],
        currentWaitTime: "5-8 min",
      },
      {
        name: "AT&T Stadium",
        type: "Stadium",
        busyLevel: "very_busy" as const,
        rating: 4.6,
        totalRatings: 12543,
        peakHours: ["12PM-6PM"],
        currentWaitTime: "20-30 min",
      },
      {
        name: "Dallas Love Field Airport",
        type: "Airport",
        busyLevel: "busy" as const,
        rating: 4.0,
        totalRatings: 9876,
        peakHours: ["6AM-10AM", "4PM-7PM"],
        currentWaitTime: "8-12 min",
      },
      {
        name: "West End Historic District",
        type: "Historic District",
        busyLevel: "moderate" as const,
        rating: 4.2,
        totalRatings: 2134,
        peakHours: ["11AM-3PM", "7PM-10PM"],
      },
    ];

    const mockBusySpots: BusySpot[] = busyPlaces.map((place, index) => {
      // Generate realistic coordinates around Dallas
      const offset = 0.1; // Larger offset for more spread
      const lat = location.lat + (Math.random() - 0.5) * offset;
      const lng = location.lng + (Math.random() - 0.5) * offset;

      return {
        id: `busy-${index}`,
        name: place.name,
        type: place.type,
        lat,
        lng,
        busyLevel: place.busyLevel,
        rating: place.rating,
        totalRatings: place.totalRatings,
        peakHours: place.peakHours,
        currentWaitTime: place.currentWaitTime,
        popularTimes: Array.from({ length: 24 }, () => Math.floor(Math.random() * 100)),
      };
    });

    setBusySpots(mockBusySpots);
  };

  const getDemandColor = (demand: string) => {
    switch (demand) {
      case "high":
        return "bg-red-100 text-red-800 border-red-200";
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "low":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getDemandIcon = (demand: string) => {
    switch (demand) {
      case "high":
        return <TrendingUp className="size-3 text-red-600" />;
      case "medium":
        return <TrendingUp className="size-3 text-yellow-600" />;
      case "low":
        return <TrendingUp className="size-3 text-green-600" />;
      default:
        return <TrendingUp className="size-3 text-gray-600" />;
    }
  };

  const toggleFullscreen = () => {
    if (!isFullscreen) {
      // Enter fullscreen
      if (fullscreenRef.current?.requestFullscreen) {
        fullscreenRef.current.requestFullscreen();
      } else if ((fullscreenRef.current as any)?.webkitRequestFullscreen) {
        (fullscreenRef.current as any).webkitRequestFullscreen();
      } else if ((fullscreenRef.current as any)?.msRequestFullscreen) {
        (fullscreenRef.current as any).msRequestFullscreen();
      }
      setIsFullscreen(true);
    } else {
      // Exit fullscreen
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if ((document as any).webkitExitFullscreen) {
        (document as any).webkitExitFullscreen();
      } else if ((document as any).msExitFullscreen) {
        (document as any).msExitFullscreen();
      }
      setIsFullscreen(false);
    }
  };

  // Handle fullscreen change events
  useEffect(() => {
    const handleFullscreenChange = () => {
      const isCurrentlyFullscreen = !!(
        document.fullscreenElement ||
        (document as any).webkitFullscreenElement ||
        (document as any).msFullscreenElement
      );
      setIsFullscreen(isCurrentlyFullscreen);
      
      // Trigger map resize when entering/exiting fullscreen
      if (mapInstanceRef.current) {
        setTimeout(() => {
          window.google?.maps?.event?.trigger(mapInstanceRef.current, 'resize');
        }, 100);
      }
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('msfullscreenchange', handleFullscreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.removeEventListener('msfullscreenchange', handleFullscreenChange);
    };
  }, []);

  if (isLoading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="size-5" />
            Live Demand Map
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <span className="ml-3 text-sm text-muted-foreground">Loading demand data...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div ref={fullscreenRef} className={isFullscreen ? "fixed inset-0 z-50 bg-white dark:bg-gray-900" : ""}>
      <Card className={isFullscreen ? "h-full border-none shadow-none" : "w-full"}>
        <CardHeader className={isFullscreen ? "pb-2" : ""}>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Navigation className="size-5" />
              Live Demand & Busy Spots
            </CardTitle>
            <div className="flex items-center gap-2">
              {userLocation && (
                <Badge variant="outline" className="flex items-center gap-1">
                  <MapPin className="size-3" />
                  {userLocation.city}, {userLocation.state}
                </Badge>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={toggleFullscreen}
                className="text-xs"
                title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
              >
                {isFullscreen ? <Minimize2 className="size-4" /> : <Maximize2 className="size-4" />}
              </Button>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Real-time traffic, demand hotspots, and busy places
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowBusySpots(!showBusySpots)}
              className="text-xs"
            >
              {showBusySpots ? 'Hide' : 'Show'} Busy Spots
            </Button>
          </div>
        </CardHeader>
      <CardContent className={`space-y-4 ${isFullscreen ? 'flex-1 pb-2' : ''}`}>
        {locationError && (
          <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-yellow-800">{locationError}</p>
            <p className="text-xs text-yellow-600 mt-1">
              {locationError.includes('maps') ? 'Add NEXT_PUBLIC_GOOGLE_MAPS_API_KEY to .env.local' : 'Showing default location data'}
            </p>
          </div>
        )}

        {/* Google Maps Container */}
        <div className="relative">
          <div 
            ref={mapRef}
            className={`w-full rounded-lg border bg-gray-100 dark:bg-gray-800 ${
              isFullscreen ? 'h-[calc(100vh-120px)]' : 'h-80'
            }`}
            style={{ minHeight: isFullscreen ? 'calc(100vh - 120px)' : '320px' }}
          >
            {!mapLoaded && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
                  <p className="text-sm text-muted-foreground">Loading map...</p>
                </div>
              </div>
            )}
          </div>
          
          {/* Map Legend - Transparent */}
          <div className="absolute top-3 right-3 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm rounded-lg shadow-lg border border-white/20 p-3 text-xs hidden sm:block">
            {isFullscreen && (
              <div className="flex justify-end mb-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleFullscreen}
                  className="h-6 w-6 p-0 hover:bg-gray-200/50"
                  title="Exit Fullscreen"
                >
                  <X className="size-3" />
                </Button>
              </div>
            )}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                <span>Your Location</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <span>High Demand</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <span>Medium Demand</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span>Low Demand</span>
              </div>
              <div className="border-t pt-2 mt-2">
                <div className="text-xs font-medium mb-1">Busy Spots:</div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-red-600" style={{clipPath: 'polygon(0% 0%, 100% 50%, 0% 100%)'}}></div>
                  <span>Very Busy</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-orange-600" style={{clipPath: 'polygon(0% 0%, 100% 50%, 0% 100%)'}}></div>
                  <span>Busy</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-yellow-600" style={{clipPath: 'polygon(0% 0%, 100% 50%, 0% 100%)'}}></div>
                  <span>Moderate</span>
                </div>
              </div>
              <div className="border-t pt-2 mt-2">
                <div className="text-xs font-medium mb-1">Traffic:</div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-1 bg-green-500"></div>
                  <span>Free Flow</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-1 bg-yellow-500"></div>
                  <span>Slow Traffic</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-1 bg-red-500"></div>
                  <span>Heavy Traffic</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Traffic data updated: {new Date().toLocaleTimeString()}</span>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => {
                if (userLocation) {
                  generateMockDemandData(userLocation);
                  generateBusySpots(userLocation);
                  if (mapInstanceRef.current) {
                    // Re-center map on user location
                    mapInstanceRef.current.setCenter({ lat: userLocation.lat, lng: userLocation.lng });
                  }
                }
              }}
              className="text-xs"
            >
              Refresh Data
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
    </div>
  );
}
