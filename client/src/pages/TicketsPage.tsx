import { useState, useMemo } from "react";
import { PlusCircle } from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
import { useTickets } from "@/hooks/useTickets";
import { TicketTable, Pagination } from "@/components/TicketTable";
import { TicketCard } from "@/components/TicketTable";
import { TicketFiltersBar } from "@/components/TicketFilters";
import { EmptyState, ErrorState } from "@/components/States";
import { CornerMarkers } from "@/components/TechnicalUI";
import type {
  TicketFilters,
  TicketCategory,
  TicketUrgency,
  TicketSentiment,
  TicketStatus,
  TicketSource,
} from "@/types";
import { cn } from "@/lib/utils";

export default function TicketsPage() {
  const [viewMode, setViewMode] = useState<"table" | "grid">("table");
  const [searchParams, setSearchParams] = useSearchParams();

  const filters = useMemo<TicketFilters>(() => {
    return {
      search: searchParams.get("search") || undefined,
      category: (searchParams.get("category") as TicketCategory) || undefined,
      urgency: (searchParams.get("urgency") as TicketUrgency) || undefined,
      sentiment: (searchParams.get("sentiment") as TicketSentiment) || undefined,
      status: (searchParams.get("status") as TicketStatus) || undefined,
      source: (searchParams.get("source") as TicketSource) || undefined,
      sortBy: (searchParams.get("sortBy") as "createdAt" | "urgency") || "createdAt",
      sortOrder: (searchParams.get("sortOrder") as "asc" | "desc") || "desc",
      page: searchParams.get("page") ? parseInt(searchParams.get("page")!, 10) : 1,
      limit: searchParams.get("limit") ? parseInt(searchParams.get("limit")!, 10) : 20,
    };
  }, [searchParams]);

  const handleFiltersChange = (newFilters: TicketFilters) => {
    const nextParams = new URLSearchParams();
    if (newFilters.search) nextParams.set("search", newFilters.search);
    if (newFilters.category) nextParams.set("category", newFilters.category);
    if (newFilters.urgency) nextParams.set("urgency", newFilters.urgency);
    if (newFilters.sentiment) nextParams.set("sentiment", newFilters.sentiment);
    if (newFilters.status) nextParams.set("status", newFilters.status);
    if (newFilters.source) nextParams.set("source", newFilters.source);
    if (newFilters.sortBy && newFilters.sortBy !== "createdAt")
      nextParams.set("sortBy", newFilters.sortBy);
    if (newFilters.sortOrder && newFilters.sortOrder !== "desc")
      nextParams.set("sortOrder", newFilters.sortOrder);
    if (newFilters.page && newFilters.page > 1)
      nextParams.set("page", String(newFilters.page));
    if (newFilters.limit && newFilters.limit !== 20)
      nextParams.set("limit", String(newFilters.limit));

    setSearchParams(nextParams, { replace: true });
  };

  const { data, isLoading, isError, refetch } = useTickets(filters);
  const tickets = data?.items ?? [];
  const pagination = data?.pagination ?? {
    total: 0,
    page: 1,
    limit: 20,
    totalPages: 1,
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 space-y-6">
      {/* ── Page Header Banner ──────────────────────────────────────────────── */}
      <div className="relative bg-[#F7F7F5] border border-[#3A3A38]/20 p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <CornerMarkers size={10} />
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 bg-white border border-[#3A3A38]/20 text-[9px] font-mono uppercase tracking-widest text-[#1A3C2B] mb-2">
            <span className="w-1.5 h-1.5 bg-[#1A3C2B]" />
            DATA_STREAM // TICKETS_AND_CALLS
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold font-['Space_Grotesk'] tracking-tight text-[#1A3C2B] uppercase">
            TICKET REPOSITORY
          </h1>
          <p className="text-xs font-mono text-[#5A5A58] mt-1 uppercase tracking-wider">
            SEARCH, FILTER, AND TRIAGE INGESTED INTERACTIONS WITH SUB-SECOND AI DIAGNOSTICS
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* View mode toggle */}
          <div className="flex items-center border border-[#3A3A38]/20 bg-white p-0.5 font-mono text-[10px]">
            <button
              onClick={() => setViewMode("table")}
              className={cn(
                "px-2.5 py-1 uppercase tracking-wider transition-colors",
                viewMode === "table"
                  ? "bg-[#1A3C2B] text-[#9EFFBF] font-bold"
                  : "text-[#5A5A58] hover:text-[#1A3C2B]"
              )}
            >
              [TABLE]
            </button>
            <button
              onClick={() => setViewMode("grid")}
              className={cn(
                "px-2.5 py-1 uppercase tracking-wider transition-colors",
                viewMode === "grid"
                  ? "bg-[#1A3C2B] text-[#9EFFBF] font-bold"
                  : "text-[#5A5A58] hover:text-[#1A3C2B]"
              )}
            >
              [GRID]
            </button>
          </div>

          {/* New Ticket CTA */}
          <Link
            to="/tickets/new"
            className="px-4 py-2 bg-[#1A3C2B] hover:bg-[#1A3C2B]/90 text-[#9EFFBF] text-[10px] font-mono uppercase tracking-widest font-bold border border-[#1A3C2B] transition-colors flex items-center gap-1.5"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>+ NEW TICKET</span>
          </Link>
        </div>
      </div>

      {/* ── Filter Bar ───────────────────────────────────────────────────────── */}
      <TicketFiltersBar filters={filters} onChange={handleFiltersChange} />

      {/* ── Content View (Table / Grid) ──────────────────────────────────────── */}
      {isError ? (
        <ErrorState
          message="FAILED_TO_LOAD_TICKETS // RELATIONAL_DISCONNECT"
          onRetry={refetch}
        />
      ) : isLoading ? (
        <div className="space-y-2 border border-[#3A3A38]/20 bg-white p-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-10 bg-[#F7F7F5] animate-pulse" />
          ))}
        </div>
      ) : tickets.length === 0 ? (
        <EmptyState
          title="NO_RECORDS_FOUND"
          description="NO TICKETS MATCHED YOUR CURRENT FILTER AND SEARCH CONSTRAINTS."
        />
      ) : viewMode === "table" ? (
        <div className="space-y-4">
          <TicketTable tickets={tickets} loading={isLoading} />
          <Pagination
            page={pagination.page}
            totalPages={pagination.totalPages}
            total={pagination.total}
            limit={pagination.limit}
            onChange={(newPage) =>
              handleFiltersChange({ ...filters, page: newPage })
            }
          />
        </div>
      ) : (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {tickets.map((t) => (
              <TicketCard key={t.id} ticket={t} />
            ))}
          </div>
          <Pagination
            page={pagination.page}
            totalPages={pagination.totalPages}
            total={pagination.total}
            limit={pagination.limit}
            onChange={(newPage) =>
              handleFiltersChange({ ...filters, page: newPage })
            }
          />
        </div>
      )}
    </div>
  );
}
