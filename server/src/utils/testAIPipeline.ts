// ============================================================
// AI Analysis Pipeline Test Suite
// Tests 6 core scenarios requested:
// 1. Billing complaint
// 2. Technical failure
// 3. Account issue
// 4. Angry customer
// 5. Normal informational request
// 6. Critical issue
// + Response regeneration preserving classification
// + Malformed input / error resilience
// ============================================================

import dotenv from "dotenv";
dotenv.config();

import { createApp } from "../app";
import type { Server } from "http";
import prisma from "../lib/prisma";

const TEST_PORT = 5098;
const BASE_URL = `http://localhost:${TEST_PORT}/api`;

let server: Server;
let passedCount = 0;
let failedCount = 0;

function assert(condition: boolean, testName: string, details?: unknown) {
  if (condition) {
    console.log(`  ✅ PASS: ${testName}`);
    passedCount++;
  } else {
    console.error(`  ❌ FAIL: ${testName}`, details ?? "");
    failedCount++;
  }
}

async function request(path: string, options: RequestInit = {}): Promise<{ status: number; data: any }> {
  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });
  const data = (await res.json()) as any;
  return { status: res.status, data };
}

async function runAIPipelineTests() {
  console.log("\n============================================================");
  console.log("🧠 STARTING AI ANALYSIS PIPELINE TEST SUITE");
  console.log("============================================================\n");

  const app = createApp("http://localhost:5173");
  server = app.listen(TEST_PORT);

  const cleanupIds: string[] = [];

  try {
    // ── Scenario 1: Billing Complaint ───────────────────────────
    console.log("1️⃣ Testing Scenario: Billing Complaint...");
    const billingTicket = await request("/tickets", {
      method: "POST",
      body: JSON.stringify({
        customerName: "Rohan Patel",
        customerEmail: "rohan.patel@example.com",
        subject: "Overcharged $200 on my September monthly invoice",
        content: "I noticed a $200 surcharge on invoice INV-9041 that was never authorized. My monthly contract is fixed at $500, but my credit card was billed $700. Please credit this overcharge back to my account immediately.",
      }),
    });
    const billingId = billingTicket.data.data.id;
    cleanupIds.push(billingId);

    const billingAnalysis = await request(`/tickets/${billingId}/analyze`, { method: "POST" });
    assert(billingAnalysis.status === 200, "Billing analysis returns 200");
    const bData = billingAnalysis.data.data;
    assert(bData.category === "BILLING", `Classified as BILLING (got: ${bData.category})`);
    assert(bData.status === "ANALYZED", "Status updated to ANALYZED");
    assert(typeof bData.summary === "string" && bData.summary.length > 10, "Summary generated");
    assert(bData.draftResponse.includes("Rohan") || bData.draftResponse.includes("billing"), "Draft response addresses customer");
    assert(bData.aiConfidence >= 0.0 && bData.aiConfidence <= 1.0, `Confidence is between 0 and 1 (got: ${bData.aiConfidence})`);

    // ── Scenario 2: Technical Failure ───────────────────────────
    console.log("\n2️⃣ Testing Scenario: Technical Failure...");
    const techTicket = await request("/tickets", {
      method: "POST",
      body: JSON.stringify({
        customerName: "Sarah Jenkins",
        customerEmail: "sarah.j@acme-corp.com",
        subject: "HTTP 500 internal server error on webhook ingestion endpoint",
        content: "Our automated webhook dispatchers started receiving persistent HTTP 500 errors from https://api.supportiq.com/v1/webhooks. Our deployment pipeline is currently blocked because payload deliveries are failing. Error code: ERR_SOCKET_TIMEOUT.",
      }),
    });
    const techId = techTicket.data.data.id;
    cleanupIds.push(techId);

    const techAnalysis = await request(`/tickets/${techId}/analyze`, { method: "POST" });
    assert(techAnalysis.status === 200, "Technical failure analysis returns 200");
    const tData = techAnalysis.data.data;
    assert(tData.category === "TECHNICAL", `Classified as TECHNICAL (got: ${tData.category})`);
    assert(tData.urgency === "HIGH" || tData.urgency === "CRITICAL", `Urgency is HIGH or CRITICAL (got: ${tData.urgency})`);
    assert(tData.tags.includes("technical") || tData.tags.includes("engineering"), "Technical tags extracted");

    // ── Scenario 3: Account Issue ───────────────────────────────
    console.log("\n3️⃣ Testing Scenario: Account Issue...");
    const accountTicket = await request("/tickets", {
      method: "POST",
      body: JSON.stringify({
        customerName: "Michael Chang",
        customerEmail: "mchang@venture.io",
        subject: "Locked out of 2FA after phone upgrade",
        content: "I lost access to my authenticator app after upgrading to a new iPhone yesterday. I cannot log into our team workspace. I have my recovery keys ready if you can guide me through the reset process.",
      }),
    });
    const accountId = accountTicket.data.data.id;
    cleanupIds.push(accountId);

    const accountAnalysis = await request(`/tickets/${accountId}/analyze`, { method: "POST" });
    assert(accountAnalysis.status === 200, "Account issue analysis returns 200");
    const aData = accountAnalysis.data.data;
    assert(aData.category === "ACCOUNT", `Classified as ACCOUNT (got: ${aData.category})`);
    assert(aData.draftResponse.includes("Michael") || aData.draftResponse.includes("account"), "Draft addresses account issue");

    // ── Scenario 4: Angry Customer ──────────────────────────────
    console.log("\n4️⃣ Testing Scenario: Angry Customer...");
    const angryTicket = await request("/tickets", {
      method: "POST",
      body: JSON.stringify({
        customerName: "Victor Vance",
        customerEmail: "vvance@furious.org",
        subject: "Worst service ever — demand full refund or lawsuit",
        content: "This is completely unacceptable! Your software crashed during our quarterly investor presentation. You humiliated my team. This is absolute incompetence and a complete scam! I demand an immediate full refund and cancellation, or our attorneys will take legal action tomorrow morning!",
      }),
    });
    const angryId = angryTicket.data.data.id;
    cleanupIds.push(angryId);

    const angryAnalysis = await request(`/tickets/${angryId}/analyze`, { method: "POST" });
    assert(angryAnalysis.status === 200, "Angry customer analysis returns 200");
    const angData = angryAnalysis.data.data;
    assert(angData.sentiment === "ANGRY", `Detected sentiment is ANGRY (got: ${angData.sentiment})`);
    assert(angData.urgency === "CRITICAL" || angData.urgency === "HIGH", `Urgency elevated for angry escalation (got: ${angData.urgency})`);
    assert(angData.draftResponse.toLowerCase().includes("apologize") || angData.draftResponse.toLowerCase().includes("sincerely"), "Draft contains empathetic apology");

    // ── Scenario 5: Normal Informational Request ─────────────────
    console.log("\n5️⃣ Testing Scenario: Normal Informational Request...");
    const infoTicket = await request("/tickets", {
      method: "POST",
      body: JSON.stringify({
        customerName: "Claire Dupont",
        customerEmail: "claire.dupont@paris.fr",
        subject: "How do I switch the dashboard to Dark Mode?",
        content: "Hello SupportIQ team! I really love your tool so far. I was just wondering if there is an option in user preferences to switch the color theme to dark mode? Thank you for your help!",
      }),
    });
    const infoId = infoTicket.data.data.id;
    cleanupIds.push(infoId);

    const infoAnalysis = await request(`/tickets/${infoId}/analyze`, { method: "POST" });
    assert(infoAnalysis.status === 200, "Informational request analysis returns 200");
    const iData = infoAnalysis.data.data;
    assert(iData.category === "GENERAL" || iData.category === "TECHNICAL", `Category is GENERAL or TECHNICAL (got: ${iData.category})`);
    assert(iData.urgency === "LOW", `Urgency is LOW (got: ${iData.urgency})`);
    assert(iData.sentiment === "HAPPY" || iData.sentiment === "NEUTRAL", `Sentiment is HAPPY or NEUTRAL (got: ${iData.sentiment})`);

    // ── Scenario 6: Critical Issue ──────────────────────────────
    console.log("\n6️⃣ Testing Scenario: Critical Issue...");
    const critTicket = await request("/tickets", {
      method: "POST",
      body: JSON.stringify({
        customerName: "DevOps Lead",
        customerEmail: "ops@global-fintech.com",
        subject: "CRITICAL: Entire European cluster down — production outage",
        content: "Emergency broadcast: our primary EU Kubernetes cluster has lost connection to SupportIQ ingress. Total service outage affecting 150,000 live end users. Immediate failover and engineering incident response required NOW.",
      }),
    });
    const critId = critTicket.data.data.id;
    cleanupIds.push(critId);

    const critAnalysis = await request(`/tickets/${critId}/analyze`, { method: "POST" });
    assert(critAnalysis.status === 200, "Critical issue analysis returns 200");
    const cData = critAnalysis.data.data;
    assert(cData.urgency === "CRITICAL", `Urgency is CRITICAL (got: ${cData.urgency})`);
    assert(cData.category === "TECHNICAL", `Category is TECHNICAL (got: ${cData.category})`);

    // ── Scenario 7: Regenerate Response (Preserving Classification) ──
    console.log("\n7️⃣ Testing Response Regeneration (Preserving Classification)...");
    const prevCategory = bData.category;
    const prevUrgency = bData.urgency;
    const prevSentiment = bData.sentiment;

    const regenRes = await request(`/tickets/${billingId}/regenerate-response`, {
      method: "POST",
      body: JSON.stringify({
        tone: "formal",
        customInstructions: "State that finance will process the credit adjustment within 48 business hours.",
      }),
    });
    assert(regenRes.status === 200, "Regenerate response returns 200");
    const rData = regenRes.data.data;
    assert(rData.category === prevCategory, "Category preserved during draft regeneration");
    assert(rData.urgency === prevUrgency, "Urgency preserved during draft regeneration");
    assert(rData.sentiment === prevSentiment, "Sentiment preserved during draft regeneration");
    assert(typeof rData.draftResponse === "string" && rData.draftResponse.length > 20, "New draft response stored");

    // ── Scenario 8: Error Resilience & Database Protection ──────
    console.log("\n8️⃣ Testing Error Resilience & Empty Content Handling...");
    const badTicket = await prisma.ticket.create({
      data: {
        ticketNumber: `TKT-TEST-BAD-${Date.now()}`,
        customerName: "Ghost",
        customerEmail: "ghost@example.com",
        subject: "No content",
        content: "   ", // invalid empty content
      },
    });
    cleanupIds.push(badTicket.id);

    const badRes = await request(`/tickets/${badTicket.id}/analyze`, { method: "POST" });
    assert(badRes.status === 400, "Empty content returns 400 Bad Request");
    assert(badRes.data.success === false, "Error response success = false");
    // Verify database was NOT corrupted
    const checkDb = await prisma.ticket.findUnique({ where: { id: badTicket.id } });
    assert(checkDb?.status === "NEW", "Database state preserved as NEW without corruption");

  } finally {
    // Clean up created demo test tickets
    for (const id of cleanupIds) {
      await prisma.ticket.delete({ where: { id } }).catch(() => {});
    }
    server.close();
  }

  console.log("\n============================================================");
  console.log(`🏁 AI PIPELINE TEST RESULTS: ${passedCount} PASSED, ${failedCount} FAILED`);
  console.log("============================================================\n");

  if (failedCount > 0) {
    process.exit(1);
  }
}

runAIPipelineTests().catch((err) => {
  console.error("AI Pipeline test runner threw an unhandled error:", err);
  if (server) server.close();
  process.exit(1);
});
