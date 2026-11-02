import React from 'react';
import { Terminal, Shield, ArrowRight, Zap, Download } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { FormatPulseLogo } from '@/components/brand/FormatPulseLogo';

export const LandingNav: React.FC = () => {
  const setViewMode = useAppStore((s) => s.setViewMode);
  const licenseTier = useAppStore((s) => s.licenseTier);
  const setShowLicenseModal = useAppStore((s) => s.setShowLicenseModal);
  const setShowDownloadModal = useAppStore((s) => s.setShowDownloadModal);

  return (
    <header className="sticky top-0 z-50 w-full h-12 bg-zinc-950/85 backdrop-blur-md border-b border-zinc-800/80 px-4 flex items-center justify-between select-none">
      {/* ── Brand ──────────────────────────────────────────────────────── */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setViewMode('workspace')}
          className="flex items-center focus:outline-none"
        >
          <FormatPulseLogo size={26} showText={true} version="v1.2" />
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

        <button
          onClick={() => setShowDownloadModal(true)}
          className="hidden md:flex items-center gap-1.5 h-7 px-2.5 text-2xs font-mono text-zinc-300 bg-zinc-900 border border-zinc-700 hover:bg-zinc-800 transition-colors rounded-sm focus:outline-none"
          title="Download FormatPulse native Windows x64 executable"
        >
          <Download className="w-3 h-3 text-accent" />
          <span>.exe v1.2.1</span>
        </button>

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
