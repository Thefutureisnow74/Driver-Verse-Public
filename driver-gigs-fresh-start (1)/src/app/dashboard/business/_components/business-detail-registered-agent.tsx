"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { 
  User, 
  Phone, 
  MapPin,
  Edit,
  Save,
  X
} from "lucide-react";
import { BusinessProfile } from "@/hooks/use-business";
import { useState } from "react";

interface BusinessDetailRegisteredAgentProps {
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

export function BusinessDetailRegisteredAgent({ businessProfile }: BusinessDetailRegisteredAgentProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    agentName: businessProfile.registeredAgentInfo?.agentName || "",
    agentPhone: businessProfile.registeredAgentInfo?.agentPhone || "",
    agentStreetAddress: businessProfile.registeredAgentInfo?.agentStreetAddress || "",
    agentCity: businessProfile.registeredAgentInfo?.agentCity || "",
    agentState: businessProfile.registeredAgentInfo?.agentState || businessProfile.state,
    agentZipCode: businessProfile.registeredAgentInfo?.agentZipCode || "",
    notes: businessProfile.registeredAgentInfo?.notes || ""
  });

  const handleSave = async () => {
    try {
      const response = await fetch(`/api/business/${businessProfile.id}/tabs`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tabType: 'registered-agent',
          data: formData,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save registered agent information');
      }

      const result = await response.json();
      console.log('Registered agent information updated successfully:', result);
      setIsEditing(false);
      
      // Optionally refresh the page or update parent component
      window.location.reload();
    } catch (error) {
      console.error('Error saving registered agent information:', error);
      alert('Failed to save registered agent information. Please try again.');
    }
  };

  const handleCancel = () => {
    setFormData({
      agentName: businessProfile.registeredAgentInfo?.agentName || "",
      agentPhone: businessProfile.registeredAgentInfo?.agentPhone || "",
      agentStreetAddress: businessProfile.registeredAgentInfo?.agentStreetAddress || "",
      agentCity: businessProfile.registeredAgentInfo?.agentCity || "",
      agentState: businessProfile.registeredAgentInfo?.agentState || businessProfile.state,
      agentZipCode: businessProfile.registeredAgentInfo?.agentZipCode || "",
      notes: businessProfile.registeredAgentInfo?.notes || ""
    });
    setIsEditing(false);
  };

  return (
    <div className="space-y-6">
      {/* Registered Agent */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            Registered Agent
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
            {/* Registered Agent Name */}
            <div className="space-y-2">
              <Label htmlFor="agentName">Registered Agent</Label>
              {isEditing ? (
                <Input
                  id="agentName"
                  placeholder="Agent name or company"
                  value={formData.agentName}
                  onChange={(e) => setFormData({ ...formData, agentName: e.target.value })}
                />
              ) : (
                <p className="text-sm text-muted-foreground bg-muted p-2 rounded">
                  {formData.agentName || "Not provided"}
                </p>
              )}
            </div>

            {/* Agent Phone */}
            <div className="space-y-2">
              <Label htmlFor="agentPhone">Agent Phone</Label>
              {isEditing ? (
                <Input
                  id="agentPhone"
                  placeholder="(555) 123-4567"
                  value={formData.agentPhone}
                  onChange={(e) => setFormData({ ...formData, agentPhone: e.target.value })}
                />
              ) : (
                <p className="text-sm text-muted-foreground bg-muted p-2 rounded">
                  {formData.agentPhone || "Not provided"}
                </p>
              )}
            </div>
          </div>

          {/* Agent Address Section */}
          <div className="space-y-4">
            <h4 className="text-sm font-medium flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              Agent Address
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Agent Street Address */}
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="agentStreetAddress">Agent Street Address</Label>
                {isEditing ? (
                  <Input
                    id="agentStreetAddress"
                    placeholder="123 Main Street"
                    value={formData.agentStreetAddress}
                    onChange={(e) => setFormData({ ...formData, agentStreetAddress: e.target.value })}
                  />
                ) : (
                  <p className="text-sm text-muted-foreground bg-muted p-2 rounded">
                    {formData.agentStreetAddress || "Not provided"}
                  </p>
                )}
              </div>

              {/* Agent City */}
              <div className="space-y-2">
                <Label htmlFor="agentCity">Agent City</Label>
                {isEditing ? (
                  <Input
                    id="agentCity"
                    value={formData.agentCity}
                    onChange={(e) => setFormData({ ...formData, agentCity: e.target.value })}
                  />
                ) : (
                  <p className="text-sm text-muted-foreground bg-muted p-2 rounded">
                    {formData.agentCity || "Not provided"}
                  </p>
                )}
              </div>

              {/* Agent ZIP Code */}
              <div className="space-y-2">
                <Label htmlFor="agentZipCode">Agent ZIP Code</Label>
                {isEditing ? (
                  <Input
                    id="agentZipCode"
                    placeholder="30309"
                    value={formData.agentZipCode}
                    onChange={(e) => setFormData({ ...formData, agentZipCode: e.target.value })}
                  />
                ) : (
                  <p className="text-sm text-muted-foreground bg-muted p-2 rounded">
                    {formData.agentZipCode || "Not provided"}
                  </p>
                )}
              </div>

              {/* Agent State */}
              <div className="space-y-2">
                <Label htmlFor="agentState">State</Label>
                {isEditing ? (
                  <Select value={formData.agentState} onValueChange={(value) => setFormData({ ...formData, agentState: value })}>
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
                    {formData.agentState}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="agentNotes">Notes</Label>
            {isEditing ? (
              <Textarea
                id="agentNotes"
                placeholder="Additional notes about the registered agent..."
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
