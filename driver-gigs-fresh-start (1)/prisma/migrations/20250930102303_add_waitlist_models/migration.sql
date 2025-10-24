-- CreateEnum
CREATE TYPE "public"."WaitlistSource" AS ENUM ('HOMEPAGE', 'LANDING_PAGE', 'BLOG', 'SOCIAL_MEDIA', 'REFERRAL', 'ADVERTISEMENT', 'OTHER');

-- CreateEnum
CREATE TYPE "public"."WaitlistStatus" AS ENUM ('PENDING', 'APPROVED', 'NOTIFIED', 'CONVERTED', 'DECLINED');

-- CreateEnum
CREATE TYPE "public"."ContactRequestType" AS ENUM ('GENERAL', 'SALES', 'SUPPORT', 'PARTNERSHIP', 'MEDIA', 'TECHNICAL', 'BILLING', 'OTHER');

-- CreateEnum
CREATE TYPE "public"."ContactPriority" AS ENUM ('LOW', 'NORMAL', 'HIGH', 'URGENT');

-- CreateEnum
CREATE TYPE "public"."ContactStatus" AS ENUM ('NEW', 'IN_PROGRESS', 'WAITING_FOR_RESPONSE', 'RESOLVED', 'CLOSED');

-- CreateTable
CREATE TABLE "public"."waitlist" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "company" TEXT,
    "phone" TEXT,
    "source" "public"."WaitlistSource" NOT NULL DEFAULT 'HOMEPAGE',
    "interests" TEXT[],
    "message" TEXT,
    "status" "public"."WaitlistStatus" NOT NULL DEFAULT 'PENDING',
    "notified" BOOLEAN NOT NULL DEFAULT false,
    "notifiedAt" TIMESTAMP(3),
    "utmSource" TEXT,
    "utmMedium" TEXT,
    "utmCampaign" TEXT,
    "referrer" TEXT,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "waitlist_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."contact_requests" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "company" TEXT,
    "phone" TEXT,
    "subject" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "requestType" "public"."ContactRequestType" NOT NULL DEFAULT 'GENERAL',
    "priority" "public"."ContactPriority" NOT NULL DEFAULT 'NORMAL',
    "status" "public"."ContactStatus" NOT NULL DEFAULT 'NEW',
    "assignedTo" TEXT,
    "respondedAt" TIMESTAMP(3),
    "resolvedAt" TIMESTAMP(3),
    "internalNotes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "contact_requests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."newsletter_subscribers" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "preferences" TEXT[],
    "source" TEXT,
    "confirmedAt" TIMESTAMP(3),
    "subscribedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "newsletter_subscribers_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "waitlist_email_key" ON "public"."waitlist"("email");

-- CreateIndex
CREATE INDEX "waitlist_email_idx" ON "public"."waitlist"("email");

-- CreateIndex
CREATE INDEX "waitlist_status_idx" ON "public"."waitlist"("status");

-- CreateIndex
CREATE INDEX "waitlist_source_idx" ON "public"."waitlist"("source");

-- CreateIndex
CREATE INDEX "waitlist_createdAt_idx" ON "public"."waitlist"("createdAt");

-- CreateIndex
CREATE INDEX "contact_requests_email_idx" ON "public"."contact_requests"("email");

-- CreateIndex
CREATE INDEX "contact_requests_status_idx" ON "public"."contact_requests"("status");

-- CreateIndex
CREATE INDEX "contact_requests_requestType_idx" ON "public"."contact_requests"("requestType");

-- CreateIndex
CREATE INDEX "contact_requests_createdAt_idx" ON "public"."contact_requests"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "newsletter_subscribers_email_key" ON "public"."newsletter_subscribers"("email");

-- CreateIndex
CREATE INDEX "newsletter_subscribers_email_idx" ON "public"."newsletter_subscribers"("email");

-- CreateIndex
CREATE INDEX "newsletter_subscribers_isActive_idx" ON "public"."newsletter_subscribers"("isActive");

-- CreateIndex
CREATE INDEX "newsletter_subscribers_subscribedAt_idx" ON "public"."newsletter_subscribers"("subscribedAt");
