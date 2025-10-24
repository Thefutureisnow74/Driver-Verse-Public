# S3 File Upload Setup Guide

This guide explains how to set up AWS S3 for file uploads in the Driver Gigs application.

## Required Environment Variables

Add these environment variables to your `.env` file:

```env
# AWS S3 Configuration
AWS_REGION="us-east-1"
AWS_ACCESS_KEY_ID="your-aws-access-key-id"
AWS_SECRET_ACCESS_KEY="your-aws-secret-access-key"
AWS_S3_BUCKET_NAME="your-s3-bucket-name"
```

## AWS S3 Setup

### 1. Create an S3 Bucket

1. Go to the AWS S3 Console
2. Click "Create bucket"
3. Choose a unique bucket name (e.g., `driver-gigs-files-{your-username}`)
4. Select your preferred region
5. Configure bucket settings:
   - **Block Public Access**: Keep all settings enabled for security
   - **Bucket Versioning**: Enable if you want file versioning
   - **Server-side encryption**: Enable for security

### 2. Create IAM User and Policy

1. Go to AWS IAM Console
2. Create a new user (e.g., `driver-gigs-s3-user`)
3. Attach a custom policy with the following permissions:

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "s3:GetObject",
                "s3:PutObject",
                "s3:DeleteObject"
            ],
            "Resource": "arn:aws:s3:::your-bucket-name/*"
        },
        {
            "Effect": "Allow",
            "Action": [
                "s3:ListBucket"
            ],
            "Resource": "arn:aws:s3:::your-bucket-name"
        }
    ]
}
```

4. Generate access keys for the user
5. Add the access keys to your `.env` file

### 3. Configure CORS (Optional)

If you need to upload files directly from the browser, add this CORS configuration to your S3 bucket:

```json
[
    {
        "AllowedHeaders": ["*"],
        "AllowedMethods": ["GET", "PUT", "POST", "DELETE"],
        "AllowedOrigins": ["http://localhost:3000", "https://yourdomain.com"],
        "ExposeHeaders": ["ETag"]
    }
]
```

## Folder Structure

The application organizes files into the following folders:

- `profile-images/` - User profile pictures
- `documents/` - General documents
- `licenses/` - Driving licenses and permits
- `certificates/` - Professional certificates
- `medical-records/` - Medical certificates and health records
- `vehicle-documents/` - Vehicle registration and maintenance records
- `insurance/` - Insurance policies and documents
- `temp/` - Temporary files and drafts

## API Endpoints

### File Operations

- `POST /api/files` - Get presigned URL for upload

This is the only endpoint needed. The client handles the actual file upload to S3 using the presigned URL.

## React Hooks

The application provides a simple React hook for file uploads:

- `useFileUpload()` - Upload files to S3 using presigned URLs

## Security Features

1. **Authentication Required**: File upload requires user authentication
2. **User Isolation**: Users can only upload to their own folders
3. **Presigned URLs**: Secure, time-limited URLs for file upload
4. **File Validation**: File type and size validation before upload
5. **Folder Organization**: Structured folder system for better organization

## Usage Example

```typescript
import { useFileUpload } from '@/hooks/use-files';

function FileUploadComponent() {
  const uploadMutation = useFileUpload();

  const handleUpload = (file: File) => {
    uploadMutation.mutate({
      file,
      folder: 'DOCUMENTS',
    });
  };

  return (
    <input
      type="file"
      onChange={(e) => e.target.files?.[0] && handleUpload(e.target.files[0])}
    />
  );
}
```

The hook will:
1. Get a presigned URL from the server
2. Upload the file directly to S3
3. Return the file information (key, URL, etc.)

