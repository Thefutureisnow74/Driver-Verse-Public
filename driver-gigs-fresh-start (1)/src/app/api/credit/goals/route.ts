import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/db";
import { CreditGoalType } from "@/generated/prisma";

export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: request.headers });

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const creditGoals = await prisma.creditGoal.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(creditGoals);
  } catch (error) {
    console.error("Error fetching credit goals:", error);
    return NextResponse.json(
      { error: "Failed to fetch credit goals" },
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
      goalType,
      goalName,
      currentValue,
      targetValue,
      targetDate,
      notes,
    } = body;

    // Validate required fields
    if (!goalType || !goalName || !targetValue) {
      return NextResponse.json(
        { error: "Goal type, name, and target value are required" },
        { status: 400 }
      );
    }

    const creditGoal = await prisma.creditGoal.create({
      data: {
        userId: session.user.id,
        goalType: goalType as CreditGoalType,
        goalName,
        currentValue: currentValue ? parseFloat(currentValue) : null,
        targetValue: parseFloat(targetValue),
        targetDate: targetDate ? new Date(targetDate) : null,
        notes,
      },
    });

    return NextResponse.json(creditGoal);
  } catch (error) {
    console.error("Error creating credit goal:", error);
    return NextResponse.json(
      { error: "Failed to create credit goal" },
      { status: 500 }
    );
  }
}
