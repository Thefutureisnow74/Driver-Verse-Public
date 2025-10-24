import { NextRequest, NextResponse } from 'next/server';

export interface WeatherData {
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

// Mock weather data - in production, you'd use services like OpenWeatherMap API
async function getWeatherData(location: string = "San Francisco"): Promise<WeatherData> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 200));

  // Mock traffic levels based on current time
  const hour = new Date().getHours();
  let trafficStatus: "Light Traffic" | "Moderate Traffic" | "Heavy Traffic";
  
  if ((hour >= 7 && hour <= 9) || (hour >= 17 && hour <= 19)) {
    trafficStatus = "Heavy Traffic";
  } else if ((hour >= 11 && hour <= 14) || (hour >= 20 && hour <= 22)) {
    trafficStatus = "Moderate Traffic";
  } else {
    trafficStatus = "Light Traffic";
  }

  // Mock weather based on location and time
  const mockWeatherData: Record<string, { temp: number; condition: string; windSpeed: string }> = {
    "Dallas, TX": { temp: 72, condition: "Partly Cloudy", windSpeed: "8mph" },
    "San Francisco": { temp: 68, condition: "Foggy", windSpeed: "12mph" },
    "Los Angeles": { temp: 78, condition: "Sunny", windSpeed: "6mph" },
    "New York": { temp: 65, condition: "Cloudy", windSpeed: "10mph" },
    "Chicago": { temp: 58, condition: "Windy", windSpeed: "15mph" },
    "Miami": { temp: 82, condition: "Sunny", windSpeed: "9mph" },
  };

  const weather = mockWeatherData[location] || mockWeatherData["Dallas, TX"];
  
  // Generate 7-day forecast matching the example format
  const forecast: DayForecast[] = [
    { day: 'Today', high: 75, low: 52, precipitation: 10, condition: 'Partly Cloudy' },
    { day: 'Wed', high: 78, low: 55, precipitation: 0, condition: 'Sunny' },
    { day: 'Thu', high: 73, low: 48, precipitation: 65, condition: 'Rainy' },
    { day: 'Fri', high: 69, low: 45, precipitation: 20, condition: 'Cloudy' },
    { day: 'Sat', high: 76, low: 51, precipitation: 15, condition: 'Partly Cloudy' },
  ];
  
  return {
    location,
    temperature: `${weather.temp}°`,
    condition: weather.condition,
    trafficStatus,
    notifications: Math.floor(Math.random() * 5) + 1, // Random 1-5 notifications
    forecast,
    windSpeed: weather.windSpeed,
  };
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const location = searchParams.get('location') || 'San Francisco';
    
    const weatherData = await getWeatherData(location);
    
    return NextResponse.json(weatherData);
  } catch (error) {
    console.error('Weather API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch weather data' },
      { status: 500 }
    );
  }
}

// For real weather integration, you would use something like:
/*
async function getRealWeatherData(location: string): Promise<WeatherData> {
  const API_KEY = process.env.OPENWEATHER_API_KEY;
  const response = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${API_KEY}&units=imperial`
  );
  
  if (!response.ok) {
    throw new Error('Weather API request failed');
  }
  
  const data = await response.json();
  
  return {
    location: data.name,
    temperature: `${Math.round(data.main.temp)}°F`,
    condition: data.weather[0].main,
    trafficStatus: await getTrafficStatus(location), // Separate traffic API call
    notifications: await getNotificationCount(),
  };
}
*/
