"use client";

import { useState, useEffect } from "react";
import { BusinessType, BusinessStatus, BusinessDocumentType } from "@/generated/prisma";

export interface BusinessProfile {
  id: string;
  companyName: string;
  businessType: BusinessType;
  state: string;
  status: BusinessStatus;
  formationDate: string | null;
  ein: string | null;
  phoneNumber: string | null;
  email: string | null;
  website: string | null;
  streetAddress: string | null;
  city: string | null;
  zipCode: string | null;
  description: string | null;
  industry: string | null;
  employeeCount: string | null;
  // Extended information
  registeredAgentInfo?: any;
  contactInfo?: any;
  mailWebInfo?: any;
  bankingFinanceInfo?: any;
  businessCreditInfo?: any;
  socialMediaInfo?: any;
  businessPlanInfo?: any;
  codesCertificationsInfo?: any;
  taxInfo?: any;
  documents: BusinessDocument[];
  _count: {
    documents: number;
  };
  createdAt: string;
  updatedAt: string;
}

export interface BusinessDocument {
  id: string;
  businessId: string;
  documentName: string;
  documentType: BusinessDocumentType;
  description: string | null;
  fileName: string;
  fileKey: string;
  fileUrl: string;
  fileSize: number;
  mimeType: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export function useBusinessProfiles() {
  const [businessProfiles, setBusinessProfiles] = useState<BusinessProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBusinessProfiles = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/business");
      if (!response.ok) throw new Error("Failed to fetch business profiles");
      const data = await response.json();
      setBusinessProfiles(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const createBusinessProfile = async (profileData: Omit<BusinessProfile, "id" | "documents" | "_count" | "createdAt" | "updatedAt">) => {
    try {
      const response = await fetch("/api/business", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profileData),
      });

      if (!response.ok) throw new Error("Failed to create business profile");
      
      const newProfile = await response.json();
      setBusinessProfiles(prev => [newProfile, ...prev]);
      
      return newProfile;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create business profile");
      throw err;
    }
  };

  const updateBusinessProfile = async (profileId: string, profileData: Partial<BusinessProfile>) => {
    try {
      const response = await fetch(`/api/business/${profileId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profileData),
      });

      if (!response.ok) throw new Error("Failed to update business profile");
      
      const updatedProfile = await response.json();
      setBusinessProfiles(prev => 
        prev.map(profile => 
          profile.id === profileId ? updatedProfile : profile
        )
      );
      
      return updatedProfile;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update business profile");
      throw err;
    }
  };

  const deleteBusinessProfile = async (profileId: string) => {
    try {
      const response = await fetch(`/api/business/${profileId}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete business profile");
      
      setBusinessProfiles(prev => prev.filter(profile => profile.id !== profileId));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete business profile");
      throw err;
    }
  };

  useEffect(() => {
    fetchBusinessProfiles();
  }, []);

  return {
    businessProfiles,
    isLoading,
    error,
    createBusinessProfile,
    updateBusinessProfile,
    deleteBusinessProfile,
    refreshBusinessProfiles: fetchBusinessProfiles,
  };
}

export function useBusinessDocuments(businessId: string | null) {
  const [documents, setDocuments] = useState<BusinessDocument[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDocuments = async () => {
    if (!businessId) return;
    
    try {
      setIsLoading(true);
      const response = await fetch(`/api/business/${businessId}/documents`);
      if (!response.ok) throw new Error("Failed to fetch business documents");
      const data = await response.json();
      setDocuments(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const uploadDocument = async (documentData: {
    documentName: string;
    documentType: BusinessDocumentType;
    description?: string;
    file: File;
  }) => {
    if (!businessId) throw new Error("Business ID is required");

    try {
      // Step 1: Get presigned URL for upload
      const uploadResponse = await fetch("/api/business/documents/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fileName: documentData.file.name,
          fileType: documentData.file.type,
          businessId,
        }),
      });

      if (!uploadResponse.ok) throw new Error("Failed to get upload URL");
      
      const { uploadUrl, fileKey, fileUrl } = await uploadResponse.json();

      // Step 2: Upload file to S3
      const fileUploadResponse = await fetch(uploadUrl, {
        method: "PUT",
        body: documentData.file,
        headers: {
          "Content-Type": documentData.file.type,
        },
      });

      if (!fileUploadResponse.ok) throw new Error("Failed to upload file");

      // Step 3: Save document record to database
      const documentResponse = await fetch(`/api/business/${businessId}/documents`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          documentName: documentData.documentName,
          documentType: documentData.documentType,
          description: documentData.description,
          fileName: documentData.file.name,
          fileKey,
          fileUrl,
          fileSize: documentData.file.size,
          mimeType: documentData.file.type,
        }),
      });

      if (!documentResponse.ok) throw new Error("Failed to save document record");
      
      const newDocument = await documentResponse.json();
      setDocuments(prev => [newDocument, ...prev]);
      
      return newDocument;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to upload document");
      throw err;
    }
  };

  const viewDocument = async (documentId: string) => {
    try {
      const response = await fetch("/api/business/documents/view", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ documentId }),
      });

      if (!response.ok) throw new Error("Failed to get document view URL");
      
      const { viewUrl } = await response.json();
      
      // Open document in new tab
      window.open(viewUrl, "_blank");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to view document");
      throw err;
    }
  };

  const deleteDocument = async (documentId: string) => {
    try {
      const response = await fetch(`/api/business/documents/${documentId}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete document");
      
      setDocuments(prev => prev.filter(doc => doc.id !== documentId));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete document");
      throw err;
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, [businessId]);

  return {
    documents,
    isLoading,
    error,
    uploadDocument,
    viewDocument,
    deleteDocument,
    refreshDocuments: fetchDocuments,
  };
}
