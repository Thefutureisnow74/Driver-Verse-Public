"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { 
  Building, 
  MapPin, 
  Calendar, 
  Hash,
  FileText,
  Edit,
  Save,
  X
} from "lucide-react";
import { BusinessProfile } from "@/hooks/use-business";
import { useState } from "react";
import { BusinessType, BusinessStatus } from "@/generated/prisma";

interface BusinessDetailCompanyProps {
  businessProfile: BusinessProfile;
}

const US_STATES = [
  "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut", "Delaware",
  "Florida", "Georgia", "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky",
  "Louisiana", "Maine", "Maryland", "Massachusetts", "Michigan", "Minnesota", "Mississippi",
  "Missouri", "Montana", "Nebraska", "Nevada", "New Hampshire", "New Jersey", "New Mexico",
  "New York", "North Carolina", "North Dakota", "Ohio", "Oklahoma", "Oregon", "Pennsylvania",
  "Rhode Island", "South Carolina", "South Dakota", "Tennessee", "Texas", "Utah", "Vermont",
  "Virginia", "Washington", "West Virginia", "Wisconsin", "Wyoming"
];

export function BusinessDetailCompany({ businessProfile }: BusinessDetailCompanyProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    companyName: businessProfile.companyName,
    businessType: businessProfile.businessType,
    ein: businessProfile.ein || "",
    state: businessProfile.state,
    formationDate: businessProfile.formationDate ? new Date(businessProfile.formationDate).toISOString().split('T')[0] : "",
    status: businessProfile.status,
    streetAddress: businessProfile.streetAddress || "",
    city: businessProfile.city || "",
    zipCode: businessProfile.zipCode || "",
    notes: businessProfile.description || ""
  });

  const handleSave = async () => {
    try {
      const response = await fetch(`/api/business/${businessProfile.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          companyName: formData.companyName,
          businessType: formData.businessType,
          ein: formData.ein,
          state: formData.state,
          formationDate: formData.formationDate,
          status: formData.status,
          streetAddress: formData.streetAddress,
          city: formData.city,
          zipCode: formData.zipCode,
          description: formData.notes,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save company information');
      }

      const updatedProfile = await response.json();
      console.log('Company information updated successfully:', updatedProfile);
      setIsEditing(false);
      
      // Optionally refresh the page or update parent component
      window.location.reload();
    } catch (error) {
      console.error('Error saving company information:', error);
      alert('Failed to save company information. Please try again.');
    }
  };

  const handleCancel = () => {
    setFormData({
      companyName: businessProfile.companyName,
      businessType: businessProfile.businessType,
      ein: businessProfile.ein || "",
      state: businessProfile.state,
      formationDate: businessProfile.formationDate ? new Date(businessProfile.formationDate).toISOString().split('T')[0] : "",
      status: businessProfile.status,
      streetAddress: businessProfile.streetAddress || "",
      city: businessProfile.city || "",
      zipCode: businessProfile.zipCode || "",
      notes: businessProfile.description || ""
    });
    setIsEditing(false);
  };

  const getBusinessTypeLabel = (type: BusinessType) => {
    switch (type) {
      case BusinessType.LLC: return "LLC";
      case BusinessType.CORPORATION: return "Corporation";
      case BusinessType.S_CORP: return "S-Corp";
      case BusinessType.C_CORP: return "C-Corp";
      case BusinessType.PARTNERSHIP: return "Partnership";
      case BusinessType.SOLE_PROPRIETORSHIP: return "Sole Proprietorship";
      case BusinessType.NON_PROFIT: return "Non-Profit";
      case BusinessType.OTHER: return "Other";
      default: return type;
    }
  };

  const getStatusLabel = (status: BusinessStatus) => {
    switch (status) {
      case BusinessStatus.ACTIVE: return "Active";
      case BusinessStatus.INACTIVE: return "Inactive";
      case BusinessStatus.DISSOLVED: return "Dissolved";
      case BusinessStatus.PENDING: return "Pending";
      default: return status;
    }
  };

  return (
    <div className="space-y-6">
      {/* Company Information */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Building className="w-5 h-5" />
            Company Information
          </CardTitle>
          {!isEditing ? (
            <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
              <Edit className="w-4 h-4 mr-2" />
              Edit
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handleCancel}>
                <X className="w-4 h-4 mr-2" />
                Cancel
              </Button>
              <Button size="sm" onClick={handleSave}>
                <Save className="w-4 h-4 mr-2" />
                Save
              </Button>
            </div>
          )}
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Company Name */}
            <div className="space-y-2">
              <Label htmlFor="companyName">Company Name</Label>
              {isEditing ? (
                <Input
                  id="companyName"
                  value={formData.companyName}
                  onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                />
              ) : (
                <p className="text-sm text-muted-foreground bg-muted p-2 rounded">
                  {businessProfile.companyName}
                </p>
              )}
            </div>

            {/* Business Type */}
            <div className="space-y-2">
              <Label htmlFor="businessType">Business Type</Label>
              {isEditing ? (
                <Select value={formData.businessType} onValueChange={(value) => setFormData({ ...formData, businessType: value as BusinessType })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select business type" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(BusinessType).map((type) => (
                      <SelectItem key={type} value={type}>
                        {getBusinessTypeLabel(type)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <p className="text-sm text-muted-foreground bg-muted p-2 rounded">
                  {getBusinessTypeLabel(businessProfile.businessType)}
                </p>
              )}
            </div>

            {/* EIN */}
            <div className="space-y-2">
              <Label htmlFor="ein">EIN</Label>
              {isEditing ? (
                <Input
                  id="ein"
                  placeholder="12-3456789"
                  value={formData.ein}
                  onChange={(e) => setFormData({ ...formData, ein: e.target.value })}
                />
              ) : (
                <p className="text-sm text-muted-foreground bg-muted p-2 rounded font-mono">
                  {businessProfile.ein || "Not provided"}
                </p>
              )}
            </div>

            {/* State of Organization */}
            <div className="space-y-2">
              <Label htmlFor="state">State of Organization</Label>
              {isEditing ? (
                <Select value={formData.state} onValueChange={(value) => setFormData({ ...formData, state: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select state" />
                  </SelectTrigger>
                  <SelectContent>
                    {US_STATES.map((state) => (
                      <SelectItem key={state} value={state}>
                        {state}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <p className="text-sm text-muted-foreground bg-muted p-2 rounded">
                  {businessProfile.state}
                </p>
              )}
            </div>

            {/* Formation Date */}
            <div className="space-y-2">
              <Label htmlFor="formationDate">Formation Date</Label>
              {isEditing ? (
                <Input
                  id="formationDate"
                  type="date"
                  value={formData.formationDate}
                  onChange={(e) => setFormData({ ...formData, formationDate: e.target.value })}
                />
              ) : (
                <p className="text-sm text-muted-foreground bg-muted p-2 rounded">
                  {businessProfile.formationDate 
                    ? new Date(businessProfile.formationDate).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })
                    : "Not provided"
                  }
                </p>
              )}
            </div>

            {/* Status */}
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              {isEditing ? (
                <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value as BusinessStatus })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(BusinessStatus).map((status) => (
                      <SelectItem key={status} value={status}>
                        {getStatusLabel(status)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <p className="text-sm text-muted-foreground bg-muted p-2 rounded">
                  {getStatusLabel(businessProfile.status)}
                </p>
              )}
            </div>
          </div>

          {/* Address Section */}
          <div className="space-y-4">
            <h4 className="text-sm font-medium flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              Business Address
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Street Address */}
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="streetAddress">Street Address</Label>
                {isEditing ? (
                  <Input
                    id="streetAddress"
                    placeholder="123 Main Street"
                    value={formData.streetAddress}
                    onChange={(e) => setFormData({ ...formData, streetAddress: e.target.value })}
                  />
                ) : (
                  <p className="text-sm text-muted-foreground bg-muted p-2 rounded">
                    {businessProfile.streetAddress || "Not provided"}
                  </p>
                )}
              </div>

              {/* City */}
              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                {isEditing ? (
                  <Input
                    id="city"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  />
                ) : (
                  <p className="text-sm text-muted-foreground bg-muted p-2 rounded">
                    {businessProfile.city || "Not provided"}
                  </p>
                )}
              </div>

              {/* State (for address) */}
              <div className="space-y-2">
                <Label>State</Label>
                <p className="text-sm text-muted-foreground bg-muted p-2 rounded">
                  {businessProfile.state}
                </p>
              </div>

              {/* ZIP Code */}
              <div className="space-y-2">
                <Label htmlFor="zipCode">ZIP Code</Label>
                {isEditing ? (
                  <Input
                    id="zipCode"
                    placeholder="30309"
                    value={formData.zipCode}
                    onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
                  />
                ) : (
                  <p className="text-sm text-muted-foreground bg-muted p-2 rounded">
                    {businessProfile.zipCode || "Not provided"}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            {isEditing ? (
              <Textarea
                id="notes"
                placeholder="Additional notes about the company..."
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                rows={3}
              />
            ) : (
              <p className="text-sm text-muted-foreground bg-muted p-3 rounded min-h-[80px]">
                {businessProfile.description || "No notes provided"}
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
