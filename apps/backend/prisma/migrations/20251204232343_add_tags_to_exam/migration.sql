-- AlterTable
ALTER TABLE "exams" ADD COLUMN     "tags" TEXT[] DEFAULT ARRAY[]::TEXT[];
