-- CreateEnum
CREATE TYPE "public"."BusinessType" AS ENUM ('LLC', 'CORPORATION', 'S_CORP', 'C_CORP', 'PARTNERSHIP', 'SOLE_PROPRIETORSHIP', 'NON_PROFIT', 'OTHER');

-- CreateEnum
CREATE TYPE "public"."BusinessStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'DISSOLVED', 'PENDING');

-- CreateEnum
CREATE TYPE "public"."BusinessDocumentType" AS ENUM ('SS4_EIN_LETTER', 'ARTICLES_OF_INCORPORATION', 'OPERATING_AGREEMENT', 'BYLAWS', 'BUSINESS_LICENSE', 'TAX_RETURN', 'FINANCIAL_STATEMENT', 'INSURANCE_POLICY', 'CONTRACT', 'PERMIT', 'CERTIFICATE', 'OTHER');

-- CreateTable
CREATE TABLE "public"."business_profiles" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "companyName" TEXT NOT NULL,
    "businessType" "public"."BusinessType" NOT NULL,
    "state" TEXT NOT NULL,
    "status" "public"."BusinessStatus" NOT NULL DEFAULT 'ACTIVE',
    "formationDate" TIMESTAMP(3),
    "ein" TEXT,
    "phoneNumber" TEXT,
    "email" TEXT,
    "website" TEXT,
    "streetAddress" TEXT,
    "city" TEXT,
    "zipCode" TEXT,
    "description" TEXT,
    "industry" TEXT,
    "employeeCount" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "business_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."business_documents" (
    "id" TEXT NOT NULL,
    "businessId" TEXT NOT NULL,
    "documentName" TEXT NOT NULL,
    "documentType" "public"."BusinessDocumentType" NOT NULL,
    "description" TEXT,
    "fileName" TEXT NOT NULL,
    "fileKey" TEXT NOT NULL,
    "fileUrl" TEXT NOT NULL,
    "fileSize" INTEGER NOT NULL,
    "mimeType" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "business_documents_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "business_profiles_userId_idx" ON "public"."business_profiles"("userId");

-- CreateIndex
CREATE INDEX "business_profiles_status_idx" ON "public"."business_profiles"("status");

-- CreateIndex
CREATE INDEX "business_profiles_businessType_idx" ON "public"."business_profiles"("businessType");

-- CreateIndex
CREATE INDEX "business_documents_businessId_idx" ON "public"."business_documents"("businessId");

-- CreateIndex
CREATE INDEX "business_documents_documentType_idx" ON "public"."business_documents"("documentType");

-- AddForeignKey
ALTER TABLE "public"."business_profiles" ADD CONSTRAINT "business_profiles_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."business_documents" ADD CONSTRAINT "business_documents_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "public"."business_profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;
