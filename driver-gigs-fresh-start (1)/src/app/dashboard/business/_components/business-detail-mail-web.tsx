"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { 
  Globe, 
  Mail, 
  MapPin,
  DollarSign,
  Calendar,
  Edit,
  Save,
  X,
  ExternalLink
} from "lucide-react";
import { BusinessProfile } from "@/hooks/use-business";
import { useState } from "react";

interface BusinessDetailMailWebProps {
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

export function BusinessDetailMailWeb({ businessProfile }: BusinessDetailMailWebProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    // Website Information
    website: businessProfile.mailWebInfo?.website || businessProfile.website || "",
    websiteHost: businessProfile.mailWebInfo?.websiteHost || "",
    websiteHostLogin: businessProfile.mailWebInfo?.websiteHostLogin || "",
    domainName: businessProfile.mailWebInfo?.domainName || "",
    domainRenewalDate: businessProfile.mailWebInfo?.domainRenewalDate || "",
    websiteHostAnnualRenewalDate: businessProfile.mailWebInfo?.websiteHostAnnualRenewalDate || "",
    
    // Mailbox Information
    mailboxProvider: businessProfile.mailWebInfo?.mailboxProvider || "",
    mailboxRenewalDate: businessProfile.mailWebInfo?.mailboxRenewalDate || "",
    mailboxProviderAddress: businessProfile.mailWebInfo?.mailboxProviderAddress || "",
    mailboxMonthlyCost: businessProfile.mailWebInfo?.mailboxMonthlyCost || "",
    mailboxProviderCity: businessProfile.mailWebInfo?.mailboxProviderCity || "",
    mailboxProviderState: businessProfile.mailWebInfo?.mailboxProviderState || businessProfile.state,
    mailboxProviderZip: businessProfile.mailWebInfo?.mailboxProviderZip || "",
    mailboxPhone: businessProfile.mailWebInfo?.mailboxPhone || "",
    
    notes: businessProfile.mailWebInfo?.notes || ""
  });

  const handleSave = async () => {
    try {
      const response = await fetch(`/api/business/${businessProfile.id}/tabs`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tabType: 'mail-web',
          data: formData,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save mail/web information');
      }

      const result = await response.json();
      console.log('Mail/web information updated successfully:', result);
      setIsEditing(false);
      
      // Optionally refresh the page or update parent component
      window.location.reload();
    } catch (error) {
      console.error('Error saving mail/web information:', error);
      alert('Failed to save mail/web information. Please try again.');
    }
  };

  const handleCancel = () => {
    setFormData({
      website: businessProfile.website || "",
      websiteHost: "",
      websiteHostLogin: "",
      domainName: "",
      domainRenewalDate: "",
      websiteHostAnnualRenewalDate: "",
      mailboxProvider: "",
      mailboxRenewalDate: "",
      mailboxProviderAddress: "",
      mailboxMonthlyCost: "",
      mailboxProviderCity: "",
      mailboxProviderState: businessProfile.state,
      mailboxProviderZip: "",
      mailboxPhone: "",
      notes: ""
    });
    setIsEditing(false);
  };

  return (
    <div className="space-y-6">
      {/* Mail & Web Services */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Globe className="w-5 h-5" />
            Mail & Web Services
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
          {/* Website Information */}
          <div className="space-y-4">
            <h4 className="text-sm font-medium flex items-center gap-2">
              <Globe className="w-4 h-4" />
              Website Information
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Website */}
              <div className="space-y-2">
                <Label htmlFor="website">Website</Label>
                {isEditing ? (
                  <div className="flex gap-2">
                    <Input
                      id="website"
                      placeholder="https://yourcompany.com"
                      value={formData.website}
                      onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                    />
                    {formData.website && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(formData.website, '_blank')}
                      >
                        <ExternalLink className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <p className="text-sm text-muted-foreground bg-muted p-2 rounded flex-1">
                      {formData.website || "Not provided"}
                    </p>
                    {formData.website && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(formData.website, '_blank')}
                      >
                        <ExternalLink className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                )}
              </div>

              {/* Website Host */}
              <div className="space-y-2">
                <Label htmlFor="websiteHost">Website Host</Label>
                {isEditing ? (
                  <Input
                    id="websiteHost"
                    placeholder="Hosting provider"
                    value={formData.websiteHost}
                    onChange={(e) => setFormData({ ...formData, websiteHost: e.target.value })}
                  />
                ) : (
                  <p className="text-sm text-muted-foreground bg-muted p-2 rounded">
                    {formData.websiteHost || "Not provided"}
                  </p>
                )}
              </div>

              {/* Website Host Login */}
              <div className="space-y-2">
                <Label htmlFor="websiteHostLogin">Website Host Login</Label>
                {isEditing ? (
                  <Input
                    id="websiteHostLogin"
                    placeholder="Hosting login credentials"
                    value={formData.websiteHostLogin}
                    onChange={(e) => setFormData({ ...formData, websiteHostLogin: e.target.value })}
                  />
                ) : (
                  <p className="text-sm text-muted-foreground bg-muted p-2 rounded">
                    {formData.websiteHostLogin || "Not provided"}
                  </p>
                )}
              </div>

              {/* Domain Name */}
              <div className="space-y-2">
                <Label htmlFor="domainName">Domain Name</Label>
                {isEditing ? (
                  <Input
                    id="domainName"
                    placeholder="yourcompany.com"
                    value={formData.domainName}
                    onChange={(e) => setFormData({ ...formData, domainName: e.target.value })}
                  />
                ) : (
                  <p className="text-sm text-muted-foreground bg-muted p-2 rounded">
                    {formData.domainName || "Not provided"}
                  </p>
                )}
              </div>

              {/* Domain Renewal Date */}
              <div className="space-y-2">
                <Label htmlFor="domainRenewalDate">Domain Renewal Date</Label>
                {isEditing ? (
                  <Input
                    id="domainRenewalDate"
                    type="date"
                    value={formData.domainRenewalDate}
                    onChange={(e) => setFormData({ ...formData, domainRenewalDate: e.target.value })}
                  />
                ) : (
                  <p className="text-sm text-muted-foreground bg-muted p-2 rounded">
                    {formData.domainRenewalDate 
                      ? new Date(formData.domainRenewalDate).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })
                      : "Not provided"
                    }
                  </p>
                )}
              </div>

              {/* Website Host Annual Renewal Date */}
              <div className="space-y-2">
                <Label htmlFor="websiteHostAnnualRenewalDate">Website Host Annual Renewal Date</Label>
                {isEditing ? (
                  <Input
                    id="websiteHostAnnualRenewalDate"
                    type="date"
                    value={formData.websiteHostAnnualRenewalDate}
                    onChange={(e) => setFormData({ ...formData, websiteHostAnnualRenewalDate: e.target.value })}
                  />
                ) : (
                  <p className="text-sm text-muted-foreground bg-muted p-2 rounded">
                    {formData.websiteHostAnnualRenewalDate 
                      ? new Date(formData.websiteHostAnnualRenewalDate).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })
                      : "Not provided"
                    }
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Mailbox Information */}
          <div className="space-y-4">
            <h4 className="text-sm font-medium flex items-center gap-2">
              <Mail className="w-4 h-4" />
              Mailbox Information
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Mailbox Provider */}
              <div className="space-y-2">
                <Label htmlFor="mailboxProvider">Mailbox Provider</Label>
                {isEditing ? (
                  <Input
                    id="mailboxProvider"
                    placeholder="Mail service provider"
                    value={formData.mailboxProvider}
                    onChange={(e) => setFormData({ ...formData, mailboxProvider: e.target.value })}
                  />
                ) : (
                  <p className="text-sm text-muted-foreground bg-muted p-2 rounded">
                    {formData.mailboxProvider || "Not provided"}
                  </p>
                )}
              </div>

              {/* Mailbox Renewal Date */}
              <div className="space-y-2">
                <Label htmlFor="mailboxRenewalDate">Mailbox Renewal Date</Label>
                {isEditing ? (
                  <Input
                    id="mailboxRenewalDate"
                    type="date"
                    value={formData.mailboxRenewalDate}
                    onChange={(e) => setFormData({ ...formData, mailboxRenewalDate: e.target.value })}
                  />
                ) : (
                  <p className="text-sm text-muted-foreground bg-muted p-2 rounded">
                    {formData.mailboxRenewalDate 
                      ? new Date(formData.mailboxRenewalDate).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })
                      : "Not provided"
                    }
                  </p>
                )}
              </div>

              {/* Mailbox Monthly Cost */}
              <div className="space-y-2">
                <Label htmlFor="mailboxMonthlyCost">Mailbox Monthly Cost</Label>
                {isEditing ? (
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input
                      id="mailboxMonthlyCost"
                      placeholder="0.00"
                      value={formData.mailboxMonthlyCost}
                      onChange={(e) => setFormData({ ...formData, mailboxMonthlyCost: e.target.value })}
                      className="pl-10"
                    />
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground bg-muted p-2 rounded">
                    {formData.mailboxMonthlyCost ? `$${formData.mailboxMonthlyCost}` : "Not provided"}
                  </p>
                )}
              </div>

              {/* Mailbox Provider Address */}
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="mailboxProviderAddress">Mailbox Provider Address</Label>
                {isEditing ? (
                  <Input
                    id="mailboxProviderAddress"
                    placeholder="123 Provider Street"
                    value={formData.mailboxProviderAddress}
                    onChange={(e) => setFormData({ ...formData, mailboxProviderAddress: e.target.value })}
                  />
                ) : (
                  <p className="text-sm text-muted-foreground bg-muted p-2 rounded">
                    {formData.mailboxProviderAddress || "Not provided"}
                  </p>
                )}
              </div>

              {/* Mailbox Provider City */}
              <div className="space-y-2">
                <Label htmlFor="mailboxProviderCity">Mailbox Provider City</Label>
                {isEditing ? (
                  <Input
                    id="mailboxProviderCity"
                    placeholder="City name"
                    value={formData.mailboxProviderCity}
                    onChange={(e) => setFormData({ ...formData, mailboxProviderCity: e.target.value })}
                  />
                ) : (
                  <p className="text-sm text-muted-foreground bg-muted p-2 rounded">
                    {formData.mailboxProviderCity || "Not provided"}
                  </p>
                )}
              </div>

              {/* Mailbox Provider State */}
              <div className="space-y-2">
                <Label htmlFor="mailboxProviderState">Mailbox Provider State</Label>
                {isEditing ? (
                  <Select value={formData.mailboxProviderState} onValueChange={(value) => setFormData({ ...formData, mailboxProviderState: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="State" />
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
                    {formData.mailboxProviderState}
                  </p>
                )}
              </div>

              {/* Mailbox Provider ZIP */}
              <div className="space-y-2">
                <Label htmlFor="mailboxProviderZip">Mailbox Provider ZIP</Label>
                {isEditing ? (
                  <Input
                    id="mailboxProviderZip"
                    placeholder="12345"
                    value={formData.mailboxProviderZip}
                    onChange={(e) => setFormData({ ...formData, mailboxProviderZip: e.target.value })}
                  />
                ) : (
                  <p className="text-sm text-muted-foreground bg-muted p-2 rounded">
                    {formData.mailboxProviderZip || "Not provided"}
                  </p>
                )}
              </div>

              {/* Mailbox Phone */}
              <div className="space-y-2">
                <Label htmlFor="mailboxPhone">Mailbox Phone</Label>
                {isEditing ? (
                  <Input
                    id="mailboxPhone"
                    placeholder="Mailbox contact phone"
                    value={formData.mailboxPhone}
                    onChange={(e) => setFormData({ ...formData, mailboxPhone: e.target.value })}
                  />
                ) : (
                  <p className="text-sm text-muted-foreground bg-muted p-2 rounded">
                    {formData.mailboxPhone || "Not provided"}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="mailWebNotes">Notes</Label>
            {isEditing ? (
              <Textarea
                id="mailWebNotes"
                placeholder="Additional notes about mail and web services..."
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                rows={3}
              />
            ) : (
              <p className="text-sm text-muted-foreground bg-muted p-3 rounded min-h-[80px]">
                {formData.notes || "No notes provided"}
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
