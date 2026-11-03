import React, { useState } from 'react';
import {
  X,
  Download,
  ShieldCheck,
  Copy,
  Check,
  ExternalLink,
  Terminal,
  Monitor,
  AlertTriangle,
  ArrowRight,
} from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { FormatPulseLogo } from '@/components/brand/FormatPulseLogo';
import { APP_VERSION, OFFICIAL_SHA256 } from '@/constants/version';
import { openExternalUrl } from '@/core/desktopBridge';

const EXE_URL = `https://github.com/psicossz29-netizen/FormatPulse/releases/download/v${APP_VERSION}/FormatPulse_${APP_VERSION}_x64-setup.exe`;
const SHA256_HASH = OFFICIAL_SHA256;

export const DownloadModal: React.FC = () => {
  const showDownloadModal = useAppStore((s) => s.showDownloadModal);
  const setShowDownloadModal = useAppStore((s) => s.setShowDownloadModal);
  const setViewMode = useAppStore((s) => s.setViewMode);

  const [copiedHash, setCopiedHash] = useState(false);
  const [copiedWinget, setCopiedWinget] = useState(false);

  if (!showDownloadModal) return null;

  const handleCopyHash = async () => {
    await navigator.clipboard.writeText(SHA256_HASH);
    setCopiedHash(true);
    setTimeout(() => setCopiedHash(false), 1500);
  };

  const handleCopyWinget = async () => {
    await navigator.clipboard.writeText('winget install formatpulse');
    setCopiedWinget(true);
    setTimeout(() => setCopiedWinget(false), 1500);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-label="FormatPulse Windows Installer"
    >
      {/* ── Backdrop ────────────────────────────────────────────────── */}
      <div
        className="fixed inset-0 bg-[#09090B]/85 backdrop-blur-md transition-opacity"
        onClick={() => setShowDownloadModal(false)}
      />

      {/* ── Spaceship Modal Window ──────────────────────────────────── */}
      <div className="relative w-full max-w-xl bg-[#111114] border border-[#26262C] shadow-[0_32px_80px_rgba(0,0,0,0.85)] rounded-[28px] overflow-hidden my-auto text-[#F4F4F5] animate-pop font-geist">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#26262C] bg-[#09090B]/60">
          <div className="flex items-center gap-2.5">
            <FormatPulseLogo size={22} animate={false} />
            <span className="font-display font-bold text-sm text-[#F4F4F5] tracking-tight">
              INSTALLER // WINDOWS x64 NATIVE
            </span>
            <span className="text-[10px] font-geist-mono px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-medium">
              v{APP_VERSION}
            </span>
          </div>
          <button
            onClick={() => setShowDownloadModal(false)}
            className="w-8 h-8 flex items-center justify-center text-[#9A9AA5] hover:text-[#F4F4F5] hover:bg-white/[0.06] transition-colors rounded-xl focus:outline-none"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-5 max-h-[85vh] overflow-y-auto">
          {/* ── Main Download Action ─────────────────────────────────── */}
          <div className="p-5 rounded-2xl bg-[#09090B] border border-[#26262C] flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="space-y-1 text-center sm:text-left">
              <div className="text-sm font-semibold font-geist-mono text-[#F4F4F5]">
                FormatPulse_{APP_VERSION}_x64-setup.exe
              </div>
              <div className="text-xs text-[#9A9AA5] font-geist">
                Tamaño: ~7.8 MB · Windows 10/11 x64 · 100% Offline Air-Gapped
              </div>
            </div>

            <a
              href={EXE_URL}
              download={`FormatPulse_${APP_VERSION}_x64-setup.exe`}
              className="flex-none flex items-center gap-2 h-11 px-5 bg-[#FF4F00] hover:bg-[#FF6A20] text-white font-geist text-xs font-semibold tracking-tight transition-all rounded-xl shadow-[0_0_24px_rgba(255,79,0,0.35)] hover:-translate-y-0.5 active:translate-y-0"
            >
              <Download className="w-4 h-4" />
              <span>Iniciar Descarga</span>
            </a>
          </div>

          {/* ── SmartScreen Guidance (Spaceship Shield Card) ── */}
          <div className="rounded-2xl border border-amber-500/25 bg-amber-500/5 p-4 space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-7 h-7 rounded-xl bg-amber-500/10 border border-amber-500/25 flex items-center justify-center text-amber-400 flex-none mt-0.5">
                <AlertTriangle className="w-4 h-4" />
              </div>
              <div className="space-y-1">
                <div className="text-xs font-display font-bold text-amber-300">
                  ¿Por qué Windows muestra la pantalla de SmartScreen?
                </div>
                <p className="text-xs text-[#9A9AA5] leading-relaxed font-geist">
                  FormatPulse es un software nuevo, independiente y de código abierto que no realiza telemetría a los servidores de Microsoft. Microsoft Defender muestra este aviso estándar de forma preventiva a cualquier aplicación recién publicada hasta acumular reputación global.
                </p>
              </div>
            </div>

            {/* Step by step mockup box */}
            <div className="bg-[#09090B] border border-[#26262C] p-3.5 rounded-xl space-y-2.5">
              <div className="text-[#9A9AA5] uppercase text-[10px] font-geist-mono tracking-wider font-semibold">
                PASOS PARA EJECUTAR EL INSTALADOR:
              </div>
              <div className="flex items-center gap-3 p-2.5 bg-[#111114] border border-[#26262C] rounded-xl text-xs font-geist">
                <span className="w-6 h-6 flex items-center justify-center bg-white/[0.06] border border-[#26262C] text-[#F4F4F5] font-bold rounded-lg flex-none text-xs">
                  1
                </span>
                <span className="text-[#9A9AA5]">
                  En la ventana azul/negra, pulsa en el texto azul:{' '}
                  <strong className="text-sky-400 underline font-semibold">«Más información»</strong> (More info).
                </span>
              </div>
              <div className="flex items-center gap-3 p-2.5 bg-[#111114] border border-[#26262C] rounded-xl text-xs font-geist">
                <span className="w-6 h-6 flex items-center justify-center bg-[#FF4F00] text-white font-bold rounded-lg flex-none text-xs shadow-[0_0_12px_rgba(255,79,0,0.35)]">
                  2
                </span>
                <span className="text-[#9A9AA5]">
                  Aparecerá el botón abajo a la derecha:{' '}
                  <strong className="text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-lg border border-emerald-500/30 font-semibold">
                    «Ejecutar de todas formas»
                  </strong>.
                </span>
              </div>
            </div>
          </div>

          {/* ── Security & Integrity Verification ─────────────────────── */}
          <div className="p-4 bg-[#09090B] border border-[#26262C] rounded-2xl space-y-2.5">
            <div className="flex items-center justify-between text-xs font-geist">
              <span className="flex items-center gap-1.5 text-emerald-400 font-semibold font-geist-mono text-xs">
                <ShieldCheck className="w-4 h-4" />
                VERIFICACIÓN CRIPTOGRÁFICA DE INTEGRIDAD
              </span>
              <span className="text-[10px] font-geist-mono px-2 py-0.5 rounded-md bg-white/[0.04] border border-[#26262C] text-[#9A9AA5]">
                SHA-256
              </span>
            </div>

            <div className="flex items-center justify-between gap-2 p-2.5 bg-[#111114] border border-[#26262C] rounded-xl text-xs font-geist-mono text-[#9A9AA5] overflow-x-auto">
              <span className="truncate select-all text-[#F4F4F5]">{SHA256_HASH}</span>
              <button
                onClick={handleCopyHash}
                className="flex items-center gap-1.5 px-3 py-1 bg-white/[0.06] hover:bg-white/[0.1] text-[#F4F4F5] rounded-lg transition-colors flex-none font-geist text-xs"
              >
                {copiedHash ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400">Copiado</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copiar</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* ── Alternatives: WinGet or Web Studio ─────────────────────── */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            {/* WinGet Option */}
            <div className="p-4 bg-[#09090B] border border-[#26262C] rounded-2xl space-y-2">
              <div className="flex items-center gap-2 text-xs font-display font-semibold text-[#F4F4F5]">
                <Terminal className="w-3.5 h-3.5 text-[#FF4F00]" />
                <span>Instalar vía WinGet</span>
              </div>
              <div className="flex items-center justify-between gap-2 p-2 bg-[#111114] border border-[#26262C] rounded-xl text-xs font-geist-mono text-[#9A9AA5]">
                <code className="text-[#F4F4F5]">winget install formatpulse</code>
                <button
                  onClick={handleCopyWinget}
                  className="p-1 hover:text-[#FF4F00] transition-colors focus:outline-none"
                  title="Copiar comando"
                >
                  {copiedWinget ? (
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>
            </div>

            {/* Direct Web Studio Option */}
            <div className="p-4 bg-[#09090B] border border-[#26262C] rounded-2xl space-y-2 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 text-xs font-display font-semibold text-[#F4F4F5]">
                  <Monitor className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Usar sin instalación</span>
                </div>
                <div className="text-xs text-[#9A9AA5] font-geist mt-1">
                  Misma privacidad offline directamente en tu navegador.
                </div>
              </div>
              <button
                onClick={() => {
                  setShowDownloadModal(false);
                  setViewMode('workspace');
                }}
                className="flex items-center justify-between text-xs font-geist font-medium text-[#FF4F00] hover:text-[#FF6A20] pt-1 transition-colors group"
              >
                <span>Abrir Web Studio [⌘K]</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="h-11 px-6 border-t border-[#26262C] bg-[#09090B]/60 flex items-center justify-between text-xs font-geist text-[#9A9AA5]">
          <span>100% Client-Side Engine · Zero Network IO</span>
          <a
            href="https://github.com/psicossz29-netizen/FormatPulse/releases"
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => {
              e.preventDefault();
              void openExternalUrl('https://github.com/psicossz29-netizen/FormatPulse/releases');
            }}
            className="flex items-center gap-1.5 hover:text-[#F4F4F5] transition-colors text-xs"
          >
            <span>Ver Release en GitHub</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </div>
  );
};
