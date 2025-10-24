import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getDOTMCCertificateUploadUrl } from "@/lib/license-service";

// POST /api/dot-mc/upload - Get presigned URL for DOT/MC certificate upload
export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { certificateType, fileName, mimeType } = body;

    if (!certificateType || !fileName || !mimeType) {
      return NextResponse.json(
        { error: "certificateType, fileName, and mimeType are required" },
        { status: 400 }
      );
    }

    if (!['dot', 'mc'].includes(certificateType)) {
      return NextResponse.json(
        { error: "certificateType must be 'dot' or 'mc'" },
        { status: 400 }
      );
    }

    const result = await getDOTMCCertificateUploadUrl(
      session.user.id,
      certificateType,
      fileName,
      mimeType
    );

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error generating DOT/MC certificate upload URL:", error);
    return NextResponse.json(
      { error: "Failed to generate upload URL" },
      { status: 500 }
    );
  }
}
