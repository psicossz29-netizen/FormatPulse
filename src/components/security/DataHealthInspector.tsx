import React, { useMemo } from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  X,
  Sparkles,
  Lock,
  Layers,
  FileCheck,
} from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { parseInput } from '@/core/converters';
import { inspectDataHealth } from '@/core/security/extendedPII';
import { cn } from '@/lib/utils';

export const DataHealthInspector: React.FC<{
  isOpen: boolean;
  onClose: () => void;
}> = ({ isOpen, onClose }) => {
  const inputValue = useAppStore((s) => s.inputValue);
  const inputFormat = useAppStore((s) => s.inputFormat);
  const setOutputFormat = useAppStore((s) => s.setOutputFormat);

  // Compute live data health report
  const report = useMemo(() => {
    if (!inputValue.trim()) return null;
    try {
      const parsed = parseInput(inputValue, inputFormat);
      return inspectDataHealth(parsed);
    } catch {
      return null;
    }
  }, [inputValue, inputFormat]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-y-0 right-0 z-40 w-full sm:w-96 bg-zinc-900 border-l border-zinc-800 shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-right duration-200"
      role="region"
      aria-label="Data Health & Security Inspector"
    >
      {/* ── Header ──────────────────────────────────────────────────────── */}
      <div className="h-10 px-3.5 flex items-center justify-between border-b border-zinc-800 bg-surface-raised flex-none">
        <div className="flex items-center gap-2">
          {report && report.overallScore < 70 ? (
            <ShieldAlert className="w-4 h-4 text-red-400" />
          ) : report && report.overallScore < 90 ? (
            <AlertTriangle className="w-4 h-4 text-amber-400" />
          ) : (
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
          )}
          <span className="text-xs font-semibold text-zinc-100 font-mono tracking-tight">
            DATA HEALTH & SECURITY AUDIT
          </span>
        </div>
        <button
          onClick={onClose}
          className="w-6 h-6 flex items-center justify-center text-zinc-500 hover:text-zinc-200 hover:bg-zinc-800 transition-colors rounded-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent"
          aria-label="Close inspector"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* ── Content ─────────────────────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs font-sans">
        {!report ? (
          <div className="py-12 text-center text-zinc-500 space-y-2">
            <Layers className="w-8 h-8 mx-auto text-zinc-700" />
            <p className="font-mono text-2xs">NO VALID INPUT DATA TO AUDIT</p>
            <p className="text-zinc-600 text-2xs">
              Paste JSON, CSV, or YAML into the editor to generate real-time security and health metrics.
            </p>
          </div>
        ) : (
          <>
            {/* Score Banner */}
            <div className="p-3.5 bg-zinc-950 border border-zinc-800 rounded-sm space-y-2.5">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xs font-mono text-zinc-500 uppercase tracking-widest">
                    Security Score
                  </div>
                  <div className="text-xl font-bold font-mono tracking-tight text-zinc-100 flex items-center gap-2">
                    <span>{report.overallScore}</span>
                    <span className="text-xs text-zinc-600 font-normal">/ 100</span>
                  </div>
                </div>
                <div
                  className={cn(
                    'px-2.5 py-1 text-xs font-mono font-bold rounded-sm border',
                    report.securityGrade === 'A+' || report.securityGrade === 'A'
                      ? 'bg-emerald-950/60 text-emerald-400 border-emerald-800'
                      : report.securityGrade === 'B'
                        ? 'bg-amber-950/60 text-amber-400 border-amber-800'
                        : 'bg-red-950/60 text-red-400 border-red-800',
                  )}
                >
                  GRADE {report.securityGrade}
                </div>
              </div>

              {/* Progress bar */}
              <div className="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden">
                <div
                  className={cn(
                    'h-full transition-all duration-300',
                    report.overallScore >= 85
                      ? 'bg-emerald-500'
                      : report.overallScore >= 70
                        ? 'bg-amber-500'
                        : 'bg-red-500',
                  )}
                  style={{ width: `${report.overallScore}%` }}
                />
              </div>

              {/* Quick stats pills */}
              <div className="grid grid-cols-3 gap-2 pt-1 text-center font-mono text-2xs">
                <div className="p-1.5 bg-zinc-900 border border-zinc-800/80 rounded-sm">
                  <div className="text-zinc-500">Secrets</div>
                  <div
                    className={cn(
                      'font-bold mt-0.5',
                      report.criticalSecretsCount > 0 ? 'text-red-400' : 'text-zinc-300',
                    )}
                  >
                    {report.criticalSecretsCount}
                  </div>
                </div>
                <div className="p-1.5 bg-zinc-900 border border-zinc-800/80 rounded-sm">
                  <div className="text-zinc-500">PII Leaks</div>
                  <div
                    className={cn(
                      'font-bold mt-0.5',
                      report.piiCount > 0 ? 'text-amber-400' : 'text-zinc-300',
                    )}
                  >
                    {report.piiCount}
                  </div>
                </div>
                <div className="p-1.5 bg-zinc-900 border border-zinc-800/80 rounded-sm">
                  <div className="text-zinc-500">Nulls</div>
                  <div className="font-bold text-zinc-300 mt-0.5">
                    {report.dataHygiene.nullFields}
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Action: Sanitize If Threats Exist */}
            {report.totalThreats > 0 && (
              <button
                onClick={() => {
                  setOutputFormat('pii-sanitizer');
                  onClose();
                }}
                className="w-full h-8 px-3 bg-accent hover:bg-accent-hover text-white text-xs font-semibold tracking-tight rounded-sm transition-colors flex items-center justify-center gap-1.5 shadow-sm"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Sanitize {report.totalThreats} Threat(s) Now</span>
              </button>
            )}

            {/* Detected Threats Breakdown */}
            <div className="space-y-2">
              <div className="text-2xs font-mono uppercase tracking-widest text-zinc-500 font-medium">
                Detected Risks & Exposure
              </div>

              {report.threats.length === 0 ? (
                <div className="p-3 bg-zinc-950 border border-zinc-800/80 rounded-sm flex items-center gap-2 text-emerald-400 text-2xs">
                  <FileCheck className="w-4 h-4 flex-none" />
                  <span>No secrets or unredacted credentials detected.</span>
                </div>
              ) : (
                <div className="space-y-1.5">
                  {report.threats.map((threat) => (
                    <div
                      key={threat.id}
                      className="p-2.5 bg-zinc-950 border border-zinc-800 rounded-sm flex items-start justify-between gap-2"
                    >
                      <div className="space-y-0.5">
                        <div className="font-medium text-zinc-200 flex items-center gap-1.5">
                          <span
                            className={cn(
                              'w-1.5 h-1.5 rounded-full flex-none',
                              threat.severity === 'critical'
                                ? 'bg-red-500'
                                : 'bg-amber-500',
                            )}
                          />
                          <span>{threat.title}</span>
                        </div>
                        <div className="text-2xs font-mono text-zinc-500">
                          Placeholder: {threat.samplePlaceholder}
                        </div>
                      </div>
                      <div className="font-mono text-2xs font-bold px-1.5 py-0.5 bg-zinc-800 text-zinc-300 rounded">
                        ×{threat.count}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Data Hygiene Breakdown */}
            <div className="space-y-2">
              <div className="text-2xs font-mono uppercase tracking-widest text-zinc-500 font-medium">
                Structure & Hygiene
              </div>
              <div className="p-3 bg-zinc-950 border border-zinc-800 rounded-sm font-mono text-2xs space-y-1 text-zinc-400">
                <div className="flex justify-between">
                  <span>Total Fields Scanned:</span>
                  <span className="text-zinc-200">{report.dataHygiene.totalFieldsScanned}</span>
                </div>
                <div className="flex justify-between">
                  <span>Null / Undefined Values:</span>
                  <span className="text-zinc-200">{report.dataHygiene.nullFields}</span>
                </div>
                <div className="flex justify-between">
                  <span>Empty Strings (""):</span>
                  <span className="text-zinc-200">{report.dataHygiene.emptyStrings}</span>
                </div>
              </div>
            </div>

            {/* Recommendations */}
            <div className="space-y-2">
              <div className="text-2xs font-mono uppercase tracking-widest text-zinc-500 font-medium">
                Compliance Recommendations
              </div>
              <div className="space-y-1.5">
                {report.recommendations.map((rec, i) => (
                  <div
                    key={i}
                    className="p-2 bg-zinc-950/80 border border-zinc-800/80 text-2xs text-zinc-400 rounded-sm flex items-start gap-2"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-accent flex-none mt-0.5" />
                    <span>{rec}</span>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>

      {/* ── Footer ──────────────────────────────────────────────────────── */}
      <div className="h-8 px-3 border-t border-zinc-800 bg-surface-raised flex items-center justify-between text-2xs font-mono text-zinc-500 flex-none">
        <span>Zero-Telemetry Local Audit</span>
        <span>GDPR / CCPA Safe</span>
      </div>
    </div>
  );
};
