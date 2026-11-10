import { Star, Quote, Terminal, Cpu, Database, Activity } from "lucide-react";
import { cn } from "@/lib/utils";

// ─── L-Shaped Technical Corner Markers ────────────────────────────────────────

export function CornerMarkers({
  color = "#1A3C2B",
  size = 10,
}: {
  color?: string;
  size?: number;
}) {
  const s = `${size}px`;
  return (
    <>
      <span
        style={{
          width: s,
          height: s,
          borderColor: color,
        }}
        className="absolute -top-[1px] -left-[1px] border-t-2 border-l-2 pointer-events-none z-10"
      />
      <span
        style={{
          width: s,
          height: s,
          borderColor: color,
        }}
        className="absolute -top-[1px] -right-[1px] border-t-2 border-r-2 pointer-events-none z-10"
      />
      <span
        style={{
          width: s,
          height: s,
          borderColor: color,
        }}
        className="absolute -bottom-[1px] -left-[1px] border-b-2 border-l-2 pointer-events-none z-10"
      />
      <span
        style={{
          width: s,
          height: s,
          borderColor: color,
        }}
        className="absolute -bottom-[1px] -right-[1px] border-b-2 border-r-2 pointer-events-none z-10"
      />
    </>
  );
}

// ─── Network Topology Graph Component ─────────────────────────────────────────

export function NetworkTopologyGraph({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "relative w-full max-w-[420px] aspect-square rounded-full border border-[#3A3A38]/30 bg-[#F7F7F5] flex items-center justify-center p-4 overflow-hidden",
        className
      )}
    >
      {/* Precision corner crosshairs */}
      <div className="absolute top-2 left-4 text-[9px] font-mono tracking-widest text-[#3A3A38]/60 uppercase">
        SYS_TOPOLOGY // REV_4.2
      </div>
      <div className="absolute bottom-2 right-4 text-[9px] font-mono tracking-widest text-[#3A3A38]/60 uppercase">
        ACTIVE_NODES: 04 // 60HZ
      </div>

      {/* Static Concentric Guides */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        viewBox="0 0 420 420"
      >
        {/* Outer dashed orbit circle (r = 140px) */}
        <circle
          cx="210"
          cy="210"
          r="140"
          fill="none"
          stroke="#3A3A38"
          strokeOpacity="0.3"
          strokeWidth="1"
          strokeDasharray="4 4"
        />

        {/* Inner subtle orbit circle (r = 75px) */}
        <circle
          cx="210"
          cy="210"
          r="75"
          fill="none"
          stroke="#3A3A38"
          strokeOpacity="0.15"
          strokeWidth="1"
          strokeDasharray="2 3"
        />

        {/* Diagonal hairline guides */}
        <line
          x1="70"
          y1="70"
          x2="350"
          y2="350"
          stroke="#3A3A38"
          strokeOpacity="0.1"
          strokeWidth="0.5"
        />
        <line
          x1="350"
          y1="70"
          x2="70"
          y2="350"
          stroke="#3A3A38"
          strokeOpacity="0.1"
          strokeWidth="0.5"
        />
      </svg>

      {/* Orbiting Layer with 20s linear infinite rotation */}
      <div className="absolute inset-0 w-full h-full animate-orbit pointer-events-none flex items-center justify-center">
        <svg
          className="w-full h-full"
          viewBox="0 0 420 420"
        >
          {/* Node 1: Top (Coral) at 0 deg, y = 210 - 140 = 70 */}
          <line
            x1="210"
            y1="210"
            x2="210"
            y2="70"
            stroke="#3A3A38"
            strokeOpacity="0.25"
            strokeWidth="1"
          />
          <circle cx="210" cy="70" r="7" fill="#FF8C69" stroke="#1A3C2B" strokeWidth="1" />
          <circle cx="210" cy="70" r="11" fill="none" stroke="#FF8C69" strokeOpacity="0.4" strokeWidth="1" />

          {/* Node 2: Bottom Right (Mint) at 120 deg: x = 210 + 140*cos(30) = 331, y = 210 + 140*sin(30) = 280 */}
          <line
            x1="210"
            y1="210"
            x2="331"
            y2="280"
            stroke="#3A3A38"
            strokeOpacity="0.25"
            strokeWidth="1"
          />
          <circle cx="331" cy="280" r="7" fill="#9EFFBF" stroke="#1A3C2B" strokeWidth="1" />
          <circle cx="331" cy="280" r="11" fill="none" stroke="#9EFFBF" strokeOpacity="0.4" strokeWidth="1" />

          {/* Node 3: Bottom Left (Gold) at 240 deg: x = 210 - 140*cos(30) = 89, y = 210 + 140*sin(30) = 280 */}
          <line
            x1="210"
            y1="210"
            x2="89"
            y2="280"
            stroke="#3A3A38"
            strokeOpacity="0.25"
            strokeWidth="1"
          />
          <circle cx="89" cy="280" r="7" fill="#F4D35E" stroke="#1A3C2B" strokeWidth="1" />
          <circle cx="89" cy="280" r="11" fill="none" stroke="#F4D35E" strokeOpacity="0.4" strokeWidth="1" />
        </svg>
      </div>

      {/* Central 16px Solid Forest Green Node */}
      <div className="relative z-20 flex flex-col items-center">
        <div className="w-4 h-4 rounded-none bg-[#1A3C2B] border border-[#9EFFBF] relative flex items-center justify-center">
          <div className="w-1.5 h-1.5 bg-[#9EFFBF]" />
        </div>
        <span className="mt-2 text-[10px] font-mono font-bold tracking-widest text-[#1A3C2B] uppercase bg-white/90 px-1.5 py-0.5 border border-[#3A3A38]/20">
          CORE_ENGINE
        </span>
      </div>

      {/* Wireframe Telemetry Badges */}
      <div className="absolute top-8 right-8 z-10 hidden sm:block bg-white/95 border border-[#3A3A38]/20 px-2 py-1 text-[9px] font-mono">
        <span className="text-[#FF8C69]">●</span> INGEST_NODE
      </div>
      <div className="absolute bottom-8 left-8 z-10 hidden sm:block bg-white/95 border border-[#3A3A38]/20 px-2 py-1 text-[9px] font-mono">
        <span className="text-[#F4D35E]">●</span> PERSIST_POSTGRES
      </div>
      <div className="absolute bottom-8 right-8 z-10 hidden sm:block bg-white/95 border border-[#3A3A38]/20 px-2 py-1 text-[9px] font-mono">
        <span className="text-[#9EFFBF]">●</span> CLAUDE_PIPELINE
      </div>
    </div>
  );
}

