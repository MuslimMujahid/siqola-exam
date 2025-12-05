/*
  Warnings:

  - You are about to drop the column `tags` on the `exams` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "exams" DROP COLUMN "tags";

-- CreateTable
CREATE TABLE "tags" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "institutionId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tags_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "exam_tags" (
    "id" TEXT NOT NULL,
    "examId" TEXT NOT NULL,
    "tagId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "exam_tags_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "tags_name_institutionId_key" ON "tags"("name", "institutionId");

-- CreateIndex
CREATE UNIQUE INDEX "exam_tags_examId_tagId_key" ON "exam_tags"("examId", "tagId");

-- AddForeignKey
ALTER TABLE "tags" ADD CONSTRAINT "tags_institutionId_fkey" FOREIGN KEY ("institutionId") REFERENCES "institutions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "exam_tags" ADD CONSTRAINT "exam_tags_examId_fkey" FOREIGN KEY ("examId") REFERENCES "exams"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "exam_tags" ADD CONSTRAINT "exam_tags_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "tags"("id") ON DELETE CASCADE ON UPDATE CASCADE;
