import React from 'react';
import { Shield, FileText, ShieldAlert } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
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

  return (
    <footer className="h-6 flex-none flex items-center justify-between border-t border-zinc-800 bg-surface-base text-2xs font-mono select-none px-2">
      {/* ── Left: Privacy & Engine Status ──────────────────────────────── */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1.5">
          <span className={cn(
            'inline-block w-1.5 h-1.5 rounded-full',
            workerStatus === 'ready' ? 'bg-emerald-500 animate-pulse' : 'bg-zinc-600',
          )} />
          <span className="text-zinc-400 tracking-wide">
            100% CLIENT-SIDE
          </span>
          <span className="text-zinc-700">·</span>
          <span className="text-zinc-500">ZERO NETWORK IO</span>
          <span className="text-zinc-700">·</span>
          <button
            onClick={() => setShowHealthInspector(true)}
            className="flex items-center gap-1 text-zinc-500 hover:text-emerald-400 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent rounded-sm"
            title="Inspect Data Health & Secrets Leakage"
          >
            <ShieldAlert className="w-3 h-3 text-emerald-500" />
            <span>Audit</span>
          </button>
        </div>
      </div>

      {/* ── Center: Telemetry ─────────────────────────────────────────── */}
      <div className="flex items-center gap-3 text-zinc-500">
        {inputBytes > 0 && (
          <>
            <span>
              In: <span className="text-zinc-400 tabular-nums">{formatBytes(inputBytes)}</span>
              <span className="text-zinc-700 mx-0.5">·</span>
              <span className="text-zinc-400 tabular-nums">{inputLines} ln</span>
            </span>
            <span className="text-zinc-700">│</span>
          </>
        )}
        {outputBytes > 0 && (
          <>
            <span>
              Out: <span className="text-zinc-400 tabular-nums">{formatBytes(outputBytes)}</span>
              <span className="text-zinc-700 mx-0.5">·</span>
              <span className="text-zinc-400 tabular-nums">{outputLines} ln</span>
            </span>
            <span className="text-zinc-700">│</span>
          </>
        )}
        {processingTimeMs !== null && (
          <span>
            Parsed in{' '}
            <span className="text-accent tabular-nums">
              {processingTimeMs.toFixed(2)} ms
            </span>
          </span>
        )}
      </div>

      {/* ── Right: License & Legal ────────────────────────────────────── */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setShowLicenseModal(true)}
          className={cn(
            'px-1.5 py-px tracking-wider font-semibold hover:opacity-80 transition-opacity focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent rounded-xs',
            licenseTier === 'enterprise'
              ? 'text-cyan-400 bg-cyan-950/60 border border-cyan-800'
              : licenseTier === 'team'
                ? 'text-emerald-400 bg-emerald-950/60 border border-emerald-800'
                : licenseTier === 'pro'
                  ? 'text-accent bg-accent-muted'
                  : 'text-zinc-500 bg-zinc-800/50',
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

        <span className="text-zinc-700">│</span>

        <button
          onClick={() => setShowLegalModal(true)}
          className="flex items-center gap-1 text-zinc-600 hover:text-zinc-400 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent rounded-sm"
        >
          <Shield className="w-3 h-3" strokeWidth={2} />
          <span>Terms</span>
        </button>

        <button
          onClick={() => setShowLegalModal(true)}
          className="flex items-center gap-1 text-zinc-600 hover:text-zinc-400 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent rounded-sm"
        >
          <FileText className="w-3 h-3" strokeWidth={2} />
          <span>Privacy</span>
        </button>
      </div>
    </footer>
  );
};
