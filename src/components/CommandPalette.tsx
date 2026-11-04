import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  Search,
  Zap,
  Shield,
  ShieldCheck,
  GitCompare,
  FileCode,
  Trash2,
  Copy,
  Download,
  Archive,
  Terminal,
  Layers,
  ArrowRight,
  RefreshCw,
} from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { PRESETS } from '@/core/presets';
import { INPUT_FORMATS, OUTPUT_FORMATS, FORMAT_LABELS, isProFormat } from '@/types';
import type { InputFormat, OutputFormat } from '@/types';
import { cn } from '@/lib/utils';
import { downloadGzippedOutput } from '@/core/exportUtils';

interface CommandItem {
  id: string;
  category: 'Presets' | 'Input Format' | 'Output Format' | 'Actions' | 'License & Legal';
  title: string;
  subtitle?: string;
  icon: React.ReactNode;
  badge?: string;
  run: () => void;
}

export const CommandPalette: React.FC = () => {
  const showCommandPalette = useAppStore((s) => s.showCommandPalette);
  const setShowCommandPalette = useAppStore((s) => s.setShowCommandPalette);
  const setInputFormat = useAppStore((s) => s.setInputFormat);
  const setOutputFormat = useAppStore((s) => s.setOutputFormat);
  const loadPreset = useAppStore((s) => s.loadPreset);
  const clearWorkspace = useAppStore((s) => s.clearWorkspace);
  const setShowLicenseModal = useAppStore((s) => s.setShowLicenseModal);
  const setShowLegalModal = useAppStore((s) => s.setShowLegalModal);
  const setShowHealthInspector = useAppStore((s) => s.setShowHealthInspector);
  const setShowDiffModal = useAppStore((s) => s.setShowDiffModal);
  const setShowUpdateModal = useAppStore((s) => s.setShowUpdateModal);
  const setShowBatchModal = useAppStore((s) => s.setShowBatchModal);
  const outputValue = useAppStore((s) => s.outputValue);
  const outputFormat = useAppStore((s) => s.outputFormat);

  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // ── Global Shortcut: ⌘K / Ctrl+K ──────────────────────────────────────────
  useEffect(() => {
    const handleGlobalKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setShowCommandPalette(!showCommandPalette);
      }
    };
    window.addEventListener('keydown', handleGlobalKey);
    return () => window.removeEventListener('keydown', handleGlobalKey);
  }, [showCommandPalette, setShowCommandPalette]);

  // Focus input when opened
  useEffect(() => {
    if (showCommandPalette) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [showCommandPalette]);

  // Build commands
  const commands: CommandItem[] = [
    // ── Presets ─────────────────────────────────────────────────────────────
    ...Object.values(PRESETS).map((p) => ({
      id: `preset-${p.id}`,
      category: 'Presets' as const,
      title: `Load Preset: ${p.name}`,
      subtitle: p.description,
      icon: <FileCode className="w-3.5 h-3.5 text-accent" />,
      run: () => loadPreset(p.id),
    })),

    // ── Input Formats ───────────────────────────────────────────────────────
    ...INPUT_FORMATS.map((fmt) => ({
      id: `in-${fmt}`,
      category: 'Input Format' as const,
      title: `Set Input Format: ${FORMAT_LABELS[fmt]}`,
      subtitle: `Parse incoming data as ${FORMAT_LABELS[fmt]}`,
      icon: <Layers className="w-3.5 h-3.5 text-zinc-400" />,
      run: () => setInputFormat(fmt as InputFormat),
    })),

    // ── Output Formats ──────────────────────────────────────────────────────
    ...OUTPUT_FORMATS.map((fmt) => ({
      id: `out-${fmt}`,
      category: 'Output Format' as const,
      title: `Set Output Target: ${FORMAT_LABELS[fmt]}`,
      subtitle: isProFormat(fmt) ? 'PRO generator' : 'Free standard format',
      badge: isProFormat(fmt) ? 'PRO' : undefined,
      icon: <ArrowRight className="w-3.5 h-3.5 text-zinc-400" />,
      run: () => setOutputFormat(fmt as OutputFormat),
    })),

    // ── Actions ─────────────────────────────────────────────────────────────
    {
      id: 'action-copy',
      category: 'Actions' as const,
      title: 'Copy Output to Clipboard',
      subtitle: 'Copy currently transformed result [⌘C]',
      icon: <Copy className="w-3.5 h-3.5 text-zinc-400" />,
      run: () => {
        if (outputValue) {
          void navigator.clipboard.writeText(outputValue);
        }
      },
    },
    {
      id: 'action-download',
      category: 'Actions' as const,
      title: 'Download Output File',
      subtitle: `Save as formatpulse-output.${outputFormat} [⌘S]`,
      icon: <Download className="w-3.5 h-3.5 text-zinc-400" />,
      run: () => {
        if (outputValue) {
          const blob = new Blob([outputValue], { type: 'text/plain;charset=utf-8' });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `formatpulse-output.${outputFormat}`;
          a.click();
          URL.revokeObjectURL(url);
        }
      },
    },
    {
      id: 'action-download-gz',
      category: 'Actions' as const,
      title: 'Download Compressed .GZ Archive',
      subtitle: `Save as formatpulse-output.${outputFormat}.gz`,
      icon: <Archive className="w-3.5 h-3.5 text-accent" />,
      run: () => {
        if (outputValue) {
          void downloadGzippedOutput(outputValue, `formatpulse-output.${outputFormat}`);
        }
      },
    },
    {
      id: 'action-clear',
      category: 'Actions' as const,
      title: 'Clear Canvas & Memory',
      subtitle: 'Reset both input and output panels [⌫]',
      icon: <Trash2 className="w-3.5 h-3.5 text-red-400" />,
      run: () => clearWorkspace(),
    },
    {
      id: 'action-audit',
      category: 'Actions' as const,
      title: 'Run Zero-Network Telemetry Audit',
      subtitle: 'Inspect local execution and 0 outbound HTTP telemetry',
      icon: <Terminal className="w-3.5 h-3.5 text-emerald-400" />,
      run: () => setShowLegalModal(true),
    },
    {
      id: 'action-health-inspector',
      category: 'Actions' as const,
      title: 'Open Data Health & Security Inspector',
      subtitle: 'Audit secret leakage (AWS, GCP, Private Keys), PII & hygiene',
      icon: <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />,
      run: () => setShowHealthInspector(true),
    },
    {
      id: 'action-diff-viewer',
      category: 'Actions' as const,
      title: 'Open Structural Schema Diff Viewer',
      subtitle: 'Deeply compare input vs output or custom schemas for breaking changes',
      icon: <GitCompare className="w-3.5 h-3.5 text-accent" />,
      run: () => setShowDiffModal(true),
    },
    {
      id: 'action-check-updates',
      category: 'Actions' as const,
      title: 'Check for Software Updates...',
      subtitle: 'Verify if a newer FormatPulse release (.exe / web) is available',
      icon: <RefreshCw className="w-3.5 h-3.5 text-accent" />,
      run: () => setShowUpdateModal(true),
    },
    {
      id: 'action-batch-mode',
      category: 'Actions' as const,
      title: 'Batch Convert Multiple Files (ZIP Export)',
      subtitle: 'Process dozens of JSON, CSV or YAML files simultaneously and export .zip',
      icon: <Layers className="w-3.5 h-3.5 text-accent" />,
      run: () => setShowBatchModal(true),
    },

    // ── License & Legal ─────────────────────────────────────────────────────
    {
      id: 'license-activate',
      category: 'License & Legal' as const,
      title: 'Activate PRO Lifetime License',
      subtitle: 'Unlock unlimited file size, Zod, TypeScript, SQL and PII Sanitizer',
      badge: '$14 USD',
      icon: <Zap className="w-3.5 h-3.5 text-accent" />,
      run: () => setShowLicenseModal(true),
    },
    {
      id: 'legal-terms',
      category: 'License & Legal' as const,
      title: 'View Terms of Service & EULA',
      subtitle: '100% client-side execution terms and MoR authority',
      icon: <Shield className="w-3.5 h-3.5 text-zinc-400" />,
      run: () => setShowLegalModal(true),
    },
    {
      id: 'legal-privacy',
      category: 'License & Legal' as const,
      title: 'View Zero-Data Privacy Policy',
      subtitle: 'GDPR Art. 25 Privacy by Design and CCPA Compliance Statement',
      icon: <Shield className="w-3.5 h-3.5 text-emerald-400" />,
      run: () => setShowLegalModal(true),
    },
  ];

  // Filter commands by query
  const filtered = commands.filter((c) => {
    const q = query.toLowerCase().trim();
    if (!q) return true;
    return (
      c.title.toLowerCase().includes(q) ||
      c.category.toLowerCase().includes(q) ||
      (c.subtitle && c.subtitle.toLowerCase().includes(q))
    );
  });

  const handleExecute = useCallback(
    (item: CommandItem) => {
      item.run();
      setShowCommandPalette(false);
    },
    [setShowCommandPalette],
  );

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % Math.max(1, filtered.length));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filtered.length) % Math.max(1, filtered.length));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const selected = filtered[selectedIndex];
      if (selected) {
        handleExecute(selected);
      }
    } else if (e.key === 'Escape') {
      e.preventDefault();
      setShowCommandPalette(false);
    }
  };

  // Scroll active item into view
  useEffect(() => {
    const el = listRef.current?.querySelector(`[data-index="${selectedIndex}"]`);
    if (el) {
      el.scrollIntoView({ block: 'nearest' });
    }
  }, [selectedIndex]);

  if (!showCommandPalette) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4"
      role="dialog"
      aria-modal="true"
      aria-label="Command Palette"
      onKeyDown={handleKeyDown}
    >
      {/* ── Backdrop ────────────────────────────────────────────────── */}
      <div
        className="absolute inset-0 bg-[#09090B]/80 backdrop-blur-md transition-opacity"
        onClick={() => setShowCommandPalette(false)}
      />

      {/* ── Palette Dialog ──────────────────────────────────────────── */}
      <div className="relative w-full max-w-xl rounded-2xl bg-[#111114] border border-[#26262C] shadow-[0_32px_80px_rgba(0,0,0,0.85)] overflow-hidden flex flex-col font-sans backdrop-blur-xl animate-in fade-in zoom-in-95 duration-150">
        {/* Search Input Bar */}
        <div className="h-12 px-4 flex items-center gap-3 border-b border-[#26262C] bg-[#09090B]/60 flex-none">
          <Search className="w-4 h-4 text-[#FF4F00] flex-none" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            placeholder="Type a command or search presets (e.g. 'TypeScript', 'CSV', 'PII')..."
            className="flex-1 bg-transparent text-xs text-[#F4F4F5] placeholder:text-[#52525B] focus:outline-none font-sans"
            spellCheck={false}
          />
          <kbd className="px-2 py-0.5 text-3xs font-mono text-[#9A9AA5] bg-[#18181B] border border-[#26262C] rounded-md">
            ESC
          </kbd>
        </div>

        {/* Command List */}
        <div ref={listRef} className="max-h-80 overflow-y-auto p-2 space-y-0.5">
          {filtered.length === 0 ? (
            <div className="py-8 text-center text-xs text-[#71717A] font-mono">
              No matching commands or presets found.
            </div>
          ) : (
            filtered.map((item, idx) => {
              const isSelected = idx === selectedIndex;
              return (
                <div
                  key={item.id}
                  data-index={idx}
                  onClick={() => handleExecute(item)}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={cn(
                    'px-3 py-2 flex items-center justify-between cursor-pointer rounded-xl transition-all text-xs select-none border',
                    isSelected
                      ? 'bg-white/[0.08] text-[#F4F4F5] border-[#26262C] shadow-sm'
                      : 'text-[#9A9AA5] hover:bg-white/[0.03] hover:text-[#F4F4F5] border-transparent',
                  )}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="flex-none">{item.icon}</span>
                    <div className="min-w-0">
                      <div className="font-semibold truncate flex items-center gap-1.5 text-[#F4F4F5]">
                        <span>{item.title}</span>
                        {item.badge && (
                          <span className="text-3xs font-mono px-1.5 py-0.5 bg-[#FF4F00]/15 text-[#FF4F00] border border-[#FF4F00]/30 rounded-md font-semibold">
                            {item.badge}
                          </span>
                        )}
                      </div>
                      {item.subtitle && (
                        <div className="text-2xs text-[#71717A] truncate font-sans">{item.subtitle}</div>
                      )}
                    </div>
                  </div>
                  <span className="text-3xs font-mono text-[#71717A] uppercase tracking-wider flex-none pl-2">
                    {item.category}
                  </span>
                </div>
              );
            })
          )}
        </div>

        {/* Footer Hints */}
        <div className="h-8 px-4 border-t border-[#26262C] bg-[#09090B]/60 flex items-center justify-between text-3xs font-mono text-[#71717A] flex-none">
          <div className="flex items-center gap-3">
            <span>
              <kbd className="text-[#F4F4F5] font-semibold">↑↓</kbd> navigate
            </span>
            <span>
              <kbd className="text-[#F4F4F5] font-semibold">↵</kbd> select
            </span>
            <span>
              <kbd className="text-[#F4F4F5] font-semibold">esc</kbd> close
            </span>
          </div>
          <span className="text-[#52525B]">FormatPulse Command Palette</span>
        </div>
      </div>
    </div>
  );
};
