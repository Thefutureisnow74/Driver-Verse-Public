import { DashboardLayout } from "@/components/dashboard-layout";
import { DashboardCards } from "@/components/dashboard-cards";
import { GigBotAssistant } from "@/components/gigbot-assistant";
import { WeatherInfo } from "@/components/weather-info";
import { ConsultationCTA } from "@/components/consultation-cta";
import { LiveDemandMap } from "@/components/live-demand-map";

export default function DashboardPage() {
  return (
    <div className="w-full grid gap-6 lg:gap-8 lg:grid-cols-4">
      {/* First Section - Cards and Assistant */}
      <div className="lg:col-span-3 space-y-6 lg:space-y-8">
        {/* Dashboard Cards */}
        <DashboardCards />
        
        {/* GigBot Assistant */}
        <GigBotAssistant />
        
        {/* Live Demand Map */}
        <LiveDemandMap />
      </div>

      {/* Second Section - Weather and CTAs */}
      <div className="lg:col-span-1 space-y-6">
        {/* Weather Widget */}
        <WeatherInfo />
        
        {/* Consultation CTAs */}
        <ConsultationCTA />
      </div>
    </div>
  );
}
