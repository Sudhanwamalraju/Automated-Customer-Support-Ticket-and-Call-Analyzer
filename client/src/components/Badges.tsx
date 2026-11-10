import { cn } from "@/lib/utils";
import type {
  TicketStatus,
  TicketUrgency,
  TicketSentiment,
  TicketCategory,
  TicketSource,
} from "@/types";

// ─── Reusable Technical Badge Shell ───────────────────────────────────────────
// Inline-flex container with 1px border (#1A3C2B/20). Inside: 8px x 8px square dot of solid color,
// followed by JetBrains Mono text at 10px, uppercase, tracking-widest. Padding: 4px 12px.

export function TechnicalBadge({
  label,
  dotColor = "#1A3C2B",
  textColor = "#1A3C2B",
  borderColor = "rgba(26, 60, 43, 0.2)",
  bgColor = "#FFFFFF",
  className,
}: {
  label: string;
  dotColor?: string;
  textColor?: string;
  borderColor?: string;
  bgColor?: string;
  className?: string;
}) {
  return (
    <span
      style={{
        borderColor,
        backgroundColor: bgColor,
        color: textColor,
      }}
      className={cn(
        "inline-flex items-center gap-2 px-3 py-1 border text-[10px] font-mono uppercase tracking-[0.15em] font-medium rounded-none transition-colors",
        className
      )}
    >
      <span
        style={{ backgroundColor: dotColor }}
        className="w-2 h-2 shrink-0 rounded-none inline-block"
      />
      <span>{label}</span>
    </span>
  );
}

// ─── Status Badge ─────────────────────────────────────────────────────────────

const statusConfig: Record<
  TicketStatus,
  { label: string; dot: string; text: string; bg?: string }
> = {
  NEW: {
    label: "NEW",
    dot: "#1A3C2B",
    text: "#1A3C2B",
    bg: "#FFFFFF",
  },
  ANALYZED: {
    label: "ANALYZED",
    dot: "#9EFFBF",
    text: "#1A3C2B",
    bg: "#FFFFFF",
  },
  IN_PROGRESS: {
    label: "IN_PROGRESS",
    dot: "#F4D35E",
    text: "#1A3C2B",
    bg: "#FFFFFF",
  },
  RESOLVED: {
    label: "RESOLVED",
    dot: "#1A3C2B",
    text: "#1A3C2B",
    bg: "#EFEFEA",
  },
};

export function StatusBadge({ status }: { status: TicketStatus }) {
  const cfg = statusConfig[status] ?? {
    label: status,
    dot: "#1A3C2B",
    text: "#1A3C2B",
    bg: "#FFFFFF",
  };
  return (
    <TechnicalBadge
      label={cfg.label}
      dotColor={cfg.dot}
      textColor={cfg.text}
      bgColor={cfg.bg}
    />
  );
}

// ─── Urgency Badge ────────────────────────────────────────────────────────────

const urgencyConfig: Record<
  TicketUrgency,
  { label: string; dot: string; text: string }
> = {
  LOW: {
    label: "LOW",
    dot: "#3A3A38",
    text: "#3A3A38",
  },
  MEDIUM: {
    label: "MEDIUM",
    dot: "#F4D35E",
    text: "#1A3C2B",
  },
  HIGH: {
    label: "HIGH",
    dot: "#FF8C69",
    text: "#1A3C2B",
  },
  CRITICAL: {
    label: "CRITICAL",
    dot: "#D94838",
    text: "#D94838",
  },
};

export function UrgencyBadge({
  urgency,
}: {
  urgency?: TicketUrgency | null;
}) {
  if (!urgency) return <span className="text-[10px] font-mono text-[#3A3A38]/50">—</span>;
  const cfg = urgencyConfig[urgency];
  return (
    <TechnicalBadge
      label={cfg.label}
      dotColor={cfg.dot}
      textColor={cfg.text}
      borderColor={urgency === "CRITICAL" ? "rgba(217, 72, 56, 0.4)" : undefined}
    />
  );
}

// ─── Sentiment Badge ──────────────────────────────────────────────────────────

const sentimentConfig: Record<
  TicketSentiment,
  { label: string; dot: string; text: string }
> = {
  ANGRY: {
    label: "ANGRY",
    dot: "#D94838",
    text: "#D94838",
  },
  FRUSTRATED: {
    label: "FRUSTRATED",
    dot: "#FF8C69",
    text: "#1A3C2B",
  },
  NEUTRAL: {
    label: "NEUTRAL",
    dot: "#3A3A38",
    text: "#5A5A58",
  },
  HAPPY: {
    label: "HAPPY",
    dot: "#9EFFBF",
    text: "#1A3C2B",
  },
};

export function SentimentBadge({
  sentiment,
}: {
  sentiment?: TicketSentiment | null;
}) {
  if (!sentiment) return <span className="text-[10px] font-mono text-[#3A3A38]/50">—</span>;
  const cfg = sentimentConfig[sentiment];
  return (
    <TechnicalBadge
      label={cfg.label}
      dotColor={cfg.dot}
      textColor={cfg.text}
    />
  );
}

// ─── Category Badge ───────────────────────────────────────────────────────────

const categoryConfig: Record<
  TicketCategory,
  { label: string; dot: string }
> = {
  BILLING: { label: "BILLING", dot: "#FF8C69" },
  TECHNICAL: { label: "TECHNICAL", dot: "#1A3C2B" },
  ACCOUNT: { label: "ACCOUNT", dot: "#F4D35E" },
  GENERAL: { label: "GENERAL", dot: "#3A3A38" },
  OTHER: { label: "OTHER", dot: "#5A5A58" },
};

export function CategoryBadge({
  category,
}: {
  category?: TicketCategory | null;
}) {
  if (!category) return <span className="text-[10px] font-mono text-[#3A3A38]/50">—</span>;
  const cfg = categoryConfig[category] ?? { label: category, dot: "#1A3C2B" };
  return (
    <TechnicalBadge
      label={cfg.label}
      dotColor={cfg.dot}
      textColor="#1A3C2B"
    />
  );
}

// ─── Source Badge ─────────────────────────────────────────────────────────────

export function SourceBadge({ source }: { source: TicketSource }) {
  const isCall = source === "CALL";
  return (
    <TechnicalBadge
      label={isCall ? "CALL_AUDIO" : "TICKET_TEXT"}
      dotColor={isCall ? "#9EFFBF" : "#1A3C2B"}
      textColor="#1A3C2B"
      bgColor={isCall ? "#F7F7F5" : "#FFFFFF"}
    />
  );
}
