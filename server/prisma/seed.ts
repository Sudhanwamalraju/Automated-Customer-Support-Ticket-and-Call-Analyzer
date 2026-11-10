// ============================================================
// Prisma Seed — Realistic demo data for SupportIQ
// Demonstrates: all categories, all urgency levels, all
// sentiments, TICKET + CALL sources, analyzed + unanalyzed
// ============================================================

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// ─── helpers ─────────────────────────────────────────────────
function ticketNum(n: number) {
  return `TKT-20260929-${String(n).padStart(4, "0")}`;
}

// ─────────────────────────────────────────────────────────────
async function main() {
  console.log("🌱 Seeding database…");

  // Wipe existing seed data (idempotent)
  await prisma.callTranscript.deleteMany();
  await prisma.ticket.deleteMany();

  // ─── 1. BILLING – CRITICAL – ANGRY (ANALYZED) ────────────
  const t1 = await prisma.ticket.create({
    data: {
      ticketNumber: ticketNum(1),
      customerName: "Priya Sharma",
      customerEmail: "priya.sharma@example.com",
      subject: "Charged TWICE for my subscription – demand refund NOW",
      content:
        "I was charged $149 twice this month for the same Pro subscription. " +
        "This is completely unacceptable. My bank statement clearly shows two identical " +
        "charges on the 1st and 3rd of September. I want a full refund of the duplicate " +
        "charge immediately and an explanation of how this happened. If this is not resolved " +
        "in 24 hours I will dispute both charges with my bank and escalate to consumer protection.",
      source: "TICKET",
      status: "ANALYZED",
      category: "BILLING",
      urgency: "CRITICAL",
      sentiment: "ANGRY",
      summary:
        "Customer was double-charged $149 for their Pro subscription. " +
        "Demands immediate refund and explanation within 24 hours, threatening chargeback.",
      draftResponse:
        "Dear Priya,\n\nThank you for reaching out. I sincerely apologize for the double charge — " +
        "this should never happen and I completely understand your frustration.\n\n" +
        "I have already flagged your account for priority review. Our billing team will process " +
        "the $149 refund within 2-3 business days and you will receive an email confirmation shortly.\n\n" +
        "We are investigating the root cause to ensure this does not happen again.\n\n" +
        "Please feel free to reply to this ticket if you have any further concerns.\n\n" +
        "Sincerely,\nSupportIQ Customer Success Team",
      aiConfidence: 0.96,
      tags: ["billing", "double-charge", "refund", "urgent", "chargeback-threat"],
    },
  });

  // ─── 2. TECHNICAL – HIGH – FRUSTRATED (ANALYZED, IN_PROGRESS) ──
  const t2 = await prisma.ticket.create({
    data: {
      ticketNumber: ticketNum(2),
      customerName: "Arjun Mehta",
      customerEmail: "arjun.mehta@techcorp.io",
      subject: "API integration completely broken after v2.1 update",
      content:
        "Since your v2.1 release last Tuesday, our entire CI/CD pipeline has broken. " +
        "We are getting HTTP 422 responses on POST /api/analyze with no meaningful error message. " +
        "The same payload that worked fine on v2.0 is now rejected. " +
        "We have a production deployment scheduled for Friday — if this is not resolved " +
        "we will be forced to rollback and miss our release deadline. " +
        "Our team has already wasted 12 hours debugging this. " +
        "Stack trace attached: UnprocessableEntityError at handlers/analyze.js:248",
      source: "TICKET",
      status: "IN_PROGRESS",
      category: "TECHNICAL",
      urgency: "HIGH",
      sentiment: "FRUSTRATED",
      summary:
        "API POST /api/analyze returns HTTP 422 after v2.1 update. " +
        "Customer has production deployment Friday and has lost 12 dev hours debugging.",
      draftResponse:
        "Hi Arjun,\n\nThank you for the detailed report — I can see why this is critical for your Friday release.\n\n" +
        "Our engineering team has reproduced the issue. In v2.1 we added strict schema validation " +
        "which requires the `version` field in the request body. This was a breaking change " +
        "that was not clearly documented in the release notes — we apologize for that.\n\n" +
        "Quick fix: add `\"version\": \"2.1\"` to your request payload.\n\n" +
        "We are also releasing a patch (v2.1.1) by EOD today with improved error messaging.\n\n" +
        "Best,\nSupportIQ Engineering Support",
      aiConfidence: 0.91,
      tags: ["api", "v2.1", "422-error", "breaking-change", "production-blocker"],
    },
  });

  // ─── 3. ACCOUNT – MEDIUM – FRUSTRATED (ANALYZED) ─────────
  const t3 = await prisma.ticket.create({
    data: {
      ticketNumber: ticketNum(3),
      customerName: "Sandra Okonkwo",
      customerEmail: "sandra.ok@fastmail.net",
      subject: "Cannot log in — says account doesn't exist",
      content:
        "I've been a customer for 2 years and suddenly today when I try to log in " +
        "it says 'No account found for this email address'. " +
        "I haven't changed my email or password. " +
        "I tried the forgot password flow but I don't receive any email. " +
        "I checked my spam folder. Nothing. " +
        "Is my account deleted? I have important project data in there.",
      source: "TICKET",
      status: "ANALYZED",
      category: "ACCOUNT",
      urgency: "MEDIUM",
      sentiment: "FRUSTRATED",
      summary:
        "Existing 2-year customer cannot log in; reset emails not arriving. " +
        "Concerned about data loss. Likely account migration or email deliverability issue.",
      draftResponse:
        "Hi Sandra,\n\nI completely understand how alarming this must be, especially with important project data involved.\n\n" +
        "I've looked into your account and found that it was migrated to our new identity system " +
        "last week. Unfortunately the migration did not correctly carry over your email address.\n\n" +
        "I've manually linked your account. Please try logging in again — if you still can't access it, " +
        "use the forgot password flow and the reset email should now arrive within 2 minutes.\n\n" +
        "Your data is fully intact and safe.\n\n" +
        "Apologies for the disruption,\nSupportIQ Team",
      aiConfidence: 0.88,
      tags: ["login", "account-recovery", "migration", "email-not-received"],
    },
  });

  // ─── 4. BILLING – LOW – NEUTRAL (ANALYZED, RESOLVED) ─────
  await prisma.ticket.create({
    data: {
      ticketNumber: ticketNum(4),
      customerName: "Marcus Webb",
      customerEmail: "mwebb@designhouse.co",
      subject: "Question about invoice format for tax purposes",
      content:
        "Hi, could you please resend invoice #INV-2026-0847 with our company VAT number " +
        "(GB123456789) included? Our accounting department requires it for tax filing. " +
        "No urgency — just whenever you get a chance. Thanks.",
      source: "TICKET",
      status: "RESOLVED",
      category: "BILLING",
      urgency: "LOW",
      sentiment: "NEUTRAL",
      summary:
        "Customer requests reissuance of invoice #INV-2026-0847 with company VAT number included for tax filing.",
      draftResponse:
        "Hi Marcus,\n\nOf course! I've updated invoice #INV-2026-0847 with your VAT number GB123456789 " +
        "and resent it to mwebb@designhouse.co.\n\n" +
        "You should receive it within the next few minutes. Please let us know if you need anything else.\n\n" +
        "Best,\nSupportIQ Billing Team",
      aiConfidence: 0.98,
      tags: ["invoice", "vat", "tax", "accounting"],
    },
  });

  // ─── 5. TECHNICAL – CRITICAL – ANGRY (NEW, UNANALYZED) ───
  await prisma.ticket.create({
    data: {
      ticketNumber: ticketNum(5),
      customerName: "Fatima Al-Rashid",
      customerEmail: "f.alrashid@globalops.ae",
      subject: "URGENT: Data export completely broken — compliance deadline TODAY",
      content:
        "Our compliance team needs the full data export before 5pm today for a regulatory audit. " +
        "When I click 'Export All Data' nothing happens. The button is completely unresponsive. " +
        "I've tried Chrome, Firefox, and Edge. I've tried on two different computers. " +
        "I've cleared cache. Nothing works. " +
        "This is a LEGAL REQUIREMENT. If we cannot provide this data today we face regulatory fines. " +
        "I need someone to call me immediately: +971-50-XXX-XXXX",
      source: "TICKET",
      status: "NEW",
      category: "TECHNICAL",
      urgency: "CRITICAL",
      sentiment: "ANGRY",
      tags: [],
    },
  });

  // ─── 6. GENERAL – LOW – HAPPY (ANALYZED, RESOLVED) ───────
  await prisma.ticket.create({
    data: {
      ticketNumber: ticketNum(6),
      customerName: "Liam O'Brien",
      customerEmail: "liam.obrien@example.ie",
      subject: "Feature suggestion: dark mode for the mobile app",
      content:
        "Hey team! Love the product — been using it for 6 months now. " +
        "Just a small suggestion: would be amazing to have a dark mode option in the mobile app. " +
        "My eyes would thank you! Not urgent at all, just a nice-to-have. " +
        "Keep up the great work!",
      source: "TICKET",
      status: "RESOLVED",
      category: "GENERAL",
      urgency: "LOW",
      sentiment: "HAPPY",
      summary:
        "Customer requests dark mode for mobile app. Positive feedback included. " +
        "Feature request logged for product backlog.",
      draftResponse:
        "Hi Liam,\n\nThank you so much for the kind words and the suggestion!\n\n" +
        "Great news — dark mode for the mobile app is already on our Q4 roadmap. " +
        "We'll notify you as soon as it's available.\n\n" +
        "Thanks again for being such a loyal user!\n\nCheers,\nSupportIQ Product Team",
      aiConfidence: 0.99,
      tags: ["feature-request", "dark-mode", "mobile", "positive-feedback"],
    },
  });

  // ─── 7. ACCOUNT – HIGH – ANGRY (NEW, UNANALYZED) ─────────
  await prisma.ticket.create({
    data: {
      ticketNumber: ticketNum(7),
      customerName: "Chen Wei",
      customerEmail: "chen.wei@innovate-labs.cn",
      subject: "Team member added me as VIEWER instead of ADMIN — can't do anything",
      content:
        "I am the founder of our organization on your platform but somehow " +
        "one of my team members invited me back as a Viewer. Now I can't access any admin settings, " +
        "billing, or user management. The original owner account seems to have been reassigned. " +
        "We have a team of 25 people and I cannot manage anything. " +
        "This needs to be fixed IMMEDIATELY. " +
        "I am the original account owner — you can verify this by the payment method on file.",
      source: "TICKET",
      status: "NEW",
      category: "ACCOUNT",
      urgency: "HIGH",
      sentiment: "ANGRY",
      tags: [],
    },
  });

  // ─── 8. CALL – HIGH – FRUSTRATED (ANALYZED, CALL SOURCE) ─
  const t8 = await prisma.ticket.create({
    data: {
      ticketNumber: ticketNum(8),
      customerName: "Amelia Torres",
      customerEmail: "amelia.t@retailbrand.com",
      subject: "[Call] Integration issue with Shopify data sync",
      content:
        "Transcript from inbound support call. Customer reports Shopify orders are not " +
        "syncing to the dashboard. Last sync was 3 days ago. Customer has 200+ pending orders " +
        "affected. Verified OAuth token is active.",
      source: "CALL",
      status: "ANALYZED",
      category: "TECHNICAL",
      urgency: "HIGH",
      sentiment: "FRUSTRATED",
      summary:
        "Shopify integration not syncing for 3 days. 200+ orders affected. " +
        "OAuth token is valid — likely a webhook failure. Escalated to integrations team.",
      draftResponse:
        "Hi Amelia,\n\nFollowing up on your call earlier today — thank you for your patience.\n\n" +
        "Our integrations team identified that the Shopify webhook endpoint had expired " +
        "due to a platform migration on our side. We've re-registered the webhook and " +
        "triggered a manual backfill of all 200+ orders from the past 3 days.\n\n" +
        "Your dashboard should be fully up to date within the next 30 minutes. " +
        "Please confirm once you can see the orders synced.\n\n" +
        "We're sorry for the disruption to your operations.\n\nBest,\nSupportIQ Integrations Team",
      aiConfidence: 0.93,
      tags: ["shopify", "sync", "webhook", "integration", "call"],
    },
  });

  // Attach call transcript to t8
  await prisma.callTranscript.create({
    data: {
      ticketId: t8.id,
      rawText:
        "[00:00] Agent (Jordan): Thank you for calling SupportIQ, my name is Jordan. How can I help you today?\n" +
        "[00:05] Customer (Amelia): Hi Jordan, I'm really frustrated right now. Our Shopify integration has completely stopped syncing. " +
        "We haven't received any new orders in the dashboard for THREE days. We have over 200 orders just sitting there not showing up.\n" +
        "[00:20] Agent (Jordan): I'm so sorry to hear that, Amelia. I completely understand how critical this is for your business. " +
        "Let me pull up your account right now. Can I confirm your email address?\n" +
        "[00:28] Customer (Amelia): It's amelia.t@retailbrand.com\n" +
        "[00:35] Agent (Jordan): Perfect, I have your account here. I can see the integration was last synced 3 days ago on the 26th. " +
        "Let me check the webhook logs... I can see there are a high number of failed delivery attempts. " +
        "Is the OAuth token still active on your Shopify admin side?\n" +
        "[00:52] Customer (Amelia): Yes, I checked that first. The app is still installed and authorized in Shopify.\n" +
        "[00:58] Agent (Jordan): Got it. This looks like our webhook endpoint may have changed during a recent migration. " +
        "I'm going to escalate this to our integrations team right now as a high priority. " +
        "They'll re-register the webhook and run a backfill of all your pending orders.\n" +
        "[01:10] Customer (Amelia): How long will that take? I need these orders processed today.\n" +
        "[01:15] Agent (Jordan): I completely understand. I'm marking this as high priority. The team will be on it within the hour " +
        "and you should have all your data synced within 30 minutes of them starting. " +
        "I'll send you a follow-up email with a full update.\n" +
        "[01:28] Customer (Amelia): Okay. I really hope so. This is causing real problems for us.\n" +
        "[01:33] Agent (Jordan): Absolutely, and I take full responsibility for getting this resolved for you today. " +
        "Is there anything else I can help with?\n" +
        "[01:40] Customer (Amelia): No, just get that fixed please.\n" +
        "[01:43] Agent (Jordan): Will do. Thank you for your patience, Amelia. Have a good day.\n" +
        "[01:46] Customer (Amelia): Thanks. Bye.",
      duration: 106,
      speakerCount: 2,
      agentName: "Jordan",
      keywords: [
        "shopify",
        "sync",
        "webhook",
        "orders",
        "integration",
        "oauth",
        "backfill",
        "high-priority",
      ],
    },
  });

  // ─── 9. GENERAL – MEDIUM – NEUTRAL (NEW, UNANALYZED) ─────
  await prisma.ticket.create({
    data: {
      ticketNumber: ticketNum(9),
      customerName: "Ravi Patel",
      customerEmail: "ravi.patel@consultfirm.in",
      subject: "Requesting documentation for GDPR data residency compliance",
      content:
        "Hello, I am reviewing our vendor contracts for GDPR compliance. " +
        "Could you please send me: " +
        "1) Your Data Processing Agreement (DPA) " +
        "2) Documentation confirming data residency region for EU customers " +
        "3) Your latest SOC 2 Type II report or equivalent " +
        "Please send to ravi.patel@consultfirm.in within 5 business days. " +
        "This is required for our enterprise procurement process.",
      source: "TICKET",
      status: "NEW",
      category: "GENERAL",
      urgency: "MEDIUM",
      sentiment: "NEUTRAL",
      tags: [],
    },
  });

  // ─── 10. CALL – MEDIUM – NEUTRAL (ANALYZED, CALL SOURCE) ─
  const t10 = await prisma.ticket.create({
    data: {
      ticketNumber: ticketNum(10),
      customerName: "Ingrid Lindqvist",
      customerEmail: "ingrid.l@northerndesign.se",
      subject: "[Call] Onboarding walkthrough request",
      content:
        "Transcript from scheduled onboarding call. New customer (signed up 2 days ago) " +
        "requested a guided walkthrough of the dashboard and report generation features.",
      source: "CALL",
      status: "ANALYZED",
      category: "GENERAL",
      urgency: "MEDIUM",
      sentiment: "NEUTRAL",
      summary:
        "Onboarding call completed. Customer walked through dashboard, " +
        "report generation, and team invites. Expressed satisfaction. No blockers.",
      draftResponse:
        "Hi Ingrid,\n\nWonderful speaking with you today!\n\n" +
        "As discussed, here are the resources I mentioned:\n" +
        "- Getting Started Guide: https://docs.supportiq.io/getting-started\n" +
        "- Report Templates: https://docs.supportiq.io/reports\n" +
        "- Team Management: https://docs.supportiq.io/teams\n\n" +
        "Feel free to reach out anytime. We're here to help!\n\n" +
        "Best,\nSupportIQ Onboarding Team",
      aiConfidence: 0.97,
      tags: ["onboarding", "walkthrough", "new-customer", "call"],
    },
  });

  // Attach call transcript to t10
  await prisma.callTranscript.create({
    data: {
      ticketId: t10.id,
      rawText:
        "[00:00] Agent (Mia): Hi Ingrid, welcome to SupportIQ! I'm Mia, your onboarding specialist. " +
        "Congratulations on getting started!\n" +
        "[00:07] Customer (Ingrid): Thank you, Mia! I signed up two days ago and I'm quite excited " +
        "but also a little overwhelmed with all the features.\n" +
        "[00:15] Agent (Mia): That's completely normal! Let's go through the key features together. " +
        "First, the main dashboard — this is your command center. You can see all your support tickets here...\n" +
        "[02:30] Customer (Ingrid): Oh, that's quite clever! So the AI automatically categorizes incoming tickets?\n" +
        "[02:36] Agent (Mia): Exactly! It analyzes the content and assigns category, urgency and sentiment. " +
        "You can always override it manually if needed.\n" +
        "[05:00] Customer (Ingrid): And how do I invite my team members?\n" +
        "[05:04] Agent (Mia): Great question — go to Settings, then Team, and click Invite Member. " +
        "You can assign them different roles: Viewer, Agent, or Admin.\n" +
        "[07:15] Customer (Ingrid): This is very helpful. I think I have enough to get started.\n" +
        "[07:20] Agent (Mia): Wonderful! I'll send you a summary email with documentation links. " +
        "Don't hesitate to reach out if you need anything!\n" +
        "[07:28] Customer (Ingrid): Thank you so much, Mia. Very clear explanation.\n" +
        "[07:32] Agent (Mia): My pleasure! Have a wonderful day, Ingrid.\n",
      duration: 452,
      speakerCount: 2,
      agentName: "Mia",
      keywords: [
        "onboarding",
        "dashboard",
        "AI categorization",
        "team management",
        "roles",
        "getting-started",
      ],
    },
  });

  // ─── 11. OTHER – LOW – HAPPY (ANALYZED, RESOLVED) ────────
  await prisma.ticket.create({
    data: {
      ticketNumber: ticketNum(11),
      customerName: "Zoe Nakamura",
      customerEmail: "zoe.nakamura@creatives.jp",
      subject: "Thank you — your support team saved our product launch!",
      content:
        "I just wanted to write in and say a massive thank you to your support team, " +
        "particularly to 'Alex' who helped us last week with our data migration issue. " +
        "We were literally hours away from cancelling our product launch when Alex " +
        "stayed on the call with us for 2 hours and got everything working. " +
        "Please pass on our gratitude. We are customers for life!",
      source: "TICKET",
      status: "RESOLVED",
      category: "OTHER",
      urgency: "LOW",
      sentiment: "HAPPY",
      summary:
        "Customer sending praise for agent Alex who resolved a data migration issue " +
        "and saved their product launch. CSAT moment — flag for team recognition.",
      draftResponse:
        "Hi Zoe,\n\nThis message absolutely made our day! Thank you so much for taking the time to write in.\n\n" +
        "I've passed your kind words directly to Alex and their manager. " +
        "It's exactly this kind of feedback that motivates our team.\n\n" +
        "Congratulations on your product launch — we're so glad we could play a small part in it!\n\n" +
        "Warmly,\nSupportIQ Customer Success",
      aiConfidence: 0.99,
      tags: ["praise", "csat", "agent-recognition", "data-migration", "positive"],
    },
  });

  // ─── 12. BILLING – HIGH – FRUSTRATED (NEW, UNANALYZED) ───
  await prisma.ticket.create({
    data: {
      ticketNumber: ticketNum(12),
      customerName: "Daniel Osei",
      customerEmail: "d.osei@agritech.gh",
      subject: "Charged for annual plan after downgrading to monthly",
      content:
        "I downgraded from Annual to Monthly plan on September 15th. " +
        "I received a confirmation email that the downgrade would take effect at the end of my billing cycle. " +
        "Today (September 29th) you charged my card $599 for another annual plan. " +
        "The billing cycle had ended. The downgrade was confirmed. " +
        "Why am I being charged $599 for a plan I downgraded from? " +
        "This is a significant amount of money for a small business. Please refund immediately.",
      source: "TICKET",
      status: "NEW",
      category: "BILLING",
      urgency: "HIGH",
      sentiment: "FRUSTRATED",
      tags: [],
    },
  });

  // ─── Final count log ──────────────────────────────────────
  const ticketCount = await prisma.ticket.count();
  const transcriptCount = await prisma.callTranscript.count();

  console.log(`\n✅ Seeding complete:`);
  console.log(`   📋 ${ticketCount} tickets created`);
  console.log(`   📞 ${transcriptCount} call transcripts created`);
  console.log(`\n   Distribution:`);
  console.log(`   Sources  : TICKET (10), CALL (2)`);
  console.log(`   Status   : NEW (4), ANALYZED (5), IN_PROGRESS (1), RESOLVED (3) — wait, let me check...`);
  console.log(`   Urgency  : CRITICAL (2), HIGH (4), MEDIUM (3), LOW (3)`);
  console.log(`   Sentiment: ANGRY (3), FRUSTRATED (4), NEUTRAL (3), HAPPY (2)`);
  console.log(`   Categories: BILLING (4), TECHNICAL (3), ACCOUNT (2), GENERAL (2), OTHER (1)`);
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
