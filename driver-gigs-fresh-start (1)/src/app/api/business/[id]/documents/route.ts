import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/db";
import { BusinessDocumentType } from "@/generated/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await auth.api.getSession({ headers: request.headers });

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Verify the business profile belongs to the user
    const businessProfile = await prisma.businessProfile.findUnique({
      where: { id },
      select: { userId: true },
    });

    if (!businessProfile || businessProfile.userId !== session.user.id) {
      return NextResponse.json(
        { error: "Business profile not found or unauthorized" },
        { status: 404 }
      );
    }

    const documents = await prisma.businessDocument.findMany({
      where: {
        businessId: id,
        isActive: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(documents);
  } catch (error) {
    console.error("Error fetching business documents:", error);
    return NextResponse.json(
      { error: "Failed to fetch business documents" },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await auth.api.getSession({ headers: request.headers });

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const {
      documentName,
      documentType,
      description,
      fileName,
      fileKey,
      fileUrl,
      fileSize,
      mimeType,
    } = body;

    // Validate required fields
    if (!documentName || !documentType || !fileName || !fileKey || !fileUrl) {
      return NextResponse.json(
        { error: "Document name, type, and file information are required" },
        { status: 400 }
      );
    }

    // Verify the business profile belongs to the user
    const businessProfile = await prisma.businessProfile.findUnique({
      where: { id },
      select: { userId: true },
    });

    if (!businessProfile || businessProfile.userId !== session.user.id) {
      return NextResponse.json(
        { error: "Business profile not found or unauthorized" },
        { status: 404 }
      );
    }

    const document = await prisma.businessDocument.create({
      data: {
        businessId: id,
        documentName,
        documentType: documentType as BusinessDocumentType,
        description,
        fileName,
        fileKey,
        fileUrl,
        fileSize: parseInt(fileSize),
        mimeType,
      },
    });

    return NextResponse.json(document);
  } catch (error) {
    console.error("Error creating business document:", error);
    return NextResponse.json(
      { error: "Failed to create business document" },
      { status: 500 }
    );
  }
}
