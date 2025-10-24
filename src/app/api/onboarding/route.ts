import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/db";
import { ONBOARDING_STEPS, calculateStepProgress } from "@/data/onboarding-steps";

// GET /api/onboarding - Get user's onboarding progress
export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: request.headers });
    
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get user's onboarding progress from database
    const userProgress = await prisma.onboardingProgress.findMany({
      where: { userId: session.user.id },
      include: {
        subSteps: {
          orderBy: { subStepOrder: 'asc' }
        }
      },
      orderBy: { stepOrder: 'asc' }
    });

    // Merge database progress with step definitions
    const stepsWithProgress = ONBOARDING_STEPS.map(step => {
      const progress = userProgress.find(p => p.stepId === step.id);
      
      // Merge sub-steps with their progress
      const subStepsWithProgress = step.subSteps.map(subStep => {
        const subProgress = progress?.subSteps.find(sp => sp.subStepId === subStep.id);
        return {
          ...subStep,
          isCompleted: subProgress?.isCompleted || false,
          completedAt: subProgress?.completedAt || null
        };
      });
      
      return {
        ...step,
        isCompleted: progress?.isCompleted || false,
        completionPercentage: progress?.completionPercentage || 0,
        startedAt: progress?.startedAt || null,
        completedAt: progress?.completedAt || null,
        subSteps: subStepsWithProgress
      };
    });

    // Calculate overall progress
    const totalSteps = stepsWithProgress.length;
    const completedSteps = stepsWithProgress.filter(step => step.isCompleted).length;
    const overallProgress = totalSteps > 0 ? Math.round((completedSteps / totalSteps) * 100) : 0;

    return NextResponse.json({
      steps: stepsWithProgress,
      overallProgress,
      totalSteps,
      completedSteps
    });

  } catch (error) {
    console.error("Error fetching onboarding progress:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// POST /api/onboarding - Initialize or update onboarding progress
export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: request.headers });
    
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Initialize onboarding progress for all steps if not exists
    const existingProgress = await prisma.onboardingProgress.findMany({
      where: { userId: session.user.id }
    });

    const existingStepIds = new Set(existingProgress.map(p => p.stepId));
    const missingSteps = ONBOARDING_STEPS.filter(step => !existingStepIds.has(step.id));

    if (missingSteps.length > 0) {
      await prisma.onboardingProgress.createMany({
        data: missingSteps.map(step => ({
          userId: session.user.id,
          stepId: step.id,
          stepOrder: step.order,
          isCompleted: false,
          completionPercentage: 0,
          subStepsProgress: step.subSteps.length > 0 ? step.subSteps as any : undefined
        }))
      });
    }

    return NextResponse.json({ message: "Onboarding progress initialized" });

  } catch (error) {
    console.error("Error initializing onboarding progress:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
