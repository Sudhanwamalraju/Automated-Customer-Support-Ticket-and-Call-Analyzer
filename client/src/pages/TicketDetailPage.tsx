import { useParams, useNavigate } from "react-router-dom";
import { useTicket } from "@/hooks/useTickets";
import { LoadingState, ErrorState } from "@/components/States";
import { TicketDetail } from "@/components/TicketDetail";

export default function TicketDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: ticket, isLoading, isError, error } = useTicket(id!);

  if (isLoading) return <LoadingState message="Loading ticket…" className="pt-20" />;
  if (isError || !ticket)
    return (
      <ErrorState
        message={(error as Error)?.message ?? "Ticket not found."}
        onRetry={() => navigate("/tickets")}
        className="pt-20"
      />
    );

  return (
    <div className="p-6 max-w-screen-xl mx-auto">
      <TicketDetail ticket={ticket} onDeleted={() => navigate("/tickets")} />
    </div>
  );
}
