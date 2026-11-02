import React from 'react';
import { Lock, Cpu, FileSpreadsheet, Code2 } from 'lucide-react';
import { useSettingsStore } from '@/store/useSettingsStore';
import { createTranslator } from '@/core/i18n';

export const TechnicalShowcase: React.FC = () => {
  const language = useSettingsStore((s) => s.language);
  const tr = createTranslator(language);

  const FEATURES = [
    {
      icon: <Lock className="w-5 h-5 text-emerald-400" />,
      badge: '100% IN-BROWSER',
      badgeColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
      titleKey: 'feature_priv_title' as const,
      descKey: 'feature_priv_desc' as const,
      metric: '0 Bytes Network I/O',
    },
    {
      icon: <Cpu className="w-5 h-5 text-accent" />,
      badge: 'PARALLEL THREADS',
      badgeColor: 'text-accent bg-accent/10 border-accent/20',
      titleKey: 'feature_worker_title' as const,
      descKey: 'feature_worker_desc' as const,
      metric: '0.38ms In-Memory Speed',
    },
    {
      icon: <FileSpreadsheet className="w-5 h-5 text-cyan-400" />,
      badge: 'OWASP TOP 10',
      badgeColor: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20',
      titleKey: 'feature_owasp_title' as const,
      descKey: 'feature_owasp_desc' as const,
      metric: 'Excel & Calc Safe',
    },
    {
      icon: <Code2 className="w-5 h-5 text-blue-400" />,
      badge: '10 TARGETS',
      badgeColor: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
      titleKey: 'feature_types_title' as const,
      descKey: 'feature_types_desc' as const,
      metric: 'TypeScript · Zod · OpenAPI',
    },
  ] as const;

  return (
    <section id="features" className="relative w-full border-b border-zinc-800/80 bg-[#06070b] px-4 py-20 md:py-28 overflow-hidden scroll-mt-12">
      {/* Anchor alias for #security */}
      <span id="security" className="sr-only" />
      {/* Background radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-blue-600/5 blur-[140px] rounded-full pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.04] border border-white/10 text-2xs font-mono text-zinc-300 mb-3 backdrop-blur-md">
            <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
            <span className="uppercase tracking-widest text-accent font-semibold">{tr('features_badge')}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white font-sans">
            {tr('features_title')}
          </h2>
          <p className="mt-4 text-sm sm:text-base text-zinc-400 font-mono max-w-2xl mx-auto leading-relaxed">
            {tr('features_subtitle')}
          </p>
        </div>

        {/* Spaceship Bento Grid — 4 Clean Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {FEATURES.map((feat) => (
            <div
              key={feat.titleKey}
              className="p-7 md:p-8 rounded-3xl bg-zinc-900/40 border border-white/10 backdrop-blur-xl hover:border-accent/40 hover:bg-zinc-900/60 transition-all duration-300 flex flex-col justify-between group shadow-xl hover:-translate-y-1"
            >
              <div>
                <div className="flex items-center justify-between mb-5">
                  <div className="w-12 h-12 rounded-2xl bg-white/[0.05] border border-white/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                    {feat.icon}
                  </div>
                  <span className={`px-3 py-1 rounded-full text-3xs font-mono font-semibold tracking-wider border ${feat.badgeColor}`}>
                    {feat.badge}
                  </span>
                </div>

                <h3 className="text-lg md:text-xl font-bold text-white font-sans tracking-tight mb-2.5">
                  {tr(feat.titleKey)}
                </h3>
                <p className="text-xs md:text-sm text-zinc-400 font-mono leading-relaxed">
                  {tr(feat.descKey)}
                </p>
              </div>

              <div className="mt-6 pt-5 border-t border-white/[0.06] flex items-center justify-between text-2xs font-mono text-zinc-500">
                <span className="text-zinc-400 font-semibold">{feat.metric}</span>
                <span className="text-accent group-hover:translate-x-1 transition-transform">✓</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
