import React from 'react';
import { Terminal, ArrowRight, Activity, Lock, Cpu, Check, Download } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { useSettingsStore } from '@/store/useSettingsStore';
import { FormatPulseLogo } from '@/components/brand/FormatPulseLogo';
import { APP_VERSION } from '@/constants/version';
import { createTranslator } from '@/core/i18n';

export const HeroSection: React.FC = () => {
  const setViewMode = useAppStore((s) => s.setViewMode);
  const setShowDownloadModal = useAppStore((s) => s.setShowDownloadModal);
  const language = useSettingsStore((s) => s.language);
  const tr = createTranslator(language);

  return (
    <section className="relative w-full border-b border-zinc-800/80 bg-[#06070b] px-4 pt-28 pb-20 md:pt-36 md:pb-28 overflow-hidden select-none">
      {/* Spaceship Ambient Gradients & Glow Mesh */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1100px] h-[550px] bg-gradient-to-b from-accent/20 via-blue-600/10 to-transparent blur-[150px] pointer-events-none rounded-full" />
      <div className="absolute top-1/4 left-1/3 w-[500px] h-[350px] bg-emerald-500/10 blur-[130px] pointer-events-none rounded-full" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:2.5rem_2.5rem] [mask-image:radial-gradient(ellipse_70%_60%_at_50%_20%,#000_70%,transparent_100%)] pointer-events-none opacity-40" />

      <div className="max-w-5xl mx-auto relative z-10 flex flex-col items-center text-center">
        {/* ── Status Pill ───────────────────────────────────────────────────── */}
        <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-white/[0.04] border border-white/10 text-xs font-mono text-zinc-300 mb-8 backdrop-blur-md shadow-[0_4px_20px_rgba(0,0,0,0.5)]">
          <FormatPulseLogo size={16} animate={false} />
          <span className="text-accent font-semibold tracking-wider">{tr('hero_badge_label')}</span>
          <span className="text-zinc-600">//</span>
          <span className="text-zinc-400">{tr('hero_badge_sub')}</span>
        </div>

        {/* ── Main Heading with Breathing Room ──────────────────────────────── */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-white max-w-4xl font-sans leading-[1.12]">
          {tr('hero_h1')}
        </h1>

        {/* ── Subtitle ─────────────────────────────────────────────────────── */}
        <p className="mt-6 text-base sm:text-lg md:text-xl text-zinc-400 max-w-2xl font-mono leading-relaxed">
          {tr('hero_subtitle')}
        </p>

        {/* ── Hero CTAs — 2 Clear Actions ───────────────────────────────────── */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <button
            onClick={() => setViewMode('workspace')}
            className="flex items-center gap-2.5 h-12 px-8 bg-white hover:bg-zinc-100 text-zinc-950 font-mono text-xs font-bold tracking-tight transition-all rounded-full shadow-[0_0_35px_rgba(255,255,255,0.25)] hover:scale-[1.02] active:scale-[0.98] focus:outline-none"
          >
            <Terminal className="w-4 h-4 text-zinc-950" />
            <span>{tr('hero_cta_primary')}</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={() => setShowDownloadModal(true)}
            className="flex items-center gap-2.5 h-12 px-7 bg-zinc-900/80 hover:bg-zinc-800/90 border border-white/10 text-zinc-200 font-mono text-xs font-semibold transition-all rounded-full backdrop-blur-md hover:border-white/20 hover:scale-[1.01] active:scale-[0.99] focus:outline-none"
            title="Download FormatPulse native Windows x64 executable"
          >
            <Download className="w-4 h-4 text-accent" />
            <span>{tr('hero_cta_secondary')}</span>
          </button>
        </div>

        {/* ── Minimal Trust Indicators ──────────────────────────────────────── */}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-5 sm:gap-8 text-2xs font-mono text-zinc-400">
          <div className="flex items-center gap-2">
            <Lock className="w-3.5 h-3.5 text-emerald-400" />
            <span>{tr('hero_badge_gdpr')}</span>
          </div>
          <span className="text-zinc-700 hidden sm:inline">·</span>
          <div className="flex items-center gap-2">
            <Cpu className="w-3.5 h-3.5 text-accent" />
            <span>{tr('hero_badge_worker')}</span>
          </div>
          <span className="text-zinc-700 hidden sm:inline">·</span>
          <div className="flex items-center gap-2">
            <Activity className="w-3.5 h-3.5 text-blue-400" />
            <span>{tr('hero_badge_latency')}</span>
          </div>
          <span className="text-zinc-700 hidden sm:inline">·</span>
          <div className="flex items-center gap-2">
            <Check className="w-3.5 h-3.5 text-emerald-400" />
            <span>{tr('hero_badge_air')} (v{APP_VERSION})</span>
          </div>
        </div>
      </div>
    </section>
  );
};
