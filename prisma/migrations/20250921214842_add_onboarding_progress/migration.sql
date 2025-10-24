-- CreateTable
CREATE TABLE "public"."onboarding_progress" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "stepId" TEXT NOT NULL,
    "stepOrder" INTEGER NOT NULL,
    "isCompleted" BOOLEAN NOT NULL DEFAULT false,
    "completionPercentage" INTEGER NOT NULL DEFAULT 0,
    "subStepsProgress" JSONB,
    "startedAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "onboarding_progress_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "onboarding_progress_userId_idx" ON "public"."onboarding_progress"("userId");

-- CreateIndex
CREATE INDEX "onboarding_progress_stepId_idx" ON "public"."onboarding_progress"("stepId");

-- CreateIndex
CREATE INDEX "onboarding_progress_isCompleted_idx" ON "public"."onboarding_progress"("isCompleted");

-- CreateIndex
CREATE INDEX "onboarding_progress_stepOrder_idx" ON "public"."onboarding_progress"("stepOrder");

-- CreateIndex
CREATE UNIQUE INDEX "onboarding_progress_userId_stepId_key" ON "public"."onboarding_progress"("userId", "stepId");

-- AddForeignKey
ALTER TABLE "public"."onboarding_progress" ADD CONSTRAINT "onboarding_progress_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
