import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/db";

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

    // Verify the goal belongs to the user
    const goal = await prisma.creditGoal.findUnique({
      where: { id },
      select: { userId: true },
    });

    if (!goal || goal.userId !== session.user.id) {
      return NextResponse.json(
        { error: "Goal not found or unauthorized" },
        { status: 404 }
      );
    }

    await prisma.creditGoal.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting credit goal:", error);
    return NextResponse.json(
      { error: "Failed to delete credit goal" },
      { status: 500 }
    );
  }
}
