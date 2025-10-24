import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { 
  getUserCertifications, 
  upsertCertification, 
  getCertificationUploadUrl
} from "@/lib/license-service";
import { CERTIFICATION_TYPES } from "@/lib/license-client";

// GET /api/certifications - Get user certifications with upload status
export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const certifications = await getUserCertifications(session.user.id);
    
    // Create a map of existing certifications by type
    const existingCertifications = new Map();
    certifications.forEach(cert => {
      existingCertifications.set(cert.type, {
        id: cert.id,
        certificateNumber: cert.certificateNumber,
        issuingAuthority: cert.issuingAuthority,
        issueDate: cert.issueDate,
        expiryDate: cert.expiryDate,
        status: cert.status,
        hasFile: !!(cert.fileKey && cert.fileUrl),
        fileUrl: cert.fileUrl,
        uploadedAt: cert.updatedAt,
        isCustom: cert.isCustom,
      });
    });

    // Return all certification types with their upload status
    const certificationStatus = Object.keys(CERTIFICATION_TYPES).map(type => {
      const existing = existingCertifications.get(type);
      const config = CERTIFICATION_TYPES[type as keyof typeof CERTIFICATION_TYPES];
      return {
        type,
        name: config.name,
        description: config.description,
        category: config.category,
        isRequired: config.isRequired,
        isUploaded: !!existing,
        data: existing || null,
      };
    });
    
    return NextResponse.json({ certifications: certificationStatus });
  } catch (error) {
    console.error("Error fetching certifications:", error);
    return NextResponse.json(
      { error: "Failed to fetch certifications" },
      { status: 500 }
    );
  }
}

// POST /api/certifications - Create or update certification
export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { type, ...data } = body;

    if (!type || !(type in CERTIFICATION_TYPES)) {
      return NextResponse.json(
        { error: "Invalid certification type" },
        { status: 400 }
      );
    }

    const certification = await upsertCertification(session.user.id, type, data);
    return NextResponse.json(certification);
  } catch (error) {
    console.error("Error creating/updating certification:", error);
    return NextResponse.json(
      { error: "Failed to create/update certification" },
      { status: 500 }
    );
  }
}
