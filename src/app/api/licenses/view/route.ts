import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { generatePresignedDownloadUrl } from "@/lib/s3";
import prisma from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: request.headers });

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { licenseId } = body;

    if (!licenseId) {
      return NextResponse.json(
        { error: "License ID is required" },
        { status: 400 }
      );
    }

    // Verify the license belongs to the user
    const license = await prisma.license.findUnique({
      where: { 
        id: licenseId,
        userId: session.user.id 
      },
    });

    if (!license || !license.fileKey) {
      return NextResponse.json(
        { error: "License not found or no file available" },
        { status: 404 }
      );
    }

    // Generate presigned URL for viewing/downloading
    const viewUrl = await generatePresignedDownloadUrl(license.fileKey);

    return NextResponse.json({
      viewUrl,
      fileName: license.licenseNumber || `license-${license.type}`,
      mimeType: 'application/pdf', // Default to PDF, could be stored in DB
    });
  } catch (error) {
    console.error("Error generating license view URL:", error);
    return NextResponse.json(
      { error: "Failed to generate view URL" },
      { status: 500 }
    );
  }
}
