import React from 'react';
import { ClipboardPaste, Wand2, Copy } from 'lucide-react';
import { useSettingsStore } from '@/store/useSettingsStore';
import { createTranslator } from '@/core/i18n';

const STEPS = [
  { icon: ClipboardPaste, color: 'text-orange-400', bgColor: 'bg-orange-500/10', borderColor: 'border-orange-500/25', labelKey: 'step1_label' as const, descKey: 'step1_desc' as const, num: 1 },
  { icon: Wand2,          color: 'text-cyan-400',   bgColor: 'bg-cyan-500/10',   borderColor: 'border-cyan-500/25',   labelKey: 'step2_label' as const, descKey: 'step2_desc' as const, num: 2 },
  { icon: Copy,           color: 'text-emerald-400', bgColor: 'bg-emerald-500/10', borderColor: 'border-emerald-500/25', labelKey: 'step3_label' as const, descKey: 'step3_desc' as const, num: 3 },
] as const;

export const ThreeStepIndicator: React.FC = () => {
  const language = useSettingsStore((s) => s.language);
  const tr = createTranslator(language);

  return (
    <section
      className="relative w-full px-4 py-14 bg-zinc-950/50 border-b border-zinc-800/40 overflow-hidden"
      aria-label="How FormatPulse works in 3 steps"
    >
      {/* Subtle grid texture */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:2rem_2rem] pointer-events-none opacity-30" />

      <div className="max-w-4xl mx-auto relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 md:gap-8 items-start">
          {STEPS.map((step, i) => {
            const Icon = step.icon;
            return (
              <React.Fragment key={step.num}>
                {/* Step card */}
                <div className="flex flex-col items-center text-center gap-3">
                  {/* Number + Icon */}
                  <div className="relative">
                    <div className={`flex items-center justify-center w-14 h-14 rounded-2xl ${step.bgColor} border ${step.borderColor}`}>
                      <Icon className={`w-6 h-6 ${step.color}`} />
                    </div>
                    {/* Step number badge */}
                    <span className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-zinc-950 border border-zinc-700 flex items-center justify-center text-3xs font-bold font-mono text-zinc-300">
                      {step.num}
                    </span>
                  </div>

                  <div>
                    <p className={`text-sm font-bold font-mono ${step.color}`}>
                      {tr(step.labelKey)}
                    </p>
                    <p className="text-xs text-zinc-500 font-mono mt-1 leading-relaxed">
                      {tr(step.descKey)}
                    </p>
                  </div>
                </div>

                {/* Connector arrow (between steps, not after last) */}
                {i < STEPS.length - 1 && (
                  <div className="hidden sm:flex items-center justify-center -mx-4 -mt-6 pointer-events-none" aria-hidden="true">
                    <svg width="40" height="16" viewBox="0 0 40 16" fill="none" className="text-zinc-700">
                      <path d="M0 8 H32 M26 2 L38 8 L26 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </section>
  );
};
