import { useState, useEffect } from "react";
import {
  Brain,
  RefreshCw,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Shield,
  Tag,
  TrendingUp,
  MessageCircle,
} from "lucide-react";
import type { Ticket } from "@/types";
import { formatConfidence } from "@/lib/utils";
import { cn } from "@/lib/utils";
import {
  CategoryBadge,
  UrgencyBadge,
  SentimentBadge,
} from "./Badges";
import { useAnalyzeTicket, useRegenerateResponse, useUpdateTicket } from "@/hooks/useTickets";
import { CornerMarkers } from "./TechnicalUI";

// ─── AI Analysis Panel (Technical Minimalist) ─────────────────────────────────

export function AIAnalysisPanel({ ticket }: { ticket: Ticket }) {
  const analyzeMutation = useAnalyzeTicket(ticket.id);
  const isAnalyzed = ticket.status !== "NEW" && ticket.category;

  return (
    <div className="relative bg-white border border-[#3A3A38]/20 p-6 space-y-5">
      <CornerMarkers size={8} />

      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#3A3A38]/15 pb-3">
        <div className="flex items-center gap-2">
          <Brain className="w-4 h-4 text-[#1A3C2B]" />
          <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-[#1A3C2B]">
            NEURAL_ANALYSIS // CLAUDE_3.5
          </h3>
        </div>
        {isAnalyzed && (
          <div className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-[#9EFFBF]/30 text-[#1A3C2B] border border-[#1A3C2B]/30 text-[9px] font-mono uppercase font-bold">
            <CheckCircle2 className="w-3 h-3 text-[#1A3C2B]" />
            <span>CLASSIFIED</span>
          </div>
        )}
      </div>

      <div>
        {!isAnalyzed ? (
          // ── Not analyzed yet ──
          <div className="text-center py-6 space-y-4">
            <div className="w-10 h-10 mx-auto bg-[#F7F7F5] border border-[#3A3A38]/20 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-[#1A3C2B]" />
            </div>
            <div>
              <p className="text-xs font-mono font-bold uppercase tracking-wider text-[#1A3C2B]">
                AWAITING_NEURAL_TRIAGE
              </p>
              <p className="text-[11px] font-mono text-[#5A5A58] mt-1 max-w-sm mx-auto uppercase">
                EXECUTE ANTHROPIC CLAUDE PIPELINE TO EXTRACT SENTIMENT, URGENCY, DOMAIN CATEGORY, AND ACTIONABLE DRAFT.
              </p>
            </div>
            <button
              id="analyze-ticket-btn"
              onClick={() => analyzeMutation.mutate()}
              disabled={analyzeMutation.isPending}
              className={cn(
                "px-5 py-2.5 bg-[#1A3C2B] text-[#9EFFBF] text-xs font-mono uppercase tracking-widest font-bold border border-[#1A3C2B]",
                "hover:bg-[#1A3C2B]/90 transition-colors inline-flex items-center gap-2 disabled:opacity-50"
              )}
            >
              {analyzeMutation.isPending ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Brain className="w-3.5 h-3.5" />
              )}
              {analyzeMutation.isPending ? "RUNNING_INFERENCE..." : "[EXECUTE_ANALYSIS]"}
            </button>
            {analyzeMutation.isError && (
              <p className="text-[10px] font-mono text-[#D94838] flex items-center justify-center gap-1 uppercase">
                <AlertCircle className="w-3 h-3" />
                {(analyzeMutation.error as Error).message}
              </p>
            )}
          </div>
        ) : (
          // ── Analysis Results ──
          <div className="space-y-5">
            {/* Confidence Score Bar */}
            <div className="bg-[#F7F7F5] border border-[#3A3A38]/15 p-3 space-y-2">
              <div className="flex items-center justify-between text-[10px] font-mono">
                <span className="text-[#5A5A58] uppercase flex items-center gap-1">
                  <Shield className="w-3 h-3 text-[#1A3C2B]" />
                  CONFIDENCE_METRIC
                </span>
                <span className="font-bold text-[#1A3C2B]">
                  {formatConfidence(ticket.aiConfidence)}
                </span>
              </div>
              <div className="h-1.5 bg-[#EFEFEA] border border-[#3A3A38]/20 w-full overflow-hidden">
                <div
                  className="h-full bg-[#1A3C2B] transition-all"
                  style={{
                    width: `${Math.round((ticket.aiConfidence ?? 0) * 100)}%`,
                  }}
                />
              </div>
            </div>

            {/* Triplet Grid: Category / Urgency / Sentiment */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="border border-[#3A3A38]/15 p-3 bg-white space-y-1.5">
                <p className="text-[9px] font-mono uppercase tracking-widest text-[#5A5A58] flex items-center gap-1">
                  <Tag className="w-2.5 h-2.5" />
                  CATEGORY
                </p>
                <div>
                  <CategoryBadge category={ticket.category} />
                </div>
              </div>

              <div className="border border-[#3A3A38]/15 p-3 bg-white space-y-1.5">
                <p className="text-[9px] font-mono uppercase tracking-widest text-[#5A5A58] flex items-center gap-1">
                  <TrendingUp className="w-2.5 h-2.5" />
                  URGENCY
                </p>
                <div>
                  <UrgencyBadge urgency={ticket.urgency} />
                </div>
              </div>

              <div className="border border-[#3A3A38]/15 p-3 bg-white space-y-1.5">
                <p className="text-[9px] font-mono uppercase tracking-widest text-[#5A5A58] flex items-center gap-1">
                  <MessageCircle className="w-2.5 h-2.5" />
                  SENTIMENT
                </p>
                <div>
                  <SentimentBadge sentiment={ticket.sentiment} />
                </div>
              </div>
            </div>

            {/* AI Summary */}
            {ticket.summary && (
              <div className="border border-[#3A3A38]/15 p-3 bg-white space-y-1.5">
                <p className="text-[9px] font-mono uppercase tracking-widest text-[#5A5A58]">
                  EXTRACTED_SUMMARY
                </p>
                <p className="text-xs font-mono text-[#1A3C2B] leading-relaxed">
                  {ticket.summary}
                </p>
              </div>
            )}

            {/* Extracted Tags */}
            {ticket.tags && ticket.tags.length > 0 && (
              <div className="flex flex-wrap items-center gap-1.5 pt-1">
                <span className="text-[9px] font-mono text-[#5A5A58] uppercase mr-1">
                  TAGS:
                </span>
                {ticket.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-0.5 border border-[#3A3A38]/20 bg-[#F7F7F5] text-[9px] font-mono text-[#1A3C2B] uppercase"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Response Editor (Technical Minimalist) ───────────────────────────────────

export function ResponseEditor({ ticket }: { ticket: Ticket }) {
  const [draft, setDraft] = useState(ticket.draftResponse ?? "");
  const [saved, setSaved] = useState(false);
  const [tone, setTone] = useState<"empathetic" | "formal" | "concise" | "technical">("empathetic");
  const [customInstructions, setCustomInstructions] = useState("");

  const updateMutation = useUpdateTicket(ticket.id);
  const regenMutation = useRegenerateResponse(ticket.id);

  useEffect(() => {
    if (ticket.draftResponse !== undefined && ticket.draftResponse !== null) {
      setDraft(ticket.draftResponse);
    }
  }, [ticket.id, ticket.draftResponse]);

  const handleSave = async () => {
    await updateMutation.mutateAsync({ draftResponse: draft });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleRegenerate = async () => {
    const result = await regenMutation.mutateAsync({
      tone,
      customInstructions: customInstructions.trim() || undefined,
    });
    if (result.data?.draftResponse) {
      setDraft(result.data.draftResponse);
    }
  };

  const hasAnalysis = Boolean(ticket.category);

  return (
    <div className="relative bg-white border border-[#3A3A38]/20 p-6 space-y-5">
      <CornerMarkers size={8} />

      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#3A3A38]/15 pb-3">
        <div className="flex items-center gap-2">
          <MessageCircle className="w-4 h-4 text-[#1A3C2B]" />
          <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-[#1A3C2B]">
            SYNTHESIZED_RESOLUTION_DRAFT
          </h3>
        </div>
        {saved && (
          <span className="text-[10px] font-mono uppercase text-[#1A3C2B] bg-[#9EFFBF]/30 px-2 py-0.5 border border-[#1A3C2B]/30 font-bold">
            SAVED_TO_POSTGRES
          </span>
        )}
      </div>

      {/* Tone Modulation Options */}
      {hasAnalysis && (
        <div className="bg-[#F7F7F5] border border-[#3A3A38]/15 p-3 space-y-2">
          <div className="flex items-center justify-between text-[9px] font-mono uppercase text-[#5A5A58]">
            <span>TONE_MODULATION</span>
            <span>CHOOSE SYNTHESIS PROFILE</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 font-mono text-[10px]">
            {(["empathetic", "formal", "concise", "technical"] as const).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setTone(t)}
                className={cn(
                  "py-1.5 px-2 border uppercase tracking-wider text-center transition-colors",
                  tone === t
                    ? "bg-[#1A3C2B] text-[#9EFFBF] border-[#1A3C2B] font-bold"
                    : "bg-white text-[#5A5A58] border-[#3A3A38]/20 hover:text-[#1A3C2B]"
                )}
              >
                [{t}]
              </button>
            ))}
          </div>

          <div className="pt-2">
            <input
              type="text"
              placeholder="OPTIONAL: CUSTOM PROMPT (E.G. 'OFFER 15% CREDIT')..."
              value={customInstructions}
              onChange={(e) => setCustomInstructions(e.target.value)}
              className="w-full bg-white border border-[#3A3A38]/20 px-3 py-1.5 text-[10px] font-mono text-[#1A3C2B] placeholder:text-[#5A5A58]/60 focus:outline-none focus:border-[#1A3C2B] rounded-none uppercase"
            />
          </div>
        </div>
      )}

      {/* Draft Textarea */}
      <div className="space-y-2">
        <textarea
          id="draft-response-editor"
          rows={6}
          placeholder="AI-generated draft response will populate here once analyzed..."
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          className="w-full bg-white border border-[#3A3A38]/20 p-3.5 text-xs font-mono text-[#1A3C2B] placeholder:text-[#5A5A58]/60 focus:outline-none focus:border-[#1A3C2B] rounded-none resize-y"
        />
      </div>

      {/* Action Footer */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-[#3A3A38]/15">
        {hasAnalysis && (
          <button
            id="regenerate-response-btn"
            onClick={handleRegenerate}
            disabled={regenMutation.isPending}
            className="px-3 py-1.5 border border-[#3A3A38]/30 hover:border-[#1A3C2B] bg-[#F7F7F5] text-[10px] font-mono uppercase tracking-widest text-[#1A3C2B] transition-colors flex items-center gap-1.5 disabled:opacity-50"
          >
            {regenMutation.isPending ? (
              <Loader2 className="w-3 h-3 animate-spin" />
            ) : (
              <RefreshCw className="w-3 h-3" />
            )}
            <span>REGENERATE_DRAFT</span>
          </button>
        )}

        <button
          id="save-draft-btn"
          onClick={handleSave}
          disabled={updateMutation.isPending}
          className="px-5 py-1.5 bg-[#1A3C2B] text-[#9EFFBF] hover:bg-[#1A3C2B]/90 text-[10px] font-mono uppercase tracking-widest font-bold border border-[#1A3C2B] transition-colors flex items-center gap-1.5 disabled:opacity-50 ml-auto"
        >
          {updateMutation.isPending ? (
            <Loader2 className="w-3 h-3 animate-spin" />
          ) : (
            <CheckCircle2 className="w-3 h-3" />
          )}
          <span>SAVE_RESPONSE</span>
        </button>
      </div>
    </div>
  );
}
