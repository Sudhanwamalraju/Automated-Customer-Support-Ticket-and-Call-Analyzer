import { Search, X } from "lucide-react";
import { cn } from "@/lib/utils";
import type { TicketFilters } from "@/types";
import { CornerMarkers } from "./TechnicalUI";

interface TicketFiltersProps {
  filters: TicketFilters;
  onChange: (filters: TicketFilters) => void;
  className?: string;
}

function Select({
  value,
  onChange,
  options,
  placeholder,
  className,
}: {
  value: string;
  onChange: (v: string) => void;
  options: { label: string; value: string }[];
  placeholder: string;
  className?: string;
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={cn(
        "bg-white border border-[#3A3A38]/20 px-3 py-2 text-xs font-mono text-[#1A3C2B]",
        "focus:outline-none focus:border-[#1A3C2B] rounded-none cursor-pointer uppercase tracking-wider",
        className
      )}
    >
      <option value="">{placeholder}</option>
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  );
}

export function TicketFiltersBar({ filters, onChange, className }: TicketFiltersProps) {
  const hasActiveFilters = Boolean(
    filters.search ||
      filters.category ||
      filters.urgency ||
      filters.sentiment ||
      filters.status ||
      filters.source
  );

  const clearAll = () =>
    onChange({
      sortBy: filters.sortBy,
      sortOrder: filters.sortOrder,
      page: 1,
    });

  return (
    <div
      className={cn(
        "relative bg-white border border-[#3A3A38]/20 p-4 space-y-3",
        className
      )}
    >
      <CornerMarkers size={8} />

      {/* Row 1: Search and Primary Controls */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#5A5A58]" />
          <input
            id="ticket-search-input"
            type="text"
            placeholder="SEARCH BY SUBJECT, CUSTOMER NAME, EMAIL, OR CONTENT..."
            value={filters.search ?? ""}
            onChange={(e) =>
              onChange({ ...filters, search: e.target.value, page: 1 })
            }
            className={cn(
              "w-full bg-[#F7F7F5] border border-[#3A3A38]/20 pl-9 pr-8 py-2 text-xs font-mono text-[#1A3C2B]",
              "placeholder:text-[#5A5A58]/70 focus:outline-none focus:border-[#1A3C2B] rounded-none uppercase tracking-wider"
            )}
          />
          {filters.search && (
            <button
              onClick={() => onChange({ ...filters, search: "", page: 1 })}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#5A5A58] hover:text-[#1A3C2B]"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Clear Filters */}
        {hasActiveFilters && (
          <button
            onClick={clearAll}
            className="inline-flex items-center justify-center gap-1.5 px-3 py-2 border border-[#D94838]/40 bg-[#D94838]/10 text-[#D94838] text-[10px] font-mono uppercase tracking-widest font-bold hover:bg-[#D94838]/20 transition-colors rounded-none"
          >
            <X className="w-3 h-3" />
            <span>RESET_FILTERS</span>
          </button>
        )}
      </div>

      {/* Row 2: Categorical Filter Dropdowns */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 pt-1 border-t border-[#3A3A38]/10">
        <Select
          placeholder="ALL STATUSES"
          value={filters.status ?? ""}
          onChange={(v) =>
            onChange({ ...filters, status: (v as any) || undefined, page: 1 })
          }
          options={[
            { label: "NEW", value: "NEW" },
            { label: "ANALYZED", value: "ANALYZED" },
            { label: "IN PROGRESS", value: "IN_PROGRESS" },
            { label: "RESOLVED", value: "RESOLVED" },
          ]}
        />

        <Select
          placeholder="ALL URGENCIES"
          value={filters.urgency ?? ""}
          onChange={(v) =>
            onChange({ ...filters, urgency: (v as any) || undefined, page: 1 })
          }
          options={[
            { label: "CRITICAL", value: "CRITICAL" },
            { label: "HIGH", value: "HIGH" },
            { label: "MEDIUM", value: "MEDIUM" },
            { label: "LOW", value: "LOW" },
          ]}
        />

        <Select
          placeholder="ALL CATEGORIES"
          value={filters.category ?? ""}
          onChange={(v) =>
            onChange({ ...filters, category: (v as any) || undefined, page: 1 })
          }
          options={[
            { label: "BILLING", value: "BILLING" },
            { label: "TECHNICAL", value: "TECHNICAL" },
            { label: "ACCOUNT", value: "ACCOUNT" },
            { label: "GENERAL", value: "GENERAL" },
            { label: "OTHER", value: "OTHER" },
          ]}
        />

        <Select
          placeholder="ALL SENTIMENTS"
          value={filters.sentiment ?? ""}
          onChange={(v) =>
            onChange({
              ...filters,
              sentiment: (v as any) || undefined,
              page: 1,
            })
          }
          options={[
            { label: "ANGRY", value: "ANGRY" },
            { label: "FRUSTRATED", value: "FRUSTRATED" },
            { label: "NEUTRAL", value: "NEUTRAL" },
            { label: "HAPPY", value: "HAPPY" },
          ]}
        />

        <Select
          placeholder="ALL SOURCES"
          value={filters.source ?? ""}
          onChange={(v) =>
            onChange({ ...filters, source: (v as any) || undefined, page: 1 })
          }
          options={[
            { label: "TICKET", value: "TICKET" },
            { label: "CALL AUDIO", value: "CALL" },
          ]}
        />

        <Select
          placeholder="SORT: NEWEST"
          value={`${filters.sortBy ?? "createdAt"}_${filters.sortOrder ?? "desc"}`}
          onChange={(v) => {
            const [sortBy, sortOrder] = v.split("_") as [any, any];
            onChange({ ...filters, sortBy, sortOrder, page: 1 });
          }}
          options={[
            { label: "NEWEST FIRST", value: "createdAt_desc" },
            { label: "OLDEST FIRST", value: "createdAt_asc" },
            { label: "URGENCY: HIGH", value: "urgency_desc" },
            { label: "URGENCY: LOW", value: "urgency_asc" },
          ]}
        />
      </div>
    </div>
  );
}
