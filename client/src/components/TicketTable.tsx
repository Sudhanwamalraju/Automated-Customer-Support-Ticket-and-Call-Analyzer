import { Link } from "react-router-dom";
import { MessageSquare, Phone, ArrowUpRight } from "lucide-react";
import type { Ticket } from "@/types";
import { formatRelativeTime, truncate } from "@/lib/utils";
import {
  StatusBadge,
  UrgencyBadge,
  SentimentBadge,
  CategoryBadge,
  SourceBadge,
} from "./Badges";
import { TableRowSkeleton } from "./States";
import { CornerMarkers } from "./TechnicalUI";

// ─── Ticket Table ─────────────────────────────────────────────────────────────

interface TicketTableProps {
  tickets: Ticket[];
  loading?: boolean;
  onDelete?: (id: string) => void;
}

export function TicketTable({
  tickets,
  loading = false,
}: TicketTableProps) {
  return (
    <div className="overflow-x-auto border border-[#3A3A38]/20 bg-white">
      <table className="w-full text-xs font-mono">
        <thead>
          <tr className="border-b border-[#3A3A38]/20 bg-[#F7F7F5] text-[10px] uppercase text-[#5A5A58]">
            <th className="px-4 py-3 text-left tracking-wider">
              TICKET_ID / SUBJECT
            </th>
            <th className="px-4 py-3 text-left tracking-wider">
              CUSTOMER
            </th>
            <th className="px-4 py-3 text-left tracking-wider">
              SOURCE
            </th>
            <th className="px-4 py-3 text-left tracking-wider">
              CATEGORY
            </th>
            <th className="px-4 py-3 text-left tracking-wider">
              URGENCY
            </th>
            <th className="px-4 py-3 text-left tracking-wider">
              SENTIMENT
            </th>
            <th className="px-4 py-3 text-left tracking-wider">
              STATUS
            </th>
            <th className="px-4 py-3 text-left tracking-wider">
              INGESTED
            </th>
            <th className="px-4 py-3 text-right tracking-wider">
              INSPECT
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[#3A3A38]/15">
          {loading
            ? Array.from({ length: 6 }).map((_, i) => (
                <TableRowSkeleton key={i} cols={9} />
              ))
            : tickets.map((ticket) => (
                <TicketRow key={ticket.id} ticket={ticket} />
              ))}
        </tbody>
      </table>
    </div>
  );
}

function TicketRow({ ticket }: { ticket: Ticket }) {
  return (
    <tr className="hover:bg-[#F7F7F5] transition-colors group">
      <td className="px-4 py-3.5">
        <div className="flex items-start gap-2.5">
          <div className="mt-0.5 shrink-0 text-[#1A3C2B]">
            {ticket.source === "CALL" ? (
              <Phone className="w-3.5 h-3.5 text-[#1A3C2B]" />
            ) : (
              <MessageSquare className="w-3.5 h-3.5 text-[#1A3C2B]" />
            )}
          </div>
          <div>
            <p className="font-mono text-[10px] font-bold text-[#1A3C2B] tracking-wide mb-0.5">
              {ticket.ticketNumber}
            </p>
            <p className="font-sans font-medium text-[#1A3C2B] leading-snug">
              {truncate(ticket.subject, 50)}
            </p>
          </div>
        </div>
      </td>
      <td className="px-4 py-3.5">
        <p className="font-bold text-xs text-[#1A3C2B]">{ticket.customerName}</p>
        <p className="text-[10px] text-[#5A5A58]">{ticket.customerEmail}</p>
      </td>
      <td className="px-4 py-3.5">
        <SourceBadge source={ticket.source} />
      </td>
      <td className="px-4 py-3.5">
        <CategoryBadge category={ticket.category} />
      </td>
      <td className="px-4 py-3.5">
        <UrgencyBadge urgency={ticket.urgency} />
      </td>
      <td className="px-4 py-3.5">
        <SentimentBadge sentiment={ticket.sentiment} />
      </td>
      <td className="px-4 py-3.5">
        <StatusBadge status={ticket.status} />
      </td>
      <td className="px-4 py-3.5">
        <p className="text-[10px] text-[#5A5A58] whitespace-nowrap">
          {formatRelativeTime(ticket.createdAt)}
        </p>
      </td>
      <td className="px-4 py-3.5 text-right">
        <Link
          to={`/tickets/${ticket.id}`}
          className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#1A3C2B] text-[#9EFFBF] hover:bg-[#1A3C2B]/85 text-[9px] uppercase font-bold tracking-wider transition-colors"
        >
          <span>VIEW</span>
          <ArrowUpRight className="w-2.5 h-2.5" />
        </Link>
      </td>
    </tr>
  );
}

// ─── Ticket Card (mobile/compact view) ────────────────────────────────────────

export function TicketCard({ ticket }: { ticket: Ticket }) {
  return (
    <Link
      to={`/tickets/${ticket.id}`}
      className="relative block border border-[#3A3A38]/20 bg-white p-4 hover:border-[#1A3C2B] transition-colors"
    >
      <CornerMarkers size={6} />
      <div className="flex items-start justify-between gap-3 mb-2.5">
        <div className="flex-1 min-w-0 font-mono">
          <p className="text-[10px] font-bold text-[#1A3C2B] mb-0.5">
            {ticket.ticketNumber}
          </p>
          <p className="font-sans font-semibold leading-snug truncate text-[#1A3C2B]">
            {ticket.subject}
          </p>
          <p className="text-[10px] text-[#5A5A58] mt-0.5">
            {ticket.customerName} · {formatRelativeTime(ticket.createdAt)}
          </p>
        </div>
        <StatusBadge status={ticket.status} />
      </div>
      <div className="flex flex-wrap gap-1.5 pt-2 border-t border-[#3A3A38]/10">
        <SourceBadge source={ticket.source} />
        <CategoryBadge category={ticket.category} />
        <UrgencyBadge urgency={ticket.urgency} />
        <SentimentBadge sentiment={ticket.sentiment} />
      </div>
    </Link>
  );
}

// ─── Pagination (Technical Minimalist) ────────────────────────────────────────

interface PaginationProps {
  page: number;
  totalPages: number;
  total: number;
  limit: number;
  onChange: (page: number) => void;
}

export function Pagination({
  page,
  totalPages,
  total,
  limit,
  onChange,
}: PaginationProps) {
  if (totalPages <= 1) return null;
  const from = (page - 1) * limit + 1;
  const to = Math.min(page * limit, total);
  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono border border-[#3A3A38]/20 bg-white p-3">
      <p className="text-[#5A5A58] uppercase">
        SHOWING {from}–{to} OF {total} INGESTED RECORDS
      </p>
      <div className="flex items-center gap-2">
        <button
          disabled={page <= 1}
          onClick={() => onChange(page - 1)}
          className="px-3 py-1 border border-[#3A3A38]/30 text-[10px] font-mono uppercase tracking-wider text-[#1A3C2B] disabled:opacity-30 disabled:cursor-not-allowed hover:bg-[#F7F7F5] transition-colors"
        >
          [PREV]
        </button>
        <span className="px-2 py-1 bg-[#F7F7F5] border border-[#3A3A38]/20 text-[10px] font-mono text-[#1A3C2B] font-bold">
          PAGE {page} / {totalPages}
        </span>
        <button
          disabled={page >= totalPages}
          onClick={() => onChange(page + 1)}
          className="px-3 py-1 border border-[#3A3A38]/30 text-[10px] font-mono uppercase tracking-wider text-[#1A3C2B] disabled:opacity-30 disabled:cursor-not-allowed hover:bg-[#F7F7F5] transition-colors"
        >
          [NEXT]
        </button>
      </div>
    </div>
  );
}
