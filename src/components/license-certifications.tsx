"use client";

import { useState } from "react";
import { 
  FileText, 
  Upload, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  ExternalLink,
  Plus,
  Eye,
  Download,
  Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription 
} from "@/components/ui/dialog";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useFileUpload } from "@/hooks/use-files";
import { LICENSE_TYPES, CERTIFICATION_TYPES } from "@/lib/license-client";
import { useLicenses, useDOTMC, getUploadStatusVariant, getUploadStatusText } from "@/hooks/use-credentials";
import { toast } from "sonner";

interface LicenseCertificationsProps {
  onUploadComplete?: () => void;
}

export default function LicenseCertifications({ onUploadComplete }: LicenseCertificationsProps) {
  const [selectedLicense, setSelectedLicense] = useState<string | null>(null);
  const [selectedCert, setSelectedCert] = useState<string | null>(null);
  const [dotNumber, setDotNumber] = useState("");
  const [mcNumber, setMcNumber] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [loadingLicenses, setLoadingLicenses] = useState<Set<string>>(new Set());

  const uploadMutation = useFileUpload();
  
  // Fetch existing data
  const { data: licensesData, isLoading: licensesLoading, refetch: refetchLicenses } = useLicenses();
  const { data: dotMcData, isLoading: dotMcLoading, refetch: refetchDOTMC } = useDOTMC();

  const handleLicenseUpload = async (licenseType: string, file: File) => {
    setIsUploading(true);
    try {
      // Get presigned URL
      const response = await fetch('/api/licenses/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: licenseType,
          fileName: file.name,
          mimeType: file.type,
        }),
      });

      if (!response.ok) throw new Error('Failed to get upload URL');

      const { presignedUrl, fileKey, fileUrl } = await response.json();

      // Upload to S3
      const uploadResponse = await fetch(presignedUrl, {
        method: 'PUT',
        body: file,
        headers: { 'Content-Type': file.type },
      });

      if (!uploadResponse.ok) throw new Error('Failed to upload file');

      // Save license record
      await fetch('/api/licenses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: licenseType,
          fileKey,
          fileUrl,
          status: 'uploaded',
        }),
      });

      toast.success('License uploaded successfully');
      refetchLicenses();
      onUploadComplete?.();
    } catch (error) {
      toast.error('Failed to upload license');
      console.error('Upload error:', error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleViewLicense = async (licenseId: string) => {
    if (!licenseId) return;
    
    setLoadingLicenses(prev => new Set(prev).add(licenseId));
    
    try {
      const response = await fetch('/api/licenses/view', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          licenseId,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate view URL');
      }

      const { viewUrl } = await response.json();
      window.open(viewUrl, '_blank');
    } catch (error) {
      console.error('Error viewing license:', error);
      toast.error('Failed to view license');
    } finally {
      setLoadingLicenses(prev => {
        const newSet = new Set(prev);
        newSet.delete(licenseId);
        return newSet;
      });
    }
  };

  const handleDownloadLicense = async (licenseId: string, fileName?: string) => {
    if (!licenseId) return;
    
    setLoadingLicenses(prev => new Set(prev).add(licenseId));
    
    try {
      const response = await fetch('/api/licenses/view', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          licenseId,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate download URL');
      }

      const { viewUrl, fileName: apiFileName } = await response.json();
      
      // Create download link with signed URL
      const link = document.createElement('a');
      link.href = viewUrl;
      link.download = fileName || apiFileName || 'license';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error downloading license:', error);
      toast.error('Failed to download license');
    } finally {
      setLoadingLicenses(prev => {
        const newSet = new Set(prev);
        newSet.delete(licenseId);
        return newSet;
      });
    }
  };

  const handleCertificationUpload = async (certType: string, file: File) => {
    setIsUploading(true);
    try {
      // Get presigned URL
      const response = await fetch('/api/certifications/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: certType,
          fileName: file.name,
          mimeType: file.type,
        }),
      });

      if (!response.ok) throw new Error('Failed to get upload URL');

      const { presignedUrl, fileKey, fileUrl } = await response.json();

      // Upload to S3
      const uploadResponse = await fetch(presignedUrl, {
        method: 'PUT',
        body: file,
        headers: { 'Content-Type': file.type },
      });

      if (!uploadResponse.ok) throw new Error('Failed to upload file');

      // Save certification record
      await fetch('/api/certifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: certType,
          fileKey,
          fileUrl,
          status: 'uploaded',
        }),
      });

      toast.success('Certification uploaded successfully');
      refetchLicenses();
      onUploadComplete?.();
    } catch (error) {
      toast.error('Failed to upload certification');
      console.error('Upload error:', error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDOTMCSave = async () => {
    try {
      await fetch('/api/dot-mc', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          dotNumber: dotNumber || null,
          mcNumber: mcNumber || null,
        }),
      });

      toast.success('DOT/MC numbers saved successfully');
      refetchDOTMC();
      onUploadComplete?.();
    } catch (error) {
      toast.error('Failed to save DOT/MC numbers');
      console.error('Save error:', error);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'uploaded':
      case 'verified':
        return <CheckCircle className="size-4 text-green-600" />;
      case 'pending':
        return <Clock className="size-4 text-yellow-600" />;
      case 'expired':
      case 'rejected':
        return <AlertCircle className="size-4 text-red-600" />;
      default:
        return <Clock className="size-4 text-gray-400" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'uploaded':
      case 'verified':
        return <Badge variant="default" className="bg-green-100 text-green-800">Uploaded</Badge>;
      case 'pending':
        return <Badge variant="secondary">Pending Upload</Badge>;
      case 'expired':
        return <Badge variant="destructive">Expired</Badge>;
      case 'rejected':
        return <Badge variant="destructive">Rejected</Badge>;
      default:
        return <Badge variant="secondary">Pending Upload</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Driver & Vehicle Credentials */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="size-5" />
            Driver & Vehicle Credentials
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {licensesLoading ? (
            <div className="space-y-4">
              {Object.entries(LICENSE_TYPES).map(([key]) => (
                <div key={key} className="flex items-center justify-between p-4 border rounded-lg animate-pulse">
                  <div className="flex-1">
                    <div className="h-4 bg-muted rounded w-1/3 mb-2"></div>
                    <div className="h-3 bg-muted rounded w-2/3"></div>
                  </div>
                  <div className="h-8 bg-muted rounded w-24"></div>
                </div>
              ))}
            </div>
          ) : (
            licensesData?.licenses?.map((license) => (
              <div key={license.type} className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 border rounded-lg gap-4">
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <h4 className="font-medium">{license.name}</h4>
                    {/* Single badge showing status and requirement */}
                    <Badge 
                      variant={license.isRequired ? "destructive" : getUploadStatusVariant(license.isUploaded, license.isRequired)}
                      className="text-xs"
                    >
                      {license.isRequired ? "Required" : getUploadStatusText(license.isUploaded, license.isRequired)}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">{license.description}</p>
                  {license.isUploaded && license.data?.uploadedAt && (
                    <p className="text-xs text-muted-foreground mb-2">
                      Uploaded: {new Date(license.data.uploadedAt).toLocaleDateString()}
                    </p>
                  )}
                  <div className="flex items-center gap-2">
                    {getStatusIcon(license.isUploaded ? 'uploaded' : 'pending')}
                    <span className="text-xs text-muted-foreground">
                      {license.isUploaded ? 'Uploaded' : 'Pending Upload'}
                    </span>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-2 sm:flex-shrink-0">
                  <input
                    type="file"
                    id={`license-${license.type}`}
                    accept=".pdf,.jpg,.jpeg,.png"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleLicenseUpload(license.type, file);
                    }}
                  />
                  
                  {/* View and Download buttons for uploaded licenses */}
                  {license.isUploaded && license.data?.id && (
                    <div className="flex gap-1 sm:gap-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => license.data && handleViewLicense(license.data.id)}
                        disabled={!license.data || loadingLicenses.has(license.data.id)}
                        className="flex-1 sm:flex-none"
                        title="View License"
                      >
                        {license.data && loadingLicenses.has(license.data.id) ? (
                          <Loader2 className="size-4 animate-spin" />
                        ) : (
                          <Eye className="size-4" />
                        )}
                        <span className="ml-2 sm:hidden">View</span>
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => license.data && handleDownloadLicense(license.data.id, license.name)}
                        disabled={!license.data || loadingLicenses.has(license.data.id)}
                        className="flex-1 sm:flex-none"
                        title="Download License"
                      >
                        {license.data && loadingLicenses.has(license.data.id) ? (
                          <Loader2 className="size-4 animate-spin" />
                        ) : (
                          <Download className="size-4" />
                        )}
                        <span className="ml-2 sm:hidden">Download</span>
                      </Button>
                    </div>
                  )}
                  
                  {/* Upload/Re-upload button */}
                  <Button
                    size="sm"
                    onClick={() => document.getElementById(`license-${license.type}`)?.click()}
                    disabled={isUploading}
                    variant={license.isUploaded ? "outline" : "default"}
                    className="w-full sm:w-auto"
                  >
                    <Upload className="size-4 mr-2" />
                    {license.isUploaded ? "Re-upload" : `Upload ${license.name.split(' ')[0]}`}
                  </Button>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      {/* DOT & MC Numbers */}
      <Card>
        <CardHeader>
          <CardTitle>DOT & MC Numbers</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {dotMcLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="h-4 bg-muted rounded w-20"></div>
                <div className="h-10 bg-muted rounded"></div>
                <div className="h-3 bg-muted rounded w-3/4"></div>
              </div>
              <div className="space-y-2">
                <div className="h-4 bg-muted rounded w-20"></div>
                <div className="h-10 bg-muted rounded"></div>
                <div className="h-3 bg-muted rounded w-3/4"></div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <Label htmlFor="dot-number">DOT Number</Label>
                <div className="flex flex-col sm:flex-row gap-2">
                  <Input
                    id="dot-number"
                    placeholder="Enter DOT Number"
                    value={dotNumber || dotMcData?.dotNumber?.value || ''}
                    onChange={(e) => setDotNumber(e.target.value)}
                    className="flex-1"
                  />
                  <Button 
                    size="sm" 
                    variant={dotMcData?.dotNumber?.hasFile ? "default" : "outline"}
                    onClick={() => {
                      // Handle DOT certificate upload
                      const input = document.createElement('input');
                      input.type = 'file';
                      input.accept = '.pdf,.jpg,.jpeg,.png';
                      input.onchange = (e) => {
                        const file = (e.target as HTMLInputElement).files?.[0];
                        if (file) {
                          // Handle DOT certificate upload
                          console.log('DOT certificate upload:', file);
                        }
                      };
                      input.click();
                    }}
                    className="w-full sm:w-auto sm:flex-shrink-0"
                  >
                    <Upload className="size-4 mr-2 sm:mr-0" />
                    <span className="sm:hidden">Upload Certificate</span>
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Department of Transportation identification number for safety monitoring
                </p>
                {dotMcData?.dotNumber?.hasFile && (
                  <p className="text-xs text-green-600">
                    ✓ Certificate uploaded: {dotMcData.dotNumber.uploadedAt ? new Date(dotMcData.dotNumber.uploadedAt).toLocaleDateString() : 'Unknown'}
                  </p>
                )}
              </div>
              <div className="space-y-3">
                <Label htmlFor="mc-number">MC Number</Label>
                <div className="flex flex-col sm:flex-row gap-2">
                  <Input
                    id="mc-number"
                    placeholder="Enter MC Number"
                    value={mcNumber || dotMcData?.mcNumber?.value || ''}
                    onChange={(e) => setMcNumber(e.target.value)}
                    className="flex-1"
                  />
                  <Button 
                    size="sm" 
                    variant={dotMcData?.mcNumber?.hasFile ? "default" : "outline"}
                    onClick={() => {
                      // Handle MC certificate upload
                      const input = document.createElement('input');
                      input.type = 'file';
                      input.accept = '.pdf,.jpg,.jpeg,.png';
                      input.onchange = (e) => {
                        const file = (e.target as HTMLInputElement).files?.[0];
                        if (file) {
                          // Handle MC certificate upload
                          console.log('MC certificate upload:', file);
                        }
                      };
                      input.click();
                    }}
                    className="w-full sm:w-auto sm:flex-shrink-0"
                  >
                    <Upload className="size-4 mr-2 sm:mr-0" />
                    <span className="sm:hidden">Upload Certificate</span>
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Motor Carrier authority number for interstate commerce operations
                </p>
                {dotMcData?.mcNumber?.hasFile && (
                  <p className="text-xs text-green-600">
                    ✓ Certificate uploaded: {dotMcData.mcNumber.uploadedAt ? new Date(dotMcData.mcNumber.uploadedAt).toLocaleDateString() : 'Unknown'}
                  </p>
                )}
              </div>
            </div>
          )}
          <Button onClick={handleDOTMCSave} className="w-full">
            Save DOT & MC Numbers
          </Button>
        </CardContent>
      </Card>

      {/* Medical Certifications Card */}
      <Card className="cursor-pointer hover:shadow-md transition-shadow">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText className="size-5" />
              Medical Certifications
            </div>
            <ExternalLink className="size-4 text-muted-foreground" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">
            Upload your medical and healthcare-related certifications for gig work opportunities
          </p>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Badge variant="secondary">View Certifications</Badge>
            </div>
            <Button variant="outline" size="sm">
              <Plus className="size-4 mr-2" />
              Add Certification
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Upload Dialogs */}
      <Dialog open={!!selectedLicense} onOpenChange={() => setSelectedLicense(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Upload License</DialogTitle>
            <DialogDescription>
              Upload your {selectedLicense && LICENSE_TYPES[selectedLicense as keyof typeof LICENSE_TYPES]?.name}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="license-file">Select File</Label>
              <Input
                id="license-file"
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                className="mt-1"
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setSelectedLicense(null)}>
                Cancel
              </Button>
              <Button>Upload</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={!!selectedCert} onOpenChange={() => setSelectedCert(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Upload Certification</DialogTitle>
            <DialogDescription>
              Upload your {selectedCert && CERTIFICATION_TYPES[selectedCert as keyof typeof CERTIFICATION_TYPES]?.name}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="cert-file">Select File</Label>
              <Input
                id="cert-file"
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                className="mt-1"
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setSelectedCert(null)}>
                Cancel
              </Button>
              <Button>Upload</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
