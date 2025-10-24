"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { 
  Phone, 
  Mail, 
  MapPin,
  User,
  Building,
  Edit,
  Save,
  X
} from "lucide-react";
import { BusinessProfile } from "@/hooks/use-business";
import { useState } from "react";

interface BusinessDetailContactProps {
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

export function BusinessDetailContact({ businessProfile }: BusinessDetailContactProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    // Basic Contact
    companyPhone: businessProfile.contactInfo?.companyPhone || businessProfile.phoneNumber || "",
    businessEmail: businessProfile.contactInfo?.businessEmail || businessProfile.email || "",
    phoneProvider: businessProfile.contactInfo?.phoneProvider || "",
    emailLogin: businessProfile.contactInfo?.emailLogin || "",
    managingMembers: businessProfile.contactInfo?.managingMembers || "",
    
    // Physical Address
    physicalStreetAddress: businessProfile.contactInfo?.physicalStreetAddress || businessProfile.streetAddress || "",
    physicalCity: businessProfile.contactInfo?.physicalCity || businessProfile.city || "",
    physicalState: businessProfile.contactInfo?.physicalState || businessProfile.state,
    physicalZipCode: businessProfile.contactInfo?.physicalZipCode || businessProfile.zipCode || "",
    
    // Mailing Address
    mailingStreetAddress: businessProfile.contactInfo?.mailingStreetAddress || "",
    mailingCity: businessProfile.contactInfo?.mailingCity || "",
    mailingState: businessProfile.contactInfo?.mailingState || businessProfile.state,
    mailingZipCode: businessProfile.contactInfo?.mailingZipCode || "",
    
    // Primary Contact
    primaryContactName: businessProfile.contactInfo?.primaryContactName || "",
    primaryContactTitle: businessProfile.contactInfo?.primaryContactTitle || "",
    primaryContactPhone: businessProfile.contactInfo?.primaryContactPhone || "",
    primaryContactEmail: businessProfile.contactInfo?.primaryContactEmail || "",
    
    // Secondary Contact
    secondaryContactName: businessProfile.contactInfo?.secondaryContactName || "",
    secondaryContactTitle: businessProfile.contactInfo?.secondaryContactTitle || "",
    secondaryContactPhone: businessProfile.contactInfo?.secondaryContactPhone || "",
    secondaryContactEmail: businessProfile.contactInfo?.secondaryContactEmail || "",
    
    // Emergency Contact
    emergencyContactName: businessProfile.contactInfo?.emergencyContactName || "",
    emergencyContactPhone: businessProfile.contactInfo?.emergencyContactPhone || "",
    
    notes: businessProfile.contactInfo?.notes || ""
  });

  const handleSave = async () => {
    try {
      const response = await fetch(`/api/business/${businessProfile.id}/tabs`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tabType: 'contact',
          data: formData,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save contact information');
      }

      const result = await response.json();
      console.log('Contact information updated successfully:', result);
      setIsEditing(false);
      
      // Optionally refresh the page or update parent component
      window.location.reload();
    } catch (error) {
      console.error('Error saving contact information:', error);
      alert('Failed to save contact information. Please try again.');
    }
  };

  const handleCancel = () => {
    setFormData({
      companyPhone: businessProfile.phoneNumber || "",
      businessEmail: businessProfile.email || "",
      phoneProvider: "",
      emailLogin: "",
      managingMembers: "",
      physicalStreetAddress: businessProfile.streetAddress || "",
      physicalCity: businessProfile.city || "",
      physicalState: businessProfile.state,
      physicalZipCode: businessProfile.zipCode || "",
      mailingStreetAddress: "",
      mailingCity: "",
      mailingState: businessProfile.state,
      mailingZipCode: "",
      primaryContactName: "",
      primaryContactTitle: "",
      primaryContactPhone: "",
      primaryContactEmail: "",
      secondaryContactName: "",
      secondaryContactTitle: "",
      secondaryContactPhone: "",
      secondaryContactEmail: "",
      emergencyContactName: "",
      emergencyContactPhone: "",
      notes: ""
    });
    setIsEditing(false);
  };

  return (
    <div className="space-y-6">
      {/* Contact Information */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Phone className="w-5 h-5" />
            Contact Information
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Company Phone */}
            <div className="space-y-2">
              <Label htmlFor="companyPhone">Company Phone</Label>
              {isEditing ? (
                <Input
                  id="companyPhone"
                  placeholder="(555) 123-4567"
                  value={formData.companyPhone}
                  onChange={(e) => setFormData({ ...formData, companyPhone: e.target.value })}
                />
              ) : (
                <p className="text-sm text-muted-foreground bg-muted p-2 rounded">
                  {formData.companyPhone || "Not provided"}
                </p>
              )}
            </div>

            {/* Business Email */}
            <div className="space-y-2">
              <Label htmlFor="businessEmail">Business Email</Label>
              {isEditing ? (
                <Input
                  id="businessEmail"
                  type="email"
                  placeholder="contact@company.com"
                  value={formData.businessEmail}
                  onChange={(e) => setFormData({ ...formData, businessEmail: e.target.value })}
                />
              ) : (
                <p className="text-sm text-muted-foreground bg-muted p-2 rounded">
                  {formData.businessEmail || "Not provided"}
                </p>
              )}
            </div>

            {/* Phone Provider */}
            <div className="space-y-2">
              <Label htmlFor="phoneProvider">Phone Provider</Label>
              {isEditing ? (
                <Input
                  id="phoneProvider"
                  placeholder="Verizon, AT&T, etc."
                  value={formData.phoneProvider}
                  onChange={(e) => setFormData({ ...formData, phoneProvider: e.target.value })}
                />
              ) : (
                <p className="text-sm text-muted-foreground bg-muted p-2 rounded">
                  {formData.phoneProvider || "Not provided"}
                </p>
              )}
            </div>

            {/* Email Login */}
            <div className="space-y-2">
              <Label htmlFor="emailLogin">Email Login</Label>
              {isEditing ? (
                <Input
                  id="emailLogin"
                  placeholder="Email login credentials"
                  value={formData.emailLogin}
                  onChange={(e) => setFormData({ ...formData, emailLogin: e.target.value })}
                />
              ) : (
                <p className="text-sm text-muted-foreground bg-muted p-2 rounded">
                  {formData.emailLogin || "Not provided"}
                </p>
              )}
            </div>

            {/* Managing Members */}
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="managingMembers">Managing Members</Label>
              {isEditing ? (
                <Input
                  id="managingMembers"
                  placeholder="List of managing members"
                  value={formData.managingMembers}
                  onChange={(e) => setFormData({ ...formData, managingMembers: e.target.value })}
                />
              ) : (
                <p className="text-sm text-muted-foreground bg-muted p-2 rounded">
                  {formData.managingMembers || "Not provided"}
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Company Physical Address */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building className="w-5 h-5" />
            Company Physical Address
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Street Address */}
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="physicalStreetAddress">Street Address</Label>
              {isEditing ? (
                <Input
                  id="physicalStreetAddress"
                  placeholder="123 Business Street"
                  value={formData.physicalStreetAddress}
                  onChange={(e) => setFormData({ ...formData, physicalStreetAddress: e.target.value })}
                />
              ) : (
                <p className="text-sm text-muted-foreground bg-muted p-2 rounded">
                  {formData.physicalStreetAddress || "Not provided"}
                </p>
              )}
            </div>

            {/* City */}
            <div className="space-y-2">
              <Label htmlFor="physicalCity">City</Label>
              {isEditing ? (
                <Input
                  id="physicalCity"
                  placeholder="City name"
                  value={formData.physicalCity}
                  onChange={(e) => setFormData({ ...formData, physicalCity: e.target.value })}
                />
              ) : (
                <p className="text-sm text-muted-foreground bg-muted p-2 rounded">
                  {formData.physicalCity || "Not provided"}
                </p>
              )}
            </div>

            {/* State */}
            <div className="space-y-2">
              <Label htmlFor="physicalState">State</Label>
              {isEditing ? (
                <Select value={formData.physicalState} onValueChange={(value) => setFormData({ ...formData, physicalState: value })}>
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
                  {formData.physicalState}
                </p>
              )}
            </div>

            {/* ZIP Code */}
            <div className="space-y-2">
              <Label htmlFor="physicalZipCode">ZIP Code</Label>
              {isEditing ? (
                <Input
                  id="physicalZipCode"
                  placeholder="12345"
                  value={formData.physicalZipCode}
                  onChange={(e) => setFormData({ ...formData, physicalZipCode: e.target.value })}
                />
              ) : (
                <p className="text-sm text-muted-foreground bg-muted p-2 rounded">
                  {formData.physicalZipCode || "Not provided"}
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Mailing Address */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="w-5 h-5" />
            Mailing Address
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Mailing Street Address */}
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="mailingStreetAddress">Mailing Street Address</Label>
              {isEditing ? (
                <Input
                  id="mailingStreetAddress"
                  placeholder="P.O. Box 123 or Street Address"
                  value={formData.mailingStreetAddress}
                  onChange={(e) => setFormData({ ...formData, mailingStreetAddress: e.target.value })}
                />
              ) : (
                <p className="text-sm text-muted-foreground bg-muted p-2 rounded">
                  {formData.mailingStreetAddress || "Not provided"}
                </p>
              )}
            </div>

            {/* Mailing City */}
            <div className="space-y-2">
              <Label htmlFor="mailingCity">Mailing City</Label>
              {isEditing ? (
                <Input
                  id="mailingCity"
                  placeholder="City name"
                  value={formData.mailingCity}
                  onChange={(e) => setFormData({ ...formData, mailingCity: e.target.value })}
                />
              ) : (
                <p className="text-sm text-muted-foreground bg-muted p-2 rounded">
                  {formData.mailingCity || "Not provided"}
                </p>
              )}
            </div>

            {/* Mailing State */}
            <div className="space-y-2">
              <Label htmlFor="mailingState">Mailing State</Label>
              {isEditing ? (
                <Select value={formData.mailingState} onValueChange={(value) => setFormData({ ...formData, mailingState: value })}>
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
                  {formData.mailingState}
                </p>
              )}
            </div>

            {/* Mailing ZIP Code */}
            <div className="space-y-2">
              <Label htmlFor="mailingZipCode">Mailing ZIP Code</Label>
              {isEditing ? (
                <Input
                  id="mailingZipCode"
                  placeholder="12345"
                  value={formData.mailingZipCode}
                  onChange={(e) => setFormData({ ...formData, mailingZipCode: e.target.value })}
                />
              ) : (
                <p className="text-sm text-muted-foreground bg-muted p-2 rounded">
                  {formData.mailingZipCode || "Not provided"}
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Company Personnel */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            Company Personnel
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Primary Contact */}
          <div className="space-y-4">
            <h4 className="text-sm font-medium text-muted-foreground">Primary Contact</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="primaryContactName">Primary Contact Name</Label>
                {isEditing ? (
                  <Input
                    id="primaryContactName"
                    placeholder="Full name of primary contact"
                    value={formData.primaryContactName}
                    onChange={(e) => setFormData({ ...formData, primaryContactName: e.target.value })}
                  />
                ) : (
                  <p className="text-sm text-muted-foreground bg-muted p-2 rounded">
                    {formData.primaryContactName || "Not provided"}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="primaryContactTitle">Primary Contact Title</Label>
                {isEditing ? (
                  <Input
                    id="primaryContactTitle"
                    placeholder="CEO, President, etc."
                    value={formData.primaryContactTitle}
                    onChange={(e) => setFormData({ ...formData, primaryContactTitle: e.target.value })}
                  />
                ) : (
                  <p className="text-sm text-muted-foreground bg-muted p-2 rounded">
                    {formData.primaryContactTitle || "Not provided"}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="primaryContactPhone">Primary Contact Phone</Label>
                {isEditing ? (
                  <Input
                    id="primaryContactPhone"
                    placeholder="Direct phone number"
                    value={formData.primaryContactPhone}
                    onChange={(e) => setFormData({ ...formData, primaryContactPhone: e.target.value })}
                  />
                ) : (
                  <p className="text-sm text-muted-foreground bg-muted p-2 rounded">
                    {formData.primaryContactPhone || "Not provided"}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="primaryContactEmail">Primary Contact Email</Label>
                {isEditing ? (
                  <Input
                    id="primaryContactEmail"
                    type="email"
                    placeholder="contact@company.com"
                    value={formData.primaryContactEmail}
                    onChange={(e) => setFormData({ ...formData, primaryContactEmail: e.target.value })}
                  />
                ) : (
                  <p className="text-sm text-muted-foreground bg-muted p-2 rounded">
                    {formData.primaryContactEmail || "Not provided"}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Secondary Contact */}
          <div className="space-y-4">
            <h4 className="text-sm font-medium text-muted-foreground">Secondary Contact</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="secondaryContactName">Secondary Contact Name</Label>
                {isEditing ? (
                  <Input
                    id="secondaryContactName"
                    placeholder="Backup contact name"
                    value={formData.secondaryContactName}
                    onChange={(e) => setFormData({ ...formData, secondaryContactName: e.target.value })}
                  />
                ) : (
                  <p className="text-sm text-muted-foreground bg-muted p-2 rounded">
                    {formData.secondaryContactName || "Not provided"}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="secondaryContactTitle">Secondary Contact Title</Label>
                {isEditing ? (
                  <Input
                    id="secondaryContactTitle"
                    placeholder="Manager, Assistant, etc."
                    value={formData.secondaryContactTitle}
                    onChange={(e) => setFormData({ ...formData, secondaryContactTitle: e.target.value })}
                  />
                ) : (
                  <p className="text-sm text-muted-foreground bg-muted p-2 rounded">
                    {formData.secondaryContactTitle || "Not provided"}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="secondaryContactPhone">Secondary Contact Phone</Label>
                {isEditing ? (
                  <Input
                    id="secondaryContactPhone"
                    placeholder="Alternate phone number"
                    value={formData.secondaryContactPhone}
                    onChange={(e) => setFormData({ ...formData, secondaryContactPhone: e.target.value })}
                  />
                ) : (
                  <p className="text-sm text-muted-foreground bg-muted p-2 rounded">
                    {formData.secondaryContactPhone || "Not provided"}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="secondaryContactEmail">Secondary Contact Email</Label>
                {isEditing ? (
                  <Input
                    id="secondaryContactEmail"
                    type="email"
                    placeholder="backup@company.com"
                    value={formData.secondaryContactEmail}
                    onChange={(e) => setFormData({ ...formData, secondaryContactEmail: e.target.value })}
                  />
                ) : (
                  <p className="text-sm text-muted-foreground bg-muted p-2 rounded">
                    {formData.secondaryContactEmail || "Not provided"}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Emergency Contact */}
          <div className="space-y-4">
            <h4 className="text-sm font-medium text-muted-foreground">Emergency Contact</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="emergencyContactName">Emergency Contact Name</Label>
                {isEditing ? (
                  <Input
                    id="emergencyContactName"
                    placeholder="Emergency contact person"
                    value={formData.emergencyContactName}
                    onChange={(e) => setFormData({ ...formData, emergencyContactName: e.target.value })}
                  />
                ) : (
                  <p className="text-sm text-muted-foreground bg-muted p-2 rounded">
                    {formData.emergencyContactName || "Not provided"}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="emergencyContactPhone">Emergency Contact Phone</Label>
                {isEditing ? (
                  <Input
                    id="emergencyContactPhone"
                    placeholder="Emergency phone number"
                    value={formData.emergencyContactPhone}
                    onChange={(e) => setFormData({ ...formData, emergencyContactPhone: e.target.value })}
                  />
                ) : (
                  <p className="text-sm text-muted-foreground bg-muted p-2 rounded">
                    {formData.emergencyContactPhone || "Not provided"}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="contactNotes">Notes</Label>
            {isEditing ? (
              <Textarea
                id="contactNotes"
                placeholder="Additional contact information..."
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
