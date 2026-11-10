import { Link } from "react-router-dom";
import {
  Ticket,
  BellDot,
  AlertTriangle,
  Flame,
  CheckCircle2,
  PlusCircle,
  Phone,
  ChevronRight,
} from "lucide-react";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useDashboardStats, useTickets } from "@/hooks/useTickets";
import { StatsCard } from "@/components/StatsCard";
import { LoadingState, ErrorState } from "@/components/States";
import {
  CornerMarkers,
  NetworkTopologyGraph,
  BentoFeatureGrid,
  MonospacedTestimonialCard,
} from "@/components/TechnicalUI";
import {
  StatusBadge,
  UrgencyBadge,
  CategoryBadge,
  SourceBadge,
} from "@/components/Badges";

// ─── Technical Palette for Recharts ───────────────────────────────────────────
const TECH_PALETTE = {
  forest: "#1A3C2B",
  coral: "#FF8C69",
  mint: "#9EFFBF",
  gold: "#F4D35E",
  grid: "#3A3A38",
  gray: "#5A5A58",
};

const URGENCY_COLORS: Record<string, string> = {
  LOW: TECH_PALETTE.gray,
  MEDIUM: TECH_PALETTE.gold,
  HIGH: TECH_PALETTE.coral,
  CRITICAL: "#D94838",
};

const CATEGORY_COLORS = [
  TECH_PALETTE.forest,
  TECH_PALETTE.coral,
  TECH_PALETTE.mint,
  TECH_PALETTE.gold,
  TECH_PALETTE.grid,
];

const SENTIMENT_COLORS: Record<string, string> = {
  ANGRY: "#D94838",
  FRUSTRATED: TECH_PALETTE.coral,
  NEUTRAL: TECH_PALETTE.grid,
  HAPPY: TECH_PALETTE.mint,
};

function toChartData(obj: Record<string, number>) {
  return Object.entries(obj).map(([name, value]) => ({ name, value }));
}

// Flat 2D Tooltip without shadows
const TechnicalTooltip = ({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: { name: string; value: number }[];
  label?: string;
}) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-[#3A3A38]/30 p-2.5 text-[11px] font-mono">
      {label && <p className="text-[#5A5A58] uppercase mb-1">{label}</p>}
      {payload.map((p, i) => (
        <p key={i} className="font-bold text-[#1A3C2B] uppercase">
          {p.name}: {p.value}
        </p>
      ))}
    </div>
  );
};

