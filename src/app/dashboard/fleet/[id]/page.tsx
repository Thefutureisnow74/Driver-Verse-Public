"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { format } from "date-fns";
import { 
  ArrowLeft, 
  Edit, 
  Trash2, 
  Car,
  Calendar,
  Gauge,
  Fuel,
  MapPin,
  FileText,
  Download,
  Eye,
  ExternalLink,
  DollarSign,
  Settings,
  Shield,
  User,
  Hash,
  Wrench,
  Upload,
  Plus,
  X,
  CheckCircle,
  AlertCircle,
  Image as ImageIcon
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { useFleet } from "@/hooks/use-fleet";
import { VehicleForm } from "../_components/vehicle-form";

interface Vehicle {
  id: string;
  nickname: string;
  year?: number | null;
  make: string;
  model: string;
  vehicleType?: string | null;
  color?: string | null;
  vin?: string | null;
  licensePlate?: string | null;
  state?: string | null;
  mileage?: number | null;
  fuelType?: string | null;
  mpg?: number | null;
  ownerNames?: string | null;
  purchaseLocation?: string | null;
  financialInfo?: any;
  specifications?: any;
  insuranceInfo?: any;
  vehiclePhotos?: any;
  insuranceDocs?: any;
  registrationDocs?: any;
  warrantyDocs?: any;
  maintenanceDocs?: any;
  otherDocs?: any;
  notes?: string | null;
  createdAt: string;
  updatedAt: string;
}

interface DocumentItem {
  id?: string;
  key?: string;
  fileKey?: string;
  name: string;
  url?: string;
  uploadedAt?: string;
}

interface DocumentFile {
  id?: string;
  name: string;
  size: number;
  type: string;
  url?: string;
  uploadStatus: 'pending' | 'uploading' | 'completed' | 'error';
  uploadProgress?: number;
}

interface DocumentCategory {
  key: string;
  title: string;
  description: string;
  acceptedTypes: string[];
  maxFiles: number;
  icon: React.ReactNode;
}

const vehicleTypeColors: Record<string, string> = {
  Car: "bg-blue-500",
  Truck: "bg-red-500",
  Van: "bg-green-500",
  SUV: "bg-purple-500",
  Motorcycle: "bg-orange-500",
  Trailer: "bg-gray-500",
  "Box Truck": "bg-yellow-500",
  "Pickup Truck": "bg-red-600",
  "Cargo Van": "bg-green-600",
  "Delivery Van": "bg-blue-600",
  "Semi Truck": "bg-gray-700",
  Flatbed: "bg-yellow-600",
  Other: "bg-neutral-500",
};

const documentCategories: DocumentCategory[] = [
  {
    key: 'vehiclePhotos',
    title: 'Vehicle Photos',
    description: 'Exterior, interior, engine bay, etc.',
    acceptedTypes: ['image/jpeg', 'image/png', 'image/webp'],
    maxFiles: 10,
    icon: <ImageIcon className="h-4 w-4" />
  },
  {
    key: 'insurancePolicy',
    title: 'Insurance Policy',
    description: 'Insurance policy documents',
    acceptedTypes: ['application/pdf', 'image/jpeg', 'image/png'],
    maxFiles: 5,
    icon: <Shield className="h-4 w-4" />
  },
  {
    key: 'insuranceCards',
    title: 'Insurance Cards',
    description: 'Insurance card copies',
    acceptedTypes: ['application/pdf', 'image/jpeg', 'image/png'],
    maxFiles: 5,
    icon: <Shield className="h-4 w-4" />
  },
  {
    key: 'registration',
    title: 'Registration',
    description: 'Vehicle registration documents',
    acceptedTypes: ['application/pdf', 'image/jpeg', 'image/png'],
    maxFiles: 3,
    icon: <FileText className="h-4 w-4" />
  },
  {
    key: 'title',
    title: 'Title',
    description: 'Vehicle title documents',
    acceptedTypes: ['application/pdf', 'image/jpeg', 'image/png'],
    maxFiles: 3,
    icon: <FileText className="h-4 w-4" />
  },
  {
    key: 'vehicleWarranty',
    title: 'Vehicle Warranty',
    description: 'Vehicle warranty information',
    acceptedTypes: ['application/pdf', 'image/jpeg', 'image/png'],
    maxFiles: 5,
    icon: <Settings className="h-4 w-4" />
  },
  {
    key: 'tireWarranty',
    title: 'Tire Warranty',
    description: 'Tire warranty documents',
    acceptedTypes: ['application/pdf', 'image/jpeg', 'image/png'],
    maxFiles: 3,
    icon: <Settings className="h-4 w-4" />
  },
  {
    key: 'partsWarranty',
    title: 'Parts Warranty',
    description: 'Parts warranty information',
    acceptedTypes: ['application/pdf', 'image/jpeg', 'image/png'],
    maxFiles: 5,
    icon: <Settings className="h-4 w-4" />
  },
  {
    key: 'maintenanceRecords',
    title: 'Maintenance Records',
    description: 'Service and maintenance history',
    acceptedTypes: ['application/pdf', 'image/jpeg', 'image/png'],
    maxFiles: 10,
    icon: <Wrench className="h-4 w-4" />
  },
  {
    key: 'otherDocuments',
    title: 'Other Documents',
    description: 'Additional vehicle-related documents',
    acceptedTypes: ['application/pdf', 'image/jpeg', 'image/png', 'text/plain'],
    maxFiles: 10,
    icon: <FileText className="h-4 w-4" />
  }
];

export default function VehicleDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { updateVehicle, deleteVehicle } = useFleet();
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [documentUrls, setDocumentUrls] = useState<Record<string, string>>({});
  const [loadingUrls, setLoadingUrls] = useState<Set<string>>(new Set());
  const [uploadingFiles, setUploadingFiles] = useState<Record<string, DocumentFile[]>>({});
  const [showUploadSection, setShowUploadSection] = useState(false);

  const vehicleId = params.id as string;

  useEffect(() => {
    fetchVehicle();
  }, [vehicleId]);

  const fetchVehicle = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/fleet/${vehicleId}`);
      
      if (!response.ok) {
        if (response.status === 404) {
          setError("Vehicle not found");
        } else {
          setError("Failed to load vehicle details");
        }
        return;
      }

      const vehicleData = await response.json();
      setVehicle(vehicleData);
    } catch (error) {
      console.error("Error fetching vehicle:", error);
      setError("Failed to load vehicle details");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = () => {
    setShowEditDialog(true);
  };

  const handleUpdateVehicle = async (data: any) => {
    try {
      setIsUpdating(true);
      await updateVehicle(vehicleId, data);
      toast.success("Vehicle updated successfully");
      setShowEditDialog(false);
      // Refresh vehicle data
      await fetchVehicle();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to update vehicle");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleCancelEdit = () => {
    setShowEditDialog(false);
  };

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      await deleteVehicle(vehicleId);
      toast.success("Vehicle deleted successfully");
      router.push("/dashboard/fleet");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to delete vehicle");
    } finally {
      setIsDeleting(false);
      setShowDeleteDialog(false);
    }
  };

  const getDocumentUrl = async (documentKey: string) => {
    if (documentUrls[documentKey] || loadingUrls.has(documentKey)) {
      return documentUrls[documentKey];
    }

    try {
      setLoadingUrls(prev => new Set(prev).add(documentKey));
      
      const response = await fetch('/api/fleet/documents/view', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          vehicleId,
          documentKeys: [documentKey]
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get document URL');
      }

      const data = await response.json();
      const url = data.presignedUrls[documentKey];
      
      if (url) {
        setDocumentUrls(prev => ({ ...prev, [documentKey]: url }));
        return url;
      }
    } catch (error) {
      console.error('Error getting document URL:', error);
      toast.error('Failed to load document');
    } finally {
      setLoadingUrls(prev => {
        const newSet = new Set(prev);
        newSet.delete(documentKey);
        return newSet;
      });
    }
  };

  const handleViewDocument = async (doc: DocumentItem) => {
    const documentKey = doc.key || doc.fileKey;
    if (!documentKey) return;
    
    const url = await getDocumentUrl(documentKey);
    if (url) {
      window.open(url, '_blank');
    }
  };

  const handleDownloadDocument = async (doc: DocumentItem) => {
    const documentKey = doc.key || doc.fileKey;
    if (!documentKey) return;
    
    const url = await getDocumentUrl(documentKey);
    if (url) {
      const link = document.createElement('a');
      link.href = url;
      link.download = doc.name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleFileSelect = async (categoryKey: string, files: FileList) => {
    const category = documentCategories.find(cat => cat.key === categoryKey);
    if (!category) return;

    const validFiles: DocumentFile[] = [];
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      
      // Validate file type
      if (!category.acceptedTypes.includes(file.type)) {
        toast.error(`Invalid file type for ${file.name}. Accepted types: ${category.acceptedTypes.join(', ')}`);
        continue;
      }

      // Validate file size (10MB limit)
      if (file.size > 10 * 1024 * 1024) {
        toast.error(`File ${file.name} is too large. Maximum size is 10MB.`);
        continue;
      }

      validFiles.push({
        name: file.name,
        size: file.size,
        type: file.type,
        uploadStatus: 'pending'
      });
    }

    if (validFiles.length === 0) return;

    // Add files to uploading state
    setUploadingFiles(prev => ({
      ...prev,
      [categoryKey]: [...(prev[categoryKey] || []), ...validFiles]
    }));

    // Upload each file
    for (const documentFile of validFiles) {
      await uploadFile(categoryKey, documentFile, files);
    }
  };

  const uploadFile = async (categoryKey: string, documentFile: DocumentFile, fileList: FileList) => {
    const file = Array.from(fileList).find(f => f.name === documentFile.name);
    if (!file) return;

    try {
      // Update status to uploading
      setUploadingFiles(prev => ({
        ...prev,
        [categoryKey]: prev[categoryKey]?.map(f => 
          f.name === documentFile.name 
            ? { ...f, uploadStatus: 'uploading' as const }
            : f
        ) || []
      }));

      // Get presigned upload URL
      const uploadResponse = await fetch('/api/fleet/documents/upload', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fileName: file.name,
          fileType: file.type,
          documentCategory: categoryKey,
          vehicleId: vehicleId
        }),
      });

      if (!uploadResponse.ok) {
        throw new Error('Failed to get upload URL');
      }

      const { uploadUrl, fileKey, fileUrl } = await uploadResponse.json();

      // Upload file to S3
      const s3Response = await fetch(uploadUrl, {
        method: 'PUT',
        body: file,
        headers: {
          'Content-Type': file.type,
        },
      });

      if (!s3Response.ok) {
        throw new Error('Failed to upload file');
      }

      // Update vehicle with new document
      await updateVehicleDocument(categoryKey, {
        key: fileKey,
        name: file.name,
        uploadedAt: new Date().toISOString()
      });

      // Update status to completed
      setUploadingFiles(prev => ({
        ...prev,
        [categoryKey]: prev[categoryKey]?.map(f => 
          f.name === documentFile.name 
            ? { ...f, uploadStatus: 'completed' as const, url: fileUrl }
            : f
        ) || []
      }));

      toast.success(`${file.name} uploaded successfully`);

      // Refresh vehicle data to show new document
      await fetchVehicle();

    } catch (error) {
      console.error('Upload error:', error);
      
      // Update status to error
      setUploadingFiles(prev => ({
        ...prev,
        [categoryKey]: prev[categoryKey]?.map(f => 
          f.name === documentFile.name 
            ? { ...f, uploadStatus: 'error' as const }
            : f
        ) || []
      }));

      toast.error(`Failed to upload ${file.name}`);
    }
  };

  const updateVehicleDocument = async (categoryKey: string, newDoc: DocumentItem) => {
    if (!vehicle) return;

    const updatedVehicle = { ...vehicle };
    
    // Handle different document structures
    if (categoryKey === 'vehiclePhotos' || categoryKey === 'maintenanceRecords' || categoryKey === 'otherDocuments') {
      // Direct array
      if (!updatedVehicle[categoryKey as keyof Vehicle]) {
        (updatedVehicle as any)[categoryKey] = [];
      }
      ((updatedVehicle as any)[categoryKey] as DocumentItem[]).push(newDoc);
    } else if (categoryKey.startsWith('insurance')) {
      // Insurance docs structure
      if (!updatedVehicle.insuranceDocs) {
        updatedVehicle.insuranceDocs = {};
      }
      const subKey = categoryKey.replace('insurance', '').toLowerCase();
      if (!(updatedVehicle.insuranceDocs as any)[subKey]) {
        (updatedVehicle.insuranceDocs as any)[subKey] = [];
      }
      ((updatedVehicle.insuranceDocs as any)[subKey] as DocumentItem[]).push(newDoc);
    } else if (categoryKey === 'registration' || categoryKey === 'title') {
      // Registration docs structure
      if (!updatedVehicle.registrationDocs) {
        updatedVehicle.registrationDocs = {};
      }
      if (!(updatedVehicle.registrationDocs as any)[categoryKey]) {
        (updatedVehicle.registrationDocs as any)[categoryKey] = [];
      }
      ((updatedVehicle.registrationDocs as any)[categoryKey] as DocumentItem[]).push(newDoc);
    } else if (categoryKey.includes('Warranty')) {
      // Warranty docs structure
      if (!updatedVehicle.warrantyDocs) {
        updatedVehicle.warrantyDocs = {};
      }
      const subKey = categoryKey.replace('Warranty', '').toLowerCase();
      if (!(updatedVehicle.warrantyDocs as any)[subKey]) {
        (updatedVehicle.warrantyDocs as any)[subKey] = [];
      }
      ((updatedVehicle.warrantyDocs as any)[subKey] as DocumentItem[]).push(newDoc);
    }

    // Update vehicle in database
    await updateVehicle(vehicleId, {
      ...updatedVehicle,
      year: updatedVehicle.year || undefined,
      vehicleType: updatedVehicle.vehicleType || undefined,
      color: updatedVehicle.color || undefined,
      vin: updatedVehicle.vin || undefined,
      licensePlate: updatedVehicle.licensePlate || undefined,
      state: updatedVehicle.state || undefined,
      mileage: updatedVehicle.mileage || undefined,
      fuelType: updatedVehicle.fuelType || undefined,
      mpg: updatedVehicle.mpg || undefined,
      ownerNames: updatedVehicle.ownerNames || undefined,
      purchaseLocation: updatedVehicle.purchaseLocation || undefined,
      notes: updatedVehicle.notes || undefined
    });
  };

  const removeUploadingFile = (categoryKey: string, fileName: string) => {
    setUploadingFiles(prev => ({
      ...prev,
      [categoryKey]: prev[categoryKey]?.filter(f => f.name !== fileName) || []
    }));
  };

  const getVehicleDisplayName = () => {
    if (!vehicle) return '';
    const parts = [];
    if (vehicle.year) parts.push(vehicle.year);
    parts.push(vehicle.make);
    parts.push(vehicle.model);
    return parts.join(' ');
  };

  const getAllDocuments = (): { category: string; documents: DocumentItem[]; subcategories?: { name: string; documents: DocumentItem[] }[]; icon: any }[] => {
    if (!vehicle) return [];

    const documentCategories = [
      { 
        key: 'vehiclePhotos', 
        label: 'Vehicle Photos', 
        data: vehicle.vehiclePhotos,
        icon: Car
      },
      { 
        key: 'insuranceDocs', 
        label: 'Insurance Documents', 
        data: vehicle.insuranceDocs,
        icon: Shield,
        hasSubcategories: true
      },
      { 
        key: 'registrationDocs', 
        label: 'Registration Documents', 
        data: vehicle.registrationDocs,
        icon: FileText,
        hasSubcategories: true
      },
      { 
        key: 'warrantyDocs', 
        label: 'Warranty Documents', 
        data: vehicle.warrantyDocs,
        icon: Settings,
        hasSubcategories: true
      },
      { 
        key: 'maintenanceDocs', 
        label: 'Maintenance Records', 
        data: vehicle.maintenanceDocs,
        icon: Wrench
      },
      { 
        key: 'otherDocs', 
        label: 'Other Documents', 
        data: vehicle.otherDocs,
        icon: FileText
      },
    ];

    return documentCategories
      .map(category => {
        const documents: DocumentItem[] = [];
        const subcategories: { name: string; documents: DocumentItem[] }[] = [];
        
        if (category.data && typeof category.data === 'object') {
          if (Array.isArray(category.data)) {
            // Simple array of documents
            documents.push(...category.data.filter(doc => doc && (doc.key || doc.fileKey)));
          } else if (category.hasSubcategories) {
            // Handle nested structure with subcategories
            Object.entries(category.data).forEach(([subKey, docArray]: [string, any]) => {
              if (Array.isArray(docArray) && docArray.length > 0) {
                const validDocs = docArray.filter(doc => doc && (doc.key || doc.fileKey));
                if (validDocs.length > 0) {
                  subcategories.push({
                    name: subKey.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()),
                    documents: validDocs
                  });
                }
              }
            });
          } else {
            // Handle flat object structure
            Object.values(category.data).forEach((docArray: any) => {
              if (Array.isArray(docArray)) {
                documents.push(...docArray.filter(doc => doc && (doc.key || doc.fileKey)));
              }
            });
          }
        }

        const totalDocuments = documents.length + subcategories.reduce((sum, sub) => sum + sub.documents.length, 0);
        
        if (totalDocuments > 0) {
          return {
            category: category.label,
            documents,
            subcategories: subcategories.length > 0 ? subcategories : undefined,
            icon: category.icon
          };
        }
        return null;
      })
      .filter(Boolean) as { category: string; documents: DocumentItem[]; subcategories?: { name: string; documents: DocumentItem[] }[]; icon: any }[];
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-neutral-100 dark:from-neutral-900 dark:to-neutral-800">
        <div className="container mx-auto px-4 py-8">
          <Card className="animate-pulse">
            <CardHeader>
              <div className="h-8 bg-neutral-200 dark:bg-neutral-700 rounded mb-4"></div>
              <div className="h-6 bg-neutral-200 dark:bg-neutral-700 rounded w-3/4"></div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="h-4 bg-neutral-200 dark:bg-neutral-700 rounded"></div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (error || !vehicle) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-neutral-100 dark:from-neutral-900 dark:to-neutral-800">
        <div className="container mx-auto px-4 py-8">
          <Card>
            <CardContent className="p-8 text-center">
              <div className="text-red-500 mb-4">
                <Car className="h-12 w-12 mx-auto" />
              </div>
              <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-2">
                {error || "Vehicle not found"}
              </h3>
              <Button onClick={() => router.push("/dashboard/fleet")} className="mt-4">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Fleet
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const existingDocuments = getAllDocuments();

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-neutral-100 dark:from-neutral-900 dark:to-neutral-800">
      {/* Header */}
      <div className="bg-white/90 dark:bg-neutral-800/90 backdrop-blur-sm border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => router.push("/dashboard/fleet")}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Fleet
              </Button>
              
              <div className="flex items-center gap-3">
                <div className={`w-4 h-4 rounded-full ${vehicleTypeColors[vehicle.vehicleType || 'Other'] || vehicleTypeColors.Other}`} />
                <div>
                  <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">
                    {vehicle.nickname}
                  </h1>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400">
                    {getVehicleDisplayName()}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={handleEdit}>
                <Edit className="h-4 w-4 mr-2" />
                Edit Vehicle
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setShowDeleteDialog(true)}
                className="text-red-600 hover:text-red-700 border-red-200 hover:border-red-300"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Vehicle Information */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Car className="h-5 w-5" />
                  Basic Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {vehicle.vehicleType && (
                    <div>
                      <label className="text-sm font-medium text-neutral-600 dark:text-neutral-400">Type</label>
                      <Badge variant="secondary" className="mt-1 block w-fit">
                        {vehicle.vehicleType}
                      </Badge>
                    </div>
                  )}
                  
                  {vehicle.color && (
                    <div>
                      <label className="text-sm font-medium text-neutral-600 dark:text-neutral-400">Color</label>
                      <p className="text-sm text-neutral-900 dark:text-white">{vehicle.color}</p>
                    </div>
                  )}

                  {vehicle.vin && (
                    <div>
                      <label className="text-sm font-medium text-neutral-600 dark:text-neutral-400">VIN</label>
                      <p className="text-sm text-neutral-900 dark:text-white font-mono">{vehicle.vin}</p>
                    </div>
                  )}

                  {vehicle.licensePlate && (
                    <div>
                      <label className="text-sm font-medium text-neutral-600 dark:text-neutral-400">License Plate</label>
                      <p className="text-sm text-neutral-900 dark:text-white">
                        {vehicle.licensePlate} {vehicle.state && `(${vehicle.state})`}
                      </p>
                    </div>
                  )}

                  {vehicle.mileage && (
                    <div>
                      <label className="text-sm font-medium text-neutral-600 dark:text-neutral-400">Mileage</label>
                      <p className="text-sm text-neutral-900 dark:text-white">
                        {vehicle.mileage.toLocaleString()} miles
                      </p>
                    </div>
                  )}

                  {vehicle.fuelType && (
                    <div>
                      <label className="text-sm font-medium text-neutral-600 dark:text-neutral-400">Fuel Type</label>
                      <p className="text-sm text-neutral-900 dark:text-white">
                        {vehicle.fuelType} {vehicle.mpg && `(${vehicle.mpg} MPG)`}
                      </p>
                    </div>
                  )}

                  {vehicle.ownerNames && (
                    <div>
                      <label className="text-sm font-medium text-neutral-600 dark:text-neutral-400">Owner(s)</label>
                      <p className="text-sm text-neutral-900 dark:text-white">{vehicle.ownerNames}</p>
                    </div>
                  )}

                  {vehicle.purchaseLocation && (
                    <div>
                      <label className="text-sm font-medium text-neutral-600 dark:text-neutral-400">Purchase Location</label>
                      <p className="text-sm text-neutral-900 dark:text-white">{vehicle.purchaseLocation}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Financial Information */}
            {vehicle.financialInfo && Object.keys(vehicle.financialInfo).length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="h-5 w-5" />
                    Financial Information
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.entries(vehicle.financialInfo).map(([key, value]) => 
                      value ? (
                        <div key={key}>
                          <label className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
                            {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                          </label>
                          <p className="text-sm text-neutral-900 dark:text-white">
                            {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                          </p>
                        </div>
                      ) : null
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Vehicle Specifications */}
            {vehicle.specifications && Object.keys(vehicle.specifications).length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="h-5 w-5" />
                    Vehicle Specifications
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.entries(vehicle.specifications).map(([key, value]) => 
                      value ? (
                        <div key={key}>
                          <label className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
                            {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                          </label>
                          <p className="text-sm text-neutral-900 dark:text-white">
                            {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                          </p>
                        </div>
                      ) : null
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Insurance Information */}
            {vehicle.insuranceInfo && Object.keys(vehicle.insuranceInfo).length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    Insurance Information
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {/* Basic Insurance Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {vehicle.insuranceInfo.companyName && (
                        <div>
                          <label className="text-sm font-medium text-neutral-600 dark:text-neutral-400">Company Name</label>
                          <p className="text-sm text-neutral-900 dark:text-white">{vehicle.insuranceInfo.companyName}</p>
                        </div>
                      )}
                      
                      {vehicle.insuranceInfo.insuranceType && (
                        <div>
                          <label className="text-sm font-medium text-neutral-600 dark:text-neutral-400">Insurance Type</label>
                          <p className="text-sm text-neutral-900 dark:text-white">{vehicle.insuranceInfo.insuranceType}</p>
                        </div>
                      )}
                      
                      {vehicle.insuranceInfo.policyNumber && (
                        <div>
                          <label className="text-sm font-medium text-neutral-600 dark:text-neutral-400">Policy Number</label>
                          <p className="text-sm text-neutral-900 dark:text-white font-mono">{vehicle.insuranceInfo.policyNumber}</p>
                        </div>
                      )}
                      
                      {vehicle.insuranceInfo.phoneNumber && (
                        <div>
                          <label className="text-sm font-medium text-neutral-600 dark:text-neutral-400">Phone Number</label>
                          <p className="text-sm text-neutral-900 dark:text-white">{vehicle.insuranceInfo.phoneNumber}</p>
                        </div>
                      )}
                      
                      {vehicle.insuranceInfo.representativeName && (
                        <div>
                          <label className="text-sm font-medium text-neutral-600 dark:text-neutral-400">Representative Name</label>
                          <p className="text-sm text-neutral-900 dark:text-white">{vehicle.insuranceInfo.representativeName}</p>
                        </div>
                      )}
                      
                      {vehicle.insuranceInfo.monthlyPremium && (
                        <div>
                          <label className="text-sm font-medium text-neutral-600 dark:text-neutral-400">Monthly Premium</label>
                          <p className="text-sm text-neutral-900 dark:text-white">${vehicle.insuranceInfo.monthlyPremium}</p>
                        </div>
                      )}
                      
                      {vehicle.insuranceInfo.premiumDueDate && (
                        <div>
                          <label className="text-sm font-medium text-neutral-600 dark:text-neutral-400">Premium Due Date</label>
                          <p className="text-sm text-neutral-900 dark:text-white">{vehicle.insuranceInfo.premiumDueDate}</p>
                        </div>
                      )}
                      
                      {vehicle.insuranceInfo.totalCoverageAmount && (
                        <div>
                          <label className="text-sm font-medium text-neutral-600 dark:text-neutral-400">Total Coverage Amount</label>
                          <p className="text-sm text-neutral-900 dark:text-white">${vehicle.insuranceInfo.totalCoverageAmount}</p>
                        </div>
                      )}
                      
                      {vehicle.insuranceInfo.fullTermPremium && (
                        <div>
                          <label className="text-sm font-medium text-neutral-600 dark:text-neutral-400">Full Term Premium</label>
                          <p className="text-sm text-neutral-900 dark:text-white">${vehicle.insuranceInfo.fullTermPremium}</p>
                        </div>
                      )}
                      
                      {vehicle.insuranceInfo.accidentalDeathBenefit && (
                        <div>
                          <label className="text-sm font-medium text-neutral-600 dark:text-neutral-400">Accidental Death Benefit</label>
                          <p className="text-sm text-neutral-900 dark:text-white">${vehicle.insuranceInfo.accidentalDeathBenefit}</p>
                        </div>
                      )}
                    </div>

                    {/* Dates */}
                    {(vehicle.insuranceInfo.startDate || vehicle.insuranceInfo.expirationDate) && (
                      <>
                        <Separator />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {vehicle.insuranceInfo.startDate && (
                            <div>
                              <label className="text-sm font-medium text-neutral-600 dark:text-neutral-400">Start Date</label>
                              <p className="text-sm text-neutral-900 dark:text-white">
                                {format(new Date(vehicle.insuranceInfo.startDate), "MMM dd, yyyy")}
                              </p>
                            </div>
                          )}
                          
                          {vehicle.insuranceInfo.expirationDate && (
                            <div>
                              <label className="text-sm font-medium text-neutral-600 dark:text-neutral-400">Expiration Date</label>
                              <p className="text-sm text-neutral-900 dark:text-white">
                                {format(new Date(vehicle.insuranceInfo.expirationDate), "MMM dd, yyyy")}
                              </p>
                            </div>
                          )}
                        </div>
                      </>
                    )}

                    {/* Coverage Details */}
                    {(vehicle.insuranceInfo.bodilyInjury || vehicle.insuranceInfo.propertyDamage || vehicle.insuranceInfo.pip) && (
                      <>
                        <Separator />
                        <div>
                          <h4 className="font-medium text-neutral-900 dark:text-white mb-3">Coverage Details</h4>
                          <div className="space-y-4">
                            {/* Bodily Injury */}
                            {vehicle.insuranceInfo.bodilyInjury && (
                              <div className="p-3 bg-neutral-50 dark:bg-neutral-800 rounded-lg">
                                <h5 className="font-medium text-sm text-neutral-900 dark:text-white mb-2">Bodily Injury</h5>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                                  {vehicle.insuranceInfo.bodilyInjury.coverageLimit && (
                                    <div>
                                      <span className="text-neutral-600 dark:text-neutral-400">Coverage Limit:</span>
                                      <p className="font-medium">${vehicle.insuranceInfo.bodilyInjury.coverageLimit}</p>
                                    </div>
                                  )}
                                  {vehicle.insuranceInfo.bodilyInjury.premium && (
                                    <div>
                                      <span className="text-neutral-600 dark:text-neutral-400">Premium:</span>
                                      <p className="font-medium">${vehicle.insuranceInfo.bodilyInjury.premium}</p>
                                    </div>
                                  )}
                                  {vehicle.insuranceInfo.bodilyInjury.deductible && (
                                    <div>
                                      <span className="text-neutral-600 dark:text-neutral-400">Deductible:</span>
                                      <p className="font-medium">${vehicle.insuranceInfo.bodilyInjury.deductible}</p>
                                    </div>
                                  )}
                                </div>
                              </div>
                            )}

                            {/* Property Damage */}
                            {vehicle.insuranceInfo.propertyDamage && (
                              <div className="p-3 bg-neutral-50 dark:bg-neutral-800 rounded-lg">
                                <h5 className="font-medium text-sm text-neutral-900 dark:text-white mb-2">Property Damage</h5>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                                  {vehicle.insuranceInfo.propertyDamage.coverageLimit && (
                                    <div>
                                      <span className="text-neutral-600 dark:text-neutral-400">Coverage Limit:</span>
                                      <p className="font-medium">${vehicle.insuranceInfo.propertyDamage.coverageLimit}</p>
                                    </div>
                                  )}
                                  {vehicle.insuranceInfo.propertyDamage.premium && (
                                    <div>
                                      <span className="text-neutral-600 dark:text-neutral-400">Premium:</span>
                                      <p className="font-medium">${vehicle.insuranceInfo.propertyDamage.premium}</p>
                                    </div>
                                  )}
                                  {vehicle.insuranceInfo.propertyDamage.deductible && (
                                    <div>
                                      <span className="text-neutral-600 dark:text-neutral-400">Deductible:</span>
                                      <p className="font-medium">${vehicle.insuranceInfo.propertyDamage.deductible}</p>
                                    </div>
                                  )}
                                </div>
                              </div>
                            )}

                            {/* PIP (Personal Injury Protection) */}
                            {vehicle.insuranceInfo.pip && (
                              <div className="p-3 bg-neutral-50 dark:bg-neutral-800 rounded-lg">
                                <h5 className="font-medium text-sm text-neutral-900 dark:text-white mb-2">Personal Injury Protection (PIP)</h5>
                                <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-sm">
                                  {vehicle.insuranceInfo.pip.status && (
                                    <div>
                                      <span className="text-neutral-600 dark:text-neutral-400">Status:</span>
                                      <p className="font-medium">{vehicle.insuranceInfo.pip.status}</p>
                                    </div>
                                  )}
                                  {vehicle.insuranceInfo.pip.coverageLimit && (
                                    <div>
                                      <span className="text-neutral-600 dark:text-neutral-400">Coverage Limit:</span>
                                      <p className="font-medium">${vehicle.insuranceInfo.pip.coverageLimit}</p>
                                    </div>
                                  )}
                                  {vehicle.insuranceInfo.pip.premium && (
                                    <div>
                                      <span className="text-neutral-600 dark:text-neutral-400">Premium:</span>
                                      <p className="font-medium">${vehicle.insuranceInfo.pip.premium}</p>
                                    </div>
                                  )}
                                  {vehicle.insuranceInfo.pip.deductible && (
                                    <div>
                                      <span className="text-neutral-600 dark:text-neutral-400">Deductible:</span>
                                      <p className="font-medium">${vehicle.insuranceInfo.pip.deductible}</p>
                                    </div>
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Notes */}
            {vehicle.notes && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Notes
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-neutral-900 dark:text-white whitespace-pre-wrap">{vehicle.notes}</p>
                </CardContent>
              </Card>
            )}

            {/* Documents */}
            <Card data-documents-section>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Documents
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowUploadSection(!showUploadSection)}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Documents
                  </Button>
                </CardTitle>
              </CardHeader>
              
              {/* Upload Section */}
              {showUploadSection && (
                <CardContent className="border-b">
                  <div className="space-y-4">
                    <h4 className="font-medium text-neutral-900 dark:text-white">Upload New Documents</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {documentCategories.map((category) => (
                        <div key={category.key} className="border rounded-lg p-4">
                          <div className="flex items-center gap-2 mb-2">
                            {category.icon}
                            <h5 className="font-medium text-sm">{category.title}</h5>
                          </div>
                          <p className="text-xs text-neutral-600 dark:text-neutral-400 mb-3">
                            {category.description}
                          </p>
                          
                          <input
                            type="file"
                            id={`upload-${category.key}`}
                            multiple
                            accept={category.acceptedTypes.join(',')}
                            onChange={(e) => {
                              if (e.target.files && e.target.files.length > 0) {
                                handleFileSelect(category.key, e.target.files);
                                e.target.value = ''; // Reset input
                              }
                            }}
                            className="hidden"
                          />
                          
                          <label
                            htmlFor={`upload-${category.key}`}
                            className="flex items-center justify-center gap-2 p-2 border-2 border-dashed border-neutral-300 dark:border-neutral-600 rounded cursor-pointer hover:border-blue-400 transition-colors"
                          >
                            <Upload className="h-4 w-4" />
                            <span className="text-sm">Choose Files</span>
                          </label>
                          
                          {/* Show uploading files */}
                          {uploadingFiles[category.key] && uploadingFiles[category.key].length > 0 && (
                            <div className="mt-3 space-y-2">
                              {uploadingFiles[category.key].map((file, index) => (
                                <div key={index} className="flex items-center justify-between p-2 bg-neutral-50 dark:bg-neutral-800 rounded text-xs">
                                  <div className="flex items-center gap-2">
                                    {file.uploadStatus === 'uploading' && (
                                      <div className="animate-spin h-3 w-3 border border-blue-500 border-t-transparent rounded-full" />
                                    )}
                                    {file.uploadStatus === 'completed' && (
                                      <CheckCircle className="h-3 w-3 text-green-500" />
                                    )}
                                    {file.uploadStatus === 'error' && (
                                      <AlertCircle className="h-3 w-3 text-red-500" />
                                    )}
                                    <span className="truncate">{file.name}</span>
                                  </div>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-6 w-6 p-0"
                                    onClick={() => removeUploadingFile(category.key, file.name)}
                                  >
                                    <X className="h-3 w-3" />
                                  </Button>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              )}
              
              {/* Existing Documents */}
              {existingDocuments.length > 0 && (
                <CardContent className="space-y-6">
                  {existingDocuments.map((category, index) => {
                    const IconComponent = category.icon;
                    return (
                      <div key={index}>
                        <h4 className="font-medium text-neutral-900 dark:text-white mb-3 flex items-center gap-2">
                          <IconComponent className="h-4 w-4" />
                          {category.category}
                        </h4>
                        
                        {/* Direct documents */}
                        {category.documents.length > 0 && (
                          <div className="grid grid-cols-1 gap-3 mb-4">
                            {category.documents.map((doc, docIndex) => (
                              <div 
                                key={docIndex}
                                className="flex items-center justify-between p-3 bg-neutral-50 dark:bg-neutral-800 rounded-lg"
                              >
                                <div className="flex items-center gap-3">
                                  <FileText className="h-4 w-4 text-neutral-500" />
                                  <div>
                                    <p className="text-sm font-medium text-neutral-900 dark:text-white">
                                      {doc.name}
                                    </p>
                                    {doc.uploadedAt && (
                                      <p className="text-xs text-neutral-500">
                                        Uploaded {format(new Date(doc.uploadedAt), "MMM dd, yyyy")}
                                      </p>
                                    )}
                                  </div>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleViewDocument(doc)}
                                    disabled={loadingUrls.has(doc.key || doc.fileKey || '')}
                                    className="hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-950"
                                    title="View document"
                                  >
                                    {loadingUrls.has(doc.key || doc.fileKey || '') ? (
                                      <div className="animate-spin h-4 w-4 border border-blue-500 border-t-transparent rounded-full" />
                                    ) : (
                                      <Eye className="h-4 w-4" />
                                    )}
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleDownloadDocument(doc)}
                                    disabled={loadingUrls.has(doc.key || doc.fileKey || '')}
                                    className="hover:bg-green-50 hover:text-green-600 dark:hover:bg-green-950"
                                    title="Download document"
                                  >
                                    {loadingUrls.has(doc.key || doc.fileKey || '') ? (
                                      <div className="animate-spin h-4 w-4 border border-green-500 border-t-transparent rounded-full" />
                                    ) : (
                                      <Download className="h-4 w-4" />
                                    )}
                                  </Button>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Subcategories */}
                        {category.subcategories && category.subcategories.map((subcategory, subIndex) => (
                          <div key={subIndex} className="ml-4 mb-4">
                            <h5 className="text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                              {subcategory.name}
                            </h5>
                            <div className="grid grid-cols-1 gap-2">
                              {subcategory.documents.map((doc, docIndex) => (
                                <div 
                                  key={docIndex}
                                  className="flex items-center justify-between p-2 bg-neutral-25 dark:bg-neutral-750 rounded border border-neutral-200 dark:border-neutral-700"
                                >
                                  <div className="flex items-center gap-2">
                                    <FileText className="h-3 w-3 text-neutral-400" />
                                    <div>
                                      <p className="text-xs font-medium text-neutral-800 dark:text-neutral-200">
                                        {doc.name}
                                      </p>
                                      {doc.uploadedAt && (
                                        <p className="text-xs text-neutral-400">
                                          {format(new Date(doc.uploadedAt), "MMM dd, yyyy")}
                                        </p>
                                      )}
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="h-6 w-6 p-0 hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-950"
                                      onClick={() => handleViewDocument(doc)}
                                      disabled={loadingUrls.has(doc.key || doc.fileKey || '')}
                                      title="View document"
                                    >
                                      {loadingUrls.has(doc.key || doc.fileKey || '') ? (
                                        <div className="animate-spin h-3 w-3 border border-blue-500 border-t-transparent rounded-full" />
                                      ) : (
                                        <Eye className="h-3 w-3" />
                                      )}
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="h-6 w-6 p-0 hover:bg-green-50 hover:text-green-600 dark:hover:bg-green-950"
                                      onClick={() => handleDownloadDocument(doc)}
                                      disabled={loadingUrls.has(doc.key || doc.fileKey || '')}
                                      title="Download document"
                                    >
                                      {loadingUrls.has(doc.key || doc.fileKey || '') ? (
                                        <div className="animate-spin h-3 w-3 border border-green-500 border-t-transparent rounded-full" />
                                      ) : (
                                        <Download className="h-3 w-3" />
                                      )}
                                    </Button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}

                        {index < existingDocuments.length - 1 && <Separator className="mt-4" />}
                      </div>
                    );
                  })}
                </CardContent>
              )}
              
              {/* No documents message */}
              {existingDocuments.length === 0 && !showUploadSection && (
                <CardContent>
                  <div className="text-center py-8">
                    <FileText className="h-12 w-12 mx-auto text-neutral-400 mb-4" />
                    <h3 className="text-lg font-medium text-neutral-900 dark:text-white mb-2">
                      No documents uploaded yet
                    </h3>
                    <p className="text-neutral-600 dark:text-neutral-400 mb-4">
                      Upload vehicle documents to keep everything organized in one place.
                    </p>
                    <Button
                      variant="outline"
                      onClick={() => setShowUploadSection(true)}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Your First Document
                    </Button>
                  </div>
                </CardContent>
              )}
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3 text-sm">
                  <Calendar className="h-4 w-4 text-neutral-500" />
                  <div>
                    <p className="text-neutral-600 dark:text-neutral-400">Added</p>
                    <p className="font-medium">{format(new Date(vehicle.createdAt), "MMM dd, yyyy")}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 text-sm">
                  <Calendar className="h-4 w-4 text-neutral-500" />
                  <div>
                    <p className="text-neutral-600 dark:text-neutral-400">Last Updated</p>
                    <p className="font-medium">{format(new Date(vehicle.updatedAt), "MMM dd, yyyy")}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-sm">
                  <FileText className="h-4 w-4 text-neutral-500" />
                  <div>
                    <p className="text-neutral-600 dark:text-neutral-400">Documents</p>
                    <p className="font-medium">
                      {existingDocuments.reduce((total, cat) => total + cat.documents.length + (cat.subcategories?.reduce((subTotal, sub) => subTotal + sub.documents.length, 0) || 0), 0)} files
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Document Summary */}
            {existingDocuments.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Document Summary
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {existingDocuments.map((category, index) => {
                    const totalDocs = category.documents.length + (category.subcategories?.reduce((sum, sub) => sum + sub.documents.length, 0) || 0);
                    const IconComponent = category.icon;
                    
                    return (
                      <div key={index} className="flex items-center justify-between p-2 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors">
                        <div className="flex items-center gap-2">
                          <IconComponent className="h-4 w-4 text-neutral-500" />
                          <div>
                            <p className="text-sm font-medium text-neutral-900 dark:text-white">
                              {category.category}
                            </p>
                            {category.subcategories && (
                              <div className="text-xs text-neutral-500 space-y-1 mt-1">
                                {category.subcategories.map((sub, subIndex) => (
                                  sub.documents.length > 0 && (
                                    <div key={subIndex} className="flex justify-between">
                                      <span>{sub.name}</span>
                                      <span>{sub.documents.length}</span>
                                    </div>
                                  )
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                        <Badge variant="secondary" className="text-xs">
                          {totalDocs}
                        </Badge>
                      </div>
                    );
                  })}
                  
                  <div className="pt-2 border-t">
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full"
                      onClick={() => {
                        const documentsSection = document.querySelector('[data-documents-section]');
                        documentsSection?.scrollIntoView({ behavior: 'smooth' });
                      }}
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      View All Documents
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>

      {/* Delete confirmation dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Vehicle</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{vehicle.nickname}"? This action cannot be undone and will remove all associated data including documents.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Edit Vehicle Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="w-[90vw] md:w-[70vw] lg:w-[50vw] max-w-none max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Vehicle</DialogTitle>
          </DialogHeader>
          
          <VehicleForm
            vehicle={vehicle}
            onSubmit={handleUpdateVehicle}
            onCancel={handleCancelEdit}
            isLoading={isUpdating}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
