import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Trash2,
  Loader2,
  ChevronDown,
} from "lucide-react";
import type { Ticket, TicketStatus } from "@/types";
import { useDeleteTicket, useUpdateTicket } from "@/hooks/useTickets";
import {
  StatusBadge,
  SourceBadge,
  UrgencyBadge,
  CategoryBadge,
  SentimentBadge,
} from "./Badges";
import { AIAnalysisPanel, ResponseEditor } from "./AIPanel";
import { formatDate, formatRelativeTime, cn } from "@/lib/utils";
import { CornerMarkers } from "./TechnicalUI";

const STATUS_OPTIONS: TicketStatus[] = [
  "NEW",
  "ANALYZED",
  "IN_PROGRESS",
  "RESOLVED",
];

interface TicketDetailProps {
  ticket: Ticket;
  onDeleted?: () => void;
}

export function TicketDetail({ ticket, onDeleted }: TicketDetailProps) {
  const navigate = useNavigate();
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [showStatusMenu, setShowStatusMenu] = useState(false);

  const deleteMutation = useDeleteTicket();
  const updateMutation = useUpdateTicket(ticket.id);

  const handleDelete = async () => {
    if (!confirmDelete) {
      setConfirmDelete(true);
      return;
    }
    await deleteMutation.mutateAsync(ticket.id);
    if (onDeleted) {
      onDeleted();
    } else {
      navigate("/tickets");
    }
  };

  const handleStatusChange = async (status: TicketStatus) => {
    setShowStatusMenu(false);
    await updateMutation.mutateAsync({ status });
  };

  const isCall = ticket.source === "CALL";
  const transcript = ticket.callTranscript;

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* ── Top Bar / Breadcrumb ────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#3A3A38]/20 pb-4">
        <Link
          to="/tickets"
          className="inline-flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-widest text-[#5A5A58] hover:text-[#1A3C2B] transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>[QUEUE_RETURN]</span>
        </Link>

        <div className="flex items-center gap-2">
          {/* Status Change Selector */}
          <div className="relative">
            <button
              onClick={() => setShowStatusMenu((v) => !v)}
              className="inline-flex items-center gap-2 px-3 py-1.5 border border-[#3A3A38]/30 bg-white text-[10px] font-mono uppercase tracking-wider text-[#1A3C2B] hover:border-[#1A3C2B] transition-colors"
            >
              <span>STATUS: {ticket.status}</span>
              <ChevronDown className="w-3 h-3 text-[#5A5A58]" />
            </button>

            {showStatusMenu && (
              <div className="absolute right-0 top-full mt-1 w-44 bg-white border border-[#3A3A38]/30 z-20 font-mono text-[10px]">
                {STATUS_OPTIONS.map((s) => (
                  <button
                    key={s}
                    onClick={() => handleStatusChange(s)}
                    className={cn(
                      "w-full text-left px-3 py-2 uppercase hover:bg-[#F7F7F5] transition-colors flex items-center justify-between",
                      s === ticket.status ? "font-bold text-[#1A3C2B] bg-[#EFEFEA]" : "text-[#5A5A58]"
                    )}
                  >
                    <span>{s}</span>
                    {s === ticket.status && <span>✓</span>}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Delete Ticket Button */}
          <button
            id="delete-ticket-btn"
            onClick={handleDelete}
            disabled={deleteMutation.isPending}
            className={cn(
              "inline-flex items-center gap-1 px-3 py-1.5 border text-[10px] font-mono uppercase tracking-wider font-bold transition-colors",
              confirmDelete
                ? "bg-[#D94838] text-white border-[#D94838]"
                : "bg-white text-[#D94838] border-[#D94838]/40 hover:bg-[#D94838]/10"
            )}
          >
            {deleteMutation.isPending ? (
              <Loader2 className="w-3 h-3 animate-spin" />
            ) : (
              <Trash2 className="w-3 h-3" />
            )}
            <span>{confirmDelete ? "CONFIRM_DELETE?" : "DELETE"}</span>
          </button>
        </div>
      </div>

      {/* ── Ticket Identity Card ─────────────────────────────────────────────── */}
      <div className="relative bg-[#F7F7F5] border border-[#3A3A38]/20 p-6 sm:p-8 space-y-4">
        <CornerMarkers size={10} />

        <div className="flex flex-wrap items-center gap-3">
          <SourceBadge source={ticket.source} />
          <StatusBadge status={ticket.status} />
          <CategoryBadge category={ticket.category} />
          <UrgencyBadge urgency={ticket.urgency} />
          <SentimentBadge sentiment={ticket.sentiment} />
        </div>

        <div>
          <span className="text-[10px] font-mono text-[#5A5A58] uppercase">
            ID // #{ticket.ticketNumber}
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold font-['Space_Grotesk'] tracking-tight text-[#1A3C2B] mt-1">
            {ticket.subject}
          </h1>
        </div>

        {/* Customer & Timestamp Telemetry Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-[#3A3A38]/15 text-xs font-mono">
          <div>
            <p className="text-[9px] uppercase tracking-widest text-[#5A5A58]">CUSTOMER</p>
            <p className="font-bold text-[#1A3C2B] mt-0.5">{ticket.customerName}</p>
          </div>
          <div>
            <p className="text-[9px] uppercase tracking-widest text-[#5A5A58]">EMAIL</p>
            <p className="font-bold text-[#1A3C2B] mt-0.5 truncate">{ticket.customerEmail}</p>
          </div>
          <div>
            <p className="text-[9px] uppercase tracking-widest text-[#5A5A58]">INGESTED_AT</p>
            <p className="font-bold text-[#1A3C2B] mt-0.5">{formatDate(ticket.createdAt)}</p>
          </div>
          <div>
            <p className="text-[9px] uppercase tracking-widest text-[#5A5A58]">LAST_UPDATE</p>
            <p className="font-bold text-[#1A3C2B] mt-0.5">{formatRelativeTime(ticket.updatedAt)}</p>
          </div>
        </div>
      </div>

      {/* ── Content & Transcript Section ─────────────────────────────────────── */}
      <div className="relative bg-white border border-[#3A3A38]/20 p-6 space-y-4">
        <CornerMarkers size={8} />

        <div className="flex items-center justify-between border-b border-[#3A3A38]/15 pb-2">
          <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#1A3C2B]">
            {isCall ? "RAW_CALL_AUDIO_TRANSCRIPT" : "ORIGINAL_TICKET_CONTENT"}
          </span>
          {isCall && transcript?.duration && (
            <span className="text-[9px] font-mono text-[#5A5A58] uppercase">
              DURATION: {transcript.duration}s // SPEAKERS: {transcript.speakerCount}
            </span>
          )}
        </div>

        <div className="p-4 bg-[#F7F7F5] border border-[#3A3A38]/15 font-mono text-xs text-[#1A3C2B] leading-relaxed whitespace-pre-wrap">
          {ticket.content}
        </div>
      </div>

      {/* ── AI Analysis & Response Editor Bento ───────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AIAnalysisPanel ticket={ticket} />
        <ResponseEditor ticket={ticket} />
      </div>
    </div>
  );
}
