import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/db";

// GET /api/networking/[id] - Get a specific networking group
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth.api.getSession({ headers: request.headers });
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const networkingGroup = await prisma.networkingGroup.findUnique({
      where: {
        id: id,
        userId: session.user.id // Ensure user can only access their own groups
      }
    });

    if (!networkingGroup) {
      return NextResponse.json(
        { error: "Networking group not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(networkingGroup);
  } catch (error) {
    console.error("Error fetching networking group:", error);
    return NextResponse.json(
      { error: "Failed to fetch networking group" },
      { status: 500 }
    );
  }
}

// PUT /api/networking/[id] - Update a networking group
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth.api.getSession({ headers: request.headers });
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const { name, platform, url, email, username, joinedDate, notes } = body;

    // Validate required fields
    if (!name || !platform) {
      return NextResponse.json(
        { error: "Name and platform are required" },
        { status: 400 }
      );
    }

    // Check if the group exists and belongs to the user
    const existingGroup = await prisma.networkingGroup.findUnique({
      where: {
        id: id,
        userId: session.user.id
      }
    });

    if (!existingGroup) {
      return NextResponse.json(
        { error: "Networking group not found" },
        { status: 404 }
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

    const updatedGroup = await prisma.networkingGroup.update({
      where: {
        id: id,
        userId: session.user.id
      },
      data: {
        name: name.trim(),
        platform: platform.trim(),
        url: url?.trim() || null,
        email: email?.trim() || null,
        username: username?.trim() || null,
        joinedDate: parsedJoinedDate,
        notes: notes?.trim() || null,
      }
    });

    return NextResponse.json(updatedGroup);
  } catch (error) {
    console.error("Error updating networking group:", error);
    return NextResponse.json(
      { error: "Failed to update networking group" },
      { status: 500 }
    );
  }
}

// DELETE /api/networking/[id] - Delete a networking group
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth.api.getSession({ headers: request.headers });
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    // Check if the group exists and belongs to the user
    const existingGroup = await prisma.networkingGroup.findUnique({
      where: {
        id: id,
        userId: session.user.id
      }
    });

    if (!existingGroup) {
      return NextResponse.json(
        { error: "Networking group not found" },
        { status: 404 }
      );
    }

    await prisma.networkingGroup.delete({
      where: {
        id: id,
        userId: session.user.id
      }
    });

    return NextResponse.json({ message: "Networking group deleted successfully" });
  } catch (error) {
    console.error("Error deleting networking group:", error);
    return NextResponse.json(
      { error: "Failed to delete networking group" },
      { status: 500 }
    );
  }
}
