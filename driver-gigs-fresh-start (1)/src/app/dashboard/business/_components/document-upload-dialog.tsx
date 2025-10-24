"use client";

import { useState, useRef } from "react";
import { Upload, X, FileText, Eye, Download, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useBusinessDocuments } from "@/hooks/use-business";
import { BusinessDocumentType } from "@/generated/prisma";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

interface DocumentUploadDialogProps {
  businessId: string;
  onClose: () => void;
}

export function DocumentUploadDialog({ businessId, onClose }: DocumentUploadDialogProps) {
  const { documents, isLoading, uploadDocument, viewDocument, deleteDocument } = useBusinessDocuments(businessId);
  const [documentName, setDocumentName] = useState("");
  const [documentType, setDocumentType] = useState<BusinessDocumentType>(BusinessDocumentType.OTHER);
  const [description, setDescription] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const getDocumentTypeLabel = (type: BusinessDocumentType) => {
    switch (type) {
      case BusinessDocumentType.SS4_EIN_LETTER:
        return "SS4 (EIN Assignment Letter)";
      case BusinessDocumentType.ARTICLES_OF_INCORPORATION:
        return "Articles of Incorporation";
      case BusinessDocumentType.OPERATING_AGREEMENT:
        return "Operating Agreement";
      case BusinessDocumentType.BYLAWS:
        return "Bylaws";
      case BusinessDocumentType.BUSINESS_LICENSE:
        return "Business License";
      case BusinessDocumentType.TAX_RETURN:
        return "Tax Return";
      case BusinessDocumentType.FINANCIAL_STATEMENT:
        return "Financial Statement";
      case BusinessDocumentType.INSURANCE_POLICY:
        return "Insurance Policy";
      case BusinessDocumentType.CONTRACT:
        return "Contract";
      case BusinessDocumentType.PERMIT:
        return "Permit";
      case BusinessDocumentType.CERTIFICATE:
        return "Certificate";
      case BusinessDocumentType.OTHER:
        return "Other";
      default:
        // @ts-ignore
        return type.replace(/_/g, ' ');
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      if (!documentName) {
        // Auto-fill document name with filename (without extension)
        const nameWithoutExt = file.name.replace(/\.[^/.]+$/, "");
        setDocumentName(nameWithoutExt);
      }
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!documentName || !selectedFile) {
      return;
    }

    try {
      setIsUploading(true);
      await uploadDocument({
        documentName,
        documentType,
        description: description || undefined,
        file: selectedFile,
      });
      
      // Reset form
      setDocumentName("");
      setDocumentType(BusinessDocumentType.OTHER);
      setDescription("");
      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error) {
      console.error('Failed to upload document:', error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleViewDocument = async (documentId: string) => {
    try {
      await viewDocument(documentId);
    } catch (error) {
      console.error('Failed to view document:', error);
    }
  };

  const handleDeleteDocument = async (documentId: string) => {
    if (!confirm('Are you sure you want to delete this document? This action cannot be undone.')) {
      return;
    }
    
    try {
      await deleteDocument(documentId);
    } catch (error) {
      console.error('Failed to delete document:', error);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="fixed inset-0 z-[200] bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto relative z-[210]">
        <div className="p-4 sm:p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold">Business Documents</h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-6 w-6 p-0"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          {/* Upload Form */}
          <form onSubmit={handleUpload} className="space-y-4 border-b pb-6 mb-6">
            <h3 className="font-medium">Upload New Document</h3>
            
            <div className="space-y-2">
              <Label htmlFor="documentName">Document Name *</Label>
              <Input
                id="documentName"
                value={documentName}
                onChange={(e) => setDocumentName(e.target.value)}
                placeholder="SS4 EIN Assignment Letter"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="documentType">Document Type *</Label>
              <Select value={documentType} onValueChange={(value) => setDocumentType(value as BusinessDocumentType)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="z-[220] max-h-60">
                  <SelectItem value={BusinessDocumentType.SS4_EIN_LETTER}>SS4 (EIN Assignment Letter)</SelectItem>
                  <SelectItem value={BusinessDocumentType.ARTICLES_OF_INCORPORATION}>Articles of Incorporation</SelectItem>
                  <SelectItem value={BusinessDocumentType.OPERATING_AGREEMENT}>Operating Agreement</SelectItem>
                  <SelectItem value={BusinessDocumentType.BYLAWS}>Bylaws</SelectItem>
                  <SelectItem value={BusinessDocumentType.BUSINESS_LICENSE}>Business License</SelectItem>
                  <SelectItem value={BusinessDocumentType.TAX_RETURN}>Tax Return</SelectItem>
                  <SelectItem value={BusinessDocumentType.FINANCIAL_STATEMENT}>Financial Statement</SelectItem>
                  <SelectItem value={BusinessDocumentType.INSURANCE_POLICY}>Insurance Policy</SelectItem>
                  <SelectItem value={BusinessDocumentType.CONTRACT}>Contract</SelectItem>
                  <SelectItem value={BusinessDocumentType.PERMIT}>Permit</SelectItem>
                  <SelectItem value={BusinessDocumentType.CERTIFICATE}>Certificate</SelectItem>
                  <SelectItem value={BusinessDocumentType.OTHER}>Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description (Optional)</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Brief description of the document..."
                rows={2}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="file">Select File *</Label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                <input
                  ref={fileInputRef}
                  type="file"
                  id="file"
                  onChange={handleFileSelect}
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.gif"
                  className="hidden"
                  required
                />
                <div className="text-center">
                  {selectedFile ? (
                    <div className="space-y-2">
                      <FileText className="w-8 h-8 text-blue-600 mx-auto" />
                      <div className="text-sm">
                        <div className="font-medium">{selectedFile.name}</div>
                        <div className="text-muted-foreground">
                          {formatFileSize(selectedFile.size)}
                        </div>
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        Change File
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <Upload className="w-8 h-8 text-gray-400 mx-auto" />
                      <div className="text-sm text-muted-foreground">
                        Click to select a file or drag and drop
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        Choose File
                      </Button>
                    </div>
                  )}
                </div>
              </div>
              <p className="text-xs text-muted-foreground">
                Supported formats: PDF, DOC, DOCX, JPG, PNG, GIF (Max 10MB)
              </p>
            </div>

            <Button 
              type="submit" 
              disabled={isUploading || !selectedFile || !documentName}
              className="w-full"
            >
              {isUploading ? (
                <>
                  <LoadingSpinner size="sm" className="mr-2" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Document
                </>
              )}
            </Button>
          </form>

          {/* Documents List */}
          <div className="space-y-4">
            <h3 className="font-medium">Uploaded Documents ({documents.length})</h3>
            
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <LoadingSpinner size="md" />
              </div>
            ) : documents.length > 0 ? (
              <div className="space-y-3">
                {documents.map((doc) => (
                  <div
                    key={doc.id}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <FileText className="w-5 h-5 text-blue-600 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="font-medium truncate">{doc.documentName}</div>
                        <div className="text-sm text-muted-foreground">
                          {getDocumentTypeLabel(doc.documentType)} • {formatFileSize(doc.fileSize)}
                        </div>
                        {doc.description && (
                          <div className="text-xs text-muted-foreground mt-1 truncate">
                            {doc.description}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-1 ml-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleViewDocument(doc.id)}
                        className="h-8 w-8 p-0"
                        title="View"
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleViewDocument(doc.id)}
                        className="h-8 w-8 p-0"
                        title="Download"
                      >
                        <Download className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteDocument(doc.id)}
                        className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <FileText className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p>No documents uploaded yet</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
