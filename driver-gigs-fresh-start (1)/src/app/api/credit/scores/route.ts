import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/db";
import { CreditBureau } from "@/generated/prisma";

export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: request.headers });

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const creditScores = await prisma.creditScore.findMany({
      where: { userId: session.user.id },
      orderBy: { bureau: "asc" },
    });

    // If no scores exist, create default entries for all bureaus
    if (creditScores.length === 0) {
      const defaultScores = await Promise.all([
        prisma.creditScore.create({
          data: {
            userId: session.user.id,
            bureau: CreditBureau.EXPERIAN,
            scoreType: "FICO Score",
            score: null,
            isTracked: false,
          },
        }),
        prisma.creditScore.create({
          data: {
            userId: session.user.id,
            bureau: CreditBureau.TRANSUNION,
            scoreType: "VantageScore",
            score: null,
            isTracked: false,
          },
        }),
        prisma.creditScore.create({
          data: {
            userId: session.user.id,
            bureau: CreditBureau.EQUIFAX,
            scoreType: "Equifax Score",
            score: null,
            isTracked: false,
          },
        }),
      ]);

      return NextResponse.json(defaultScores);
    }

    return NextResponse.json(creditScores);
  } catch (error) {
    console.error("Error fetching credit scores:", error);
    return NextResponse.json(
      { error: "Failed to fetch credit scores" },
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
    const { bureau, scoreType, score, lastUpdated, isTracked, notes } = body;

    // Validate required fields
    if (!bureau || !scoreType) {
      return NextResponse.json(
        { error: "Bureau and score type are required" },
        { status: 400 }
      );
    }

    const creditScore = await prisma.creditScore.upsert({
      where: {
        userId_bureau: {
          userId: session.user.id,
          bureau: bureau as CreditBureau,
        },
      },
      update: {
        scoreType,
        score: score ? parseInt(score) : null,
        lastUpdated: lastUpdated ? new Date(lastUpdated) : null,
        isTracked: Boolean(isTracked),
        notes,
      },
      create: {
        userId: session.user.id,
        bureau: bureau as CreditBureau,
        scoreType,
        score: score ? parseInt(score) : null,
        lastUpdated: lastUpdated ? new Date(lastUpdated) : null,
        isTracked: Boolean(isTracked),
        notes,
      },
    });

    return NextResponse.json(creditScore);
  } catch (error) {
    console.error("Error creating/updating credit score:", error);
    return NextResponse.json(
      { error: "Failed to save credit score" },
      { status: 500 }
    );
  }
}
