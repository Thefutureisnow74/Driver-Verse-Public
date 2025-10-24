"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BusinessType, BusinessStatus } from "@/generated/prisma";
import { BusinessProfile } from "@/hooks/use-business";

interface BusinessProfileFormProps {
  profile?: BusinessProfile | null;
  onSubmit: (profileData: any) => void;
  onCancel: () => void;
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

export function BusinessProfileForm({ profile, onSubmit, onCancel }: BusinessProfileFormProps) {
  const [companyName, setCompanyName] = useState("");
  const [businessType, setBusinessType] = useState<BusinessType>(BusinessType.LLC);
  const [state, setState] = useState("");
  const [status, setStatus] = useState<BusinessStatus>(BusinessStatus.ACTIVE);
  const [formationDate, setFormationDate] = useState("");
  const [ein, setEin] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [website, setWebsite] = useState("");
  const [streetAddress, setStreetAddress] = useState("");
  const [city, setCity] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [description, setDescription] = useState("");
  const [industry, setIndustry] = useState("");
  const [employeeCount, setEmployeeCount] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Populate form if editing
  useEffect(() => {
    if (profile) {
      setCompanyName(profile.companyName);
      setBusinessType(profile.businessType);
      setState(profile.state);
      setStatus(profile.status);
      setFormationDate(profile.formationDate ? new Date(profile.formationDate).toISOString().split('T')[0] : "");
      setEin(profile.ein || "");
      setPhoneNumber(profile.phoneNumber || "");
      setEmail(profile.email || "");
      setWebsite(profile.website || "");
      setStreetAddress(profile.streetAddress || "");
      setCity(profile.city || "");
      setZipCode(profile.zipCode || "");
      setDescription(profile.description || "");
      setIndustry(profile.industry || "");
      setEmployeeCount(profile.employeeCount || "");
    }
  }, [profile]);

  const getBusinessTypeLabel = (type: BusinessType) => {
    switch (type) {
      case BusinessType.LLC:
        return "LLC";
      case BusinessType.CORPORATION:
        return "Corporation";
      case BusinessType.S_CORP:
        return "S-Corp";
      case BusinessType.C_CORP:
        return "C-Corp";
      case BusinessType.PARTNERSHIP:
        return "Partnership";
      case BusinessType.SOLE_PROPRIETORSHIP:
        return "Sole Proprietorship";
      case BusinessType.NON_PROFIT:
        return "Non-Profit";
      case BusinessType.OTHER:
        return "Other";
      default:
        return type;
    }
  };

  const getStatusLabel = (status: BusinessStatus) => {
    switch (status) {
      case BusinessStatus.ACTIVE:
        return "Active";
      case BusinessStatus.INACTIVE:
        return "Inactive";
      case BusinessStatus.DISSOLVED:
        return "Dissolved";
      case BusinessStatus.PENDING:
        return "Pending";
      default:
        return status;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!companyName || !businessType || !state) {
      return;
    }

    try {
      setIsLoading(true);
      await onSubmit({
        companyName,
        businessType,
        state,
        status,
        formationDate: formationDate || null,
        ein: ein || null,
        phoneNumber: phoneNumber || null,
        email: email || null,
        website: website || null,
        streetAddress: streetAddress || null,
        city: city || null,
        zipCode: zipCode || null,
        description: description || null,
        industry: industry || null,
        employeeCount: employeeCount || null,
      });
    } catch (error) {
      console.error('Failed to save business profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Quick Setup Header */}
      <div className="border-b pb-4">
        <h3 className="text-lg font-medium">Quick Setup</h3>
        <p className="text-sm text-muted-foreground mt-1">
          Enter basic information to create your business profile. You can add more details after creation.
        </p>
      </div>

      {/* Basic Information */}
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="companyName">Company Name *</Label>
          <Input
            id="companyName"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            placeholder="Enter company name"
            required
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="businessType">Business Type *</Label>
            <Select value={businessType} onValueChange={(value) => setBusinessType(value as BusinessType)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="z-[220]">
                <SelectItem value={BusinessType.LLC}>LLC</SelectItem>
                <SelectItem value={BusinessType.CORPORATION}>Corporation</SelectItem>
                <SelectItem value={BusinessType.S_CORP}>S-Corp</SelectItem>
                <SelectItem value={BusinessType.C_CORP}>C-Corp</SelectItem>
                <SelectItem value={BusinessType.PARTNERSHIP}>Partnership</SelectItem>
                <SelectItem value={BusinessType.SOLE_PROPRIETORSHIP}>Sole Proprietorship</SelectItem>
                <SelectItem value={BusinessType.NON_PROFIT}>Non-Profit</SelectItem>
                <SelectItem value={BusinessType.OTHER}>Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="state">State *</Label>
            <Select value={state} onValueChange={setState}>
              <SelectTrigger>
                <SelectValue placeholder="Select state" />
              </SelectTrigger>
              <SelectContent className="z-[220] max-h-60">
                {US_STATES.map((stateName) => (
                  <SelectItem key={stateName} value={stateName}>
                    {stateName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="status">Status *</Label>
            <Select value={status} onValueChange={(value) => setStatus(value as BusinessStatus)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="z-[220]">
                <SelectItem value={BusinessStatus.ACTIVE}>Active</SelectItem>
                <SelectItem value={BusinessStatus.INACTIVE}>Inactive</SelectItem>
                <SelectItem value={BusinessStatus.DISSOLVED}>Dissolved</SelectItem>
                <SelectItem value={BusinessStatus.PENDING}>Pending</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="formationDate">Formation Date</Label>
            <Input
              id="formationDate"
              type="date"
              value={formationDate}
              onChange={(e) => setFormationDate(e.target.value)}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="ein">EIN</Label>
          <Input
            id="ein"
            value={ein}
            onChange={(e) => setEin(e.target.value)}
            placeholder="XX-XXXXXXX"
          />
        </div>
      </div>

      {/* Contact Information */}
      <div className="space-y-4 border-t pt-4">
        <h4 className="font-medium">Contact Information</h4>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="phoneNumber">Phone Number</Label>
            <Input
              id="phoneNumber"
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="(555) 123-4567"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="info@company.com"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="website">Website</Label>
          <Input
            id="website"
            type="url"
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
            placeholder="https://www.company.com"
          />
        </div>

        {/* Address */}
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="streetAddress">Street Address</Label>
            <Input
              id="streetAddress"
              value={streetAddress}
              onChange={(e) => setStreetAddress(e.target.value)}
              placeholder="123 Main Street"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="New York"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="zipCode">ZIP Code</Label>
              <Input
                id="zipCode"
                value={zipCode}
                onChange={(e) => setZipCode(e.target.value)}
                placeholder="10001"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Additional Information */}
      <div className="space-y-4 border-t pt-4">
        <h4 className="font-medium">Additional Information</h4>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="industry">Industry</Label>
            <Input
              id="industry"
              value={industry}
              onChange={(e) => setIndustry(e.target.value)}
              placeholder="Transportation & Logistics"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="employeeCount">Employee Count</Label>
            <Select value={employeeCount} onValueChange={setEmployeeCount}>
              <SelectTrigger>
                <SelectValue placeholder="Select size" />
              </SelectTrigger>
              <SelectContent className="z-[220]">
                <SelectItem value="1">1 (Just me)</SelectItem>
                <SelectItem value="2-10">2-10 employees</SelectItem>
                <SelectItem value="11-50">11-50 employees</SelectItem>
                <SelectItem value="51-200">51-200 employees</SelectItem>
                <SelectItem value="201-500">201-500 employees</SelectItem>
                <SelectItem value="500+">500+ employees</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Business Description</Label>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Brief description of your business..."
            rows={3}
          />
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button type="submit" disabled={isLoading} className="flex-1">
          {isLoading ? "Saving..." : profile ? "Update Profile" : "Create Profile"}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
          Cancel
        </Button>
      </div>
    </form>
  );
}
