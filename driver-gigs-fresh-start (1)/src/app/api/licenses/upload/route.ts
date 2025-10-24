import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getLicenseUploadUrl } from "@/lib/license-service";
import { LICENSE_TYPES } from "@/lib/license-client";

// POST /api/licenses/upload - Get presigned URL for license upload
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

    if (!(type in LICENSE_TYPES)) {
      return NextResponse.json(
        { error: "Invalid license type" },
        { status: 400 }
      );
    }

    const result = await getLicenseUploadUrl(
      session.user.id,
      type,
      fileName,
      mimeType
    );

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error generating license upload URL:", error);
    return NextResponse.json(
      { error: "Failed to generate upload URL" },
      { status: 500 }
    );
  }
}
