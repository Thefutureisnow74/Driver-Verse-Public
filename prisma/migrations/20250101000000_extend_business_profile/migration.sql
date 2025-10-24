-- Add extended business profile fields for comprehensive business management

-- Add JSON columns for structured data storage
ALTER TABLE "public"."business_profiles" ADD COLUMN "registeredAgentInfo" JSONB;
ALTER TABLE "public"."business_profiles" ADD COLUMN "contactInfo" JSONB;
ALTER TABLE "public"."business_profiles" ADD COLUMN "mailWebInfo" JSONB;
ALTER TABLE "public"."business_profiles" ADD COLUMN "bankingFinanceInfo" JSONB;
ALTER TABLE "public"."business_profiles" ADD COLUMN "businessCreditInfo" JSONB;
ALTER TABLE "public"."business_profiles" ADD COLUMN "socialMediaInfo" JSONB;
ALTER TABLE "public"."business_profiles" ADD COLUMN "businessPlanInfo" JSONB;
ALTER TABLE "public"."business_profiles" ADD COLUMN "codesCertificationsInfo" JSONB;
ALTER TABLE "public"."business_profiles" ADD COLUMN "taxInfo" JSONB;

-- Add indexes for JSON fields for better query performance
CREATE INDEX "business_profiles_registeredAgentInfo_idx" ON "public"."business_profiles" USING GIN ("registeredAgentInfo");
CREATE INDEX "business_profiles_contactInfo_idx" ON "public"."business_profiles" USING GIN ("contactInfo");
CREATE INDEX "business_profiles_mailWebInfo_idx" ON "public"."business_profiles" USING GIN ("mailWebInfo");
CREATE INDEX "business_profiles_bankingFinanceInfo_idx" ON "public"."business_profiles" USING GIN ("bankingFinanceInfo");
CREATE INDEX "business_profiles_businessCreditInfo_idx" ON "public"."business_profiles" USING GIN ("businessCreditInfo");
CREATE INDEX "business_profiles_socialMediaInfo_idx" ON "public"."business_profiles" USING GIN ("socialMediaInfo");
CREATE INDEX "business_profiles_businessPlanInfo_idx" ON "public"."business_profiles" USING GIN ("businessPlanInfo");
CREATE INDEX "business_profiles_codesCertificationsInfo_idx" ON "public"."business_profiles" USING GIN ("codesCertificationsInfo");
CREATE INDEX "business_profiles_taxInfo_idx" ON "public"."business_profiles" USING GIN ("taxInfo");
