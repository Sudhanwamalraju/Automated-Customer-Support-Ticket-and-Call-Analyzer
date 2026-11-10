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
import { useDashboardStats } from "@/hooks/useTickets";
import { LoadingState, ErrorState } from "@/components/States";
import { CornerMarkers } from "@/components/TechnicalUI";

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

const SOURCE_COLORS: Record<string, string> = {
  TICKET: TECH_PALETTE.forest,
  CALL: TECH_PALETTE.mint,
};

function toChartData(obj: Record<string, number>, colorMap?: Record<string, string>) {
  return Object.entries(obj).map(([name, value], i) => ({
    name,
    value,
    fill: colorMap ? colorMap[name] ?? TECH_PALETTE.gray : undefined,
    index: i,
  }));
}

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

export default function AnalyticsPage() {
  const { data: stats, isLoading, isError, error, refetch } = useDashboardStats();

  if (isLoading) {
    return <LoadingState message="COMPUTING_RELATIONAL_ANALYTICS // PARSING_DISTRIBUTIONS..." />;
  }

  if (isError || !stats) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-12">
        <ErrorState
          message={(error as Error)?.message ?? "Analytics service error"}
          onRetry={refetch}
        />
      </div>
    );
  }

  const urgencyData = toChartData(stats.urgencyDistribution ?? stats.byUrgency ?? {}, URGENCY_COLORS);
  const categoryData = toChartData(stats.categoryDistribution ?? stats.byCategory ?? {});
  const sentimentData = toChartData(stats.sentimentDistribution ?? stats.bySentiment ?? {}, SENTIMENT_COLORS);
  const sourceData = toChartData(stats.ticketSourceDistribution ?? stats.bySource ?? {}, SOURCE_COLORS);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 space-y-8">
      {/* ── Header Banner ─────────────────────────────────────────────────── */}
      <div className="relative bg-[#F7F7F5] border border-[#3A3A38]/20 p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <CornerMarkers size={10} />
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 bg-white border border-[#3A3A38]/20 text-[9px] font-mono uppercase tracking-widest text-[#1A3C2B] mb-2">
            <span className="w-1.5 h-1.5 bg-[#1A3C2B]" />
            STATISTICAL_VECTORS // ENGINE_METRICS
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold font-['Space_Grotesk'] tracking-tight text-[#1A3C2B] uppercase">
            OPERATIONAL ANALYTICS
          </h1>
          <p className="text-xs font-mono text-[#5A5A58] mt-1 uppercase tracking-wider">
            AGGREGATED MULTI-DIMENSIONAL TRIAGE TELEMETRY DERIVED FROM POSTGRESQL AND ANTHROPIC CLAUDE
          </p>
        </div>

        <div className="flex items-center gap-2 text-[10px] font-mono">
          <span className="px-3 py-1.5 bg-white border border-[#3A3A38]/20 text-[#1A3C2B]">
            TOTAL_INGESTED: {stats.totalTickets}
          </span>
        </div>
      </div>

      {/* ── 4-Quadrant Analytics Grid ────────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Quadrant 1: Urgency Severity Distribution */}
        <div className="relative bg-white border border-[#3A3A38]/20 p-6 space-y-4">
          <CornerMarkers size={8} />
          <div className="flex items-center justify-between border-b border-[#3A3A38]/15 pb-2">
            <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#1A3C2B]">
              [QUAD_01] URGENCY_SEVERITY_BREAKDOWN
            </span>
            <span className="text-[9px] font-mono text-[#5A5A58] uppercase">
              BAR_VECTORS
            </span>
          </div>

          <div className="h-56">
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
                    <Cell key={`cell-${index}`} fill={entry.fill ?? TECH_PALETTE.forest} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="pt-2 border-t border-[#3A3A38]/10 flex justify-between text-[9px] font-mono text-[#5A5A58]">
            <span>SLA TARGET: CRITICAL &lt; 60 MIN</span>
            <span className="font-bold text-[#D94838]">CRITICAL COUNT: {stats.criticalTickets}</span>
          </div>
        </div>

        {/* Quadrant 2: Sentiment Emotional Vector */}
        <div className="relative bg-white border border-[#3A3A38]/20 p-6 space-y-4">
          <CornerMarkers size={8} />
          <div className="flex items-center justify-between border-b border-[#3A3A38]/15 pb-2">
            <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#1A3C2B]">
              [QUAD_02] EMOTIONAL_SENTIMENT_RATIO
            </span>
            <span className="text-[9px] font-mono text-[#5A5A58] uppercase">
              DONUT_TOPOLOGY
            </span>
          </div>

          <div className="h-56 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={sentimentData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={3}
                  dataKey="value"
                  stroke="#1A3C2B"
                  strokeWidth={1}
                >
                  {sentimentData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill ?? TECH_PALETTE.gray} />
                  ))}
                </Pie>
                <Tooltip content={<TechnicalTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="pt-2 border-t border-[#3A3A38]/10 flex flex-wrap gap-3 text-[9px] font-mono">
            {sentimentData.map((s, idx) => (
              <span key={idx} className="flex items-center gap-1.5">
                <span className="w-2 h-2" style={{ backgroundColor: s.fill }} />
                <span>{s.name}: {s.value}</span>
              </span>
            ))}
          </div>
        </div>

        {/* Quadrant 3: Domain Category Spectrum */}
        <div className="relative bg-white border border-[#3A3A38]/20 p-6 space-y-4">
          <CornerMarkers size={8} />
          <div className="flex items-center justify-between border-b border-[#3A3A38]/15 pb-2">
            <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#1A3C2B]">
              [QUAD_03] DOMAIN_CATEGORY_VOLUME
            </span>
            <span className="text-[9px] font-mono text-[#5A5A58] uppercase">
              HORIZONTAL_VECTORS
            </span>
          </div>

          <div className="h-56">
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
                  width={75}
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
          <div className="pt-2 border-t border-[#3A3A38]/10 flex justify-between text-[9px] font-mono text-[#5A5A58]">
            <span>CLASSIFICATION MODEL</span>
            <span className="font-bold text-[#1A3C2B]">CLAUDE 3.5 PROMPT V3</span>
          </div>
        </div>

        {/* Quadrant 4: Ingestion Channel Distribution (Tickets vs Calls) */}
        <div className="relative bg-white border border-[#3A3A38]/20 p-6 space-y-4">
          <CornerMarkers size={8} />
          <div className="flex items-center justify-between border-b border-[#3A3A38]/15 pb-2">
            <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#1A3C2B]">
              [QUAD_04] INGESTION_SOURCE_SPLIT
            </span>
            <span className="text-[9px] font-mono text-[#5A5A58] uppercase">
              CHANNEL_RATIO
            </span>
          </div>

          <div className="h-56 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={sourceData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={3}
                  dataKey="value"
                  stroke="#1A3C2B"
                  strokeWidth={1}
                >
                  {sourceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill ?? TECH_PALETTE.forest} />
                  ))}
                </Pie>
                <Tooltip content={<TechnicalTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="pt-2 border-t border-[#3A3A38]/10 flex justify-between text-[9px] font-mono text-[#5A5A58]">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 bg-[#1A3C2B]" />
              <span>TICKETS: {(stats.ticketSourceDistribution ?? stats.bySource)?.TICKET ?? 0}</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 bg-[#9EFFBF]" />
              <span>CALL AUDIO: {(stats.ticketSourceDistribution ?? stats.bySource)?.CALL ?? 0}</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
