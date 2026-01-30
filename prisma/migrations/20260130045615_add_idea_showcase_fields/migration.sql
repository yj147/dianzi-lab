-- AlterTable
ALTER TABLE "Idea" ADD COLUMN     "duration" TEXT,
ADD COLUMN     "externalUrl" TEXT,
ADD COLUMN     "screenshots" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "techStack" TEXT[] DEFAULT ARRAY[]::TEXT[];
