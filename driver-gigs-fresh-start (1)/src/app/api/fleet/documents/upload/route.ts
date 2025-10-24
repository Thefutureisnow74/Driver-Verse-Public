import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { generateFileKey, generatePresignedUploadUrl, FOLDER_STRUCTURE } from "@/lib/s3";

// POST /api/fleet/documents/upload - Generate presigned URL for document upload
export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: request.headers });
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { fileName, fileType, documentCategory, vehicleId } = body;

    // Validate required fields
    if (!fileName || !fileType || !documentCategory) {
      return NextResponse.json(
        { error: "fileName, fileType, and documentCategory are required" },
        { status: 400 }
      );
    }

    // Validate document category
    const validCategories = [
      'vehiclePhotos',
      'insurancePolicy',
      'insuranceCards',
      'registration',
      'title',
      'vehicleWarranty',
      'tireWarranty',
      'partsWarranty',
      'maintenanceRecords',
      'otherDocuments'
    ];

    if (!validCategories.includes(documentCategory)) {
      return NextResponse.json(
        { error: "Invalid document category" },
        { status: 400 }
      );
    }

    // Validate file type
    const allowedTypes = [
      'image/jpeg',
      'image/png',
      'image/webp',
      'application/pdf',
      'text/plain'
    ];

    if (!allowedTypes.includes(fileType)) {
      return NextResponse.json(
        { error: "Invalid file type" },
        { status: 400 }
      );
    }

    // Generate unique file key
    const customPath = vehicleId ? `${vehicleId}/${documentCategory}` : documentCategory;
    const fileKey = generateFileKey(
      'VEHICLE_DOCS',
      session.user.id,
      fileName,
      customPath
    );

    // Generate presigned upload URL
    const uploadUrl = await generatePresignedUploadUrl(fileKey, fileType, 3600); // 1 hour expiry

    // Generate the final file URL (for after upload)
    const fileUrl = `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_REGION || 'us-east-1'}.amazonaws.com/${fileKey}`;

    return NextResponse.json({
      uploadUrl,
      fileKey, // This is what we'll store in the database
      fileUrl,
      documentId: `doc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    });

  } catch (error) {
    console.error("Error generating upload URL:", error);
    return NextResponse.json(
      { error: "Failed to generate upload URL" },
      { status: 500 }
    );
  }
}

// GET /api/fleet/documents/upload - Get document upload status
export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: request.headers });
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const fileKey = searchParams.get('fileKey');

    if (!fileKey) {
      return NextResponse.json(
        { error: "fileKey parameter is required" },
        { status: 400 }
      );
    }

    // Here you could implement logic to check if the file exists in S3
    // For now, we'll return a simple response
    return NextResponse.json({
      exists: true,
      fileKey,
      status: 'completed'
    });

  } catch (error) {
    console.error("Error checking upload status:", error);
    return NextResponse.json(
      { error: "Failed to check upload status" },
      { status: 500 }
    );
  }
}
