"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Building2, FileText, MapPin, DollarSign, Car, Trash2, Loader2, Search, CheckCircle, Clock, AlertTriangle, Users } from "lucide-react";
import { toast } from "sonner";
import { getCompanyLogo, generateFallbackLogo } from "@/lib/domain-utils";

interface Company {
  id: string;
  name: string;
  vehicleTypes: string[];
  averagePay: string | null;
  serviceVertical: string[];
  contractType: string;
  areasServed: string[];
  insuranceRequirements: string | null;
  licenseRequirements: string | null;
  certificationsRequired: string[];
  website: string | null;
  contactEmail: string | null;
  contactPhone: string | null;
  description: string | null;
  logoUrl: string | null;
  isActive: boolean;
  workflowStatus: string | null;
  yearEstablished: string | null;
  companySize: string | null;
  headquarters: string | null;
  businessModel: string | null;
  companyMission: string | null;
  targetCustomers: string | null;
  companyCulture: string | null;
  videoUrl: string | null;
  userStatuses?: Array<{
    status: string;
    notes: string | null;
    updatedAt: string;
  }>;
}

interface CompanyCardProps {
  company: Company;
  onViewProfile: (company: Company) => void;
  onStatusChange?: (companyId: string, status: string) => void;
  onAddNotes?: (companyId: string) => void;
}

