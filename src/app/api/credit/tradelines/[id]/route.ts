import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/db";
import { TradelineType, TradelineStatus } from "@/generated/prisma";

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
      accountName,
      accountType,
      creditorName,
      status,
      creditLimit,
      currentBalance,
      minimumPayment,
      interestRate,
      openedDate,
      closedDate,
      notes,
    } = body;

    // Verify the tradeline belongs to the user
    const existingTradeline = await prisma.creditTradeline.findUnique({
      where: { id },
      select: { userId: true },
    });

    if (!existingTradeline || existingTradeline.userId !== session.user.id) {
      return NextResponse.json(
        { error: "Tradeline not found or unauthorized" },
        { status: 404 }
      );
    }

    const updatedTradeline = await prisma.creditTradeline.update({
      where: { id },
      data: {
        accountName,
        accountType: accountType as TradelineType,
        creditorName,
        status: status as TradelineStatus,
        creditLimit: creditLimit ? parseFloat(creditLimit) : null,
        currentBalance: currentBalance ? parseFloat(currentBalance) : 0,
        minimumPayment: minimumPayment ? parseFloat(minimumPayment) : null,
        interestRate: interestRate ? parseFloat(interestRate) : null,
        openedDate: openedDate ? new Date(openedDate) : null,
        closedDate: closedDate ? new Date(closedDate) : null,
        notes,
      },
    });

    return NextResponse.json(updatedTradeline);
  } catch (error) {
    console.error("Error updating credit tradeline:", error);
    return NextResponse.json(
      { error: "Failed to update credit tradeline" },
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

    // Verify the tradeline belongs to the user
    const tradeline = await prisma.creditTradeline.findUnique({
      where: { id },
      select: { userId: true },
    });

    if (!tradeline || tradeline.userId !== session.user.id) {
      return NextResponse.json(
        { error: "Tradeline not found or unauthorized" },
        { status: 404 }
      );
    }

    await prisma.creditTradeline.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting credit tradeline:", error);
    return NextResponse.json(
      { error: "Failed to delete credit tradeline" },
      { status: 500 }
    );
  }
}
