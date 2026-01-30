/*
  Warnings:

  - You are about to drop the column `duration` on the `Idea` table. All the data in the column will be lost.
  - You are about to drop the column `externalUrl` on the `Idea` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Idea" DROP COLUMN "duration",
DROP COLUMN "externalUrl",
ADD COLUMN     "demoUrl" VARCHAR(2048),
ADD COLUMN     "projectDuration" VARCHAR(50);
