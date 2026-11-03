import React, { useState, useCallback, useMemo } from 'react';
import {
  X,
  Check,
  Zap,
  ExternalLink,
  Loader2,
  RotateCcw,
  CheckCircle2,
  Copy,
} from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { activateLicense, clearLicenseFromStorage } from '@/services/licenseService';
import { verifyLicenseKey, getTierLabel, getTierSeats } from '@/services/licenseVerification';
import { buildCheckoutUrl, PRICING_PLANS } from '@/services/checkoutService';
import { openExternalUrl } from '@/core/desktopBridge';
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
  { label: 'Air-Gapped Intranet Deployment', free: false, pro: false, team: false, ent: true },
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
  const [isOpeningCheckout, setIsOpeningCheckout] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activatedTier, setActivatedTier] = useState<LicenseTier | null>(null);

  const handleOpenCheckout = useCallback(async (tier: 'individual' | 'team' | 'enterprise') => {
    const url = buildCheckoutUrl(tier);
    setIsOpeningCheckout(true);
    try {
      await openExternalUrl(url);
    } finally {
      setTimeout(() => setIsOpeningCheckout(false), 1500);
    }
  }, []);

  const handleCopyLink = useCallback(async (tier: 'individual' | 'team' | 'enterprise') => {
    const url = buildCheckoutUrl(tier);
    try {
      if (typeof navigator !== 'undefined' && navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(url);
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = url;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 3000);
    } catch {
      // ignore
    }
  }, []);

  // Real-time detection of tier as user types
  const detectedTier = useMemo(() => {
    if (!keyInput.trim()) return null;
    const testResult = verifyLicenseKey(keyInput);
    return testResult.valid ? testResult : null;
  }, [keyInput]);

  const handleActivate = useCallback(async () => {
    if (!keyInput.trim()) {
      setError('Por favor introduce una clave de licencia');
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
      setError(result.error ?? 'Clave de licencia no válida');
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
        className="fixed inset-0 bg-[#09090B]/85 backdrop-blur-md transition-opacity"
        onClick={() => setShowLicenseModal(false)}
      />

      {/* ── Spaceship Modal Window ──────────────────────────────────── */}
      <div className="relative w-full max-w-xl bg-[#111114] border border-[#26262C] shadow-[0_32px_80px_rgba(0,0,0,0.85)] rounded-[28px] overflow-hidden my-auto animate-pop font-geist">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#26262C] bg-[#09090B]/60">
          <div className="flex items-center gap-2.5">
            <FormatPulseLogo size={22} animate={false} />
            <span className="font-display font-bold text-sm text-[#F4F4F5] tracking-tight">
              FormatPulse License Engine
            </span>
            <span className="text-[10px] font-geist-mono px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-medium flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              OFFLINE PROTOCOL
            </span>
          </div>
          <button
            onClick={() => setShowLicenseModal(false)}
            className="w-8 h-8 flex items-center justify-center text-[#9A9AA5] hover:text-[#F4F4F5] hover:bg-white/[0.06] transition-colors rounded-xl focus:outline-none"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6">
          {/* ── ACTIVE LICENSE VIEW ────────────────────────────────────── */}
          {isAlreadyActive ? (
            <div className="space-y-5">
              <div className="p-5 bg-[#09090B] border border-emerald-500/30 rounded-2xl space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-display font-bold text-sm text-[#F4F4F5]">
                        {getTierLabel(licenseTier)} Activa
                      </div>
                      <div className="text-xs text-[#9A9AA5]">Licencia perpetua verificada localmente</div>
                    </div>
                  </div>
                  <span className="text-xs font-geist-mono font-semibold px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                    {getTierSeats(licenseTier)} {getTierSeats(licenseTier) === 1 ? 'SEAT' : 'SEATS'}
                  </span>
                </div>

                <div className="space-y-2 font-geist-mono text-xs text-[#9A9AA5] pt-3 border-t border-[#26262C]">
                  <div className="flex justify-between">
                    <span>Clave activa:</span>
                    <span className="text-[#F4F4F5]">
                      {licenseKey ? `${licenseKey.slice(0, 10)}••••••••` : 'Clave Local'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Aislamiento:</span>
                    <span className="text-emerald-400">Air-Gapped Offline Verified</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Límite de procesamiento:</span>
                    <span className="text-[#F4F4F5]">Ilimitado (Sin tope de tamaño)</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <button
                  type="button"
                  onClick={handleDeactivate}
                  className="flex items-center gap-1.5 text-xs font-geist text-red-400 hover:text-red-300 transition-colors focus:outline-none"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Desactivar / Cambiar clave</span>
                </button>
                <button
                  type="button"
                  onClick={() => setShowLicenseModal(false)}
                  className="h-10 px-5 text-xs font-geist font-semibold bg-white/[0.06] hover:bg-white/[0.1] text-[#F4F4F5] border border-[#26262C] transition-colors rounded-xl"
                >
                  Cerrar
                </button>
              </div>
            </div>
          ) : (
            /* ── FREE / ACTIVATION VIEW ──────────────────────────────── */
            <div className="space-y-5">
              {/* Plan Selection Cards (Spaceship Rounded Aesthetic) */}
              <div className="grid grid-cols-3 gap-2.5">
                {/* Individual Pro */}
                <button
                  type="button"
                  onClick={() => {
                    if (selectedPlanTab === 'individual') {
                      void handleOpenCheckout('individual');
                    } else {
                      setSelectedPlanTab('individual');
                    }
                  }}
                  className={cn(
                    'group relative flex flex-col justify-between p-3.5 rounded-2xl border text-left transition-all cursor-pointer',
                    selectedPlanTab === 'individual'
                      ? 'bg-[#FF4F00]/10 border-[#FF4F00] shadow-[0_0_20px_rgba(255,79,0,0.25)]'
                      : 'bg-[#09090B] border-[#26262C] hover:border-white/20',
                  )}
                >
                  <div>
                    <div className="text-[10px] font-geist-mono uppercase tracking-wider text-[#FF4F00] font-bold">
                      Pro Lifetime
                    </div>
                    <div className="text-lg font-bold font-geist-mono text-[#F4F4F5] mt-1">
                      $14 USD
                    </div>
                    <div className="text-[11px] font-geist text-[#9A9AA5] mt-0.5">
                      1 Desarrollador
                    </div>
                  </div>
                  {selectedPlanTab === 'individual' && (
                    <div className="mt-2 text-[10px] font-geist font-semibold text-[#FF4F00] flex items-center gap-1">
                      <span>Seleccionado</span>
                      <span>→</span>
                    </div>
                  )}
                </button>

                {/* Team Pack */}
                <button
                  type="button"
                  onClick={() => {
                    if (selectedPlanTab === 'team') {
                      void handleOpenCheckout('team');
                    } else {
                      setSelectedPlanTab('team');
                    }
                  }}
                  className={cn(
                    'group relative flex flex-col justify-between p-3.5 rounded-2xl border text-left transition-all cursor-pointer',
                    selectedPlanTab === 'team'
                      ? 'bg-emerald-500/10 border-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.25)]'
                      : 'bg-[#09090B] border-[#26262C] hover:border-white/20',
                  )}
                >
                  <div>
                    <div className="text-[10px] font-geist-mono uppercase tracking-wider text-emerald-400 font-bold">
                      Team Pack
                    </div>
                    <div className="text-lg font-bold font-geist-mono text-[#F4F4F5] mt-1">
                      $79 USD
                    </div>
                    <div className="text-[11px] font-geist text-[#9A9AA5] mt-0.5">
                      5 Licencias
                    </div>
                  </div>
                  {selectedPlanTab === 'team' && (
                    <div className="mt-2 text-[10px] font-geist font-semibold text-emerald-400 flex items-center gap-1">
                      <span>Seleccionado</span>
                      <span>→</span>
                    </div>
                  )}
                </button>

                {/* Enterprise */}
                <button
                  type="button"
                  onClick={() => {
                    if (selectedPlanTab === 'enterprise') {
                      void handleOpenCheckout('enterprise');
                    } else {
                      setSelectedPlanTab('enterprise');
                    }
                  }}
                  className={cn(
                    'group relative flex flex-col justify-between p-3.5 rounded-2xl border text-left transition-all cursor-pointer',
                    selectedPlanTab === 'enterprise'
                      ? 'bg-blue-500/10 border-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.25)]'
                      : 'bg-[#09090B] border-[#26262C] hover:border-white/20',
                  )}
                >
                  <div>
                    <div className="text-[10px] font-geist-mono uppercase tracking-wider text-blue-400 font-bold">
                      Enterprise
                    </div>
                    <div className="text-lg font-bold font-geist-mono text-[#F4F4F5] mt-1">
                      $199 USD
                    </div>
                    <div className="text-[11px] font-geist text-[#9A9AA5] mt-0.5">
                      Air-Gapped Intranet
                    </div>
                  </div>
                  {selectedPlanTab === 'enterprise' && (
                    <div className="mt-2 text-[10px] font-geist font-semibold text-blue-400 flex items-center gap-1">
                      <span>Seleccionado</span>
                      <span>→</span>
                    </div>
                  )}
                </button>
              </div>

              {/* Feature Matrix Mini (Spaceship Table) */}
              <div className="border border-[#26262C] divide-y divide-[#26262C] bg-[#09090B] rounded-2xl overflow-hidden">
                <div className="grid grid-cols-[1fr_60px_80px] h-7 items-center px-4 bg-[#09090B] text-[11px] font-geist-mono text-[#9A9AA5] uppercase tracking-wider">
                  <span>Capacidad</span>
                  <span className="text-center">Free</span>
                  <span className="text-center text-[#FF4F00] font-semibold">Plan Activo</span>
                </div>
                {FEATURES.map((f) => (
                  <div key={f.label} className="grid grid-cols-[1fr_60px_80px] h-7 items-center px-4 text-xs font-geist">
                    <span className="text-[#9A9AA5] truncate">{f.label}</span>
                    <span className="text-center font-geist-mono text-zinc-600">
                      {typeof f.free === 'string' ? f.free : f.free ? '✓' : '—'}
                    </span>
                    <span className="text-center font-geist-mono text-emerald-400 font-medium">
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
              <div className="space-y-2.5">
                <button
                  type="button"
                  disabled={isOpeningCheckout}
                  onClick={() => void handleOpenCheckout(selectedPlanTab)}
                  className={cn(
                    'flex items-center justify-center gap-2 h-11 w-full text-white text-xs font-geist font-semibold tracking-tight transition-all rounded-xl shadow-lg cursor-pointer disabled:opacity-75',
                    selectedPlanTab === 'enterprise'
                      ? 'bg-blue-600 hover:bg-blue-500 shadow-[0_0_24px_rgba(59,130,246,0.35)]'
                      : selectedPlanTab === 'team'
                        ? 'bg-emerald-600 hover:bg-emerald-500 shadow-[0_0_24px_rgba(16,185,129,0.35)]'
                        : 'bg-[#FF4F00] hover:bg-[#FF6A20] shadow-[0_0_24px_rgba(255,79,0,0.35)]',
                  )}
                >
                  {isOpeningCheckout ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-white" />
                      <span>Abriendo pasarela de pago Polar.sh en el navegador...</span>
                    </>
                  ) : (
                    <>
                      <Zap className="w-4 h-4" />
                      <span>
                        Proceed to Polar Checkout — ${PRICING_PLANS[selectedPlanTab].priceUSD} USD Lifetime
                      </span>
                      <ExternalLink className="w-3.5 h-3.5 opacity-80" />
                    </>
                  )}
                </button>

                <div className="flex items-center justify-between text-xs font-geist text-[#9A9AA5] px-1">
                  <span>Se abre en tu navegador predeterminado (Chrome/Edge/Firefox)</span>
                  <button
                    type="button"
                    onClick={() => void handleCopyLink(selectedPlanTab)}
                    className="flex items-center gap-1.5 text-[#9A9AA5] hover:text-[#FF4F00] transition-colors focus:outline-none"
                    title="Copy Polar checkout URL to clipboard"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>{copiedLink ? '✓ Polar URL Copied!' : 'Copiar enlace directo'}</span>
                  </button>
                </div>
              </div>

              {/* ── Key Input Section ─────────────────────────────────── */}
              <div className="pt-3 border-t border-[#26262C] space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-geist font-medium text-[#F4F4F5]">
                    ¿Ya compraste tu licencia? Actívala aquí:
                  </span>
                  {detectedTier && (
                    <span className="text-xs font-geist-mono text-emerald-400 flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" />
                      Detectada: {detectedTier.tierLabel}
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
                      'flex-1 h-10 px-3.5 bg-[#09090B] border text-xs font-geist-mono text-[#F4F4F5] tracking-wider placeholder:text-zinc-600 rounded-xl transition-colors',
                      'focus:outline-none focus:border-[#FF4F00]',
                      'disabled:opacity-50 disabled:cursor-not-allowed',
                      error
                        ? 'border-red-500'
                        : activatedTier
                          ? 'border-emerald-500'
                          : 'border-[#26262C]',
                    )}
                  />
                  <button
                    onClick={() => void handleActivate()}
                    disabled={isValidating || activatedTier !== null || !keyInput.trim()}
                    className={cn(
                      'h-10 px-5 text-xs font-geist font-semibold transition-all rounded-xl focus:outline-none',
                      'disabled:opacity-50 disabled:cursor-not-allowed',
                      activatedTier
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                        : 'bg-white/[0.06] text-[#F4F4F5] border border-[#26262C] hover:bg-white/[0.12] hover:border-white/20',
                    )}
                  >
                    {isValidating ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : activatedTier ? (
                      <span className="flex items-center gap-1.5">
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        Activada
                      </span>
                    ) : (
                      'Activar'
                    )}
                  </button>
                </div>

                {error && <p className="text-xs text-red-400 font-geist">{error}</p>}
              </div>

              {/* Legal Links */}
              <div className="flex justify-center items-center gap-3 text-xs font-geist text-[#9A9AA5] pt-1">
                <button
                  type="button"
                  onClick={() => {
                    setShowLicenseModal(false);
                    setShowLegalModal(true);
                  }}
                  className="hover:text-[#F4F4F5] underline underline-offset-2 transition-colors"
                >
                  Términos y EULA
                </button>
                <span>·</span>
                <button
                  type="button"
                  onClick={() => {
                    setShowLicenseModal(false);
                    setShowLegalModal(true);
                  }}
                  className="hover:text-[#F4F4F5] underline underline-offset-2 transition-colors"
                >
                  Política de Privacidad
                </button>
                <span>·</span>
                <button
                  type="button"
                  onClick={() => {
                    setShowLicenseModal(false);
                    setShowLegalModal(true);
                  }}
                  className="hover:text-[#F4F4F5] underline underline-offset-2 transition-colors"
                >
                  Garantía 14 Días
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
