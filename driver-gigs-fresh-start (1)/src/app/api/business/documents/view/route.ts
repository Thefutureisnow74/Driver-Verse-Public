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
    const { documentId } = body;

    if (!documentId) {
      return NextResponse.json(
        { error: "Document ID is required" },
        { status: 400 }
      );
    }

    // Verify the document belongs to the user's business
    const document = await prisma.businessDocument.findUnique({
      where: { id: documentId },
      include: {
        business: {
          select: { userId: true },
        },
      },
    });

    if (!document || document.business.userId !== session.user.id) {
      return NextResponse.json(
        { error: "Document not found or unauthorized" },
        { status: 404 }
      );
    }

    // Generate presigned URL for viewing/downloading
    const viewUrl = await generatePresignedDownloadUrl(document.fileKey);

    return NextResponse.json({
      viewUrl,
      fileName: document.fileName,
      mimeType: document.mimeType,
    });
  } catch (error) {
    console.error("Error generating view URL:", error);
    return NextResponse.json(
      { error: "Failed to generate view URL" },
      { status: 500 }
    );
  }
}
