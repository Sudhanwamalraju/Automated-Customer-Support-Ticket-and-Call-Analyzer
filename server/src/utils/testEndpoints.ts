// ============================================================
// Automated Comprehensive API Test Runner
// Tests every endpoint, verifies database operations and error envelopes
// ============================================================

import dotenv from "dotenv";
dotenv.config();

import { createApp } from "../app";
import type { Server } from "http";

const TEST_PORT = 5099;
const BASE_URL = `http://localhost:${TEST_PORT}/api`;

let server: Server;
let createdTicketId: string;
let createdCallId: string;

let passedTests = 0;
let failedTests = 0;

function assert(condition: boolean, testName: string, details?: unknown) {
  if (condition) {
    console.log(`  ✅ PASS: ${testName}`);
    passedTests++;
  } else {
    console.error(`  ❌ FAIL: ${testName}`, details ?? "");
    failedTests++;
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

async function runTests() {
  console.log("\n============================================================");
  console.log("🚀 STARTING AUTOMATED REST API TESTS FOR SUPPORTIQ");
  console.log("============================================================\n");

  const app = createApp("http://localhost:5173");
  server = app.listen(TEST_PORT);

  try {
    // ── 1. HEALTH CHECK ──────────────────────────────────────
    console.log("1️⃣ Testing Health Check Endpoint...");
    const health = await request("/health");
    assert(health.status === 200, "GET /api/health returns 200");
    assert(health.data.status === "ok", "Server status is ok");
    assert(health.data.services?.database?.status === "ok", "Database connection is ok");

    // ── 2. GET TICKETS (PAGINATION, SEARCH, FILTER, SORT) ───
    console.log("\n2️⃣ Testing GET /api/tickets (Query, Filter, Sort)...");
    const ticketsList = await request("/tickets?limit=5&page=1");
    assert(ticketsList.status === 200, "GET /api/tickets returns 200");
    assert(ticketsList.data.success === true, "Response envelope success = true");
    assert(Array.isArray(ticketsList.data.data.data), "Returns array of tickets");
    assert(ticketsList.data.data.total >= 10, "Total seeded tickets >= 10");

    const filtered = await request("/tickets?category=BILLING&urgency=CRITICAL");
    assert(filtered.status === 200, "GET /api/tickets?category=BILLING&urgency=CRITICAL returns 200");
    assert(
      filtered.data.data.data.every((t: any) => t.category === "BILLING" && t.urgency === "CRITICAL"),
      "Filtering correctly isolates category and urgency"
    );

    const sorted = await request("/tickets?sortBy=urgency&sortOrder=desc");
    assert(sorted.status === 200, "GET /api/tickets?sortBy=urgency&sortOrder=desc returns 200");

    const searched = await request("/tickets?search=Priya");
    assert(searched.data.data.data.length >= 1, "Search finds ticket by customer name");

    // ── 3. POST /api/tickets (CREATE TICKET) ─────────────────
    console.log("\n3️⃣ Testing POST /api/tickets (Create Ticket)...");
    const createRes = await request("/tickets", {
      method: "POST",
      body: JSON.stringify({
        customerName: "Elena Rostova",
        customerEmail: "elena.rostova@example.com",
        subject: "Cannot export analytics reports to CSV",
        content: "Every time I click the Export to CSV button on the dashboard, the page spins indefinitely and times out after 60 seconds with an error.",
        category: "TECHNICAL",
        urgency: "HIGH",
      }),
    });
    assert(createRes.status === 201, "POST /api/tickets returns 201 Created");
    assert(createRes.data.success === true, "Create ticket success = true");
    assert(createRes.data.data.ticketNumber.startsWith("TKT-"), "Ticket number format is valid");
    assert(createRes.data.data.status === "NEW", "Newly created ticket has status NEW");
    createdTicketId = createRes.data.data.id;

    // ── 4. GET /api/tickets/:id ──────────────────────────────
    console.log("\n4️⃣ Testing GET /api/tickets/:id (Get Ticket by ID)...");
    const getSingle = await request(`/tickets/${createdTicketId}`);
    assert(getSingle.status === 200, "GET /api/tickets/:id returns 200");
    assert(getSingle.data.data.id === createdTicketId, "Retrieved ticket matches requested ID");
    assert(getSingle.data.data.customerEmail === "elena.rostova@example.com", "Customer email matches");

    // ── 5. PUT /api/tickets/:id (UPDATE TICKET) ─────────────
    console.log("\n5️⃣ Testing PUT /api/tickets/:id (Update Ticket)...");
    const updateRes = await request(`/tickets/${createdTicketId}`, {
      method: "PUT",
      body: JSON.stringify({
        status: "IN_PROGRESS",
        urgency: "CRITICAL",
        tags: ["export", "csv", "timeout"],
      }),
    });
    assert(updateRes.status === 200, "PUT /api/tickets/:id returns 200");
    assert(updateRes.data.data.status === "IN_PROGRESS", "Ticket status updated to IN_PROGRESS");
    assert(updateRes.data.data.urgency === "CRITICAL", "Ticket urgency updated to CRITICAL");
    assert(updateRes.data.data.tags.includes("csv"), "Ticket tags updated");

    // ── 6. POST /api/tickets/:id/analyze (AI ANALYSIS) ───────
    console.log("\n6️⃣ Testing POST /api/tickets/:id/analyze (AI Analysis Pipeline)...");
    const analyzeRes = await request(`/tickets/${createdTicketId}/analyze`, {
      method: "POST",
    });
    assert(analyzeRes.status === 200, "POST /api/tickets/:id/analyze returns 200");
    assert(analyzeRes.data.data.status === "ANALYZED", "Ticket status is set to ANALYZED");
    assert(typeof analyzeRes.data.data.summary === "string" && analyzeRes.data.data.summary.length > 10, "AI generated summary");
    assert(typeof analyzeRes.data.data.draftResponse === "string" && analyzeRes.data.data.draftResponse.length > 20, "AI generated draftResponse");
    assert(analyzeRes.data.data.aiConfidence >= 0.5, "AI confidence score assigned");
    assert(Boolean(analyzeRes.data.data.sentiment), "AI detected sentiment");

    // ── 7. POST /api/tickets/:id/regenerate-response ─────────
    console.log("\n7️⃣ Testing POST /api/tickets/:id/regenerate-response (Draft Regeneration)...");
    const regenRes = await request(`/tickets/${createdTicketId}/regenerate-response`, {
      method: "POST",
      body: JSON.stringify({
        tone: "technical",
        customInstructions: "Mention our engineering patch v2.3 scheduled for release tonight.",
      }),
    });
    assert(regenRes.status === 200, "POST /api/tickets/:id/regenerate-response returns 200");
    assert(typeof regenRes.data.data.draftResponse === "string", "Regenerated new draft response");

    // ── 8. POST /api/calls (CREATE CALL INTERACTION) ─────────
    console.log("\n8️⃣ Testing POST /api/calls (Create Call Interaction)...");
    const callRes = await request("/calls", {
      method: "POST",
      body: JSON.stringify({
        customerName: "Marcus Vance",
        customerEmail: "marcus.vance@omega.com",
        subject: "Emergency: Server down after cloud migration",
        rawText: "Agent (Liam): SupportIQ technical support, Liam speaking. How can I help?\nCaller (Marcus): Liam, our entire production environment is unresponsive after migrating to your EU cluster.\nAgent (Liam): I see. Let me initiate a cluster failover immediately.",
        duration: 240,
        speakerCount: 2,
        agentName: "Liam",
        category: "TECHNICAL",
        urgency: "CRITICAL",
        keywords: ["cloud", "migration", "failover", "downtime"],
      }),
    });
    assert(callRes.status === 201, "POST /api/calls returns 201 Created");
    assert(callRes.data.data.source === "CALL", "Interaction source is CALL");
    assert(Boolean(callRes.data.data.callTranscript), "Call transcript attached to interaction");
    createdCallId = callRes.data.data.id;

    // ── 9. GET /api/calls/:id (GET CALL DETAILS) ─────────────
    console.log("\n9️⃣ Testing GET /api/calls/:id (Get Call Details)...");
    const getCall = await request(`/calls/${createdCallId}`);
    assert(getCall.status === 200, "GET /api/calls/:id returns 200");
    assert(getCall.data.data.callTranscript.agentName === "Liam", "Call transcript agent name matches");
    assert(getCall.data.data.callTranscript.duration === 240, "Call transcript duration matches");

    // ── 10. POST /api/calls/:id/analyze (ANALYZE CALL) ───────
    console.log("\n🔟 Testing POST /api/calls/:id/analyze (Analyze Call Transcript)...");
    const analyzeCallRes = await request(`/calls/${createdCallId}/analyze`, {
      method: "POST",
    });
    assert(analyzeCallRes.status === 200, "POST /api/calls/:id/analyze returns 200");
    assert(analyzeCallRes.data.data.status === "ANALYZED", "Call interaction status set to ANALYZED");
    assert(typeof analyzeCallRes.data.data.summary === "string", "Call summary generated");
    assert(typeof analyzeCallRes.data.data.draftResponse === "string", "Call response draft generated");

    // ── 11. GET /api/dashboard/stats ─────────────────────────
    console.log("\n1️⃣1️⃣ Testing GET /api/dashboard/stats (Dashboard Analytics)...");
    const statsRes = await request("/dashboard/stats");
    assert(statsRes.status === 200, "GET /api/dashboard/stats returns 200");
    const stats = statsRes.data.data;
    assert(typeof stats.totalTickets === "number" && stats.totalTickets > 0, "totalTickets is number > 0");
    assert(typeof stats.newTickets === "number", "newTickets is number");
    assert(typeof stats.analyzedTickets === "number", "analyzedTickets is number");
    assert(typeof stats.criticalTickets === "number", "criticalTickets is number");
    assert(typeof stats.highPriorityTickets === "number", "highPriorityTickets is number");
    assert(typeof stats.categoryDistribution === "object", "categoryDistribution is object");
    assert(typeof stats.sentimentDistribution === "object", "sentimentDistribution is object");
    assert(typeof stats.urgencyDistribution === "object", "urgencyDistribution is object");
    assert(typeof stats.ticketSourceDistribution === "object", "ticketSourceDistribution is object");

    // ── 12. VALIDATION ERROR HANDLING (ZOD) ──────────────────
    console.log("\n1️⃣2️⃣ Testing Validation Error Handling (Zod)...");
    const invalidTicket = await request("/tickets", {
      method: "POST",
      body: JSON.stringify({
        customerName: "A", // too short
        customerEmail: "not-an-email",
        subject: "Hi", // too short
        content: "bad", // too short
      }),
    });
    assert(invalidTicket.status === 400, "Invalid input returns 400 Bad Request");
    assert(invalidTicket.data.success === false, "Error response success = false");
    assert(invalidTicket.data.error.code === "VALIDATION_ERROR", "Error code is VALIDATION_ERROR");

    // ── 13. DELETE /api/tickets/:id ──────────────────────────
    console.log("\n1️⃣3️⃣ Testing DELETE /api/tickets/:id (Delete Ticket)...");
    const deleteRes = await request(`/tickets/${createdTicketId}`, {
      method: "DELETE",
    });
    assert(deleteRes.status === 200, "DELETE /api/tickets/:id returns 200");
    const verifyDeleted = await request(`/tickets/${createdTicketId}`);
    assert(verifyDeleted.status === 404, "Subsequent GET returns 404 Not Found");
    assert(verifyDeleted.data.success === false, "404 response success = false");
    assert(verifyDeleted.data.error.code === "NOT_FOUND", "Error code is NOT_FOUND");

    // Cleanup created call
    await request(`/tickets/${createdCallId}`, { method: "DELETE" });

    // ── 14. 404 ROUTE NOT FOUND ──────────────────────────────
    console.log("\n1️⃣4️⃣ Testing Route Not Found (404)...");
    const notFound = await request("/non-existent-route");
    assert(notFound.status === 404, "Unknown route returns 404");
    assert(notFound.data.error.code === "ROUTE_NOT_FOUND", "Error code is ROUTE_NOT_FOUND");

  } finally {
    server.close();
  }

  console.log("\n============================================================");
  console.log(`🏁 TEST RESULTS: ${passedTests} PASSED, ${failedTests} FAILED`);
  console.log("============================================================\n");

  if (failedTests > 0) {
    process.exit(1);
  }
}

runTests().catch((err) => {
  console.error("Test runner threw error:", err);
  if (server) server.close();
  process.exit(1);
});
