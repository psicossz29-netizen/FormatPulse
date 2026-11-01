import React, { useState, useMemo, useCallback } from 'react';
import { X, GitCompare, Copy, Check, AlertOctagon } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { parseInput } from '@/core/converters';
import { createDiffReport } from '@/core/diff/diffEngine';
import { cn } from '@/lib/utils';

export const DiffViewerModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
}> = ({ isOpen, onClose }) => {
  const inputValue = useAppStore((s) => s.inputValue);
  const outputValue = useAppStore((s) => s.outputValue);
  const inputFormat = useAppStore((s) => s.inputFormat);

  const [compareTarget, setCompareTarget] = useState<'output' | 'custom'>('output');
  const [customText, setCustomText] = useState('');
  const [copied, setCopied] = useState(false);

  // Compute diff
  const diffReport = useMemo(() => {
    if (!inputValue.trim()) return null;

    try {
      const origObj = parseInput(inputValue, inputFormat);
      let targetObj: unknown;

      if (compareTarget === 'output') {
        if (!outputValue.trim()) return null;
        try {
          targetObj = JSON.parse(outputValue);
        } catch {
          // If output is not JSON (e.g. YAML or plain text), fallback to raw comparison
          targetObj = outputValue;
        }
      } else {
        if (!customText.trim()) return null;
        targetObj = JSON.parse(customText);
      }

      return createDiffReport(origObj, targetObj);
    } catch {
      return null;
    }
  }, [inputValue, inputFormat, compareTarget, outputValue, customText]);

  const handleCopy = useCallback(() => {
    if (!diffReport) return;
    void navigator.clipboard.writeText(diffReport.unifiedText);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }, [diffReport]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-sm select-none"
      role="dialog"
      aria-modal="true"
      aria-label="Structural Diff Viewer"
    >
      <div className="relative w-full max-w-4xl max-h-[85vh] bg-zinc-900 border border-zinc-800 shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="h-10 px-4 border-b border-zinc-800 bg-surface-raised flex items-center justify-between flex-none">
          <div className="flex items-center gap-2">
            <GitCompare className="w-4 h-4 text-accent" />
            <span className="text-xs font-semibold text-zinc-100 font-mono tracking-tight">
              STRUCTURAL SCHEMA & PAYLOAD DIFF
            </span>
          </div>
          <button
            onClick={onClose}
            className="w-6 h-6 flex items-center justify-center text-zinc-500 hover:text-zinc-200 hover:bg-zinc-800 transition-colors rounded-sm"
            aria-label="Close diff modal"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Target Selector Toolbar */}
        <div className="h-9 px-4 border-b border-zinc-800 bg-zinc-900/60 flex items-center justify-between text-xs flex-none">
          <div className="flex items-center gap-2">
            <span className="text-2xs font-mono text-zinc-500 uppercase">Compare Against:</span>
            <button
              onClick={() => setCompareTarget('output')}
              className={cn(
                'px-2.5 py-1 text-2xs font-mono rounded transition-colors',
                compareTarget === 'output'
                  ? 'bg-zinc-800 text-zinc-100 font-semibold'
                  : 'text-zinc-500 hover:text-zinc-300',
              )}
            >
              Current Transformed Output
            </button>
            <button
              onClick={() => setCompareTarget('custom')}
              className={cn(
                'px-2.5 py-1 text-2xs font-mono rounded transition-colors',
                compareTarget === 'custom'
                  ? 'bg-zinc-800 text-zinc-100 font-semibold'
                  : 'text-zinc-500 hover:text-zinc-300',
              )}
            >
              Custom Comparison JSON
            </button>
          </div>

          {diffReport && (
            <button
              onClick={handleCopy}
              className="h-6 px-2 text-2xs font-mono text-zinc-400 hover:text-zinc-100 bg-zinc-800 hover:bg-zinc-700 rounded flex items-center gap-1.5 transition-colors"
            >
              {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              <span>{copied ? 'Copied' : 'Copy Diff'}</span>
            </button>
          )}
        </div>

        {/* Custom Input (if selected) */}
        {compareTarget === 'custom' && (
          <div className="p-3 border-b border-zinc-800 bg-zinc-950 flex-none">
            <textarea
              value={customText}
              onChange={(e) => setCustomText(e.target.value)}
              placeholder="Paste comparison JSON here..."
              rows={3}
              className="w-full bg-zinc-900 border border-zinc-800 text-2xs font-mono p-2 text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-accent resize-none rounded-sm"
              spellCheck={false}
            />
          </div>
        )}

        {/* Summary Bar */}
        {diffReport && (
          <div className="h-8 px-4 bg-zinc-950 border-b border-zinc-800 flex items-center gap-4 text-2xs font-mono flex-none">
            <span className="text-zinc-400">
              Total Changes: <strong className="text-zinc-100">{diffReport.summary.totalChanges}</strong>
            </span>
            <span className="text-emerald-400">
              +{diffReport.summary.addedCount} added
            </span>
            <span className="text-red-400">
              -{diffReport.summary.removedCount} removed
            </span>
            <span className="text-zinc-400">
              ~{diffReport.summary.modifiedCount} modified
            </span>
            {diffReport.summary.breakingChangesCount > 0 && (
              <span className="text-amber-400 flex items-center gap-1 font-semibold">
                <AlertOctagon className="w-3 h-3" />
                {diffReport.summary.breakingChangesCount} breaking change(s)
              </span>
            )}
          </div>
        )}

        {/* Diff Unified Code View */}
        <div className="flex-1 overflow-y-auto p-4 bg-surface-base font-mono text-2xs leading-relaxed select-text">
          {!diffReport ? (
            <div className="py-16 text-center text-zinc-600">
              Provide input data and target output to generate structural schema diff.
            </div>
          ) : (
            <pre className="whitespace-pre">
              {diffReport.unifiedText.split('\n').map((line, idx) => {
                let colorClass = 'text-zinc-400';
                if (line.startsWith('+')) colorClass = 'text-emerald-400 bg-emerald-950/20';
                else if (line.startsWith('-')) colorClass = 'text-red-400 bg-red-950/20';
                else if (line.startsWith('~')) colorClass = 'text-amber-400 bg-amber-950/20 font-bold';
                else if (line.startsWith('---') || line.startsWith('+++')) colorClass = 'text-zinc-500 font-bold';

                return (
                  <div key={idx} className={cn('px-1 rounded-xs', colorClass)}>
                    {line}
                  </div>
                );
              })}
            </pre>
          )}
        </div>

        {/* Footer */}
        <div className="h-8 px-4 border-t border-zinc-800 bg-surface-raised flex items-center justify-between text-2xs font-mono text-zinc-500 flex-none">
          <span>Deterministic AST Structural Comparison</span>
          <button
            onClick={onClose}
            className="px-2 py-0.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded text-2xs"
          >
            Close [ESC]
          </button>
        </div>
      </div>
    </div>
  );
};
