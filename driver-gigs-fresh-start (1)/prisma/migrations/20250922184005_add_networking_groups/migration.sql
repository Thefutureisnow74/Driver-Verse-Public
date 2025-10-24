-- CreateTable
CREATE TABLE "public"."networking_groups" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "platform" TEXT NOT NULL,
    "url" TEXT,
    "email" TEXT,
    "username" TEXT,
    "joinedDate" TIMESTAMP(3),
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "networking_groups_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "networking_groups_userId_idx" ON "public"."networking_groups"("userId");

-- CreateIndex
CREATE INDEX "networking_groups_platform_idx" ON "public"."networking_groups"("platform");

-- AddForeignKey
ALTER TABLE "public"."networking_groups" ADD CONSTRAINT "networking_groups_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
