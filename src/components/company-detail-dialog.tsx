"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Building2, 
  MapPin, 
  DollarSign, 
  Car, 
  Users, 
  Calendar, 
  Globe, 
  Phone, 
  Mail,
  ExternalLink,
  FileText
} from "lucide-react";

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

interface CompanyDetailDialogProps {
  company: Company;
  onClose: () => void;
  onStatusUpdate: () => void;
  onOpenNotes: () => void;
}

export function CompanyDetailDialog({ company, onClose, onStatusUpdate, onOpenNotes }: CompanyDetailDialogProps) {

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Researching": return "bg-blue-100 text-blue-800";
      case "Applied": return "bg-yellow-100 text-yellow-800";
      case "Wait List": return "bg-orange-100 text-orange-800";
      case "Active": return "bg-green-100 text-green-800";
      case "Other": return "bg-gray-100 text-gray-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

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

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto w-[95vw] sm:w-full">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 md:gap-3">
            <Building2 className="w-5 h-5 md:w-6 md:h-6" />
            <span className="text-lg md:text-xl truncate">{company.name}</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Status Display & Notes Button */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Your Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {company.userStatuses?.[0] ? (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium">Current Status:</span>
                    <Badge className={getStatusColor(company.userStatuses[0].status)}>
                      {company.userStatuses[0].status}
                    </Badge>
                    {company.userStatuses[0].notes && (
                      <span className="text-sm text-gray-600">
                        (Has notes)
                      </span>
                    )}
                  </div>
                  <Button onClick={onOpenNotes} variant="outline" size="sm">
                    <FileText className="w-4 h-4 mr-2" />
                    Manage Notes & Status
                  </Button>
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">No status set yet</span>
                  <Button onClick={onOpenNotes} size="sm">
                    <FileText className="w-4 h-4 mr-2" />
                    Set Status & Notes
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Company Information Tabs */}
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="requirements">Requirements</TabsTrigger>
              <TabsTrigger value="contact">Contact</TabsTrigger>
              <TabsTrigger value="details">Details</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Service Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-gray-600">Service Type</label>
                      <div className="flex flex-wrap gap-1.5 mt-1 min-h-[1.5rem]">
                        {company.serviceVertical.map((vertical) => (
                          <Badge key={vertical} variant="outline" className="text-xs px-2 py-1 max-w-fit">
                            <span className="truncate">{vertical}</span>
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Contract Type</label>
                      <div className="mt-1">
                        <Badge className={`${getContractTypeColor(company.contractType)} text-xs px-2 py-1 max-w-fit`}>
                          <span className="truncate">{company.contractType}</span>
                        </Badge>
                      </div>
                    </div>
                    {company.averagePay && (
                      <div>
                        <label className="text-sm font-medium text-gray-600">Average Pay</label>
                        <div className="flex items-center gap-2 mt-1">
                          <DollarSign className="w-4 h-4 text-green-600" />
                          <span className="font-medium">{company.averagePay}</span>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Vehicle Requirements</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-gray-600">Accepted Vehicle Types</label>
                      <div className="flex flex-wrap gap-1.5 mt-1 min-h-[1.5rem]">
                        {company.vehicleTypes.map((type) => (
                          <Badge key={type} variant="outline" className={`${getVehicleTypeColor(type)} text-xs px-2 py-1 max-w-fit`}>
                            <Car className="w-3 h-3 mr-1 flex-shrink-0" />
                            <span className="truncate">{type}</span>
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Service Areas</label>
                      <div className="flex items-center gap-2 mt-1">
                        <MapPin className="w-4 h-4 text-gray-500" />
                        <span>{company.areasServed.join(", ") || "Not specified"}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {company.description && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Description</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700">{company.description}</p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="requirements" className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Insurance & License</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {company.insuranceRequirements && (
                      <div>
                        <label className="text-sm font-medium text-gray-600">Insurance Requirements</label>
                        <p className="mt-1 text-gray-700">{company.insuranceRequirements}</p>
                      </div>
                    )}
                    {company.licenseRequirements && (
                      <div>
                        <label className="text-sm font-medium text-gray-600">License Requirements</label>
                        <p className="mt-1 text-gray-700">{company.licenseRequirements}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Certifications</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {company.certificationsRequired.length > 0 ? (
                      <div className="flex flex-wrap gap-1.5 min-h-[1.5rem]">
                        {company.certificationsRequired.map((cert) => (
                          <Badge key={cert} variant="secondary" className="text-xs px-2 py-1 max-w-fit">
                            <span className="truncate">{cert}</span>
                          </Badge>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500">No specific certifications required</p>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="contact" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Contact Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {company.website && (
                      <div className="flex items-center gap-3">
                        <Globe className="w-5 h-5 text-gray-500" />
                        <div>
                          <p className="text-sm font-medium">Website</p>
                          <a 
                            href={company.website} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline flex items-center gap-1"
                          >
                            {company.website}
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                      </div>
                    )}
                    {company.contactEmail && (
                      <div className="flex items-center gap-3">
                        <Mail className="w-5 h-5 text-gray-500" />
                        <div>
                          <p className="text-sm font-medium">Email</p>
                          <a 
                            href={`mailto:${company.contactEmail}`}
                            className="text-blue-600 hover:underline"
                          >
                            {company.contactEmail}
                          </a>
                        </div>
                      </div>
                    )}
                    {company.contactPhone && (
                      <div className="flex items-center gap-3">
                        <Phone className="w-5 h-5 text-gray-500" />
                        <div>
                          <p className="text-sm font-medium">Phone</p>
                          <a 
                            href={`tel:${company.contactPhone}`}
                            className="text-blue-600 hover:underline"
                          >
                            {company.contactPhone}
                          </a>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="details" className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Company Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-gray-600">Year Established</label>
                      <p className="mt-1">{company.yearEstablished || "Not specified"}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Company Size</label>
                      <p className="mt-1">{company.companySize || "Not specified"}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Headquarters</label>
                      <p className="mt-1">{company.headquarters || "Not specified"}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Business Model</label>
                      <p className="mt-1">{company.businessModel || "Not specified"}</p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Company Mission & Culture</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-gray-600">Company Mission</label>
                      <p className="mt-1 text-gray-700">
                        {company.companyMission || "Company mission and services information not available."}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Target Customers</label>
                      <p className="mt-1 text-gray-700">
                        {company.targetCustomers || "Target customer information not available."}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Company Culture</label>
                      <p className="mt-1 text-gray-700">
                        {company.companyCulture || "Company culture information not available."}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
}
