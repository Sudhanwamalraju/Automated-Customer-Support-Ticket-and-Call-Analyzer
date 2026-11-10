import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Loader2, AlertCircle, CheckCircle2 } from "lucide-react";
import { useCreateTicket } from "@/hooks/useTickets";
import { cn } from "@/lib/utils";
import type { TicketSource } from "@/types";
import { CornerMarkers } from "@/components/TechnicalUI";

interface FormState {
  customerName: string;
  customerEmail: string;
  subject: string;
  content: string;
  source: TicketSource;
}

const INITIAL: FormState = {
  customerName: "",
  customerEmail: "",
  subject: "",
  content: "",
  source: "TICKET",
};

function FormField({
  label,
  required,
  error,
  children,
}: {
  label: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5 font-mono">
      {/* Monospaced label positioned directly above inputs */}
      <label className="text-[10px] font-bold uppercase tracking-widest text-[#1A3C2B] block">
        {label}
        {required && <span className="text-[#D94838] ml-1">*</span>}
      </label>
      {children}
      {error && (
        <p className="text-[10px] text-[#D94838] flex items-center gap-1 font-mono uppercase">
          <AlertCircle className="w-3 h-3" />
          {error}
        </p>
      )}
    </div>
  );
}

// Form fields use solid white backgrounds with 1px borders
const inputCls = cn(
  "w-full bg-white border border-[#3A3A38]/20 px-3.5 py-2 text-xs font-mono text-[#1A3C2B]",
  "placeholder:text-[#5A5A58]/70 focus:outline-none focus:border-[#1A3C2B] rounded-none transition-colors"
);

