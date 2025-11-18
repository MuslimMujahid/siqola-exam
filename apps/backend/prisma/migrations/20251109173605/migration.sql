/*
  Warnings:

  - Added the required column `address` to the `institutions` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "institutions" ADD COLUMN     "address" TEXT NOT NULL;
