-- CreateEnum
CREATE TYPE "public"."CreditBureau" AS ENUM ('EXPERIAN', 'TRANSUNION', 'EQUIFAX');

-- CreateEnum
CREATE TYPE "public"."CreditGoalType" AS ENUM ('CREDIT_SCORE', 'DEBT_PAYOFF', 'UTILIZATION_REDUCTION');

-- CreateEnum
CREATE TYPE "public"."TradelineType" AS ENUM ('CREDIT_CARD', 'AUTO_LOAN', 'MORTGAGE', 'PERSONAL_LOAN', 'LINE_OF_CREDIT', 'STUDENT_LOAN', 'OTHER');

-- CreateEnum
CREATE TYPE "public"."TradelineStatus" AS ENUM ('ACTIVE', 'CLOSED', 'PAID_OFF');

-- CreateTable
CREATE TABLE "public"."credit_scores" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "bureau" "public"."CreditBureau" NOT NULL,
    "scoreType" TEXT NOT NULL,
    "score" INTEGER,
    "minRange" INTEGER NOT NULL DEFAULT 300,
    "maxRange" INTEGER NOT NULL DEFAULT 850,
    "lastUpdated" TIMESTAMP(3),
    "isTracked" BOOLEAN NOT NULL DEFAULT false,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "credit_scores_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."credit_goals" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "goalType" "public"."CreditGoalType" NOT NULL,
    "goalName" TEXT NOT NULL,
    "currentValue" DOUBLE PRECISION,
    "targetValue" DOUBLE PRECISION NOT NULL,
    "targetDate" TIMESTAMP(3),
    "isCompleted" BOOLEAN NOT NULL DEFAULT false,
    "completedAt" TIMESTAMP(3),
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "credit_goals_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."credit_tradelines" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "accountName" TEXT NOT NULL,
    "accountType" "public"."TradelineType" NOT NULL,
    "creditorName" TEXT NOT NULL,
    "status" "public"."TradelineStatus" NOT NULL DEFAULT 'ACTIVE',
    "creditLimit" DOUBLE PRECISION,
    "currentBalance" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "minimumPayment" DOUBLE PRECISION,
    "interestRate" DOUBLE PRECISION,
    "openedDate" TIMESTAMP(3),
    "closedDate" TIMESTAMP(3),
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "credit_tradelines_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "credit_scores_userId_idx" ON "public"."credit_scores"("userId");

-- CreateIndex
CREATE INDEX "credit_scores_bureau_idx" ON "public"."credit_scores"("bureau");

-- CreateIndex
CREATE UNIQUE INDEX "credit_scores_userId_bureau_key" ON "public"."credit_scores"("userId", "bureau");

-- CreateIndex
CREATE INDEX "credit_goals_userId_idx" ON "public"."credit_goals"("userId");

-- CreateIndex
CREATE INDEX "credit_goals_goalType_idx" ON "public"."credit_goals"("goalType");

-- CreateIndex
CREATE INDEX "credit_goals_isCompleted_idx" ON "public"."credit_goals"("isCompleted");

-- CreateIndex
CREATE INDEX "credit_tradelines_userId_idx" ON "public"."credit_tradelines"("userId");

-- CreateIndex
CREATE INDEX "credit_tradelines_accountType_idx" ON "public"."credit_tradelines"("accountType");

-- CreateIndex
CREATE INDEX "credit_tradelines_status_idx" ON "public"."credit_tradelines"("status");

-- AddForeignKey
ALTER TABLE "public"."credit_scores" ADD CONSTRAINT "credit_scores_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."credit_goals" ADD CONSTRAINT "credit_goals_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."credit_tradelines" ADD CONSTRAINT "credit_tradelines_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
