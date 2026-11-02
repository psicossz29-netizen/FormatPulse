import React from 'react';
import { Terminal, ArrowUp, Mail } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';

export const LandingFooter: React.FC = () => {
  const setViewMode = useAppStore((s) => s.setViewMode);
  const setShowLegalModal = useAppStore((s) => s.setShowLegalModal);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="w-full border-t border-zinc-800 bg-zinc-950 px-4 py-12 select-none font-mono text-xs">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2.5 h-2.5 rounded-full bg-accent" />
            <span className="font-bold text-zinc-100 tracking-tight">
              FORMATPULSE <span className="text-zinc-600 font-normal">// v1.2</span>
            </span>
          </div>
          <p className="text-2xs text-zinc-500 max-w-sm">
            Local-first schema inference, data conversion, and sensitive PII anonymization. Zero-server telemetry, 100% in-browser memory execution.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-6 text-2xs text-zinc-400">
          <button
            onClick={() => setViewMode('workspace')}
            className="hover:text-zinc-100 transition-colors flex items-center gap-1 text-accent"
          >
            <Terminal className="w-3 h-3" />
            <span>Launch Workspace</span>
          </button>
          <button
            onClick={() => setShowLegalModal(true)}
            className="hover:text-zinc-100 transition-colors"
          >
            Terms & EULA
          </button>
          <button
            onClick={() => setShowLegalModal(true)}
            className="hover:text-zinc-100 transition-colors"
          >
            Zero-Data Privacy
          </button>
          <button
            onClick={() => setShowLegalModal(true)}
            className="hover:text-zinc-100 transition-colors"
          >
            14-Day Refund Policy
          </button>
          <a
            href="mailto:formatpulse.app@gmail.com?subject=FormatPulse%20Support%20Inquiry"
            className="hover:text-zinc-100 transition-colors flex items-center gap-1 text-zinc-400"
          >
            <Mail className="w-3 h-3" />
            <span>Support</span>
          </a>
          <button
            onClick={scrollToTop}
            className="p-1.5 bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-100 rounded-sm transition-colors"
            title="Scroll to Top"
          >
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto mt-8 pt-6 border-t border-zinc-900 flex flex-col sm:flex-row items-center justify-between gap-3 text-2xs text-zinc-600">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          <span>ALL COMPUTATION IS LOCAL · NO TELEMETRY REGISTERED</span>
        </div>
        <div>
          © {new Date().getFullYear()} FormatPulse. Swiss Tactile IDE Design System.
        </div>
      </div>
    </footer>
  );
};
