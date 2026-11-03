import React, { useState, useEffect } from 'react';
import {
  X,
  Sliders,
  Palette,
  Shield,
  Cpu,
  Key,
  RefreshCw,
  Keyboard,
  RotateCcw,
  Sparkles,
  ExternalLink,
  Lock,
} from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import {
  useSettingsStore,
  type ThemeAccent,
  type EditorFontSize,
  type PiiMaskingMode,
} from '@/store/useSettingsStore';
import { APP_VERSION, APP_BUILD_DATE } from '@/constants/version';
import { checkForUpdates, type ReleaseManifest } from '@/services/updaterService';
import { openExternalUrl } from '@/core/desktopBridge';
import { cn } from '@/lib/utils';

type SettingsTab =
  | 'general'
  | 'appearance'
  | 'security'
  | 'performance'
  | 'license'
  | 'updates'
  | 'shortcuts';

export const SettingsModal: React.FC = () => {
  const showSettingsModal = useAppStore((s) => s.showSettingsModal);
  const setShowSettingsModal = useAppStore((s) => s.setShowSettingsModal);
  const licenseTier = useAppStore((s) => s.licenseTier);
  const licenseKey = useAppStore((s) => s.licenseKey);
  const setShowLicenseModal = useAppStore((s) => s.setShowLicenseModal);

  const [activeTab, setActiveTab] = useState<SettingsTab>('general');

  // Settings from store
  const settings = useSettingsStore();
  const updateSettings = useSettingsStore((s) => s.updateSettings);
  const resetToDefaults = useSettingsStore((s) => s.resetToDefaults);

  // Update check state
  const [isCheckingUpdate, setIsCheckingUpdate] = useState(false);
  const [updateStatus, setUpdateStatus] = useState<string | null>(null);
  const [manifestInfo, setManifestInfo] = useState<ReleaseManifest | null>(null);

  // Close on Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!showSettingsModal) return;
      if (e.key === 'Escape') {
        setShowSettingsModal(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showSettingsModal, setShowSettingsModal]);

  const handleCheckUpdate = async () => {
    setIsCheckingUpdate(true);
    setUpdateStatus(null);
    try {
      const result = await checkForUpdates();
      if (result.hasUpdate) {
        setUpdateStatus(`New release available: v${result.latestVersion}`);
        setManifestInfo(result.manifest);
      } else {
        setUpdateStatus(`You are on the latest release (v${APP_VERSION}).`);
      }
    } catch {
      setUpdateStatus('Unable to reach update server (Check internet connection).');
    } finally {
      setIsCheckingUpdate(false);
    }
  };

  if (!showSettingsModal) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-label="FormatPulse Preferences"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-zinc-950/85 backdrop-blur-sm transition-opacity"
        onClick={() => setShowSettingsModal(false)}
      />

      {/* Main Container - Spaceship Architecture */}
      <div className="relative w-full max-w-4xl bg-[#111114] border border-[#26262C] shadow-[0_32px_80px_rgba(0,0,0,0.85)] rounded-[28px] overflow-hidden flex flex-col md:flex-row h-[600px] my-auto font-geist text-[#F4F4F5] animate-pop">
        {/* ── Left Sidebar Navigation ───────────────────────────────── */}
        <aside className="w-full md:w-56 border-b md:border-b-0 md:border-r border-[#26262C] bg-[#09090B]/60 p-4 flex flex-col justify-between flex-none select-none">
          <div>
            <div className="px-3 py-2 text-[10px] font-geist-mono font-semibold tracking-wider text-[#9A9AA5] uppercase">
              Preferences
            </div>
            <nav className="space-y-1.5 mt-2 font-geist text-xs">
              <button
                onClick={() => setActiveTab('general')}
                className={cn(
                  'w-full flex items-center gap-2.5 px-3 py-2 rounded-xl transition-all text-left text-xs',
                  activeTab === 'general'
                    ? 'bg-white/[0.08] text-[#F4F4F5] border border-[#26262C] font-semibold shadow-sm'
                    : 'text-[#9A9AA5] hover:text-[#F4F4F5] hover:bg-white/[0.03]',
                )}
              >
                <Sliders className="w-4 h-4 text-[#FF4F00] flex-none" />
                <span>General</span>
              </button>

              <button
                onClick={() => setActiveTab('appearance')}
                className={cn(
                  'w-full flex items-center gap-2.5 px-3 py-2 rounded-xl transition-all text-left text-xs',
                  activeTab === 'appearance'
                    ? 'bg-white/[0.08] text-[#F4F4F5] border border-[#26262C] font-semibold shadow-sm'
                    : 'text-[#9A9AA5] hover:text-[#F4F4F5] hover:bg-white/[0.03]',
                )}
              >
                <Palette className="w-4 h-4 text-emerald-400 flex-none" />
                <span>Appearance</span>
              </button>

              <button
                onClick={() => setActiveTab('security')}
                className={cn(
                  'w-full flex items-center gap-2.5 px-3 py-2 rounded-xl transition-all text-left text-xs',
                  activeTab === 'security'
                    ? 'bg-white/[0.08] text-[#F4F4F5] border border-[#26262C] font-semibold shadow-sm'
                    : 'text-[#9A9AA5] hover:text-[#F4F4F5] hover:bg-white/[0.03]',
                )}
              >
                <Shield className="w-4 h-4 text-cyan-400 flex-none" />
                <span>Security & PII</span>
              </button>

              <button
                onClick={() => setActiveTab('performance')}
                className={cn(
                  'w-full flex items-center gap-2.5 px-3 py-2 rounded-xl transition-all text-left text-xs',
                  activeTab === 'performance'
                    ? 'bg-white/[0.08] text-[#F4F4F5] border border-[#26262C] font-semibold shadow-sm'
                    : 'text-[#9A9AA5] hover:text-[#F4F4F5] hover:bg-white/[0.03]',
                )}
              >
                <Cpu className="w-4 h-4 text-amber-400 flex-none" />
                <span>Engine & Workers</span>
              </button>

              <button
                onClick={() => setActiveTab('license')}
                className={cn(
                  'w-full flex items-center gap-2.5 px-3 py-2 rounded-xl transition-all text-left text-xs',
                  activeTab === 'license'
                    ? 'bg-white/[0.08] text-[#F4F4F5] border border-[#26262C] font-semibold shadow-sm'
                    : 'text-[#9A9AA5] hover:text-[#F4F4F5] hover:bg-white/[0.03]',
                )}
              >
                <Key className="w-4 h-4 text-purple-400 flex-none" />
                <span>License & Seats</span>
              </button>

              <button
                onClick={() => setActiveTab('updates')}
                className={cn(
                  'w-full flex items-center gap-2.5 px-3 py-2 rounded-xl transition-all text-left text-xs',
                  activeTab === 'updates'
                    ? 'bg-white/[0.08] text-[#F4F4F5] border border-[#26262C] font-semibold shadow-sm'
                    : 'text-[#9A9AA5] hover:text-[#F4F4F5] hover:bg-white/[0.03]',
                )}
              >
                <RefreshCw className="w-4 h-4 text-blue-400 flex-none" />
                <span>Updates</span>
              </button>

              <button
                onClick={() => setActiveTab('shortcuts')}
                className={cn(
                  'w-full flex items-center gap-2.5 px-3 py-2 rounded-xl transition-all text-left text-xs',
                  activeTab === 'shortcuts'
                    ? 'bg-white/[0.08] text-[#F4F4F5] border border-[#26262C] font-semibold shadow-sm'
                    : 'text-[#9A9AA5] hover:text-[#F4F4F5] hover:bg-white/[0.03]',
                )}
              >
                <Keyboard className="w-4 h-4 text-zinc-400 flex-none" />
                <span>Shortcuts</span>
              </button>
            </nav>
          </div>

          {/* Footer Info in Sidebar */}
          <div className="pt-3 border-t border-[#26262C] text-xs font-geist-mono text-[#9A9AA5] px-3 space-y-1">
            <div className="flex items-center justify-between">
              <span>FormatPulse</span>
              <span className="text-[#F4F4F5] font-semibold">v{APP_VERSION}</span>
            </div>
            <div className="text-[11px]">Build: {APP_BUILD_DATE}</div>
          </div>
        </aside>

        {/* ── Right Content Panel ───────────────────────────────────── */}
        <main className="flex-1 flex flex-col justify-between overflow-hidden bg-[#09090B]/30">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-[#26262C] bg-[#09090B]/60 select-none">
            <div>
              <h3 className="text-sm font-bold text-[#F4F4F5] tracking-tight font-display capitalize">
                {activeTab === 'general' && 'General Configuration'}
                {activeTab === 'appearance' && 'Editor & Visual Appearance'}
                {activeTab === 'security' && 'Security, Privacy & Compliance'}
                {activeTab === 'performance' && 'Engine, Web Workers & Performance'}
                {activeTab === 'license' && 'License & Commercial Seats'}
                {activeTab === 'updates' && 'Application Releases & Auto-Update'}
                {activeTab === 'shortcuts' && 'Keyboard Shortcuts Reference'}
              </h3>
              <p className="text-xs text-[#9A9AA5] font-geist mt-0.5">
                {activeTab === 'general' && 'Configure automatic detection, input parsing and indentation behavior.'}
                {activeTab === 'appearance' && 'Customize theme accent palette, font family and code canvas options.'}
                {activeTab === 'security' && 'Manage PII redaction rules, air-gapped isolation, and formula injection guard.'}
                {activeTab === 'performance' && 'Tune background thread offloading and high-throughput memory thresholds.'}
                {activeTab === 'license' && 'View active tier entitlements or enter an air-gapped license key.'}
                {activeTab === 'updates' && 'Check for official releases, release manifests, and changelogs.'}
                {activeTab === 'shortcuts' && 'Fast navigation hotkeys for power developers.'}
              </p>
            </div>
            <button
              onClick={() => setShowSettingsModal(false)}
              className="w-8 h-8 flex items-center justify-center text-[#9A9AA5] hover:text-[#F4F4F5] hover:bg-white/[0.06] transition-colors rounded-xl focus:outline-none"
              aria-label="Close settings"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Scrollable Tab Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6 font-mono text-xs">
            {/* ── TAB: GENERAL ── */}
            {activeTab === 'general' && (
              <div className="space-y-5">
                {/* Auto Format on Paste */}
                <div className="flex items-center justify-between p-3.5 bg-zinc-950/60 border border-zinc-800/80 rounded-xs">
                  <div>
                    <div className="text-xs font-semibold text-zinc-200">Auto-Format on Paste</div>
                    <div className="text-2xs text-zinc-500 mt-0.5">
                      Automatically cleans, parses and beautifies data when pasted into canvas.
                    </div>
                  </div>
                  <button
                    onClick={() => updateSettings({ autoFormatOnPaste: !settings.autoFormatOnPaste })}
                    className={cn(
                      'w-10 h-5 flex items-center rounded-full p-0.5 transition-colors',
                      settings.autoFormatOnPaste ? 'bg-accent' : 'bg-zinc-800',
                    )}
                  >
                    <div
                      className={cn(
                        'bg-white w-4 h-4 rounded-full shadow-md transform transition-transform',
                        settings.autoFormatOnPaste ? 'translate-x-5' : 'translate-x-0',
                      )}
                    />
                  </button>
                </div>

                {/* Auto Detect Format */}
                <div className="flex items-center justify-between p-3.5 bg-zinc-950/60 border border-zinc-800/80 rounded-xs">
                  <div>
                    <div className="text-xs font-semibold text-zinc-200">Auto-Detect Input Syntax</div>
                    <div className="text-2xs text-zinc-500 mt-0.5">
                      Infers JSON, CSV, YAML or XML formats dynamically based on payload structure.
                    </div>
                  </div>
                  <button
                    onClick={() => updateSettings({ autoDetectFormat: !settings.autoDetectFormat })}
                    className={cn(
                      'w-10 h-5 flex items-center rounded-full p-0.5 transition-colors',
                      settings.autoDetectFormat ? 'bg-accent' : 'bg-zinc-800',
                    )}
                  >
                    <div
                      className={cn(
                        'bg-white w-4 h-4 rounded-full shadow-md transform transition-transform',
                        settings.autoDetectFormat ? 'translate-x-5' : 'translate-x-0',
                      )}
                    />
                  </button>
                </div>

                {/* Indentation */}
                <div className="p-3.5 bg-zinc-950/60 border border-zinc-800/80 rounded-xs space-y-2">
                  <div className="text-xs font-semibold text-zinc-200">Indentation Spacing</div>
                  <div className="text-2xs text-zinc-500">
                    Controls code indentation width when formatting JSON, YAML, and TypeScript.
                  </div>
                  <div className="flex gap-2 pt-1">
                    {[
                      { id: 2, label: '2 Spaces' },
                      { id: 4, label: '4 Spaces' },
                      { id: 'tab', label: 'Tabs' },
                    ].map((opt) => (
                      <button
                        key={opt.id}
                        onClick={() => updateSettings({ indentSize: opt.id as any })}
                        className={cn(
                          'px-3 py-1.5 rounded-xs border text-xs transition-colors',
                          settings.indentSize === opt.id
                            ? 'bg-accent/20 border-accent text-accent font-semibold'
                            : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-zinc-200',
                        )}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Trim Whitespace */}
                <div className="flex items-center justify-between p-3.5 bg-zinc-950/60 border border-zinc-800/80 rounded-xs">
                  <div>
                    <div className="text-xs font-semibold text-zinc-200">Trim Trailing Whitespace</div>
                    <div className="text-2xs text-zinc-500 mt-0.5">
                      Strips empty trailing lines and spaces from synthesized code exports.
                    </div>
                  </div>
                  <button
                    onClick={() => updateSettings({ trimWhitespace: !settings.trimWhitespace })}
                    className={cn(
                      'w-10 h-5 flex items-center rounded-full p-0.5 transition-colors',
                      settings.trimWhitespace ? 'bg-accent' : 'bg-zinc-800',
                    )}
                  >
                    <div
                      className={cn(
                        'bg-white w-4 h-4 rounded-full shadow-md transform transition-transform',
                        settings.trimWhitespace ? 'translate-x-5' : 'translate-x-0',
                      )}
                    />
                  </button>
                </div>
              </div>
            )}

            {/* ── TAB: APPEARANCE ── */}
            {activeTab === 'appearance' && (
              <div className="space-y-5">
                {/* Theme Accent Selection */}
                <div className="p-3.5 bg-zinc-950/60 border border-zinc-800/80 rounded-xs space-y-3">
                  <div className="text-xs font-semibold text-zinc-200">Brand Accent Color</div>
                  <div className="text-2xs text-zinc-500">
                    Defines the high-tactile focus color across buttons, indicators and badges.
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
                    {[
                      { id: 'orange', label: 'Electric Pulse', color: '#ff4f00' },
                      { id: 'emerald', label: 'Emerald Node', color: '#10b981' },
                      { id: 'cyan', label: 'Cyber Cyan', color: '#06b6d4' },
                      { id: 'zinc', label: 'Monochrome Zinc', color: '#71717a' },
                    ].map((accent) => (
                      <button
                        key={accent.id}
                        onClick={() => updateSettings({ themeAccent: accent.id as ThemeAccent })}
                        className={cn(
                          'flex items-center gap-2 p-2 rounded-xs border text-xs text-left transition-all',
                          settings.themeAccent === accent.id
                            ? 'bg-zinc-800/80 border-zinc-600 text-zinc-100 shadow-sm'
                            : 'bg-zinc-900/60 border-zinc-800 text-zinc-400 hover:text-zinc-200',
                        )}
                      >
                        <span
                          className="w-3 h-3 rounded-full flex-none"
                          style={{ backgroundColor: accent.color }}
                        />
                        <span className="truncate">{accent.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Font Size */}
                <div className="p-3.5 bg-zinc-950/60 border border-zinc-800/80 rounded-xs space-y-2">
                  <div className="text-xs font-semibold text-zinc-200">Editor Typography Size</div>
                  <div className="text-2xs text-zinc-500">
                    Adjusts font size in the dual-split input and output code canvases.
                  </div>
                  <div className="flex gap-2 pt-1">
                    {[12, 13, 14, 16].map((size) => (
                      <button
                        key={size}
                        onClick={() => updateSettings({ fontSize: size as EditorFontSize })}
                        className={cn(
                          'px-3 py-1.5 rounded-xs border text-xs transition-colors',
                          settings.fontSize === size
                            ? 'bg-accent/20 border-accent text-accent font-semibold'
                            : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-zinc-200',
                        )}
                      >
                        {size}px
                      </button>
                    ))}
                  </div>
                </div>

                {/* Word Wrap */}
                <div className="flex items-center justify-between p-3.5 bg-zinc-950/60 border border-zinc-800/80 rounded-xs">
                  <div>
                    <div className="text-xs font-semibold text-zinc-200">Word Wrap Code Lines</div>
                    <div className="text-2xs text-zinc-500 mt-0.5">
                      Soft-wraps long payloads instead of horizontal scrolling.
                    </div>
                  </div>
                  <button
                    onClick={() => updateSettings({ wordWrap: !settings.wordWrap })}
                    className={cn(
                      'w-10 h-5 flex items-center rounded-full p-0.5 transition-colors',
                      settings.wordWrap ? 'bg-accent' : 'bg-zinc-800',
                    )}
                  >
                    <div
                      className={cn(
                        'bg-white w-4 h-4 rounded-full shadow-md transform transition-transform',
                        settings.wordWrap ? 'translate-x-5' : 'translate-x-0',
                      )}
                    />
                  </button>
                </div>
              </div>
            )}

            {/* ── TAB: SECURITY ── */}
            {activeTab === 'security' && (
              <div className="space-y-5">
                {/* PII Masking Mode */}
                <div className="p-3.5 bg-zinc-950/60 border border-zinc-800/80 rounded-xs space-y-2">
                  <div className="text-xs font-semibold text-zinc-200">Default PII Sanitization Mode</div>
                  <div className="text-2xs text-zinc-500">
                    Determines how sensitive fields (SSN, credit cards, emails, tokens) are handled.
                  </div>
                  <div className="grid grid-cols-3 gap-2 pt-1">
                    {[
                      { id: 'mask', label: 'Mask (****-1234)' },
                      { id: 'redact', label: 'Full Redaction' },
                      { id: 'fake', label: 'Synthetic Mock' },
                    ].map((mode) => (
                      <button
                        key={mode.id}
                        onClick={() => updateSettings({ piiMaskingMode: mode.id as PiiMaskingMode })}
                        className={cn(
                          'p-2 rounded-xs border text-2xs text-center transition-colors',
                          settings.piiMaskingMode === mode.id
                            ? 'bg-cyan-950/60 border-cyan-500 text-cyan-400 font-semibold'
                            : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-zinc-200',
                        )}
                      >
                        {mode.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Formula Injection Guard */}
                <div className="flex items-center justify-between p-3.5 bg-zinc-950/60 border border-zinc-800/80 rounded-xs">
                  <div>
                    <div className="text-xs font-semibold text-zinc-200">Formula Injection Guard (CSV)</div>
                    <div className="text-2xs text-zinc-500 mt-0.5">
                      Prefixes =, +, -, @ cells with a tab to prevent remote spreadsheet execution.
                    </div>
                  </div>
                  <button
                    onClick={() => updateSettings({ formulaGuard: !settings.formulaGuard })}
                    className={cn(
                      'w-10 h-5 flex items-center rounded-full p-0.5 transition-colors',
                      settings.formulaGuard ? 'bg-emerald-500' : 'bg-zinc-800',
                    )}
                  >
                    <div
                      className={cn(
                        'bg-white w-4 h-4 rounded-full shadow-md transform transition-transform',
                        settings.formulaGuard ? 'translate-x-5' : 'translate-x-0',
                      )}
                    />
                  </button>
                </div>

                {/* Air Gapped Mode */}
                <div className="flex items-center justify-between p-3.5 bg-zinc-950/60 border border-zinc-800/80 rounded-xs">
                  <div>
                    <div className="text-xs font-semibold text-zinc-200 flex items-center gap-1.5">
                      <Lock className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Strict Air-Gapped Enforcement</span>
                    </div>
                    <div className="text-2xs text-zinc-500 mt-0.5">
                      Disables all outgoing network checks (updates, external links) for air-gapped security.
                    </div>
                  </div>
                  <button
                    onClick={() => updateSettings({ airGappedMode: !settings.airGappedMode })}
                    className={cn(
                      'w-10 h-5 flex items-center rounded-full p-0.5 transition-colors',
                      settings.airGappedMode ? 'bg-emerald-500' : 'bg-zinc-800',
                    )}
                  >
                    <div
                      className={cn(
                        'bg-white w-4 h-4 rounded-full shadow-md transform transition-transform',
                        settings.airGappedMode ? 'translate-x-5' : 'translate-x-0',
                      )}
                    />
                  </button>
                </div>
              </div>
            )}

            {/* ── TAB: PERFORMANCE ── */}
            {activeTab === 'performance' && (
              <div className="space-y-5">
                {/* Worker Threshold */}
                <div className="p-3.5 bg-zinc-950/60 border border-zinc-800/80 rounded-xs space-y-2">
                  <div className="text-xs font-semibold text-zinc-200">Web Worker Background Threshold</div>
                  <div className="text-2xs text-zinc-500">
                    Offloads data conversion to an isolated Web Worker thread when payload exceeds this size.
                  </div>
                  <div className="flex gap-2 pt-1">
                    {[
                      { size: 51200, label: '50 KB' },
                      { size: 102400, label: '100 KB (Recommended)' },
                      { size: 524288, label: '512 KB' },
                      { size: 1048576, label: '1 MB' },
                    ].map((opt) => (
                      <button
                        key={opt.size}
                        onClick={() => updateSettings({ workerThresholdBytes: opt.size })}
                        className={cn(
                          'px-3 py-1.5 rounded-xs border text-xs transition-colors',
                          settings.workerThresholdBytes === opt.size
                            ? 'bg-amber-950/60 border-amber-500 text-amber-400 font-semibold'
                            : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-zinc-200',
                        )}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Streaming Output */}
                <div className="flex items-center justify-between p-3.5 bg-zinc-950/60 border border-zinc-800/80 rounded-xs">
                  <div>
                    <div className="text-xs font-semibold text-zinc-200">High-Throughput Chunking</div>
                    <div className="text-2xs text-zinc-500 mt-0.5">
                      Processes large arrays in non-blocking slices to prevent UI thread lockups.
                    </div>
                  </div>
                  <button
                    onClick={() => updateSettings({ streamOutput: !settings.streamOutput })}
                    className={cn(
                      'w-10 h-5 flex items-center rounded-full p-0.5 transition-colors',
                      settings.streamOutput ? 'bg-amber-500' : 'bg-zinc-800',
                    )}
                  >
                    <div
                      className={cn(
                        'bg-white w-4 h-4 rounded-full shadow-md transform transition-transform',
                        settings.streamOutput ? 'translate-x-5' : 'translate-x-0',
                      )}
                    />
                  </button>
                </div>
              </div>
            )}

            {/* ── TAB: LICENSE ── */}
            {activeTab === 'license' && (
              <div className="space-y-5">
                <div className="p-4 bg-zinc-950/70 border border-zinc-800 rounded-xs space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-3xs uppercase tracking-wider text-zinc-500">Current Entitlement</span>
                      <h4 className="text-sm font-bold text-zinc-100 flex items-center gap-2 mt-0.5">
                        <span className="capitalize">{licenseTier} Tier</span>
                        {licenseTier !== 'free' && (
                          <span className="text-2xs font-mono px-2 py-0.5 bg-emerald-950 border border-emerald-800 text-emerald-400 rounded-xs">
                            Active
                          </span>
                        )}
                      </h4>
                    </div>
                    <button
                      onClick={() => {
                        setShowSettingsModal(false);
                        setShowLicenseModal(true);
                      }}
                      className="px-3 py-1.5 bg-accent hover:bg-accent-hover text-white text-xs font-semibold rounded-xs transition-colors flex items-center gap-1.5"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>{licenseTier === 'free' ? 'Upgrade to Pro' : 'Manage License'}</span>
                    </button>
                  </div>

                  {licenseKey && (
                    <div className="pt-2 border-t border-zinc-900 text-2xs text-zinc-400">
                      <span className="text-zinc-600">Active Key:</span>{' '}
                      <span className="font-mono text-zinc-300">{licenseKey}</span>
                    </div>
                  )}
                </div>

                <div className="p-3.5 bg-zinc-950/50 border border-zinc-800/80 rounded-xs text-2xs text-zinc-400 leading-relaxed">
                  FormatPulse uses 100% offline verifiable cryptographic signatures. Licenses never expire and function completely severed from the internet.
                </div>
              </div>
            )}

            {/* ── TAB: UPDATES ── */}
            {activeTab === 'updates' && (
              <div className="space-y-5">
                <div className="p-4 bg-zinc-950/60 border border-zinc-800 rounded-xs space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xs font-semibold text-zinc-200">Installed Version</div>
                      <div className="text-xs font-mono text-accent font-bold mt-0.5">
                        FormatPulse v{APP_VERSION} ({APP_BUILD_DATE})
                      </div>
                    </div>
                    <button
                      onClick={handleCheckUpdate}
                      disabled={isCheckingUpdate}
                      className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold rounded-xs transition-colors flex items-center gap-1.5 border border-zinc-700 disabled:opacity-50"
                    >
                      <RefreshCw className={cn('w-3.5 h-3.5', isCheckingUpdate && 'animate-spin')} />
                      <span>{isCheckingUpdate ? 'Checking...' : 'Check for Updates'}</span>
                    </button>
                  </div>

                  {updateStatus && (
                    <div className="p-3 bg-zinc-900/80 border border-zinc-800 rounded-xs text-2xs text-zinc-300">
                      {updateStatus}
                    </div>
                  )}

                  {manifestInfo && (
                    <div className="p-3 bg-zinc-900/90 border border-emerald-900/50 rounded-xs space-y-2">
                      <div className="text-xs font-semibold text-emerald-400">{manifestInfo.title}</div>
                      <ul className="list-disc pl-4 space-y-1 text-2xs text-zinc-400">
                        {manifestInfo.highlights.map((h, i) => (
                          <li key={i}>{h}</li>
                        ))}
                      </ul>
                      <a
                        href={manifestInfo.downloadUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => {
                          e.preventDefault();
                          if (manifestInfo?.downloadUrl) {
                            void openExternalUrl(manifestInfo.downloadUrl);
                          }
                        }}
                        className="inline-flex items-center gap-1.5 mt-2 px-3 py-1 bg-accent hover:bg-accent-hover text-white text-2xs font-bold rounded-xs transition-colors"
                      >
                        <span>Download Update</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  )}
                </div>

                <div className="text-2xs text-zinc-500">
                  Update checks query the official release manifest without sending any telemetry, IP tracking or usage analytics.
                </div>
              </div>
            )}

            {/* ── TAB: SHORTCUTS ── */}
            {activeTab === 'shortcuts' && (
              <div className="space-y-3">
                {[
                  { keys: 'Ctrl + K / ⌘K', desc: 'Open Command Palette' },
                  { keys: 'Ctrl + , / ⌘,', desc: 'Open Settings & Preferences' },
                  { keys: 'Ctrl + S / ⌘S', desc: 'Save & Export Output File' },
                  { keys: 'Ctrl + Shift + C', desc: 'Copy Output to Clipboard' },
                  { keys: 'Ctrl + Shift + F', desc: 'Format and Beautify Syntax' },
                  { keys: 'Ctrl + Shift + D', desc: 'Toggle AST Structural Diff' },
                  { keys: 'Ctrl + Shift + B', desc: 'Open Batch ZIP Converter' },
                  { keys: 'Escape', desc: 'Close Active Dialog or Canvas' },
                ].map((sc, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-2.5 bg-zinc-950/60 border border-zinc-800/80 rounded-xs"
                  >
                    <span className="text-xs text-zinc-300">{sc.desc}</span>
                    <kbd className="px-2 py-1 bg-zinc-800 border border-zinc-700 text-zinc-300 text-2xs rounded-xs font-mono shadow-xs">
                      {sc.keys}
                    </kbd>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Bottom Action Footer */}
          <div className="flex items-center justify-between px-6 py-3 border-t border-zinc-800/80 bg-zinc-950/60 select-none">
            <button
              onClick={resetToDefaults}
              className="text-2xs text-zinc-500 hover:text-zinc-300 font-mono flex items-center gap-1 transition-colors"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset to Defaults</span>
            </button>
            <button
              onClick={() => setShowSettingsModal(false)}
              className="px-4 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-100 text-xs font-semibold rounded-xs border border-zinc-700 transition-colors"
            >
              Done
            </button>
          </div>
        </main>
      </div>
    </div>
  );
};
