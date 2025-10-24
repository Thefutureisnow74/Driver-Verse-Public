"use client";

import { useState } from "react";
import { format } from "date-fns";
import { 
  Car, 
  Calendar, 
  DollarSign, 
  Settings, 
  Shield, 
  X,
  Edit,
  Truck,
  FileText,
  Image as ImageIcon,
  Gauge,
  Fuel,
  MapPin,
  Phone,
  User,
  CreditCard,
  Eye,
  Download,
  Loader2
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";

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

interface VehicleDetailDialogProps {
  vehicle: Vehicle | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEdit: (vehicle: Vehicle) => void;
}

export function VehicleDetailDialog({ vehicle, open, onOpenChange, onEdit }: VehicleDetailDialogProps) {
  const [loadingDocuments, setLoadingDocuments] = useState<Set<string>>(new Set());
  const [presignedUrls, setPresignedUrls] = useState<Record<string, string>>({});

  if (!vehicle) return null;

  const generatePresignedUrl = async (documentKey: string, vehicleId: string) => {
    if (presignedUrls[documentKey] || loadingDocuments.has(documentKey)) {
      return presignedUrls[documentKey];
    }

    setLoadingDocuments(prev => new Set(prev).add(documentKey));

    try {
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
        throw new Error('Failed to generate presigned URL');
      }

      const { presignedUrls: urls } = await response.json();
      const url = urls[documentKey];
      
      if (url) {
        setPresignedUrls(prev => ({ ...prev, [documentKey]: url }));
        return url;
      }
    } catch (error) {
      console.error('Error generating presigned URL:', error);
      toast.error('Failed to load document');
    } finally {
      setLoadingDocuments(prev => {
        const newSet = new Set(prev);
        newSet.delete(documentKey);
        return newSet;
      });
    }
    return null;
  };

  const handleViewDocument = async (doc: any, vehicleId: string) => {
    const documentKey = doc.fileKey || doc.url; // Support both old and new format
    if (!documentKey) {
      toast.error('Document key not found');
      return;
    }

    // If we already have a presigned URL, use it
    if (presignedUrls[documentKey]) {
      window.open(presignedUrls[documentKey], '_blank');
      return;
    }

    // Generate new presigned URL
    const url = await generatePresignedUrl(documentKey, vehicleId);
    if (url) {
      window.open(url, '_blank');
    }
  };

  const handleDownloadDocument = async (doc: any, vehicleId: string) => {
    const documentKey = doc.fileKey || doc.url; // Support both old and new format
    if (!documentKey) {
      toast.error('Document key not found');
      return;
    }

    // If we already have a presigned URL, use it
    let url = presignedUrls[documentKey];
    
    // Generate new presigned URL if we don't have one
    if (!url) {
      url = await generatePresignedUrl(documentKey, vehicleId);
    }

    if (url) {
      const link = document.createElement('a');
      link.href = url;
      link.download = doc.name;
      link.click();
    }
  };

  const getVehicleDisplayName = () => {
    const parts = [];
    if (vehicle.year) parts.push(vehicle.year);
    parts.push(vehicle.make);
    parts.push(vehicle.model);
    return parts.join(' ');
  };

  const formatCurrency = (value: any) => {
    if (!value) return "N/A";
    const num = parseFloat(value);
    return isNaN(num) ? value : `$${num.toLocaleString()}`;
  };

  const formatDate = (dateString: any) => {
    if (!dateString) return "N/A";
    try {
      return format(new Date(dateString), "MMM dd, yyyy");
    } catch {
      return "Invalid Date";
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[90vw] md:w-[70vw] lg:w-[50vw] max-w-none max-h-[90vh]">
        <DialogHeader className="flex flex-row items-center justify-between space-y-0">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-sm">
              <Truck className="h-5 w-5 text-white" />
            </div>
            <div>
              <DialogTitle className="text-xl">{vehicle.nickname}</DialogTitle>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                {getVehicleDisplayName()}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button onClick={() => onEdit(vehicle)} size="sm">
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
          </div>
        </DialogHeader>

        <ScrollArea className="max-h-[70vh] pr-2 sm:pr-4">
          <div className="space-y-6">
            {/* Basic Information */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Car className="w-5 h-5 text-blue-600" />
                <h3 className="text-lg font-semibold">Basic Information</h3>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="font-medium text-neutral-600 dark:text-neutral-400">Vehicle Type:</span>
                  <p>{vehicle.vehicleType || "N/A"}</p>
                </div>
                <div>
                  <span className="font-medium text-neutral-600 dark:text-neutral-400">Color:</span>
                  <p>{vehicle.color || "N/A"}</p>
                </div>
                <div>
                  <span className="font-medium text-neutral-600 dark:text-neutral-400">VIN:</span>
                  <p className="font-mono text-xs">{vehicle.vin || "N/A"}</p>
                </div>
                <div>
                  <span className="font-medium text-neutral-600 dark:text-neutral-400">License Plate:</span>
                  <p>{vehicle.licensePlate || "N/A"} {vehicle.state && `(${vehicle.state})`}</p>
                </div>
                <div>
                  <span className="font-medium text-neutral-600 dark:text-neutral-400">Mileage:</span>
                  <p>{vehicle.mileage ? `${vehicle.mileage.toLocaleString()} miles` : "N/A"}</p>
                </div>
                <div>
                  <span className="font-medium text-neutral-600 dark:text-neutral-400">Fuel Type:</span>
                  <p>{vehicle.fuelType || "N/A"} {vehicle.mpg && `(${vehicle.mpg} MPG)`}</p>
                </div>
                <div className="sm:col-span-2 lg:col-span-2">
                  <span className="font-medium text-neutral-600 dark:text-neutral-400">Owner(s):</span>
                  <p>{vehicle.ownerNames || "N/A"}</p>
                </div>
                <div className="sm:col-span-2 lg:col-span-3">
                  <span className="font-medium text-neutral-600 dark:text-neutral-400">Purchase Location:</span>
                  <p>{vehicle.purchaseLocation || "N/A"}</p>
                </div>
              </div>
            </div>

            {/* Financial Information */}
            {vehicle.financialInfo && (
              <>
                <Separator />
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <DollarSign className="w-5 h-5 text-green-600" />
                    <h3 className="text-lg font-semibold">Financial Information</h3>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="font-medium text-neutral-600 dark:text-neutral-400">Purchase Date:</span>
                      <p>{formatDate(vehicle.financialInfo.purchaseDate)}</p>
                    </div>
                    <div>
                      <span className="font-medium text-neutral-600 dark:text-neutral-400">Purchase Price:</span>
                      <p>{formatCurrency(vehicle.financialInfo.purchasePrice)}</p>
                    </div>
                    <div>
                      <span className="font-medium text-neutral-600 dark:text-neutral-400">Current Value:</span>
                      <p>{formatCurrency(vehicle.financialInfo.currentValue)}</p>
                    </div>
                    <div>
                      <span className="font-medium text-neutral-600 dark:text-neutral-400">Monthly Payment:</span>
                      <p>{formatCurrency(vehicle.financialInfo.monthlyPayment)}</p>
                    </div>
                    <div>
                      <span className="font-medium text-neutral-600 dark:text-neutral-400">Interest Rate:</span>
                      <p>{vehicle.financialInfo.interestRate ? `${vehicle.financialInfo.interestRate}%` : "N/A"}</p>
                    </div>
                    <div>
                      <span className="font-medium text-neutral-600 dark:text-neutral-400">Loan Term:</span>
                      <p>{vehicle.financialInfo.loanTermMonths ? `${vehicle.financialInfo.loanTermMonths} months` : "N/A"}</p>
                    </div>
                    <div className="sm:col-span-2 lg:col-span-2">
                      <span className="font-medium text-neutral-600 dark:text-neutral-400">Finance Company:</span>
                      <p>{vehicle.financialInfo.financeCompany || "N/A"}</p>
                    </div>
                    <div>
                      <span className="font-medium text-neutral-600 dark:text-neutral-400">Down Payment:</span>
                      <p>{formatCurrency(vehicle.financialInfo.downPayment)}</p>
                    </div>
                    <div>
                      <span className="font-medium text-neutral-600 dark:text-neutral-400">Remaining Balance:</span>
                      <p>{formatCurrency(vehicle.financialInfo.remainingBalance)}</p>
                    </div>
                    <div>
                      <span className="font-medium text-neutral-600 dark:text-neutral-400">Loan Account:</span>
                      <p className="font-mono text-xs">{vehicle.financialInfo.loanAccountNumber || "N/A"}</p>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* Vehicle Specifications */}
            {vehicle.specifications && (
              <>
                <Separator />
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <Settings className="w-5 h-5 text-purple-600" />
                    <h3 className="text-lg font-semibold">Vehicle Specifications</h3>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="font-medium text-neutral-600 dark:text-neutral-400">Weight:</span>
                      <p>{vehicle.specifications.vehicleWeight ? `${vehicle.specifications.vehicleWeight} lbs` : "N/A"}</p>
                    </div>
                    <div>
                      <span className="font-medium text-neutral-600 dark:text-neutral-400">Length:</span>
                      <p>{vehicle.specifications.exteriorLength ? `${vehicle.specifications.exteriorLength} ft` : "N/A"}</p>
                    </div>
                    <div>
                      <span className="font-medium text-neutral-600 dark:text-neutral-400">Width:</span>
                      <p>{vehicle.specifications.exteriorWidth ? `${vehicle.specifications.exteriorWidth} ft` : "N/A"}</p>
                    </div>
                    <div>
                      <span className="font-medium text-neutral-600 dark:text-neutral-400">Height:</span>
                      <p>{vehicle.specifications.exteriorHeight ? `${vehicle.specifications.exteriorHeight} ft` : "N/A"}</p>
                    </div>
                    <div>
                      <span className="font-medium text-neutral-600 dark:text-neutral-400">Cargo Volume:</span>
                      <p>{vehicle.specifications.cargoVolume ? `${vehicle.specifications.cargoVolume} cu ft` : "N/A"}</p>
                    </div>
                    <div>
                      <span className="font-medium text-neutral-600 dark:text-neutral-400">Payload:</span>
                      <p>{vehicle.specifications.payloadCapacity ? `${vehicle.specifications.payloadCapacity} lbs` : "N/A"}</p>
                    </div>
                    <div>
                      <span className="font-medium text-neutral-600 dark:text-neutral-400">Towing:</span>
                      <p>{vehicle.specifications.towingCapacity ? `${vehicle.specifications.towingCapacity} lbs` : "N/A"}</p>
                    </div>
                    <div className="sm:col-span-2 lg:col-span-2">
                      <span className="font-medium text-neutral-600 dark:text-neutral-400">Engine:</span>
                      <p>{vehicle.specifications.engineType || "N/A"}</p>
                    </div>
                    <div className="sm:col-span-2 lg:col-span-3">
                      <span className="font-medium text-neutral-600 dark:text-neutral-400">Transmission:</span>
                      <p>{vehicle.specifications.transmission || "N/A"}</p>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* Insurance Information */}
            {vehicle.insuranceInfo && (
              <>
                <Separator />
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <Shield className="w-5 h-5 text-blue-600" />
                    <h3 className="text-lg font-semibold">Insurance Information</h3>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm mb-6">
                    <div>
                      <span className="font-medium text-neutral-600 dark:text-neutral-400">Company:</span>
                      <p>{vehicle.insuranceInfo.companyName || "N/A"}</p>
                    </div>
                    <div>
                      <span className="font-medium text-neutral-600 dark:text-neutral-400">Type:</span>
                      <p>{vehicle.insuranceInfo.insuranceType || "N/A"}</p>
                    </div>
                    <div>
                      <span className="font-medium text-neutral-600 dark:text-neutral-400">Monthly Premium:</span>
                      <p>{formatCurrency(vehicle.insuranceInfo.monthlyPremium)}</p>
                    </div>
                    <div>
                      <span className="font-medium text-neutral-600 dark:text-neutral-400">Policy Number:</span>
                      <p className="font-mono text-xs">{vehicle.insuranceInfo.policyNumber || "N/A"}</p>
                    </div>
                    <div>
                      <span className="font-medium text-neutral-600 dark:text-neutral-400">Start Date:</span>
                      <p>{formatDate(vehicle.insuranceInfo.startDate)}</p>
                    </div>
                    <div>
                      <span className="font-medium text-neutral-600 dark:text-neutral-400">Expiration:</span>
                      <p>{formatDate(vehicle.insuranceInfo.expirationDate)}</p>
                    </div>
                  </div>

                  {/* Coverage Details */}
                  {(vehicle.insuranceInfo.bodilyInjury || vehicle.insuranceInfo.propertyDamage) && (
                    <div className="space-y-4">
                      <h4 className="font-semibold">Coverage Details</h4>
                      
                      {vehicle.insuranceInfo.bodilyInjury && (
                        <div>
                          <h5 className="font-medium mb-2">Bodily Injury</h5>
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm pl-4">
                            <div>
                              <span className="font-medium text-neutral-600 dark:text-neutral-400">Limit:</span>
                              <p>{vehicle.insuranceInfo.bodilyInjury.coverageLimit || "N/A"}</p>
                            </div>
                            <div>
                              <span className="font-medium text-neutral-600 dark:text-neutral-400">Premium:</span>
                              <p>{formatCurrency(vehicle.insuranceInfo.bodilyInjury.premium)}</p>
                            </div>
                            <div>
                              <span className="font-medium text-neutral-600 dark:text-neutral-400">Deductible:</span>
                              <p>{formatCurrency(vehicle.insuranceInfo.bodilyInjury.deductible)}</p>
                            </div>
                          </div>
                        </div>
                      )}

                      {vehicle.insuranceInfo.propertyDamage && (
                        <div>
                          <h5 className="font-medium mb-2">Property Damage</h5>
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm pl-4">
                            <div>
                              <span className="font-medium text-neutral-600 dark:text-neutral-400">Limit:</span>
                              <p>{vehicle.insuranceInfo.propertyDamage.coverageLimit || "N/A"}</p>
                            </div>
                            <div>
                              <span className="font-medium text-neutral-600 dark:text-neutral-400">Premium:</span>
                              <p>{formatCurrency(vehicle.insuranceInfo.propertyDamage.premium)}</p>
                            </div>
                            <div>
                              <span className="font-medium text-neutral-600 dark:text-neutral-400">Deductible:</span>
                              <p>{formatCurrency(vehicle.insuranceInfo.propertyDamage.deductible)}</p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </>
            )}

            {/* Documents & Photos */}
            {(vehicle.vehiclePhotos || vehicle.insuranceDocs || vehicle.registrationDocs || vehicle.warrantyDocs || vehicle.maintenanceDocs || vehicle.otherDocs) && (
              <>
                <Separator />
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <FileText className="w-5 h-5 text-indigo-600" />
                    <h3 className="text-lg font-semibold">Documents & Photos</h3>
                  </div>

                  <div className="space-y-4">
                    {/* Vehicle Photos */}
                    {vehicle.vehiclePhotos && vehicle.vehiclePhotos.length > 0 && (
                      <div>
                        <h5 className="font-medium mb-2 flex items-center gap-2">
                          <ImageIcon className="h-4 w-4" />
                          Vehicle Photos ({vehicle.vehiclePhotos.length})
                        </h5>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                          {vehicle.vehiclePhotos.slice(0, 6).map((photo: any, index: number) => {
                            const documentKey = photo.fileKey || photo.url;
                            const isLoading = loadingDocuments.has(documentKey);
                            
                            return (
                              <div key={index} className="relative aspect-square bg-neutral-100 dark:bg-neutral-800 rounded-lg overflow-hidden">
                                {isLoading ? (
                                  <div className="w-full h-full flex items-center justify-center">
                                    <Loader2 className="h-6 w-6 animate-spin text-neutral-400" />
                                  </div>
                                ) : (
                                  <img 
                                    src={presignedUrls[documentKey] || photo.url} 
                                    alt={photo.name}
                                    className="w-full h-full object-cover cursor-pointer hover:opacity-80"
                                    onClick={() => handleViewDocument(photo, vehicle.id)}
                                  />
                                )}
                              </div>
                            );
                          })}
                          {vehicle.vehiclePhotos.length > 6 && (
                            <div className="aspect-square bg-neutral-200 dark:bg-neutral-700 rounded-lg flex items-center justify-center">
                              <span className="text-sm text-neutral-600 dark:text-neutral-400">
                                +{vehicle.vehiclePhotos.length - 6} more
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Document Categories */}
                    {[
                      { key: 'insuranceDocs', title: 'Insurance Documents', data: vehicle.insuranceDocs },
                      { key: 'registrationDocs', title: 'Registration & Title', data: vehicle.registrationDocs },
                      { key: 'warrantyDocs', title: 'Warranty Information', data: vehicle.warrantyDocs },
                      { key: 'maintenanceDocs', title: 'Maintenance Records', data: vehicle.maintenanceDocs },
                      { key: 'otherDocs', title: 'Other Documents', data: vehicle.otherDocs },
                    ].map((category) => {
                      if (!category.data || (Array.isArray(category.data) ? category.data.length === 0 : Object.keys(category.data).length === 0)) {
                        return null;
                      }

                      const docs = Array.isArray(category.data) ? category.data : Object.values(category.data).flat();
                      if (docs.length === 0) return null;

                      return (
                        <div key={category.key}>
                          <h5 className="font-medium mb-2 flex items-center gap-2">
                            <FileText className="h-4 w-4" />
                            {category.title} ({docs.length})
                          </h5>
                          <div className="space-y-2">
                            {docs.map((doc: any, index: number) => {
                              const documentKey = doc.fileKey || doc.url;
                              const isLoading = loadingDocuments.has(documentKey);
                              
                              return (
                                <div key={index} className="flex items-center gap-3 p-2 bg-neutral-50 dark:bg-neutral-800 rounded-lg">
                                  <FileText className="h-4 w-4 text-neutral-500" />
                                  <span className="flex-1 text-sm truncate">{doc.name}</span>
                                  <div className="flex gap-1">
                                    <Button
                                      type="button"
                                      variant="ghost"
                                      size="sm"
                                      className="h-6 w-6 p-0"
                                      onClick={() => handleViewDocument(doc, vehicle.id)}
                                      disabled={isLoading}
                                    >
                                      {isLoading ? (
                                        <Loader2 className="h-3 w-3 animate-spin" />
                                      ) : (
                                        <Eye className="h-3 w-3" />
                                      )}
                                    </Button>
                                    <Button
                                      type="button"
                                      variant="ghost"
                                      size="sm"
                                      className="h-6 w-6 p-0"
                                      onClick={() => handleDownloadDocument(doc, vehicle.id)}
                                      disabled={isLoading}
                                    >
                                      {isLoading ? (
                                        <Loader2 className="h-3 w-3 animate-spin" />
                                      ) : (
                                        <Download className="h-3 w-3" />
                                      )}
                                    </Button>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </>
            )}

            {/* Notes */}
            {vehicle.notes && (
              <>
                <Separator />
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-5 h-5 text-orange-600">📝</div>
                    <h3 className="text-lg font-semibold">Notes</h3>
                  </div>
                  <p className="text-sm text-neutral-700 dark:text-neutral-300 whitespace-pre-wrap">
                    {vehicle.notes}
                  </p>
                </div>
              </>
            )}

            {/* Metadata */}
            <Separator />
            <div className="text-xs text-neutral-500 dark:text-neutral-500 space-y-1">
              <p>Added: {format(new Date(vehicle.createdAt), "MMM dd, yyyy 'at' h:mm a")}</p>
              <p>Last Updated: {format(new Date(vehicle.updatedAt), "MMM dd, yyyy 'at' h:mm a")}</p>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
