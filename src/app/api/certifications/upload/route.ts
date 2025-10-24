import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getCertificationUploadUrl } from "@/lib/license-service";
import { CERTIFICATION_TYPES } from "@/lib/license-client";

// POST /api/certifications/upload - Get presigned URL for certification upload
export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { type, fileName, mimeType } = body;

    if (!type || !fileName || !mimeType) {
      return NextResponse.json(
        { error: "type, fileName, and mimeType are required" },
        { status: 400 }
      );
    }

    if (!(type in CERTIFICATION_TYPES)) {
      return NextResponse.json(
        { error: "Invalid certification type" },
        { status: 400 }
      );
    }

    const result = await getCertificationUploadUrl(
      session.user.id,
      type,
      fileName,
      mimeType
    );

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error generating certification upload URL:", error);
    return NextResponse.json(
      { error: "Failed to generate upload URL" },
      { status: 500 }
    );
  }
}
