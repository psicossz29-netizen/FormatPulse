import React from 'react';
import { useSettingsStore } from '@/store/useSettingsStore';
import { createTranslator } from '@/core/i18n';
import { ShieldCheck, Sparkles, EyeOff } from 'lucide-react';

export const TrioGridSection: React.FC = () => {
  const language = useSettingsStore((s) => s.language);
  const tr = createTranslator(language);

  return (
    <section className="py-20 md:py-28" id="local">
      <div className="max-w-[1160px] mx-auto px-5">
        <h2 className="font-display font-bold text-3xl sm:text-4xl md:text-5xl text-[#F4F4F5] tracking-tight mb-12 max-w-[20ch]">
          {tr('trio_title')}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 border-t border-[#26262C] divide-y md:divide-y-0 md:divide-x divide-[#26262C]">
          {/* Card 1 */}
          <div className="pt-8 md:pr-8">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-5">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="font-display font-bold text-xl text-[#F4F4F5] mb-3">
              {tr('trio_1_title')}
            </h3>
            <p className="font-geist text-[#9A9AA5] text-sm leading-relaxed max-w-[34ch]">
              {tr('trio_1_desc')}
            </p>
          </div>

          {/* Card 2 */}
          <div className="pt-8 md:px-8">
            <div className="w-10 h-10 rounded-xl bg-[#FF4F00]/10 border border-[#FF4F00]/20 flex items-center justify-center text-[#FF4F00] mb-5">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="font-display font-bold text-xl text-[#F4F4F5] mb-3">
              {tr('trio_2_title')}
            </h3>
            <p className="font-geist text-[#9A9AA5] text-sm leading-relaxed max-w-[34ch]">
              {tr('trio_2_desc')}
            </p>
          </div>

          {/* Card 3 */}
          <div className="pt-8 md:pl-8">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 mb-5">
              <EyeOff className="w-5 h-5" />
            </div>
            <h3 className="font-display font-bold text-xl text-[#F4F4F5] mb-3">
              {tr('trio_3_title')}
            </h3>
            <p className="font-geist text-[#9A9AA5] text-sm leading-relaxed max-w-[34ch]">
              {tr('trio_3_desc')}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
