import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/db";
import { z } from "zod";

// Validation schema for job preferences
const jobPreferencesSchema = z.object({
  dateOfBirth: z.string().optional(),
  primaryGoal: z.enum([
    "full-time-income",
    "part-time-supplemental", 
    "flexible-schedule",
    "experience-industries"
  ]),
  targetIncome: z.enum([
    "500-1500",
    "1500-3000", 
    "3000-5000",
    "5000-plus"
  ]),
  interestedIndustries: z.array(z.string()).min(1, "Please select at least one industry"),
  availableVehicles: z.array(z.string()).min(1, "Please select at least one vehicle type"),
  travelDistance: z.enum([
    "local",
    "regional",
    "long-distance", 
    "flexible"
  ]),
  additionalInfo: z.string().optional(),
});

export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const jobPreferences = await prisma.jobPreferences.findUnique({
      where: {
        userId: session.user.id,
      },
    });

    return NextResponse.json(jobPreferences);
  } catch (error) {
    console.error("Error fetching job preferences:", error);
    return NextResponse.json(
      { error: "Failed to fetch job preferences" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = jobPreferencesSchema.parse(body);

    // Convert dateOfBirth string to Date if provided
    const dateOfBirth = validatedData.dateOfBirth 
      ? new Date(validatedData.dateOfBirth) 
      : null;

    // Upsert job preferences (create or update)
    const jobPreferences = await prisma.jobPreferences.upsert({
      where: {
        userId: session.user.id,
      },
      update: {
        dateOfBirth,
        primaryGoal: validatedData.primaryGoal,
        targetIncome: validatedData.targetIncome,
        interestedIndustries: validatedData.interestedIndustries,
        availableVehicles: validatedData.availableVehicles,
        travelDistance: validatedData.travelDistance,
        additionalInfo: validatedData.additionalInfo,
        updatedAt: new Date(),
      },
      create: {
        userId: session.user.id,
        dateOfBirth,
        primaryGoal: validatedData.primaryGoal,
        targetIncome: validatedData.targetIncome,
        interestedIndustries: validatedData.interestedIndustries,
        availableVehicles: validatedData.availableVehicles,
        travelDistance: validatedData.travelDistance,
        additionalInfo: validatedData.additionalInfo,
      },
    });

    return NextResponse.json(jobPreferences);
  } catch (error) {
    console.error("Error saving job preferences:", error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error.issues },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Failed to save job preferences" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = jobPreferencesSchema.partial().parse(body);

    // Convert dateOfBirth string to Date if provided
    const dateOfBirth = validatedData.dateOfBirth 
      ? new Date(validatedData.dateOfBirth) 
      : undefined;

    const jobPreferences = await prisma.jobPreferences.update({
      where: {
        userId: session.user.id,
      },
      data: {
        ...validatedData,
        dateOfBirth,
        updatedAt: new Date(),
      },
    });

    return NextResponse.json(jobPreferences);
  } catch (error) {
    console.error("Error updating job preferences:", error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error.issues },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Failed to update job preferences" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await prisma.jobPreferences.delete({
      where: {
        userId: session.user.id,
      },
    });

    return NextResponse.json({ message: "Job preferences deleted successfully" });
  } catch (error) {
    console.error("Error deleting job preferences:", error);
    return NextResponse.json(
      { error: "Failed to delete job preferences" },
      { status: 500 }
    );
  }
}
