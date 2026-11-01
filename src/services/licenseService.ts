import type { LicenseTier } from '@/types';
import { verifyLicenseKey } from './licenseVerification';

// ── Constants ────────────────────────────────────────────────────────────────

export const FREE_TIER_MAX_BYTES = 1024 * 1024; // 1 MB
export const PRO_PREVIEW_LINES = 12;

const MULTI_TIER_KEY_RE = /^FP-(PRO|TEAM|ENT)-2026-[A-Z0-9]{4}-[A-Z0-9]{4}$/;
const STORAGE_KEY = 'formatpulse_license_key';

const MOR_VALIDATE_URL = import.meta.env.VITE_MOR_VALIDATE_URL as string | undefined;
const MOR_CHECKOUT_URL = import.meta.env.VITE_MOR_CHECKOUT_URL as string | undefined;

// ── Types ────────────────────────────────────────────────────────────────────

export interface LicenseValidationResult {
  valid: boolean;
  tier: LicenseTier;
  error?: string;
  seats?: number;
  tierLabel?: string;
}

// ── Local Validation ─────────────────────────────────────────────────────────

export function isValidKeyFormat(key: string): boolean {
  return MULTI_TIER_KEY_RE.test(key.trim().toUpperCase());
}

// ── Remote Validation (MoR API) ──────────────────────────────────────────────

async function validateRemote(key: string): Promise<LicenseValidationResult> {
  if (!MOR_VALIDATE_URL) {
    // No remote endpoint configured — fall back to local validation
    return validateLocal(key);
  }

  try {
    const response = await fetch(MOR_VALIDATE_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ license_key: key }),
    });

    if (!response.ok) {
      return { valid: false, tier: 'free', error: `Validation failed (HTTP ${response.status})` };
    }

    const data = (await response.json()) as { valid?: boolean; status?: string; tier?: LicenseTier };

    if (data.valid || data.status === 'active') {
      const verified = verifyLicenseKey(key);
      return {
        valid: true,
        tier: data.tier ?? verified.tier,
        seats: verified.seats,
        tierLabel: verified.tierLabel,
      };
    }

    return { valid: false, tier: 'free', error: 'License key is not active' };
  } catch {
    // Network error — fall back to local offline cryptographic validation
    return validateLocal(key);
  }
}

// ── Local-Only Validation (offline / development) ────────────────────────────

function validateLocal(key: string): LicenseValidationResult {
  const normalized = key.trim().toUpperCase();
  const verification = verifyLicenseKey(normalized);

  if (verification.valid) {
    return {
      valid: true,
      tier: verification.tier,
      seats: verification.seats,
      tierLabel: verification.tierLabel,
    };
  }

  return {
    valid: false,
    tier: 'free',
    error: verification.error ?? 'Invalid license key format. Expected: FP-PRO-2026-XXXX-XXXX, FP-TEAM-2026-XXXX-XXXX, or FP-ENT-2026-XXXX-XXXX',
  };
}

// ── Main Activation ──────────────────────────────────────────────────────────

export async function activateLicense(key: string): Promise<LicenseValidationResult> {
  const normalized = key.trim().toUpperCase();

  // Quick format check before network call
  if (!isValidKeyFormat(normalized)) {
    return {
      valid: false,
      tier: 'free',
      error: 'Invalid license key format. Expected: FP-PRO-2026-XXXX-XXXX, FP-TEAM-2026-XXXX-XXXX, or FP-ENT-2026-XXXX-XXXX',
    };
  }

  const result = await validateRemote(normalized);

  if (result.valid) {
    saveLicenseToStorage(normalized);
  }

  return result;
}

// ── Persistence (localStorage) ───────────────────────────────────────────────

export function saveLicenseToStorage(key: string): void {
  try {
    localStorage.setItem(STORAGE_KEY, key);
  } catch {
    // localStorage unavailable (SSR, quota exceeded) — silent fail
  }
}

export function loadLicenseFromStorage(): string | null {
  try {
    return localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}

export function clearLicenseFromStorage(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // silent fail
  }
}

// ── Checkout URL ─────────────────────────────────────────────────────────────

export function getCheckoutURL(): string {
  return MOR_CHECKOUT_URL ?? 'https://formatpulse.lemonsqueezy.com/checkout';
}
