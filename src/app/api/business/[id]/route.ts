import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/db";
import { BusinessType, BusinessStatus } from "@/generated/prisma";

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

    const businessProfile = await prisma.businessProfile.findUnique({
      where: { id },
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

    if (!businessProfile || businessProfile.userId !== session.user.id) {
      return NextResponse.json(
        { error: "Business profile not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(businessProfile);
  } catch (error) {
    console.error("Error fetching business profile:", error);
    return NextResponse.json(
      { error: "Failed to fetch business profile" },
      { status: 500 }
    );
  }
}

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
    const {
      companyName,
      businessType,
      state,
      status,
      formationDate,
      ein,
      phoneNumber,
      email,
      website,
      streetAddress,
      city,
      zipCode,
      description,
      industry,
      employeeCount,
      // Extended information
      registeredAgentInfo,
      contactInfo,
      mailWebInfo,
      bankingFinanceInfo,
      businessCreditInfo,
      socialMediaInfo,
      businessPlanInfo,
      codesCertificationsInfo,
      taxInfo,
    } = body;

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

    const updatedProfile = await prisma.businessProfile.update({
      where: { id },
      data: {
        companyName,
        businessType: businessType as BusinessType,
        state,
        status: status as BusinessStatus,
        formationDate: formationDate ? new Date(formationDate) : null,
        ein,
        phoneNumber,
        email,
        website,
        streetAddress,
        city,
        zipCode,
        description,
        industry,
        employeeCount,
        // Extended information
        ...(registeredAgentInfo !== undefined && { registeredAgentInfo }),
        ...(contactInfo !== undefined && { contactInfo }),
        ...(mailWebInfo !== undefined && { mailWebInfo }),
        ...(bankingFinanceInfo !== undefined && { bankingFinanceInfo }),
        ...(businessCreditInfo !== undefined && { businessCreditInfo }),
        ...(socialMediaInfo !== undefined && { socialMediaInfo }),
        ...(businessPlanInfo !== undefined && { businessPlanInfo }),
        ...(codesCertificationsInfo !== undefined && { codesCertificationsInfo }),
        ...(taxInfo !== undefined && { taxInfo }),
      },
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

    return NextResponse.json(updatedProfile);
  } catch (error) {
    console.error("Error updating business profile:", error);
    return NextResponse.json(
      { error: "Failed to update business profile" },
      { status: 500 }
    );
  }
}

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

    await prisma.businessProfile.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting business profile:", error);
    return NextResponse.json(
      { error: "Failed to delete business profile" },
      { status: 500 }
    );
  }
}
