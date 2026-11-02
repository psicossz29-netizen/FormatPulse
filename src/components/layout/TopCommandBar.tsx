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
    <header className="h-10 flex-none flex items-center border-b border-zinc-800 bg-surface-base select-none">
      {/* ── Logo ────────────────────────────────────────────────────────── */}
      <div className="flex items-center gap-2 px-3 border-r border-zinc-800 h-full">
        <FormatPulseLogo size={18} animate={false} />
        <span className="text-xs font-semibold tracking-tight text-zinc-300 font-mono">
          FORMATPULSE
        </span>
        <span className="text-2xs text-zinc-500 font-mono">// v{APP_VERSION}</span>
      </div>

      {/* ── Input Format Selector ───────────────────────────────────────── */}
      <div className="flex items-center h-full border-r border-zinc-800">
        <span className="text-2xs text-zinc-500 px-2 uppercase tracking-widest font-medium">
          In
        </span>
        {INPUT_FORMATS.map((fmt) => (
          <button
            key={fmt}
            onClick={() => setInputFormat(fmt)}
            className={cn(
              'h-full px-2.5 text-xs font-medium transition-colors',
              'hover:bg-zinc-800/80 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent focus-visible:ring-inset',
              inputFormat === fmt
                ? 'text-zinc-50 bg-zinc-800/60'
                : 'text-zinc-500',
            )}
          >
            {FORMAT_LABELS[fmt]}
          </button>
        ))}
      </div>

      {/* ── Arrow ───────────────────────────────────────────────────────── */}
      <div className="px-2 text-zinc-600 text-xs font-mono select-none">→</div>

      {/* ── Output Format Selector ──────────────────────────────────────── */}
      <div className="flex items-center h-full border-r border-zinc-800 overflow-x-auto max-w-[55vw] scrollbar-none">
        <span className="text-2xs text-zinc-500 px-2 uppercase tracking-widest font-medium flex-none">
          Out
        </span>
        {OUTPUT_FORMATS.map((fmt) => {
          const isPro = isProFormat(fmt);
          return (
            <button
              key={fmt}
              onClick={() => setOutputFormat(fmt)}
              className={cn(
                'h-full px-2 text-xs font-medium transition-colors flex items-center gap-1 flex-none whitespace-nowrap',
                'hover:bg-zinc-800/80 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent focus-visible:ring-inset',
                outputFormat === fmt
                  ? 'text-zinc-50 bg-zinc-800/60'
                  : 'text-zinc-500',
              )}
            >
              {FORMAT_LABELS[fmt]}
              {isPro && (
                <span className="text-2xs font-mono px-1 py-px bg-accent-muted text-accent rounded-sm leading-none">
                  PRO
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* ── Active Preset Indicator ───────────────────────────────────── */}
      {activePresetId && (
        <div className="hidden lg:flex items-center px-2.5 h-full border-r border-zinc-800 text-2xs font-mono text-zinc-400">
          <span className="text-zinc-600 mr-1.5">Preset:</span>
          <span className="text-accent">{activePresetId}</span>
        </div>
      )}

      {/* ── Spacer ──────────────────────────────────────────────────────── */}
      <div className="flex-1" />

      {/* ── Desktop vs Web Navigation / Updates ─────────────────────────── */}
      {!isDesktop ? (
        <button
          onClick={() => setViewMode('landing')}
          className="h-full px-2.5 flex items-center gap-1.5 text-xs text-zinc-400 font-medium border-l border-zinc-800 hover:bg-zinc-800/80 hover:text-zinc-200 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent focus-visible:ring-inset"
          title="View Landing Page & Documentation"
        >
          <Globe className="w-3.5 h-3.5 text-zinc-400" strokeWidth={2} />
          <span className="hidden xl:inline">Overview</span>
        </button>
      ) : (
        <button
          onClick={() => setShowUpdateModal(true)}
          className="h-full px-2.5 flex items-center gap-1.5 text-xs text-zinc-400 font-medium border-l border-zinc-800 hover:bg-zinc-800/80 hover:text-blue-400 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent focus-visible:ring-inset"
          title="Check for Application Updates"
        >
          <RefreshCw className="w-3.5 h-3.5 text-blue-400" strokeWidth={2} />
          <span className="hidden xl:inline">Updates</span>
        </button>
      )}

      {/* ── Settings / Preferences Modal (Antigravity Style) ─────────────── */}
      <button
        onClick={() => setShowSettingsModal(true)}
        className="h-full px-2.5 flex items-center gap-1.5 text-xs text-zinc-400 font-medium border-l border-zinc-800 hover:bg-zinc-800/80 hover:text-zinc-200 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent focus-visible:ring-inset"
        title="Settings & Preferences (⌘, / Ctrl+,)"
      >
        <Settings className="w-3.5 h-3.5 text-zinc-400" strokeWidth={2} />
        <span className="hidden xl:inline">Settings</span>
        <kbd className="hidden 2xl:inline px-1 py-0.5 text-3xs font-mono text-zinc-500 bg-zinc-800/80 border border-zinc-700/60 rounded-xs">
          ⌘,
        </kbd>
      </button>

      {/* ── Data Health & Security Inspector ────────────────────────────── */}
      <button
        onClick={() => setShowHealthInspector(true)}
        className="h-full px-2.5 flex items-center gap-1.5 text-xs text-zinc-400 font-medium border-l border-zinc-800 hover:bg-zinc-800/80 hover:text-emerald-400 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent focus-visible:ring-inset"
        title="Data Health & Security Inspector"
      >
        <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" strokeWidth={2} />
        <span className="hidden md:inline">Security Audit</span>
      </button>

      {/* ── Structural Diff Viewer ──────────────────────────────────────── */}
      <button
        onClick={() => setShowDiffModal(true)}
        className="h-full px-2.5 flex items-center gap-1.5 text-xs text-zinc-400 font-medium border-l border-zinc-800 hover:bg-zinc-800/80 hover:text-zinc-200 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent focus-visible:ring-inset"
        title="Structural Schema Diff Viewer"
      >
        <GitCompare className="w-3.5 h-3.5 text-accent" strokeWidth={2} />
        <span className="hidden md:inline">Diff</span>
      </button>

      {/* ── Batch Multi-File Mode ───────────────────────────────────────── */}
      <button
        onClick={() => setShowBatchModal(true)}
        className="h-full px-2.5 flex items-center gap-1.5 text-xs text-zinc-400 font-medium border-l border-zinc-800 hover:bg-zinc-800/80 hover:text-zinc-200 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent focus-visible:ring-inset"
        title="Batch Convert Multiple Files (ZIP Export)"
      >
        <Layers className="w-3.5 h-3.5 text-accent" strokeWidth={2} />
        <span className="hidden md:inline">Batch</span>
      </button>

      {/* ── Command Palette Launcher ────────────────────────────────────── */}
      <button
        onClick={() => setShowCommandPalette(true)}
        className="h-full px-3 flex items-center gap-1.5 text-xs text-zinc-400 font-medium border-l border-zinc-800 hover:bg-zinc-800/80 hover:text-zinc-200 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent focus-visible:ring-inset"
        title="Open Command Palette (⌘K / Ctrl+K)"
      >
        <Search className="w-3.5 h-3.5" strokeWidth={2} />
        <span className="hidden sm:inline">Commands</span>
        <kbd className="px-1.5 py-0.5 text-2xs font-mono text-zinc-500 bg-zinc-800/80 border border-zinc-700/60 rounded-sm">
          ⌘K
        </kbd>
      </button>

      {/* ── File Load ───────────────────────────────────────────────────── */}
      <button
        onClick={handleFileLoad}
        className="h-full px-3 flex items-center gap-1.5 text-xs text-zinc-400 font-medium border-l border-zinc-800 hover:bg-zinc-800/80 hover:text-zinc-200 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent focus-visible:ring-inset"
      >
        <FileUp className="w-3.5 h-3.5" strokeWidth={2} />
        Load File
      </button>

      {/* ── Tier Badge / Activate ────────────────────────────────────────── */}
      {licenseTier !== 'free' ? (
        <button
          onClick={() => setShowLicenseModal(true)}
          className="h-full px-3 flex items-center border-l border-zinc-800 hover:bg-zinc-800/60 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent"
          title="Click to view license details"
        >
          <span className={cn(
            'text-2xs font-mono font-semibold tracking-wider',
            licenseTier === 'enterprise'
              ? 'text-cyan-400'
              : licenseTier === 'team'
                ? 'text-emerald-400'
                : 'text-accent',
          )}>
            {licenseTier === 'enterprise' ? 'ENT ACTIVE' : `${licenseTier.toUpperCase()} ACTIVE`}
          </span>
        </button>
      ) : (
        <button
          onClick={() => setShowLicenseModal(true)}
          className="h-full px-3 flex items-center gap-1.5 text-xs font-semibold border-l border-zinc-800 bg-accent/10 text-accent hover:bg-accent/20 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent focus-visible:ring-inset"
        >
          <Zap className="w-3.5 h-3.5" strokeWidth={2} />
          Activate PRO
        </button>
      )}
    </header>
  );
};
