import React, { useState, useEffect, useMemo } from 'react';
import { Terminal, Download, ArrowRight, ShieldCheck, ArrowUpRight } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { useSettingsStore } from '@/store/useSettingsStore';
import { createTranslator } from '@/core/i18n';
import { APP_VERSION } from '@/constants/version';

interface UserData {
  name: string;
  email: string;
  phone: string;
}

const RAW_USER: UserData = {
  name: 'Ana Ruiz',
  email: 'ana.ruiz@acme.com',
  phone: '+34 600 123 456',
};

const MASKED_USER: UserData = {
  name: 'A•• R•••',
  email: 'a•••@•••.com',
  phone: '+34 ••• ••• •••',
};

const getSourceJson = (u: UserData) => `{
  "id": 1,
  "name": "${u.name}",
  "email": "${u.email}",
  "phone": "${u.phone}",
  "active": true
}`;

const OUTPUT_GENERATORS = {
  ts: (_u: UserData) => `interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  active: boolean;
}`,
  zod: (_u: UserData) => `import { z } from "zod";

export const User = z.object({
  id: z.number().int(),
  name: z.string(),
  email: z.string().email(),
  phone: z.string(),
  active: z.boolean(),
});`,
  sql: (u: UserData) => `CREATE TABLE users (
  id INT NOT NULL,
  name TEXT,
  email TEXT,
  phone TEXT,
  active BOOLEAN
);

INSERT INTO users VALUES
  (1, '${u.name}', '${u.email}', '${u.phone}', true);`,
  yaml: (u: UserData) => `id: 1
name: ${u.name}
email: ${u.email}
phone: "${u.phone}"
active: true`,
};

