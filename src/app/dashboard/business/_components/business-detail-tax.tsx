"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Calculator, 
  Calendar,
  FileText,
  DollarSign,
  Building2,
  User,
  AlertCircle,
  CheckCircle,
  Clock,
  Edit,
  Save,
  X,
  Plus,
  Trash2,
  Receipt
} from "lucide-react";
import { BusinessProfile } from "@/hooks/use-business";
import { useState } from "react";

interface BusinessDetailTaxProps {
  businessProfile: BusinessProfile;
}

interface TaxDeadline {
  id: string;
  taxType: string;
  description: string;
  dueDate: string;
  frequency: string;
  status: string;
  estimatedAmount: string;
  notes: string;
}

interface TaxPayment {
  id: string;
  taxType: string;
  paymentDate: string;
  amount: string;
  quarter: string;
  year: string;
  paymentMethod: string;
  confirmationNumber: string;
  notes: string;
}

interface TaxProfessional {
  id: string;
  name: string;
  company: string;
  role: string;
  phone: string;
  email: string;
  address: string;
  specialization: string;
  notes: string;
}

export function BusinessDetailTax({ businessProfile }: BusinessDetailTaxProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    // Tax Identification
    federalEIN: businessProfile.taxInfo?.federalEIN || "",
    stateEIN: businessProfile.taxInfo?.stateEIN || "",
    businessStructure: businessProfile.taxInfo?.businessStructure || "",
    
    // Tax Deadlines
    taxDeadlines: businessProfile.taxInfo?.taxDeadlines || [] as TaxDeadline[],
    
    // Tax Payments
    taxPayments: businessProfile.taxInfo?.taxPayments || [] as TaxPayment[],
    
    // Tax Professionals
    taxProfessionals: businessProfile.taxInfo?.taxProfessionals || [] as TaxProfessional[],
    
    // Tax Elections and Status
    taxElections: businessProfile.taxInfo?.taxElections || "",
    accountingMethod: businessProfile.taxInfo?.accountingMethod || "",
    taxYear: businessProfile.taxInfo?.taxYear || "",
    
    // Quarterly Estimates
    quarterlyEstimates: businessProfile.taxInfo?.quarterlyEstimates || "",
    
    // Deductions and Credits
    businessDeductions: businessProfile.taxInfo?.businessDeductions || "",
    availableCredits: businessProfile.taxInfo?.availableCredits || "",
    
    notes: businessProfile.taxInfo?.notes || ""
  });

  const handleSave = async () => {
    try {
      const response = await fetch(`/api/business/${businessProfile.id}/tabs`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tabType: 'tax',
          data: formData,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save tax information');
      }

      const result = await response.json();
      console.log('Tax information updated successfully:', result);
      setIsEditing(false);
      
      window.location.reload();
    } catch (error) {
      console.error('Error saving tax information:', error);
      alert('Failed to save tax information. Please try again.');
    }
  };

  const handleCancel = () => {
    setFormData({
      federalEIN: businessProfile.taxInfo?.federalEIN || "",
      stateEIN: businessProfile.taxInfo?.stateEIN || "",
      businessStructure: businessProfile.taxInfo?.businessStructure || "",
      taxDeadlines: businessProfile.taxInfo?.taxDeadlines || [],
      taxPayments: businessProfile.taxInfo?.taxPayments || [],
      taxProfessionals: businessProfile.taxInfo?.taxProfessionals || [],
      taxElections: businessProfile.taxInfo?.taxElections || "",
      accountingMethod: businessProfile.taxInfo?.accountingMethod || "",
      taxYear: businessProfile.taxInfo?.taxYear || "",
      quarterlyEstimates: businessProfile.taxInfo?.quarterlyEstimates || "",
      businessDeductions: businessProfile.taxInfo?.businessDeductions || "",
      availableCredits: businessProfile.taxInfo?.availableCredits || "",
      notes: businessProfile.taxInfo?.notes || ""
    });
    setIsEditing(false);
  };

  // Tax Deadlines functions
  const addTaxDeadline = () => {
    const newDeadline: TaxDeadline = {
      id: Date.now().toString(),
      taxType: "",
      description: "",
      dueDate: "",
      frequency: "Annual",
      status: "Upcoming",
      estimatedAmount: "",
      notes: ""
    };
    setFormData({
      ...formData,
      taxDeadlines: [...formData.taxDeadlines, newDeadline]
    });
  };

  const removeTaxDeadline = (id: string) => {
    setFormData({
      ...formData,
      taxDeadlines: formData.taxDeadlines.filter((deadline: TaxDeadline) => deadline.id !== id)
    });
  };

  const updateTaxDeadline = (id: string, field: keyof TaxDeadline, value: string) => {
    setFormData({
      ...formData,
      taxDeadlines: formData.taxDeadlines.map((deadline: TaxDeadline) =>
        deadline.id === id ? { ...deadline, [field]: value } : deadline
      )
    });
  };

  // Tax Payments functions
  const addTaxPayment = () => {
    const newPayment: TaxPayment = {
      id: Date.now().toString(),
      taxType: "",
      paymentDate: "",
      amount: "",
      quarter: "",
      year: new Date().getFullYear().toString(),
      paymentMethod: "",
      confirmationNumber: "",
      notes: ""
    };
    setFormData({
      ...formData,
      taxPayments: [...formData.taxPayments, newPayment]
    });
  };

  const removeTaxPayment = (id: string) => {
    setFormData({
      ...formData,
      taxPayments: formData.taxPayments.filter((payment: TaxPayment) => payment.id !== id)
    });
  };

  const updateTaxPayment = (id: string, field: keyof TaxPayment, value: string) => {
    setFormData({
      ...formData,
      taxPayments: formData.taxPayments.map((payment: TaxPayment) =>
        payment.id === id ? { ...payment, [field]: value } : payment
      )
    });
  };

  // Tax Professionals functions
  const addTaxProfessional = () => {
    const newProfessional: TaxProfessional = {
      id: Date.now().toString(),
      name: "",
      company: "",
      role: "",
      phone: "",
      email: "",
      address: "",
      specialization: "",
      notes: ""
    };
    setFormData({
      ...formData,
      taxProfessionals: [...formData.taxProfessionals, newProfessional]
    });
  };

  const removeTaxProfessional = (id: string) => {
    setFormData({
      ...formData,
      taxProfessionals: formData.taxProfessionals.filter((professional: TaxProfessional) => professional.id !== id)
    });
  };

  const updateTaxProfessional = (id: string, field: keyof TaxProfessional, value: string) => {
    setFormData({
      ...formData,
      taxProfessionals: formData.taxProfessionals.map((professional: TaxProfessional) =>
        professional.id === id ? { ...professional, [field]: value } : professional
      )
    });
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
      case 'paid':
        return "text-green-600 bg-green-50 border-green-200";
      case 'overdue':
        return "text-red-600 bg-red-50 border-red-200";
      case 'upcoming':
      case 'pending':
        return "text-yellow-600 bg-yellow-50 border-yellow-200";
      default:
        return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
      case 'paid':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'overdue':
        return <AlertCircle className="w-4 h-4 text-red-600" />;
      case 'upcoming':
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-600" />;
      default:
        return <Clock className="w-4 h-4 text-gray-600" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Tax Information */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Calculator className="w-5 h-5" />
            Tax Information
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
          {/* Tax Identification */}
          <div className="space-y-4">
            <h4 className="text-sm font-medium flex items-center gap-2">
              <Building2 className="w-4 h-4" />
              Tax Identification
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="federalEIN">Federal EIN</Label>
                {isEditing ? (
                  <Input
                    id="federalEIN"
                    placeholder="XX-XXXXXXX"
                    value={formData.federalEIN}
                    onChange={(e) => setFormData({ ...formData, federalEIN: e.target.value })}
                  />
                ) : (
                  <p className="text-sm text-muted-foreground bg-muted p-2 rounded font-mono">
                    {formData.federalEIN || "Not provided"}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="stateEIN">State EIN</Label>
                {isEditing ? (
                  <Input
                    id="stateEIN"
                    placeholder="State tax ID"
                    value={formData.stateEIN}
                    onChange={(e) => setFormData({ ...formData, stateEIN: e.target.value })}
                  />
                ) : (
                  <p className="text-sm text-muted-foreground bg-muted p-2 rounded font-mono">
                    {formData.stateEIN || "Not provided"}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="businessStructure">Business Structure</Label>
                {isEditing ? (
                  <Select value={formData.businessStructure} onValueChange={(value) => setFormData({ ...formData, businessStructure: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select structure" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Sole Proprietorship">Sole Proprietorship</SelectItem>
                      <SelectItem value="Partnership">Partnership</SelectItem>
                      <SelectItem value="LLC">LLC</SelectItem>
                      <SelectItem value="S-Corp">S-Corp</SelectItem>
                      <SelectItem value="C-Corp">C-Corp</SelectItem>
                      <SelectItem value="Non-Profit">Non-Profit</SelectItem>
                    </SelectContent>
                  </Select>
                ) : (
                  <p className="text-sm text-muted-foreground bg-muted p-2 rounded">
                    {formData.businessStructure || "Not provided"}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="accountingMethod">Accounting Method</Label>
                {isEditing ? (
                  <Select value={formData.accountingMethod} onValueChange={(value) => setFormData({ ...formData, accountingMethod: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select method" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Cash">Cash</SelectItem>
                      <SelectItem value="Accrual">Accrual</SelectItem>
                      <SelectItem value="Hybrid">Hybrid</SelectItem>
                    </SelectContent>
                  </Select>
                ) : (
                  <p className="text-sm text-muted-foreground bg-muted p-2 rounded">
                    {formData.accountingMethod || "Not provided"}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="taxYear">Tax Year</Label>
                {isEditing ? (
                  <Select value={formData.taxYear} onValueChange={(value) => setFormData({ ...formData, taxYear: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select tax year" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Calendar Year">Calendar Year (Jan-Dec)</SelectItem>
                      <SelectItem value="Fiscal Year">Fiscal Year</SelectItem>
                    </SelectContent>
                  </Select>
                ) : (
                  <p className="text-sm text-muted-foreground bg-muted p-2 rounded">
                    {formData.taxYear || "Not provided"}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Tax Elections and Additional Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="taxElections">Tax Elections</Label>
              {isEditing ? (
                <Textarea
                  id="taxElections"
                  placeholder="Special tax elections made (S-Corp election, etc.)"
                  value={formData.taxElections}
                  onChange={(e) => setFormData({ ...formData, taxElections: e.target.value })}
                  rows={4}
                />
              ) : (
                <p className="text-sm text-muted-foreground bg-muted p-3 rounded min-h-[100px]">
                  {formData.taxElections || "No tax elections specified"}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="quarterlyEstimates">Quarterly Estimates</Label>
              {isEditing ? (
                <Textarea
                  id="quarterlyEstimates"
                  placeholder="Information about quarterly estimated tax payments"
                  value={formData.quarterlyEstimates}
                  onChange={(e) => setFormData({ ...formData, quarterlyEstimates: e.target.value })}
                  rows={4}
                />
              ) : (
                <p className="text-sm text-muted-foreground bg-muted p-3 rounded min-h-[100px]">
                  {formData.quarterlyEstimates || "No quarterly estimates information"}
                </p>
              )}
            </div>
          </div>

          {/* Deductions and Credits */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="businessDeductions">Business Deductions</Label>
              {isEditing ? (
                <Textarea
                  id="businessDeductions"
                  placeholder="Common business deductions and expenses"
                  value={formData.businessDeductions}
                  onChange={(e) => setFormData({ ...formData, businessDeductions: e.target.value })}
                  rows={4}
                />
              ) : (
                <p className="text-sm text-muted-foreground bg-muted p-3 rounded min-h-[100px]">
                  {formData.businessDeductions || "No deductions information"}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="availableCredits">Available Credits</Label>
              {isEditing ? (
                <Textarea
                  id="availableCredits"
                  placeholder="Tax credits available to the business"
                  value={formData.availableCredits}
                  onChange={(e) => setFormData({ ...formData, availableCredits: e.target.value })}
                  rows={4}
                />
              ) : (
                <p className="text-sm text-muted-foreground bg-muted p-3 rounded min-h-[100px]">
                  {formData.availableCredits || "No credits information"}
                </p>
              )}
            </div>
          </div>

          {/* General Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            {isEditing ? (
              <Textarea
                id="notes"
                placeholder="Additional notes about tax information..."
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
