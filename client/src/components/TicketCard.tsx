import { Link } from "react-router-dom";
import type { Ticket } from "@/types";
import { formatRelativeTime } from "@/lib/utils";
import {
  StatusBadge,
  UrgencyBadge,
  SentimentBadge,
  CategoryBadge,
  SourceBadge,
} from "./Badges";
import { CornerMarkers } from "./TechnicalUI";

interface TicketCardProps {
  ticket: Ticket;
  className?: string;
}

export function TicketCard({ ticket, className = "" }: TicketCardProps) {
  return (
    <Link
      to={`/tickets/${ticket.id}`}
      className={`relative block border border-[#3A3A38]/20 bg-white p-5 hover:border-[#1A3C2B] transition-colors group ${className}`}
    >
      <CornerMarkers size={8} />

      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex-1 min-w-0 font-mono">
          <p className="text-[10px] font-bold text-[#1A3C2B] uppercase tracking-wider mb-1">
            #{ticket.ticketNumber}
          </p>
          <p className="font-sans font-bold text-sm leading-snug truncate text-[#1A3C2B]">
            {ticket.subject}
          </p>
          <p className="text-[10px] text-[#5A5A58] mt-1 uppercase">
            {ticket.customerName} · {formatRelativeTime(ticket.createdAt)}
          </p>
        </div>
        <StatusBadge status={ticket.status} />
      </div>

      <div className="flex flex-wrap gap-1.5 pt-3 border-t border-[#3A3A38]/15">
        <SourceBadge source={ticket.source} />
        <CategoryBadge category={ticket.category} />
        <UrgencyBadge urgency={ticket.urgency} />
        <SentimentBadge sentiment={ticket.sentiment} />
      </div>
    </Link>
  );
}

export default TicketCard;
