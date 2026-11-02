import React from 'react';
import { Terminal, Shield, ArrowRight, Zap, Download } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { FormatPulseLogo } from '@/components/brand/FormatPulseLogo';
import { APP_VERSION } from '@/constants/version';

export const LandingNav: React.FC = () => {
  const setViewMode = useAppStore((s) => s.setViewMode);
  const licenseTier = useAppStore((s) => s.licenseTier);
  const setShowLicenseModal = useAppStore((s) => s.setShowLicenseModal);
  const setShowDownloadModal = useAppStore((s) => s.setShowDownloadModal);

  return (
    <div className="sticky top-0 z-50 w-full px-3 pt-3 pb-1 flex justify-center pointer-events-none select-none">
      <header className="pointer-events-auto w-full max-w-6xl h-12 md:h-13 rounded-full bg-zinc-950/80 border border-white/10 backdrop-blur-xl shadow-[0_10px_35px_rgba(0,0,0,0.6)] px-4 md:px-6 flex items-center justify-between transition-all">
        {/* ── Brand ──────────────────────────────────────────────────────── */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setViewMode('workspace')}
            className="flex items-center focus:outline-none group"
            title="FormatPulse Home"
          >
            <FormatPulseLogo size={24} showText={true} version={`v${APP_VERSION}`} />
          </button>

          <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-950/40 border border-emerald-500/30 text-emerald-400 text-3xs font-mono tracking-wider">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>ZERO-SERVER ENGINE</span>
          </div>
        </div>

        {/* ── Navigation Links ───────────────────────────────────────────── */}
        <nav className="hidden md:flex items-center gap-5 lg:gap-6 text-xs font-mono text-zinc-400">
          <a href="#features" className="hover:text-white transition-colors">
            // features
          </a>
          <a href="#workspace-sandbox" className="hover:text-white transition-colors text-accent/90">
            // sandbox
          </a>
          <a href="#security" className="hover:text-white transition-colors">
            // security
          </a>
          <a href="#comparison" className="hover:text-white transition-colors">
            // vs-cloud
          </a>
          <a href="#pricing" className="hover:text-white transition-colors">
            // pricing
          </a>
          <a href="#installer" className="hover:text-white transition-colors">
            // desktop
          </a>
          <a href="#faq" className="hover:text-white transition-colors">
            // faq
          </a>
        </nav>

        {/* ── CTAs ───────────────────────────────────────────────────────── */}
        <div className="flex items-center gap-2">
          {licenseTier !== 'free' ? (
            <div className="flex items-center gap-1.5 px-3 h-8 bg-zinc-900/90 border border-emerald-700/60 text-emerald-400 text-2xs font-mono rounded-full">
              <Shield className="w-3 h-3 text-emerald-400" />
              <span>PRO ACTIVE</span>
            </div>
          ) : (
            <button
              onClick={() => setShowLicenseModal(true)}
              className="hidden sm:flex items-center gap-1.5 h-8 px-3 text-2xs font-mono text-accent bg-accent/10 border border-accent/40 hover:bg-accent/20 transition-all rounded-full"
            >
              <Zap className="w-3 h-3" />
              <span>Lifetime $14</span>
            </button>
          )}

          <button
            onClick={() => setShowDownloadModal(true)}
            className="hidden sm:flex items-center gap-1.5 h-8 px-3 text-2xs font-mono text-zinc-200 bg-white/[0.05] border border-white/10 hover:bg-white/[0.1] hover:border-white/20 transition-all rounded-full focus:outline-none"
            title="Download FormatPulse native Windows x64 executable"
          >
            <Download className="w-3 h-3 text-accent" />
            <span>.exe v{APP_VERSION}</span>
          </button>

          <button
            onClick={() => setViewMode('workspace')}
            className="flex items-center gap-1.5 h-8 px-4 bg-white hover:bg-zinc-100 text-zinc-950 font-mono text-2xs font-bold tracking-tight transition-all rounded-full shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:scale-[1.02] active:scale-[0.98] focus:outline-none"
          >
            <Terminal className="w-3 h-3 text-zinc-950" />
            <span>Launch Workspace</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      </header>
    </div>
  );
};
