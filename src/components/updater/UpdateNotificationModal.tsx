import React, { useEffect, useState, useCallback } from 'react';
import {
  X,
  RefreshCw,
  Sparkles,
  Download,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { checkForUpdates, type UpdateCheckResult } from '@/services/updaterService';
import { APP_VERSION as CURRENT_APP_VERSION } from '@/constants/version';
import { openExternalUrl } from '@/core/desktopBridge';
import { FormatPulseLogo } from '@/components/brand/FormatPulseLogo';
import { cn } from '@/lib/utils';

export const UpdateNotificationModal: React.FC = () => {
  const showUpdateModal = useAppStore((s) => s.showUpdateModal);
  const setShowUpdateModal = useAppStore((s) => s.setShowUpdateModal);

  const [isChecking, setIsChecking] = useState(false);
  const [updateResult, setUpdateResult] = useState<UpdateCheckResult | null>(null);

  const runCheck = useCallback(async () => {
    setIsChecking(true);
    try {
      const res = await checkForUpdates();
      setUpdateResult(res);
    } catch {
      setUpdateResult({
        hasUpdate: false,
        currentVersion: CURRENT_APP_VERSION,
        latestVersion: CURRENT_APP_VERSION,
        manifest: null,
        checkedAt: Date.now(),
        error: 'Network unreachable or offline mode active.',
      });
    } finally {
      setIsChecking(false);
    }
  }, []);

  // When modal is shown and we haven't checked yet, auto-trigger check
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
        className="fixed inset-0 bg-[#09090B]/85 backdrop-blur-md transition-opacity"
        onClick={() => setShowUpdateModal(false)}
      />

      {/* ── Spaceship Modal Window ──────────────────────────────────── */}
      <div className="relative w-full max-w-lg bg-[#111114] border border-[#26262C] shadow-[0_32px_80px_rgba(0,0,0,0.85)] rounded-[28px] overflow-hidden my-auto text-[#F4F4F5] animate-pop font-geist">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#26262C] bg-[#09090B]/60">
          <div className="flex items-center gap-2.5">
            <FormatPulseLogo size={22} animate={false} />
            <span className="font-display font-bold text-sm text-[#F4F4F5] tracking-tight">
              FormatPulse Release Engine
            </span>
            <span className="text-[10px] font-geist-mono px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-medium">
              v{CURRENT_APP_VERSION}
            </span>
          </div>
          <button
            onClick={() => setShowUpdateModal(false)}
            className="w-8 h-8 flex items-center justify-center text-[#9A9AA5] hover:text-[#F4F4F5] hover:bg-white/[0.06] transition-colors rounded-xl focus:outline-none"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-5">
          {/* Status Display */}
          {isChecking ? (
            <div className="p-8 text-center space-y-3 bg-[#09090B] border border-[#26262C] rounded-2xl">
              <RefreshCw className="w-7 h-7 text-[#FF4F00] animate-spin mx-auto" />
              <div className="space-y-1">
                <p className="text-xs font-semibold text-[#F4F4F5]">Buscando actualizaciones oficiales...</p>
                <p className="text-xs text-[#9A9AA5]">Consultando manifiesto de versión sin telemetría de usuario.</p>
              </div>
            </div>
          ) : updateResult?.hasUpdate && updateResult.manifest ? (
            /* Update Available */
            <div className="space-y-4">
              <div className="p-5 bg-emerald-500/5 border border-emerald-500/25 rounded-2xl space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-emerald-400" />
                    <span className="text-xs font-semibold text-emerald-300 font-display">
                      Nueva versión disponible
                    </span>
                  </div>
                  <span className="text-xs font-geist-mono font-bold px-2 py-0.5 rounded-lg bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                    v{updateResult.manifest.version}
                  </span>
                </div>

                <div className="space-y-1 text-xs font-geist text-[#9A9AA5]">
                  <div className="font-semibold text-[#F4F4F5]">{updateResult.manifest.title}</div>
                  <div>Publicado: {updateResult.manifest.releaseDate}</div>
                </div>

                {/* Highlights */}
                {updateResult.manifest.highlights && updateResult.manifest.highlights.length > 0 && (
                  <div className="pt-3 border-t border-emerald-500/20 space-y-2">
                    <span className="text-[10px] uppercase font-geist-mono tracking-wider text-emerald-400 font-semibold">
                      Novedades de la versión
                    </span>
                    <ul className="space-y-1.5">
                      {updateResult.manifest.highlights.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-xs text-[#9A9AA5]">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* SHA-256 Checksum receipt */}
                {updateResult.manifest.sha256 && (
                  <div className="pt-3 border-t border-emerald-500/20 space-y-1.5">
                    <div className="flex items-center gap-1.5 text-xs font-geist-mono text-[#9A9AA5]">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Firma SHA-256 Verificada:</span>
                    </div>
                    <code className="block text-[11px] font-geist-mono text-[#F4F4F5] bg-[#09090B] p-2 rounded-xl truncate border border-[#26262C]">
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
                  onClick={(e) => {
                    e.preventDefault();
                    if (updateResult.manifest?.downloadUrl) {
                      void openExternalUrl(updateResult.manifest.downloadUrl);
                    }
                  }}
                  className="flex-1 flex items-center justify-center gap-2 h-11 bg-[#FF4F00] hover:bg-[#FF6A20] text-white text-xs font-semibold rounded-xl transition-all shadow-[0_0_24px_rgba(255,79,0,0.35)]"
                >
                  <Download className="w-4 h-4" />
                  <span>Descargar Instalador .exe ({updateResult.manifest.assetSize ?? 'Latest'})</span>
                  <ExternalLink className="w-3.5 h-3.5 opacity-80" />
                </a>
              </div>
            </div>
          ) : (
            /* Up to Date or Offline */
            <div className="p-8 bg-[#09090B] border border-[#26262C] rounded-2xl text-center space-y-3">
              <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
              <div className="space-y-1">
                <h4 className="text-sm font-display font-bold text-[#F4F4F5]">
                  FormatPulse está actualizado (v{CURRENT_APP_VERSION})
                </h4>
                <p className="text-xs text-[#9A9AA5] font-geist">
                  Estás ejecutando la última versión del motor con aislamiento offline y cero telemetría.
                </p>
                {updateResult?.error && (
                  <p className="text-xs font-geist-mono text-amber-400/90 pt-1 flex items-center justify-center gap-1.5">
                    <AlertCircle className="w-3.5 h-3.5" />
                    Modo offline activo: comprobación de manifiesto omitida.
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Footer Actions */}
          <div className="flex items-center justify-between pt-3 border-t border-[#26262C]">
            <button
              type="button"
              onClick={() => void runCheck()}
              disabled={isChecking}
              className="flex items-center gap-1.5 text-xs font-geist text-[#9A9AA5] hover:text-[#F4F4F5] transition-colors disabled:opacity-50"
            >
              <RefreshCw className={cn('w-3.5 h-3.5', isChecking && 'animate-spin')} />
              <span>Comprobar de nuevo</span>
            </button>
            <button
              type="button"
              onClick={() => setShowUpdateModal(false)}
              className="h-10 px-5 text-xs font-geist font-semibold bg-white/[0.06] hover:bg-white/[0.1] text-[#F4F4F5] rounded-xl border border-[#26262C] transition-colors"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
