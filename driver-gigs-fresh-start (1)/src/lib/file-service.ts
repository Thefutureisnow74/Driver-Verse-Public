import { 
  generateFileKey, 
  generatePresignedUploadUrl, 
  getFileUrl,
  validateFile,
  FolderType,
  FOLDER_STRUCTURE
} from './s3';

// Get presigned upload URL
export async function getPresignedUploadUrl(
  userId: string,
  fileName: string,
  mimeType: string,
  folder: FolderType,
  customPath?: string
) {
  // Validate file
  const file = new File([], fileName, { type: mimeType });
  const validation = validateFile(file);
  
  if (!validation.isValid) {
    throw new Error(validation.error);
  }

  const fileKey = generateFileKey(folder, userId, fileName, customPath);
  const presignedUrl = await generatePresignedUploadUrl(fileKey, mimeType);
  
  return {
    presignedUrl,
    fileKey,
    fileUrl: getFileUrl(fileKey),
  };
}

