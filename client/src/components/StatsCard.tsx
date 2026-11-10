import { TrendingUp, TrendingDown, Minus, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { CornerMarkers } from "./TechnicalUI";

interface StatsCardProps {
  title: string;
  value: number | string;
  description?: string;
  icon: LucideIcon;
  iconColor?: string;
  accentColor?: string;
  metricCode?: string;
  trend?: number; // positive = up, negative = down
  loading?: boolean;
}

export function StatsCard({
  title,
  value,
  description,
  icon: Icon,
  accentColor = "#1A3C2B",
  metricCode,
  trend,
  loading = false,
}: StatsCardProps) {
  if (loading) {
    return (
      <div className="relative bg-[#FFFFFF] border border-[#3A3A38]/20 p-6 space-y-4">
        <CornerMarkers size={8} />
        <div className="h-3 w-20 bg-[#EFEFEA] animate-pulse" />
        <div className="h-8 w-16 bg-[#EFEFEA] animate-pulse" />
        <div className="h-2.5 w-32 bg-[#EFEFEA] animate-pulse" />
      </div>
    );
  }

  return (
    <div className="relative bg-[#FFFFFF] border border-[#3A3A38]/20 p-6 transition-colors hover:border-[#1A3C2B] group flex flex-col justify-between">
      <CornerMarkers size={8} />

      {/* Top Header: Metric Index & Icon */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <span className="text-[10px] font-mono tracking-widest text-[#5A5A58] uppercase">
            {metricCode ?? `SYS_METRIC`}
          </span>
          <div
            style={{ backgroundColor: `${accentColor}15`, color: accentColor }}
            className="w-7 h-7 flex items-center justify-center border border-[#3A3A38]/20 rounded-none"
          >
            <Icon className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* Title */}
        <p className="text-xs font-mono font-bold uppercase tracking-wider text-[#1A3C2B] mb-1">
          {title}
        </p>
      </div>

      {/* Value */}
      <div className="my-3">
        <p className="text-4xl font-bold font-['Space_Grotesk'] tracking-tight text-[#1A3C2B]">
          {value}
        </p>
      </div>

      {/* Footer Details: Trend / Description */}
      {(description || trend !== undefined) && (
        <div className="flex items-center justify-between pt-3 border-t border-[#3A3A38]/15 mt-2 text-[10px] font-mono">
          {description && (
            <span className="text-[#5A5A58] truncate max-w-[140px] uppercase">
              {description}
            </span>
          )}
          {trend !== undefined && (
            <span
              className={cn(
                "inline-flex items-center gap-1 px-1.5 py-0.5 border text-[9px] uppercase font-bold",
                trend > 0
                  ? "bg-[#9EFFBF]/20 text-[#1A3C2B] border-[#1A3C2B]/30"
                  : trend < 0
                  ? "bg-[#FF8C69]/20 text-[#D94838] border-[#D94838]/30"
                  : "bg-[#EFEFEA] text-[#5A5A58] border-[#3A3A38]/20"
              )}
            >
              {trend > 0 ? (
                <TrendingUp className="w-2.5 h-2.5" />
              ) : trend < 0 ? (
                <TrendingDown className="w-2.5 h-2.5" />
              ) : (
                <Minus className="w-2.5 h-2.5" />
              )}
              {Math.abs(trend)}%
            </span>
          )}
        </div>
      )}
    </div>
  );
}
