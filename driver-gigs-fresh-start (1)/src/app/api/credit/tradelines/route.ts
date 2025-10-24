import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/db";
import { TradelineType, TradelineStatus } from "@/generated/prisma";

export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: request.headers });

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const tradelines = await prisma.creditTradeline.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(tradelines);
  } catch (error) {
    console.error("Error fetching credit tradelines:", error);
    return NextResponse.json(
      { error: "Failed to fetch credit tradelines" },
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

    // Validate required fields
    if (!accountName || !accountType || !creditorName) {
      return NextResponse.json(
        { error: "Account name, type, and creditor name are required" },
        { status: 400 }
      );
    }

    const tradeline = await prisma.creditTradeline.create({
      data: {
        userId: session.user.id,
        accountName,
        accountType: accountType as TradelineType,
        creditorName,
        status: status ? (status as TradelineStatus) : TradelineStatus.ACTIVE,
        creditLimit: creditLimit ? parseFloat(creditLimit) : null,
        currentBalance: currentBalance ? parseFloat(currentBalance) : 0,
        minimumPayment: minimumPayment ? parseFloat(minimumPayment) : null,
        interestRate: interestRate ? parseFloat(interestRate) : null,
        openedDate: openedDate ? new Date(openedDate) : null,
        closedDate: closedDate ? new Date(closedDate) : null,
        notes,
      },
    });

    return NextResponse.json(tradeline);
  } catch (error) {
    console.error("Error creating credit tradeline:", error);
    return NextResponse.json(
      { error: "Failed to create credit tradeline" },
      { status: 500 }
    );
  }
}
