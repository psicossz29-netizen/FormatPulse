import React from 'react';
import { useSettingsStore } from '@/store/useSettingsStore';
import { createTranslator } from '@/core/i18n';
import { Check, X, ShieldAlert, ShieldCheck } from 'lucide-react';

export const SecurityDevToolsSection: React.FC = () => {
  const language = useSettingsStore((s) => s.language);
  const tr = createTranslator(language);

  return (
    <section className="py-20 md:py-28" id="seguridad">
      <div className="max-w-[1160px] mx-auto px-5">
        {/* Top Grid: Copy + DevTools Network Tab Mockup */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center mb-16">
          <div className="lg:col-span-5">
            <h2 className="font-display font-bold text-3xl sm:text-4xl md:text-5xl text-[#F4F4F5] tracking-tight mb-6">
              {tr('sec_title')}
            </h2>
            <p className="font-geist text-base sm:text-lg text-[#9A9AA5] leading-relaxed max-w-[46ch]">
              {tr('sec_desc')}
            </p>
          </div>

          {/* DevTools Network Tab Visual Mockup */}
          <div className="lg:col-span-7">
            <div className="rounded-2xl bg-[#111114] border border-[#26262C] overflow-hidden font-geist-mono text-xs shadow-2xl">
              {/* Tab Header */}
              <div className="flex items-center gap-1 p-2 border-b border-[#26262C] bg-[#09090B]/80 text-[#9A9AA5]">
                <span className="px-3 py-1 rounded-md hover:text-[#F4F4F5] cursor-default">Elements</span>
                <span className="px-3 py-1 rounded-md hover:text-[#F4F4F5] cursor-default">Console</span>
                <span className="px-3 py-1 rounded-md bg-[#FF4F00]/20 text-[#F4F4F5] border border-[#FF4F00]/40 font-semibold">
                  Network
                </span>
                <span className="px-3 py-1 rounded-md hover:text-[#F4F4F5] cursor-default hidden sm:inline">Sources</span>
              </div>

              {/* Columns Header */}
              <div className="grid grid-cols-12 px-4 py-2 border-b border-[#26262C] text-[#9A9AA5] text-[11px] uppercase tracking-wider bg-[#09090B]/40">
                <span className="col-span-6 sm:col-span-7">Name</span>
                <span className="col-span-3 sm:col-span-3">Status</span>
                <span className="col-span-3 sm:col-span-2 text-right">Size</span>
              </div>

              {/* Network Inspection Empty State */}
              <div className="py-14 px-4 text-center text-[#9A9AA5] flex flex-col items-center justify-center gap-2">
                <div className="w-8 h-8 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-1">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <p className="font-geist text-sm sm:text-base font-medium text-[#F4F4F5]">
                  {tr('sec_net_empty')}
                </p>
                <span className="text-xs text-[#9A9AA5]">
                  {language === 'es'
                    ? 'No hay conexiones HTTP, WebSockets ni telemetría saliente.'
                    : 'No outbound HTTP requests, WebSockets, or analytics telemetry.'}
                </span>
              </div>

              {/* Network Footer Counter */}
              <div className="px-4 py-2.5 border-t border-[#26262C] bg-[#09090B]/80 text-emerald-400 font-semibold text-xs flex items-center justify-between">
                <span>{tr('sec_net_badge')}</span>
                <span className="text-2xs text-[#9A9AA5] font-normal">0 B transferred · 0 ms network</span>
              </div>
            </div>
          </div>
        </div>

        {/* Comparison Table */}
        <div className="overflow-x-auto rounded-2xl border border-[#26262C] bg-[#111114]">
          <table className="w-full min-w-[620px] text-left border-collapse text-sm font-geist">
            <thead>
              <tr className="border-b border-[#26262C] bg-[#09090B]/60 text-xs font-semibold text-[#9A9AA5]">
                <th className="p-4 sm:p-5 w-1/3"></th>
                <th className="p-4 sm:p-5 w-1/3 text-zinc-400 flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-red-400" />
                  <span>{tr('sec_cmp_th1')}</span>
                </th>
                <th className="p-4 sm:p-5 w-1/3 text-[#FF4F00] bg-[#FF4F00]/10 font-bold border-l border-[#26262C]">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-[#FF4F00]" />
                    <span>{tr('sec_cmp_th2')}</span>
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#26262C]">
              {/* Row 1 */}
              <tr>
                <th className="p-4 sm:p-5 font-display font-semibold text-[#F4F4F5]">
                  {tr('sec_cmp_r1_title')}
                </th>
                <td className="p-4 sm:p-5 text-[#9A9AA5] flex items-center gap-2">
                  <X className="w-4 h-4 text-red-400 shrink-0" />
                  <span>{tr('sec_cmp_r1_c1')}</span>
                </td>
                <td className="p-4 sm:p-5 text-[#F4F4F5] bg-[#FF4F00]/5 font-medium border-l border-[#26262C]">
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>{tr('sec_cmp_r1_c2')}</span>
                  </div>
                </td>
              </tr>

              {/* Row 2 */}
              <tr>
                <th className="p-4 sm:p-5 font-display font-semibold text-[#F4F4F5]">
                  {tr('sec_cmp_r2_title')}
                </th>
                <td className="p-4 sm:p-5 text-[#9A9AA5]">
                  <div className="flex items-center gap-2">
                    <X className="w-4 h-4 text-red-400 shrink-0" />
                    <span>{tr('sec_cmp_r2_c1')}</span>
                  </div>
                </td>
                <td className="p-4 sm:p-5 text-[#F4F4F5] bg-[#FF4F00]/5 font-medium border-l border-[#26262C]">
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>{tr('sec_cmp_r2_c2')}</span>
                  </div>
                </td>
              </tr>

              {/* Row 3 */}
              <tr>
                <th className="p-4 sm:p-5 font-display font-semibold text-[#F4F4F5]">
                  {tr('sec_cmp_r3_title')}
                </th>
                <td className="p-4 sm:p-5 text-[#9A9AA5]">
                  <div className="flex items-center gap-2">
                    <X className="w-4 h-4 text-red-400 shrink-0" />
                    <span>{tr('sec_cmp_r3_c1')}</span>
                  </div>
                </td>
                <td className="p-4 sm:p-5 text-[#F4F4F5] bg-[#FF4F00]/5 font-medium border-l border-[#26262C]">
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>{tr('sec_cmp_r3_c2')}</span>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};