export const HeroSection: React.FC = () => {
  const setViewMode = useAppStore((s) => s.setViewMode);
  const setShowDownloadModal = useAppStore((s) => s.setShowDownloadModal);
  const language = useSettingsStore((s) => s.language);
  const tr = createTranslator(language);

  const [maskActive, setMaskActive] = useState(false);
  const [activeTab, setActiveTab] = useState<'ts' | 'zod' | 'sql' | 'yaml'>('ts');
  const [typewriterIndex, setTypewriterIndex] = useState<number>(999);
  const [flashing, setFlashing] = useState(false);

  // Typewriter effect on initial mount
  useEffect(() => {
    const full = getSourceJson(RAW_USER);
    setTypewriterIndex(0);
    const startDelay = setTimeout(() => {
      let curr = 0;
      const interval = setInterval(() => {
        curr += 3;
        if (curr >= full.length) {
          setTypewriterIndex(full.length);
          clearInterval(interval);
        } else {
          setTypewriterIndex(curr);
        }
      }, 16);
      return () => clearInterval(interval);
    }, 400);

    return () => clearTimeout(startDelay);
  }, []);

  const currentUser = maskActive ? MASKED_USER : RAW_USER;
  const fullSource = getSourceJson(currentUser);
  const displayedSource = typewriterIndex >= fullSource.length ? fullSource : fullSource.slice(0, typewriterIndex);
  const outputCode = useMemo(() => OUTPUT_GENERATORS[activeTab](currentUser), [activeTab, currentUser]);

  const handleMaskToggle = () => {
    setMaskActive((prev) => !prev);
    setFlashing(true);
    setTimeout(() => setFlashing(false), 500);
  };

  const handleTabChange = (tab: 'ts' | 'zod' | 'sql' | 'yaml') => {
    setActiveTab(tab);
    setFlashing(true);
    setTimeout(() => setFlashing(false), 500);
  };

  return (
    <section className="relative pt-16 md:pt-24 pb-16 text-center overflow-hidden isolation-auto">
      {/* Concentric rotating orbits (Design B CSS art) */}
      <div className="absolute left-1/2 -top-[140px] -translate-x-1/2 w-[min(1100px,150vw)] aspect-square rounded-full border border-[#26262C] pointer-events-none -z-10" />
      <div className="absolute left-1/2 -top-[140px] -translate-x-1/2 w-[min(700px,100vw)] aspect-square rounded-full border border-dashed border-[#26262C] animate-orb pointer-events-none -z-10" />

      {/* Subtle Radial Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-gradient-to-b from-[#FF4F00]/15 via-blue-500/5 to-transparent blur-[140px] pointer-events-none -z-10 rounded-full" />

      <div className="max-w-[1160px] mx-auto px-5">
        {/* Main Heading */}
        <h1 className="font-display font-bold text-4xl sm:text-6xl md:text-7xl max-w-[17ch] mx-auto text-[#F4F4F5] tracking-tight leading-[1.05]">
          {tr('hero_h1')}
        </h1>

        {/* Lead Subtitle */}
        <p className="font-geist text-base sm:text-lg md:text-xl text-[#9A9AA5] max-w-[58ch] mx-auto mt-6 leading-relaxed">
          {tr('hero_subtitle')}
        </p>

        {/* CTAs */}
        <div className="mt-9 flex flex-wrap items-center justify-center gap-3.5">
          <button
            onClick={() => setViewMode('workspace')}
            className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-[#FF4F00] hover:bg-[#FF6A20] text-white font-geist font-semibold text-base shadow-[0_0_30px_rgba(255,79,0,0.35)] transition-all hover:-translate-y-0.5 active:translate-y-0 focus:outline-none"
          >
            <Terminal className="w-4 h-4" />
            <span>{tr('hero_cta_primary')}</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <a
            href="#seguridad"
            className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl border border-[#26262C] hover:border-[#F4F4F5] bg-white/[0.02] text-[#F4F4F5] font-geist font-semibold text-base transition-all focus:outline-none"
          >
            <ShieldCheck className="w-4 h-4 text-[#7DD3A8]" />
            <span>{tr('hero_cta_verify')}</span>
          </a>

          <button
            onClick={() => setShowDownloadModal(true)}
            className="inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl border border-[#26262C] hover:border-white/20 bg-[#111114] text-[#9A9AA5] hover:text-[#F4F4F5] font-geist text-sm transition-all focus:outline-none"
            title="Download native Windows executable"
          >
            <Download className="w-4 h-4 text-[#FF4F00]" />
            <span>Windows .exe (v{APP_VERSION})</span>
          </button>
        </div>

        {/* Interactive Studio Demo Window */}
        <div className="mt-14 max-w-[1040px] mx-auto text-left bg-[#111114] border border-[#26262C] rounded-[22px] overflow-hidden shadow-[0_44px_90px_-42px_rgba(255,79,0,0.45)] transition-all">
          {/* Studio Window Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 border-b border-[#26262C] bg-[#09090B]/60">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#26262C]" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#26262C]" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#26262C]" />
              <span className="ml-2 font-geist-mono text-xs font-medium text-[#9A9AA5]">users.json</span>
            </div>

            {/* PII Masking Switch */}
            <label className="flex items-center gap-2.5 text-xs font-geist font-medium text-[#F4F4F5] cursor-pointer select-none">
              <input
                type="checkbox"
                checked={maskActive}
                onChange={handleMaskToggle}
                className="sr-only"
                aria-label={tr('studio_mask_label')}
              />
              <span
                className={`relative inline-block w-9 h-5 rounded-full transition-colors duration-200 ${
                  maskActive ? 'bg-[#FF4F00]' : 'bg-[#26262C]'
                }`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition-transform duration-200 ${
                    maskActive ? 'translate-x-4' : 'translate-x-0'
                  }`}
                />
              </span>
              <span>{tr('studio_mask_label')}</span>
            </label>
          </div>

          {/* Studio Split Columns */}
          <div className="grid grid-cols-1 md:grid-cols-2">
            {/* Input Column */}
            <div className={`p-4 md:p-5 overflow-x-auto min-h-[290px] font-geist-mono text-xs leading-relaxed transition-colors duration-300 ${flashing ? 'bg-[#FF4F00]/5' : ''}`}>
              <pre className="text-[#F4F4F5]">
                <code>{displayedSource}</code>
              </pre>
            </div>

            {/* Output Column */}
            <div className="border-t md:border-t-0 md:border-l border-[#26262C] flex flex-col">
              {/* Output Tabs */}
              <div className="flex items-center gap-1 px-3 py-2 border-b border-[#26262C] bg-[#09090B]/40 overflow-x-auto">
                <button
                  onClick={() => handleTabChange('ts')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-geist font-medium transition-colors ${
                    activeTab === 'ts'
                      ? 'bg-[#FF4F00]/20 text-[#F4F4F5] border border-[#FF4F00]/30'
                      : 'text-[#9A9AA5] hover:text-[#F4F4F5]'
                  }`}
                >
                  TypeScript
                </button>
                <button
                  onClick={() => handleTabChange('zod')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-geist font-medium transition-colors ${
                    activeTab === 'zod'
                      ? 'bg-[#FF4F00]/20 text-[#F4F4F5] border border-[#FF4F00]/30'
                      : 'text-[#9A9AA5] hover:text-[#F4F4F5]'
                  }`}
                >
                  Zod
                </button>
                <button
                  onClick={() => handleTabChange('sql')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-geist font-medium transition-colors ${
                    activeTab === 'sql'
                      ? 'bg-[#FF4F00]/20 text-[#F4F4F5] border border-[#FF4F00]/30'
                      : 'text-[#9A9AA5] hover:text-[#F4F4F5]'
                  }`}
                >
                  SQL
                </button>
                <button
                  onClick={() => handleTabChange('yaml')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-geist font-medium transition-colors ${
                    activeTab === 'yaml'
                      ? 'bg-[#FF4F00]/20 text-[#F4F4F5] border border-[#FF4F00]/30'
                      : 'text-[#9A9AA5] hover:text-[#F4F4F5]'
                  }`}
                >
                  YAML
                </button>
              </div>

              {/* Output Code Result */}
              <div className={`p-4 md:p-5 overflow-x-auto min-h-[250px] font-geist-mono text-xs leading-relaxed transition-colors duration-300 ${flashing ? 'bg-[#FF4F00]/5' : ''}`}>
                <pre className="text-[#C4B5FD]">
                  <code>{outputCode}</code>
                </pre>
              </div>
            </div>
          </div>

          {/* Studio Footer Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 border-t border-[#26262C] bg-[#09090B]/40 text-xs font-geist text-[#9A9AA5]">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#34D399] animate-pulse-dot" />
              <span>{tr('studio_footer_note')}</span>
            </div>

            <button
              onClick={() => setViewMode('workspace')}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#FF4F00] hover:text-[#FF6A20] transition-colors"
            >
              <span>{language === 'es' ? 'Abrir con mis propios datos' : 'Open with my own data'}</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
