import React from 'react';
import { Terminal, Shield, ArrowRight, Zap, Download } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';

export const LandingNav: React.FC = () => {
  const setViewMode = useAppStore((s) => s.setViewMode);
  const licenseTier = useAppStore((s) => s.licenseTier);
  const setShowLicenseModal = useAppStore((s) => s.setShowLicenseModal);

  return (
    <header className="sticky top-0 z-50 w-full h-12 bg-zinc-950/85 backdrop-blur-md border-b border-zinc-800/80 px-4 flex items-center justify-between select-none">
      {/* ── Brand ──────────────────────────────────────────────────────── */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setViewMode('workspace')}
          className="flex items-center gap-2 group text-left focus:outline-none"
        >
          <div className="w-2.5 h-2.5 rounded-full bg-accent group-hover:scale-110 transition-transform" />
          <span className="font-mono text-xs font-bold tracking-tight text-zinc-100">
            FORMATPULSE <span className="text-zinc-600 font-normal">// v1.2</span>
          </span>
        </button>

        <div className="hidden sm:flex items-center gap-1.5 px-2 py-0.5 rounded-sm bg-emerald-950/50 border border-emerald-800/60 text-emerald-400 text-2xs font-mono">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span>ZERO-SERVER ENGINE</span>
        </div>
      </div>

      {/* ── Navigation Links ───────────────────────────────────────────── */}
      <nav className="hidden md:flex items-center gap-6 text-xs font-mono text-zinc-400">
        <a href="#features" className="hover:text-zinc-100 transition-colors">
          // features
        </a>
        <a href="#security" className="hover:text-zinc-100 transition-colors">
          // security
        </a>
        <a href="#comparison" className="hover:text-zinc-100 transition-colors">
          // vs-cloud
        </a>
        <a href="#pricing" className="hover:text-zinc-100 transition-colors">
          // pricing
        </a>
        <a href="#faq" className="hover:text-zinc-100 transition-colors">
          // faq
        </a>
      </nav>

      {/* ── CTAs ───────────────────────────────────────────────────────── */}
      <div className="flex items-center gap-2">
        {licenseTier === 'pro' ? (
          <div className="flex items-center gap-1.5 px-2.5 h-7 bg-zinc-900 border border-emerald-800 text-emerald-400 text-2xs font-mono rounded-sm">
            <Shield className="w-3 h-3 text-emerald-400" />
            <span>PRO ACTIVE</span>
          </div>
        ) : (
          <button
            onClick={() => setShowLicenseModal(true)}
            className="hidden sm:flex items-center gap-1.5 h-7 px-2.5 text-2xs font-mono text-accent bg-accent/10 border border-accent/40 hover:bg-accent/20 transition-colors rounded-sm"
          >
            <Zap className="w-3 h-3" />
            <span>Lifetime $14</span>
          </button>
        )}

        <a
          href="https://github.com/psicossz29-netizen/FormatPulse/releases/download/v1.2.0/FormatPulse_1.2.0_x64-setup.exe"
          download="FormatPulse_1.2.0_x64-setup.exe"
          target="_blank"
          rel="noopener noreferrer"
          className="hidden md:flex items-center gap-1.5 h-7 px-2.5 text-2xs font-mono text-zinc-300 bg-zinc-900 border border-zinc-700 hover:bg-zinc-800 transition-colors rounded-sm"
          title="Direct download of FormatPulse native Windows x64 executable"
        >
          <Download className="w-3 h-3 text-accent" />
          <span>.exe v1.2</span>
        </a>

        <button
          onClick={() => setViewMode('workspace')}
          className="flex items-center gap-1.5 h-7 px-3 bg-zinc-100 hover:bg-white text-zinc-950 font-mono text-2xs font-semibold tracking-tight transition-colors rounded-sm focus:outline-none focus:ring-1 focus:ring-accent"
        >
          <Terminal className="w-3 h-3 text-zinc-950" />
          <span>Launch Workspace</span>
          <ArrowRight className="w-3 h-3" />
        </button>
      </div>
    </header>
  );
};
