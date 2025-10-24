import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/db";
import { ONBOARDING_STEPS, calculateStepProgress } from "@/data/onboarding-steps";

// POST /api/onboarding/[stepId]/substeps/[subStepId]/toggle - Toggle sub-step completion
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ stepId: string; subStepId: string }> }
) {
  try {
    const session = await auth.api.getSession({ headers: request.headers });
    
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { stepId, subStepId } = await params;

    // Find step and sub-step definitions
    const stepDefinition = ONBOARDING_STEPS.find(step => step.id === stepId);
    if (!stepDefinition) {
      return NextResponse.json({ error: "Step not found" }, { status: 404 });
    }

    const subStepDefinition = stepDefinition.subSteps.find(subStep => subStep.id === subStepId);
    if (!subStepDefinition) {
      return NextResponse.json({ error: "Sub-step not found" }, { status: 404 });
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

    // Get current sub-step progress
    const currentSubStepProgress = await prisma.onboardingSubStepProgress.findUnique({
      where: {
        userId_stepProgressId_subStepId: {
          userId: session.user.id,
          stepProgressId: stepProgress.id,
          subStepId: subStepId
        }
      }
    });

    const currentlyCompleted = currentSubStepProgress?.isCompleted || false;
    const newCompletionStatus = !currentlyCompleted;
    const now = new Date();

    // Update or create sub-step progress
    const subStepProgress = await prisma.onboardingSubStepProgress.upsert({
      where: {
        userId_stepProgressId_subStepId: {
          userId: session.user.id,
          stepProgressId: stepProgress.id,
          subStepId: subStepId
        }
      },
      create: {
        userId: session.user.id,
        stepProgressId: stepProgress.id,
        subStepId: subStepId,
        subStepOrder: subStepDefinition.order,
        title: subStepDefinition.title,
        description: subStepDefinition.description,
        isOptional: subStepDefinition.isOptional || false,
        isCompleted: newCompletionStatus,
        completedAt: newCompletionStatus ? now : null,
        actionUrl: subStepDefinition.actionUrl,
        actionLabel: subStepDefinition.actionLabel
      },
      update: {
        isCompleted: newCompletionStatus,
        completedAt: newCompletionStatus ? now : null,
        title: subStepDefinition.title,
        description: subStepDefinition.description,
        isOptional: subStepDefinition.isOptional || false,
        actionUrl: subStepDefinition.actionUrl,
        actionLabel: subStepDefinition.actionLabel
      }
    });

    // Recalculate step progress
    const allSubStepProgress = await prisma.onboardingSubStepProgress.findMany({
      where: {
        userId: session.user.id,
        stepProgressId: stepProgress.id
      }
    });

    // Calculate completion percentage based on sub-steps
    const requiredSubSteps = stepDefinition.subSteps.filter(s => !s.isOptional);
    const optionalSubSteps = stepDefinition.subSteps.filter(s => s.isOptional);
    
    const completedRequired = allSubStepProgress.filter(p => 
      p.isCompleted && requiredSubSteps.some(s => s.id === p.subStepId)
    ).length;
    
    const completedOptional = allSubStepProgress.filter(p => 
      p.isCompleted && optionalSubSteps.some(s => s.id === p.subStepId)
    ).length;

    // Required steps count for 80%, optional for remaining 20%
    const requiredWeight = 0.8;
    const optionalWeight = 0.2;
    
    const requiredProgress = requiredSubSteps.length > 0 ? 
      (completedRequired / requiredSubSteps.length) * requiredWeight : requiredWeight;
    
    const optionalProgress = optionalSubSteps.length > 0 ? 
      (completedOptional / optionalSubSteps.length) * optionalWeight : optionalWeight;
    
    const totalProgress = Math.round((requiredProgress + optionalProgress) * 100);
    const isStepCompleted = completedRequired === requiredSubSteps.length;

    // Update step progress
    await prisma.onboardingProgress.update({
      where: { id: stepProgress.id },
      data: {
        completionPercentage: totalProgress,
        isCompleted: isStepCompleted,
        completedAt: isStepCompleted && !stepProgress.completedAt ? now : 
                    !isStepCompleted ? null : stepProgress.completedAt,
        startedAt: stepProgress.startedAt || now
      }
    });

    return NextResponse.json({
      subStepProgress,
      stepProgress: {
        completionPercentage: totalProgress,
        isCompleted: isStepCompleted
      },
      toggled: true,
      previousStatus: currentlyCompleted,
      newStatus: newCompletionStatus
    });

  } catch (error) {
    console.error("Error toggling sub-step completion:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
