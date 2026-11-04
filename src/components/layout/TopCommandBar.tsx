import React from 'react';
import {
  FileUp,
  Zap,
  Search,
  ShieldCheck,
  GitCompare,
  Globe,
  Layers,
  Settings,
  RefreshCw,
} from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { FormatPulseLogo } from '@/components/brand/FormatPulseLogo';
import { APP_VERSION, isDesktopEnvironment } from '@/constants/version';
import {
  INPUT_FORMATS,
  OUTPUT_FORMATS,
  FORMAT_LABELS,
  isProFormat,
} from '@/types';
import { cn } from '@/lib/utils';

export const TopCommandBar: React.FC = () => {
  const inputFormat = useAppStore((s) => s.inputFormat);
  const outputFormat = useAppStore((s) => s.outputFormat);
  const setInputFormat = useAppStore((s) => s.setInputFormat);
  const setOutputFormat = useAppStore((s) => s.setOutputFormat);
  const setInputValue = useAppStore((s) => s.setInputValue);
  const setShowLicenseModal = useAppStore((s) => s.setShowLicenseModal);
  const setShowCommandPalette = useAppStore((s) => s.setShowCommandPalette);
  const setShowHealthInspector = useAppStore((s) => s.setShowHealthInspector);
  const setShowDiffModal = useAppStore((s) => s.setShowDiffModal);
  const setShowBatchModal = useAppStore((s) => s.setShowBatchModal);
  const setShowUpdateModal = useAppStore((s) => s.setShowUpdateModal);
  const setShowSettingsModal = useAppStore((s) => s.setShowSettingsModal);
  const setViewMode = useAppStore((s) => s.setViewMode);
  const licenseTier = useAppStore((s) => s.licenseTier);
  const activePresetId = useAppStore((s) => s.activePresetId);
  const isDesktop = isDesktopEnvironment();

  const handleFileLoad = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json,.csv,.yaml,.yml,.txt';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (ev) => {
        const text = ev.target?.result;
        if (typeof text === 'string') {
          setInputValue(text);
        }
      };
      reader.readAsText(file);
    };
    input.click();
  };

  return (
    <header className="h-10 flex-none flex items-center border-b border-[#26262C] bg-[#09090B] select-none text-xs font-geist text-[#F4F4F5]">
      {/* ── Logo ────────────────────────────────────────────────────────── */}
      <div className="flex items-center gap-2.5 px-3.5 border-r border-[#26262C] h-full">
        <FormatPulseLogo size={20} animate={false} />
        <span className="text-xs font-bold tracking-tight text-[#F4F4F5] font-display">
          FORMATPULSE
        </span>
        <span className="text-[10px] text-[#9A9AA5] font-geist-mono">// v{APP_VERSION}</span>
      </div>

      {/* ── Input Format Selector ───────────────────────────────────────── */}
      <div className="flex items-center h-full border-r border-[#26262C] px-1 gap-1">
        <span className="text-[10px] font-geist-mono text-[#9A9AA5] px-2 uppercase tracking-widest font-semibold">
          In
        </span>
        {INPUT_FORMATS.map((fmt) => (
          <button
            key={fmt}
            onClick={() => setInputFormat(fmt)}
            className={cn(
              'h-7 px-2.5 rounded-lg text-xs font-geist font-medium transition-all',
              inputFormat === fmt
                ? 'bg-white/[0.08] text-[#F4F4F5] shadow-xs border border-[#26262C]'
                : 'text-[#9A9AA5] hover:text-[#F4F4F5] hover:bg-white/[0.04]',
            )}
          >
            {FORMAT_LABELS[fmt]}
          </button>
        ))}
      </div>

      {/* ── Arrow ───────────────────────────────────────────────────────── */}
      <div className="px-2 text-[#9A9AA5] text-xs font-geist-mono select-none">→</div>

      {/* ── Output Format Selector ──────────────────────────────────────── */}
      <div className="flex items-center h-full border-r border-[#26262C] px-1 gap-1 overflow-x-auto max-w-[55vw] scrollbar-none">
        <span className="text-[10px] font-geist-mono text-[#9A9AA5] px-2 uppercase tracking-widest font-semibold flex-none">
          Out
        </span>
        {OUTPUT_FORMATS.map((fmt) => {
          const isPro = isProFormat(fmt);
          return (
            <button
              key={fmt}
              onClick={() => setOutputFormat(fmt)}
              className={cn(
                'h-7 px-2.5 rounded-lg text-xs font-geist font-medium transition-all flex items-center gap-1.5 flex-none whitespace-nowrap',
                outputFormat === fmt
                  ? 'bg-white/[0.08] text-[#F4F4F5] shadow-xs border border-[#26262C]'
                  : 'text-[#9A9AA5] hover:text-[#F4F4F5] hover:bg-white/[0.04]',
              )}
            >
              <span>{FORMAT_LABELS[fmt]}</span>
              {isPro && (
                <span className="text-[9px] font-geist-mono px-1.5 py-px rounded-full bg-[#FF4F00]/15 border border-[#FF4F00]/30 text-[#FF4F00] font-bold leading-none">
                  PRO
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* ── Active Preset Indicator ───────────────────────────────────── */}
      {activePresetId && (
        <div className="hidden lg:flex items-center px-3 h-full border-r border-[#26262C] text-xs font-geist-mono text-[#9A9AA5]">
          <span className="text-[#9A9AA5]/60 mr-1.5">Preset:</span>
          <span className="text-[#FF4F00] font-medium">{activePresetId}</span>
        </div>
      )}

      {/* ── Spacer ──────────────────────────────────────────────────────── */}
      <div className="flex-1" />

      {/* ── Desktop vs Web Navigation / Updates ─────────────────────────── */}
      {!isDesktop ? (
        <button
          onClick={() => setViewMode('landing')}
          className="h-full px-3 flex items-center gap-1.5 text-xs text-[#9A9AA5] font-medium border-l border-[#26262C] hover:bg-white/[0.05] hover:text-[#F4F4F5] transition-colors focus:outline-none"
          title="View Landing Page & Documentation"
        >
          <Globe className="w-3.5 h-3.5 text-[#9A9AA5]" strokeWidth={2} />
          <span className="hidden xl:inline">Overview</span>
        </button>
      ) : (
        <button
          onClick={() => setShowUpdateModal(true)}
          className="h-full px-3 flex items-center gap-1.5 text-xs text-[#9A9AA5] font-medium border-l border-[#26262C] hover:bg-white/[0.05] hover:text-blue-400 transition-colors focus:outline-none"
          title="Check for Application Updates"
        >
          <RefreshCw className="w-3.5 h-3.5 text-blue-400" strokeWidth={2} />
          <span className="hidden xl:inline">Updates</span>
        </button>
      )}

      {/* ── Settings / Preferences Modal ─────────────────────────────────── */}
      <button
        onClick={() => setShowSettingsModal(true)}
        className="h-full px-3 flex items-center gap-1.5 text-xs text-[#9A9AA5] font-medium border-l border-[#26262C] hover:bg-white/[0.05] hover:text-[#F4F4F5] transition-colors focus:outline-none"
        title="Settings & Preferences (⌘, / Ctrl+,)"
      >
        <Settings className="w-3.5 h-3.5 text-[#9A9AA5]" strokeWidth={2} />
        <span className="hidden xl:inline">Settings</span>
        <kbd className="hidden 2xl:inline px-1.5 py-0.5 text-[10px] font-geist-mono text-[#9A9AA5] bg-white/[0.04] border border-[#26262C] rounded-md">
          ⌘,
        </kbd>
      </button>

      {/* ── Data Health & Security Inspector ────────────────────────────── */}
      <button
        onClick={() => setShowHealthInspector(true)}
        className="h-full px-3 flex items-center gap-1.5 text-xs text-[#9A9AA5] font-medium border-l border-[#26262C] hover:bg-white/[0.05] hover:text-emerald-400 transition-colors focus:outline-none"
        title="Data Health & Security Inspector"
      >
        <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" strokeWidth={2} />
        <span className="hidden md:inline">Security Audit</span>
      </button>

      {/* ── Structural Diff Viewer ──────────────────────────────────────── */}
      <button
        onClick={() => setShowDiffModal(true)}
        className="h-full px-3 flex items-center gap-1.5 text-xs text-[#9A9AA5] font-medium border-l border-[#26262C] hover:bg-white/[0.05] hover:text-[#F4F4F5] transition-colors focus:outline-none"
        title="Structural Schema Diff Viewer"
      >
        <GitCompare className="w-3.5 h-3.5 text-[#FF4F00]" strokeWidth={2} />
        <span className="hidden md:inline">Diff</span>
      </button>

      {/* ── Batch Multi-File Mode ───────────────────────────────────────── */}
      <button
        onClick={() => setShowBatchModal(true)}
        className="h-full px-3 flex items-center gap-1.5 text-xs text-[#9A9AA5] font-medium border-l border-[#26262C] hover:bg-white/[0.05] hover:text-[#F4F4F5] transition-colors focus:outline-none"
        title="Batch Convert Multiple Files (ZIP Export)"
      >
        <Layers className="w-3.5 h-3.5 text-[#FF4F00]" strokeWidth={2} />
        <span className="hidden md:inline">Batch</span>
      </button>

      {/* ── Command Palette Launcher ────────────────────────────────────── */}
      <button
        onClick={() => setShowCommandPalette(true)}
        className="h-full px-3 flex items-center gap-1.5 text-xs text-[#9A9AA5] font-medium border-l border-[#26262C] hover:bg-white/[0.05] hover:text-[#F4F4F5] transition-colors focus:outline-none"
        title="Open Command Palette (⌘K / Ctrl+K)"
      >
        <Search className="w-3.5 h-3.5" strokeWidth={2} />
        <span className="hidden sm:inline">Commands</span>
        <kbd className="px-1.5 py-0.5 text-[10px] font-geist-mono text-[#9A9AA5] bg-white/[0.04] border border-[#26262C] rounded-md">
          ⌘K
        </kbd>
      </button>

      {/* ── File Load ───────────────────────────────────────────────────── */}
      <button
        onClick={handleFileLoad}
        className="h-full px-3 flex items-center gap-1.5 text-xs text-[#9A9AA5] font-medium border-l border-[#26262C] hover:bg-white/[0.05] hover:text-[#F4F4F5] transition-colors focus:outline-none"
      >
        <FileUp className="w-3.5 h-3.5" strokeWidth={2} />
        <span>Load File</span>
      </button>

      {/* ── Tier Badge / Activate ────────────────────────────────────────── */}
      {licenseTier !== 'free' ? (
        <button
          onClick={() => setShowLicenseModal(true)}
          className="h-full px-3.5 flex items-center border-l border-[#26262C] hover:bg-white/[0.05] transition-colors focus:outline-none"
          title="Click to view license details"
        >
          <span className={cn(
            'text-[10px] font-geist-mono font-bold tracking-wider px-2 py-0.5 rounded-full border',
            licenseTier === 'enterprise'
              ? 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30'
              : licenseTier === 'team'
                ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30'
                : 'text-[#FF4F00] bg-[#FF4F00]/10 border-[#FF4F00]/30',
          )}>
            {licenseTier === 'enterprise' ? 'ENT ACTIVE' : `${licenseTier.toUpperCase()} ACTIVE`}
          </span>
        </button>
      ) : (
        <div className="h-full px-2.5 flex items-center border-l border-[#26262C]">
          <button
            onClick={() => setShowLicenseModal(true)}
            className="h-7 px-3 flex items-center gap-1.5 text-xs font-semibold rounded-lg bg-[#FF4F00] hover:bg-[#FF6A20] text-white shadow-[0_0_15px_rgba(255,79,0,0.35)] transition-all hover:-translate-y-0.5 active:translate-y-0 focus:outline-none"
          >
            <Zap className="w-3.5 h-3.5" strokeWidth={2} />
            <span>Activate PRO</span>
          </button>
        </div>
      )}
    </header>
  );
};
