import React, { useCallback, useRef, useState } from 'react';
import { Copy, Download, Trash2, AlertTriangle, Archive } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { useSettingsStore } from '@/store/useSettingsStore';
import { FORMAT_LABELS } from '@/types';
import { cn } from '@/lib/utils';
import { ProPaywall } from '@/components/monetization/ProPaywall';
import { downloadGzippedOutput } from '@/core/exportUtils';

// ── Line-numbered code display ───────────────────────────────────────────────

interface CodePanelProps {
  value: string;
  onChange?: (value: string) => void;
  readonly?: boolean;
  lineCount: number;
  label: string;
  formatLabel: string;
}

const CodePanel: React.FC<CodePanelProps> = ({
  value,
  onChange,
  readonly = false,
  lineCount,
  label,
  formatLabel,
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleCopy = useCallback(async () => {
    if (!value) return;
    await navigator.clipboard.writeText(value);
  }, [value]);

  const [isCompressing, setIsCompressing] = useState(false);

  const handleDownload = useCallback(() => {
    if (!value) return;
    const blob = new Blob([value], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `formatpulse-output.${formatLabel.toLowerCase().replace(/\s+/g, '-')}`;
    a.click();
    URL.revokeObjectURL(url);
  }, [value, formatLabel]);

  const handleGzipDownload = useCallback(async () => {
    if (!value) return;
    setIsCompressing(true);
    try {
      const baseName = `formatpulse-output.${formatLabel.toLowerCase().replace(/\s+/g, '-')}`;
      await downloadGzippedOutput(value, baseName);
    } finally {
      setIsCompressing(false);
    }
  }, [value, formatLabel]);

  const handleClear = useCallback(() => {
    onChange?.('');
  }, [onChange]);

  const fontSize = useSettingsStore((s) => s.fontSize);
  const wordWrap = useSettingsStore((s) => s.wordWrap);
  const lineHeightPx = Math.round(fontSize * 1.5);

  // Generate line numbers
  const lines = Math.max(lineCount, 1);
  const gutterWidth = String(lines).length * 8 + 28;

  return (
    <div className="flex-1 flex flex-col min-w-0 h-full bg-[#09090B]">
      {/* ── Panel toolbar ─────────────────────────────────────────────── */}
      <div className="h-8 flex-none flex items-center justify-between border-b border-[#26262C] bg-[#09090B]/90 px-3">
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-geist-mono uppercase tracking-wider text-[#9A9AA5] font-semibold">
            {label}
          </span>
          <span className="text-[10px] font-geist-mono px-2 py-0.5 rounded-full bg-white/[0.04] border border-[#26262C] text-[#F4F4F5] font-medium">
            {formatLabel}
          </span>
        </div>
        <div className="flex items-center gap-1">
          {!readonly && (
            <ToolbarButton
              icon={<Trash2 className="w-3 h-3 text-[#9A9AA5]" strokeWidth={2} />}
              label="Clear"
              shortcut="⌫"
              onClick={handleClear}
              disabled={!value}
            />
          )}
          <ToolbarButton
            icon={<Copy className="w-3 h-3 text-[#9A9AA5]" strokeWidth={2} />}
            label="Copy"
            shortcut="⌘C"
            onClick={handleCopy}
            disabled={!value}
          />
          {readonly && (
            <>
              <ToolbarButton
                icon={<Download className="w-3 h-3 text-[#9A9AA5]" strokeWidth={2} />}
                label="Download"
                shortcut="⌘S"
                onClick={handleDownload}
                disabled={!value}
              />
              <ToolbarButton
                icon={<Archive className="w-3 h-3 text-[#9A9AA5]" strokeWidth={2} />}
                label={isCompressing ? 'Compressing…' : '.GZ'}
                shortcut="GZ"
                onClick={handleGzipDownload}
                disabled={!value || isCompressing}
              />
            </>
          )}
        </div>
      </div>

      {/* ── Editor area with gutter ───────────────────────────────────── */}
      <div className="flex-1 relative overflow-hidden bg-[#09090B]">
        {/* Line gutter */}
        <div
          className="absolute top-0 left-0 bottom-0 bg-[#09090B] border-r border-[#26262C] select-none pointer-events-none z-10 overflow-hidden"
          style={{ width: gutterWidth }}
        >
          <div className="pt-2 px-1">
            {Array.from({ length: lines }, (_, i) => (
              <div
                key={i}
                className="text-[11px] font-geist-mono text-[#9A9AA5]/40 text-right pr-2 select-none"
                style={{ height: lineHeightPx, lineHeight: `${lineHeightPx}px` }}
              >
                {i + 1}
              </div>
            ))}
          </div>
        </div>

        {/* Text area / display */}
        {readonly ? (
          <pre
            className={cn(
              'h-full overflow-auto p-2 font-geist-mono text-[#F4F4F5]',
              wordWrap ? 'whitespace-pre-wrap break-words' : 'whitespace-pre',
            )}
            style={{
              paddingLeft: gutterWidth + 10,
              fontSize: `${fontSize}px`,
              lineHeight: `${lineHeightPx}px`,
            }}
          >
            {value || (
              <span className="text-[#9A9AA5]/40 italic">Output will appear here…</span>
            )}
          </pre>
        ) : (
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => onChange?.(e.target.value)}
            spellCheck={false}
            autoComplete="off"
            autoCorrect="off"
            className={cn(
              'absolute inset-0 w-full h-full resize-none bg-transparent p-2 font-geist-mono text-[#F4F4F5]',
              'placeholder:text-[#9A9AA5]/30 focus:outline-none caret-[#FF4F00]',
              wordWrap ? 'whitespace-pre-wrap break-words' : 'whitespace-pre',
            )}
            style={{
              paddingLeft: gutterWidth + 10,
              fontSize: `${fontSize}px`,
              lineHeight: `${lineHeightPx}px`,
            }}
            placeholder="Paste or type data here, or load a file…"
          />
        )}
      </div>
    </div>
  );
};

// ── Toolbar button ───────────────────────────────────────────────────────────

interface ToolbarButtonProps {
  icon: React.ReactNode;
  label: string;
  shortcut?: string;
  onClick: () => void;
  disabled?: boolean;
  active?: boolean;
}

const ToolbarButton: React.FC<ToolbarButtonProps> = ({
  icon,
  label,
  shortcut,
  onClick,
  disabled = false,
  active = false,
}) => (
  <button
    onClick={onClick}
    disabled={disabled}
    title={`${label}${shortcut ? ` (${shortcut})` : ''}`}
    className={cn(
      'h-6 px-2 flex items-center gap-1.5 text-xs font-geist rounded-md transition-colors',
      'focus:outline-none',
      disabled
        ? 'text-[#9A9AA5]/30 cursor-not-allowed'
        : active
          ? 'text-[#FF4F00] bg-[#FF4F00]/10 border border-[#FF4F00]/30'
          : 'text-[#9A9AA5] hover:text-[#F4F4F5] hover:bg-white/[0.06]',
    )}
  >
    {icon}
    <span className="hidden sm:inline">{label}</span>
    {shortcut && (
      <kbd className="text-[10px] font-geist-mono text-[#9A9AA5]/60 hidden lg:inline">
        [{shortcut}]
      </kbd>
    )}
  </button>
);

// ── Split Workspace ──────────────────────────────────────────────────────────

export const SplitWorkspace: React.FC = () => {
  const inputValue = useAppStore((s) => s.inputValue);
  const outputValue = useAppStore((s) => s.outputValue);
  const inputFormat = useAppStore((s) => s.inputFormat);
  const outputFormat = useAppStore((s) => s.outputFormat);
  const inputLines = useAppStore((s) => s.inputLines);
  const outputLines = useAppStore((s) => s.outputLines);
  const error = useAppStore((s) => s.error);
  const isPreviewMode = useAppStore((s) => s.isPreviewMode);
  const setInputValue = useAppStore((s) => s.setInputValue);

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-[#09090B]">
      {/* ── Error Banner ────────────────────────────────────────────────── */}
      {error && (
        <div className="flex-none flex items-center gap-2.5 px-4 py-2 mx-3 my-2 bg-red-500/10 border border-red-500/30 rounded-xl shadow-lg">
          <AlertTriangle className="w-4 h-4 text-red-400 flex-none" strokeWidth={2} />
          <span className="text-xs text-red-300 font-geist truncate">
            {error.line !== null && (
              <span className="text-red-400 font-geist-mono font-semibold">Line {error.line}: </span>
            )}
            {error.message}
          </span>
        </div>
      )}

      {/* ── Split Panels ────────────────────────────────────────────────── */}
      <div className="flex-1 flex min-h-0">
        <CodePanel
          value={inputValue}
          onChange={setInputValue}
          lineCount={inputLines}
          label="Input"
          formatLabel={FORMAT_LABELS[inputFormat]}
        />
        <div className="w-px bg-[#26262C] flex-none" />
        <div className="flex-1 flex flex-col min-w-0 h-full">
          <CodePanel
            value={outputValue}
            readonly
            lineCount={outputLines}
            label="Output"
            formatLabel={FORMAT_LABELS[outputFormat]}
          />
          {isPreviewMode && <ProPaywall />}
        </div>
      </div>
    </div>
  );
};
