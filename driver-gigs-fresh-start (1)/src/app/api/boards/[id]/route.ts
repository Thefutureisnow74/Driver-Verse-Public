import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/db";
import { z } from "zod";

const updateBoardSchema = z.object({
  name: z.string().min(1, "Board name is required").optional(),
  description: z.string().optional(),
  tags: z.array(z.string()).optional(),
  color: z.string().optional(),
  isArchived: z.boolean().optional(),
});

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

// GET /api/boards/[id] - Get a specific board with tasks
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const session = await auth.api.getSession({ headers: request.headers });
    
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const board = await prisma.board.findFirst({
      where: {
        id,
        userId: session.user.id,
      },
      include: {
        tasks: {
          orderBy: [
            { status: 'asc' },
            { position: 'asc' },
          ],
        },
      },
    });

    if (!board) {
      return NextResponse.json({ error: "Board not found" }, { status: 404 });
    }

    return NextResponse.json(board);
  } catch (error) {
    console.error("Error fetching board:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// PUT /api/boards/[id] - Update a board
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const session = await auth.api.getSession({ headers: request.headers });
    
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Verify board ownership
    const existingBoard = await prisma.board.findFirst({
      where: {
        id,
        userId: session.user.id,
      },
    });

    if (!existingBoard) {
      return NextResponse.json({ error: "Board not found" }, { status: 404 });
    }

    const body = await request.json();
    const validatedData = updateBoardSchema.parse(body);

    const updatedBoard = await prisma.board.update({
      where: { id },
      data: validatedData,
      include: {
        tasks: {
          orderBy: [
            { status: 'asc' },
            { position: 'asc' },
          ],
        },
      },
    });

    return NextResponse.json(updatedBoard);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid input", details: error.issues },
        { status: 400 }
      );
    }

    console.error("Error updating board:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE /api/boards/[id] - Delete a board (soft delete by archiving)
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const session = await auth.api.getSession({ headers: request.headers });
    
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Verify board ownership
    const existingBoard = await prisma.board.findFirst({
      where: {
        id,
        userId: session.user.id,
      },
    });

    if (!existingBoard) {
      return NextResponse.json({ error: "Board not found" }, { status: 404 });
    }

    // Soft delete by archiving
    await prisma.board.update({
      where: { id },
      data: { isArchived: true },
    });

    return NextResponse.json({ message: "Board archived successfully" });
  } catch (error) {
    console.error("Error archiving board:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
