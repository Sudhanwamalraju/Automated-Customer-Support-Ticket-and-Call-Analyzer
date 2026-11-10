/**
 * Database connectivity test.
 * Run: node node_modules/tsx/dist/cli.mjs src/utils/dbTest.ts
 */

import dotenv from "dotenv";
dotenv.config();

import prisma from "../lib/prisma";

async function testConnection() {
  console.log("🔌 Testing database connection...");

  try {
    // Simple ping — executes a raw SQL SELECT
    await prisma.$queryRaw`SELECT 1`;
    console.log("✅ Database connection successful!\n");

    // Counts
    const ticketCount = await prisma.ticket.count();
    const transcriptCount = await prisma.callTranscript.count();
    console.log(`📊 Database state:`);
    console.log(`   Tickets        : ${ticketCount}`);
    console.log(`   CallTranscripts: ${transcriptCount}`);

    if (ticketCount > 0) {
      // Sample ticket
      const sample = await prisma.ticket.findFirst({
        orderBy: { createdAt: "desc" },
        include: { callTranscript: true },
      });
      console.log(`\n📋 Most recent ticket:`);
      console.log(`   Number   : ${sample!.ticketNumber}`);
      console.log(`   Customer : ${sample!.customerName}`);
      console.log(`   Subject  : ${sample!.subject}`);
      console.log(`   Status   : ${sample!.status}`);
      console.log(`   Urgency  : ${sample!.urgency}`);
      console.log(`   Sentiment: ${sample!.sentiment ?? "not yet analyzed"}`);
      console.log(
        `   Has call : ${sample!.callTranscript !== null ? "YES" : "NO"}`
      );
    }

    // Stats
    const byStatus = await prisma.ticket.groupBy({
      by: ["status"],
      _count: { _all: true },
      orderBy: { status: "asc" },
    });
    console.log(`\n📈 Tickets by status:`);
    byStatus.forEach((s) => console.log(`   ${s.status}: ${s._count._all}`));

    const byUrgency = await prisma.ticket.groupBy({
      by: ["urgency"],
      _count: { _all: true },
    });
    console.log(`\n⚡ Tickets by urgency:`);
    byUrgency.forEach((u) => console.log(`   ${u.urgency}: ${u._count._all}`));
  } catch (err) {
    console.error("❌ Database connection failed:", err);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

testConnection();
