import React from 'react';
import { Sparkles, RefreshCw, ShieldCheck, Code2, ArrowRight } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { useSettingsStore } from '@/store/useSettingsStore';
import { createTranslator } from '@/core/i18n';

// ── Use-Case card data ────────────────────────────────────────────────────────

const USE_CASES = [
  {
    icon: Sparkles,
    color: 'text-orange-400',
    bgColor: 'bg-orange-500/10',
    borderColor: 'border-orange-500/20 hover:border-orange-400/50',
    glowColor: 'group-hover:shadow-[0_0_40px_rgba(249,115,22,0.12)]',
    titleKey: 'guided_card1_title' as const,
    descKey:  'guided_card1_desc'  as const,
    ctaKey:   'guided_card1_cta'   as const,
    outputFormat: 'json' as const,
    sampleInput: '{"name":"Maria","age":29,"city":"Buenos Aires","active":true}',
  },
  {
    icon: RefreshCw,
    color: 'text-cyan-400',
    bgColor: 'bg-cyan-500/10',
    borderColor: 'border-cyan-500/20 hover:border-cyan-400/50',
    glowColor: 'group-hover:shadow-[0_0_40px_rgba(34,211,238,0.12)]',
    titleKey: 'guided_card2_title' as const,
    descKey:  'guided_card2_desc'  as const,
    ctaKey:   'guided_card2_cta'   as const,
    outputFormat: 'csv' as const,
    sampleInput: '{"id":1,"product":"FormatPulse PRO","price":14,"currency":"USD","active":true}',
  },
  {
    icon: ShieldCheck,
    color: 'text-emerald-400',
    bgColor: 'bg-emerald-500/10',
    borderColor: 'border-emerald-500/20 hover:border-emerald-400/50',
    glowColor: 'group-hover:shadow-[0_0_40px_rgba(52,211,153,0.12)]',
    titleKey: 'guided_card3_title' as const,
    descKey:  'guided_card3_desc'  as const,
    ctaKey:   'guided_card3_cta'   as const,
    outputFormat: 'pii-sanitizer' as const,
    sampleInput: '{"user":"admin","password":"S3cr3t!Pass","api_key":"sk-abc123XYZ","email":"user@example.com"}',
  },
  {
    icon: Code2,
    color: 'text-blue-400',
    bgColor: 'bg-blue-500/10',
    borderColor: 'border-blue-500/20 hover:border-blue-400/50',
    glowColor: 'group-hover:shadow-[0_0_40px_rgba(96,165,250,0.12)]',
    titleKey: 'guided_card4_title' as const,
    descKey:  'guided_card4_desc'  as const,
    ctaKey:   'guided_card4_cta'   as const,
    outputFormat: 'typescript' as const,
    sampleInput: '{"id":"usr_001","email":"dev@formatpulse.app","role":"admin","verified":true,"createdAt":"2026-01-15"}',
  },
] as const;

// ── Component ─────────────────────────────────────────────────────────────────

export const GuidedUseCaseSection: React.FC = () => {
  const setViewMode = useAppStore((s) => s.setViewMode);
  const setInputValue = useAppStore((s) => s.setInputValue);
  const setOutputFormat = useAppStore((s) => s.setOutputFormat);
  const language = useSettingsStore((s) => s.language);
  const tr = createTranslator(language);

  const handleCardClick = (card: (typeof USE_CASES)[number]) => {
    setInputValue(card.sampleInput);
    setOutputFormat(card.outputFormat);
    setViewMode('workspace');
  };

  return (
    <section
      id="use-cases"
      className="relative w-full px-4 py-20 md:py-28 bg-[#06070b] border-b border-zinc-800/60 overflow-hidden"
      aria-label="Guided use cases"
    >
      {/* Ambient gradient */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-accent/5 blur-[120px] pointer-events-none rounded-full" />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Section header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white font-sans">
            {tr('guided_title')}
          </h2>
          <p className="mt-4 text-sm sm:text-base text-zinc-400 font-mono max-w-2xl mx-auto leading-relaxed">
            {tr('guided_subtitle')}
          </p>
        </div>

        {/* 4 Cards grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
          {USE_CASES.map((card) => {
            const Icon = card.icon;
            return (
              <button
                key={card.titleKey}
                onClick={() => handleCardClick(card)}
                className={`group relative flex flex-col items-start gap-4 p-6 rounded-2xl bg-zinc-900/60 border ${card.borderColor} backdrop-blur-sm transition-all duration-300 text-left ${card.glowColor} hover:-translate-y-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/30`}
                aria-label={tr(card.titleKey)}
              >
                {/* Icon badge */}
                <div className={`flex items-center justify-center w-10 h-10 rounded-xl ${card.bgColor} border ${card.borderColor} transition-all duration-300`}>
                  <Icon className={`w-5 h-5 ${card.color}`} />
                </div>

                {/* Text */}
                <div className="flex flex-col gap-2 flex-1">
                  <h3 className={`text-sm font-bold font-mono ${card.color}`}>
                    {tr(card.titleKey)}
                  </h3>
                  <p className="text-xs text-zinc-400 font-mono leading-relaxed">
                    {tr(card.descKey)}
                  </p>
                </div>

                {/* CTA row */}
                <div className={`flex items-center gap-1.5 text-2xs font-mono font-semibold ${card.color} opacity-70 group-hover:opacity-100 transition-opacity`}>
                  <span>{tr(card.ctaKey)}</span>
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                </div>

                {/* Hover shimmer */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
};
