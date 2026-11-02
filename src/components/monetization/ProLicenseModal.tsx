import React, { useState, useCallback, useMemo } from 'react';
import {
  X,
  Check,
  Zap,
  ExternalLink,
  Loader2,
  RotateCcw,
  CheckCircle2,
} from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { activateLicense, clearLicenseFromStorage } from '@/services/licenseService';
import { verifyLicenseKey, getTierLabel, getTierSeats } from '@/services/licenseVerification';
import { buildCheckoutUrl, PRICING_PLANS } from '@/services/checkoutService';
import type { LicenseTier } from '@/types';
import { cn } from '@/lib/utils';
import { FormatPulseLogo } from '@/components/brand/FormatPulseLogo';

// ── Feature Comparison Data ──────────────────────────────────────────────────

const FEATURES = [
  { label: 'JSON ⇄ CSV ⇄ YAML Conversion', free: true, pro: true, team: true, ent: true },
  { label: 'Max File Size Processing', free: '1 MB', pro: 'Unlimited', team: 'Unlimited', ent: 'Unlimited' },
  { label: 'AST Code Generators (TS, Zod, SQL)', free: false, pro: true, team: true, ent: true },
  { label: 'Extended PII & Cloud Secrets Masking', free: false, pro: true, team: true, ent: true },
  { label: 'Non-blocking Web Worker (>10MB)', free: false, pro: true, team: true, ent: true },
  { label: 'Structural Diff & Breaking Alerts', free: false, pro: true, team: true, ent: true },
  { label: 'Developer Seats Included', free: '1 User', pro: '1 Seat', team: '5 Seats', ent: 'Unlimited' },
  { label: 'Air-Gapped Intranet Deployment', free: false, pro: false, team: false, ent: true },
  { label: 'Zero-Network Client-Side Isolation', free: true, pro: true, team: true, ent: true },
] as const;

