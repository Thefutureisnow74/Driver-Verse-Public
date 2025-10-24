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
  GraduationCap,
  DollarSign,
  Star,
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
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { CERTIFICATION_TYPES } from "@/lib/license-client";
import { useCertifications, getUploadStatusVariant, getUploadStatusText } from "@/hooks/use-credentials";
import { toast } from "sonner";

interface MedicalCertificationsProps {
  onUploadComplete?: () => void;
}

export default function MedicalCertifications({ onUploadComplete }: MedicalCertificationsProps) {
  const [selectedCert, setSelectedCert] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [loadingCertifications, setLoadingCertifications] = useState<Set<string>>(new Set());
  
  // Fetch existing certifications
  const { data: certificationsData, isLoading: certificationsLoading, refetch: refetchCertifications } = useCertifications();

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
      refetchCertifications();
      onUploadComplete?.();
    } catch (error) {
      toast.error('Failed to upload certification');
      console.error('Upload error:', error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleViewCertification = async (certificationId: string) => {
    if (!certificationId) return;
    
    setLoadingCertifications(prev => new Set(prev).add(certificationId));
    
    try {
      const response = await fetch('/api/certifications/view', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          certificationId,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate view URL');
      }

      const { viewUrl } = await response.json();
      window.open(viewUrl, '_blank');
    } catch (error) {
      console.error('Error viewing certification:', error);
      toast.error('Failed to view certification');
    } finally {
      setLoadingCertifications(prev => {
        const newSet = new Set(prev);
        newSet.delete(certificationId);
        return newSet;
      });
    }
  };

  const handleDownloadCertification = async (certificationId: string, fileName?: string) => {
    if (!certificationId) return;
    
    setLoadingCertifications(prev => new Set(prev).add(certificationId));
    
    try {
      const response = await fetch('/api/certifications/view', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          certificationId,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate download URL');
      }

      const { viewUrl, fileName: apiFileName } = await response.json();
      
      // Create download link with signed URL
      const link = document.createElement('a');
      link.href = viewUrl;
      link.download = fileName || apiFileName || 'certification';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error downloading certification:', error);
      toast.error('Failed to download certification');
    } finally {
      setLoadingCertifications(prev => {
        const newSet = new Set(prev);
        newSet.delete(certificationId);
        return newSet;
      });
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

  const getCertificationsByCategory = () => {
    const categories: {
      'core-medical': Array<[string, any]>;
      'advanced-medical': Array<[string, any]>;
      'safety-compliance': Array<[string, any]>;
      'optional': Array<[string, any]>;
    } = {
      'core-medical': [],
      'advanced-medical': [],
      'safety-compliance': [],
      'optional': [],
    };

    Object.entries(CERTIFICATION_TYPES).forEach(([key, config]) => {
      if (categories[config.category as keyof typeof categories]) {
        categories[config.category as keyof typeof categories].push([key, config]);
      }
    });

    return categories;
  };

  const certificationsByCategory = getCertificationsByCategory();

  return (
    <div className="space-y-6">
      {/* Integrity Medical Courier Training */}
      <Card className="border-2 border-blue-200 bg-blue-50/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-900">
            <GraduationCap className="size-5" />
            Integrity Medical Courier Training
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-start gap-4">
            <div className="flex-1">
              <h3 className="font-semibold text-blue-900 mb-2">
                🎓 Professional Medical Courier Training
              </h3>
              <p className="text-sm text-blue-800 mb-4">
                Get professionally certified in medical specimen handling, HIPAA compliance, and hazardous drug transportation. 
                Integrity Medical Courier Training offers industry-leading courses designed specifically for courier drivers.
              </p>
              
              <div className="mb-4">
                <h4 className="font-medium text-blue-900 mb-2">📚 Available Courses:</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                  <div className="flex justify-between items-center p-2 bg-white/50 rounded">
                    <span className="flex-1 pr-2">• Specimen Handling & Transportation Bundle</span>
                    <span className="font-medium text-green-600 whitespace-nowrap">$38.95</span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-white/50 rounded">
                    <span className="flex-1 pr-2">• Chemotherapy (Hazardous) Drugs</span>
                    <span className="font-medium text-green-600 whitespace-nowrap">$99.00</span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-white/50 rounded">
                    <span className="flex-1 pr-2">• Independent Contractor Membership</span>
                    <span className="font-medium text-green-600 whitespace-nowrap">$59.00</span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-white/50 rounded">
                    <span className="flex-1 pr-2">• Dental Transportation</span>
                    <span className="font-medium text-green-600 whitespace-nowrap">$29.95</span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-white/50 rounded">
                    <span className="flex-1 pr-2">• Starting Your Own Courier Business</span>
                    <span className="font-medium text-green-600 whitespace-nowrap">$19.95</span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-white/50 rounded">
                    <span className="flex-1 pr-2">• Medical Courier Financial Masterclass</span>
                    <span className="font-medium text-green-600 whitespace-nowrap">$39.00</span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-white/50 rounded">
                    <span className="flex-1 pr-2">• Essential Marketing Tips</span>
                    <span className="font-medium text-green-600 whitespace-nowrap">$29.95</span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-white/50 rounded">
                    <span className="flex-1 pr-2">• Administrative Recommendations</span>
                    <span className="font-medium text-green-600 whitespace-nowrap">$39.00</span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-white/50 rounded">
                    <span className="flex-1 pr-2">• Dispatchers Training Course</span>
                    <span className="font-medium text-green-600 whitespace-nowrap">$45.00</span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-white/50 rounded">
                    <span className="flex-1 pr-2">• HIPAA-only Course</span>
                    <span className="font-medium text-green-600 whitespace-nowrap">$18.50</span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-white/50 rounded">
                    <span className="flex-1 pr-2">• Bloodborne Pathogen (BBP) Only</span>
                    <span className="font-medium text-green-600 whitespace-nowrap">$26.00</span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-white/50 rounded sm:col-span-2">
                    <span className="flex-1 pr-2">+ Annual Renewal Courses Available</span>
                    <span className="text-blue-600 whitespace-nowrap">Available</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mb-4">
                <Badge variant="secondary" className="bg-blue-100 text-blue-800">HIPAA Training</Badge>
                <Badge variant="secondary" className="bg-blue-100 text-blue-800">Specimen Handling</Badge>
                <Badge variant="secondary" className="bg-blue-100 text-blue-800">Bloodborne Pathogen</Badge>
                <Badge variant="secondary" className="bg-blue-100 text-blue-800">Hazardous Drugs</Badge>
                <Badge variant="secondary" className="bg-blue-100 text-blue-800">OSHA Compliant</Badge>
                <Badge variant="secondary" className="bg-blue-100 text-blue-800">Business Training</Badge>
              </div>

              <div className="bg-green-100 border border-green-200 rounded-lg p-3 mb-4">
                <p className="text-sm text-green-800">
                  💼 Why get certified? Medical courier jobs typically pay 25-40% more than standard delivery gigs and offer more stable, dedicated routes.
                </p>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-2">
            <Button 
              className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto"
              onClick={() => window.open('https://integritydelivers.com/', '_blank')}
            >
              <ExternalLink className="size-4 mr-2" />
              <span className="hidden sm:inline">Get Professional Training</span>
              <span className="sm:hidden">Get Training</span>
            </Button>
            <Button 
              variant="outline" 
              className="border-blue-300 text-blue-700 w-full sm:w-auto"
              onClick={() => window.open('https://integritydeliverstraining.thinkific.com/bundles/combo', '_blank')}
            >
              <DollarSign className="size-4 mr-2" />
              <span className="hidden sm:inline">Start with Bundle Course ($38.95)</span>
              <span className="sm:hidden">Bundle Course ($38.95)</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Certifications Tabs */}
      <Tabs defaultValue="core-medical" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 h-auto gap-1">
          <TabsTrigger value="core-medical" className="text-xs sm:text-sm p-2 sm:p-3">
            <span className="hidden sm:inline">Core Medical</span>
            <span className="sm:hidden">Core</span>
          </TabsTrigger>
          <TabsTrigger value="advanced-medical" className="text-xs sm:text-sm p-2 sm:p-3">
            <span className="hidden sm:inline">Advanced Medical</span>
            <span className="sm:hidden">Advanced</span>
          </TabsTrigger>
          <TabsTrigger value="safety-compliance" className="text-xs sm:text-sm p-2 sm:p-3">
            <span className="hidden sm:inline">Safety & Compliance</span>
            <span className="sm:hidden">Safety</span>
          </TabsTrigger>
          <TabsTrigger value="optional" className="text-xs sm:text-sm p-2 sm:p-3">
            Optional
          </TabsTrigger>
        </TabsList>

        {Object.entries(certificationsByCategory).map(([category, certs]) => (
          <TabsContent key={category} value={category} className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="capitalize">
                  {category.replace('-', ' ')} Certifications
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {certificationsLoading ? (
                  <div className="space-y-4">
                    {certs.map(([key]) => (
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
                  certs.map(([key, config]) => {
                    const existingCert = certificationsData?.certifications?.find(c => c.type === key);
                    return (
                      <div key={key} className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 border rounded-lg gap-4">
                        <div className="flex-1">
                          <div className="flex flex-wrap items-center gap-2 mb-1">
                            <h4 className="font-medium">{config.name}</h4>
                            {config.isRequired ? (
                              <Badge variant="destructive" className="text-xs">Required</Badge>
                            ) : (
                              <Badge variant="secondary" className="text-xs">Optional</Badge>
                            )}
                            <Badge 
                              variant={getUploadStatusVariant(existingCert?.isUploaded || false, config.isRequired)}
                              className="text-xs"
                            >
                              {getUploadStatusText(existingCert?.isUploaded || false, config.isRequired)}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">{config.description}</p>
                          {existingCert?.isUploaded && existingCert.data?.uploadedAt && (
                            <p className="text-xs text-muted-foreground mb-2">
                              Uploaded: {new Date(existingCert.data.uploadedAt).toLocaleDateString()}
                            </p>
                          )}
                          <div className="flex items-center gap-2">
                            {getStatusIcon(existingCert?.isUploaded ? 'uploaded' : 'pending')}
                            {getStatusBadge(existingCert?.isUploaded ? 'uploaded' : 'pending')}
                          </div>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-2 sm:flex-shrink-0">
                          <input
                            type="file"
                            id={`cert-${key}`}
                            accept=".pdf,.jpg,.jpeg,.png"
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) handleCertificationUpload(key, file);
                            }}
                          />
                          
                          {/* View and Download buttons for uploaded certifications */}
                          {existingCert?.isUploaded && existingCert.data?.id && (
                            <div className="flex gap-1 sm:gap-2">
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => existingCert.data && handleViewCertification(existingCert.data.id)}
                                disabled={!existingCert.data || loadingCertifications.has(existingCert.data.id)}
                                className="flex-1 sm:flex-none"
                                title="View Certification"
                              >
                                {existingCert.data && loadingCertifications.has(existingCert.data.id) ? (
                                  <Loader2 className="size-4 animate-spin" />
                                ) : (
                                  <Eye className="size-4" />
                                )}
                                <span className="ml-2 sm:hidden">View</span>
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => existingCert.data && handleDownloadCertification(existingCert.data.id, config.name)}
                                disabled={!existingCert.data || loadingCertifications.has(existingCert.data.id)}
                                className="flex-1 sm:flex-none"
                                title="Download Certification"
                              >
                                {existingCert.data && loadingCertifications.has(existingCert.data.id) ? (
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
                            onClick={() => document.getElementById(`cert-${key}`)?.click()}
                            disabled={isUploading}
                            variant={existingCert?.isUploaded ? "outline" : "default"}
                            className="w-full sm:w-auto"
                          >
                            <Upload className="size-4 mr-2" />
                            {existingCert?.isUploaded ? "Re-upload" : `Upload ${config.name.split(' ')[0]}`}
                          </Button>
                        </div>
                      </div>
                    );
                  })
                )}
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>

      {/* Custom Certifications */}
      <Card>
        <CardHeader>
          <CardTitle>Custom Certifications</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 border rounded-lg gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <h4 className="font-medium">Custom Certification 1</h4>
                <Badge variant="outline" className="text-xs">Custom</Badge>
              </div>
              <p className="text-sm text-muted-foreground mb-2">User-customizable certification</p>
              <div className="flex items-center gap-2">
                {getStatusIcon('pending')}
                {getStatusBadge('pending')}
              </div>
            </div>
            <div className="flex gap-2 sm:flex-shrink-0">
              <Button size="sm" variant="outline" className="flex-1 sm:flex-none">
                <Plus className="size-4 mr-2" />
                Add
              </Button>
              <Button size="sm" className="flex-1 sm:flex-none">
                <Upload className="size-4 mr-2" />
                Upload
              </Button>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 border rounded-lg gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <h4 className="font-medium">Custom Certification 2</h4>
                <Badge variant="outline" className="text-xs">Custom</Badge>
              </div>
              <p className="text-sm text-muted-foreground mb-2">User-customizable certification</p>
              <div className="flex items-center gap-2">
                {getStatusIcon('pending')}
                {getStatusBadge('pending')}
              </div>
            </div>
            <div className="flex gap-2 sm:flex-shrink-0">
              <Button size="sm" variant="outline" className="flex-1 sm:flex-none">
                <Plus className="size-4 mr-2" />
                Add
              </Button>
              <Button size="sm" className="flex-1 sm:flex-none">
                <Upload className="size-4 mr-2" />
                Upload
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
