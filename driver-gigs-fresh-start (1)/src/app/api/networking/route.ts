import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/db";

// GET /api/networking - Get all networking groups for the user
export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: request.headers });
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const networkingGroups = await prisma.networkingGroup.findMany({
      where: {
        userId: session.user.id
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json(networkingGroups);
  } catch (error) {
    console.error("Error fetching networking groups:", error);
    return NextResponse.json(
      { error: "Failed to fetch networking groups" },
      { status: 500 }
    );
  }
}

// POST /api/networking - Create a new networking group
export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: request.headers });
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { name, platform, url, email, username, joinedDate, notes } = body;

    // Validate required fields
    if (!name || !platform) {
      return NextResponse.json(
        { error: "Name and platform are required" },
        { status: 400 }
      );
    }

    // Parse joinedDate if provided
    let parsedJoinedDate = null;
    if (joinedDate) {
      parsedJoinedDate = new Date(joinedDate);
      if (isNaN(parsedJoinedDate.getTime())) {
        return NextResponse.json(
          { error: "Invalid joined date format" },
          { status: 400 }
        );
      }
    }

    const networkingGroup = await prisma.networkingGroup.create({
      data: {
        userId: session.user.id,
        name: name.trim(),
        platform: platform.trim(),
        url: url?.trim() || null,
        email: email?.trim() || null,
        username: username?.trim() || null,
        joinedDate: parsedJoinedDate,
        notes: notes?.trim() || null,
      }
    });

    return NextResponse.json(networkingGroup, { status: 201 });
  } catch (error) {
    console.error("Error creating networking group:", error);
    return NextResponse.json(
      { error: "Failed to create networking group" },
      { status: 500 }
    );
  }
}
