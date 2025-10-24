import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getPresignedUploadUrl } from "@/lib/file-service";
import { FolderType, getFolderOptions } from "@/lib/s3";

// POST /api/files - Get presigned URL for file upload
export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { fileName, mimeType, folder, customPath } = body;

    if (!fileName || !mimeType || !folder) {
      return NextResponse.json(
        { error: "fileName, mimeType, and folder are required" },
        { status: 400 }
      );
    }

    // Validate folder type
    const validFolders = Object.keys(getFolderOptions().reduce((acc, opt) => {
      acc[opt.value] = true;
      return acc;
    }, {} as Record<string, boolean>));

    if (!validFolders.includes(folder)) {
      return NextResponse.json(
        { error: "Invalid folder type" },
        { status: 400 }
      );
    }

    const result = await getPresignedUploadUrl(
      session.user.id,
      fileName,
      mimeType,
      folder as FolderType,
      customPath
    );

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error generating presigned URL:", error);
    return NextResponse.json(
      { error: "Failed to generate presigned URL" },
      { status: 500 }
    );
  }
}
