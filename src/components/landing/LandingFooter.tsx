import React from 'react';
import { Terminal, ArrowUp, Mail, ExternalLink, ShieldCheck, Download } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { FormatPulseLogo } from '@/components/brand/FormatPulseLogo';
import { APP_VERSION, SUPPORT_EMAIL, REPOSITORY_URL } from '@/constants/version';

export const LandingFooter: React.FC = () => {
  const setViewMode = useAppStore((s) => s.setViewMode);
  const setShowLegalModal = useAppStore((s) => s.setShowLegalModal);
  const setShowDownloadModal = useAppStore((s) => s.setShowDownloadModal);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="w-full border-t border-zinc-800/80 bg-[#050609] px-4 py-16 select-none font-mono text-xs">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
        <div>
          <div className="flex items-center gap-2.5 mb-3">
            <FormatPulseLogo size={22} showText={true} version={`v${APP_VERSION}`} />
          </div>
          <p className="text-2xs text-zinc-500 max-w-sm leading-relaxed">
            Local-first schema inference, data conversion, and sensitive PII anonymization. Zero-server telemetry, 100% in-browser memory execution.
          </p>
          <div className="mt-4 flex items-center gap-2 text-3xs text-emerald-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>Zero telemetry active · No cookies tracked</span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-5 text-2xs text-zinc-400">
          <button
            onClick={() => setViewMode('workspace')}
            className="hover:text-white transition-colors flex items-center gap-1.5 text-accent font-semibold"
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>Launch Workspace</span>
          </button>

          <button
            onClick={() => setShowDownloadModal(true)}
            className="hover:text-white transition-colors flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5 text-accent" />
            <span>Download .exe (v{APP_VERSION})</span>
          </button>

          <button
            onClick={() => setShowLegalModal(true)}
            className="hover:text-white transition-colors"
          >
            Terms &amp; EULA
          </button>

          <button
            onClick={() => setShowLegalModal(true)}
            className="hover:text-white transition-colors"
          >
            Zero-Data Privacy
          </button>

          <button
            onClick={() => setShowLegalModal(true)}
            className="hover:text-white transition-colors"
          >
            14-Day Refund Policy
          </button>

          <a
            href={REPOSITORY_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white transition-colors flex items-center gap-1"
          >
            <span>GitHub</span>
            <ExternalLink className="w-3 h-3 text-zinc-500" />
          </a>

          <a
            href={`mailto:${SUPPORT_EMAIL}?subject=FormatPulse%20Support%20Inquiry`}
            className="hover:text-white transition-colors flex items-center gap-1"
          >
            <Mail className="w-3.5 h-3.5" />
            <span>Support</span>
          </a>

          <button
            onClick={scrollToTop}
            className="p-2 bg-white/[0.04] border border-white/10 hover:bg-white/[0.08] text-zinc-400 hover:text-white rounded-full transition-colors"
            title="Scroll to Top"
          >
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto mt-12 pt-8 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-4 text-2xs text-zinc-600">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-500" />
          <span>ALL COMPUTATION IS LOCAL · NO TELEMETRY REGISTERED</span>
        </div>
        <div>
          &copy; {new Date().getFullYear()} FormatPulse. Spaceship Industrial Edition.
        </div>
      </div>
    </footer>
  );
};
