import React from 'react';
import { Shield, FileText, ShieldAlert, Settings } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { APP_VERSION } from '@/constants/version';
import { cn } from '@/lib/utils';

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

export const StatusBar: React.FC = () => {
  const inputBytes = useAppStore((s) => s.inputBytes);
  const outputBytes = useAppStore((s) => s.outputBytes);
  const inputLines = useAppStore((s) => s.inputLines);
  const outputLines = useAppStore((s) => s.outputLines);
  const processingTimeMs = useAppStore((s) => s.processingTimeMs);
  const workerStatus = useAppStore((s) => s.workerStatus);
  const licenseTier = useAppStore((s) => s.licenseTier);
  const setShowLegalModal = useAppStore((s) => s.setShowLegalModal);
  const setShowHealthInspector = useAppStore((s) => s.setShowHealthInspector);
  const setShowLicenseModal = useAppStore((s) => s.setShowLicenseModal);
  const setShowSettingsModal = useAppStore((s) => s.setShowSettingsModal);

  return (
    <footer className="h-7 flex-none flex items-center justify-between border-t border-[#26262C] bg-[#09090B] text-2xs font-mono select-none px-3 text-[#9A9AA5]">
      {/* ── Left: Privacy & Engine Status ──────────────────────────────── */}
      <div className="flex items-center gap-2.5">
        <div className="flex items-center gap-1.5">
          <span
            className={cn(
              'inline-block w-2 h-2 rounded-full ring-2 transition-all',
              workerStatus === 'ready'
                ? 'bg-emerald-400 ring-emerald-500/20 shadow-[0_0_8px_rgba(16,185,129,0.5)]'
                : 'bg-zinc-600 ring-zinc-700',
            )}
          />
          <span className="text-[#F4F4F5] font-medium tracking-wide">
            100% CLIENT-SIDE
          </span>
          <span className="text-[#3F3F46]">·</span>
          <span className="text-[#71717A] tracking-wider">
            ZERO NETWORK IO
          </span>
          <span className="text-[#3F3F46]">·</span>
          <button
            onClick={() => setShowHealthInspector(true)}
            className="flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 hover:text-emerald-300 border border-emerald-500/25 transition-all text-3xs font-sans font-semibold tracking-wide"
            title="Inspect Data Health & Secrets Leakage"
          >
            <ShieldAlert className="w-3 h-3 text-emerald-400" />
            <span>Audit</span>
          </button>
        </div>
      </div>

      {/* ── Center: Telemetry ─────────────────────────────────────────── */}
      <div className="flex items-center gap-2 text-3xs text-[#71717A]">
        {inputBytes > 0 && (
          <div className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#111114] border border-[#26262C]/60">
            <span className="text-[#9A9AA5]">In:</span>
            <span className="text-[#F4F4F5] font-semibold tabular-nums">{formatBytes(inputBytes)}</span>
            <span className="text-[#3F3F46]">·</span>
            <span className="text-[#9A9AA5] tabular-nums">{inputLines} ln</span>
          </div>
        )}
        {outputBytes > 0 && (
          <div className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#111114] border border-[#26262C]/60">
            <span className="text-[#9A9AA5]">Out:</span>
            <span className="text-[#F4F4F5] font-semibold tabular-nums">{formatBytes(outputBytes)}</span>
            <span className="text-[#3F3F46]">·</span>
            <span className="text-[#9A9AA5] tabular-nums">{outputLines} ln</span>
          </div>
        )}
        {processingTimeMs !== null && (
          <div className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#111114] border border-[#26262C]/60">
            <span className="text-[#9A9AA5]">Parsed in</span>
            <span className="text-[#FF4F00] font-semibold tabular-nums">
              {processingTimeMs.toFixed(2)} ms
            </span>
          </div>
        )}
      </div>

      {/* ── Right: License & Legal ────────────────────────────────────── */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setShowLicenseModal(true)}
          className={cn(
            'px-2 py-0.5 rounded-lg text-3xs font-mono font-semibold tracking-wider transition-all focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#FF4F00]',
            licenseTier === 'enterprise'
              ? 'text-cyan-300 bg-cyan-950/60 border border-cyan-800 shadow-[0_0_10px_rgba(6,182,212,0.15)]'
              : licenseTier === 'team'
                ? 'text-emerald-300 bg-emerald-950/60 border border-emerald-800 shadow-[0_0_10px_rgba(16,185,129,0.15)]'
                : licenseTier === 'pro'
                  ? 'text-[#FF4F00] bg-[#FF4F00]/10 border border-[#FF4F00]/30 shadow-[0_0_10px_rgba(255,79,0,0.15)]'
                  : 'text-[#9A9AA5] bg-[#111114] border border-[#26262C] hover:text-[#F4F4F5] hover:border-[#3F3F46]',
          )}
          title="Click to manage license"
        >
          {licenseTier === 'enterprise'
            ? 'ENTERPRISE AIR-GAPPED'
            : licenseTier === 'team'
              ? 'TEAM PACK (5 SEATS)'
              : licenseTier === 'pro'
                ? 'PRO LICENSE ACTIVE'
                : 'FREE TIER'}
        </button>

        <span className="text-[#26262C]">│</span>

        <button
          onClick={() => setShowLegalModal(true)}
          className="flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[#71717A] hover:text-[#F4F4F5] hover:bg-white/[0.04] transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#FF4F00]"
        >
          <Shield className="w-3 h-3 text-[#71717A]" strokeWidth={2} />
          <span>Terms</span>
        </button>

        <button
          onClick={() => setShowLegalModal(true)}
          className="flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[#71717A] hover:text-[#F4F4F5] hover:bg-white/[0.04] transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#FF4F00]"
        >
          <FileText className="w-3 h-3 text-[#71717A]" strokeWidth={2} />
          <span>Privacy</span>
        </button>

        <span className="text-[#26262C]">│</span>

        <button
          onClick={() => setShowSettingsModal(true)}
          className="flex items-center gap-1.5 px-2 py-0.5 rounded-lg bg-[#111114] border border-[#26262C] text-[#9A9AA5] hover:text-[#F4F4F5] hover:border-[#3F3F46] transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#FF4F00]"
          title="Open Settings (⌘,)"
        >
          <Settings className="w-3 h-3 text-[#FF4F00]" strokeWidth={2} />
          <span>v{APP_VERSION}</span>
        </button>
      </div>
    </footer>
  );
};
