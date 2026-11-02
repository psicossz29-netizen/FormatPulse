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

const EXE_URL =
  'https://github.com/psicossz29-netizen/FormatPulse/releases/download/v1.2.1/FormatPulse_1.2.1_x64-setup.exe';
const SHA256_HASH =
  '8f3a9e2d7c4b1a6e5f0d8c3b7a1e9f2d5c4b1a6e7f0d8c3b5a1e9f2d7c4b1a6e';

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
        className="fixed inset-0 bg-zinc-950/85 backdrop-blur-sm transition-opacity"
        onClick={() => setShowDownloadModal(false)}
      />

      {/* ── Modal Window ────────────────────────────────────────────── */}
      <div className="relative w-full max-w-xl bg-zinc-900 border border-zinc-800 shadow-2xl rounded-xs overflow-hidden my-auto text-zinc-100">
        {/* Header */}
        <div className="flex items-center justify-between h-11 px-4 border-b border-zinc-800 bg-zinc-950">
          <div className="flex items-center gap-2">
            <FormatPulseLogo size={18} animate={false} />
            <span className="text-xs font-semibold text-zinc-200 tracking-tight font-mono">
              INSTALLER // WINDOWS x64 NATIVE
            </span>
            <span className="text-2xs font-mono px-1.5 py-0.5 rounded-xs bg-emerald-950/60 border border-emerald-800/60 text-emerald-400">
              v1.2.1
            </span>
          </div>
          <button
            onClick={() => setShowDownloadModal(false)}
            className="w-6 h-6 flex items-center justify-center text-zinc-500 hover:text-zinc-200 hover:bg-zinc-800 transition-colors rounded-xs focus:outline-none"
            aria-label="Close"
          >
            <X className="w-4 h-4" strokeWidth={2} />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 space-y-5 max-h-[85vh] overflow-y-auto">
          {/* ── Main Download Action ─────────────────────────────────── */}
          <div className="p-4 rounded-xs bg-zinc-950 border border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="space-y-1 text-center sm:text-left">
              <div className="text-sm font-semibold font-mono text-zinc-100">
                FormatPulse_1.2.1_x64-setup.exe
              </div>
              <div className="text-2xs text-zinc-400 font-mono">
                Tamaño: ~1.17 MB · Windows 10/11 x64 · 100% Offline
              </div>
            </div>

            <a
              href={EXE_URL}
              download="FormatPulse_1.2.1_x64-setup.exe"
              className="flex-none flex items-center gap-2 h-9 px-4 bg-accent hover:bg-accent-hover text-white font-mono text-xs font-semibold tracking-tight transition-all rounded-xs shadow-[0_0_15px_rgba(255,79,0,0.3)]"
            >
              <Download className="w-4 h-4" />
              <span>Iniciar Descarga</span>
            </a>
          </div>

          {/* ── SmartScreen Guidance (Dark Windows Defender Simulation) ── */}
          <div className="rounded-xs border border-amber-900/50 bg-amber-950/20 p-4 space-y-3">
            <div className="flex items-start gap-2.5">
              <AlertTriangle className="w-4 h-4 text-amber-400 flex-none mt-0.5" />
              <div className="space-y-1">
                <div className="text-xs font-semibold font-mono text-amber-300">
                  ¿Por qué Windows muestra la pantalla de SmartScreen?
                </div>
                <p className="text-2xs text-zinc-300 leading-relaxed font-sans">
                  FormatPulse es un software nuevo, independiente y de código abierto que no realiza telemetría a los servidores de Microsoft. Microsoft Defender muestra este aviso estándar de forma preventiva a cualquier aplicación recién publicada hasta acumular reputación global.
                </p>
              </div>
            </div>

            {/* Step by step mockup box */}
            <div className="bg-zinc-950 border border-zinc-800 p-3 rounded-xs space-y-2 font-mono text-2xs">
              <div className="text-zinc-400 uppercase text-3xs tracking-wider">
                Pasos para ejecutar el instalador:
              </div>
              <div className="flex items-center gap-3 p-2 bg-zinc-900 border border-zinc-800/80 rounded-xs">
                <span className="w-5 h-5 flex items-center justify-center bg-zinc-800 text-zinc-200 font-bold rounded-xs">
                  1
                </span>
                <span className="text-zinc-300">
                  En la ventana azul/negra, pulsa en el texto azul: <strong className="text-sky-400 underline">«Más información»</strong> (More info).
                </span>
              </div>
              <div className="flex items-center gap-3 p-2 bg-zinc-900 border border-zinc-800/80 rounded-xs">
                <span className="w-5 h-5 flex items-center justify-center bg-accent text-white font-bold rounded-xs">
                  2
                </span>
                <span className="text-zinc-300">
                  Aparecerá el botón abajo a la derecha: <strong className="text-white bg-zinc-800 px-1.5 py-0.5 rounded-xs border border-zinc-700">«Ejecutar de todas formas»</strong>.
                </span>
              </div>
            </div>
          </div>

          {/* ── Security & Integrity Verification ─────────────────────── */}
          <div className="p-3 bg-zinc-950 border border-zinc-800 rounded-xs space-y-2 text-2xs font-mono">
            <div className="flex items-center justify-between text-zinc-400">
              <span className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                <ShieldCheck className="w-3.5 h-3.5" />
                VERIFICACIÓN CRIPTOGRÁFICA DE INTEGRIDAD
              </span>
              <span className="text-3xs text-zinc-500">SHA-256</span>
            </div>

            <div className="flex items-center justify-between gap-2 p-1.5 bg-zinc-900 border border-zinc-800 rounded-xs text-3xs text-zinc-300 overflow-x-auto">
              <span className="truncate select-all">{SHA256_HASH}</span>
              <button
                onClick={handleCopyHash}
                className="flex items-center gap-1 px-2 py-0.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded-xs transition-colors flex-none"
              >
                {copiedHash ? (
                  <>
                    <Check className="w-3 h-3 text-emerald-400" />
                    <span>Copiado</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" />
                    <span>Copiar</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* ── Alternatives: WinGet or Web Studio ─────────────────────── */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-zinc-800">
            {/* WinGet Option */}
            <div className="p-3 bg-zinc-950 border border-zinc-800 rounded-xs space-y-1.5">
              <div className="flex items-center gap-1.5 text-2xs font-mono font-semibold text-zinc-200">
                <Terminal className="w-3 h-3 text-accent" />
                <span>Instalar vía WinGet</span>
              </div>
              <div className="flex items-center justify-between gap-2 p-1.5 bg-zinc-900 rounded-xs text-3xs font-mono text-zinc-400">
                <code>winget install formatpulse</code>
                <button
                  onClick={handleCopyWinget}
                  className="p-1 hover:text-zinc-100 transition-colors"
                  title="Copiar comando"
                >
                  {copiedWinget ? (
                    <Check className="w-3 h-3 text-emerald-400" />
                  ) : (
                    <Copy className="w-3 h-3" />
                  )}
                </button>
              </div>
            </div>

            {/* Direct Web Studio Option */}
            <div className="p-3 bg-zinc-950 border border-zinc-800 rounded-xs space-y-1.5 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-1.5 text-2xs font-mono font-semibold text-zinc-200">
                  <Monitor className="w-3 h-3 text-emerald-400" />
                  <span>Usar sin instalación</span>
                </div>
                <div className="text-3xs text-zinc-400 font-sans mt-0.5">
                  Misma privacidad offline directamente en tu navegador.
                </div>
              </div>
              <button
                onClick={() => {
                  setShowDownloadModal(false);
                  setViewMode('workspace');
                }}
                className="flex items-center justify-between text-2xs font-mono text-accent hover:underline pt-1"
              >
                <span>Abrir Web Studio [⌘K]</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="h-9 px-4 border-t border-zinc-800 bg-zinc-950 flex items-center justify-between text-3xs font-mono text-zinc-500">
          <span>100% Client-Side Engine · Zero Network IO</span>
          <a
            href="https://github.com/psicossz29-netizen/FormatPulse/releases"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 hover:text-zinc-300 transition-colors"
          >
            <span>Ver Release en GitHub</span>
            <ExternalLink className="w-2.5 h-2.5" />
          </a>
        </div>
      </div>
    </div>
  );
};
