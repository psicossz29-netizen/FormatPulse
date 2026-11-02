import React, { useState } from 'react';
import { Terminal, Shield, Download, Menu, X, Zap } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { useSettingsStore } from '@/store/useSettingsStore';
import { FormatPulseLogo } from '@/components/brand/FormatPulseLogo';
import { APP_VERSION } from '@/constants/version';
import { createTranslator, type Language } from '@/core/i18n';

const NAV_LINKS = [
  { href: '#use-cases',  labelKey: 'nav_how_it_works' as const },
  { href: '#security',   labelKey: 'nav_privacy'      as const },
  { href: '#pricing',    labelKey: 'nav_pricing'       as const },
  { href: '#installer',  labelKey: 'nav_download'      as const },
] as const;

export const LandingNav: React.FC = () => {
  const setViewMode       = useAppStore((s) => s.setViewMode);
  const licenseTier       = useAppStore((s) => s.licenseTier);
  const setShowLicenseModal  = useAppStore((s) => s.setShowLicenseModal);
  const setShowDownloadModal = useAppStore((s) => s.setShowDownloadModal);

  const language    = useSettingsStore((s) => s.language);
  const setLanguage = useSettingsStore((s) => s.setLanguage);
  const tr = createTranslator(language);

  const [mobileOpen, setMobileOpen] = useState(false);

  const toggleLanguage = () => {
    const next: Language = language === 'es' ? 'en' : 'es';
    setLanguage(next);
  };

  return (
    <>
      {/* ── Floating Pill Navbar ──────────────────────────────────────────── */}
      <div className="sticky top-0 z-50 w-full px-3 pt-3 pb-1 flex justify-center pointer-events-none select-none">
        <header className="pointer-events-auto w-full max-w-6xl h-12 md:h-13 rounded-full bg-zinc-950/85 border border-white/10 backdrop-blur-xl shadow-[0_10px_35px_rgba(0,0,0,0.65)] px-4 md:px-6 flex items-center justify-between transition-all">

          {/* ── Brand ───────────────────────────────────────────────────── */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setViewMode('landing')}
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

          {/* ── Desktop Nav Links ────────────────────────────────────────── */}
          <nav className="hidden md:flex items-center gap-4 lg:gap-6 text-xs font-mono text-zinc-400" aria-label="Main navigation">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="hover:text-white transition-colors py-1"
                onClick={() => setMobileOpen(false)}
              >
                {tr(link.labelKey)}
              </a>
            ))}
          </nav>

          {/* ── Desktop CTAs + Language Toggle ──────────────────────────── */}
          <div className="flex items-center gap-2">
            {/* Language pill */}
            <button
              onClick={toggleLanguage}
              className="hidden sm:flex items-center gap-0.5 h-7 px-2.5 text-2xs font-mono font-semibold text-zinc-400 bg-white/[0.04] border border-white/10 hover:bg-white/[0.08] hover:text-zinc-200 hover:border-white/20 transition-all rounded-full focus:outline-none"
              title="Switch language"
              aria-label="Toggle language"
            >
              <span className={language === 'es' ? 'text-white' : 'text-zinc-500'}>ES</span>
              <span className="text-zinc-600 mx-0.5">|</span>
              <span className={language === 'en' ? 'text-white' : 'text-zinc-500'}>EN</span>
            </button>

            {/* PRO status or Upgrade button */}
            {licenseTier !== 'free' ? (
              <div className="flex items-center gap-1.5 px-3 h-8 bg-zinc-900/90 border border-emerald-700/60 text-emerald-400 text-2xs font-mono rounded-full">
                <Shield className="w-3 h-3 text-emerald-400" />
                <span>{tr('nav_pro_active')}</span>
              </div>
            ) : (
              <button
                onClick={() => setShowLicenseModal(true)}
                className="hidden sm:flex items-center gap-1.5 h-8 px-3 text-2xs font-mono text-accent bg-accent/10 border border-accent/40 hover:bg-accent/20 transition-all rounded-full focus:outline-none"
              >
                <Zap className="w-3 h-3" />
                <span>{tr('nav_lifetime')}</span>
              </button>
            )}

            {/* Download .exe */}
            <button
              onClick={() => setShowDownloadModal(true)}
              className="hidden sm:flex items-center gap-1.5 h-8 px-3 text-2xs font-mono text-zinc-200 bg-white/[0.05] border border-white/10 hover:bg-white/[0.1] hover:border-white/20 transition-all rounded-full focus:outline-none"
              title="Download FormatPulse native Windows x64 executable"
            >
              <Download className="w-3 h-3 text-accent" />
              <span>.exe v{APP_VERSION}</span>
            </button>

            {/* Primary CTA: Launch Workspace */}
            <button
              onClick={() => setViewMode('workspace')}
              className="flex items-center gap-1.5 h-8 px-4 bg-white hover:bg-zinc-100 text-zinc-950 font-mono text-2xs font-bold tracking-tight transition-all rounded-full shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:scale-[1.02] active:scale-[0.98] focus:outline-none"
            >
              <Terminal className="w-3 h-3 text-zinc-950" />
              <span>{tr('nav_launch')}</span>
            </button>

            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileOpen((v) => !v)}
              className="md:hidden flex items-center justify-center w-8 h-8 rounded-full bg-white/[0.05] border border-white/10 text-zinc-400 hover:text-white focus:outline-none transition-all"
              aria-label="Toggle mobile menu"
            >
              {mobileOpen ? <X className="w-3.5 h-3.5" /> : <Menu className="w-3.5 h-3.5" />}
            </button>
          </div>
        </header>
      </div>

      {/* ── Mobile Drawer ────────────────────────────────────────────────────── */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 bg-zinc-950/95 backdrop-blur-xl flex flex-col pt-20 px-6 pb-8 gap-4 md:hidden">
          <nav className="flex flex-col gap-3" aria-label="Mobile navigation">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-base font-mono text-zinc-300 hover:text-white transition-colors py-2 border-b border-zinc-800/60"
                onClick={() => setMobileOpen(false)}
              >
                {tr(link.labelKey)}
              </a>
            ))}
          </nav>

          <div className="flex flex-col gap-3 mt-4">
            {/* Language toggle mobile */}
            <button
              onClick={toggleLanguage}
              className="flex items-center justify-center gap-1 h-11 rounded-xl bg-white/[0.04] border border-white/10 font-mono text-sm text-zinc-300"
            >
              <span className={language === 'es' ? 'text-white font-bold' : 'text-zinc-500'}>ES</span>
              <span className="text-zinc-600 mx-1">|</span>
              <span className={language === 'en' ? 'text-white font-bold' : 'text-zinc-500'}>EN</span>
            </button>

            <button
              onClick={() => { setViewMode('workspace'); setMobileOpen(false); }}
              className="flex items-center justify-center gap-2 h-12 rounded-xl bg-white text-zinc-950 font-mono text-sm font-bold"
            >
              <Terminal className="w-4 h-4" />
              {tr('nav_launch')}
            </button>

            <button
              onClick={() => { setShowDownloadModal(true); setMobileOpen(false); }}
              className="flex items-center justify-center gap-2 h-12 rounded-xl bg-zinc-900 border border-white/10 text-zinc-200 font-mono text-sm font-semibold"
            >
              <Download className="w-4 h-4 text-accent" />
              {tr('nav_download')} v{APP_VERSION}
            </button>

            {licenseTier === 'free' && (
              <button
                onClick={() => { setShowLicenseModal(true); setMobileOpen(false); }}
                className="flex items-center justify-center gap-2 h-12 rounded-xl bg-accent/10 border border-accent/40 text-accent font-mono text-sm font-semibold"
              >
                <Zap className="w-4 h-4" />
                {tr('nav_lifetime')}
              </button>
            )}
          </div>
        </div>
      )}
    </>
  );
};
