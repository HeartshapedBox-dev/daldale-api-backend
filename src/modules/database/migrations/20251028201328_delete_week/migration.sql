/*
  Warnings:

  - You are about to drop the column `weekStartDate` on the `masturbation_weeks` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "public"."masturbation_weeks_userId_weekStartDate_key";

-- AlterTable
ALTER TABLE "masturbation_weeks" DROP COLUMN "weekStartDate";
