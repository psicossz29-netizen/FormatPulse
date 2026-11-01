import React from 'react';
import { Lock, Zap } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { PRO_PREVIEW_LINES } from '@/services/licenseService';

export const ProPaywall: React.FC = () => {
  const setShowLicenseModal = useAppStore((s) => s.setShowLicenseModal);
  const outputLines = useAppStore((s) => s.outputLines);

  const hiddenLines = Math.max(0, outputLines - PRO_PREVIEW_LINES);

  return (
    <div className="flex-none border-t border-zinc-800">
      {/* ── Mask gradient ─────────────────────────────────────────────── */}
      <div className="h-8 bg-gradient-to-b from-transparent to-zinc-900/95 pointer-events-none" />

      {/* ── Paywall card ──────────────────────────────────────────────── */}
      <div className="bg-zinc-900/95 px-4 py-4 border-t border-zinc-800/50">
        <div className="flex items-start gap-3 max-w-md">
          <div className="flex-none mt-0.5">
            <div className="w-7 h-7 rounded-sm bg-accent-muted flex items-center justify-center">
              <Lock className="w-3.5 h-3.5 text-accent" strokeWidth={2} />
            </div>
          </div>

          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-zinc-200 tracking-tight">
              PRO Preview — {PRO_PREVIEW_LINES} lines visible
              {hiddenLines > 0 && (
                <span className="text-zinc-500 font-normal">
                  {' '}· {hiddenLines} lines hidden
                </span>
              )}
            </p>
            <p className="text-2xs text-zinc-500 mt-1 leading-relaxed">
              Unlock the complete output, unlimited file size processing, and the PII
              Sanitizer engine with a one-time lifetime license.
              Zero subscriptions.
            </p>

            <button
              onClick={() => setShowLicenseModal(true)}
              className="mt-2.5 h-7 px-3 inline-flex items-center gap-1.5 bg-accent hover:bg-accent-hover text-white text-xs font-semibold tracking-tight rounded-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-900"
            >
              <Zap className="w-3 h-3" strokeWidth={2.5} />
              Unlock PRO — $14 Lifetime
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
