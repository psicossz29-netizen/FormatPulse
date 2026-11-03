import React, { useState, useEffect } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { useSettingsStore } from '@/store/useSettingsStore';
import { FormatPulseLogo } from '@/components/brand/FormatPulseLogo';
import { APP_VERSION } from '@/constants/version';
import { createTranslator, type Language } from '@/core/i18n';
import { Terminal, Download, Search, Sun, Moon, Menu, X, ChevronDown, Shield } from 'lucide-react';

interface LandingNavProps {
  onOpenCommandPalette?: () => void;
}

export const LandingNav: React.FC<LandingNavProps> = ({ onOpenCommandPalette }) => {
  const setViewMode = useAppStore((s) => s.setViewMode);
  const licenseTier = useAppStore((s) => s.licenseTier);
  const setShowDownloadModal = useAppStore((s) => s.setShowDownloadModal);

  const language = useSettingsStore((s) => s.language);
  const setLanguage = useSettingsStore((s) => s.setLanguage);
  const tr = createTranslator(language);

  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const savedTheme = localStorage.getItem('fp-theme') as 'dark' | 'light' | null;
    const initialTheme = savedTheme || 'dark';
    setTheme(initialTheme);
    document.documentElement.dataset.theme = initialTheme;
  }, []);

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    document.documentElement.dataset.theme = next;
    try {
      localStorage.setItem('fp-theme', next);
    } catch {
      // ignore
    }
  };

  const toggleLanguage = () => {
    const next: Language = language === 'es' ? 'en' : 'es';
    setLanguage(next);
  };

  const isMac = typeof navigator !== 'undefined' && /Mac|iPhone|iPad/.test(navigator.platform);

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        scrolled
          ? 'bg-[#09090B]/85 backdrop-blur-md border-b border-[#26262C] shadow-[0_12px_40px_rgba(0,0,0,0.5)]'
          : 'bg-transparent border-b border-transparent'
      }`}
    >
      <div className="max-w-[1160px] mx-auto px-5 h-[68px] flex items-center justify-between gap-6">
        {/* Brand */}
        <a
          href="#top"
          className="flex items-center gap-2.5 font-display font-bold text-lg text-[#F4F4F5] tracking-tight group focus:outline-none"
          aria-label="FormatPulse Home"
        >
          <FormatPulseLogo size={26} animate={false} />
          <span>FormatPulse</span>
          <span className="text-[10px] font-mono text-[#9A9AA5] px-1.5 py-0.5 rounded border border-[#26262C] bg-[#111114]">
            v{APP_VERSION}
          </span>
        </a>

        {/* Desktop Mega Menu Navigation */}
        <nav className="hidden lg:flex items-center gap-1 font-geist text-[0.92rem] font-medium text-[#9A9AA5]" aria-label="Main Navigation">
          {/* Producto */}
          <div
            className="relative"
            onMouseEnter={() => setActiveDropdown('product')}
            onMouseLeave={() => setActiveDropdown(null)}
          >
            <button
              onClick={() => setActiveDropdown(activeDropdown === 'product' ? null : 'product')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg transition-colors hover:text-[#F4F4F5] hover:bg-white/[0.05] ${
                activeDropdown === 'product' ? 'text-[#F4F4F5] bg-white/[0.06]' : ''
              }`}
              aria-expanded={activeDropdown === 'product'}
            >
              <span>{tr('nav_product')}</span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${activeDropdown === 'product' ? 'rotate-180' : ''}`} />
            </button>

            {activeDropdown === 'product' && (
              <div className="absolute top-full left-0 w-[380px] p-2 mt-1 rounded-2xl bg-[#111114] border border-[#26262C] shadow-[0_28px_60px_-22px_rgba(0,0,0,0.8)] grid gap-1 z-50">
                <a
                  href="#productos"
                  onClick={() => setActiveDropdown(null)}
                  className="grid gap-0.5 p-3 rounded-xl hover:bg-[#FF4F00]/10 transition-colors group"
                >
                  <b className="font-semibold text-sm text-[#F4F4F5] group-hover:text-[#FF4F00]">{tr('nav_p_converter')}</b>
                  <span className="text-xs text-[#9A9AA5] leading-relaxed">{tr('nav_p_converter_sub')}</span>
                </a>
                <a
                  href="#productos"
                  onClick={() => setActiveDropdown(null)}
                  className="grid gap-0.5 p-3 rounded-xl hover:bg-[#FF4F00]/10 transition-colors group"
                >
                  <b className="font-semibold text-sm text-[#F4F4F5] group-hover:text-[#FF4F00]">{tr('nav_p_schema')}</b>
                  <span className="text-xs text-[#9A9AA5] leading-relaxed">{tr('nav_p_schema_sub')}</span>
                </a>
                <a
                  href="#productos"
                  onClick={() => setActiveDropdown(null)}
                  className="grid gap-0.5 p-3 rounded-xl hover:bg-[#FF4F00]/10 transition-colors group"
                >
                  <b className="font-semibold text-sm text-[#F4F4F5] group-hover:text-[#FF4F00]">{tr('nav_p_mask')}</b>
                  <span className="text-xs text-[#9A9AA5] leading-relaxed">{tr('nav_p_mask_sub')}</span>
                </a>
                <a
                  href="#flujo"
                  onClick={() => setActiveDropdown(null)}
                  className="grid gap-0.5 p-3 rounded-xl hover:bg-[#FF4F00]/10 transition-colors group"
                >
                  <b className="font-semibold text-sm text-[#F4F4F5] group-hover:text-[#FF4F00]">{tr('nav_p_flow')}</b>
                  <span className="text-xs text-[#9A9AA5] leading-relaxed">{tr('nav_p_flow_sub')}</span>
                </a>
              </div>
            )}
          </div>

          {/* Soluciones */}
          <div
            className="relative"
            onMouseEnter={() => setActiveDropdown('solutions')}
            onMouseLeave={() => setActiveDropdown(null)}
          >
            <button
              onClick={() => setActiveDropdown(activeDropdown === 'solutions' ? null : 'solutions')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg transition-colors hover:text-[#F4F4F5] hover:bg-white/[0.05] ${
                activeDropdown === 'solutions' ? 'text-[#F4F4F5] bg-white/[0.06]' : ''
              }`}
              aria-expanded={activeDropdown === 'solutions'}
            >
              <span>{tr('nav_solutions')}</span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${activeDropdown === 'solutions' ? 'rotate-180' : ''}`} />
            </button>

            {activeDropdown === 'solutions' && (
              <div className="absolute top-full left-0 w-[380px] p-2 mt-1 rounded-2xl bg-[#111114] border border-[#26262C] shadow-[0_28px_60px_-22px_rgba(0,0,0,0.8)] grid gap-1 z-50">
                <a
                  href="#productos"
                  onClick={() => setActiveDropdown(null)}
                  className="grid gap-0.5 p-3 rounded-xl hover:bg-[#FF4F00]/10 transition-colors group"
                >
                  <b className="font-semibold text-sm text-[#F4F4F5] group-hover:text-[#FF4F00]">{tr('nav_s_api')}</b>
                  <span className="text-xs text-[#9A9AA5] leading-relaxed">{tr('nav_s_api_sub')}</span>
                </a>
                <a
                  href="#productos"
                  onClick={() => setActiveDropdown(null)}
                  className="grid gap-0.5 p-3 rounded-xl hover:bg-[#FF4F00]/10 transition-colors group"
                >
                  <b className="font-semibold text-sm text-[#F4F4F5] group-hover:text-[#FF4F00]">{tr('nav_s_data')}</b>
                  <span className="text-xs text-[#9A9AA5] leading-relaxed">{tr('nav_s_data_sub')}</span>
                </a>
                <a
                  href="#seguridad"
                  onClick={() => setActiveDropdown(null)}
                  className="grid gap-0.5 p-3 rounded-xl hover:bg-[#FF4F00]/10 transition-colors group"
                >
                  <b className="font-semibold text-sm text-[#F4F4F5] group-hover:text-[#FF4F00]">{tr('nav_s_reg')}</b>
                  <span className="text-xs text-[#9A9AA5] leading-relaxed">{tr('nav_s_reg_sub')}</span>
                </a>
              </div>
            )}
          </div>

          {/* Recursos */}
          <div
            className="relative"
            onMouseEnter={() => setActiveDropdown('resources')}
            onMouseLeave={() => setActiveDropdown(null)}
          >
            <button
              onClick={() => setActiveDropdown(activeDropdown === 'resources' ? null : 'resources')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg transition-colors hover:text-[#F4F4F5] hover:bg-white/[0.05] ${
                activeDropdown === 'resources' ? 'text-[#F4F4F5] bg-white/[0.06]' : ''
              }`}
              aria-expanded={activeDropdown === 'resources'}
            >
              <span>{tr('nav_resources')}</span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${activeDropdown === 'resources' ? 'rotate-180' : ''}`} />
            </button>

            {activeDropdown === 'resources' && (
              <div className="absolute top-full left-0 w-[380px] p-2 mt-1 rounded-2xl bg-[#111114] border border-[#26262C] shadow-[0_28px_60px_-22px_rgba(0,0,0,0.8)] grid gap-1 z-50">
                <a
                  href="#seguridad"
                  onClick={() => setActiveDropdown(null)}
                  className="grid gap-0.5 p-3 rounded-xl hover:bg-[#FF4F00]/10 transition-colors group"
                >
                  <b className="font-semibold text-sm text-[#F4F4F5] group-hover:text-[#FF4F00]">{tr('nav_r_verify')}</b>
                  <span className="text-xs text-[#9A9AA5] leading-relaxed">{tr('nav_r_verify_sub')}</span>
                </a>
                <a
                  href="#faq"
                  onClick={() => setActiveDropdown(null)}
                  className="grid gap-0.5 p-3 rounded-xl hover:bg-[#FF4F00]/10 transition-colors group"
                >
                  <b className="font-semibold text-sm text-[#F4F4F5] group-hover:text-[#FF4F00]">{tr('nav_r_faq')}</b>
                  <span className="text-xs text-[#9A9AA5] leading-relaxed">{tr('nav_r_faq_sub')}</span>
                </a>
                <button
                  onClick={() => {
                    setActiveDropdown(null);
                    setViewMode('workspace');
                  }}
                  className="w-full text-left grid gap-0.5 p-3 rounded-xl hover:bg-[#FF4F00]/10 transition-colors group"
                >
                  <b className="font-semibold text-sm text-[#F4F4F5] group-hover:text-[#FF4F00]">{tr('nav_r_studio')}</b>
                  <span className="text-xs text-[#9A9AA5] leading-relaxed">{tr('nav_r_studio_sub')}</span>
                </button>
              </div>
            )}
          </div>

          {/* Direct Nav Links */}
          <a href="#seguridad" className="px-3 py-2 rounded-lg hover:text-[#F4F4F5] hover:bg-white/[0.05] transition-colors">
            {tr('nav_privacy')}
          </a>
          <a href="#pricing" className="px-3 py-2 rounded-lg hover:text-[#F4F4F5] hover:bg-white/[0.05] transition-colors">
            {tr('nav_pricing')}
          </a>
          <a href="#installer" className="px-3 py-2 rounded-lg hover:text-[#F4F4F5] hover:bg-white/[0.05] transition-colors">
            {tr('nav_download')}
          </a>
        </nav>

        {/* Right Nav Utilities + CTAs */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* Quick Search Launchpad button */}
          <button
            onClick={onOpenCommandPalette || (() => setViewMode('workspace'))}
            className="flex items-center gap-2.5 h-9 px-3 rounded-xl border border-[#26262C] bg-white/[0.02] hover:border-[#FF4F00] hover:text-[#F4F4F5] text-[#9A9AA5] text-xs font-geist font-medium transition-all focus:outline-none"
            title="Launchpad command palette"
          >
            <Search className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{tr('nav_search')}</span>
            <kbd className="px-1.5 py-0.5 rounded-md bg-white/[0.08] text-[10px] font-geist-mono font-medium text-[#F4F4F5]">
              {isMac ? '⌘K' : 'Ctrl K'}
            </kbd>
          </button>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="flex items-center justify-center w-9 h-9 rounded-xl border border-[#26262C] bg-white/[0.02] hover:border-[#FF4F00] text-[#9A9AA5] hover:text-[#F4F4F5] transition-all focus:outline-none"
            aria-label="Toggle dark/light theme"
            title="Toggle theme"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* Language Toggle */}
          <button
            onClick={toggleLanguage}
            className="flex items-center gap-1 h-9 px-2.5 rounded-xl border border-[#26262C] bg-white/[0.02] hover:border-[#FF4F00] text-xs font-geist-mono text-[#9A9AA5] transition-all focus:outline-none"
            title="Switch language ES / EN"
          >
            <span className={language === 'es' ? 'text-[#FF4F00] font-bold' : 'text-[#9A9AA5]'}>ES</span>
            <span className="text-[#26262C]">/</span>
            <span className={language === 'en' ? 'text-[#FF4F00] font-bold' : 'text-[#9A9AA5]'}>EN</span>
          </button>

          {/* Download Windows Button */}
          <button
            onClick={() => setShowDownloadModal(true)}
            className="hidden md:flex items-center gap-1.5 h-9 px-3 rounded-xl border border-[#26262C] bg-white/[0.02] hover:bg-white/[0.06] hover:border-white/20 text-[#F4F4F5] text-xs font-geist font-medium transition-all focus:outline-none"
            title="Download FormatPulse Windows .exe"
          >
            <Download className="w-3.5 h-3.5 text-[#FF4F00]" />
            <span>.exe</span>
          </button>

          {/* PRO Active Badge if already activated */}
          {licenseTier !== 'free' && (
            <div className="hidden sm:flex items-center gap-1.5 px-3 h-9 bg-emerald-950/40 border border-emerald-600/40 text-emerald-400 text-xs font-geist-mono rounded-xl">
              <Shield className="w-3.5 h-3.5" />
              <span>PRO</span>
            </div>
          )}

          {/* Primary CTA: Launch Studio */}
          <button
            onClick={() => setViewMode('workspace')}
            className="flex items-center gap-1.5 h-9 px-4 rounded-xl bg-[#FF4F00] hover:bg-[#FF6A20] text-white font-geist font-semibold text-xs tracking-tight transition-all shadow-[0_0_20px_rgba(255,79,0,0.35)] hover:-translate-y-0.5 active:translate-y-0 focus:outline-none"
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>{tr('nav_open_studio')}</span>
          </button>

          {/* Mobile Burger Toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden flex items-center justify-center w-9 h-9 rounded-xl border border-[#26262C] bg-white/[0.02] text-[#F4F4F5] focus:outline-none"
            aria-label="Toggle navigation menu"
          >
            {mobileOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-x-0 top-[68px] bottom-0 bg-[#09090B]/98 backdrop-blur-2xl border-t border-[#26262C] p-6 overflow-y-auto flex flex-col gap-6 z-50">
          <div className="grid gap-2">
            <span className="text-xs font-geist-mono text-[#9A9AA5] uppercase tracking-wider">{tr('nav_product')}</span>
            <a
              href="#productos"
              onClick={() => setMobileOpen(false)}
              className="text-base font-geist font-medium text-[#F4F4F5] py-2 border-b border-[#26262C]/60"
            >
              {tr('nav_p_converter')}
            </a>
            <a
              href="#flujo"
              onClick={() => setMobileOpen(false)}
              className="text-base font-geist font-medium text-[#F4F4F5] py-2 border-b border-[#26262C]/60"
            >
              {tr('nav_p_flow')}
            </a>
            <a
              href="#seguridad"
              onClick={() => setMobileOpen(false)}
              className="text-base font-geist font-medium text-[#F4F4F5] py-2 border-b border-[#26262C]/60"
            >
              {tr('nav_privacy')}
            </a>
            <a
              href="#pricing"
              onClick={() => setMobileOpen(false)}
              className="text-base font-geist font-medium text-[#F4F4F5] py-2 border-b border-[#26262C]/60"
            >
              {tr('nav_pricing')}
            </a>
            <a
              href="#installer"
              onClick={() => setMobileOpen(false)}
              className="text-base font-geist font-medium text-[#F4F4F5] py-2 border-b border-[#26262C]/60"
            >
              {tr('nav_download')}
            </a>
            <a
              href="#faq"
              onClick={() => setMobileOpen(false)}
              className="text-base font-geist font-medium text-[#F4F4F5] py-2 border-b border-[#26262C]/60"
            >
              {tr('nav_r_faq')}
            </a>
          </div>

          <div className="pt-4 flex flex-col gap-3">
            <button
              onClick={() => {
                setMobileOpen(false);
                setViewMode('workspace');
              }}
              className="w-full flex items-center justify-center gap-2 h-12 rounded-xl bg-[#FF4F00] text-white font-geist font-semibold text-sm shadow-[0_0_24px_rgba(255,79,0,0.4)]"
            >
              <Terminal className="w-4 h-4" />
              <span>{tr('nav_open_studio')}</span>
            </button>

            <button
              onClick={() => {
                setMobileOpen(false);
                setShowDownloadModal(true);
              }}
              className="w-full flex items-center justify-center gap-2 h-12 rounded-xl border border-[#26262C] bg-[#111114] text-[#F4F4F5] font-geist font-medium text-sm"
            >
              <Download className="w-4 h-4 text-[#FF4F00]" />
              <span>Descargar .exe (v{APP_VERSION})</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
