import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/db";

export async function GET(request: NextRequest) {
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

    const { searchParams } = new URL(request.url);
    
    // Pagination
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const offset = (page - 1) * limit;

    // Filters
    const status = searchParams.get("status");
    const companyId = searchParams.get("companyId");
    
    // Sorting
    const sortBy = searchParams.get("sortBy") || "updatedAt";
    const sortOrder = searchParams.get("sortOrder") || "desc";

    // Build where clause
    const where: any = {
      userId: session.user.id,
    };

    if (status) {
      where.status = status;
    }

    if (companyId) {
      where.companyId = companyId;
    }

    // Build orderBy clause
    const orderBy: any = {};
    if (sortBy === "status") {
      orderBy.status = sortOrder;
    } else if (sortBy === "updatedAt") {
      orderBy.updatedAt = sortOrder;
    } else if (sortBy === "createdAt") {
      orderBy.createdAt = sortOrder;
    }

    // Get user company statuses with pagination
    const [userStatuses, totalCount] = await Promise.all([
      prisma.userCompanyStatus.findMany({
        where,
        orderBy,
        skip: offset,
        take: limit,
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
      }),
      prisma.userCompanyStatus.count({ where }),
    ]);

    // Calculate pagination info
    const totalPages = Math.ceil(totalCount / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    return NextResponse.json({
      userStatuses,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages,
        hasNextPage,
        hasPrevPage,
      },
    });
  } catch (error) {
    console.error("Error fetching user company statuses:", error);
    return NextResponse.json(
      { error: "Failed to fetch user company statuses" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
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

    const body = await request.json();
    const { companyId, status, notes } = body;

    // Validate required fields
    if (!companyId || !status) {
      return NextResponse.json(
        { error: "Missing required fields: companyId, status" },
        { status: 400 }
      );
    }

    // Validate status values
    const validStatuses = ["Researching", "Applied", "Wait List", "Active", "Other"];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { error: `Invalid status. Must be one of: ${validStatuses.join(", ")}` },
        { status: 400 }
      );
    }

    // Check if company exists
    const company = await prisma.company.findUnique({
      where: { id: companyId },
    });

    if (!company) {
      return NextResponse.json(
        { error: "Company not found" },
        { status: 404 }
      );
    }

    // Create or update user company status
    const userCompanyStatus = await prisma.userCompanyStatus.upsert({
      where: {
        userId_companyId: {
          userId: session.user.id,
          companyId: companyId,
        },
      },
      update: {
        status,
        notes,
        updatedAt: new Date(),
      },
      create: {
        userId: session.user.id,
        companyId,
        status,
        notes,
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

    return NextResponse.json(userCompanyStatus, { status: 201 });
  } catch (error) {
    console.error("Error creating/updating user company status:", error);
    return NextResponse.json(
      { error: "Failed to create/update user company status" },
      { status: 500 }
    );
  }
}
