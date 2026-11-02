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
    <section id="installer" className="relative w-full border-b border-zinc-800/80 bg-[#06070b] px-4 py-20 md:py-28 overflow-hidden">
      {/* Background glow mesh */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-gradient-to-r from-accent/15 via-blue-500/10 to-emerald-500/15 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Section Tag */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-white/10 text-2xs font-mono text-zinc-300 mb-4 backdrop-blur-md">
            <Monitor className="w-3.5 h-3.5 text-accent" />
            <span className="tracking-widest uppercase text-accent font-semibold">Native Desktop Application</span>
            <span className="text-zinc-600">//</span>
            <span>Windows x64 Build</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-white font-sans uppercase">
            Dedicated Desktop Power. Zero Cloud Latency.
          </h2>
          <p className="mt-4 text-sm sm:text-base text-zinc-400 font-mono max-w-2xl mx-auto leading-relaxed">
            Experience FormatPulse as a standalone desktop IDE. Built with Tauri & Rust for minimal memory footprint (&lt;45MB RAM), native OS menu bars, and 100% offline air-gapped security.
          </p>
        </div>

        {/* Main 2-Column Showcase */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Left Column: Download Card */}
          <div className="lg:col-span-7 flex flex-col justify-between p-8 rounded-3xl bg-zinc-900/50 border border-white/10 backdrop-blur-xl shadow-2xl relative overflow-hidden group">
            {/* Ambient hover light */}
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-accent/20 rounded-full blur-3xl group-hover:bg-accent/30 transition-all duration-500 pointer-events-none" />

            <div>
              {/* Header */}
              <div className="flex items-center justify-between pb-6 border-b border-zinc-800">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-accent/10 border border-accent/30 flex items-center justify-center">
                    <Monitor className="w-6 h-6 text-accent" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white font-sans">FormatPulse Desktop</h3>
                    <div className="text-2xs font-mono text-zinc-400">Release v{APP_VERSION} (Windows 10/11 x64)</div>
                  </div>
                </div>
                <div className="px-3 py-1 rounded-full bg-emerald-950/60 border border-emerald-800/80 text-emerald-400 text-2xs font-mono font-semibold flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>OFFICIAL RELEASE</span>
                </div>
              </div>

              {/* Specs Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 my-6 text-2xs font-mono">
                <div className="p-3 rounded-xl bg-zinc-950/60 border border-zinc-800/80">
                  <div className="text-zinc-500 mb-1">Architecture</div>
                  <div className="text-zinc-200 font-semibold flex items-center gap-1.5">
                    <Cpu className="w-3.5 h-3.5 text-accent" />
                    <span>x86_64 / Rust</span>
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-zinc-950/60 border border-zinc-800/80">
                  <div className="text-zinc-500 mb-1">Installer Size</div>
                  <div className="text-zinc-200 font-semibold flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-blue-400" />
                    <span>~7.8 MB</span>
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-zinc-950/60 border border-zinc-800/80">
                  <div className="text-zinc-500 mb-1">Network Access</div>
                  <div className="text-zinc-200 font-semibold flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-emerald-400" />
                    <span>0 Outbound IO</span>
                  </div>
                </div>
              </div>

              {/* Desktop Highlights List */}
              <div className="space-y-3 mb-8 text-xs font-mono text-zinc-300">
                <div className="flex items-center gap-2.5">
                  <div className="w-4 h-4 rounded-full bg-accent/20 flex items-center justify-center flex-none">
                    <Check className="w-2.5 h-2.5 text-accent" strokeWidth={3} />
                  </div>
                  <span><strong>Native Menu Bar:</strong> File, Edit, View, Tools, Preferences & Help dropdowns</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <div className="w-4 h-4 rounded-full bg-accent/20 flex items-center justify-center flex-none">
                    <Check className="w-2.5 h-2.5 text-accent" strokeWidth={3} />
                  </div>
                  <span><strong>Antigravity-Style Settings Modal (⌘,):</strong> Fine-grained font sizes, word wrap & themes</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <div className="w-4 h-4 rounded-full bg-accent/20 flex items-center justify-center flex-none">
                    <Check className="w-2.5 h-2.5 text-accent" strokeWidth={3} />
                  </div>
                  <span><strong>100% Offline Air-Gapped:</strong> Works in high-security bank & defense networks</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <div className="w-4 h-4 rounded-full bg-accent/20 flex items-center justify-center flex-none">
                    <Check className="w-2.5 h-2.5 text-accent" strokeWidth={3} />
                  </div>
                  <span><strong>Local State Persistence:</strong> Zero data ever transmitted outside your device</span>
                </div>
              </div>
            </div>

            {/* CTA & Hash Box */}
            <div className="space-y-4 pt-6 border-t border-zinc-800">
              <div className="flex flex-col sm:flex-row gap-3">
                <a
                  href={`/FormatPulse_${APP_VERSION}_x64-setup.exe`}
                  download
                  className="flex-1 h-12 rounded-xl bg-accent hover:bg-accent-hover text-white font-mono text-xs font-bold flex items-center justify-center gap-2.5 transition-all shadow-[0_0_30px_rgba(255,79,0,0.35)] hover:scale-[1.01]"
                >
                  <Download className="w-4 h-4" />
                  <span>Download .EXE (Windows x64)</span>
                </a>
                <button
                  onClick={() => setShowDownloadModal(true)}
                  className="px-5 h-12 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 text-zinc-200 font-mono text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
                >
                  <span>Verification Info</span>
                </button>
              </div>

              {/* SHA-256 Box */}
              <div className="p-3 rounded-xl bg-zinc-950/80 border border-zinc-800 flex items-center justify-between gap-3 text-2xs font-mono">
                <div className="flex items-center gap-2 truncate">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 flex-none" />
                  <span className="text-zinc-500 flex-none">SHA-256:</span>
                  <span className="text-zinc-300 truncate select-all">{OFFICIAL_SHA256}</span>
                </div>
                <button
                  onClick={handleCopyHash}
                  className="flex-none px-2 py-1 rounded-sm bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition-colors flex items-center gap-1"
                  title="Copy SHA-256 Checksum"
                >
                  {copiedHash ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-400" />
                      <span className="text-emerald-400">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Security Guidance / SmartScreen Note */}
          <div className="lg:col-span-5 flex flex-col justify-between p-8 rounded-3xl bg-zinc-900/30 border border-white/10 backdrop-blur-xl">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-950/50 border border-blue-800/60 text-blue-400 text-2xs font-mono mb-4">
                <Info className="w-3 h-3" />
                <span>First-Run Installation Notice</span>
              </div>

              <h3 className="text-xl font-bold text-white font-sans uppercase mb-3">
                Windows SmartScreen Verification
              </h3>
              <p className="text-xs font-mono text-zinc-400 leading-relaxed mb-6">
                FormatPulse is built by independent developers committed to zero-cloud software. Because we do not purchase costly (\$500/yr) enterprise corporate code-signing certificates, Microsoft Defender SmartScreen may display an &quot;unknown publisher&quot; warning on first launch.
              </p>

              {/* Stylized Defender Card */}
              <div className="p-4 rounded-2xl bg-zinc-950/90 border border-zinc-800 space-y-3 mb-6">
                <div className="text-xs font-sans font-semibold text-zinc-200 flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-blue-400" />
                  <span>How to complete setup in 2 clicks:</span>
                </div>
                <ol className="list-decimal list-inside space-y-2 text-2xs font-mono text-zinc-300">
                  <li>
                    When Windows shows <span className="text-white font-bold">&quot;Windows protegió su PC&quot;</span>, click on{' '}
                    <span className="text-accent underline font-semibold">Más información (More info)</span>.
                  </li>
                  <li>
                    Click <span className="text-emerald-400 underline font-semibold">Ejecutar de todas formas (Run anyway)</span>.
                  </li>
                  <li>The app opens immediately with 0 background processes.</li>
                </ol>
              </div>

              <p className="text-3xs font-mono text-zinc-500 leading-relaxed">
                You can independently audit the executable hash against the official GitHub releases and SHA-256 manifest to guarantee 100% cryptographic integrity.
              </p>
            </div>

            <div className="pt-6 border-t border-zinc-800/80 flex items-center justify-between text-2xs font-mono text-zinc-400">
              <a
                href={REPOSITORY_URL}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => {
                  e.preventDefault();
                  void openExternalUrl(REPOSITORY_URL);
                }}
                className="hover:text-white transition-colors flex items-center gap-1 text-accent"
              >
                <span>Audit GitHub Source</span>
                <ExternalLink className="w-3 h-3" />
              </a>
              <span className="text-zinc-600">·</span>
              <span>100% Virus-Free Clean Build</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
