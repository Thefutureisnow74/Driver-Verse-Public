import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { generatePresignedDownloadUrl } from "@/lib/s3";
import prisma from "@/lib/db";

// POST /api/fleet/documents/view - Generate presigned URLs for viewing documents
export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: request.headers });
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { vehicleId, documentKeys } = body;

    // Validate required fields
    if (!vehicleId || !documentKeys || !Array.isArray(documentKeys)) {
      return NextResponse.json(
        { error: "vehicleId and documentKeys array are required" },
        { status: 400 }
      );
    }

    // Verify user owns the vehicle
    const vehicle = await prisma.vehicle.findUnique({
      where: {
        id: vehicleId,
        userId: session.user.id
      }
    });

    if (!vehicle) {
      return NextResponse.json(
        { error: "Vehicle not found or access denied" },
        { status: 404 }
      );
    }

    // Generate presigned URLs for each document
    const presignedUrls: Record<string, string> = {};
    
    for (const documentKey of documentKeys) {
      if (typeof documentKey !== 'string') {
        continue;
      }
      
      try {
        // Extract the S3 key from the document key (assuming it's stored as the full S3 key)
        const presignedUrl = await generatePresignedDownloadUrl(documentKey, 3600); // 1 hour expiry
        presignedUrls[documentKey] = presignedUrl;
      } catch (error) {
        console.error(`Error generating presigned URL for ${documentKey}:`, error);
        // Continue with other documents even if one fails
      }
    }

    return NextResponse.json({
      presignedUrls,
      expiresIn: 3600 // 1 hour
    });

  } catch (error) {
    console.error("Error generating presigned URLs:", error);
    return NextResponse.json(
      { error: "Failed to generate presigned URLs" },
      { status: 500 }
    );
  }
}