export const ProLicenseModal: React.FC = () => {
  const showLicenseModal = useAppStore((s) => s.showLicenseModal);
  const setShowLicenseModal = useAppStore((s) => s.setShowLicenseModal);
  const setShowLegalModal = useAppStore((s) => s.setShowLegalModal);
  const licenseTier = useAppStore((s) => s.licenseTier);
  const licenseKey = useAppStore((s) => s.licenseKey);
  const setLicenseKey = useAppStore((s) => s.setLicenseKey);
  const setLicenseTier = useAppStore((s) => s.setLicenseTier);
  const unlockFullOutput = useAppStore((s) => s.unlockFullOutput);

  const [selectedPlanTab, setSelectedPlanTab] = useState<'individual' | 'team' | 'enterprise'>('individual');
  const [keyInput, setKeyInput] = useState('');
  const [isValidating, setIsValidating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activatedTier, setActivatedTier] = useState<LicenseTier | null>(null);

  // Real-time detection of tier as user types
  const detectedTier = useMemo(() => {
    if (!keyInput.trim()) return null;
    const testResult = verifyLicenseKey(keyInput);
    return testResult.valid ? testResult : null;
  }, [keyInput]);

  const handleActivate = useCallback(async () => {
    if (!keyInput.trim()) {
      setError('Please enter a license key');
      return;
    }

    setIsValidating(true);
    setError(null);

    const result = await activateLicense(keyInput);

    setIsValidating(false);

    if (result.valid) {
      const activeKey = keyInput.trim().toUpperCase();
      setLicenseKey(activeKey);
      setLicenseTier(result.tier);
      setActivatedTier(result.tier);
      unlockFullOutput();

      setTimeout(() => {
        setShowLicenseModal(false);
        setActivatedTier(null);
        setKeyInput('');
      }, 1600);
    } else {
      setError(result.error ?? 'Invalid license key');
    }
  }, [keyInput, setLicenseKey, setLicenseTier, unlockFullOutput, setShowLicenseModal]);

  const handleDeactivate = useCallback(() => {
    clearLicenseFromStorage();
    setLicenseKey(null);
    setLicenseTier('free');
  }, [setLicenseKey, setLicenseTier]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter') {
        void handleActivate();
      }
      if (e.key === 'Escape') {
        setShowLicenseModal(false);
      }
    },
    [handleActivate, setShowLicenseModal],
  );

  if (!showLicenseModal) return null;

  const isAlreadyActive = licenseTier !== 'free';

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-label="FormatPulse License Manager"
    >
      {/* ── Backdrop ────────────────────────────────────────────────── */}
      <div
        className="fixed inset-0 bg-zinc-950/85 backdrop-blur-sm transition-opacity"
        onClick={() => setShowLicenseModal(false)}
      />

      {/* ── Modal Window ────────────────────────────────────────────── */}
      <div className="relative w-full max-w-lg bg-zinc-900 border border-zinc-800 shadow-2xl rounded-xs overflow-hidden my-auto">
        {/* Header */}
        <div className="flex items-center justify-between h-10 px-4 border-b border-zinc-800 bg-zinc-950">
          <div className="flex items-center gap-2">
            <FormatPulseLogo size={16} animate={false} />
            <span className="text-xs font-semibold text-zinc-200 tracking-tight">
              FormatPulse License Engine
            </span>
            <span className="text-2xs font-mono px-1.5 py-0.5 rounded-xs bg-zinc-800 text-zinc-400">
              OFFLINE PROTOCOL
            </span>
          </div>
          <button
            onClick={() => setShowLicenseModal(false)}
            className="w-6 h-6 flex items-center justify-center text-zinc-500 hover:text-zinc-200 hover:bg-zinc-800 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent rounded-xs"
            aria-label="Close"
          >
            <X className="w-4 h-4" strokeWidth={2} />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 space-y-5">
          {/* ── ACTIVE LICENSE VIEW ────────────────────────────────────── */}
          {isAlreadyActive ? (
            <div className="space-y-4">
              <div className="p-4 bg-zinc-950 border border-emerald-900/60 rounded-xs space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span className="text-xs font-semibold text-emerald-300">
                      {getTierLabel(licenseTier)} Active
                    </span>
                  </div>
                  <span className="text-2xs font-mono font-medium px-2 py-0.5 rounded-xs bg-emerald-950 border border-emerald-800 text-emerald-400">
                    {getTierSeats(licenseTier)} {getTierSeats(licenseTier) === 1 ? 'SEAT' : 'SEATS'}
                  </span>
                </div>

                <div className="space-y-1 font-mono text-2xs text-zinc-400 pt-1 border-t border-zinc-800/80">
                  <div className="flex justify-between">
                    <span className="text-zinc-500">License Key:</span>
                    <span className="text-zinc-300">
                      {licenseKey ? `${licenseKey.slice(0, 10)}••••••••` : 'Local Key'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Cryptographic Status:</span>
                    <span className="text-emerald-400">Air-Gapped Offline Verified</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Processing Limit:</span>
                    <span className="text-zinc-300">Unlimited (No Size Cap)</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={handleDeactivate}
                  className="flex items-center gap-1.5 text-2xs font-mono text-red-400 hover:text-red-300 transition-colors focus:outline-none"
                >
                  <RotateCcw className="w-3 h-3" />
                  Deactivate / Switch License Key
                </button>
                <button
                  type="button"
                  onClick={() => setShowLicenseModal(false)}
                  className="h-8 px-4 text-xs font-semibold bg-zinc-800 hover:bg-zinc-700 text-zinc-100 transition-colors rounded-xs"
                >
                  Close Manager
                </button>
              </div>
            </div>
          ) : (
            /* ── FREE / ACTIVATION VIEW ──────────────────────────────── */
            <div className="space-y-4">
              {/* Plan Selection Tabs */}
              <div className="grid grid-cols-3 gap-1 p-1 bg-zinc-950 border border-zinc-800 rounded-xs">
                <button
                  type="button"
                  onClick={() => setSelectedPlanTab('individual')}
                  className={cn(
                    'flex flex-col items-center py-2 px-1 text-center transition-colors rounded-xs',
                    selectedPlanTab === 'individual'
                      ? 'bg-zinc-800 text-white shadow-sm'
                      : 'text-zinc-400 hover:text-zinc-200',
                  )}
                >
                  <span className="text-2xs font-mono uppercase tracking-wider text-accent font-semibold">Pro Lifetime</span>
                  <span className="text-xs font-bold font-mono">$14 USD</span>
                  <span className="text-3xs text-zinc-500">1 Developer</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedPlanTab('team')}
                  className={cn(
                    'flex flex-col items-center py-2 px-1 text-center transition-colors rounded-xs',
                    selectedPlanTab === 'team'
                      ? 'bg-zinc-800 text-white shadow-sm'
                      : 'text-zinc-400 hover:text-zinc-200',
                  )}
                >
                  <span className="text-2xs font-mono uppercase tracking-wider text-emerald-400 font-semibold">Team Pack</span>
                  <span className="text-xs font-bold font-mono">$79 USD</span>
                  <span className="text-3xs text-zinc-500">5 Seats</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedPlanTab('enterprise')}
                  className={cn(
                    'flex flex-col items-center py-2 px-1 text-center transition-colors rounded-xs',
                    selectedPlanTab === 'enterprise'
                      ? 'bg-zinc-800 text-white shadow-sm'
                      : 'text-zinc-400 hover:text-zinc-200',
                  )}
                >
                  <span className="text-2xs font-mono uppercase tracking-wider text-cyan-400 font-semibold">Enterprise</span>
                  <span className="text-xs font-bold font-mono">$199 USD</span>
                  <span className="text-3xs text-zinc-500">Air-Gapped Intranet</span>
                </button>
              </div>

              {/* Feature Matrix Mini */}
              <div className="border border-zinc-800 divide-y divide-zinc-800/80 bg-zinc-950/60 rounded-xs">
                <div className="grid grid-cols-[1fr_50px_70px] h-6 items-center px-3 bg-zinc-800/40 text-2xs font-mono text-zinc-500 uppercase">
                  <span>Capability</span>
                  <span className="text-center">Free</span>
                  <span className="text-center text-accent">Active Plan</span>
                </div>
                {FEATURES.slice(0, 5).map((f) => (
                  <div key={f.label} className="grid grid-cols-[1fr_50px_70px] h-6 items-center px-3 text-2xs">
                    <span className="text-zinc-400 truncate">{f.label}</span>
                    <span className="text-center font-mono text-zinc-600">
                      {typeof f.free === 'string' ? f.free : f.free ? '✓' : '—'}
                    </span>
                    <span className="text-center font-mono text-emerald-400 font-medium">
                      {selectedPlanTab === 'individual'
                        ? typeof f.pro === 'string'
                          ? f.pro
                          : '✓'
                        : selectedPlanTab === 'team'
                          ? typeof f.team === 'string'
                            ? f.team
                            : '✓'
                          : typeof f.ent === 'string'
                            ? f.ent
                            : '✓'}
                    </span>
                  </div>
                ))}
              </div>

              {/* Checkout CTA */}
              <div className="space-y-2">
                <a
                  href={buildCheckoutUrl(selectedPlanTab)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    'flex items-center justify-center gap-2 h-9 w-full text-white text-xs font-semibold tracking-tight transition-all rounded-xs shadow-md',
                    selectedPlanTab === 'enterprise'
                      ? 'bg-cyan-600 hover:bg-cyan-500'
                      : selectedPlanTab === 'team'
                        ? 'bg-emerald-600 hover:bg-emerald-500'
                        : 'bg-accent hover:bg-accent-hover',
                  )}
                >
                  <Zap className="w-3.5 h-3.5" strokeWidth={2.5} />
                  <span>
                    Buy {PRICING_PLANS[selectedPlanTab].name} — ${PRICING_PLANS[selectedPlanTab].priceUSD} USD Lifetime
                  </span>
                  <ExternalLink className="w-3 h-3 opacity-70" strokeWidth={2} />
                </a>

                <div className="flex items-center justify-between text-3xs font-mono text-zinc-500 px-1">
                  <span>One-time purchase · 0% subscription</span>
                  <span>14-day money-back guarantee</span>
                </div>
              </div>

              {/* ── Key Input Section ─────────────────────────────────── */}
              <div className="pt-2 border-t border-zinc-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-2xs font-mono text-zinc-400 uppercase tracking-wider">
                    Enter License Key
                  </span>
                  {detectedTier && (
                    <span className="text-3xs font-mono text-emerald-400 flex items-center gap-1">
                      <Check className="w-3 h-3" />
                      Detected: {detectedTier.tierLabel}
                    </span>
                  )}
                </div>

                <div className="flex gap-2">
                  <input
                    type="text"
                    value={keyInput}
                    onChange={(e) => {
                      setKeyInput(e.target.value.toUpperCase());
                      setError(null);
                    }}
                    onKeyDown={handleKeyDown}
                    placeholder="FP-PRO-2026-XXXX-XXXX"
                    spellCheck={false}
                    autoComplete="off"
                    disabled={isValidating || activatedTier !== null}
                    className={cn(
                      'flex-1 h-8 px-2.5 bg-zinc-950 border text-xs font-mono text-zinc-200 tracking-wider placeholder:text-zinc-700 rounded-xs',
                      'focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent',
                      'disabled:opacity-50 disabled:cursor-not-allowed',
                      error
                        ? 'border-red-800 focus:ring-red-500'
                        : activatedTier
                          ? 'border-emerald-800'
                          : 'border-zinc-800',
                    )}
                  />
                  <button
                    onClick={() => void handleActivate()}
                    disabled={isValidating || activatedTier !== null || !keyInput.trim()}
                    className={cn(
                      'h-8 px-3 text-xs font-semibold tracking-tight transition-colors rounded-xs',
                      'focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent',
                      'disabled:opacity-50 disabled:cursor-not-allowed',
                      activatedTier
                        ? 'bg-emerald-900/50 text-emerald-400 border border-emerald-800'
                        : 'bg-zinc-800 text-zinc-200 border border-zinc-700 hover:bg-zinc-700',
                    )}
                  >
                    {isValidating ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" strokeWidth={2} />
                    ) : activatedTier ? (
                      <span className="flex items-center gap-1">
                        <Check className="w-3 h-3" strokeWidth={2.5} />
                        Activated
                      </span>
                    ) : (
                      'Activate'
                    )}
                  </button>
                </div>

                {error && <p className="text-2xs text-red-400 font-mono">{error}</p>}
              </div>

              {/* Legal Links */}
              <div className="flex justify-center gap-3 text-3xs text-zinc-500 pt-1">
                <button
                  type="button"
                  onClick={() => {
                    setShowLicenseModal(false);
                    setShowLegalModal(true);
                  }}
                  className="hover:text-zinc-300 underline underline-offset-2 transition-colors"
                >
                  Terms of Service & EULA
                </button>
                <span>·</span>
                <button
                  type="button"
                  onClick={() => {
                    setShowLicenseModal(false);
                    setShowLegalModal(true);
                  }}
                  className="hover:text-zinc-300 underline underline-offset-2 transition-colors"
                >
                  Zero-Data Privacy Policy
                </button>
                <span>·</span>
                <button
                  type="button"
                  onClick={() => {
                    setShowLicenseModal(false);
                    setShowLegalModal(true);
                  }}
                  className="hover:text-zinc-300 underline underline-offset-2 transition-colors"
                >
                  Enterprise DPA
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
