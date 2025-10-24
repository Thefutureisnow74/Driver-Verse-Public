/*
  Warnings:

  - You are about to drop the column `firstName` on the `job_preferences` table. All the data in the column will be lost.
  - You are about to drop the column `lastName` on the `job_preferences` table. All the data in the column will be lost.
  - You are about to drop the column `username` on the `job_preferences` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."job_preferences" DROP COLUMN "firstName",
DROP COLUMN "lastName",
DROP COLUMN "username";
