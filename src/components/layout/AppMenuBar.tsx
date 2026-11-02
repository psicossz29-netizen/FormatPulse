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
      className="h-6 flex-none bg-zinc-950 border-b border-zinc-900 flex items-center px-2 text-2xs font-mono text-zinc-400 select-none z-30"
    >
      {/* ── FILE MENU ── */}
      <div className="relative">
        <button
          onClick={() => setActiveMenu(activeMenu === 'file' ? null : 'file')}
          className={cn(
            'px-2 py-0.5 rounded-xs hover:bg-zinc-800 hover:text-zinc-200 transition-colors',
            activeMenu === 'file' && 'bg-zinc-800 text-zinc-100 font-semibold',
          )}
        >
          File
        </button>
        {activeMenu === 'file' && (
          <div className="absolute top-full left-0 mt-0.5 w-56 bg-zinc-900 border border-zinc-800 shadow-xl rounded-xs py-1 z-40">
            <button
              onClick={() => {
                clearWorkspace();
                setActiveMenu(null);
              }}
              className="w-full flex items-center justify-between px-3 py-1.5 hover:bg-zinc-800 text-zinc-200 text-left"
            >
              <div className="flex items-center gap-2">
                <Trash2 className="w-3.5 h-3.5 text-zinc-400" />
                <span>New / Clear Canvas</span>
              </div>
              <span className="text-3xs text-zinc-500">⌘N</span>
            </button>
            <button
              onClick={handleFileLoad}
              className="w-full flex items-center justify-between px-3 py-1.5 hover:bg-zinc-800 text-zinc-200 text-left"
            >
              <div className="flex items-center gap-2">
                <FileUp className="w-3.5 h-3.5 text-zinc-400" />
                <span>Open File...</span>
              </div>
              <span className="text-3xs text-zinc-500">⌘O</span>
            </button>
            <button
              onClick={() => {
                loadPreset(PRESETS[0]?.id || 'json-to-typescript');
                setActiveMenu(null);
              }}
              className="w-full flex items-center justify-between px-3 py-1.5 hover:bg-zinc-800 text-zinc-200 text-left"
            >
              <div className="flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-accent" />
                <span>Load Sample Dataset</span>
              </div>
            </button>
            <div className="my-1 border-t border-zinc-800" />
            <button
              onClick={handleExportFile}
              className="w-full flex items-center justify-between px-3 py-1.5 hover:bg-zinc-800 text-zinc-200 text-left"
            >
              <div className="flex items-center gap-2">
                <Download className="w-3.5 h-3.5 text-zinc-400" />
                <span>Export Output As...</span>
              </div>
              <span className="text-3xs text-zinc-500">⌘S</span>
            </button>
            <button
              onClick={() => {
                setShowBatchModal(true);
                setActiveMenu(null);
              }}
              className="w-full flex items-center justify-between px-3 py-1.5 hover:bg-zinc-800 text-zinc-200 text-left"
            >
              <div className="flex items-center gap-2">
                <Layers className="w-3.5 h-3.5 text-zinc-400" />
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
            'px-2 py-0.5 rounded-xs hover:bg-zinc-800 hover:text-zinc-200 transition-colors',
            activeMenu === 'edit' && 'bg-zinc-800 text-zinc-100 font-semibold',
          )}
        >
          Edit
        </button>
        {activeMenu === 'edit' && (
          <div className="absolute top-full left-0 mt-0.5 w-56 bg-zinc-900 border border-zinc-800 shadow-xl rounded-xs py-1 z-40">
            <button
              onClick={handleCopyOutput}
              className="w-full flex items-center justify-between px-3 py-1.5 hover:bg-zinc-800 text-zinc-200 text-left"
            >
              <div className="flex items-center gap-2">
                <Copy className="w-3.5 h-3.5 text-zinc-400" />
                <span>Copy Output to Clipboard</span>
              </div>
              <span className="text-3xs text-zinc-500">⌘C</span>
            </button>
            <button
              onClick={() => {
                setShowHealthInspector(true);
                setActiveMenu(null);
              }}
              className="w-full flex items-center justify-between px-3 py-1.5 hover:bg-zinc-800 text-zinc-200 text-left"
            >
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-3.5 h-3.5 text-emerald-400" />
                <span>Sanitize PII & Audit</span>
              </div>
            </button>
            <div className="my-1 border-t border-zinc-800" />
            <button
              onClick={() => {
                clearWorkspace();
                setActiveMenu(null);
              }}
              className="w-full flex items-center justify-between px-3 py-1.5 hover:bg-zinc-800 text-zinc-200 text-left"
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
            'px-2 py-0.5 rounded-xs hover:bg-zinc-800 hover:text-zinc-200 transition-colors',
            activeMenu === 'view' && 'bg-zinc-800 text-zinc-100 font-semibold',
          )}
        >
          View
        </button>
        {activeMenu === 'view' && (
          <div className="absolute top-full left-0 mt-0.5 w-56 bg-zinc-900 border border-zinc-800 shadow-xl rounded-xs py-1 z-40">
            <button
              onClick={() => {
                updateSettings({ wordWrap: !wordWrap });
                setActiveMenu(null);
              }}
              className="w-full flex items-center justify-between px-3 py-1.5 hover:bg-zinc-800 text-zinc-200 text-left"
            >
              <span>Toggle Word Wrap</span>
              {wordWrap && <Check className="w-3.5 h-3.5 text-accent" />}
            </button>
            <div className="px-3 py-1 text-3xs text-zinc-500 uppercase tracking-wider">Font Size</div>
            {[12, 13, 14, 16].map((sz) => (
              <button
                key={sz}
                onClick={() => {
                  updateSettings({ fontSize: sz as any });
                  setActiveMenu(null);
                }}
                className="w-full flex items-center justify-between px-3 py-1 hover:bg-zinc-800 text-zinc-300 text-left"
              >
                <span>{sz}px</span>
                {fontSize === sz && <Check className="w-3 h-3 text-accent" />}
              </button>
            ))}
            <div className="my-1 border-t border-zinc-800" />
            <button
              onClick={() => {
                setShowDiffModal(true);
                setActiveMenu(null);
              }}
              className="w-full flex items-center gap-2 px-3 py-1.5 hover:bg-zinc-800 text-zinc-200 text-left"
            >
              <GitCompare className="w-3.5 h-3.5 text-accent" />
              <span>Structural Schema Diff</span>
            </button>
            <button
              onClick={() => {
                setShowHealthInspector(true);
                setActiveMenu(null);
              }}
              className="w-full flex items-center gap-2 px-3 py-1.5 hover:bg-zinc-800 text-zinc-200 text-left"
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
            'px-2 py-0.5 rounded-xs hover:bg-zinc-800 hover:text-zinc-200 transition-colors',
            activeMenu === 'tools' && 'bg-zinc-800 text-zinc-100 font-semibold',
          )}
        >
          Tools
        </button>
        {activeMenu === 'tools' && (
          <div className="absolute top-full left-0 mt-0.5 w-60 bg-zinc-900 border border-zinc-800 shadow-xl rounded-xs py-1 z-40">
            <div className="px-3 py-1 text-3xs text-zinc-500 uppercase tracking-wider">Schema Synthesis</div>
            <button
              onClick={() => {
                setOutputFormat('typescript');
                setActiveMenu(null);
              }}
              className="w-full px-3 py-1 hover:bg-zinc-800 text-zinc-200 text-left"
            >
              Generate TypeScript Interface
            </button>
            <button
              onClick={() => {
                setOutputFormat('zod');
                setActiveMenu(null);
              }}
              className="w-full px-3 py-1 hover:bg-zinc-800 text-zinc-200 text-left"
            >
              Generate Zod Validator
            </button>
            <button
              onClick={() => {
                setOutputFormat('openapi');
                setActiveMenu(null);
              }}
              className="w-full px-3 py-1 hover:bg-zinc-800 text-zinc-200 text-left"
            >
              Generate OpenAPI 3.1 Spec
            </button>
            <button
              onClick={() => {
                setOutputFormat('prisma');
                setActiveMenu(null);
              }}
              className="w-full px-3 py-1 hover:bg-zinc-800 text-zinc-200 text-left"
            >
              Generate Prisma ORM Model
            </button>
            <div className="my-1 border-t border-zinc-800" />
            <button
              onClick={() => {
                setShowCommandPalette(true);
                setActiveMenu(null);
              }}
              className="w-full flex items-center justify-between px-3 py-1.5 hover:bg-zinc-800 text-zinc-200 text-left"
            >
              <div className="flex items-center gap-2">
                <Search className="w-3.5 h-3.5 text-zinc-400" />
                <span>Command Palette...</span>
              </div>
              <span className="text-3xs text-zinc-500">⌘K</span>
            </button>
          </div>
        )}
      </div>

      {/* ── PREFERENCES MENU ── */}
      <div className="relative">
        <button
          onClick={() => setActiveMenu(activeMenu === 'settings' ? null : 'settings')}
          className={cn(
            'px-2 py-0.5 rounded-xs hover:bg-zinc-800 hover:text-zinc-200 transition-colors',
            activeMenu === 'settings' && 'bg-zinc-800 text-zinc-100 font-semibold',
          )}
        >
          Preferences
        </button>
        {activeMenu === 'settings' && (
          <div className="absolute top-full left-0 mt-0.5 w-60 bg-zinc-900 border border-zinc-800 shadow-xl rounded-xs py-1 z-40">
            <button
              onClick={() => {
                setShowSettingsModal(true);
                setActiveMenu(null);
              }}
              className="w-full flex items-center justify-between px-3 py-1.5 hover:bg-zinc-800 text-zinc-200 text-left font-semibold"
            >
              <div className="flex items-center gap-2">
                <Settings className="w-3.5 h-3.5 text-accent" />
                <span>Settings Dialog...</span>
              </div>
              <span className="text-3xs text-zinc-500">⌘,</span>
            </button>
            <div className="my-1 border-t border-zinc-800" />
            <div className="px-3 py-1 text-3xs text-zinc-500 uppercase tracking-wider">Accent Palette</div>
            {[
              { id: 'orange', label: 'Electric Pulse' },
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
                className="w-full flex items-center justify-between px-3 py-1 hover:bg-zinc-800 text-zinc-300 text-left"
              >
                <span>{th.label}</span>
                {themeAccent === th.id && <Check className="w-3 h-3 text-accent" />}
              </button>
            ))}
            <div className="my-1 border-t border-zinc-800" />
            <button
              onClick={() => {
                setShowLicenseModal(true);
                setActiveMenu(null);
              }}
              className="w-full flex items-center gap-2 px-3 py-1.5 hover:bg-zinc-800 text-zinc-200 text-left"
            >
              <Key className="w-3.5 h-3.5 text-accent" />
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
            'px-2 py-0.5 rounded-xs hover:bg-zinc-800 hover:text-zinc-200 transition-colors',
            activeMenu === 'help' && 'bg-zinc-800 text-zinc-100 font-semibold',
          )}
        >
          Help
        </button>
        {activeMenu === 'help' && (
          <div className="absolute top-full left-0 mt-0.5 w-60 bg-zinc-900 border border-zinc-800 shadow-xl rounded-xs py-1 z-40">
            <button
              onClick={() => {
                setShowUpdateModal(true);
                setActiveMenu(null);
              }}
              className="w-full flex items-center justify-between px-3 py-1.5 hover:bg-zinc-800 text-zinc-200 text-left"
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
              className="w-full flex items-center gap-2 px-3 py-1.5 hover:bg-zinc-800 text-zinc-200 text-left"
            >
              <HelpCircle className="w-3.5 h-3.5 text-zinc-400" />
              <span>Keyboard Shortcuts</span>
            </button>
            <div className="my-1 border-t border-zinc-800" />
            <a
              href={PRODUCTION_WEB_URL}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => {
                e.preventDefault();
                setActiveMenu(null);
                void openExternalUrl(PRODUCTION_WEB_URL);
              }}
              className="w-full flex items-center justify-between px-3 py-1.5 hover:bg-zinc-800 text-zinc-200 text-left"
            >
              <span>FormatPulse Website</span>
              <ExternalLink className="w-3 h-3 text-zinc-500" />
            </a>
            <a
              href={`mailto:${SUPPORT_EMAIL}?subject=FormatPulse%20Support`}
              onClick={(e) => {
                e.preventDefault();
                setActiveMenu(null);
                void openExternalUrl(`mailto:${SUPPORT_EMAIL}?subject=FormatPulse%20Support`);
              }}
              className="w-full flex items-center justify-between px-3 py-1.5 hover:bg-zinc-800 text-zinc-200 text-left"
            >
              <span>Email Support</span>
              <Mail className="w-3 h-3 text-zinc-500" />
            </a>
            <div className="my-1 border-t border-zinc-800" />
            <div className="px-3 py-1 text-3xs text-zinc-500">
              FormatPulse v{APP_VERSION} (64-bit Desktop)
            </div>
          </div>
        )}
      </div>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Desktop Quick Shortcuts Trigger */}
      <div className="flex items-center gap-2 text-3xs text-zinc-600">
        <span>Preferences: ⌘,</span>
        <span>·</span>
        <span>Commands: ⌘K</span>
      </div>
    </div>
  );
};