export default function DashboardPage() {
  const { data: stats, isLoading: statsLoading, isError: statsError, error } = useDashboardStats();
  const { data: ticketsData } = useTickets({ limit: 5 });

  if (statsLoading) {
    return <LoadingState message="PARSING_SYSTEM_METRICS // TELEMETRY_INITIALIZING..." />;
  }

  if (statsError || !stats) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-12">
        <ErrorState
          message={(error as Error)?.message ?? "Telemetry service unavailable"}
          onRetry={() => window.location.reload()}
        />
      </div>
    );
  }

  const categoryData = toChartData(stats.categoryDistribution ?? stats.byCategory ?? {});
  const urgencyData = toChartData(stats.urgencyDistribution ?? stats.byUrgency ?? {});
  const sentimentData = toChartData(stats.sentimentDistribution ?? stats.bySentiment ?? {});
  const recentTickets = ticketsData?.items?.slice(0, 5) ?? [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 space-y-12">
      {/* ── 1. Hero Section (Space Grotesk 8xl + Mono Subtext + Wireframe Topology) ── */}
      <section className="relative border border-[#3A3A38]/20 bg-[#F7F7F5] p-6 sm:p-12 overflow-hidden">
        <CornerMarkers size={12} />
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left: Typography Layout */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white border border-[#1A3C2B]/30 text-[10px] font-mono uppercase tracking-[0.15em] text-[#1A3C2B]">
              <span className="w-2 h-2 bg-[#1A3C2B]" />
              TECHNICAL BLUEPRINT // VERSION 2.4.0
            </div>

            <h1 className="text-5xl sm:text-7xl lg:text-8xl font-bold font-['Space_Grotesk'] text-[#1A3C2B] tracking-tight leading-[0.92] uppercase">
              SUPPORT
              <br />
              <span className="text-[#1A3C2B]/85">INTELLIGENCE</span>
            </h1>

            {/* Subtext in JetBrains Mono, 14px, all-caps, with vertical 1px line on left */}
            <div className="border-l-2 border-[#1A3C2B] pl-4 py-1">
              <p className="text-xs sm:text-sm font-mono uppercase tracking-widest text-[#1A3C2B] leading-relaxed">
                AUTONOMOUS TICKET &amp; CALL ANALYZER POWERED BY ANTHROPIC CLAUDE AND POSTGRESQL.
                STRUCTURAL CLASSIFICATION, EMOTIONAL SENTIMENT TRIAGE, AND DETERMINISTIC RESOLUTION SYNTHESIS.
              </p>
            </div>

            {/* Quick Actions */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Link
                to="/tickets/new"
                className="px-5 py-2.5 bg-[#1A3C2B] text-[#9EFFBF] font-mono text-xs uppercase tracking-widest font-bold border border-[#1A3C2B] hover:bg-[#1A3C2B]/90 transition-colors flex items-center gap-2"
              >
                <PlusCircle className="w-4 h-4" />
                <span>INTAKE NEW TICKET</span>
              </Link>
              <Link
                to="/calls/new"
                className="px-5 py-2.5 bg-white text-[#1A3C2B] font-mono text-xs uppercase tracking-widest font-bold border border-[#3A3A38]/30 hover:border-[#1A3C2B] transition-colors flex items-center gap-2"
              >
                <Phone className="w-4 h-4" />
                <span>INGEST CALL TRANSCRIPT</span>
              </Link>
            </div>
          </div>

          {/* Right: Abstract Wireframe Graphic (Network Topology Graph) */}
          <div className="lg:col-span-5 flex justify-center items-center">
            <NetworkTopologyGraph />
          </div>
        </div>
      </section>

      {/* ── 2. Real-Time KPI Stats Bento (5 Cards) ────────────────────────── */}
      <section className="space-y-4">
        <div className="flex items-center justify-between border-b border-[#3A3A38]/20 pb-3">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-[#1A3C2B]" />
            <h2 className="text-sm font-mono font-bold uppercase tracking-widest text-[#1A3C2B]">
              TELEMETRY_STATUS // REAL_TIME_KPI
            </h2>
          </div>
          <span className="text-[10px] font-mono text-[#5A5A58] uppercase">
            ACTIVE_WINDOW: CURRENT_CYCLE
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <StatsCard
            metricCode="KPI_01"
            title="Total Ingested"
            value={stats.totalTickets}
            description="Tickets & Audio Calls"
            icon={Ticket}
            accentColor="#1A3C2B"
            trend={12}
          />
          <StatsCard
            metricCode="KPI_02"
            title="Awaiting Triage"
            value={stats.newTickets}
            description="Pending Classification"
            icon={BellDot}
            accentColor="#FF8C69"
            trend={-4}
          />
          <StatsCard
            metricCode="KPI_03"
            title="Critical Priority"
            value={stats.criticalTickets}
            description="SLA Under 1 Hour"
            icon={Flame}
            accentColor="#D94838"
            trend={stats.criticalTickets > 0 ? 8 : 0}
          />
          <StatsCard
            metricCode="KPI_04"
            title="High Urgency"
            value={stats.highPriorityTickets}
            description="Target &lt; 4 Hours"
            icon={AlertTriangle}
            accentColor="#F4D35E"
          />
          <StatsCard
            metricCode="KPI_05"
            title="Neural Analyzed"
            value={stats.analyzedTickets}
            description="Claude Structured"
            icon={CheckCircle2}
            accentColor="#9EFFBF"
            trend={24}
          />
        </div>
      </section>

      {/* ── 3. Bento Feature Grid (2x2 Grid with 1px hairline gaps) ───────── */}
      <section className="space-y-4">
        <div className="flex items-center justify-between border-b border-[#3A3A38]/20 pb-3">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-[#FF8C69]" />
            <h2 className="text-sm font-mono font-bold uppercase tracking-widest text-[#1A3C2B]">
              SYSTEM_ARCHITECTURE // BENTO_SPEC
            </h2>
          </div>
          <span className="text-[10px] font-mono text-[#5A5A58] uppercase">
            PIPELINE_MODULES: 4/4 DEPLOYED
          </span>
        </div>

        <BentoFeatureGrid />
      </section>

      {/* ── 4. Technical Blueprint Distribution Charts ────────────────────────── */}
      <section className="space-y-4">
        <div className="flex items-center justify-between border-b border-[#3A3A38]/20 pb-3">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-[#9EFFBF]" />
            <h2 className="text-sm font-mono font-bold uppercase tracking-widest text-[#1A3C2B]">
              DATA_DISTRIBUTION // RELATIONAL_VECTORS
            </h2>
          </div>
          <span className="text-[10px] font-mono text-[#5A5A58] uppercase">
            SOURCE: POSTGRESQL AGGREGATES
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Chart 1: Urgency Breakdown */}
          <div className="relative bg-white border border-[#3A3A38]/20 p-6 flex flex-col justify-between">
            <CornerMarkers size={8} />
            <div>
              <div className="flex items-center justify-between mb-4 pb-2 border-b border-[#3A3A38]/10 text-[10px] font-mono">
                <span className="text-[#1A3C2B] font-bold uppercase">[VEC_01] URGENCY_TIERS</span>
                <span className="text-[#5A5A58]">TOTAL: {stats.totalTickets}</span>
              </div>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={urgencyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <XAxis
                      dataKey="name"
                      tick={{ fontSize: 9, fontFamily: "JetBrains Mono", fill: "#5A5A58" }}
                      axisLine={{ stroke: "#3A3A38", strokeOpacity: 0.2 }}
                      tickLine={false}
                    />
                    <YAxis
                      tick={{ fontSize: 9, fontFamily: "JetBrains Mono", fill: "#5A5A58" }}
                      axisLine={false}
                      tickLine={false}
                      allowDecimals={false}
                    />
                    <Tooltip content={<TechnicalTooltip />} />
                    <Bar dataKey="value" stroke="#1A3C2B" strokeWidth={1}>
                      {urgencyData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={URGENCY_COLORS[entry.name] ?? TECH_PALETTE.forest} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="pt-3 border-t border-[#3A3A38]/10 flex justify-between text-[9px] font-mono text-[#5A5A58]">
              <span>TIER_1: CRITICAL/HIGH</span>
              <span className="font-bold text-[#D94838]">COUNT: {stats.criticalTickets + stats.highPriorityTickets}</span>
            </div>
          </div>

          {/* Chart 2: Sentiment Vectors */}
          <div className="relative bg-white border border-[#3A3A38]/20 p-6 flex flex-col justify-between">
            <CornerMarkers size={8} />
            <div>
              <div className="flex items-center justify-between mb-4 pb-2 border-b border-[#3A3A38]/10 text-[10px] font-mono">
                <span className="text-[#1A3C2B] font-bold uppercase">[VEC_02] EMOTION_INDEX</span>
                <span className="text-[#5A5A58]">DIAGNOSTIC</span>
              </div>
              <div className="h-48 flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={sentimentData}
                      cx="50%"
                      cy="50%"
                      innerRadius={45}
                      outerRadius={70}
                      paddingAngle={3}
                      dataKey="value"
                      stroke="#1A3C2B"
                      strokeWidth={1}
                    >
                      {sentimentData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={SENTIMENT_COLORS[entry.name] ?? TECH_PALETTE.gray} />
                      ))}
                    </Pie>
                    <Tooltip content={<TechnicalTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="pt-3 border-t border-[#3A3A38]/10 flex flex-wrap gap-2 text-[9px] font-mono">
              {sentimentData.map((s, idx) => (
                <span key={idx} className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5" style={{ backgroundColor: SENTIMENT_COLORS[s.name] }} />
                  <span>{s.name}: {s.value}</span>
                </span>
              ))}
            </div>
          </div>

          {/* Chart 3: Category Spectrum */}
          <div className="relative bg-white border border-[#3A3A38]/20 p-6 flex flex-col justify-between">
            <CornerMarkers size={8} />
            <div>
              <div className="flex items-center justify-between mb-4 pb-2 border-b border-[#3A3A38]/10 text-[10px] font-mono">
                <span className="text-[#1A3C2B] font-bold uppercase">[VEC_03] DOMAIN_DISTRIBUTION</span>
                <span className="text-[#5A5A58]">5 TAXONOMIES</span>
              </div>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    layout="vertical"
                    data={categoryData}
                    margin={{ top: 0, right: 10, left: 15, bottom: 0 }}
                  >
                    <XAxis
                      type="number"
                      tick={{ fontSize: 9, fontFamily: "JetBrains Mono", fill: "#5A5A58" }}
                      axisLine={{ stroke: "#3A3A38", strokeOpacity: 0.2 }}
                      tickLine={false}
                      allowDecimals={false}
                    />
                    <YAxis
                      dataKey="name"
                      type="category"
                      tick={{ fontSize: 9, fontFamily: "JetBrains Mono", fill: "#1A3C2B" }}
                      axisLine={false}
                      tickLine={false}
                      width={65}
                    />
                    <Tooltip content={<TechnicalTooltip />} />
                    <Bar dataKey="value" stroke="#1A3C2B" strokeWidth={1}>
                      {categoryData.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={CATEGORY_COLORS[index % CATEGORY_COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="pt-3 border-t border-[#3A3A38]/10 flex justify-between text-[9px] font-mono text-[#5A5A58]">
              <span>ACTIVE TAXONOMIES</span>
              <span className="text-[#1A3C2B] font-bold">PRISMA ORM</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── 5. Recent Queue Table (Technical Minimalist) ────────────────────────── */}
      <section className="space-y-4">
        <div className="flex items-center justify-between border-b border-[#3A3A38]/20 pb-3">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-[#F4D35E]" />
            <h2 className="text-sm font-mono font-bold uppercase tracking-widest text-[#1A3C2B]">
              QUEUE_PREVIEW // RECENT_INTAKES
            </h2>
          </div>
          <Link
            to="/tickets"
            className="inline-flex items-center gap-1 text-[10px] font-mono uppercase tracking-widest text-[#1A3C2B] font-bold hover:underline"
          >
            <span>VIEW ALL TICKETS ({stats.totalTickets})</span>
            <ChevronRight className="w-3 h-3" />
          </Link>
        </div>

        <div className="border border-[#3A3A38]/20 bg-white overflow-x-auto">
          <table className="w-full text-xs font-mono">
            <thead>
              <tr className="border-b border-[#3A3A38]/20 bg-[#F7F7F5] text-[10px] uppercase text-[#5A5A58]">
                <th className="px-4 py-3 text-left">TICKET_ID</th>
                <th className="px-4 py-3 text-left">CUSTOMER</th>
                <th className="px-4 py-3 text-left">SUBJECT</th>
                <th className="px-4 py-3 text-left">SOURCE</th>
                <th className="px-4 py-3 text-left">CATEGORY</th>
                <th className="px-4 py-3 text-left">URGENCY</th>
                <th className="px-4 py-3 text-left">STATUS</th>
                <th className="px-4 py-3 text-right">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#3A3A38]/15">
              {recentTickets.map((t) => (
                <tr key={t.id} className="hover:bg-[#F7F7F5] transition-colors group">
                  <td className="px-4 py-3 font-bold text-[#1A3C2B]">
                    {t.ticketNumber}
                  </td>
                  <td className="px-4 py-3 text-[#1A3C2B]">
                    <div>{t.customerName}</div>
                    <div className="text-[10px] text-[#5A5A58]">{t.customerEmail}</div>
                  </td>
                  <td className="px-4 py-3 text-[#1A3C2B] max-w-xs truncate">
                    {t.subject}
                  </td>
                  <td className="px-4 py-3">
                    <SourceBadge source={t.source} />
                  </td>
                  <td className="px-4 py-3">
                    <CategoryBadge category={t.category} />
                  </td>
                  <td className="px-4 py-3">
                    <UrgencyBadge urgency={t.urgency} />
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={t.status} />
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      to={`/tickets/${t.id}`}
                      className="px-2.5 py-1 bg-[#1A3C2B] text-[#9EFFBF] text-[9px] uppercase font-bold tracking-wider hover:bg-[#1A3C2B]/85 transition-colors inline-block"
                    >
                      OPEN
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* ── 6. Monospaced Testimonial / Telemetry Card ────────────────────── */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-[#3A3A38]/20">
        <MonospacedTestimonialCard
          quote="The AI pipeline slashed our first-response classification cycle from 18 minutes to sub-second structured JSON. Triage accuracy on billing and account lockouts is unprecedented."
          author="Sarah Jenkins"
          title="Head of Global Support Engineering"
          company="Enterprise Cloud Solutions"
        />
        <MonospacedTestimonialCard
          quote="Having unified audio transcript parsing and text tickets in a single relational schema eliminated duplicate tickets. The draft response generation gives our team instant, empathetic tone drafts."
          author="Marcus Vance"
          title="VP of Customer Operations"
          company="FinTech Mobility Corp"
        />
      </section>
    </div>
  );
}
