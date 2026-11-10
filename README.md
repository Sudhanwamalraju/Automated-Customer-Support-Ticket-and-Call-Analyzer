# 🎧 SupportIQ — Automated Customer Support Ticket & Call Analyzer

A production-style full-stack web application that helps customer support teams automatically analyze customer support tickets and call transcripts using AI (Anthropic Claude).

## 🏗️ Architecture

```
Routes  ──▶  Controllers  ──▶  Services  ──▶  Prisma ORM  ──▶  PostgreSQL
   │              │                 │
Zod Schema   HTTP & Envelope   AI Pipeline &
Validation     Formatting      Business Logic
```

```
/
├── client/          → React + TypeScript + Vite (Frontend)
│   ├── src/
│   │   ├── components/   → Reusable UI components (shadcn/ui)
│   │   ├── pages/        → Page-level components
│   │   ├── layouts/      → Layout wrappers
│   │   ├── hooks/        → Custom React hooks
│   │   ├── services/     → API client & external services
│   │   ├── types/        → TypeScript type definitions
│   │   ├── lib/          → Utility functions
│   │   ├── App.tsx       → App root with routing
│   │   └── main.tsx      → Entry point
│   └── vite.config.ts    → Vite + Tailwind configuration
│
├── server/          → Node.js + Express + TypeScript (Backend)
│   ├── src/
│   │   ├── controllers/  → Request/response handlers
│   │   │   ├── ticket.controller.ts
│   │   │   ├── call.controller.ts
│   │   │   └── dashboard.controller.ts
│   │   ├── routes/       → Express route definitions
│   │   │   ├── ticket.routes.ts
│   │   │   ├── call.routes.ts
│   │   │   ├── dashboard.routes.ts
│   │   │   ├── health.routes.ts
│   │   │   └── index.ts
│   │   ├── services/     → Business logic & database operations
│   │   │   ├── ticket.service.ts
│   │   │   ├── callTranscript.service.ts
│   │   │   └── ai.service.ts
│   │   ├── middleware/   → Error handling, Zod validation
│   │   │   ├── errorHandler.ts
│   │   │   └── validate.ts
│   │   ├── validators/   → Zod schemas for input validation
│   │   │   ├── common.validator.ts
│   │   │   ├── ticket.validator.ts
│   │   │   └── call.validator.ts
│   │   ├── types/        → Server types & API models
│   │   ├── utils/        → Error classes, response envelopes, tests
│   │   ├── app.ts        → Express application configuration
│   │   └── server.ts     → Server entry point
│   └── prisma/
│       ├── schema.prisma → Database models, enums & indexes
│       └── seed.ts       → Realistic demo dataset
│
├── .env.example     → Environment variable template
└── package.json     → Root workspace scripts
```

## 🛠️ Tech Stack

| Layer      | Technologies                                      |
|------------|---------------------------------------------------|
| Frontend   | React, TypeScript, Vite, Tailwind CSS, shadcn/ui  |
| UI         | Lucide React, Recharts, React Router, TanStack Query |
| Backend    | Node.js, Express, TypeScript                      |
| Database   | PostgreSQL, Prisma ORM                            |
| Validation | Zod                                               |
| AI         | Anthropic Claude API (with robust heuristic fallback) |

---

## 📡 REST API Documentation

Base URL: `http://localhost:5000/api`

### Standard Response Envelopes

#### Success Response
```json
{
  "success": true,
  "data": { ... },
  "message": "Operation description"
}
```

#### Error Response
```json
{
  "success": false,
  "error": {
    "message": "Error details",
    "code": "VALIDATION_ERROR | NOT_FOUND | BAD_REQUEST | INTERNAL_SERVER_ERROR",
    "details": [ ... ]
  }
}
```

---

### 1. Tickets Endpoints

#### `GET /api/tickets`
Retrieve paginated tickets with filtering, search, and sorting.

* **Query Parameters:**
  - `page` (optional, default `1`): Page number
  - `limit` (optional, default `20`, max `100`): Items per page
  - `search` (optional): Free-text search across subject, content, customer name, email, and ticket number
  - `status` (optional): `NEW` | `ANALYZED` | `IN_PROGRESS` | `RESOLVED`
  - `category` (optional): `BILLING` | `TECHNICAL` | `ACCOUNT` | `GENERAL` | `OTHER`
  - `urgency` (optional): `LOW` | `MEDIUM` | `HIGH` | `CRITICAL`
  - `sentiment` (optional): `ANGRY` | `FRUSTRATED` | `NEUTRAL` | `HAPPY`
  - `source` (optional): `TICKET` | `CALL`
  - `sortBy` (optional, default `createdAt`): `createdAt` | `urgency`
  - `sortOrder` (optional, default `desc`): `asc` | `desc`

#### `GET /api/tickets/:id`
Retrieve complete ticket information including attached `callTranscript` if available.

#### `POST /api/tickets`
Create a new customer support ticket.

* **Request Body:**
```json
{
  "customerName": "Jane Doe",
  "customerEmail": "jane@example.com",
  "subject": "Unable to access billing dashboard",
  "content": "I keep seeing a blank screen when navigating to the invoices tab.",
  "category": "BILLING",
  "urgency": "MEDIUM",
  "source": "TICKET"
}
```

