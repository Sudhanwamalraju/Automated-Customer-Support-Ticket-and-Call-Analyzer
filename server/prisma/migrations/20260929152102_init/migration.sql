-- CreateEnum
CREATE TYPE "Source" AS ENUM ('TICKET', 'CALL');

-- CreateEnum
CREATE TYPE "Status" AS ENUM ('NEW', 'ANALYZED', 'IN_PROGRESS', 'RESOLVED');

-- CreateEnum
CREATE TYPE "Category" AS ENUM ('BILLING', 'TECHNICAL', 'ACCOUNT', 'GENERAL', 'OTHER');

-- CreateEnum
CREATE TYPE "Urgency" AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL');

-- CreateEnum
CREATE TYPE "Sentiment" AS ENUM ('ANGRY', 'FRUSTRATED', 'NEUTRAL', 'HAPPY');

-- CreateTable
CREATE TABLE "Ticket" (
    "id" TEXT NOT NULL,
    "ticketNumber" TEXT NOT NULL,
    "customerName" TEXT NOT NULL,
    "customerEmail" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "source" "Source" NOT NULL DEFAULT 'TICKET',
    "status" "Status" NOT NULL DEFAULT 'NEW',
    "category" "Category" NOT NULL DEFAULT 'GENERAL',
    "urgency" "Urgency" NOT NULL DEFAULT 'MEDIUM',
    "sentiment" "Sentiment",
    "summary" TEXT,
    "draftResponse" TEXT,
    "aiConfidence" DOUBLE PRECISION,
    "tags" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Ticket_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CallTranscript" (
    "id" TEXT NOT NULL,
    "ticketId" TEXT NOT NULL,
    "rawText" TEXT NOT NULL,
    "duration" INTEGER,
    "speakerCount" INTEGER,
    "agentName" TEXT,
    "keywords" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CallTranscript_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Ticket_ticketNumber_key" ON "Ticket"("ticketNumber");

-- CreateIndex
CREATE INDEX "Ticket_status_idx" ON "Ticket"("status");

-- CreateIndex
CREATE INDEX "Ticket_urgency_idx" ON "Ticket"("urgency");

-- CreateIndex
CREATE INDEX "Ticket_category_idx" ON "Ticket"("category");

-- CreateIndex
CREATE INDEX "Ticket_sentiment_idx" ON "Ticket"("sentiment");

-- CreateIndex
CREATE INDEX "Ticket_createdAt_idx" ON "Ticket"("createdAt");

-- CreateIndex
CREATE INDEX "Ticket_customerEmail_idx" ON "Ticket"("customerEmail");

-- CreateIndex
CREATE INDEX "Ticket_source_idx" ON "Ticket"("source");

-- CreateIndex
CREATE INDEX "Ticket_status_urgency_idx" ON "Ticket"("status", "urgency");

-- CreateIndex
CREATE INDEX "Ticket_category_sentiment_idx" ON "Ticket"("category", "sentiment");

-- CreateIndex
CREATE UNIQUE INDEX "CallTranscript_ticketId_key" ON "CallTranscript"("ticketId");

-- CreateIndex
CREATE INDEX "CallTranscript_ticketId_idx" ON "CallTranscript"("ticketId");

-- AddForeignKey
ALTER TABLE "CallTranscript" ADD CONSTRAINT "CallTranscript_ticketId_fkey" FOREIGN KEY ("ticketId") REFERENCES "Ticket"("id") ON DELETE CASCADE ON UPDATE CASCADE;
