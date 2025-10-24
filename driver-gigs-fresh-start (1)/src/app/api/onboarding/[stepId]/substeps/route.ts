import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/db";
import { ONBOARDING_STEPS, calculateStepProgress } from "@/data/onboarding-steps";

// GET /api/onboarding/[stepId]/substeps - Get sub-steps for a specific step
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ stepId: string }> }
) {
  try {
    const session = await auth.api.getSession({ headers: request.headers });
    
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { stepId } = await params;

    // Find step definition
    const stepDefinition = ONBOARDING_STEPS.find(step => step.id === stepId);
    if (!stepDefinition) {
      return NextResponse.json({ error: "Step not found" }, { status: 404 });
    }

    // Get or create step progress
    let stepProgress = await prisma.onboardingProgress.findUnique({
      where: {
        userId_stepId: {
          userId: session.user.id,
          stepId: stepId
        }
      }
    });

    if (!stepProgress) {
      stepProgress = await prisma.onboardingProgress.create({
        data: {
          userId: session.user.id,
          stepId: stepId,
          stepOrder: stepDefinition.order,
          isCompleted: false,
          completionPercentage: 0
        }
      });
    }

    // Get sub-step progress
    const subStepProgress = await prisma.onboardingSubStepProgress.findMany({
      where: {
        userId: session.user.id,
        stepProgressId: stepProgress.id
      },
      orderBy: { subStepOrder: 'asc' }
    });

    // Merge with step definition sub-steps
    const subStepsWithProgress = stepDefinition.subSteps.map(subStep => {
      const progress = subStepProgress.find(p => p.subStepId === subStep.id);
      
      return {
        ...subStep,
        isCompleted: progress?.isCompleted || false,
        completedAt: progress?.completedAt || null,
        progressId: progress?.id || null
      };
    });

    return NextResponse.json({
      stepId,
      stepTitle: stepDefinition.title,
      subSteps: subStepsWithProgress,
      stepProgress: {
        isCompleted: stepProgress.isCompleted,
        completionPercentage: stepProgress.completionPercentage
      }
    });

  } catch (error) {
    console.error("Error fetching sub-steps:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
