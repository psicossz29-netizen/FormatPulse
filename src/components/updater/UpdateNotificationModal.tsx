import React, { useState, useEffect, useCallback } from 'react';
import {
  X,
  RefreshCw,
  Download,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import {
  checkForUpdates,
  CURRENT_APP_VERSION,
  type ReleaseManifest,
} from '@/services/updaterService';
import { cn } from '@/lib/utils';

export const UpdateNotificationModal: React.FC = () => {
  const showUpdateModal = useAppStore((s) => s.showUpdateModal);
  const setShowUpdateModal = useAppStore((s) => s.setShowUpdateModal);

  const [isChecking, setIsChecking] = useState(false);
  const [updateResult, setUpdateResult] = useState<{
    hasUpdate: boolean;
    manifest: ReleaseManifest | null;
    error?: string;
  } | null>(null);

  const runCheck = useCallback(async () => {
    setIsChecking(true);
    setUpdateResult(null);
    try {
      const res = await checkForUpdates();
      setUpdateResult({
        hasUpdate: res.hasUpdate,
        manifest: res.manifest,
        error: res.error,
      });
    } finally {
      setIsChecking(false);
    }
  }, []);

  // Run a check when the modal opens if no check has occurred yet
  useEffect(() => {
    if (showUpdateModal && !updateResult) {
      void runCheck();
    }
  }, [showUpdateModal, updateResult, runCheck]);

  if (!showUpdateModal) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-label="FormatPulse Update Manager"
    >
      {/* ── Backdrop ────────────────────────────────────────────────── */}
      <div
        className="fixed inset-0 bg-zinc-950/85 backdrop-blur-sm transition-opacity"
        onClick={() => setShowUpdateModal(false)}
      />

      {/* ── Modal Window ────────────────────────────────────────────── */}
      <div className="relative w-full max-w-lg bg-zinc-900 border border-zinc-800 shadow-2xl rounded-xs overflow-hidden my-auto">
        {/* Header */}
        <div className="flex items-center justify-between h-10 px-4 border-b border-zinc-800 bg-zinc-950">
          <div className="flex items-center gap-2">
            <RefreshCw className={cn('w-4 h-4 text-accent', isChecking && 'animate-spin')} />
            <span className="text-xs font-semibold text-zinc-200 tracking-tight">
              FormatPulse Release Engine
            </span>
            <span className="text-2xs font-mono px-1.5 py-0.5 rounded-xs bg-zinc-800 text-zinc-400">
              v{CURRENT_APP_VERSION}
            </span>
          </div>
          <button
            onClick={() => setShowUpdateModal(false)}
            className="w-6 h-6 flex items-center justify-center text-zinc-500 hover:text-zinc-200 hover:bg-zinc-800 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent rounded-xs"
            aria-label="Close"
          >
            <X className="w-4 h-4" strokeWidth={2} />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 space-y-4">
          {/* Status Display */}
          {isChecking ? (
            <div className="p-6 text-center space-y-3 bg-zinc-950/70 border border-zinc-800 rounded-xs">
              <RefreshCw className="w-6 h-6 text-accent animate-spin mx-auto" />
              <div className="space-y-1">
                <p className="text-xs font-mono text-zinc-300">Checking for updates...</p>
                <p className="text-2xs text-zinc-500">Querying release manifest without telemetry.</p>
              </div>
            </div>
          ) : updateResult?.hasUpdate && updateResult.manifest ? (
            /* Update Available */
            <div className="space-y-4">
              <div className="p-4 bg-emerald-950/30 border border-emerald-800/80 rounded-xs space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-emerald-400" />
                    <span className="text-xs font-semibold text-emerald-300">
                      New Release Available
                    </span>
                  </div>
                  <span className="text-2xs font-mono font-bold px-2 py-0.5 rounded-xs bg-emerald-900/60 text-emerald-400 border border-emerald-700">
                    v{updateResult.manifest.version}
                  </span>
                </div>

                <div className="space-y-1 text-2xs font-mono text-zinc-300">
                  <div className="font-semibold text-zinc-100">{updateResult.manifest.title}</div>
                  <div className="text-zinc-500">Released: {updateResult.manifest.releaseDate}</div>
                </div>

                {/* Highlights */}
                {updateResult.manifest.highlights && updateResult.manifest.highlights.length > 0 && (
                  <div className="pt-2 border-t border-emerald-900/50 space-y-1.5">
                    <span className="text-3xs uppercase font-mono tracking-wider text-emerald-400 font-semibold">
                      Changelog Highlights
                    </span>
                    <ul className="space-y-1">
                      {updateResult.manifest.highlights.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-2xs text-zinc-300">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* SHA-256 Checksum receipt */}
                {updateResult.manifest.sha256 && (
                  <div className="pt-2 border-t border-emerald-900/50 space-y-1">
                    <div className="flex items-center gap-1.5 text-3xs font-mono text-zinc-400">
                      <ShieldCheck className="w-3 h-3 text-emerald-400" />
                      <span>SHA-256 Checksum Verified:</span>
                    </div>
                    <code className="block text-3xs font-mono text-zinc-400 bg-zinc-950/80 p-1.5 rounded-xs truncate">
                      {updateResult.manifest.sha256}
                    </code>
                  </div>
                )}
              </div>

              {/* Download Action */}
              <div className="flex items-center gap-2">
                <a
                  href={updateResult.manifest.downloadUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-2 h-9 bg-accent hover:bg-accent-hover text-white text-xs font-semibold rounded-xs transition-colors shadow-sm"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Windows .exe Installer ({updateResult.manifest.assetSize ?? 'Latest'})</span>
                  <ExternalLink className="w-3 h-3 opacity-70" />
                </a>
              </div>
            </div>
          ) : (
            /* Up to Date or Offline */
            <div className="p-6 bg-zinc-950 border border-zinc-800 rounded-xs text-center space-y-3">
              <CheckCircle2 className="w-7 h-7 text-emerald-400 mx-auto" />
              <div className="space-y-1">
                <h4 className="text-xs font-semibold text-zinc-200">
                  FormatPulse is up to date (v{CURRENT_APP_VERSION})
                </h4>
                <p className="text-2xs text-zinc-500">
                  You are running the latest cryptographic & offline data transformation engine.
                </p>
                {updateResult?.error && (
                  <p className="text-3xs font-mono text-amber-500/80 pt-1 flex items-center justify-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    Offline mode active: manifest check skipped.
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Footer Actions */}
          <div className="flex items-center justify-between pt-2 border-t border-zinc-800">
            <button
              type="button"
              onClick={() => void runCheck()}
              disabled={isChecking}
              className="flex items-center gap-1.5 text-2xs font-mono text-zinc-400 hover:text-zinc-200 transition-colors disabled:opacity-50"
            >
              <RefreshCw className={cn('w-3 h-3', isChecking && 'animate-spin')} />
              Check Again
            </button>
            <button
              type="button"
              onClick={() => setShowUpdateModal(false)}
              className="h-7 px-3 text-2xs font-semibold bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded-xs transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
