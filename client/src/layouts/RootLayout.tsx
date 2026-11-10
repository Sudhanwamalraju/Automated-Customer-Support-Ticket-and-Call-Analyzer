import { NavLink, Outlet, Link } from "react-router-dom";
import {
  Headphones,
  LayoutDashboard,
  Ticket,
  PlusCircle,
  Phone,
  BarChart3,
  ArrowUpRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useHealthCheck } from "@/hooks/useHealthCheck";

const navItems = [
  { to: "/", label: "01. OVERVIEW", icon: LayoutDashboard, end: true },
  { to: "/tickets", label: "02. TICKETS", icon: Ticket, end: false },
  { to: "/tickets/new", label: "03. NEW TICKET", icon: PlusCircle, end: true },
  { to: "/calls/new", label: "04. INGEST CALL", icon: Phone, end: true },
  { to: "/analytics", label: "05. ANALYTICS", icon: BarChart3, end: true },
];

export default function RootLayout() {
  const { data: health } = useHealthCheck();

  return (
    <div className="min-h-screen bg-mosaic text-[#1A3C2B] flex flex-col font-['Space_Grotesk'] antialiased">
      {/* ── Fixed Technical Top Header ────────────────────────────────────────── */}
      <header className="sticky top-0 z-50 h-16 bg-[#F7F7F5] border-b border-[#3A3A38]/20 px-4 sm:px-8 flex items-center justify-between">
        {/* Left: 32x32px Square Logo in #1A3C2B + Brand Title */}
        <div className="flex items-center gap-4">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-8 h-8 rounded-none bg-[#1A3C2B] flex items-center justify-center text-[#9EFFBF] border border-[#3A3A38]/20 transition-transform group-hover:scale-95">
              <Headphones className="w-4 h-4" />
            </div>
            <div>
              <p className="text-sm font-bold font-['Space_Grotesk'] tracking-tight text-[#1A3C2B] uppercase">
                SupportIQ
              </p>
              <p className="text-[9px] font-mono text-[#5A5A58] tracking-widest uppercase -mt-0.5">
                TECHNICAL_ANALYZER // C3
              </p>
            </div>
          </Link>
        </div>

        {/* Center: Monospaced Nav Links with Numerical Prefixes */}
        <nav className="hidden lg:flex items-center space-x-1">
          {navItems.map(({ to, label, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                cn(
                  "px-3 py-2 text-[10px] font-mono uppercase tracking-[0.12em] transition-colors border",
                  isActive
                    ? "bg-[#1A3C2B] text-[#9EFFBF] border-[#1A3C2B] font-bold"
                    : "text-[#5A5A58] border-transparent hover:text-[#1A3C2B] hover:border-[#3A3A38]/20 hover:bg-[#EFEFEA]"
                )
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>

        {/* Right: Live Status Indicator, Ghost Button, Solid Forest Button */}
        <div className="flex items-center gap-3">
          {/* Status Indicator */}
          <div className="hidden sm:inline-flex items-center gap-2 px-2.5 py-1 bg-white border border-[#3A3A38]/20 text-[10px] font-mono uppercase tracking-wider">
            <span
              className={cn(
                "w-2 h-2 rounded-none",
                health?.status === "ok" ? "bg-[#9EFFBF]" : "bg-[#FF8C69]"
              )}
            />
            <span className="text-[#1A3C2B]">
              {health?.status === "ok" ? "SYS_ONLINE // 5000" : "CONNECTING..."}
            </span>
          </div>

          {/* Ghost button (1px border) */}
          <Link
            to="/tickets"
            className="inline-flex items-center gap-1 px-3 py-1.5 border border-[#3A3A38]/30 hover:border-[#1A3C2B] bg-transparent text-[10px] font-mono uppercase tracking-widest text-[#1A3C2B] transition-colors"
          >
            <span>QUEUE</span>
            <ArrowUpRight className="w-3 h-3 text-[#5A5A58]" />
          </Link>

          {/* Solid Forest green button */}
          <Link
            to="/tickets/new"
            className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-[#1A3C2B] hover:bg-[#1A3C2B]/90 text-[#9EFFBF] text-[10px] font-mono uppercase tracking-widest font-bold border border-[#1A3C2B] transition-colors"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>+ NEW TICKET</span>
          </Link>
        </div>
      </header>

      {/* ── Mobile Secondary Navigation Bar ──────────────────────────────────── */}
      <div className="lg:hidden bg-[#EFEFEA] border-b border-[#3A3A38]/20 px-4 py-2 flex items-center gap-2 overflow-x-auto">
        {navItems.map(({ to, label, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              cn(
                "px-2.5 py-1 text-[9px] font-mono uppercase tracking-wider whitespace-nowrap border",
                isActive
                  ? "bg-[#1A3C2B] text-[#9EFFBF] border-[#1A3C2B] font-bold"
                  : "text-[#5A5A58] border-[#3A3A38]/15 bg-white"
              )
            }
          >
            {label}
          </NavLink>
        ))}
      </div>

      {/* ── Main Scroll View ─────────────────────────────────────────────────── */}
      <main className="flex-1 flex flex-col min-w-0">
        <Outlet />
      </main>

      {/* ── Section-Wide Technical Footer ────────────────────────────────────── */}
      <footer className="border-t border-[#3A3A38]/20 bg-[#F7F7F5] py-6 px-4 sm:px-8 mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px] font-mono uppercase tracking-widest text-[#5A5A58]">
          <div className="flex items-center gap-3">
            <span className="w-2 h-2 bg-[#1A3C2B]" />
            <span>SUPPORTIQ // SYSTEM BLUEPRINT SPECIFICATION 2026</span>
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <span>MODEL: CLAUDE-3.5-SONNET</span>
            <span className="text-[#3A3A38]/30">|</span>
            <span>STORE: POSTGRESQL // PRISMA</span>
            <span className="text-[#3A3A38]/30">|</span>
            <span className="text-[#1A3C2B] font-bold">PALETTE: PAPER + FOREST + GRID</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
