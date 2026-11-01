import { describe, it, expect } from 'vitest';
import { isValidKeyFormat } from '../licenseService';

describe('License Key Validation', () => {
  // ── Valid Keys ─────────────────────────────────────────────────────────────

  it('accepts a valid license key format', () => {
    expect(isValidKeyFormat('FP-PRO-2026-AB12-CD34')).toBe(true);
  });

  it('accepts all-uppercase alphanumeric segments', () => {
    expect(isValidKeyFormat('FP-PRO-2026-ZZZZ-9999')).toBe(true);
  });

  it('accepts with leading/trailing whitespace (trimmed)', () => {
    expect(isValidKeyFormat('  FP-PRO-2026-AAAA-BBBB  ')).toBe(true);
  });

  it('accepts lowercase input (normalized to uppercase)', () => {
    expect(isValidKeyFormat('fp-pro-2026-ab12-cd34')).toBe(true);
  });

  it('accepts mixed case', () => {
    expect(isValidKeyFormat('Fp-Pro-2026-Ab12-Cd34')).toBe(true);
  });

  // ── Invalid Keys ───────────────────────────────────────────────────────────

  it('rejects empty string', () => {
    expect(isValidKeyFormat('')).toBe(false);
  });

  it('rejects random string', () => {
    expect(isValidKeyFormat('not-a-license-key')).toBe(false);
  });

  it('rejects key with wrong prefix', () => {
    expect(isValidKeyFormat('XX-PRO-2026-AAAA-BBBB')).toBe(false);
  });

  it('rejects key with wrong year', () => {
    expect(isValidKeyFormat('FP-PRO-2025-AAAA-BBBB')).toBe(false);
  });

  it('rejects key with too-short segments', () => {
    expect(isValidKeyFormat('FP-PRO-2026-AAA-BBBB')).toBe(false);
  });

  it('rejects key with too-long segments', () => {
    expect(isValidKeyFormat('FP-PRO-2026-AAAAA-BBBB')).toBe(false);
  });

  it('rejects key with special characters in segments', () => {
    expect(isValidKeyFormat('FP-PRO-2026-AA!A-BBBB')).toBe(false);
  });

  it('rejects key missing segment', () => {
    expect(isValidKeyFormat('FP-PRO-2026-AAAA')).toBe(false);
  });

  it('rejects key with extra segment', () => {
    expect(isValidKeyFormat('FP-PRO-2026-AAAA-BBBB-CCCC')).toBe(false);
  });
});
