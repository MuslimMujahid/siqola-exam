/*
  Warnings:

  - You are about to drop the column `phoneNumberInst` on the `pending_registrations` table. All the data in the column will be lost.
  - Made the column `phoneNumber` on table `pending_registrations` required. This step will fail if there are existing NULL values in that column.
  - Made the column `address` on table `pending_registrations` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "pending_registrations" DROP COLUMN "phoneNumberInst",
ALTER COLUMN "phoneNumber" SET NOT NULL,
ALTER COLUMN "address" SET NOT NULL;
