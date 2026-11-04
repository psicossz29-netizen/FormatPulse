import React from 'react';
import { Lock, Zap } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { PRO_PREVIEW_LINES } from '@/services/licenseService';

export const ProPaywall: React.FC = () => {
  const setShowLicenseModal = useAppStore((s) => s.setShowLicenseModal);
  const outputLines = useAppStore((s) => s.outputLines);

  const hiddenLines = Math.max(0, outputLines - PRO_PREVIEW_LINES);

  return (
    <div className="flex-none border-t border-[#26262C]">
      {/* ── Mask gradient ─────────────────────────────────────────────── */}
      <div className="h-8 bg-gradient-to-b from-transparent via-[#09090B]/60 to-[#09090B] pointer-events-none" />

      {/* ── Paywall card ──────────────────────────────────────────────── */}
      <div className="bg-[#09090B] px-4 py-3 border-t border-[#26262C]/40 flex justify-center">
        <div className="relative w-full max-w-lg rounded-2xl bg-[#111114] border border-[#26262C] shadow-2xl p-4 overflow-hidden backdrop-blur-xl">
          <div className="absolute -top-10 -right-10 w-28 h-28 bg-[#FF4F00]/10 rounded-full blur-2xl pointer-events-none" />

          <div className="flex items-start gap-3.5 relative z-10">
            <div className="flex-none mt-0.5">
              <div className="w-8 h-8 rounded-xl bg-[#FF4F00]/10 border border-[#FF4F00]/25 flex items-center justify-center">
                <Lock className="w-4 h-4 text-[#FF4F00]" strokeWidth={2} />
              </div>
            </div>

            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-[#F4F4F5] tracking-tight font-sans">
                PRO Preview — {PRO_PREVIEW_LINES} lines visible
                {hiddenLines > 0 && (
                  <span className="text-[#71717A] font-normal font-mono">
                    {' '}· {hiddenLines} lines hidden
                  </span>
                )}
              </p>
              <p className="text-2xs text-[#9A9AA5] mt-1 leading-relaxed font-sans">
                Unlock the complete output, unlimited file size processing, and the PII
                Sanitizer engine with a one-time lifetime license. Zero subscriptions.
              </p>

              <button
                onClick={() => setShowLicenseModal(true)}
                className="mt-3 h-8 px-4 inline-flex items-center gap-1.5 rounded-xl bg-[#FF4F00] hover:bg-[#FF6A20] text-white text-xs font-semibold tracking-tight shadow-[0_0_20px_rgba(255,79,0,0.3)] hover:shadow-[0_0_26px_rgba(255,79,0,0.5)] transition-all font-sans cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF4F00] focus-visible:ring-offset-2 focus-visible:ring-offset-[#111114]"
              >
                <Zap className="w-3.5 h-3.5 fill-white text-white" strokeWidth={2} />
                Unlock PRO — $14 Lifetime
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
