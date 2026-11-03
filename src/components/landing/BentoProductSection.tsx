import React from 'react';
import { useSettingsStore } from '@/store/useSettingsStore';
import { createTranslator } from '@/core/i18n';

export const BentoProductSection: React.FC = () => {
  const language = useSettingsStore((s) => s.language);
  const tr = createTranslator(language);

  return (
    <section className="py-20 md:py-28" id="productos">
      <div className="max-w-[1160px] mx-auto px-5">
        <h2 className="font-display font-bold text-3xl sm:text-4xl md:text-5xl text-[#F4F4F5] tracking-tight mb-12 max-w-[20ch]">
          {tr('bento_title')}
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-6 gap-4">
          {/* Bento 1: Format Converter */}
          <article className="lg:col-span-4 p-7 sm:p-9 rounded-[32px] rounded-bl-[10px] bg-[#111114] border border-[#26262C] hover:border-[#FF4F00] transition-colors flex flex-col justify-between gap-7">
            <div>
              <h3 className="font-display font-bold text-2xl text-[#F4F4F5] mb-2.5">
                {tr('bento_1_title')}
              </h3>
              <p className="font-geist text-sm text-[#9A9AA5] max-w-[44ch] leading-relaxed">
                {tr('bento_1_desc')}
              </p>
            </div>

            {/* Dynamic Moving Dashed Converter Graphic */}
            <div className="flex items-center gap-2 sm:gap-3 py-2">
              <span className="px-4 py-3 rounded-xl border border-[#26262C] bg-[#09090B] font-geist-mono text-xs sm:text-sm font-medium text-[#F4F4F5]">
                JSON
              </span>
              <div className="flex-1 min-w-[20px] h-[2px] animate-moving-line rounded-full" />
              <span className="px-4 py-3 rounded-xl border border-[#26262C] bg-[#09090B] font-geist-mono text-xs sm:text-sm font-medium text-[#F4F4F5]">
                CSV
              </span>
              <div className="flex-1 min-w-[20px] h-[2px] animate-moving-line rounded-full" />
              <span className="px-4 py-3 rounded-xl border border-[#26262C] bg-[#09090B] font-geist-mono text-xs sm:text-sm font-medium text-[#F4F4F5]">
                YAML
              </span>
            </div>
          </article>

          {/* Bento 2: Schema Generator (Featured Orange Card) */}
          <article className="lg:col-span-2 lg:row-span-2 p-7 sm:p-9 rounded-[32px] rounded-tr-[10px] bg-[#FF4F00] text-white flex flex-col justify-between gap-7 shadow-[0_20px_50px_rgba(255,79,0,0.3)]">
            <div>
              <h3 className="font-display font-bold text-2xl text-white mb-2.5">
                {tr('bento_2_title')}
              </h3>
              <p className="font-geist text-sm text-white/90 leading-relaxed">
                {tr('bento_2_desc')}
              </p>
            </div>

            <pre className="p-4 rounded-xl bg-[#09090B]/40 text-white font-geist-mono text-xs leading-relaxed overflow-x-auto border border-white/10">
              <code>{`export const User = z.object({
  id: z.number().int(),
  email: z.string().email(),
  active: z.boolean(),
});`}</code>
            </pre>
          </article>

          {/* Bento 3: PII Masking */}
          <article className="lg:col-span-4 p-7 sm:p-9 rounded-[32px] rounded-tl-[10px] bg-[#111114] border border-[#26262C] hover:border-[#FF4F00] transition-colors flex flex-col justify-between gap-7">
            <div>
              <h3 className="font-display font-bold text-2xl text-[#F4F4F5] mb-2.5">
                {tr('bento_3_title')}
              </h3>
              <p className="font-geist text-sm text-[#9A9AA5] max-w-[44ch] leading-relaxed">
                {tr('bento_3_desc')}
              </p>
            </div>

            <ul className="grid gap-2.5 font-geist-mono text-xs sm:text-sm">
              <li className="flex items-center gap-3 flex-wrap">
                <span className="text-[#9A9AA5]">ana.ruiz@acme.com</span>
                <span className="w-6 h-[1px] bg-[#26262C]" />
                <span className="text-[#FF4F00] font-medium">a•••@•••.com</span>
              </li>
              <li className="flex items-center gap-3 flex-wrap">
                <span className="text-[#9A9AA5]">+34 600 123 456</span>
                <span className="w-6 h-[1px] bg-[#26262C]" />
                <span className="text-[#FF4F00] font-medium">+34 ••• ••• •••</span>
              </li>
              <li className="flex items-center gap-3 flex-wrap">
                <span className="text-[#9A9AA5]">Ana Ruiz</span>
                <span className="w-6 h-[1px] bg-[#26262C]" />
                <span className="text-[#FF4F00] font-medium">A•• R•••</span>
              </li>
            </ul>
          </article>
        </div>
      </div>
    </section>
  );
};
