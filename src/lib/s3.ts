import { S3Client, PutObjectCommand, DeleteObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { v4 as uuidv4 } from 'uuid';

// Initialize S3 client
const s3Client = new S3Client({
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

const BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME!;

// Folder structure for organizing files
export const FOLDER_STRUCTURE = {
  PROFILE_IMAGES: 'profile-images',
  DOCUMENTS: 'documents',
  LICENSES: 'licenses',
  CERTIFICATES: 'certificates',
  MEDICAL_RECORDS: 'medical-records',
  VEHICLE_DOCS: 'vehicle-documents',
  BUSINESS_DOCS: 'business-documents',
  INSURANCE: 'insurance',
  TEMP: 'temp',
} as const;

export type FolderType = keyof typeof FOLDER_STRUCTURE;

// Generate unique file key with folder structure
export function generateFileKey(
  folder: FolderType,
  userId: string,
  originalFileName: string,
  customPath?: string
): string {
  const timestamp = Date.now();
  const fileExtension = originalFileName.split('.').pop();
  const uniqueId = uuidv4();
  const sanitizedFileName = originalFileName.replace(/[^a-zA-Z0-9.-]/g, '_');
  
  if (customPath) {
    return `${FOLDER_STRUCTURE[folder]}/${userId}/${customPath}/${timestamp}-${uniqueId}.${fileExtension}`;
  }
  
  return `${FOLDER_STRUCTURE[folder]}/${userId}/${timestamp}-${uniqueId}-${sanitizedFileName}`;
}

// Generate presigned URL for file upload
export async function generatePresignedUploadUrl(
  fileKey: string,
  contentType: string,
  expiresIn: number = 3600 // 1 hour default
): Promise<string> {
  const command = new PutObjectCommand({
    Bucket: BUCKET_NAME,
    Key: fileKey,
    ContentType: contentType,
    // Add metadata for better organization
    Metadata: {
      'upload-timestamp': new Date().toISOString(),
    },
  });

  return await getSignedUrl(s3Client, command, { expiresIn });
}

// Generate presigned URL for file download/view
export async function generatePresignedDownloadUrl(
  fileKey: string,
  expiresIn: number = 3600 // 1 hour default
): Promise<string> {
  const command = new GetObjectCommand({
    Bucket: BUCKET_NAME,
    Key: fileKey,
  });

  return await getSignedUrl(s3Client, command, { expiresIn });
}

// Delete file from S3
export async function deleteFileFromS3(fileKey: string): Promise<void> {
  const command = new DeleteObjectCommand({
    Bucket: BUCKET_NAME,
    Key: fileKey,
  });

  await s3Client.send(command);
}

// Get file URL (public or presigned based on bucket policy)
export function getFileUrl(fileKey: string): string {
  return `https://${BUCKET_NAME}.s3.${process.env.AWS_REGION || 'us-east-1'}.amazonaws.com/${fileKey}`;
}

// Validate file type and size
export function validateFile(
  file: File,
  allowedTypes: string[] = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'],
  maxSizeInMB: number = 10
): { isValid: boolean; error?: string } {
  // Check file type
  if (!allowedTypes.includes(file.type)) {
    return {
      isValid: false,
      error: `File type ${file.type} is not allowed. Allowed types: ${allowedTypes.join(', ')}`,
    };
  }

  // Check file size
  const maxSizeInBytes = maxSizeInMB * 1024 * 1024;
  if (file.size > maxSizeInBytes) {
    return {
      isValid: false,
      error: `File size ${(file.size / 1024 / 1024).toFixed(2)}MB exceeds maximum allowed size of ${maxSizeInMB}MB`,
    };
  }

  return { isValid: true };
}

// Get folder options for UI
export function getFolderOptions(): Array<{ value: FolderType; label: string; description: string }> {
  return [
    {
      value: 'PROFILE_IMAGES',
      label: 'Profile Images',
      description: 'User profile pictures and avatars',
    },
    {
      value: 'DOCUMENTS',
      label: 'General Documents',
      description: 'General documents and files',
    },
    {
      value: 'LICENSES',
      label: 'Licenses',
      description: 'Driving licenses and permits',
    },
    {
      value: 'CERTIFICATES',
      label: 'Certificates',
      description: 'Professional certificates and qualifications',
    },
    {
      value: 'MEDICAL_RECORDS',
      label: 'Medical Records',
      description: 'Medical certificates and health records',
    },
    {
      value: 'VEHICLE_DOCS',
      label: 'Vehicle Documents',
      description: 'Vehicle registration, insurance, and maintenance records',
    },
    {
      value: 'BUSINESS_DOCS',
      label: 'Business Documents',
      description: 'Business formation, tax, and legal documents',
    },
    {
      value: 'INSURANCE',
      label: 'Insurance',
      description: 'Insurance policies and documents',
    },
    {
      value: 'TEMP',
      label: 'Temporary Files',
      description: 'Temporary files and drafts',
    },
  ];
}

// Utility function to get file extension from filename
export function getFileExtension(filename: string): string {
  return filename.split('.').pop()?.toLowerCase() || '';
}

// Utility function to get file size in human readable format
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Utility function to get MIME type category
export function getMimeTypeCategory(mimeType: string): string {
  if (mimeType.startsWith('image/')) return 'image';
  if (mimeType.startsWith('video/')) return 'video';
  if (mimeType.startsWith('audio/')) return 'audio';
  if (mimeType.includes('pdf')) return 'pdf';
  if (mimeType.includes('document') || mimeType.includes('text')) return 'document';
  if (mimeType.includes('spreadsheet') || mimeType.includes('excel')) return 'spreadsheet';
  if (mimeType.includes('presentation') || mimeType.includes('powerpoint')) return 'presentation';
  if (mimeType.includes('zip') || mimeType.includes('archive')) return 'archive';
  
  return 'other';
}
