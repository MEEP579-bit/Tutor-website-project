-- AlterTable
ALTER TABLE "TutorProfile" ADD COLUMN     "classGroups" TEXT[] DEFAULT ARRAY[]::TEXT[];

-- AlterTable
ALTER TABLE "TutoringRequest" ADD COLUMN     "classGroup" TEXT;
