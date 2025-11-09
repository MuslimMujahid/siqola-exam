-- Combine firstName and lastName into fullName
ALTER TABLE "users" ADD COLUMN "fullName" TEXT;

-- Update existing data by concatenating firstName and lastName
UPDATE "users" SET "fullName" = "firstName" || ' ' || "lastName";

-- Make fullName NOT NULL
ALTER TABLE "users" ALTER COLUMN "fullName" SET NOT NULL;

-- Drop old columns
ALTER TABLE "users" DROP COLUMN "firstName";
ALTER TABLE "users" DROP COLUMN "lastName";