export default function NewTicketPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState<FormState>(INITIAL);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const createMutation = useCreateTicket();

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!form.customerName.trim()) {
      errs.customerName = "CUSTOMER NAME IS REQUIRED";
    }
    if (!form.customerEmail.trim()) {
      errs.customerEmail = "CUSTOMER EMAIL IS REQUIRED";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.customerEmail)) {
      errs.customerEmail = "INVALID EMAIL FORMAT";
    }
    if (!form.subject.trim()) {
      errs.subject = "SUBJECT LINE IS REQUIRED";
    }
    if (!form.content.trim()) {
      errs.content = "TICKET CONTENT IS REQUIRED";
    } else if (form.content.trim().length < 10) {
      errs.content = "CONTENT MUST CONTAIN AT LEAST 10 CHARACTERS";
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      const result = await createMutation.mutateAsync({
        customerName: form.customerName.trim(),
        customerEmail: form.customerEmail.trim(),
        subject: form.subject.trim(),
        content: form.content.trim(),
        source: form.source,
      });
      const ticketId = result.data?.id ?? (result as any).id;
      if (ticketId) navigate(`/tickets/${ticketId}`);
    } catch {
      // Handled via createMutation.error
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 space-y-8">
      {/* Back Link */}
      <div>
        <Link
          to="/tickets"
          className="inline-flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-widest text-[#5A5A58] hover:text-[#1A3C2B] transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>[BACK_TO_QUEUE]</span>
        </Link>
      </div>

      {/* ── Technical Form CTA (Centered 640px wide box) ─────────────────────── */}
      <div className="flex justify-center">
        <div className="w-full max-w-[640px] relative bg-[#F7F7F5] border border-[#3A3A38]/20 p-8 sm:p-10 space-y-6">
          <CornerMarkers size={10} />

          {/* Form Header */}
          <div className="border-b border-[#3A3A38]/20 pb-4">
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 bg-white border border-[#3A3A38]/20 text-[9px] font-mono uppercase tracking-widest text-[#1A3C2B] mb-2">
              <span className="w-1.5 h-1.5 bg-[#1A3C2B]" />
              FORM_SPEC // TICKET_INTAKE_CTA
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold font-['Space_Grotesk'] tracking-tight text-[#1A3C2B] uppercase">
              CREATE SUPPORT TICKET
            </h1>
            <p className="text-xs font-mono text-[#5A5A58] mt-1 uppercase tracking-wider">
              INGEST AN INCOMING CUSTOMER REQUEST INTO THE RELATIONAL AI QUEUE
            </p>
          </div>

          {/* Submission Global Error Alert */}
          {createMutation.isError && (
            <div className="bg-[#D94838]/10 border border-[#D94838]/30 p-3 text-xs font-mono text-[#D94838] flex items-center gap-2 uppercase">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>
                {(createMutation.error as Error)?.message ?? "SUBMISSION_REJECTED"}
              </span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Customer Details Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                label="01. CUSTOMER_NAME"
                required
                error={errors.customerName}
              >
                <input
                  id="ticket-customer-name"
                  type="text"
                  placeholder="e.g. Alex Chen"
                  value={form.customerName}
                  onChange={(e) =>
                    setForm({ ...form, customerName: e.target.value })
                  }
                  className={inputCls}
                />
              </FormField>

              <FormField
                label="02. CUSTOMER_EMAIL"
                required
                error={errors.customerEmail}
              >
                <input
                  id="ticket-customer-email"
                  type="email"
                  placeholder="alex@enterprise.com"
                  value={form.customerEmail}
                  onChange={(e) =>
                    setForm({ ...form, customerEmail: e.target.value })
                  }
                  className={inputCls}
                />
              </FormField>
            </div>

            {/* Subject */}
            <FormField label="03. ISSUE_SUBJECT" required error={errors.subject}>
              <input
                id="ticket-subject"
                type="text"
                placeholder="Brief summary of customer inquiry or failure"
                value={form.subject}
                onChange={(e) => setForm({ ...form, subject: e.target.value })}
                className={inputCls}
              />
            </FormField>

            {/* Source */}
            <FormField label="04. INGESTION_SOURCE">
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setForm({ ...form, source: "TICKET" })}
                  className={cn(
                    "py-2 px-3 border text-[10px] font-mono uppercase tracking-wider text-center transition-colors",
                    form.source === "TICKET"
                      ? "bg-[#1A3C2B] text-[#9EFFBF] border-[#1A3C2B] font-bold"
                      : "bg-white text-[#5A5A58] border-[#3A3A38]/20 hover:text-[#1A3C2B]"
                  )}
                >
                  [TICKET // WRITTEN]
                </button>
                <button
                  type="button"
                  onClick={() => setForm({ ...form, source: "CALL" })}
                  className={cn(
                    "py-2 px-3 border text-[10px] font-mono uppercase tracking-wider text-center transition-colors",
                    form.source === "CALL"
                      ? "bg-[#1A3C2B] text-[#9EFFBF] border-[#1A3C2B] font-bold"
                      : "bg-white text-[#5A5A58] border-[#3A3A38]/20 hover:text-[#1A3C2B]"
                  )}
                >
                  [CALL // AUDIO_LOG]
                </button>
              </div>
            </FormField>

            {/* Content */}
            <FormField
              label="05. INTERACTION_PAYLOAD"
              required
              error={errors.content}
            >
              <textarea
                id="ticket-content"
                rows={5}
                placeholder="Enter complete customer message text or support dialogue..."
                value={form.content}
                onChange={(e) => setForm({ ...form, content: e.target.value })}
                className={cn(inputCls, "resize-y")}
              />
            </FormField>

            {/* Actions */}
            <div className="pt-4 border-t border-[#3A3A38]/20 flex items-center justify-between">
              <button
                type="button"
                onClick={() => navigate("/tickets")}
                className="px-4 py-2 border border-[#3A3A38]/20 text-[10px] font-mono uppercase tracking-widest text-[#5A5A58] hover:text-[#1A3C2B] transition-colors"
              >
                [CANCEL]
              </button>

              <button
                id="create-ticket-submit-btn"
                type="submit"
                disabled={createMutation.isPending}
                className={cn(
                  "px-6 py-2.5 bg-[#1A3C2B] text-[#9EFFBF] text-xs font-mono uppercase tracking-widest font-bold border border-[#1A3C2B]",
                  "hover:bg-[#1A3C2B]/90 transition-colors flex items-center gap-2 disabled:opacity-50"
                )}
              >
                {createMutation.isPending ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>INGESTING...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>TRANSMIT TICKET</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
