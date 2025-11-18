/*
  Warnings:

  - You are about to drop the column `studentId` on the `users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "memberships" ADD COLUMN     "studentId" TEXT;

-- AlterTable
ALTER TABLE "users" DROP COLUMN "studentId";
