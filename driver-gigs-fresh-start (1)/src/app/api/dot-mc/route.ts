import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { 
  getUserDOTMCNumbers, 
  upsertDOTMCNumbers, 
  getDOTMCCertificateUploadUrl 
} from "@/lib/license-service";

// GET /api/dot-mc - Get user DOT/MC numbers with upload status
export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const dotMc = await getUserDOTMCNumbers(session.user.id);
    
    // Return DOT/MC status with upload information
    const dotMcStatus = {
      dotNumber: {
        value: dotMc?.dotNumber || '',
        hasFile: !!(dotMc?.dotCertificateKey && dotMc?.dotCertificateUrl),
        fileUrl: dotMc?.dotCertificateUrl,
        uploadedAt: dotMc?.updatedAt,
      },
      mcNumber: {
        value: dotMc?.mcNumber || '',
        hasFile: !!(dotMc?.mcCertificateKey && dotMc?.mcCertificateUrl),
        fileUrl: dotMc?.mcCertificateUrl,
        uploadedAt: dotMc?.updatedAt,
      },
      hasAnyData: !!(dotMc?.dotNumber || dotMc?.mcNumber || dotMc?.dotCertificateKey || dotMc?.mcCertificateKey),
    };
    
    return NextResponse.json(dotMcStatus);
  } catch (error) {
    console.error("Error fetching DOT/MC numbers:", error);
    return NextResponse.json(
      { error: "Failed to fetch DOT/MC numbers" },
      { status: 500 }
    );
  }
}

// POST /api/dot-mc - Create or update DOT/MC numbers
export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const dotMc = await upsertDOTMCNumbers(session.user.id, body);
    return NextResponse.json(dotMc);
  } catch (error) {
    console.error("Error creating/updating DOT/MC numbers:", error);
    return NextResponse.json(
      { error: "Failed to create/update DOT/MC numbers" },
      { status: 500 }
    );
  }
}