export function CompanyCard({ company, onViewProfile, onStatusChange, onAddNotes }: CompanyCardProps) {
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  const getContractTypeColor = (contractType: string) => {
    if (contractType.toLowerCase().includes("independent")) return "bg-blue-100 text-blue-800";
    if (contractType.toLowerCase().includes("employee")) return "bg-green-100 text-green-800";
    if (contractType.toLowerCase().includes("contract")) return "bg-purple-100 text-purple-800";
    return "bg-gray-100 text-gray-800";
  };

  const getVehicleTypeColor = (vehicleType: string) => {
    switch (vehicleType.toLowerCase()) {
      case "car": return "bg-blue-100 text-blue-800";
      case "truck": return "bg-red-100 text-red-800";
      case "van": return "bg-green-100 text-green-800";
      case "suv": return "bg-purple-100 text-purple-800";
      case "bicycle": return "bg-yellow-100 text-yellow-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const currentStatus = company.userStatuses?.[0]?.status || "";

  const handleStatusChange = async (newStatus: string) => {
    if (newStatus === currentStatus) return;
    
    setIsUpdatingStatus(true);
    toast.loading("Updating status...", { id: `status-${company.id}` });
    
    try {
      await onStatusChange?.(company.id, newStatus);
      toast.success("Status updated successfully!", { id: `status-${company.id}` });
    } catch (error) {
      toast.error("Failed to update status. Please try again.", { id: `status-${company.id}` });
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  return (
    <Card className="group relative overflow-hidden hover:shadow-2xl hover:shadow-blue-200/30 transition-all duration-500 hover:-translate-y-2 border border-gray-200/50 shadow-lg bg-gradient-to-br from-white via-blue-50/20 to-indigo-50/30 backdrop-blur-sm">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-blue-50/10 to-purple-50/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      {/* Top accent line */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      <CardHeader className="relative pb-3 p-4 md:p-6 bg-gradient-to-r from-transparent to-blue-50/20">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2 md:gap-3 min-w-0 flex-1">
            <div className="relative w-8 h-8 md:w-10 md:h-10 rounded-xl flex items-center justify-center flex-shrink-0 overflow-hidden bg-gradient-to-br from-white to-gray-100 shadow-md ring-1 ring-gray-200/50 group-hover:shadow-lg group-hover:ring-blue-300/50 transition-all duration-300">
              {/* Inner glow effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              {company.website ? (
                <img
                  src={getCompanyLogo(company.website)}
                  alt={`${company.name} logo`}
                  className="relative z-10 w-full h-full object-contain p-1 group-hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    // Fallback to generated logo with initials
                    console.log("Fallback to generated logo with initials", e);
                    e.currentTarget.src = generateFallbackLogo(company.name);
                  }}
                />
              ) : (
                <img
                  src={generateFallbackLogo(company.name)}
                  alt={`${company.name} logo`}
                  className="relative z-10 w-full h-full object-contain p-1 group-hover:scale-105 transition-transform duration-300"
                />
              )}
            </div>
            <div className="min-w-0 flex-1">
              <CardTitle className="text-base md:text-lg truncate group-hover:text-blue-700 transition-colors duration-300">{company.name}</CardTitle>
              <p className="text-xs md:text-sm text-gray-600 truncate group-hover:text-gray-700 transition-colors duration-300">{company.serviceVertical[0]}</p>
            </div>
          </div>
          {/* <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-700">
            <Trash2 className="w-4 h-4" />
          </Button> */}
        </div>
      </CardHeader>
      <CardContent className="relative space-y-3 md:space-y-4 p-4 md:p-6 pt-0 bg-gradient-to-b from-transparent to-gray-50/30">
        {/* Video Link Status */}
        <div className="flex items-center justify-between text-sm bg-white/50 backdrop-blur-sm rounded-lg p-3 border border-gray-200/50 shadow-sm group-hover:shadow-md group-hover:border-blue-200/50 transition-all duration-300">
          <span className={`flex items-center gap-2 font-medium ${company.videoUrl ? "text-green-600" : "text-gray-500"}`}>
            <div className={`w-2.5 h-2.5 rounded-full shadow-sm ${company.videoUrl ? "bg-green-500 shadow-green-200" : "bg-gray-400"}`}></div>
            {company.videoUrl ? "Video available" : "No video link"}
          </span>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-blue-50 hover:text-blue-600 hover:shadow-sm transition-all duration-200 rounded-lg">
            <FileText className="w-4 h-4" />
          </Button>
        </div>

        {/* Choose Action Dropdown */}
        <Select 
          value={currentStatus} 
          onValueChange={handleStatusChange}
          disabled={isUpdatingStatus}
        >
          <SelectTrigger className="w-full h-10 bg-white/70 backdrop-blur-sm border border-gray-200/50 shadow-sm hover:shadow-md hover:border-blue-300/50 hover:bg-white/90 transition-all duration-300 rounded-lg">
            <SelectValue placeholder="Choose Action" />
            {isUpdatingStatus && (
              <Loader2 className="w-4 h-4 animate-spin text-blue-500" />
            )}
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Researching" className="flex items-center gap-2">
              <div className="flex items-center gap-2 w-full">
                <Search className="w-4 h-4 text-blue-500" />
                <span>Researching</span>
              </div>
            </SelectItem>
            <SelectItem value="Applied" className="flex items-center gap-2">
              <div className="flex items-center gap-2 w-full">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>Applied</span>
              </div>
            </SelectItem>
            <SelectItem value="Wait List" className="flex items-center gap-2">
              <div className="flex items-center gap-2 w-full">
                <Clock className="w-4 h-4 text-yellow-500" />
                <span>Wait List</span>
              </div>
            </SelectItem>
            <SelectItem value="Active" className="flex items-center gap-2">
              <div className="flex items-center gap-2 w-full">
                <Users className="w-4 h-4 text-purple-500" />
                <span>Active</span>
              </div>
            </SelectItem>
            <SelectItem value="Other" className="flex items-center gap-2">
              <div className="flex items-center gap-2 w-full">
                <AlertTriangle className="w-4 h-4 text-gray-500" />
                <span>Other</span>
              </div>
            </SelectItem>
          </SelectContent>
        </Select>

        {/* Tags */}
        <TooltipProvider>
          <div className="flex flex-wrap gap-1.5 min-h-[2rem]">
            {company.averagePay && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Badge variant="secondary" className="bg-green-100 text-green-800 text-xs px-2 py-1 max-w-[120px] cursor-help hover:bg-green-200 hover:text-green-900 transition-all duration-200">
                    <DollarSign className="w-3 h-3 mr-1 flex-shrink-0" />
                    <span className="truncate">{company.averagePay}</span>
                  </Badge>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{company.averagePay}</p>
                </TooltipContent>
              </Tooltip>
            )}
            <Tooltip>
              <TooltipTrigger asChild>
                <Badge className={`${getContractTypeColor(company.contractType)} text-xs px-2 py-1 max-w-[120px] cursor-help hover:opacity-80 transition-all duration-200`}>
                  <span className="truncate">{company.contractType}</span>
                </Badge>
              </TooltipTrigger>
              <TooltipContent>
                <p>{company.contractType}</p>
              </TooltipContent>
            </Tooltip>
            {company.vehicleTypes.slice(0, 2).map((type) => (
              <Tooltip key={type}>
                <TooltipTrigger asChild>
                  <Badge variant="outline" className={`${getVehicleTypeColor(type)} text-xs px-2 py-1 max-w-[100px] cursor-help hover:opacity-80 transition-all duration-200`}>
                    <Car className="w-3 h-3 mr-1 flex-shrink-0" />
                    <span className="truncate">{type}</span>
                  </Badge>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{type}</p>
                </TooltipContent>
              </Tooltip>
            ))}
            {company.vehicleTypes.length > 2 && (
              <Badge variant="outline" className="text-xs px-2 py-1 hover:bg-gray-100 hover:border-gray-400 transition-all duration-200">
                +{company.vehicleTypes.length - 2}
              </Badge>
            )}
          </div>
        </TooltipProvider>

        {/* Location */}
        <div className="flex items-center gap-2 text-sm text-gray-600 group-hover:text-gray-700 transition-colors duration-300">
          <MapPin className="w-4 h-4 text-blue-500 group-hover:text-blue-600 transition-colors duration-300" />
          <span>{company.areasServed[0] || "Not specified"}</span>
          {company.areasServed.length > 1 && (
            <span className="text-xs bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded-full group-hover:bg-blue-200 transition-colors duration-300">+{company.areasServed.length - 1}</span>
          )}
        </div>

        {/* Additional Details */}
        {company.insuranceRequirements && (
          <p className="text-sm text-gray-600 truncate group-hover:text-gray-700 transition-colors duration-300">
            {company.insuranceRequirements}
          </p>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex-1 text-xs sm:text-sm hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700 transition-all duration-200 group/btn rounded-md"
            onClick={() => onViewProfile(company)}
          >
            <Building2 className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2 group-hover/btn:scale-110 transition-transform duration-200" />
            <span>Profile</span>
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            className="flex-1 text-xs sm:text-sm hover:bg-green-50 hover:border-green-300 hover:text-green-700 transition-all duration-200 group/btn rounded-md"
            onClick={() => onAddNotes?.(company.id)}
          >
            <FileText className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2 group-hover/btn:scale-110 transition-transform duration-200" />
            <span>Notes</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
