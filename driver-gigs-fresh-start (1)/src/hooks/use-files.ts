"use client";

import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

export interface PresignedUploadResponse {
  presignedUrl: string;
  fileKey: string;
  fileUrl: string;
}

// Get presigned upload URL
async function getPresignedUploadUrl(data: {
  fileName: string;
  mimeType: string;
  folder: string;
  customPath?: string;
}): Promise<PresignedUploadResponse> {
  const response = await fetch('/api/files', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error('Failed to get presigned upload URL');
  }
  return response.json();
}

export function useFileUpload() {
  return useMutation({
    mutationFn: async (data: {
      file: File;
      folder: string;
      customPath?: string;
    }) => {
      // Get presigned URL
      const { presignedUrl, fileKey, fileUrl } = await getPresignedUploadUrl({
        fileName: data.file.name,
        mimeType: data.file.type,
        folder: data.folder,
        customPath: data.customPath,
      });

      // Upload file to S3
      const uploadResponse = await fetch(presignedUrl, {
        method: 'PUT',
        body: data.file,
        headers: {
          'Content-Type': data.file.type,
        },
      });

      if (!uploadResponse.ok) {
        throw new Error('Failed to upload file to S3');
      }

      return {
        fileKey,
        fileUrl,
        fileName: data.file.name,
        fileSize: data.file.size,
        mimeType: data.file.type,
      };
    },
    onSuccess: () => {
      toast.success('File uploaded successfully');
    },
    onError: (error) => {
      toast.error(`Upload failed: ${error.message}`);
    },
  });
}
