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
    const { certificationId } = body;

    if (!certificationId) {
      return NextResponse.json(
        { error: "Certification ID is required" },
        { status: 400 }
      );
    }

    // Verify the certification belongs to the user
    const certification = await prisma.certification.findUnique({
      where: { 
        id: certificationId,
        userId: session.user.id 
      },
    });

    if (!certification || !certification.fileKey) {
      return NextResponse.json(
        { error: "Certification not found or no file available" },
        { status: 404 }
      );
    }

    // Generate presigned URL for viewing/downloading
    const viewUrl = await generatePresignedDownloadUrl(certification.fileKey);

    return NextResponse.json({
      viewUrl,
      fileName: certification.certificateNumber || `certification-${certification.type}`,
      mimeType: 'application/pdf', // Default to PDF, could be stored in DB
    });
  } catch (error) {
    console.error("Error generating certification view URL:", error);
    return NextResponse.json(
      { error: "Failed to generate view URL" },
      { status: 500 }
    );
  }
}
