import { useState } from "react";
import { Database, Brain, Palette, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { CornerMarkers } from "@/components/TechnicalUI";

function Section({
  code,
  title,
  description,
  icon: Icon,
  children,
}: {
  code: string;
  title: string;
  description: string;
  icon: React.ElementType;
  children: React.ReactNode;
}) {
  return (
    <div className="relative bg-white border border-[#3A3A38]/20 p-6 space-y-4">
      <CornerMarkers size={8} />
      <div className="flex items-center justify-between border-b border-[#3A3A38]/15 pb-3">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 bg-[#F7F7F5] border border-[#3A3A38]/20 flex items-center justify-center text-[#1A3C2B]">
            <Icon className="w-3.5 h-3.5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[9px] font-mono text-[#5A5A58] uppercase">
                {code}
              </span>
              <h3 className="font-mono font-bold text-xs uppercase tracking-wider text-[#1A3C2B]">
                {title}
              </h3>
            </div>
            <p className="text-[10px] font-mono text-[#5A5A58] mt-0.5 uppercase">
              {description}
            </p>
          </div>
        </div>
      </div>
      <div className="space-y-4 pt-1 font-mono text-xs">{children}</div>
    </div>
  );
}

function ToggleRow({
  label,
  description,
  defaultChecked = false,
}: {
  label: string;
  description?: string;
  defaultChecked?: boolean;
}) {
  const [checked, setChecked] = useState(defaultChecked);
  return (
    <div className="flex items-center justify-between gap-4 p-3 bg-[#F7F7F5] border border-[#3A3A38]/15">
      <div>
        <p className="text-xs font-bold uppercase text-[#1A3C2B]">{label}</p>
        {description && (
          <p className="text-[10px] text-[#5A5A58] mt-0.5 uppercase">{description}</p>
        )}
      </div>
      <button
        role="switch"
        aria-checked={checked}
        onClick={() => setChecked((v) => !v)}
        className={cn(
          "px-3 py-1 border text-[10px] font-mono uppercase tracking-wider font-bold transition-colors rounded-none",
          checked
            ? "bg-[#1A3C2B] text-[#9EFFBF] border-[#1A3C2B]"
            : "bg-white text-[#5A5A58] border-[#3A3A38]/30"
        )}
      >
        {checked ? "[ENABLED]" : "[DISABLED]"}
      </button>
    </div>
  );
}

export default function SettingsPage() {
  const [model, setModel] = useState("claude-3-5-sonnet-20241022");
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-8 py-8 space-y-8">
      {/* ── Header Banner ─────────────────────────────────────────────────── */}
      <div className="relative bg-[#F7F7F5] border border-[#3A3A38]/20 p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <CornerMarkers size={10} />
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 bg-white border border-[#3A3A38]/20 text-[9px] font-mono uppercase tracking-widest text-[#1A3C2B] mb-2">
            <span className="w-1.5 h-1.5 bg-[#1A3C2B]" />
            SYSTEM_CONFIG // BLUEPRINT_SETTINGS
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold font-['Space_Grotesk'] tracking-tight text-[#1A3C2B] uppercase">
            SYSTEM DIAGNOSTICS &amp; CONFIG
          </h1>
          <p className="text-xs font-mono text-[#5A5A58] mt-1 uppercase tracking-wider">
            CONFIGURING ANTHROPIC INFERENCE ENGINE, PRISMA RELATIONAL STORAGE, AND EVENT HOOKS
          </p>
        </div>

        {saved && (
          <span className="px-3 py-1 bg-[#9EFFBF]/30 text-[#1A3C2B] border border-[#1A3C2B]/30 text-[10px] font-mono font-bold uppercase">
            SETTINGS_PERSISTED
          </span>
        )}
      </div>

      <div className="space-y-6">
        {/* Section 1: AI Model Configuration */}
        <Section
          code="[SYS_01]"
          title="Claude Model Inference Engine"
          description="Parameters for the Anthropic Claude analysis engine"
          icon={Brain}
        >
          <div className="space-y-1.5">
            <label className="text-[10px] uppercase font-bold tracking-wider text-[#1A3C2B] block">
              PRIMARY_MODEL_DESCRIPTOR
            </label>
            <select
              value={model}
              onChange={(e) => setModel(e.target.value)}
              className="w-full bg-white border border-[#3A3A38]/20 px-3 py-2 text-xs font-mono text-[#1A3C2B] focus:outline-none focus:border-[#1A3C2B] rounded-none uppercase"
            >
              <option value="claude-3-5-sonnet-20241022">
                CLAUDE 3.5 SONNET (RECOMMENDED // HIGH REASONING)
              </option>
              <option value="claude-3-haiku-20240307">
                CLAUDE 3 HAIKU (FAST TRIAGE // LOW LATENCY)
              </option>
            </select>
          </div>

          <ToggleRow
            label="DETERMINISTIC FALLBACK RESILIENCE"
            description="FALLBACK TO EMBEDDED DETERMINISTIC CLASSIFICATION IF API QUOTA EXCEEDED"
            defaultChecked={true}
          />
          <ToggleRow
            label="AUTOMATIC TRIAGE HOOK"
            description="TRIGGER AI ANALYSIS AUTOMATICALLY UPON INGESTION OF NEW TICKETS"
            defaultChecked={false}
          />
        </Section>

        {/* Section 2: PostgreSQL Database & Storage */}
        <Section
          code="[SYS_02]"
          title="Relational Database Pipeline"
          description="Prisma ORM schema state and indexing diagnostics"
          icon={Database}
        >
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 font-mono text-[10px]">
            <div className="p-3 bg-[#F7F7F5] border border-[#3A3A38]/15">
              <span className="text-[#5A5A58] block uppercase">PROVIDER</span>
              <span className="font-bold text-[#1A3C2B]">POSTGRESQL 16</span>
            </div>
            <div className="p-3 bg-[#F7F7F5] border border-[#3A3A38]/15">
              <span className="text-[#5A5A58] block uppercase">PORT</span>
              <span className="font-bold text-[#1A3C2B]">5432 (ACTIVE)</span>
            </div>
            <div className="p-3 bg-[#F7F7F5] border border-[#3A3A38]/15">
              <span className="text-[#5A5A58] block uppercase">ORM</span>
              <span className="font-bold text-[#1A3C2B]">PRISMA 6.1.0</span>
            </div>
          </div>

          <ToggleRow
            label="CASCADE RECORD DELETION"
            description="AUTOMATICALLY PURGE LINKED CALL TRANSCRIPTS WHEN PARENT TICKET IS REMOVED"
            defaultChecked={true}
          />
        </Section>

        {/* Section 3: Design System Tokens */}
        <Section
          code="[SYS_03]"
          title="Technical Minimalist Design Tokens"
          description="Aesthetic parameters governing negative space, hairlines, and typography"
          icon={Palette}
        >
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-[10px]">
            <div className="p-3 border border-[#3A3A38]/20 bg-[#F7F7F5]">
              <div className="w-4 h-4 bg-[#F7F7F5] border border-[#3A3A38]/30 mb-2" />
              <span className="font-bold text-[#1A3C2B]">PAPER #F7F7F5</span>
              <p className="text-[#5A5A58] text-[9px]">BACKGROUND</p>
            </div>
            <div className="p-3 border border-[#3A3A38]/20 bg-white">
              <div className="w-4 h-4 bg-[#1A3C2B] mb-2" />
              <span className="font-bold text-[#1A3C2B]">FOREST #1A3C2B</span>
              <p className="text-[#5A5A58] text-[9px]">PRIMARY BRAND</p>
            </div>
            <div className="p-3 border border-[#3A3A38]/20 bg-white">
              <div className="w-4 h-4 bg-[#9EFFBF] border border-[#1A3C2B]/30 mb-2" />
              <span className="font-bold text-[#1A3C2B]">MINT #9EFFBF</span>
              <p className="text-[#5A5A58] text-[9px]">ANALYZED ACCENT</p>
            </div>
            <div className="p-3 border border-[#3A3A38]/20 bg-white">
              <div className="w-4 h-4 bg-[#FF8C69] mb-2" />
              <span className="font-bold text-[#1A3C2B]">CORAL #FF8C69</span>
              <p className="text-[#5A5A58] text-[9px]">TRIAGE ACCENT</p>
            </div>
          </div>

          <p className="text-[10px] text-[#5A5A58] uppercase">
            TYPOGRAPHY: SPACE GROTESK (HEADERS) // GENERAL SANS / INTER (BODY) // JETBRAINS MONO (LABELS &amp; TELEMETRY)
          </p>
        </Section>

        {/* Save button */}
        <div className="pt-2 flex justify-end">
          <button
            onClick={handleSave}
            className="px-6 py-2.5 bg-[#1A3C2B] text-[#9EFFBF] font-mono text-xs uppercase tracking-widest font-bold border border-[#1A3C2B] hover:bg-[#1A3C2B]/90 transition-colors flex items-center gap-2"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>PERSIST_CONFIGURATION</span>
          </button>
        </div>
      </div>
    </div>
  );
}
