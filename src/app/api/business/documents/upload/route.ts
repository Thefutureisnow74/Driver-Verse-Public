import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { generateFileKey, generatePresignedUploadUrl } from "@/lib/s3";

export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: request.headers });

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { fileName, fileType, businessId } = body;

    if (!fileName || !fileType || !businessId) {
      return NextResponse.json(
        { error: "File name, type, and business ID are required" },
        { status: 400 }
      );
    }

    // Generate unique file key for business documents
    const fileKey = generateFileKey(
      "BUSINESS_DOCS",
      session.user.id,
      fileName,
      businessId
    );

    // Generate presigned URL for upload
    const uploadUrl = await generatePresignedUploadUrl(fileKey, fileType);

    // Construct the file URL (this will be the permanent URL after upload)
    const fileUrl = `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_REGION || 'us-east-1'}.amazonaws.com/${fileKey}`;

    return NextResponse.json({
      uploadUrl,
      fileKey,
      fileUrl,
    });
  } catch (error) {
    console.error("Error generating upload URL:", error);
    return NextResponse.json(
      { error: "Failed to generate upload URL" },
      { status: 500 }
    );
  }
}
