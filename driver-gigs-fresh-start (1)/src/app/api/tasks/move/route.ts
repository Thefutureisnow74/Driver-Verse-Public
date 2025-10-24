import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/db";
import { z } from "zod";
import { TaskStatus } from "@/generated/prisma";

const moveTaskSchema = z.object({
  taskId: z.string().min(1, "Task ID is required"),
  newStatus: z.nativeEnum(TaskStatus),
  newPosition: z.number().min(0),
});

// POST /api/tasks/move - Move a task to a new status/position
export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: request.headers });
    
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { taskId, newStatus, newPosition } = moveTaskSchema.parse(body);

    // Verify task ownership through board
    const task = await prisma.task.findFirst({
      where: {
        id: taskId,
        board: {
          userId: session.user.id,
        },
      },
    });

    if (!task) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    const oldStatus = task.status;
    const oldPosition = task.position;

    // Use a transaction to handle the position updates
    await prisma.$transaction(async (tx) => {
      if (oldStatus === newStatus) {
        // Moving within the same column
        if (newPosition > oldPosition) {
          // Moving down - decrease position of tasks between old and new position
          await tx.task.updateMany({
            where: {
              boardId: task.boardId,
              status: newStatus,
              position: {
                gt: oldPosition,
                lte: newPosition,
              },
            },
            data: {
              position: {
                decrement: 1,
              },
            },
          });
        } else if (newPosition < oldPosition) {
          // Moving up - increase position of tasks between new and old position
          await tx.task.updateMany({
            where: {
              boardId: task.boardId,
              status: newStatus,
              position: {
                gte: newPosition,
                lt: oldPosition,
              },
            },
            data: {
              position: {
                increment: 1,
              },
            },
          });
        }
      } else {
        // Moving to a different column
        // First, decrease position of tasks after the old position in the old column
        await tx.task.updateMany({
          where: {
            boardId: task.boardId,
            status: oldStatus,
            position: {
              gt: oldPosition,
            },
          },
          data: {
            position: {
              decrement: 1,
            },
          },
        });

        // Then, increase position of tasks at or after the new position in the new column
        await tx.task.updateMany({
          where: {
            boardId: task.boardId,
            status: newStatus,
            position: {
              gte: newPosition,
            },
          },
          data: {
            position: {
              increment: 1,
            },
          },
        });
      }

      // Finally, update the task itself
      await tx.task.update({
        where: { id: taskId },
        data: {
          status: newStatus,
          position: newPosition,
        },
      });
    });

    // Fetch the updated task
    const updatedTask = await prisma.task.findUnique({
      where: { id: taskId },
    });

    return NextResponse.json(updatedTask);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid input", details: error.issues },
        { status: 400 }
      );
    }

    console.error("Error moving task:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
