import { useQuery } from '@tanstack/react-query';

// Types for credential data
export interface LicenseData {
  id: string;
  licenseNumber?: string;
  issuingAuthority?: string;
  issueDate?: string;
  expiryDate?: string;
  status?: string;
  hasFile: boolean;
  fileUrl?: string;
  uploadedAt?: string;
}

export interface LicenseStatus {
  type: string;
  name: string;
  description: string;
  isRequired: boolean;
  isUploaded: boolean;
  data: LicenseData | null;
}

export interface CertificationData {
  id: string;
  certificateNumber?: string;
  issuingAuthority?: string;
  issueDate?: string;
  expiryDate?: string;
  status?: string;
  hasFile: boolean;
  fileUrl?: string;
  uploadedAt?: string;
  isCustom?: boolean;
}

export interface CertificationStatus {
  type: string;
  name: string;
  description: string;
  category: string;
  isRequired: boolean;
  isUploaded: boolean;
  data: CertificationData | null;
}

export interface DOTMCData {
  dotNumber: {
    value: string;
    hasFile: boolean;
    fileUrl?: string;
    uploadedAt?: string;
  };
  mcNumber: {
    value: string;
    hasFile: boolean;
    fileUrl?: string;
    uploadedAt?: string;
  };
  hasAnyData: boolean;
}

// Hook to fetch user licenses
export function useLicenses() {
  return useQuery({
    queryKey: ['licenses'],
    queryFn: async (): Promise<{ licenses: LicenseStatus[] }> => {
      const response = await fetch('/api/licenses');
      if (!response.ok) {
        throw new Error('Failed to fetch licenses');
      }
      return response.json();
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Hook to fetch user certifications
export function useCertifications() {
  return useQuery({
    queryKey: ['certifications'],
    queryFn: async (): Promise<{ certifications: CertificationStatus[] }> => {
      const response = await fetch('/api/certifications');
      if (!response.ok) {
        throw new Error('Failed to fetch certifications');
      }
      return response.json();
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Hook to fetch DOT/MC numbers
export function useDOTMC() {
  return useQuery({
    queryKey: ['dot-mc'],
    queryFn: async (): Promise<DOTMCData> => {
      const response = await fetch('/api/dot-mc');
      if (!response.ok) {
        throw new Error('Failed to fetch DOT/MC numbers');
      }
      return response.json();
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Utility function to get upload status badge variant
export function getUploadStatusVariant(isUploaded: boolean, isRequired: boolean) {
  if (isUploaded) {
    return 'default' as const; // Green/success
  }
  if (isRequired) {
    return 'destructive' as const; // Red/error for required but missing
  }
  return 'secondary' as const; // Gray for optional
}

// Utility function to get upload status text
export function getUploadStatusText(isUploaded: boolean, isRequired: boolean) {
  if (isUploaded) {
    return 'Uploaded';
  }
  if (isRequired) {
    return 'Required';
  }
  return 'Optional';
}
