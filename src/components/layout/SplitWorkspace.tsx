import React, { useCallback, useRef, useState } from 'react';
import { Copy, Download, Trash2, AlertTriangle, Archive } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
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
    // Feedback is handled at store level for the output panel
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

  // Generate line numbers
  const lines = Math.max(lineCount, 1);
  const gutterWidth = String(lines).length * 8 + 24;

  return (
    <div className="flex-1 flex flex-col min-w-0 h-full">
      {/* ── Panel toolbar ─────────────────────────────────────────────── */}
      <div className="h-7 flex-none flex items-center justify-between border-b border-zinc-800 bg-surface-raised px-2">
        <div className="flex items-center gap-2">
          <span className="text-2xs uppercase tracking-widest text-zinc-500 font-medium">
            {label}
          </span>
          <span className="text-2xs font-mono text-zinc-600">
            {formatLabel}
          </span>
        </div>
        <div className="flex items-center">
          {!readonly && (
            <ToolbarButton
              icon={<Trash2 className="w-3 h-3" strokeWidth={2} />}
              label="Clear"
              shortcut="⌫"
              onClick={handleClear}
              disabled={!value}
            />
          )}
          <ToolbarButton
            icon={<Copy className="w-3 h-3" strokeWidth={2} />}
            label="Copy"
            shortcut="⌘C"
            onClick={handleCopy}
            disabled={!value}
          />
          {readonly && (
            <>
              <ToolbarButton
                icon={<Download className="w-3 h-3" strokeWidth={2} />}
                label="Download"
                shortcut="⌘S"
                onClick={handleDownload}
                disabled={!value}
              />
              <ToolbarButton
                icon={<Archive className="w-3 h-3" strokeWidth={2} />}
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
      <div className="flex-1 relative overflow-hidden">
        {/* Line gutter */}
        <div
          className="absolute top-0 left-0 bottom-0 bg-surface-base border-r border-zinc-800/50 select-none pointer-events-none z-10 overflow-hidden"
          style={{ width: gutterWidth }}
        >
          <div className="pt-2 px-1">
            {Array.from({ length: lines }, (_, i) => (
              <div
                key={i}
                className="text-2xs font-mono text-zinc-700 text-right pr-2 leading-[18px]"
              >
                {i + 1}
              </div>
            ))}
          </div>
        </div>

        {/* Text area / display */}
        {readonly ? (
          <pre
            className="h-full overflow-auto p-2 text-xs font-mono leading-[18px] text-zinc-300 whitespace-pre"
            style={{ paddingLeft: gutterWidth + 8 }}
          >
            {value || (
              <span className="text-zinc-600 italic">Output will appear here…</span>
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
              'absolute inset-0 w-full h-full resize-none bg-transparent p-2 text-xs font-mono leading-[18px] text-zinc-200',
              'placeholder:text-zinc-700 focus:outline-none caret-accent',
            )}
            style={{ paddingLeft: gutterWidth + 8 }}
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
      'h-5 px-1.5 flex items-center gap-1 text-2xs font-medium transition-colors rounded-sm',
      'focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent',
      disabled
        ? 'text-zinc-700 cursor-not-allowed'
        : active
          ? 'text-accent bg-accent-muted'
          : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/80',
    )}
  >
    {icon}
    <span className="hidden sm:inline">{label}</span>
    {shortcut && (
      <kbd className="text-2xs font-mono text-zinc-600 hidden lg:inline">
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
    <div className="flex-1 flex flex-col min-h-0">
      {/* ── Error Banner ────────────────────────────────────────────────── */}
      {error && (
        <div className="flex-none flex items-center gap-2 px-3 py-1.5 bg-red-950/40 border-b border-red-900/50">
          <AlertTriangle className="w-3.5 h-3.5 text-red-400 flex-none" strokeWidth={2} />
          <span className="text-xs text-red-300 font-mono truncate">
            {error.line !== null && (
              <span className="text-red-500">Line {error.line}: </span>
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
        <div className="w-px bg-zinc-800 flex-none" />
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
