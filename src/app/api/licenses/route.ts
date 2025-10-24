import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { 
  getUserLicenses, 
  upsertLicense, 
  getLicenseUploadUrl
} from "@/lib/license-service";
import { LICENSE_TYPES } from "@/lib/license-client";
import { z } from "zod";

// GET /api/licenses - Get user licenses with upload status
export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const licenses = await getUserLicenses(session.user.id);
    
    // Create a map of existing licenses by type
    const existingLicenses = new Map();
    licenses.forEach(license => {
      existingLicenses.set(license.type, {
        id: license.id,
        licenseNumber: license.licenseNumber,
        issuingAuthority: license.issuingAuthority,
        issueDate: license.issueDate,
        expiryDate: license.expiryDate,
        status: license.status,
        hasFile: !!(license.fileKey && license.fileUrl),
        fileUrl: license.fileUrl,
        uploadedAt: license.updatedAt,
      });
    });

    // Return all license types with their upload status
    const licenseStatus = Object.keys(LICENSE_TYPES).map(type => {
      const existing = existingLicenses.get(type);
      return {
        type,
        name: LICENSE_TYPES[type as keyof typeof LICENSE_TYPES].name,
        description: LICENSE_TYPES[type as keyof typeof LICENSE_TYPES].description,
        isRequired: LICENSE_TYPES[type as keyof typeof LICENSE_TYPES].isRequired,
        isUploaded: !!existing,
        data: existing || null,
      };
    });
    
    return NextResponse.json({ licenses: licenseStatus });
  } catch (error) {
    console.error("Error fetching licenses:", error);
    return NextResponse.json(
      { error: "Failed to fetch licenses" },
      { status: 500 }
    );
  }
}

// POST /api/licenses - Create or update license
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

    if (!type || !(type in LICENSE_TYPES)) {
      return NextResponse.json(
        { error: "Invalid license type" },
        { status: 400 }
      );
    }

    const license = await upsertLicense(session.user.id, type, data);
    return NextResponse.json(license);
  } catch (error) {
    console.error("Error creating/updating license:", error);
    return NextResponse.json(
      { error: "Failed to create/update license" },
      { status: 500 }
    );
  }
}