#### `PUT /api/tickets/:id`
Update allowed ticket fields.

* **Request Body (all optional):**
```json
{
  "status": "IN_PROGRESS",
  "category": "BILLING",
  "urgency": "HIGH",
  "sentiment": "FRUSTRATED",
  "summary": "Updated summary text",
  "draftResponse": "Updated agent response",
  "tags": ["billing", "invoices"]
}
```

#### `DELETE /api/tickets/:id`
Permanently delete a ticket (cascades to associated call transcripts).

#### `POST /api/tickets/:id/analyze`
Trigger AI analysis on a ticket. Classifies sentiment, category, urgency, extracts summary, tags, generates a draft response, assigns an AI confidence score, and sets `status = ANALYZED`.

#### `POST /api/tickets/:id/regenerate-response`
Regenerate a new AI response draft with custom tone or agent instructions.

* **Request Body (optional):**
```json
{
  "tone": "empathetic",
  "customInstructions": "Offer a 15% discount coupon for the inconvenience."
}
```
Available tones: `empathetic`, `formal`, `concise`, `technical`.

---

### 2. Call Transcripts Endpoints

#### `POST /api/calls`
Create a complete call transcript interaction (creates Ticket record with `source: CALL` and linked `CallTranscript`).

* **Request Body:**
```json
{
  "customerName": "Alex Chen",
  "customerEmail": "alex@enterprise.com",
  "subject": "Enterprise SSO login failure",
  "rawText": "Agent: Support, this is Sarah. Caller: Hi Sarah, our team is locked out of Okta SSO...",
  "duration": 310,
  "speakerCount": 2,
  "agentName": "Sarah",
  "category": "ACCOUNT",
  "urgency": "HIGH",
  "keywords": ["sso", "okta", "auth"]
}
```

#### `GET /api/calls/:id`
Return call interaction details including the speaker-labelled transcript, agent name, duration, and keywords.

#### `POST /api/calls/:id/analyze`
Analyze the call transcript using the unified AI analysis pipeline. Extracts summary, urgency, category, sentiment, tags, and drafts a resolution reply.

---

### 3. Dashboard Analytics Endpoint

#### `GET /api/dashboard/stats`
Return aggregated metrics and distributions for the dashboard views:
```json
{
  "success": true,
  "data": {
    "totalTickets": 14,
    "newTickets": 4,
    "analyzedTickets": 6,
    "criticalTickets": 3,
    "highPriorityTickets": 4,
    "categoryDistribution": {
      "BILLING": 4,
      "TECHNICAL": 4,
      "ACCOUNT": 2,
      "GENERAL": 3,
      "OTHER": 1
    },
    "sentimentDistribution": {
      "ANGRY": 3,
      "FRUSTRATED": 5,
      "NEUTRAL": 4,
      "HAPPY": 2
    },
    "urgencyDistribution": {
      "LOW": 3,
      "MEDIUM": 4,
      "HIGH": 4,
      "CRITICAL": 3
    },
    "ticketSourceDistribution": {
      "TICKET": 11,
      "CALL": 3
    }
  }
}
```

---

### 4. Health Check Endpoint

#### `GET /api/health`
Return server uptime, environment, and live PostgreSQL connection status with query latency:
```json
{
  "status": "ok",
  "timestamp": "2026-09-29T15:30:00.000Z",
  "uptime": 12.34,
  "environment": "development",
  "services": {
    "database": {
      "status": "ok",
      "latencyMs": 35
    }
  }
}
```

---

## 🔒 Security Measures

- **No Secret Leaks**: Claude API keys and environment variables are strictly kept server-side and never returned to clients.
- **Zod Input Validation**: Every endpoint rigorously validates body payloads, URL parameters, and query strings.
- **ID Sanitization**: Malformed and malicious IDs are rejected with a `400 Bad Request`.
- **Zero Frontend Trust**: AI analysis fields (`sentiment`, `summary`, `draftResponse`, `aiConfidence`) are computed server-side via the AI service, preventing client spoofing.
- **Helmet Security Headers**: Active on all HTTP transactions.

---

## 🚀 Getting Started & Testing

### 1. Run Migrations & Seed Data
```bash
cd server
npm run db:migrate
npm run db:seed
```

### 2. Run Automated API Test Suite
Run the full 59-point automated test suite covering every route, database query, validation, and error scenario:
```bash
cd server
npm run test:api
```

### 3. Start Development Server
```bash
# From workspace root:
npm run dev
```

---

## 📜 Available Scripts

| Command              | Description                                          |
|----------------------|------------------------------------------------------|
| `npm run dev`        | Start both frontend and backend concurrently         |
| `npm run dev:server` | Start backend server only                            |
| `npm run dev:client` | Start frontend client only                           |
| `npm run build`      | Build both frontend and backend for production       |

### Server-specific scripts (`/server`):

| Command              | Description                                          |
|----------------------|------------------------------------------------------|
| `npm run test:api`   | Execute comprehensive automated REST API test suite  |
| `npm run db:migrate` | Apply Prisma schema migrations to PostgreSQL         |
| `npm run db:seed`    | Seed database with realistic demo tickets and calls  |
| `npm run db:studio`  | Launch visual Prisma Studio database GUI             |
| `npm run build`      | Compile TypeScript to production bundle (`dist/`)    |
