import {
  CheckCircle2,
  XCircle,
  Loader2,
  Server,
  ArrowRight,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useHealthCheck } from "@/hooks/useHealthCheck";
import { CornerMarkers, NetworkTopologyGraph, BentoFeatureGrid } from "@/components/TechnicalUI";

export default function HomePage() {
  const { data: health, isLoading, isError } = useHealthCheck();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-10 space-y-12">
      {/* ── Technical Hero ─────────────────────────────────────────────────── */}
      <section className="relative bg-[#F7F7F5] border border-[#3A3A38]/20 p-8 sm:p-12">
        <CornerMarkers size={10} />
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-5">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white border border-[#1A3C2B]/30 text-[10px] font-mono uppercase tracking-[0.15em] text-[#1A3C2B]">
              <span className="w-2 h-2 bg-[#1A3C2B]" />
              NEURAL_ANALYSIS_FRAMEWORK // V2.4
            </div>

            <h1 className="text-5xl sm:text-7xl font-bold font-['Space_Grotesk'] text-[#1A3C2B] tracking-tight leading-[0.92] uppercase">
              AUTOMATED TICKET
              <br />
              <span className="text-[#1A3C2B]/80">&amp; CALL ANALYZER</span>
            </h1>

            <div className="border-l-2 border-[#1A3C2B] pl-4 py-1">
              <p className="text-xs sm:text-sm font-mono uppercase tracking-widest text-[#1A3C2B] leading-relaxed">
                TECHNICAL BLUEPRINT DESIGN SYSTEM. PARSING SUPPORT CONVERSATIONS WITH RELATIONAL STRUCTURE AND ANTHROPIC CLAUDE INFERENCE.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Link
                to="/tickets"
                className="px-5 py-2.5 bg-[#1A3C2B] text-[#9EFFBF] font-mono text-xs uppercase tracking-widest font-bold border border-[#1A3C2B] hover:bg-[#1A3C2B]/90 transition-colors flex items-center gap-2"
              >
                <span>OPEN SYSTEM WORKSPACE</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          <div className="lg:col-span-5 flex justify-center">
            <NetworkTopologyGraph />
          </div>
        </div>
      </section>

      {/* ── Bento Architecture ──────────────────────────────────────────────── */}
      <BentoFeatureGrid />

      {/* ── Server Telemetry ────────────────────────────────────────────────── */}
      <section className="max-w-xl mx-auto">
        <div className="relative bg-white border border-[#3A3A38]/20 p-6 space-y-4">
          <CornerMarkers size={8} />
          <div className="flex items-center justify-between border-b border-[#3A3A38]/15 pb-2">
            <div className="flex items-center gap-2">
              <Server className="w-4 h-4 text-[#1A3C2B]" />
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#1A3C2B]">
                REST_BACKEND_TELEMETRY
              </span>
            </div>
            <span className="text-[10px] font-mono text-[#5A5A58] uppercase">
              PORT: 5000
            </span>
          </div>

          <div>
            {isLoading ? (
              <div className="flex items-center justify-center gap-3 py-4">
                <Loader2 className="w-4 h-4 animate-spin text-[#1A3C2B]" />
                <span className="text-xs font-mono uppercase text-[#5A5A58]">
                  PINGING_SERVER...
                </span>
              </div>
            ) : isError ? (
              <div className="p-4 bg-[#D94838]/10 border border-[#D94838]/30 text-xs font-mono text-[#D94838] flex items-center gap-2 uppercase">
                <XCircle className="w-4 h-4 shrink-0" />
                <span>SERVER_DISCONNECTED // CHECK_LOCALHOST_5000</span>
              </div>
            ) : (
              <div className="space-y-3 font-mono text-xs">
                <div className="p-3 bg-[#9EFFBF]/20 border border-[#1A3C2B]/30 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#1A3C2B]" />
                    <span className="font-bold text-[#1A3C2B] uppercase">SERVER_ACTIVE // OK</span>
                  </div>
                  <span className="text-[10px] text-[#1A3C2B] uppercase">
                    UPTIME: {health?.uptime ? `${Math.floor(health.uptime)}s` : "ONLINE"}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