// ─── Bento Feature Grid (2x2 with 1px hairline gaps) ─────────────────────────

export function BentoFeatureGrid() {
  return (
    <div className="border border-[#3A3A38]/20 bg-[#3A3A38]/20 grid grid-cols-1 md:grid-cols-2 gap-[1px]">
      {/* Bento Cell 1: Coral */}
      <div className="bg-[#F7F7F5] p-8 relative flex flex-col justify-between">
        <CornerMarkers size={8} />
        <div>
          <div className="flex items-center gap-2 mb-3">
            <span className="w-1.5 h-4 bg-[#FF8C69]" />
            <span className="text-[11px] font-mono font-bold tracking-widest text-[#1A3C2B] uppercase">
              01 // MULTI_CHANNEL INTAKE
            </span>
          </div>
          <h3 className="text-xl font-bold tracking-tight text-[#1A3C2B] mb-2 font-['Space_Grotesk']">
            Automated Ingestion &amp; Triage
          </h3>
          <p className="text-xs text-[#5A5A58] leading-relaxed mb-6 font-mono">
            Directly parse customer tickets and raw speaker call audio transcripts with schema validation and automatic ticket numbering.
          </p>
        </div>

        {/* Mockup Box: Simulated Code & Status Chip */}
        <div className="bg-white border border-[#3A3A38]/20 p-3 font-mono text-[11px] space-y-2">
          <div className="flex items-center justify-between pb-2 border-b border-[#3A3A38]/10 text-[10px] text-[#5A5A58]">
            <span className="flex items-center gap-1.5">
              <Terminal className="w-3 h-3 text-[#1A3C2B]" />
              HTTP POST /api/tickets
            </span>
            <span className="px-1.5 py-0.5 bg-[#FF8C69]/15 text-[#D94838] border border-[#FF8C69]/40 text-[9px] uppercase font-bold">
              STATUS: 201 CREATED
            </span>
          </div>
          <div className="text-[#1A3C2B] text-[10px] leading-relaxed">
            <span className="text-[#5A5A58]">// Inbound payload verified</span><br />
            {`{ id: "cmum...", source: "CALL", category: "BILLING" }`}
          </div>
        </div>
      </div>

      {/* Bento Cell 2: Mint */}
      <div className="bg-[#F7F7F5] p-8 relative flex flex-col justify-between">
        <CornerMarkers size={8} />
        <div>
          <div className="flex items-center gap-2 mb-3">
            <span className="w-1.5 h-4 bg-[#9EFFBF]" />
            <span className="text-[11px] font-mono font-bold tracking-widest text-[#1A3C2B] uppercase">
              02 // CLAUDE 3.5 REASONING
            </span>
          </div>
          <h3 className="text-xl font-bold tracking-tight text-[#1A3C2B] mb-2 font-['Space_Grotesk']">
            Structural Sentiment &amp; Urgency
          </h3>
          <p className="text-xs text-[#5A5A58] leading-relaxed mb-6 font-mono">
            Anthropic Claude neural pipeline classifies sentiment, urgency level, key summary, and confidence score without manual intervention.
          </p>
        </div>

        {/* Mockup Box: Classification Chips */}
        <div className="bg-white border border-[#3A3A38]/20 p-3 font-mono text-[11px] space-y-2">
          <div className="flex items-center justify-between pb-2 border-b border-[#3A3A38]/10 text-[10px] text-[#5A5A58]">
            <span className="flex items-center gap-1.5">
              <Cpu className="w-3 h-3 text-[#1A3C2B]" />
              AI_METRIC_REPORT
            </span>
            <span className="px-1.5 py-0.5 bg-[#9EFFBF]/30 text-[#1A3C2B] border border-[#1A3C2B]/30 text-[9px] uppercase font-bold">
              CONFIDENCE: 94.2%
            </span>
          </div>
          <div className="flex flex-wrap gap-1.5 pt-1">
            <span className="px-2 py-0.5 bg-[#F7F7F5] border border-[#3A3A38]/20 text-[9px] font-mono text-[#1A3C2B]">
              SENTIMENT: FRUSTRATED
            </span>
            <span className="px-2 py-0.5 bg-[#F7F7F5] border border-[#3A3A38]/20 text-[9px] font-mono text-[#D94838]">
              URGENCY: HIGH
            </span>
            <span className="px-2 py-0.5 bg-[#F7F7F5] border border-[#3A3A38]/20 text-[9px] font-mono text-[#1A3C2B]">
              TAGS: [BILLING, REFUND]
            </span>
          </div>
        </div>
      </div>

      {/* Bento Cell 3: Gold */}
      <div className="bg-[#F7F7F5] p-8 relative flex flex-col justify-between">
        <CornerMarkers size={8} />
        <div>
          <div className="flex items-center gap-2 mb-3">
            <span className="w-1.5 h-4 bg-[#F4D35E]" />
            <span className="text-[11px] font-mono font-bold tracking-widest text-[#1A3C2B] uppercase">
              03 // AGENT DRAFT RESOLUTION
            </span>
          </div>
          <h3 className="text-xl font-bold tracking-tight text-[#1A3C2B] mb-2 font-['Space_Grotesk']">
            Autonomous Draft Responses
          </h3>
          <p className="text-xs text-[#5A5A58] leading-relaxed mb-6 font-mono">
            Support reps can regenerate draft responses across customizable tones (Empathetic, Formal, Concise, Technical) with zero latency.
          </p>
        </div>

        {/* Mockup Box: Resolution Preview */}
        <div className="bg-white border border-[#3A3A38]/20 p-3 font-mono text-[11px] space-y-2">
          <div className="flex items-center justify-between pb-2 border-b border-[#3A3A38]/10 text-[10px] text-[#5A5A58]">
            <span className="flex items-center gap-1.5">
              <Activity className="w-3 h-3 text-[#1A3C2B]" />
              TONE: EMPATHETIC
            </span>
            <span className="px-1.5 py-0.5 bg-[#F4D35E]/30 text-[#1A3C2B] border border-[#1A3C2B]/30 text-[9px] uppercase font-bold">
              READY_TO_SEND
            </span>
          </div>
          <p className="text-[10px] text-[#1A3C2B] italic border-l-2 border-[#1A3C2B] pl-2 py-0.5">
            "Dear Rachel, We have reviewed your invoice and refunded the duplicate $99 renewal immediately..."
          </p>
        </div>
      </div>

      {/* Bento Cell 4: Forest */}
      <div className="bg-[#F7F7F5] p-8 relative flex flex-col justify-between">
        <CornerMarkers size={8} />
        <div>
          <div className="flex items-center gap-2 mb-3">
            <span className="w-1.5 h-4 bg-[#1A3C2B]" />
            <span className="text-[11px] font-mono font-bold tracking-widest text-[#1A3C2B] uppercase">
              04 // PRISMA POSTGRES ENGINE
            </span>
          </div>
          <h3 className="text-xl font-bold tracking-tight text-[#1A3C2B] mb-2 font-['Space_Grotesk']">
            Relational Integrity &amp; Speed
          </h3>
          <p className="text-xs text-[#5A5A58] leading-relaxed mb-6 font-mono">
            PostgreSQL backed by Prisma ORM with compound indexes ensuring sub-10ms query execution across search, filtering, and cascade lifecycle.
          </p>
        </div>

        {/* Mockup Box: DB Schema Check */}
        <div className="bg-white border border-[#3A3A38]/20 p-3 font-mono text-[11px] space-y-2">
          <div className="flex items-center justify-between pb-2 border-b border-[#3A3A38]/10 text-[10px] text-[#5A5A58]">
            <span className="flex items-center gap-1.5">
              <Database className="w-3 h-3 text-[#1A3C2B]" />
              POSTGRESQL // LOCALHOST:5432
            </span>
            <span className="px-1.5 py-0.5 bg-[#1A3C2B] text-[#9EFFBF] text-[9px] uppercase font-bold">
              ONLINE
            </span>
          </div>
          <div className="text-[#1A3C2B] text-[10px]">
            <span>INDEX: @@index([status, urgency])</span><br />
            <span className="text-[#5A5A58]">LATENCY: 4.10ms (59/59 API Tests Passing)</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Monospaced Testimonial Card ─────────────────────────────────────────────

export function MonospacedTestimonialCard({
  quote,
  author,
  title,
  company,
}: {
  quote: string;
  author: string;
  title: string;
  company: string;
}) {
  return (
    <div className="relative bg-[#F7F7F5] border border-[#3A3A38]/20 p-6 flex flex-col justify-between">
      <CornerMarkers size={8} />
      {/* Top: Quote Icon and 5 Star Ratings */}
      <div className="flex items-center justify-between mb-4">
        <Quote className="w-4 h-4 text-[#1A3C2B]" />
        <div className="flex items-center gap-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className="w-2.5 h-2.5 fill-[#1A3C2B] text-[#1A3C2B]"
            />
          ))}
        </div>
      </div>

      {/* Body: Monospaced text */}
      <p className="text-xs font-mono text-[#1A3C2B] leading-relaxed mb-6">
        "{quote}"
      </p>

      {/* Bottom: 1px top border with user avatar (square, no radius) and name/title */}
      <div className="pt-4 border-t border-[#3A3A38]/20 flex items-center gap-3">
        <div className="w-8 h-8 rounded-none bg-[#1A3C2B] text-[#9EFFBF] flex items-center justify-center font-mono font-bold text-xs uppercase border border-[#3A3A38]/20">
          {author.slice(0, 2)}
        </div>
        <div>
          <p className="text-xs font-mono font-bold text-[#1A3C2B] uppercase tracking-wide">
            {author}
          </p>
          <p className="text-[10px] font-mono text-[#5A5A58]">
            {title} // {company}
          </p>
        </div>
      </div>
    </div>
  );
}
