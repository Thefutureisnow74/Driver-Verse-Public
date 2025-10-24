import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/db";

/**
 * PUT /api/business/[id]/tabs - Update specific tab data for a business profile
 * Allows updating individual sections without affecting other data
 */
export async function PUT(
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
    const { tabType, data } = body;

    // Validate required fields
    if (!tabType || !data) {
      return NextResponse.json(
        { error: "Tab type and data are required" },
        { status: 400 }
      );
    }

    // Verify the business profile belongs to the user
    const existingProfile = await prisma.businessProfile.findUnique({
      where: { id },
      select: { userId: true },
    });

    if (!existingProfile || existingProfile.userId !== session.user.id) {
      return NextResponse.json(
        { error: "Business profile not found or unauthorized" },
        { status: 404 }
      );
    }

    // Map tab types to database fields
    const tabFieldMap: Record<string, string> = {
      'registered-agent': 'registeredAgentInfo',
      'contact': 'contactInfo',
      'mail-web': 'mailWebInfo',
      'banking-finance': 'bankingFinanceInfo',
      'business-credit': 'businessCreditInfo',
      'social-media': 'socialMediaInfo',
      'business-plan': 'businessPlanInfo',
      'codes-certifications': 'codesCertificationsInfo',
      'tax': 'taxInfo',
    };

    const fieldName = tabFieldMap[tabType];
    if (!fieldName) {
      return NextResponse.json(
        { error: "Invalid tab type" },
        { status: 400 }
      );
    }

    // Update the specific field
    const updateData: any = {};
    updateData[fieldName] = data;

    const updatedProfile = await prisma.businessProfile.update({
      where: { id },
      data: updateData,
      include: {
        documents: {
          where: { isActive: true },
          orderBy: { createdAt: "desc" },
        },
        _count: {
          select: { documents: true },
        },
      },
    });

    return NextResponse.json({
      success: true,
      message: `${tabType} information updated successfully`,
      profile: updatedProfile
    });
  } catch (error) {
    console.error(`Error updating business profile tab data:`, error);
    return NextResponse.json(
      { error: "Failed to update business profile" },
      { status: 500 }
    );
  }
}

/**
 * GET /api/business/[id]/tabs/[tabType] - Get specific tab data
 */
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

    const url = new URL(request.url);
    const tabType = url.searchParams.get('tabType');

    if (!tabType) {
      return NextResponse.json(
        { error: "Tab type is required" },
        { status: 400 }
      );
    }

    // Verify the business profile belongs to the user
    const businessProfile = await prisma.businessProfile.findUnique({
      where: { id },
      select: {
        userId: true,
        registeredAgentInfo: true,
        contactInfo: true,
        mailWebInfo: true,
        bankingFinanceInfo: true,
        businessCreditInfo: true,
        socialMediaInfo: true,
        businessPlanInfo: true,
        codesCertificationsInfo: true,
        taxInfo: true,
      },
    });

    if (!businessProfile || businessProfile.userId !== session.user.id) {
      return NextResponse.json(
        { error: "Business profile not found or unauthorized" },
        { status: 404 }
      );
    }

    // Map tab types to database fields
    const tabFieldMap: Record<string, keyof typeof businessProfile> = {
      'registered-agent': 'registeredAgentInfo',
      'contact': 'contactInfo',
      'mail-web': 'mailWebInfo',
      'banking-finance': 'bankingFinanceInfo',
      'business-credit': 'businessCreditInfo',
      'social-media': 'socialMediaInfo',
      'business-plan': 'businessPlanInfo',
      'codes-certifications': 'codesCertificationsInfo',
      'tax': 'taxInfo',
    };

    const fieldName = tabFieldMap[tabType];
    if (!fieldName) {
      return NextResponse.json(
        { error: "Invalid tab type" },
        { status: 400 }
      );
    }

    const tabData = businessProfile[fieldName];

    return NextResponse.json({
      tabType,
      data: tabData || {},
    });
  } catch (error) {
    console.error("Error fetching business profile tab data:", error);
    return NextResponse.json(
      { error: "Failed to fetch business profile tab data" },
      { status: 500 }
    );
  }
}
