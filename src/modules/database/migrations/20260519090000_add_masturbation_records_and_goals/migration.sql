-- CreateEnum
CREATE TYPE "GoalType" AS ENUM ('WEEKLY_COUNT', 'ABSTINENCE');

-- CreateTable
CREATE TABLE "daily_masturbation_records" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "count" INTEGER NOT NULL DEFAULT 1,
    "note" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "daily_masturbation_records_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "masturbation_goals" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" "GoalType" NOT NULL,
    "weeklyTargetCount" INTEGER,
    "abstinenceTargetDays" INTEGER,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3),
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "masturbation_goals_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "daily_masturbation_records_userId_date_key" ON "daily_masturbation_records"("userId", "date");

-- CreateIndex
CREATE INDEX "daily_masturbation_records_userId_date_idx" ON "daily_masturbation_records"("userId", "date");

-- CreateIndex
CREATE INDEX "masturbation_goals_userId_isActive_idx" ON "masturbation_goals"("userId", "isActive");

-- AddForeignKey
ALTER TABLE "daily_masturbation_records" ADD CONSTRAINT "daily_masturbation_records_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "masturbation_goals" ADD CONSTRAINT "masturbation_goals_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
