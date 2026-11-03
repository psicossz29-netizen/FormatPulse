import React, { useEffect, useRef, useState } from 'react';
import { useSettingsStore } from '@/store/useSettingsStore';
import { createTranslator } from '@/core/i18n';

export const ScrollFlowSection: React.FC = () => {
  const language = useSettingsStore((s) => s.language);
  const tr = createTranslator(language);

  const listRef = useRef<HTMLOListElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (!listRef.current) return;
      const rect = listRef.current.getBoundingClientRect();
      const p = Math.min(1, Math.max(0, (window.innerHeight * 0.65 - rect.top) / rect.height));
      setProgress(p);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const steps = [
    { num: 1, title: tr('flow_1_title'), desc: tr('flow_1_desc') },
    { num: 2, title: tr('flow_2_title'), desc: tr('flow_2_desc') },
    { num: 3, title: tr('flow_3_title'), desc: tr('flow_3_desc') },
    { num: 4, title: tr('flow_4_title'), desc: tr('flow_4_desc') },
  ];

  return (
    <section className="py-20 md:py-28" id="flujo">
      <div className="max-w-[1160px] mx-auto px-5">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Sticky Title */}
          <div className="lg:col-span-5 lg:sticky lg:top-28">
            <h2 className="font-display font-bold text-3xl sm:text-4xl md:text-5xl text-[#F4F4F5] tracking-tight max-w-[18ch]">
              {tr('flow_title')}
            </h2>
          </div>

          {/* Steps with Animated Progress Line */}
          <div className="lg:col-span-7">
            <ol ref={listRef} className="relative pl-0 list-none">
              {/* Background vertical line */}
              <div className="absolute left-[19px] top-[20px] bottom-[56px] w-[2px] bg-[#26262C]" />

              {/* Foreground active fill line */}
              <div
                className="absolute left-[19px] top-[20px] bottom-[56px] w-[2px] bg-[#FF4F00] origin-top transition-transform duration-100"
                style={{ transform: `scaleY(${progress})` }}
              />

              {steps.map((step, idx) => {
                const isActive = progress >= idx / steps.length + 0.05;
                return (
                  <li key={step.num} className="relative pb-14 pl-16">
                    {/* Circle Badge */}
                    <div
                      className={`absolute left-0 top-0 z-10 w-10 h-10 rounded-full border-2 flex items-center justify-center font-display font-bold text-base transition-all duration-300 ${
                        isActive
                          ? 'border-[#FF4F00] bg-[#FF4F00] text-white shadow-[0_0_16px_rgba(255,79,0,0.5)]'
                          : 'border-[#26262C] bg-[#09090B] text-[#9A9AA5]'
                      }`}
                    >
                      {step.num}
                    </div>

                    <h3 className="font-display font-bold text-xl text-[#F4F4F5] mt-1 mb-2">
                      {step.title}
                    </h3>
                    <p className="font-geist text-sm text-[#9A9AA5] max-w-[44ch] leading-relaxed">
                      {step.desc}
                    </p>
                  </li>
                );
              })}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
};
