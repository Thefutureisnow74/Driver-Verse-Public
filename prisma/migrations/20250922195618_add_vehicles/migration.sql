-- CreateTable
CREATE TABLE "public"."vehicles" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "nickname" TEXT NOT NULL,
    "year" INTEGER,
    "make" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "vehicleType" TEXT,
    "color" TEXT,
    "vin" TEXT,
    "licensePlate" TEXT,
    "state" TEXT,
    "mileage" INTEGER,
    "fuelType" TEXT,
    "mpg" DOUBLE PRECISION,
    "ownerNames" TEXT,
    "purchaseLocation" TEXT,
    "financialInfo" JSONB,
    "specifications" JSONB,
    "insuranceInfo" JSONB,
    "vehiclePhotos" JSONB,
    "insuranceDocs" JSONB,
    "registrationDocs" JSONB,
    "warrantyDocs" JSONB,
    "maintenanceDocs" JSONB,
    "otherDocs" JSONB,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "vehicles_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "vehicles_userId_idx" ON "public"."vehicles"("userId");

-- CreateIndex
CREATE INDEX "vehicles_make_idx" ON "public"."vehicles"("make");

-- CreateIndex
CREATE INDEX "vehicles_vehicleType_idx" ON "public"."vehicles"("vehicleType");

-- AddForeignKey
ALTER TABLE "public"."vehicles" ADD CONSTRAINT "vehicles_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
