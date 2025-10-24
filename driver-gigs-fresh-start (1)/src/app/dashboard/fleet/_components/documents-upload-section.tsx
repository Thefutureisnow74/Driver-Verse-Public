"use client";

import { useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { 
  FileText, 
  Upload, 
  X, 
  CheckCircle, 
  AlertCircle, 
  Eye,
  Download,
  Image as ImageIcon
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";

interface DocumentUploadSectionProps {
  form: UseFormReturn<any>;
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
    icon: <FileText className="h-4 w-4" />
  },
  {
    key: 'insuranceCards',
    title: 'Insurance Cards',
    description: 'Insurance card copies',
    acceptedTypes: ['application/pdf', 'image/jpeg', 'image/png'],
    maxFiles: 5,
    icon: <FileText className="h-4 w-4" />
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
    icon: <FileText className="h-4 w-4" />
  },
  {
    key: 'tireWarranty',
    title: 'Tire Warranty',
    description: 'Tire warranty documents',
    acceptedTypes: ['application/pdf', 'image/jpeg', 'image/png'],
    maxFiles: 3,
    icon: <FileText className="h-4 w-4" />
  },
  {
    key: 'partsWarranty',
    title: 'Parts Warranty',
    description: 'Parts warranty information',
    acceptedTypes: ['application/pdf', 'image/jpeg', 'image/png'],
    maxFiles: 5,
    icon: <FileText className="h-4 w-4" />
  },
  {
    key: 'maintenanceRecords',
    title: 'Maintenance Records',
    description: 'Service and maintenance history',
    acceptedTypes: ['application/pdf', 'image/jpeg', 'image/png'],
    maxFiles: 10,
    icon: <FileText className="h-4 w-4" />
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

export function DocumentsUploadSection({ form }: DocumentUploadSectionProps) {
  const [uploadingFiles, setUploadingFiles] = useState<Record<string, DocumentFile[]>>({});

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

    if (validFiles.length > 0) {
      setUploadingFiles(prev => ({
        ...prev,
        [categoryKey]: [...(prev[categoryKey] || []), ...validFiles]
      }));
      
      // Start upload process
      await uploadFiles(categoryKey, validFiles, Array.from(files));
    }
  };

  const uploadFiles = async (categoryKey: string, documentFiles: DocumentFile[], actualFiles: File[]) => {
    try {
      for (let i = 0; i < documentFiles.length; i++) {
        const docFile = documentFiles[i];
        const actualFile = actualFiles[i];
        
        // Update status to uploading
        setUploadingFiles(prev => ({
          ...prev,
          [categoryKey]: prev[categoryKey]?.map(f => 
            f.name === docFile.name ? { ...f, uploadStatus: 'uploading', uploadProgress: 0 } : f
          ) || []
        }));
        
        // Upload to S3
        const uploadPromise = uploadToS3(docFile.name, actualFile, categoryKey);
        
        uploadPromise.then((result) => {
          setUploadingFiles(prev => ({
            ...prev,
            [categoryKey]: prev[categoryKey]?.map(f => 
              f.name === docFile.name 
                ? { ...f, uploadStatus: 'completed', uploadProgress: 100, url: result.url, id: result.id }
                : f
            ) || []
          }));
          
          // Update form data
          const currentDocs = form.getValues(`documents.${categoryKey}`) || [];
          form.setValue(`documents.${categoryKey}`, [...currentDocs, result]);
          
          toast.success(`${docFile.name} uploaded successfully`);
        }).catch((error) => {
          setUploadingFiles(prev => ({
            ...prev,
            [categoryKey]: prev[categoryKey]?.map(f => 
              f.name === docFile.name ? { ...f, uploadStatus: 'error' } : f
            ) || []
          }));
          toast.error(`Failed to upload ${docFile.name}: ${error.message}`);
        });
      }
    } catch (error) {
      toast.error('Upload failed');
    }
  };

  // Upload file to S3
  const uploadToS3 = async (fileName: string, file: File, documentCategory: string): Promise<{ id: string; url: string; name: string, fileKey: string }> => {
    try {
      // Get presigned upload URL from our API
      const response = await fetch('/api/fleet/documents/upload', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fileName,
          fileType: file.type,
          documentCategory,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to get upload URL');
      }

      const { uploadUrl, fileKey, fileUrl, documentId } = await response.json();

      // Upload file directly to S3
      const uploadResponse = await fetch(uploadUrl, {
        method: 'PUT',
        body: file,
        headers: {
          'Content-Type': file.type,
        },
      });

      if (!uploadResponse.ok) {
        throw new Error('Failed to upload file to S3');
      }

      return {
        id: documentId,
        fileKey: fileKey, // Store the S3 file key for later URL generation
        url: fileUrl, // Temporary URL for immediate display
        name: fileName
      };
    } catch (error) {
      console.error('S3 upload error:', error);
      throw error;
    }
  };

  const removeFile = (categoryKey: string, fileName: string) => {
    setUploadingFiles(prev => ({
      ...prev,
      [categoryKey]: prev[categoryKey]?.filter(f => f.name !== fileName) || []
    }));
    
    // Remove from form data
    const currentDocs = form.getValues(`documents.${categoryKey}`) || [];
    form.setValue(`documents.${categoryKey}`, currentDocs.filter((doc: any) => doc.name !== fileName));
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getStatusBadge = (status: DocumentFile['uploadStatus']) => {
    switch (status) {
      case 'completed':
        return <Badge variant="default" className="bg-green-500"><CheckCircle className="h-3 w-3 mr-1" />Complete</Badge>;
      case 'uploading':
        return <Badge variant="secondary">Uploading...</Badge>;
      case 'error':
        return <Badge variant="destructive"><AlertCircle className="h-3 w-3 mr-1" />Error</Badge>;
      default:
        return <Badge variant="outline">Pending</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-4">
        <FileText className="w-5 h-5 text-indigo-600" />
        <h3 className="text-lg font-semibold">Documents & Photos</h3>
        <span className="text-xs text-neutral-500 bg-neutral-100 dark:bg-neutral-800 px-2 py-1 rounded">Optional</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {documentCategories.map((category) => {
          const files = uploadingFiles[category.key] || [];
          const completedFiles = files.filter(f => f.uploadStatus === 'completed');
          
          return (
            <Card key={category.key} className="relative">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  {category.icon}
                  {category.title}
                  {completedFiles.length > 0 && (
                    <Badge variant="secondary" className="ml-auto">
                      {completedFiles.length}
                    </Badge>
                  )}
                </CardTitle>
                <p className="text-xs text-neutral-600 dark:text-neutral-400">
                  {category.description}
                </p>
              </CardHeader>
              
              <CardContent className="space-y-3">
                {/* File Upload */}
                <div className="border-2 border-dashed border-neutral-200 dark:border-neutral-700 rounded-lg p-4 text-center">
                  <input
                    type="file"
                    multiple
                    accept={category.acceptedTypes.join(',')}
                    onChange={(e) => {
                      if (e.target.files) {
                        handleFileSelect(category.key, e.target.files);
                      }
                    }}
                    className="hidden"
                    id={`upload-${category.key}`}
                  />
                  <label
                    htmlFor={`upload-${category.key}`}
                    className="cursor-pointer flex flex-col items-center gap-2"
                  >
                    <Upload className="h-6 w-6 text-neutral-400" />
                    <span className="text-sm text-neutral-600 dark:text-neutral-400">
                      Choose Files
                    </span>
                    <span className="text-xs text-neutral-500">
                      Max {category.maxFiles} files, 10MB each
                    </span>
                  </label>
                </div>

                {/* File List */}
                {files.length > 0 && (
                  <div className="space-y-2">
                    {files.map((file, index) => (
                      <div key={`${file.name}-${index}`} className="flex items-center gap-2 p-2 bg-neutral-50 dark:bg-neutral-800 rounded-lg">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{file.name}</p>
                          <p className="text-xs text-neutral-500">{formatFileSize(file.size)}</p>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          {getStatusBadge(file.uploadStatus)}
                          
                          {file.uploadStatus === 'completed' && file.url && (
                            <div className="flex gap-1">
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="h-6 w-6 p-0"
                                onClick={() => window.open(file.url, '_blank')}
                              >
                                <Eye className="h-3 w-3" />
                              </Button>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="h-6 w-6 p-0"
                                onClick={() => {
                                  const link = document.createElement('a');
                                  link.href = file.url!;
                                  link.download = file.name;
                                  link.click();
                                }}
                              >
                                <Download className="h-3 w-3" />
                              </Button>
                            </div>
                          )}
                          
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                            onClick={() => removeFile(category.key, file.name)}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
