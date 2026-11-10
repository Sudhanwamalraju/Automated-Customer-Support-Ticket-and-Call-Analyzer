import { Loader2, AlertCircle, InboxIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { CornerMarkers } from "./TechnicalUI";

// ─── Loading State ────────────────────────────────────────────────────────────

export function LoadingState({
  message = "SYSTEM_BUSY // PROCESSING_PAYLOAD...",
  className,
}: {
  message?: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "relative bg-white border border-[#3A3A38]/20 p-12 text-center max-w-md mx-auto my-12 space-y-4",
        className
      )}
    >
      <CornerMarkers size={8} />
      <div className="w-10 h-10 mx-auto bg-[#F7F7F5] border border-[#3A3A38]/20 flex items-center justify-center">
        <Loader2 className="w-5 h-5 animate-spin text-[#1A3C2B]" />
      </div>
      <p className="text-xs font-mono font-bold uppercase tracking-widest text-[#1A3C2B]">
        {message}
      </p>
    </div>
  );
}

// ─── Error State ──────────────────────────────────────────────────────────────

export function ErrorState({
  message = "AN_UNEXPECTED_EXCEPTION_OCCURRED.",
  onRetry,
  className,
}: {
  message?: string;
  onRetry?: () => void;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "relative bg-white border border-[#D94838]/40 p-12 text-center max-w-md mx-auto my-12 space-y-4",
        className
      )}
    >
      <CornerMarkers size={8} color="#D94838" />
      <div className="w-10 h-10 mx-auto bg-[#D94838]/10 border border-[#D94838]/30 flex items-center justify-center">
        <AlertCircle className="w-5 h-5 text-[#D94838]" />
      </div>
      <div>
        <p className="text-xs font-mono font-bold text-[#D94838] uppercase tracking-wider">
          SYSTEM_ERROR // FAULT_DETECTED
        </p>
        <p className="text-[11px] font-mono text-[#5A5A58] mt-1 uppercase">
          {message}
        </p>
      </div>
      {onRetry && (
        <button
          onClick={onRetry}
          className="px-4 py-1.5 bg-[#1A3C2B] text-[#9EFFBF] text-[10px] font-mono uppercase tracking-widest font-bold border border-[#1A3C2B] hover:bg-[#1A3C2B]/90 transition-colors"
        >
          [RETRY_TRANSACTION]
        </button>
      )}
    </div>
  );
}

// ─── Empty State ──────────────────────────────────────────────────────────────

export function EmptyState({
  title = "NO_RECORDS_AVAILABLE",
  description,
  action,
  className,
}: {
  title?: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "relative bg-white border border-[#3A3A38]/20 p-12 text-center max-w-md mx-auto my-12 space-y-4",
        className
      )}
    >
      <CornerMarkers size={8} />
      <div className="w-10 h-10 mx-auto bg-[#F7F7F5] border border-[#3A3A38]/20 flex items-center justify-center">
        <InboxIcon className="w-5 h-5 text-[#5A5A58]" />
      </div>
      <div>
        <p className="text-xs font-mono font-bold text-[#1A3C2B] uppercase tracking-wider">
          {title}
        </p>
        {description && (
          <p className="text-[11px] font-mono text-[#5A5A58] mt-1 uppercase">
            {description}
          </p>
        )}
      </div>
      {action && <div className="pt-2">{action}</div>}
    </div>
  );
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────

export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "animate-pulse bg-[#EFEFEA] border border-[#3A3A38]/10 rounded-none",
        className
      )}
    />
  );
}

// ─── Stats Card Skeleton ──────────────────────────────────────────────────────

export function StatsCardSkeleton() {
  return (
    <div className="relative border border-[#3A3A38]/20 bg-white p-6 space-y-3">
      <CornerMarkers size={8} />
      <Skeleton className="h-3 w-20" />
      <Skeleton className="h-8 w-16" />
      <Skeleton className="h-2.5 w-32" />
    </div>
  );
}

// ─── Table Row Skeleton ───────────────────────────────────────────────────────

export function TableRowSkeleton({ cols = 7 }: { cols?: number }) {
  return (
    <tr>
      {Array.from({ length: cols }).map((_, i) => (
        <td key={i} className="px-4 py-3">
          <Skeleton className="h-3 w-full" />
        </td>
      ))}
    </tr>
  );
}
