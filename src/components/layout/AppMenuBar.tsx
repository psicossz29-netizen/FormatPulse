import React, { useState, useRef, useEffect } from 'react';
import {
  Settings,
  HelpCircle,
  FileUp,
  Download,
  Copy,
  Trash2,
  Sparkles,
  ShieldAlert,
  GitCompare,
  Layers,
  Search,
  Key,
  RefreshCw,
  ExternalLink,
  Mail,
  Check,
} from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { useSettingsStore, type ThemeAccent } from '@/store/useSettingsStore';
import { APP_VERSION, PRODUCTION_WEB_URL, SUPPORT_EMAIL } from '@/constants/version';
import { openExternalUrl } from '@/core/desktopBridge';
import { PRESETS } from '@/core/presets';
import { cn } from '@/lib/utils';

export const AppMenuBar: React.FC = () => {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const menuBarRef = useRef<HTMLDivElement>(null);

  // App store
  const setInputValue = useAppStore((s) => s.setInputValue);
  const outputValue = useAppStore((s) => s.outputValue);
  const clearWorkspace = useAppStore((s) => s.clearWorkspace);
  const loadPreset = useAppStore((s) => s.loadPreset);
  const setOutputFormat = useAppStore((s) => s.setOutputFormat);
  const setShowCommandPalette = useAppStore((s) => s.setShowCommandPalette);
  const setShowHealthInspector = useAppStore((s) => s.setShowHealthInspector);
  const setShowDiffModal = useAppStore((s) => s.setShowDiffModal);
  const setShowBatchModal = useAppStore((s) => s.setShowBatchModal);
  const setShowUpdateModal = useAppStore((s) => s.setShowUpdateModal);
  const setShowLicenseModal = useAppStore((s) => s.setShowLicenseModal);
  const setShowSettingsModal = useAppStore((s) => s.setShowSettingsModal);
  const setCopyFeedback = useAppStore((s) => s.setCopyFeedback);

  // Settings store
  const wordWrap = useSettingsStore((s) => s.wordWrap);
  const fontSize = useSettingsStore((s) => s.fontSize);
  const themeAccent = useSettingsStore((s) => s.themeAccent);
  const updateSettings = useSettingsStore((s) => s.updateSettings);

  // Click outside listener
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuBarRef.current && !menuBarRef.current.contains(e.target as Node)) {
        setActiveMenu(null);
      }
    };
    window.addEventListener('mousedown', handleClickOutside);
    return () => window.removeEventListener('mousedown', handleClickOutside);
  }, []);

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
    setActiveMenu(null);
  };

  const handleExportFile = () => {
    if (!outputValue) return;
    const blob = new Blob([outputValue], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `formatpulse-export-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    setActiveMenu(null);
  };

  const handleCopyOutput = async () => {
    if (!outputValue) return;
    try {
      await navigator.clipboard.writeText(outputValue);
      setCopyFeedback('copied');
      setTimeout(() => setCopyFeedback('idle'), 1500);
    } catch {
      // Fallback
    }
    setActiveMenu(null);
  };

  return (
    <div
      ref={menuBarRef}
      className="h-7 flex-none bg-[#09090B] border-b border-[#26262C] flex items-center px-3 text-xs font-geist text-[#9A9AA5] select-none z-30"
    >
      {/* ── FILE MENU ── */}
      <div className="relative">
        <button
          onClick={() => setActiveMenu(activeMenu === 'file' ? null : 'file')}
          className={cn(
            'px-2.5 py-0.5 rounded-lg hover:bg-white/[0.06] hover:text-[#F4F4F5] transition-colors',
            activeMenu === 'file' && 'bg-white/[0.08] text-[#F4F4F5] font-semibold',
          )}
        >
          File
        </button>
        {activeMenu === 'file' && (
          <div className="absolute top-full left-0 mt-1 w-60 bg-[#111114] border border-[#26262C] shadow-[0_20px_50px_rgba(0,0,0,0.85)] rounded-2xl py-1.5 z-40 backdrop-blur-xl animate-pop text-xs font-geist">
            <button
              onClick={() => {
                clearWorkspace();
                setActiveMenu(null);
              }}
              className="w-full flex items-center justify-between px-3 py-2 hover:bg-white/[0.06] text-[#F4F4F5] text-left rounded-xl transition-colors"
            >
              <div className="flex items-center gap-2">
                <Trash2 className="w-3.5 h-3.5 text-[#9A9AA5]" />
                <span>New / Clear Canvas</span>
              </div>
              <span className="text-[10px] font-geist-mono text-[#9A9AA5] px-1.5 py-0.5 rounded bg-white/[0.04] border border-[#26262C]">⌘N</span>
            </button>
            <button
              onClick={handleFileLoad}
              className="w-full flex items-center justify-between px-3 py-2 hover:bg-white/[0.06] text-[#F4F4F5] text-left rounded-xl transition-colors"
            >
              <div className="flex items-center gap-2">
                <FileUp className="w-3.5 h-3.5 text-[#9A9AA5]" />
                <span>Open File...</span>
              </div>
              <span className="text-[10px] font-geist-mono text-[#9A9AA5] px-1.5 py-0.5 rounded bg-white/[0.04] border border-[#26262C]">⌘O</span>
            </button>
            <button
              onClick={() => {
                loadPreset(PRESETS[0]?.id || 'json-to-typescript');
                setActiveMenu(null);
              }}
              className="w-full flex items-center justify-between px-3 py-2 hover:bg-white/[0.06] text-[#F4F4F5] text-left rounded-xl transition-colors"
            >
              <div className="flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-[#FF4F00]" />
                <span>Load Sample Dataset</span>
              </div>
            </button>
            <div className="my-1.5 border-t border-[#26262C]" />
            <button
              onClick={handleExportFile}
              className="w-full flex items-center justify-between px-3 py-2 hover:bg-white/[0.06] text-[#F4F4F5] text-left rounded-xl transition-colors"
            >
              <div className="flex items-center gap-2">
                <Download className="w-3.5 h-3.5 text-[#9A9AA5]" />
                <span>Export Output As...</span>
              </div>
              <span className="text-[10px] font-geist-mono text-[#9A9AA5] px-1.5 py-0.5 rounded bg-white/[0.04] border border-[#26262C]">⌘S</span>
            </button>
            <button
              onClick={() => {
                setShowBatchModal(true);
                setActiveMenu(null);
              }}
              className="w-full flex items-center justify-between px-3 py-2 hover:bg-white/[0.06] text-[#F4F4F5] text-left rounded-xl transition-colors"
            >
              <div className="flex items-center gap-2">
                <Layers className="w-3.5 h-3.5 text-[#9A9AA5]" />
                <span>Batch Multi-File (ZIP)</span>
              </div>
            </button>
          </div>
        )}
      </div>

      {/* ── EDIT MENU ── */}
      <div className="relative">
        <button
          onClick={() => setActiveMenu(activeMenu === 'edit' ? null : 'edit')}
          className={cn(
            'px-2.5 py-0.5 rounded-lg hover:bg-white/[0.06] hover:text-[#F4F4F5] transition-colors',
            activeMenu === 'edit' && 'bg-white/[0.08] text-[#F4F4F5] font-semibold',
          )}
        >
          Edit
        </button>
        {activeMenu === 'edit' && (
          <div className="absolute top-full left-0 mt-1 w-60 bg-[#111114] border border-[#26262C] shadow-[0_20px_50px_rgba(0,0,0,0.85)] rounded-2xl py-1.5 z-40 backdrop-blur-xl animate-pop text-xs font-geist">
            <button
              onClick={handleCopyOutput}
              className="w-full flex items-center justify-between px-3 py-2 hover:bg-white/[0.06] text-[#F4F4F5] text-left rounded-xl transition-colors"
            >
              <div className="flex items-center gap-2">
                <Copy className="w-3.5 h-3.5 text-[#9A9AA5]" />
                <span>Copy Output to Clipboard</span>
              </div>
              <span className="text-[10px] font-geist-mono text-[#9A9AA5] px-1.5 py-0.5 rounded bg-white/[0.04] border border-[#26262C]">⌘C</span>
            </button>
            <button
              onClick={() => {
                setShowHealthInspector(true);
                setActiveMenu(null);
              }}
              className="w-full flex items-center justify-between px-3 py-2 hover:bg-white/[0.06] text-[#F4F4F5] text-left rounded-xl transition-colors"
            >
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-3.5 h-3.5 text-emerald-400" />
                <span>Sanitize PII & Audit</span>
              </div>
            </button>
            <div className="my-1.5 border-t border-[#26262C]" />
            <button
              onClick={() => {
                clearWorkspace();
                setActiveMenu(null);
              }}
              className="w-full flex items-center justify-between px-3 py-2 hover:bg-white/[0.06] text-red-400 text-left rounded-xl transition-colors"
            >
              <div className="flex items-center gap-2">
                <Trash2 className="w-3.5 h-3.5 text-red-400" />
                <span>Clear All Canvases</span>
              </div>
            </button>
          </div>
        )}
      </div>

      {/* ── VIEW MENU ── */}
      <div className="relative">
        <button
          onClick={() => setActiveMenu(activeMenu === 'view' ? null : 'view')}
          className={cn(
            'px-2.5 py-0.5 rounded-lg hover:bg-white/[0.06] hover:text-[#F4F4F5] transition-colors',
            activeMenu === 'view' && 'bg-white/[0.08] text-[#F4F4F5] font-semibold',
          )}
        >
          View
        </button>
        {activeMenu === 'view' && (
          <div className="absolute top-full left-0 mt-1 w-60 bg-[#111114] border border-[#26262C] shadow-[0_20px_50px_rgba(0,0,0,0.85)] rounded-2xl py-1.5 z-40 backdrop-blur-xl animate-pop text-xs font-geist">
            <button
              onClick={() => {
                updateSettings({ wordWrap: !wordWrap });
                setActiveMenu(null);
              }}
              className="w-full flex items-center justify-between px-3 py-2 hover:bg-white/[0.06] text-[#F4F4F5] text-left rounded-xl transition-colors"
            >
              <span>Toggle Word Wrap</span>
              {wordWrap && <Check className="w-3.5 h-3.5 text-[#FF4F00]" />}
            </button>
            <div className="px-3 py-1.5 text-[10px] font-geist-mono text-[#9A9AA5] uppercase tracking-wider">Font Size</div>
            {[12, 13, 14, 16].map((sz) => (
              <button
                key={sz}
                onClick={() => {
                  updateSettings({ fontSize: sz as any });
                  setActiveMenu(null);
                }}
                className="w-full flex items-center justify-between px-3 py-1.5 hover:bg-white/[0.06] text-[#F4F4F5] text-left rounded-xl transition-colors"
              >
                <span>{sz}px</span>
                {fontSize === sz && <Check className="w-3 h-3 text-[#FF4F00]" />}
              </button>
            ))}
            <div className="my-1.5 border-t border-[#26262C]" />
            <button
              onClick={() => {
                setShowDiffModal(true);
                setActiveMenu(null);
              }}
              className="w-full flex items-center gap-2 px-3 py-2 hover:bg-white/[0.06] text-[#F4F4F5] text-left rounded-xl transition-colors"
            >
              <GitCompare className="w-3.5 h-3.5 text-[#FF4F00]" />
              <span>Structural Schema Diff</span>
            </button>
            <button
              onClick={() => {
                setShowHealthInspector(true);
                setActiveMenu(null);
              }}
              className="w-full flex items-center gap-2 px-3 py-2 hover:bg-white/[0.06] text-[#F4F4F5] text-left rounded-xl transition-colors"
            >
              <ShieldAlert className="w-3.5 h-3.5 text-emerald-400" />
              <span>Security & PII Inspector</span>
            </button>
          </div>
        )}
      </div>

      {/* ── TOOLS MENU ── */}
      <div className="relative">
        <button
          onClick={() => setActiveMenu(activeMenu === 'tools' ? null : 'tools')}
          className={cn(
            'px-2.5 py-0.5 rounded-lg hover:bg-white/[0.06] hover:text-[#F4F4F5] transition-colors',
            activeMenu === 'tools' && 'bg-white/[0.08] text-[#F4F4F5] font-semibold',
          )}
        >
          Tools
        </button>
        {activeMenu === 'tools' && (
          <div className="absolute top-full left-0 mt-1 w-64 bg-[#111114] border border-[#26262C] shadow-[0_20px_50px_rgba(0,0,0,0.85)] rounded-2xl py-1.5 z-40 backdrop-blur-xl animate-pop text-xs font-geist">
            <div className="px-3 py-1.5 text-[10px] font-geist-mono text-[#9A9AA5] uppercase tracking-wider">Schema Synthesis</div>
            <button
              onClick={() => {
                setOutputFormat('typescript');
                setActiveMenu(null);
              }}
              className="w-full px-3 py-1.5 hover:bg-white/[0.06] text-[#F4F4F5] text-left rounded-xl transition-colors"
            >
              Generate TypeScript Interface
            </button>
            <button
              onClick={() => {
                setOutputFormat('zod');
                setActiveMenu(null);
              }}
              className="w-full px-3 py-1.5 hover:bg-white/[0.06] text-[#F4F4F5] text-left rounded-xl transition-colors"
            >
              Generate Zod Validator
            </button>
            <button
              onClick={() => {
                setOutputFormat('openapi');
                setActiveMenu(null);
              }}
              className="w-full px-3 py-1.5 hover:bg-white/[0.06] text-[#F4F4F5] text-left rounded-xl transition-colors"
            >
              Generate OpenAPI 3.1 Spec
            </button>
            <button
              onClick={() => {
                setOutputFormat('prisma');
                setActiveMenu(null);
              }}
              className="w-full px-3 py-1.5 hover:bg-white/[0.06] text-[#F4F4F5] text-left rounded-xl transition-colors"
            >
              Generate Prisma ORM Model
            </button>
            <div className="my-1.5 border-t border-[#26262C]" />
            <button
              onClick={() => {
                setShowCommandPalette(true);
                setActiveMenu(null);
              }}
              className="w-full flex items-center justify-between px-3 py-2 hover:bg-white/[0.06] text-[#F4F4F5] text-left rounded-xl transition-colors"
            >
              <div className="flex items-center gap-2">
                <Search className="w-3.5 h-3.5 text-[#9A9AA5]" />
                <span>Command Palette...</span>
              </div>
              <span className="text-[10px] font-geist-mono text-[#9A9AA5] px-1.5 py-0.5 rounded bg-white/[0.04] border border-[#26262C]">⌘K</span>
            </button>
          </div>
        )}
      </div>

      {/* ── PREFERENCES MENU ── */}
      <div className="relative">
        <button
          onClick={() => setActiveMenu(activeMenu === 'settings' ? null : 'settings')}
          className={cn(
            'px-2.5 py-0.5 rounded-lg hover:bg-white/[0.06] hover:text-[#F4F4F5] transition-colors',
            activeMenu === 'settings' && 'bg-white/[0.08] text-[#F4F4F5] font-semibold',
          )}
        >
          Preferences
        </button>
        {activeMenu === 'settings' && (
          <div className="absolute top-full left-0 mt-1 w-64 bg-[#111114] border border-[#26262C] shadow-[0_20px_50px_rgba(0,0,0,0.85)] rounded-2xl py-1.5 z-40 backdrop-blur-xl animate-pop text-xs font-geist">
            <button
              onClick={() => {
                setShowSettingsModal(true);
                setActiveMenu(null);
              }}
              className="w-full flex items-center justify-between px-3 py-2 hover:bg-white/[0.06] text-[#F4F4F5] text-left font-semibold rounded-xl transition-colors"
            >
              <div className="flex items-center gap-2">
                <Settings className="w-3.5 h-3.5 text-[#FF4F00]" />
                <span>Settings Dialog...</span>
              </div>
              <span className="text-[10px] font-geist-mono text-[#9A9AA5] px-1.5 py-0.5 rounded bg-white/[0.04] border border-[#26262C]">⌘,</span>
            </button>
            <div className="my-1.5 border-t border-[#26262C]" />
            <div className="px-3 py-1.5 text-[10px] font-geist-mono text-[#9A9AA5] uppercase tracking-wider">Accent Palette</div>
            {[
              { id: 'orange', label: 'Tactical Orange' },
              { id: 'emerald', label: 'Emerald Node' },
              { id: 'cyan', label: 'Cyber Cyan' },
              { id: 'zinc', label: 'Zinc Monochrome' },
            ].map((th) => (
              <button
                key={th.id}
                onClick={() => {
                  updateSettings({ themeAccent: th.id as ThemeAccent });
                  setActiveMenu(null);
                }}
                className="w-full flex items-center justify-between px-3 py-1.5 hover:bg-white/[0.06] text-[#F4F4F5] text-left rounded-xl transition-colors"
              >
                <span>{th.label}</span>
                {themeAccent === th.id && <Check className="w-3 h-3 text-[#FF4F00]" />}
              </button>
            ))}
            <div className="my-1.5 border-t border-[#26262C]" />
            <button
              onClick={() => {
                setShowLicenseModal(true);
                setActiveMenu(null);
              }}
              className="w-full flex items-center gap-2 px-3 py-2 hover:bg-white/[0.06] text-[#F4F4F5] text-left rounded-xl transition-colors"
            >
              <Key className="w-3.5 h-3.5 text-[#FF4F00]" />
              <span>License & Plans...</span>
            </button>
          </div>
        )}
      </div>

      {/* ── HELP MENU ── */}
      <div className="relative">
        <button
          onClick={() => setActiveMenu(activeMenu === 'help' ? null : 'help')}
          className={cn(
            'px-2.5 py-0.5 rounded-lg hover:bg-white/[0.06] hover:text-[#F4F4F5] transition-colors',
            activeMenu === 'help' && 'bg-white/[0.08] text-[#F4F4F5] font-semibold',
          )}
        >
          Help
        </button>
        {activeMenu === 'help' && (
          <div className="absolute top-full left-0 mt-1 w-64 bg-[#111114] border border-[#26262C] shadow-[0_20px_50px_rgba(0,0,0,0.85)] rounded-2xl py-1.5 z-40 backdrop-blur-xl animate-pop text-xs font-geist">
            <button
              onClick={() => {
                setShowUpdateModal(true);
                setActiveMenu(null);
              }}
              className="w-full flex items-center justify-between px-3 py-2 hover:bg-white/[0.06] text-[#F4F4F5] text-left rounded-xl transition-colors"
            >
              <div className="flex items-center gap-2">
                <RefreshCw className="w-3.5 h-3.5 text-blue-400" />
                <span>Check for Updates...</span>
              </div>
            </button>
            <button
              onClick={() => {
                setShowSettingsModal(true);
                setActiveMenu(null);
              }}
              className="w-full flex items-center gap-2 px-3 py-2 hover:bg-white/[0.06] text-[#F4F4F5] text-left rounded-xl transition-colors"
            >
              <HelpCircle className="w-3.5 h-3.5 text-[#9A9AA5]" />
              <span>Keyboard Shortcuts</span>
            </button>
            <div className="my-1.5 border-t border-[#26262C]" />
            <a
              href={PRODUCTION_WEB_URL}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => {
                e.preventDefault();
                setActiveMenu(null);
                void openExternalUrl(PRODUCTION_WEB_URL);
              }}
              className="w-full flex items-center justify-between px-3 py-2 hover:bg-white/[0.06] text-[#F4F4F5] text-left rounded-xl transition-colors"
            >
              <span>FormatPulse Website</span>
              <ExternalLink className="w-3 h-3 text-[#9A9AA5]" />
            </a>
            <a
              href={`mailto:${SUPPORT_EMAIL}?subject=FormatPulse%20Support`}
              onClick={(e) => {
                e.preventDefault();
                setActiveMenu(null);
                void openExternalUrl(`mailto:${SUPPORT_EMAIL}?subject=FormatPulse%20Support`);
              }}
              className="w-full flex items-center justify-between px-3 py-2 hover:bg-white/[0.06] text-[#F4F4F5] text-left rounded-xl transition-colors"
            >
              <span>Email Support</span>
              <Mail className="w-3 h-3 text-[#9A9AA5]" />
            </a>
            <div className="my-1.5 border-t border-[#26262C]" />
            <div className="px-3 py-1.5 text-[11px] font-geist-mono text-[#9A9AA5]">
              FormatPulse v{APP_VERSION} (64-bit Desktop)
            </div>
          </div>
        )}
      </div>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Desktop Quick Shortcuts Trigger */}
      <div className="flex items-center gap-2.5 text-[11px] font-geist-mono text-[#9A9AA5]">
        <span>Preferences: ⌘,</span>
        <span>·</span>
        <span>Commands: ⌘K</span>
      </div>
    </div>
  );
};
