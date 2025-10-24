/*
  Warnings:

  - You are about to drop the column `subStepsProgress` on the `onboarding_progress` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."onboarding_progress" DROP COLUMN "subStepsProgress";

-- CreateTable
CREATE TABLE "public"."onboarding_substep_progress" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "stepProgressId" TEXT NOT NULL,
    "subStepId" TEXT NOT NULL,
    "subStepOrder" INTEGER NOT NULL,
    "isCompleted" BOOLEAN NOT NULL DEFAULT false,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "isOptional" BOOLEAN NOT NULL DEFAULT false,
    "actionUrl" TEXT,
    "actionLabel" TEXT,
    "completedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "onboarding_substep_progress_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "onboarding_substep_progress_userId_idx" ON "public"."onboarding_substep_progress"("userId");

-- CreateIndex
CREATE INDEX "onboarding_substep_progress_stepProgressId_idx" ON "public"."onboarding_substep_progress"("stepProgressId");

-- CreateIndex
CREATE INDEX "onboarding_substep_progress_subStepId_idx" ON "public"."onboarding_substep_progress"("subStepId");

-- CreateIndex
CREATE INDEX "onboarding_substep_progress_isCompleted_idx" ON "public"."onboarding_substep_progress"("isCompleted");

-- CreateIndex
CREATE INDEX "onboarding_substep_progress_subStepOrder_idx" ON "public"."onboarding_substep_progress"("subStepOrder");

-- CreateIndex
CREATE UNIQUE INDEX "onboarding_substep_progress_userId_stepProgressId_subStepId_key" ON "public"."onboarding_substep_progress"("userId", "stepProgressId", "subStepId");

-- AddForeignKey
ALTER TABLE "public"."onboarding_substep_progress" ADD CONSTRAINT "onboarding_substep_progress_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."onboarding_substep_progress" ADD CONSTRAINT "onboarding_substep_progress_stepProgressId_fkey" FOREIGN KEY ("stepProgressId") REFERENCES "public"."onboarding_progress"("id") ON DELETE CASCADE ON UPDATE CASCADE;
