import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/db";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Get session for user context
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id: companyId } = await params;

    if (!companyId) {
      return NextResponse.json(
        { error: "Company ID is required" },
        { status: 400 }
      );
    }

    const userCompanyStatus = await prisma.userCompanyStatus.findUnique({
      where: {
        userId_companyId: {
          userId: session.user.id,
          companyId: companyId,
        },
      },
      include: {
        company: {
          select: {
            id: true,
            name: true,
            logoUrl: true,
            contractType: true,
            serviceVertical: true,
            vehicleTypes: true,
            averagePay: true,
            areasServed: true,
            website: true,
            contactEmail: true,
            contactPhone: true,
            description: true,
            insuranceRequirements: true,
            licenseRequirements: true,
            certificationsRequired: true,
            workflowStatus: true,
            yearEstablished: true,
            companySize: true,
            headquarters: true,
            businessModel: true,
            companyMission: true,
            targetCustomers: true,
            companyCulture: true,
            videoUrl: true,
          },
        },
      },
    });

    if (!userCompanyStatus) {
      return NextResponse.json(
        { error: "User company status not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(userCompanyStatus);
  } catch (error) {
    console.error("Error fetching user company status:", error);
    return NextResponse.json(
      { error: "Failed to fetch user company status" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Get session for user context
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id: companyId } = await params;
    const body = await request.json();
    const { status, notes } = body;

    if (!companyId) {
      return NextResponse.json(
        { error: "Company ID is required" },
        { status: 400 }
      );
    }

    // Validate status if provided
    if (status) {
      const validStatuses = ["Researching", "Applied", "Wait List", "Active", "Other"];
      if (!validStatuses.includes(status)) {
        return NextResponse.json(
          { error: `Invalid status. Must be one of: ${validStatuses.join(", ")}` },
          { status: 400 }
        );
      }
    }

    // Check if user company status exists
    const existingStatus = await prisma.userCompanyStatus.findUnique({
      where: {
        userId_companyId: {
          userId: session.user.id,
          companyId: companyId,
        },
      },
    });

    if (!existingStatus) {
      return NextResponse.json(
        { error: "User company status not found" },
        { status: 404 }
      );
    }

    // Update user company status
    const updatedStatus = await prisma.userCompanyStatus.update({
      where: {
        userId_companyId: {
          userId: session.user.id,
          companyId: companyId,
        },
      },
      data: {
        ...(status && { status }),
        ...(notes !== undefined && { notes }),
        updatedAt: new Date(),
      },
      include: {
        company: {
          select: {
            id: true,
            name: true,
            logoUrl: true,
            contractType: true,
            serviceVertical: true,
            vehicleTypes: true,
            averagePay: true,
            areasServed: true,
            website: true,
            contactEmail: true,
            contactPhone: true,
          },
        },
      },
    });

    return NextResponse.json(updatedStatus);
  } catch (error) {
    console.error("Error updating user company status:", error);
    return NextResponse.json(
      { error: "Failed to update user company status" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Get session for user context
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id: companyId } = await params;

    if (!companyId) {
      return NextResponse.json(
        { error: "Company ID is required" },
        { status: 400 }
      );
    }

    // Check if user company status exists
    const existingStatus = await prisma.userCompanyStatus.findUnique({
      where: {
        userId_companyId: {
          userId: session.user.id,
          companyId: companyId,
        },
      },
    });

    if (!existingStatus) {
      return NextResponse.json(
        { error: "User company status not found" },
        { status: 404 }
      );
    }

    // Delete user company status
    await prisma.userCompanyStatus.delete({
      where: {
        userId_companyId: {
          userId: session.user.id,
          companyId: companyId,
        },
      },
    });

    return NextResponse.json({ message: "User company status deleted successfully" });
  } catch (error) {
    console.error("Error deleting user company status:", error);
    return NextResponse.json(
      { error: "Failed to delete user company status" },
      { status: 500 }
    );
  }
}
