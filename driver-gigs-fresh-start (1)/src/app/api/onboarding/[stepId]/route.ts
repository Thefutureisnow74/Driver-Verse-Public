import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/db";
import { ONBOARDING_STEPS, calculateStepProgress } from "@/data/onboarding-steps";

// GET /api/onboarding/[stepId] - Get specific step progress
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

    // Get user's progress for this step
    const progress = await prisma.onboardingProgress.findUnique({
      where: {
        userId_stepId: {
          userId: session.user.id,
          stepId: stepId
        }
      },
      include: {
        subSteps: {
          orderBy: { subStepOrder: 'asc' }
        }
      }
    });

    // Merge sub-steps with their progress
    const subStepsWithProgress = stepDefinition.subSteps.map(subStep => {
      const subStepProgress = progress?.subSteps.find(sp => sp.subStepId === subStep.id);
      return {
        ...subStep,
        isCompleted: subStepProgress?.isCompleted || false,
        completedAt: subStepProgress?.completedAt || null
      };
    });

    const stepWithProgress = {
      ...stepDefinition,
      isCompleted: progress?.isCompleted || false,
      completionPercentage: progress?.completionPercentage || 0,
      startedAt: progress?.startedAt || null,
      completedAt: progress?.completedAt || null,
      subSteps: subStepsWithProgress
    };

    return NextResponse.json(stepWithProgress);

  } catch (error) {
    console.error("Error fetching step progress:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// PATCH /api/onboarding/[stepId] - Update step progress
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ stepId: string }> }
) {
  try {
    const session = await auth.api.getSession({ headers: request.headers });
    
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { stepId } = await params;
    const body = await request.json();
    const { isCompleted, subStepsProgress } = body;

    // Find step definition
    const stepDefinition = ONBOARDING_STEPS.find(step => step.id === stepId);
    if (!stepDefinition) {
      return NextResponse.json({ error: "Step not found" }, { status: 404 });
    }

    // Calculate completion percentage based on sub-steps
    let completionPercentage = 0;
    if (subStepsProgress && Array.isArray(subStepsProgress)) {
      completionPercentage = calculateStepProgress(subStepsProgress);
    } else if (isCompleted !== undefined) {
      completionPercentage = isCompleted ? 100 : 0;
    }

    // Update or create progress record
    const now = new Date();
    const updateData: any = {
      isCompleted: isCompleted !== undefined ? isCompleted : completionPercentage === 100,
      completionPercentage,
      updatedAt: now
    };

    // Set completion timestamp
    if (updateData.isCompleted && !updateData.completedAt) {
      updateData.completedAt = now;
    } else if (!updateData.isCompleted) {
      updateData.completedAt = null;
    }

    // Set started timestamp if not already set
    if (!updateData.startedAt) {
      updateData.startedAt = now;
    }

    // Include sub-steps progress if provided
    if (subStepsProgress) {
      updateData.subStepsProgress = subStepsProgress;
    }

    const progress = await prisma.onboardingProgress.upsert({
      where: {
        userId_stepId: {
          userId: session.user.id,
          stepId: stepId
        }
      },
      create: {
        userId: session.user.id,
        stepId: stepId,
        stepOrder: stepDefinition.order,
        ...updateData,
        startedAt: now,
        createdAt: now
      },
      update: updateData
    });

    return NextResponse.json(progress);

  } catch (error) {
    console.error("Error updating step progress:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// POST /api/onboarding/[stepId]/toggle - Toggle step completion
export async function POST(
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

    // Get current progress
    const currentProgress = await prisma.onboardingProgress.findUnique({
      where: {
        userId_stepId: {
          userId: session.user.id,
          stepId: stepId
        }
      }
    });

    const currentlyCompleted = currentProgress?.isCompleted || false;
    const newCompletionStatus = !currentlyCompleted;
    const now = new Date();

    // Update progress
    const progress = await prisma.onboardingProgress.upsert({
      where: {
        userId_stepId: {
          userId: session.user.id,
          stepId: stepId
        }
      },
      create: {
        userId: session.user.id,
        stepId: stepId,
        stepOrder: stepDefinition.order,
        isCompleted: newCompletionStatus,
        completionPercentage: newCompletionStatus ? 100 : 0,
        startedAt: now,
        completedAt: newCompletionStatus ? now : null,
        createdAt: now,
        updatedAt: now
      },
      update: {
        isCompleted: newCompletionStatus,
        completionPercentage: newCompletionStatus ? 100 : 0,
        completedAt: newCompletionStatus ? now : null,
        startedAt: currentProgress?.startedAt || now,
        updatedAt: now
      }
    });

    return NextResponse.json({
      ...progress,
      toggled: true,
      previousStatus: currentlyCompleted,
      newStatus: newCompletionStatus
    });

  } catch (error) {
    console.error("Error toggling step completion:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
