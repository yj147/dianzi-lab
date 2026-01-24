-- CreateTable
CREATE TABLE "Assessment" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "targetUser" SMALLINT NOT NULL,
    "channel" SMALLINT NOT NULL,
    "market" SMALLINT NOT NULL,
    "tech" SMALLINT NOT NULL,
    "budget" SMALLINT NOT NULL,
    "businessModel" SMALLINT NOT NULL,
    "team" SMALLINT NOT NULL,
    "risk" SMALLINT NOT NULL,
    "traffic" SMALLINT NOT NULL,
    "finalScore" SMALLINT NOT NULL,
    "feedback" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ideaId" TEXT,

    CONSTRAINT "Assessment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Assessment_ideaId_key" ON "Assessment"("ideaId");

-- CreateIndex
CREATE INDEX "Assessment_userId_idx" ON "Assessment"("userId");

-- AddForeignKey
ALTER TABLE "Assessment" ADD CONSTRAINT "Assessment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Assessment" ADD CONSTRAINT "Assessment_ideaId_fkey" FOREIGN KEY ("ideaId") REFERENCES "Idea"("id") ON DELETE SET NULL ON UPDATE CASCADE;
