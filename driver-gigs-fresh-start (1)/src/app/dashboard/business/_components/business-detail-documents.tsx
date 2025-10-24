"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  FileText, 
  Upload, 
  Eye, 
  Download, 
  Trash2, 
  Search,
  Filter,
  X,
  Plus,
  Loader2
} from "lucide-react";
import { BusinessProfile, BusinessDocument } from "@/hooks/use-business";
import { DocumentUploadDialog } from "./document-upload-dialog";

interface BusinessDetailDocumentsProps {
  businessProfile: BusinessProfile;
}

export function BusinessDetailDocuments({ businessProfile }: BusinessDetailDocumentsProps) {
  const [showDocumentUpload, setShowDocumentUpload] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDocType, setSelectedDocType] = useState<string>("all");
  const [loadingDocuments, setLoadingDocuments] = useState<Set<string>>(new Set());

  // Filter documents
  const filteredDocuments = businessProfile.documents.filter(doc => {
    if (searchTerm && !doc.documentName.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    
    if (selectedDocType !== "all" && doc.documentType !== selectedDocType) {
      return false;
    }
    
    return true;
  });

  const handleViewDocument = async (doc: BusinessDocument) => {
    if (!doc.id) return;
    
    setLoadingDocuments(prev => new Set(prev).add(doc.id));
    
    try {
      const response = await fetch('/api/business/documents/view', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          documentId: doc.id,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate view URL');
      }

      const { viewUrl } = await response.json();
      window.open(viewUrl, '_blank');
    } catch (error) {
      console.error('Error viewing document:', error);
      // Fallback to direct URL if signed URL fails
      if (doc.fileUrl) {
        window.open(doc.fileUrl, '_blank');
      }
    } finally {
      setLoadingDocuments(prev => {
        const newSet = new Set(prev);
        newSet.delete(doc.id);
        return newSet;
      });
    }
  };

  const handleDownloadDocument = async (doc: BusinessDocument) => {
    if (!doc.id) return;
    
    setLoadingDocuments(prev => new Set(prev).add(doc.id));
    
    try {
      const response = await fetch('/api/business/documents/view', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          documentId: doc.id,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate download URL');
      }

      const { viewUrl, fileName } = await response.json();
      
      // Create download link with signed URL
      const link = document.createElement('a');
      link.href = viewUrl;
      link.download = fileName || doc.fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error downloading document:', error);
      // Fallback to direct URL if signed URL fails
      if (doc.fileUrl) {
        const link = document.createElement('a');
        link.href = doc.fileUrl;
        link.download = doc.fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    } finally {
      setLoadingDocuments(prev => {
        const newSet = new Set(prev);
        newSet.delete(doc.id);
        return newSet;
      });
    }
  };

  const getDocumentTypeLabel = (type: string) => {
    return type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const getDocumentTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      ARTICLES_OF_INCORPORATION: "bg-blue-100 text-blue-800",
      OPERATING_AGREEMENT: "bg-green-100 text-green-800",
      EIN_LETTER: "bg-purple-100 text-purple-800",
      BUSINESS_LICENSE: "bg-orange-100 text-orange-800",
      TAX_DOCUMENT: "bg-red-100 text-red-800",
      FINANCIAL_STATEMENT: "bg-yellow-100 text-yellow-800",
      CONTRACT: "bg-indigo-100 text-indigo-800",
      INSURANCE_POLICY: "bg-pink-100 text-pink-800",
      OTHER: "bg-gray-100 text-gray-800",
    };
    return colors[type] || "bg-gray-100 text-gray-800";
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedDocType("all");
  };

  const hasActiveFilters = searchTerm || selectedDocType !== "all";
  const documentTypes = Array.from(new Set(businessProfile.documents.map(doc => doc.documentType)));

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Documents</h2>
          <p className="text-sm text-gray-600 mt-1">
            Manage documents for {businessProfile.companyName}
          </p>
        </div>
        <Button onClick={() => setShowDocumentUpload(true)} className="w-full sm:w-auto">
          <Upload className="w-4 h-4 mr-2" />
          Upload Document
        </Button>
      </div>

      {/* Filters */}
      {businessProfile.documents.length > 0 && (
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search documents..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              <div className="flex flex-wrap gap-2 items-center">
                <Filter className="w-4 h-4 text-gray-500" />
                
                <Select value={selectedDocType} onValueChange={setSelectedDocType}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="All Types" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    {documentTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {getDocumentTypeLabel(type)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {hasActiveFilters && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={clearFilters}
                    className="px-2"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Document Statistics */}
      {businessProfile.documents.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <Card>
            <CardContent className="p-3 text-center">
              <p className="text-2xl font-bold text-blue-600">{businessProfile.documents.length}</p>
              <p className="text-xs text-gray-600">Total Documents</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-3 text-center">
              <p className="text-2xl font-bold text-green-600">{documentTypes.length}</p>
              <p className="text-xs text-gray-600">Document Types</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-3 text-center">
              <p className="text-2xl font-bold text-purple-600">
                {Math.round(businessProfile.documents.reduce((sum, doc) => sum + doc.fileSize, 0) / 1024 / 1024 * 100) / 100}
              </p>
              <p className="text-xs text-gray-600">Total MB</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-3 text-center">
              <p className="text-2xl font-bold text-orange-600">{filteredDocuments.length}</p>
              <p className="text-xs text-gray-600">Filtered Results</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Documents List */}
      {filteredDocuments.length > 0 ? (
        <div className="space-y-3">
          {filteredDocuments.map((doc) => (
            <Card key={doc.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start gap-3">
                      <FileText className="w-5 h-5 text-gray-500 flex-shrink-0 mt-0.5" />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-gray-900 truncate">
                          {doc.documentName}
                        </h4>
                        <div className="flex flex-wrap items-center gap-2 mt-1">
                          <Badge 
                            className={getDocumentTypeColor(doc.documentType)} 
                            variant="secondary"
                          >
                            {getDocumentTypeLabel(doc.documentType)}
                          </Badge>
                          <span className="text-xs text-gray-500">•</span>
                          <span className="text-xs text-gray-500">
                            {formatFileSize(doc.fileSize)}
                          </span>
                          <span className="text-xs text-gray-500">•</span>
                          <span className="text-xs text-gray-500">
                            {doc.mimeType}
                          </span>
                        </div>
                        {doc.description && (
                          <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                            {doc.description}
                          </p>
                        )}
                        <div className="text-xs text-gray-400 mt-2">
                          Uploaded {new Date(doc.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-1 ml-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleViewDocument(doc)}
                      className="h-8 w-8 p-0"
                      title="View Document"
                      disabled={loadingDocuments.has(doc.id)}
                    >
                      {loadingDocuments.has(doc.id) ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDownloadDocument(doc)}
                      className="h-8 w-8 p-0"
                      title="Download Document"
                      disabled={loadingDocuments.has(doc.id)}
                    >
                      {loadingDocuments.has(doc.id) ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Download className="w-4 h-4" />
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                      title="Delete Document"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : businessProfile.documents.length > 0 ? (
        <div className="text-center py-8 sm:py-12 px-4">
          <FileText className="w-10 h-10 sm:w-12 sm:h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No documents match your filters
          </h3>
          <p className="text-sm sm:text-base text-gray-600 mb-4">
            Try adjusting your search terms or filters.
          </p>
          <Button onClick={clearFilters} variant="outline">
            Clear Filters
          </Button>
        </div>
      ) : (
        <div className="text-center py-8 sm:py-12 px-4">
          <FileText className="w-10 h-10 sm:w-12 sm:h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No documents uploaded yet</h3>
          <p className="text-sm sm:text-base text-gray-600 mb-4">
            Upload your first document to get started with document management for {businessProfile.companyName}
          </p>
          <Button onClick={() => setShowDocumentUpload(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Upload First Document
          </Button>
        </div>
      )}

      {/* Document Upload Dialog */}
      {showDocumentUpload && (
        <DocumentUploadDialog
          businessId={businessProfile.id}
          onClose={() => setShowDocumentUpload(false)}
        />
      )}
    </div>
  );
}
