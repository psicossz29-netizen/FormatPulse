import React, { useState } from 'react';
import {
  Download,
  ShieldCheck,
  Copy,
  Check,
  Monitor,
  Cpu,
  Lock,
  ExternalLink,
  Info,
  Layers,
} from 'lucide-react';
import { APP_VERSION, OFFICIAL_SHA256, REPOSITORY_URL } from '@/constants/version';
import { openExternalUrl } from '@/core/desktopBridge';
import { useAppStore } from '@/store/useAppStore';

export const InstallerDownloadSection: React.FC = () => {
  const [copiedHash, setCopiedHash] = useState(false);
  const setShowDownloadModal = useAppStore((s) => s.setShowDownloadModal);

  const handleCopyHash = async () => {
    await navigator.clipboard.writeText(OFFICIAL_SHA256);
    setCopiedHash(true);
    setTimeout(() => setCopiedHash(false), 2000);
  };

  return (
    <section id="installer" className="py-20 md:py-28 relative">
      <div className="max-w-[1160px] mx-auto px-5">
        {/* Header */}
        <div className="text-center mb-14">
          <h2 className="font-display font-bold text-3xl sm:text-4xl md:text-5xl text-[#F4F4F5] tracking-tight max-w-[22ch] mx-auto">
            Potencia de escritorio nativa. Sin latencia de nube.
          </h2>
          <p className="mt-4 font-geist text-base sm:text-lg text-[#9A9AA5] max-w-2xl mx-auto leading-relaxed">
            Utiliza FormatPulse como una app de escritorio independiente. Construida con Rust y Tauri para un consumo mínimo de memoria (&lt;45MB RAM) y 100% de aislamiento offline air-gapped.
          </p>
        </div>

        {/* 2-Column Showcase */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Left Column: Download Card */}
          <div className="lg:col-span-7 flex flex-col justify-between p-8 rounded-[28px] bg-[#111114] border border-[#26262C] shadow-2xl relative overflow-hidden">
            <div>
              {/* Header */}
              <div className="flex items-center justify-between pb-6 border-b border-[#26262C]">
                <div className="flex items-center gap-3.5">
                  <div className="w-11 h-11 rounded-2xl bg-[#FF4F00]/10 border border-[#FF4F00]/25 flex items-center justify-center">
                    <Monitor className="w-5 h-5 text-[#FF4F00]" />
                  </div>
                  <div>
                    <h3 className="text-lg font-display font-bold text-[#F4F4F5]">FormatPulse Desktop</h3>
                    <div className="text-xs font-geist-mono text-[#9A9AA5]">Release v{APP_VERSION} (Windows 10/11 x64)</div>
                  </div>
                </div>
                <div className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-geist-mono font-medium flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>RELEASE OFICIAL</span>
                </div>
              </div>

              {/* Specs Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 my-6 text-xs font-geist-mono">
                <div className="p-3 rounded-xl bg-[#09090B] border border-[#26262C]">
                  <div className="text-[#9A9AA5] text-[11px] mb-1">Arquitectura</div>
                  <div className="text-[#F4F4F5] font-semibold flex items-center gap-1.5">
                    <Cpu className="w-3.5 h-3.5 text-[#FF4F00]" />
                    <span>x86_64 / Rust</span>
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-[#09090B] border border-[#26262C]">
                  <div className="text-[#9A9AA5] text-[11px] mb-1">Tamaño instalador</div>
                  <div className="text-[#F4F4F5] font-semibold flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-blue-400" />
                    <span>~7.8 MB</span>
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-[#09090B] border border-[#26262C]">
                  <div className="text-[#9A9AA5] text-[11px] mb-1">Red / Conexión</div>
                  <div className="text-[#F4F4F5] font-semibold flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-emerald-400" />
                    <span>0 peticiones</span>
                  </div>
                </div>
              </div>

              {/* Highlights List */}
              <div className="space-y-3 mb-8 text-xs font-geist text-[#9A9AA5]">
                <div className="flex items-center gap-2.5">
                  <div className="w-4 h-4 rounded-full bg-[#FF4F00]/20 flex items-center justify-center flex-none">
                    <Check className="w-2.5 h-2.5 text-[#FF4F00]" strokeWidth={3} />
                  </div>
                  <span><strong className="text-[#F4F4F5]">Menú nativo de sistema:</strong> Archivo, Edición, Ver, Herramientas, Preferencias y Ayuda</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <div className="w-4 h-4 rounded-full bg-[#FF4F00]/20 flex items-center justify-center flex-none">
                    <Check className="w-2.5 h-2.5 text-[#FF4F00]" strokeWidth={3} />
                  </div>
                  <span><strong className="text-[#F4F4F5]">Panel de ajustes (⌘,):</strong> Configuración de fuentes, word-wrap y paletas de color</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <div className="w-4 h-4 rounded-full bg-[#FF4F00]/20 flex items-center justify-center flex-none">
                    <Check className="w-2.5 h-2.5 text-[#FF4F00]" strokeWidth={3} />
                  </div>
                  <span><strong className="text-[#F4F4F5]">100% Offline Air-Gapped:</strong> Aprobado para infraestructuras bancarias y legales</span>
                </div>
              </div>
            </div>

            {/* CTA & Hash Box */}
            <div className="space-y-3.5 pt-6 border-t border-[#26262C]">
              <div className="flex flex-col sm:flex-row gap-3">
                <a
                  href={`/FormatPulse_${APP_VERSION}_x64-setup.exe`}
                  download
                  className="flex-1 h-11 rounded-xl bg-[#FF4F00] hover:bg-[#FF6A20] text-white font-geist text-xs font-semibold flex items-center justify-center gap-2 transition-all shadow-[0_0_20px_rgba(255,79,0,0.35)] hover:-translate-y-0.5 active:translate-y-0"
                >
                  <Download className="w-4 h-4" />
                  <span>Descargar instalador .EXE (Windows x64)</span>
                </a>
                <button
                  onClick={() => setShowDownloadModal(true)}
                  className="px-4 h-11 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-[#26262C] text-[#F4F4F5] font-geist text-xs transition-colors"
                >
                  <span>Verificar firma</span>
                </button>
              </div>

              {/* SHA-256 Box */}
              <div className="p-3 rounded-xl bg-[#09090B] border border-[#26262C] flex items-center justify-between gap-3 text-xs font-geist-mono">
                <div className="flex items-center gap-2 truncate">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 flex-none" />
                  <span className="text-[#9A9AA5] flex-none">SHA-256:</span>
                  <span className="text-[#F4F4F5] truncate select-all">{OFFICIAL_SHA256}</span>
                </div>
                <button
                  onClick={handleCopyHash}
                  className="flex-none px-2.5 py-1 rounded-lg bg-white/[0.06] hover:bg-white/[0.1] text-[#F4F4F5] transition-colors flex items-center gap-1"
                  title="Copiar Checksum SHA-256"
                >
                  {copiedHash ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-400" />
                      <span className="text-emerald-400 text-2xs">Copiado</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      <span className="text-2xs">Copiar</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Security Guidance */}
          <div className="lg:col-span-5 flex flex-col justify-between p-8 rounded-[28px] bg-[#111114] border border-[#26262C]">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-geist-mono mb-4">
                <Info className="w-3.5 h-3.5" />
                <span>Aviso de primer inicio</span>
              </div>

              <h3 className="text-xl font-display font-bold text-[#F4F4F5] mb-3">
                Verificación de Windows SmartScreen
              </h3>
              <p className="text-xs font-geist text-[#9A9AA5] leading-relaxed mb-6">
                FormatPulse es desarrollado de forma independiente y segura. Como no pagamos licencias corporativas innecesarias de certificados (\$500/año), Windows SmartScreen puede mostrar una advertencia preventiva de editor desconocido la primera vez.
              </p>

              {/* Steps */}
              <div className="p-4 rounded-2xl bg-[#09090B] border border-[#26262C] space-y-3 mb-6">
                <div className="text-xs font-geist font-semibold text-[#F4F4F5]">
                  Cómo completar la instalación en 2 clics:
                </div>
                <ol className="list-decimal list-inside space-y-2 text-xs font-geist text-[#9A9AA5]">
                  <li>
                    Si Windows muestra <span className="text-[#F4F4F5] font-semibold">&quot;Windows protegió su PC&quot;</span>, haz clic en{' '}
                    <span className="text-[#FF4F00] font-semibold">Más información</span>.
                  </li>
                  <li>
                    Haz clic en <span className="text-emerald-400 font-semibold">Ejecutar de todas formas</span>.
                  </li>
                  <li>La aplicación se iniciará de inmediato sin procesos de fondo.</li>
                </ol>
              </div>
            </div>

            <div className="pt-6 border-t border-[#26262C] flex items-center justify-between text-xs font-geist text-[#9A9AA5]">
              <a
                href={REPOSITORY_URL}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => {
                  e.preventDefault();
                  void openExternalUrl(REPOSITORY_URL);
                }}
                className="hover:text-[#F4F4F5] transition-colors flex items-center gap-1 text-[#FF4F00]"
              >
                <span>Auditar código en GitHub</span>
                <ExternalLink className="w-3 h-3" />
              </a>
              <span className="text-[#26262C]">·</span>
              <span className="text-emerald-400">100% Libre de telemetría</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
