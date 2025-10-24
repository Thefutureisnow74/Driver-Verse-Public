"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  FileText, 
  Save, 
  X, 
  Building2,
  Calendar,
  User
} from "lucide-react";
import { toast } from "sonner";

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

interface CompanyNotesDialogProps {
  company: Company;
  isOpen: boolean;
  onClose: () => void;
  onStatusUpdate: () => void;
}

export function CompanyNotesDialog({ company, isOpen, onClose, onStatusUpdate }: CompanyNotesDialogProps) {
  const [currentStatus, setCurrentStatus] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (company.userStatuses?.[0]) {
      setCurrentStatus(company.userStatuses[0].status);
      setNotes(company.userStatuses[0].notes || "");
    }
  }, [company]);

  const handleStatusUpdate = async () => {
    if (!currentStatus) {
      toast.error("Please select a status");
      return;
    }

    try {
      setLoading(true);
      const response = await fetch("/api/user/company-status", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          companyId: company.id,
          status: currentStatus,
          notes: notes || null,
        }),
      });

      if (response.ok) {
        toast.success("Status and notes updated successfully");
        onStatusUpdate();
        onClose();
      } else {
        const error = await response.json();
        toast.error(error.error || "Failed to update status and notes");
      }
    } catch (error) {
      console.error("Error updating status and notes:", error);
      toast.error("Failed to update status and notes");
    } finally {
      setLoading(false);
    }
  };

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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto w-[95vw] sm:w-full">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 md:gap-3">
            <FileText className="w-5 h-5 md:w-6 md:h-6" />
            <span className="text-lg md:text-xl">
              <span className="hidden sm:inline">Notes & Status - </span>
              <span className="truncate">{company.name}</span>
            </span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Company Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Building2 className="w-5 h-5" />
                Company Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Service Type</label>
                  <div className="flex flex-wrap gap-1.5 mt-1">
                    {company.serviceVertical.map((vertical) => (
                      <Badge key={vertical} variant="outline" className="text-xs">
                        {vertical}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Contract Type</label>
                  <div className="mt-1">
                    <Badge className="text-xs">{company.contractType}</Badge>
                  </div>
                </div>
                {company.averagePay && (
                  <div>
                    <label className="text-sm font-medium text-gray-600">Average Pay</label>
                    <p className="mt-1 text-sm font-medium">{company.averagePay}</p>
                  </div>
                )}
                <div>
                  <label className="text-sm font-medium text-gray-600">Service Areas</label>
                  <p className="mt-1 text-sm">{company.areasServed.join(", ") || "Not specified"}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Status Management */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Your Status & Notes</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Current Status</label>
                <Select value={currentStatus} onValueChange={setCurrentStatus}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Researching">Researching</SelectItem>
                    <SelectItem value="Applied">Applied</SelectItem>
                    <SelectItem value="Wait List">Wait List</SelectItem>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Notes</label>
                <Textarea
                  placeholder="Add your notes about this company, application process, requirements, experiences, etc..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={4}
                  className="resize-none"
                />
                <p className="text-xs text-gray-500 mt-1">
                  {notes.length}/1000 characters
                </p>
              </div>

              {/* Current Status Display */}
              {company.userStatuses?.[0] && (
                <div className="bg-gray-50 p-3 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-gray-500" />
                      <span className="text-sm font-medium">Current Status:</span>
                      <Badge className={getStatusColor(company.userStatuses[0].status)}>
                        {company.userStatuses[0].status}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <Calendar className="w-3 h-3" />
                      <span>
                        Updated {new Date(company.userStatuses[0].updatedAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  {company.userStatuses[0].notes && (
                    <div className="mt-2">
                      <p className="text-sm text-gray-700 bg-white p-2 rounded border">
                        {company.userStatuses[0].notes}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row justify-end gap-3">
            <Button variant="outline" onClick={onClose} disabled={loading} className="w-full sm:w-auto">
              <X className="w-4 h-4 mr-2" />
              Cancel
            </Button>
            <Button onClick={handleStatusUpdate} disabled={loading} className="w-full sm:w-auto">
              <Save className="w-4 h-4 mr-2" />
              {loading ? "Saving..." : "Save Status & Notes"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
