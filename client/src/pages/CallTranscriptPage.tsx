import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  ArrowLeft,
  Loader2,
  AlertCircle,
  Phone,
  Sparkles,
} from "lucide-react";
import { useCreateCall } from "@/hooks/useCalls";
import { cn } from "@/lib/utils";
import { CornerMarkers } from "@/components/TechnicalUI";

interface FormState {
  customerName: string;
  customerEmail: string;
  subject: string;
  transcript: string;
  callerPhone: string;
  duration: string;
}

const INITIAL: FormState = {
  customerName: "",
  customerEmail: "",
  subject: "",
  transcript: "",
  callerPhone: "",
  duration: "",
};

const SAMPLE_TRANSCRIPT = `Agent: Thank you for contacting Enterprise Cloud Support. My name is David. Who do I have the pleasure of speaking with?
Customer: Hi David, this is Maya Lin from Apex Logistics. Our webhook dispatch pipeline started failing with 504 gateway timeouts 20 minutes ago.
Agent: I see Maya, let me pull up your account telemetry. Are all webhook destinations affected or only specific endpoints?
Customer: It's all outbound queues across North America. Our order confirmations are stalled. This is a critical production blocker for us.
Agent: Understood. I am immediately escalating this to our Tier 3 infrastructure engineering squad and flagging high urgency.`;

const inputCls = cn(
  "w-full bg-white border border-[#3A3A38]/20 px-3.5 py-2 text-xs font-mono text-[#1A3C2B]",
  "placeholder:text-[#5A5A58]/70 focus:outline-none focus:border-[#1A3C2B] rounded-none transition-colors"
);

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

export default function CallTranscriptPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState<FormState>(INITIAL);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const createMutation = useCreateCall();

  const update = (field: keyof FormState, value: string) => {
    setForm((f) => ({ ...f, [field]: value }));
    setErrors((e) => ({ ...e, [field]: undefined }));
  };

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof FormState, string>> = {};
    if (!form.customerName.trim()) newErrors.customerName = "CUSTOMER NAME IS REQUIRED";
    if (!form.customerEmail.trim()) newErrors.customerEmail = "CUSTOMER EMAIL IS REQUIRED";
    else if (!/\S+@\S+\.\S+/.test(form.customerEmail))
      newErrors.customerEmail = "INVALID EMAIL FORMAT";
    if (!form.subject.trim()) newErrors.subject = "CALL SUBJECT IS REQUIRED";
    if (!form.transcript.trim() || form.transcript.trim().length < 20)
      newErrors.transcript = "TRANSCRIPT MUST BE AT LEAST 20 CHARACTERS";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      const result = await createMutation.mutateAsync({
        customerName: form.customerName.trim(),
        customerEmail: form.customerEmail.trim(),
        subject: form.subject.trim(),
        transcript: form.transcript.trim(),
        rawText: form.transcript.trim(),
        callerPhone: form.callerPhone.trim() || undefined,
        duration: form.duration ? parseInt(form.duration, 10) : undefined,
      });

      const ticketId = result.data?.id ?? (result as any).id;
      if (ticketId) navigate(`/tickets/${ticketId}`);
    } catch {
      // Handled via createMutation.error
    }
  };

  const loadSample = () => {
    setForm({
      customerName: "Maya Lin",
      customerEmail: "maya@apexlogistics.io",
      subject: "Production webhook timeout outage across North America",
      transcript: SAMPLE_TRANSCRIPT,
      callerPhone: "+1 (415) 890-1234",
      duration: "185",
    });
    setErrors({});
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
          <div className="border-b border-[#3A3A38]/20 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="inline-flex items-center gap-2 px-2.5 py-0.5 bg-white border border-[#3A3A38]/20 text-[9px] font-mono uppercase tracking-widest text-[#1A3C2B] mb-2">
                <span className="w-1.5 h-1.5 bg-[#9EFFBF]" />
                FORM_SPEC // AUDIO_INGEST_CTA
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold font-['Space_Grotesk'] tracking-tight text-[#1A3C2B] uppercase">
                INGEST CALL TRANSCRIPT
              </h1>
              <p className="text-xs font-mono text-[#5A5A58] mt-1 uppercase tracking-wider">
                PARSE RAW SPEAKER DIALOGUE INTO AN ANALYZED RELATIONAL TICKET
              </p>
            </div>

            <button
              type="button"
              onClick={loadSample}
              className="self-start sm:self-auto px-3 py-1.5 bg-white border border-[#3A3A38]/30 hover:border-[#1A3C2B] text-[9px] font-mono uppercase tracking-widest text-[#1A3C2B] transition-colors flex items-center gap-1.5"
            >
              <Sparkles className="w-3 h-3 text-[#1A3C2B]" />
              <span>LOAD_SAMPLE</span>
            </button>
          </div>

          {/* Submission Global Error Alert */}
          {createMutation.isError && (
            <div className="bg-[#D94838]/10 border border-[#D94838]/30 p-3 text-xs font-mono text-[#D94838] flex items-center gap-2 uppercase">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>
                {(createMutation.error as Error)?.message ?? "CALL_INGESTION_FAILED"}
              </span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Customer Details Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                label="01. CALLER_NAME"
                required
                error={errors.customerName}
              >
                <input
                  id="call-customer-name"
                  type="text"
                  placeholder="e.g. Maya Lin"
                  value={form.customerName}
                  onChange={(e) => update("customerName", e.target.value)}
                  className={inputCls}
                />
              </FormField>

              <FormField
                label="02. CALLER_EMAIL"
                required
                error={errors.customerEmail}
              >
                <input
                  id="call-customer-email"
                  type="email"
                  placeholder="maya@apexlogistics.io"
                  value={form.customerEmail}
                  onChange={(e) => update("customerEmail", e.target.value)}
                  className={inputCls}
                />
              </FormField>
            </div>

            {/* Subject */}
            <FormField label="03. CALL_TOPIC_SUBJECT" required error={errors.subject}>
              <input
                id="call-subject"
                type="text"
                placeholder="Enterprise webhook outage across North America"
                value={form.subject}
                onChange={(e) => update("subject", e.target.value)}
                className={inputCls}
              />
            </FormField>

            {/* Telemetry Row: Phone & Duration */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField label="04. TELEPHONY_NUMBER">
                <input
                  id="call-phone"
                  type="text"
                  placeholder="+1 (415) 890-1234"
                  value={form.callerPhone}
                  onChange={(e) => update("callerPhone", e.target.value)}
                  className={inputCls}
                />
              </FormField>

              <FormField label="05. CALL_DURATION (SEC)">
                <input
                  id="call-duration"
                  type="number"
                  min="0"
                  placeholder="185"
                  value={form.duration}
                  onChange={(e) => update("duration", e.target.value)}
                  className={inputCls}
                />
              </FormField>
            </div>

            {/* Transcript Text */}
            <FormField
              label="06. SPEAKER_LABELLED_TRANSCRIPT"
              required
              error={errors.transcript}
            >
              <textarea
                id="call-transcript"
                rows={7}
                placeholder="Agent: How can I help you today?&#10;Customer: Our payment authorization is failing..."
                value={form.transcript}
                onChange={(e) => update("transcript", e.target.value)}
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
                id="create-call-submit-btn"
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
                    <span>PARSING_AUDIO_LOG...</span>
                  </>
                ) : (
                  <>
                    <Phone className="w-3.5 h-3.5" />
                    <span>TRANSMIT &amp; ANALYZE</span>
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
