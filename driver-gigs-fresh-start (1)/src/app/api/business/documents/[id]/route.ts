import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/db";
import { deleteFileFromS3 } from "@/lib/s3";

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await auth.api.getSession({ headers: request.headers });

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Verify the document belongs to the user's business
    const document = await prisma.businessDocument.findUnique({
      where: { id },
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

    // Delete file from S3
    try {
      await deleteFileFromS3(document.fileKey);
    } catch (s3Error) {
      console.error("Error deleting file from S3:", s3Error);
      // Continue with database deletion even if S3 deletion fails
    }

    // Delete document record from database
    await prisma.businessDocument.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting business document:", error);
    return NextResponse.json(
      { error: "Failed to delete business document" },
      { status: 500 }
    );
  }
}
