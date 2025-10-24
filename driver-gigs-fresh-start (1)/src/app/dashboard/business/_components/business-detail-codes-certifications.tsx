"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Award, 
  Shield,
  FileText,
  Calendar,
  Building2,
  Truck,
  Users,
  AlertCircle,
  CheckCircle,
  Clock,
  Edit,
  Save,
  X,
  Plus,
  Trash2,
  ExternalLink
} from "lucide-react";
import { BusinessProfile } from "@/hooks/use-business";
import { useState } from "react";

interface BusinessDetailCodesCertificationsProps {
  businessProfile: BusinessProfile;
}

interface IndustryCertification {
  id: string;
  name: string;
  issuingOrganization: string;
  certificationNumber: string;
  issueDate: string;
  expirationDate: string;
  status: string;
  renewalRequired: boolean;
  cost: string;
  description: string;
  notes: string;
}

interface BusinessCode {
  id: string;
  codeType: string;
  codeNumber: string;
  description: string;
  issuingAuthority: string;
  dateObtained: string;
  expirationDate: string;
  status: string;
  renewalFee: string;
  notes: string;
}

export function BusinessDetailCodesCertifications({ businessProfile }: BusinessDetailCodesCertificationsProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    // Industry Certifications
    industryCertifications: businessProfile.codesCertificationsInfo?.industryCertifications || [] as IndustryCertification[],
    
    // Business Codes
    businessCodes: businessProfile.codesCertificationsInfo?.businessCodes || [] as BusinessCode[],
    
    // DOT Information
    dotNumber: businessProfile.codesCertificationsInfo?.dotNumber || "",
    mcNumber: businessProfile.codesCertificationsInfo?.mcNumber || "",
    dotStatus: businessProfile.codesCertificationsInfo?.dotStatus || "",
    
    // FMCSA Information
    fmcsaRating: businessProfile.codesCertificationsInfo?.fmcsaRating || "",
    lastInspectionDate: businessProfile.codesCertificationsInfo?.lastInspectionDate || "",
    
    // Insurance Requirements
    insuranceRequirements: businessProfile.codesCertificationsInfo?.insuranceRequirements || "",
    
    notes: businessProfile.codesCertificationsInfo?.notes || ""
  });

  const handleSave = async () => {
    try {
      const response = await fetch(`/api/business/${businessProfile.id}/tabs`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tabType: 'codes-certifications',
          data: formData,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save codes and certifications information');
      }

      const result = await response.json();
      console.log('Codes and certifications information updated successfully:', result);
      setIsEditing(false);
      
      window.location.reload();
    } catch (error) {
      console.error('Error saving codes and certifications information:', error);
      alert('Failed to save codes and certifications information. Please try again.');
    }
  };

  const handleCancel = () => {
    setFormData({
      industryCertifications: businessProfile.codesCertificationsInfo?.industryCertifications || [],
      businessCodes: businessProfile.codesCertificationsInfo?.businessCodes || [],
      dotNumber: businessProfile.codesCertificationsInfo?.dotNumber || "",
      mcNumber: businessProfile.codesCertificationsInfo?.mcNumber || "",
      dotStatus: businessProfile.codesCertificationsInfo?.dotStatus || "",
      fmcsaRating: businessProfile.codesCertificationsInfo?.fmcsaRating || "",
      lastInspectionDate: businessProfile.codesCertificationsInfo?.lastInspectionDate || "",
      insuranceRequirements: businessProfile.codesCertificationsInfo?.insuranceRequirements || "",
      notes: businessProfile.codesCertificationsInfo?.notes || ""
    });
    setIsEditing(false);
  };

  // Industry Certifications functions
  const addIndustryCertification = () => {
    const newCertification: IndustryCertification = {
      id: Date.now().toString(),
      name: "",
      issuingOrganization: "",
      certificationNumber: "",
      issueDate: "",
      expirationDate: "",
      status: "Active",
      renewalRequired: true,
      cost: "",
      description: "",
      notes: ""
    };
    setFormData({
      ...formData,
      industryCertifications: [...formData.industryCertifications, newCertification]
    });
  };

  const removeIndustryCertification = (id: string) => {
    setFormData({
      ...formData,
      industryCertifications: formData.industryCertifications.filter((cert: IndustryCertification) => cert.id !== id)
    });
  };

  const updateIndustryCertification = (id: string, field: keyof IndustryCertification, value: string | boolean) => {
    setFormData({
      ...formData,
      industryCertifications: formData.industryCertifications.map((cert: IndustryCertification) =>
        cert.id === id ? { ...cert, [field]: value } : cert
      )
    });
  };

  // Business Codes functions
  const addBusinessCode = () => {
    const newCode: BusinessCode = {
      id: Date.now().toString(),
      codeType: "",
      codeNumber: "",
      description: "",
      issuingAuthority: "",
      dateObtained: "",
      expirationDate: "",
      status: "Active",
      renewalFee: "",
      notes: ""
    };
    setFormData({
      ...formData,
      businessCodes: [...formData.businessCodes, newCode]
    });
  };

  const removeBusinessCode = (id: string) => {
    setFormData({
      ...formData,
      businessCodes: formData.businessCodes.filter((code: BusinessCode) => code.id !== id)
    });
  };

  const updateBusinessCode = (id: string, field: keyof BusinessCode, value: string) => {
    setFormData({
      ...formData,
      businessCodes: formData.businessCodes.map((code: BusinessCode) =>
        code.id === id ? { ...code, [field]: value } : code
      )
    });
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
      case 'compliant':
        return "text-green-600 bg-green-50 border-green-200";
      case 'expired':
      case 'non-compliant':
        return "text-red-600 bg-red-50 border-red-200";
      case 'expiring soon':
      case 'pending':
        return "text-yellow-600 bg-yellow-50 border-yellow-200";
      default:
        return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
      case 'compliant':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'expired':
      case 'non-compliant':
        return <AlertCircle className="w-4 h-4 text-red-600" />;
      case 'expiring soon':
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-600" />;
      default:
        return <Clock className="w-4 h-4 text-gray-600" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Codes & Certifications */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Award className="w-5 h-5" />
            Codes & Certifications
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
          {/* DOT and FMCSA Information */}
          <div className="space-y-4">
            <h4 className="text-sm font-medium flex items-center gap-2">
              <Truck className="w-4 h-4" />
              DOT & FMCSA Information
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="dotNumber">DOT Number</Label>
                {isEditing ? (
                  <Input
                    id="dotNumber"
                    placeholder="DOT number"
                    value={formData.dotNumber}
                    onChange={(e) => setFormData({ ...formData, dotNumber: e.target.value })}
                  />
                ) : (
                  <p className="text-sm text-muted-foreground bg-muted p-2 rounded">
                    {formData.dotNumber || "Not provided"}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="mcNumber">MC Number</Label>
                {isEditing ? (
                  <Input
                    id="mcNumber"
                    placeholder="MC number"
                    value={formData.mcNumber}
                    onChange={(e) => setFormData({ ...formData, mcNumber: e.target.value })}
                  />
                ) : (
                  <p className="text-sm text-muted-foreground bg-muted p-2 rounded">
                    {formData.mcNumber || "Not provided"}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="dotStatus">DOT Status</Label>
                {isEditing ? (
                  <Select value={formData.dotStatus} onValueChange={(value) => setFormData({ ...formData, dotStatus: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Active">Active</SelectItem>
                      <SelectItem value="Inactive">Inactive</SelectItem>
                      <SelectItem value="Out of Service">Out of Service</SelectItem>
                      <SelectItem value="Pending">Pending</SelectItem>
                    </SelectContent>
                  </Select>
                ) : (
                  <Badge className={getStatusColor(formData.dotStatus)}>
                    {formData.dotStatus || "Not provided"}
                  </Badge>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="fmcsaRating">FMCSA Safety Rating</Label>
                {isEditing ? (
                  <Select value={formData.fmcsaRating} onValueChange={(value) => setFormData({ ...formData, fmcsaRating: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select rating" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Satisfactory">Satisfactory</SelectItem>
                      <SelectItem value="Conditional">Conditional</SelectItem>
                      <SelectItem value="Unsatisfactory">Unsatisfactory</SelectItem>
                      <SelectItem value="Not Rated">Not Rated</SelectItem>
                    </SelectContent>
                  </Select>
                ) : (
                  <p className="text-sm text-muted-foreground bg-muted p-2 rounded">
                    {formData.fmcsaRating || "Not provided"}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="lastInspectionDate">Last Inspection Date</Label>
                {isEditing ? (
                  <Input
                    type="date"
                    id="lastInspectionDate"
                    value={formData.lastInspectionDate}
                    onChange={(e) => setFormData({ ...formData, lastInspectionDate: e.target.value })}
                  />
                ) : (
                  <p className="text-sm text-muted-foreground bg-muted p-2 rounded">
                    {formData.lastInspectionDate ? new Date(formData.lastInspectionDate).toLocaleDateString() : "Not provided"}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Industry Certifications */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-medium flex items-center gap-2">
                <Shield className="w-4 h-4" />
                Industry Certifications
              </h4>
              {isEditing && (
                <Button variant="outline" size="sm" onClick={addIndustryCertification}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Certification
                </Button>
              )}
            </div>
            
            {formData.industryCertifications.length === 0 ? (
              <p className="text-sm text-muted-foreground bg-muted p-3 rounded">
                No industry certifications added
              </p>
            ) : (
              <div className="space-y-4">
                {formData.industryCertifications.map((certification: IndustryCertification, index: number) => (
                  <Card key={certification.id} className="border-l-4 border-l-blue-500">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-base flex items-center gap-2">
                          {getStatusIcon(certification.status)}
                          {certification.name || `Certification #${index + 1}`}
                          <Badge className={getStatusColor(certification.status)}>
                            {certification.status || "Active"}
                          </Badge>
                        </CardTitle>
                        {isEditing && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeIndustryCertification(certification.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label>Certification Name</Label>
                          {isEditing ? (
                            <Input
                              placeholder="Certification name"
                              value={certification.name}
                              onChange={(e) => updateIndustryCertification(certification.id, 'name', e.target.value)}
                            />
                          ) : (
                            <p className="text-sm text-muted-foreground bg-muted p-2 rounded">
                              {certification.name || "Not provided"}
                            </p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label>Issuing Organization</Label>
                          {isEditing ? (
                            <Input
                              placeholder="Organization name"
                              value={certification.issuingOrganization}
                              onChange={(e) => updateIndustryCertification(certification.id, 'issuingOrganization', e.target.value)}
                            />
                          ) : (
                            <p className="text-sm text-muted-foreground bg-muted p-2 rounded">
                              {certification.issuingOrganization || "Not provided"}
                            </p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label>Certification Number</Label>
                          {isEditing ? (
                            <Input
                              placeholder="Certificate number"
                              value={certification.certificationNumber}
                              onChange={(e) => updateIndustryCertification(certification.id, 'certificationNumber', e.target.value)}
                            />
                          ) : (
                            <p className="text-sm text-muted-foreground bg-muted p-2 rounded font-mono">
                              {certification.certificationNumber || "Not provided"}
                            </p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label>Issue Date</Label>
                          {isEditing ? (
                            <Input
                              type="date"
                              value={certification.issueDate}
                              onChange={(e) => updateIndustryCertification(certification.id, 'issueDate', e.target.value)}
                            />
                          ) : (
                            <p className="text-sm text-muted-foreground bg-muted p-2 rounded">
                              {certification.issueDate ? new Date(certification.issueDate).toLocaleDateString() : "Not provided"}
                            </p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label>Expiration Date</Label>
                          {isEditing ? (
                            <Input
                              type="date"
                              value={certification.expirationDate}
                              onChange={(e) => updateIndustryCertification(certification.id, 'expirationDate', e.target.value)}
                            />
                          ) : (
                            <p className="text-sm text-muted-foreground bg-muted p-2 rounded">
                              {certification.expirationDate ? new Date(certification.expirationDate).toLocaleDateString() : "Not provided"}
                            </p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label>Status</Label>
                          {isEditing ? (
                            <Select value={certification.status} onValueChange={(value) => updateIndustryCertification(certification.id, 'status', value)}>
                              <SelectTrigger>
                                <SelectValue placeholder="Select status" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Active">Active</SelectItem>
                                <SelectItem value="Expired">Expired</SelectItem>
                                <SelectItem value="Expiring Soon">Expiring Soon</SelectItem>
                                <SelectItem value="Suspended">Suspended</SelectItem>
                              </SelectContent>
                            </Select>
                          ) : (
                            <Badge className={getStatusColor(certification.status)}>
                              {certification.status || "Active"}
                            </Badge>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label>Cost ($)</Label>
                          {isEditing ? (
                            <Input
                              placeholder="0.00"
                              value={certification.cost}
                              onChange={(e) => updateIndustryCertification(certification.id, 'cost', e.target.value)}
                            />
                          ) : (
                            <p className="text-sm text-muted-foreground bg-muted p-2 rounded">
                              {certification.cost ? `$${certification.cost}` : "Not provided"}
                            </p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label>Renewal Required</Label>
                          {isEditing ? (
                            <Select 
                              value={certification.renewalRequired ? "yes" : "no"} 
                              onValueChange={(value) => updateIndustryCertification(certification.id, 'renewalRequired', value === "yes")}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select option" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="yes">Yes</SelectItem>
                                <SelectItem value="no">No</SelectItem>
                              </SelectContent>
                            </Select>
                          ) : (
                            <Badge className={certification.renewalRequired ? "text-yellow-600 bg-yellow-50 border-yellow-200" : "text-gray-600 bg-gray-50 border-gray-200"}>
                              {certification.renewalRequired ? "Required" : "Not Required"}
                            </Badge>
                          )}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label>Description</Label>
                        {isEditing ? (
                          <Textarea
                            placeholder="Description of the certification"
                            value={certification.description}
                            onChange={(e) => updateIndustryCertification(certification.id, 'description', e.target.value)}
                            rows={2}
                          />
                        ) : (
                          <p className="text-sm text-muted-foreground bg-muted p-2 rounded min-h-[60px]">
                            {certification.description || "No description provided"}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label>Notes</Label>
                        {isEditing ? (
                          <Textarea
                            placeholder="Additional notes"
                            value={certification.notes}
                            onChange={(e) => updateIndustryCertification(certification.id, 'notes', e.target.value)}
                            rows={2}
                          />
                        ) : (
                          <p className="text-sm text-muted-foreground bg-muted p-2 rounded min-h-[60px]">
                            {certification.notes || "No notes provided"}
                          </p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* Business Codes */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-medium flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Business Codes & Permits
              </h4>
              {isEditing && (
                <Button variant="outline" size="sm" onClick={addBusinessCode}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Code
                </Button>
              )}
            </div>
            
            {formData.businessCodes.length === 0 ? (
              <p className="text-sm text-muted-foreground bg-muted p-3 rounded">
                No business codes added
              </p>
            ) : (
              <div className="space-y-4">
                {formData.businessCodes.map((code: BusinessCode, index: number) => (
                  <Card key={code.id} className="border-l-4 border-l-green-500">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-base flex items-center gap-2">
                          {getStatusIcon(code.status)}
                          {code.codeType || `Code #${index + 1}`}
                          <Badge className={getStatusColor(code.status)}>
                            {code.status || "Active"}
                          </Badge>
                        </CardTitle>
                        {isEditing && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeBusinessCode(code.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label>Code Type</Label>
                          {isEditing ? (
                            <Select value={code.codeType} onValueChange={(value) => updateBusinessCode(code.id, 'codeType', value)}>
                              <SelectTrigger>
                                <SelectValue placeholder="Select type" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Business License">Business License</SelectItem>
                                <SelectItem value="Operating Permit">Operating Permit</SelectItem>
                                <SelectItem value="Tax ID">Tax ID</SelectItem>
                                <SelectItem value="Professional License">Professional License</SelectItem>
                                <SelectItem value="Industry Permit">Industry Permit</SelectItem>
                                <SelectItem value="Other">Other</SelectItem>
                              </SelectContent>
                            </Select>
                          ) : (
                            <p className="text-sm text-muted-foreground bg-muted p-2 rounded">
                              {code.codeType || "Not provided"}
                            </p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label>Code/License Number</Label>
                          {isEditing ? (
                            <Input
                              placeholder="Code or license number"
                              value={code.codeNumber}
                              onChange={(e) => updateBusinessCode(code.id, 'codeNumber', e.target.value)}
                            />
                          ) : (
                            <p className="text-sm text-muted-foreground bg-muted p-2 rounded font-mono">
                              {code.codeNumber || "Not provided"}
                            </p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label>Issuing Authority</Label>
                          {isEditing ? (
                            <Input
                              placeholder="Government agency or authority"
                              value={code.issuingAuthority}
                              onChange={(e) => updateBusinessCode(code.id, 'issuingAuthority', e.target.value)}
                            />
                          ) : (
                            <p className="text-sm text-muted-foreground bg-muted p-2 rounded">
                              {code.issuingAuthority || "Not provided"}
                            </p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label>Date Obtained</Label>
                          {isEditing ? (
                            <Input
                              type="date"
                              value={code.dateObtained}
                              onChange={(e) => updateBusinessCode(code.id, 'dateObtained', e.target.value)}
                            />
                          ) : (
                            <p className="text-sm text-muted-foreground bg-muted p-2 rounded">
                              {code.dateObtained ? new Date(code.dateObtained).toLocaleDateString() : "Not provided"}
                            </p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label>Expiration Date</Label>
                          {isEditing ? (
                            <Input
                              type="date"
                              value={code.expirationDate}
                              onChange={(e) => updateBusinessCode(code.id, 'expirationDate', e.target.value)}
                            />
                          ) : (
                            <p className="text-sm text-muted-foreground bg-muted p-2 rounded">
                              {code.expirationDate ? new Date(code.expirationDate).toLocaleDateString() : "Not provided"}
                            </p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label>Status</Label>
                          {isEditing ? (
                            <Select value={code.status} onValueChange={(value) => updateBusinessCode(code.id, 'status', value)}>
                              <SelectTrigger>
                                <SelectValue placeholder="Select status" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Active">Active</SelectItem>
                                <SelectItem value="Expired">Expired</SelectItem>
                                <SelectItem value="Expiring Soon">Expiring Soon</SelectItem>
                                <SelectItem value="Suspended">Suspended</SelectItem>
                                <SelectItem value="Pending">Pending</SelectItem>
                              </SelectContent>
                            </Select>
                          ) : (
                            <Badge className={getStatusColor(code.status)}>
                              {code.status || "Active"}
                            </Badge>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label>Renewal Fee ($)</Label>
                          {isEditing ? (
                            <Input
                              placeholder="0.00"
                              value={code.renewalFee}
                              onChange={(e) => updateBusinessCode(code.id, 'renewalFee', e.target.value)}
                            />
                          ) : (
                            <p className="text-sm text-muted-foreground bg-muted p-2 rounded">
                              {code.renewalFee ? `$${code.renewalFee}` : "Not provided"}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label>Description</Label>
                        {isEditing ? (
                          <Textarea
                            placeholder="Description of the code or permit"
                            value={code.description}
                            onChange={(e) => updateBusinessCode(code.id, 'description', e.target.value)}
                            rows={2}
                          />
                        ) : (
                          <p className="text-sm text-muted-foreground bg-muted p-2 rounded min-h-[60px]">
                            {code.description || "No description provided"}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label>Notes</Label>
                        {isEditing ? (
                          <Textarea
                            placeholder="Additional notes"
                            value={code.notes}
                            onChange={(e) => updateBusinessCode(code.id, 'notes', e.target.value)}
                            rows={2}
                          />
                        ) : (
                          <p className="text-sm text-muted-foreground bg-muted p-2 rounded min-h-[60px]">
                            {code.notes || "No notes provided"}
                          </p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* Insurance Requirements */}
          <div className="space-y-2">
            <Label htmlFor="insuranceRequirements">Insurance Requirements</Label>
            {isEditing ? (
              <Textarea
                id="insuranceRequirements"
                placeholder="Required insurance coverage and amounts"
                value={formData.insuranceRequirements}
                onChange={(e) => setFormData({ ...formData, insuranceRequirements: e.target.value })}
                rows={3}
              />
            ) : (
              <p className="text-sm text-muted-foreground bg-muted p-3 rounded min-h-[80px]">
                {formData.insuranceRequirements || "No insurance requirements specified"}
              </p>
            )}
          </div>

          {/* General Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            {isEditing ? (
              <Textarea
                id="notes"
                placeholder="Additional notes about codes and certifications..."
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
