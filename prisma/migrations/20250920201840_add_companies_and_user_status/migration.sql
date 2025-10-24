-- CreateTable
CREATE TABLE "public"."companies" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "vehicleTypes" TEXT[],
    "averagePay" TEXT,
    "serviceVertical" TEXT[],
    "contractType" TEXT NOT NULL,
    "areasServed" TEXT[],
    "insuranceRequirements" TEXT,
    "licenseRequirements" TEXT,
    "certificationsRequired" TEXT[],
    "website" TEXT,
    "contactEmail" TEXT,
    "contactPhone" TEXT,
    "description" TEXT,
    "logoUrl" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "workflowStatus" TEXT,
    "yearEstablished" TEXT,
    "companySize" TEXT,
    "headquarters" TEXT,
    "businessModel" TEXT,
    "companyMission" TEXT,
    "targetCustomers" TEXT,
    "companyCulture" TEXT,
    "videoUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "companies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."user_company_status" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_company_status_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "companies_name_idx" ON "public"."companies"("name");

-- CreateIndex
CREATE INDEX "companies_contractType_idx" ON "public"."companies"("contractType");

-- CreateIndex
CREATE INDEX "companies_isActive_idx" ON "public"."companies"("isActive");

-- CreateIndex
CREATE INDEX "companies_serviceVertical_idx" ON "public"."companies"("serviceVertical");

-- CreateIndex
CREATE INDEX "companies_vehicleTypes_idx" ON "public"."companies"("vehicleTypes");

-- CreateIndex
CREATE INDEX "companies_areasServed_idx" ON "public"."companies"("areasServed");

-- CreateIndex
CREATE INDEX "companies_createdAt_idx" ON "public"."companies"("createdAt");

-- CreateIndex
CREATE INDEX "user_company_status_userId_idx" ON "public"."user_company_status"("userId");

-- CreateIndex
CREATE INDEX "user_company_status_companyId_idx" ON "public"."user_company_status"("companyId");

-- CreateIndex
CREATE INDEX "user_company_status_status_idx" ON "public"."user_company_status"("status");

-- CreateIndex
CREATE UNIQUE INDEX "user_company_status_userId_companyId_key" ON "public"."user_company_status"("userId", "companyId");

-- AddForeignKey
ALTER TABLE "public"."user_company_status" ADD CONSTRAINT "user_company_status_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."user_company_status" ADD CONSTRAINT "user_company_status_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "public"."companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;
