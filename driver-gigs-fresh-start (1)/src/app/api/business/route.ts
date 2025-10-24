import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/db";
import { BusinessType, BusinessStatus } from "@/generated/prisma";

export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: request.headers });

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const businessProfiles = await prisma.businessProfile.findMany({
      where: { userId: session.user.id },
      include: {
        documents: {
          where: { isActive: true },
          orderBy: { createdAt: "desc" },
        },
        _count: {
          select: { documents: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(businessProfiles);
  } catch (error) {
    console.error("Error fetching business profiles:", error);
    return NextResponse.json(
      { error: "Failed to fetch business profiles" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
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
    } = body;

    // Validate required fields
    if (!companyName || !businessType || !state) {
      return NextResponse.json(
        { error: "Company name, business type, and state are required" },
        { status: 400 }
      );
    }

    const businessProfile = await prisma.businessProfile.create({
      data: {
        userId: session.user.id,
        companyName,
        businessType: businessType as BusinessType,
        state,
        status: status ? (status as BusinessStatus) : BusinessStatus.ACTIVE,
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
      },
      include: {
        documents: true,
        _count: {
          select: { documents: true },
        },
      },
    });

    return NextResponse.json(businessProfile);
  } catch (error) {
    console.error("Error creating business profile:", error);
    return NextResponse.json(
      { error: "Failed to create business profile" },
      { status: 500 }
    );
  }
}
