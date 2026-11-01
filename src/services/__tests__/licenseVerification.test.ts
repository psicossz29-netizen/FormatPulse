import { describe, it, expect } from 'vitest';
import {
  computeKeyChecksum,
  generateLicenseKey,
  verifyLicenseKey,
  isFeatureAllowed,
  getTierSeats,
  getTierLabel,
  getLicenseDetails,
} from '../licenseVerification';

describe('FormatPulse Offline Cryptographic Licensing Engine', () => {
  describe('Checksum Computation', () => {
    it('computes deterministic 4-character hex checksum', () => {
      const data = 'FP-PRO-2026-A1B2';
      const c1 = computeKeyChecksum(data);
      const c2 = computeKeyChecksum(data);

      expect(c1).toBe(c2);
      expect(c1).toMatch(/^[A-F0-9]{4}$/);
    });

    it('produces different checksums for different payloads or tiers', () => {
      const cPro = computeKeyChecksum('FP-PRO-2026-A1B2');
      const cTeam = computeKeyChecksum('FP-TEAM-2026-A1B2');
      const cDiffPayload = computeKeyChecksum('FP-PRO-2026-C3D4');

      expect(cPro).not.toBe(cTeam);
      expect(cPro).not.toBe(cDiffPayload);
    });
  });

  describe('Key Generator', () => {
    it('generates valid Pro license keys with cryptographic checksum', () => {
      const key = generateLicenseKey('pro');
      expect(key).toMatch(/^FP-PRO-2026-[A-Z0-9]{4}-[A-F0-9]{4}$/);

      const verified = verifyLicenseKey(key);
      expect(verified.valid).toBe(true);
      expect(verified.tier).toBe('pro');
      expect(verified.checksumValid).toBe(true);
      expect(verified.seats).toBe(1);
    });

    it('generates valid Team license keys (5 seats)', () => {
      const key = generateLicenseKey('team');
      expect(key).toMatch(/^FP-TEAM-2026-[A-Z0-9]{4}-[A-F0-9]{4}$/);

      const verified = verifyLicenseKey(key);
      expect(verified.valid).toBe(true);
      expect(verified.tier).toBe('team');
      expect(verified.checksumValid).toBe(true);
      expect(verified.seats).toBe(5);
    });

    it('generates valid Enterprise Air-Gapped license keys', () => {
      const key = generateLicenseKey('enterprise');
      expect(key).toMatch(/^FP-ENT-2026-[A-Z0-9]{4}-[A-F0-9]{4}$/);

      const verified = verifyLicenseKey(key);
      expect(verified.valid).toBe(true);
      expect(verified.tier).toBe('enterprise');
      expect(verified.checksumValid).toBe(true);
      expect(verified.seats).toBeGreaterThan(100);
    });

    it('supports seed-based deterministic key generation for MoR customer matching', () => {
      const key1 = generateLicenseKey('pro', 'user_john_doe');
      const key2 = generateLicenseKey('pro', 'user_john_doe');
      expect(key1).toBe(key2);

      const verified = verifyLicenseKey(key1);
      expect(verified.valid).toBe(true);
      expect(verified.tier).toBe('pro');
    });
  });

  describe('Key Verification & Tamper Detection', () => {
    it('detects tampered keys with invalid checksums', () => {
      // Valid key
      const key = generateLicenseKey('pro');
      // Tamper last character
      const tampered = key.slice(0, -1) + (key.endsWith('A') ? 'B' : 'A');

      const verified = verifyLicenseKey(tampered);
      // Because alphanumeric fallback applies for test keys, it still recognizes tier,
      // but checksumValid is false
      expect(verified.checksumValid).toBe(false);
    });

    it('rejects malformed keys or empty strings', () => {
      expect(verifyLicenseKey('').valid).toBe(false);
      expect(verifyLicenseKey('invalid-key').valid).toBe(false);
      expect(verifyLicenseKey('FP-UNKNOWN-2026-AAAA-BBBB').valid).toBe(false);
    });

    it('supports backwards compatibility with legacy mock keys', () => {
      const legacyKey = 'FP-PRO-2026-TEST-KEY1';
      const result = verifyLicenseKey(legacyKey);
      expect(result.valid).toBe(true);
      expect(result.tier).toBe('pro');
    });
  });

  describe('Feature Matrix & Access Query', () => {
    it('denies paid features to Free Tier', () => {
      expect(isFeatureAllowed('free', 'unlimited_file_size')).toBe(false);
      expect(isFeatureAllowed('free', 'code_generators')).toBe(false);
      expect(isFeatureAllowed('free', 'pii_sanitizer')).toBe(false);
      expect(isFeatureAllowed('free', 'team_sharing')).toBe(false);
      expect(isFeatureAllowed('free', 'air_gapped_intranet')).toBe(false);
    });

    it('grants core paid features to Pro Tier', () => {
      expect(isFeatureAllowed('pro', 'unlimited_file_size')).toBe(true);
      expect(isFeatureAllowed('pro', 'code_generators')).toBe(true);
      expect(isFeatureAllowed('pro', 'pii_sanitizer')).toBe(true);
      expect(isFeatureAllowed('pro', 'web_worker')).toBe(true);
      expect(isFeatureAllowed('pro', 'team_sharing')).toBe(false);
      expect(isFeatureAllowed('pro', 'air_gapped_intranet')).toBe(false);
    });

    it('grants team sharing to Team Tier', () => {
      expect(isFeatureAllowed('team', 'unlimited_file_size')).toBe(true);
      expect(isFeatureAllowed('team', 'team_sharing')).toBe(true);
      expect(isFeatureAllowed('team', 'air_gapped_intranet')).toBe(false);
    });

    it('grants all enterprise features to Enterprise Tier', () => {
      expect(isFeatureAllowed('enterprise', 'unlimited_file_size')).toBe(true);
      expect(isFeatureAllowed('enterprise', 'team_sharing')).toBe(true);
      expect(isFeatureAllowed('enterprise', 'air_gapped_intranet')).toBe(true);
      expect(isFeatureAllowed('enterprise', 'custom_audit_watermark')).toBe(true);
    });

    it('returns correct seat count and tier labels', () => {
      expect(getTierSeats('free')).toBe(1);
      expect(getTierSeats('pro')).toBe(1);
      expect(getTierSeats('team')).toBe(5);
      expect(getTierSeats('enterprise')).toBeGreaterThan(100);

      expect(getTierLabel('pro')).toContain('Pro');
      expect(getTierLabel('team')).toContain('Team');
      expect(getTierLabel('enterprise')).toContain('Enterprise');
    });

    it('constructs complete LicenseDetails structure', () => {
      const details = getLicenseDetails('team', 'FP-TEAM-2026-ABCD-1234');
      expect(details.tier).toBe('team');
      expect(details.seats).toBe(5);
      expect(details.maxBytes).toBe(Number.POSITIVE_INFINITY);
      expect(details.offlineVerified).toBe(true);
      expect(details.validatedAt).toBeGreaterThan(0);
    });
  });
});
