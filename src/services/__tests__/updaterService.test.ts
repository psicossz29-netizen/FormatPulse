import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  compareSemver,
  checkForUpdates,
  CURRENT_APP_VERSION,
  type ReleaseManifest,
} from '../updaterService';

describe('FormatPulse Auto-Updater Service', () => {
  describe('compareSemver', () => {
    it('accurately identifies newer versions', () => {
      expect(compareSemver('1.3.0', '1.2.0')).toBe(1);
      expect(compareSemver('2.0.0', '1.9.9')).toBe(1);
      expect(compareSemver('1.2.1', '1.2.0')).toBe(1);
      expect(compareSemver('v1.3.0', '1.2.0')).toBe(1);
    });

    it('accurately identifies identical versions', () => {
      expect(compareSemver('1.2.0', '1.2.0')).toBe(0);
      expect(compareSemver('v1.2.0', '1.2.0')).toBe(0);
    });

    it('accurately identifies older versions', () => {
      expect(compareSemver('1.1.9', '1.2.0')).toBe(-1);
      expect(compareSemver('1.0.0', '2.0.0')).toBe(-1);
      expect(compareSemver('1.2.0', '1.2.1')).toBe(-1);
    });
  });

  describe('checkForUpdates', () => {
    const originalFetch = globalThis.fetch;

    beforeEach(() => {
      vi.restoreAllMocks();
    });

    afterEach(() => {
      globalThis.fetch = originalFetch;
    });

    it('detects when an update is available', async () => {
      const mockManifest: ReleaseManifest = {
        version: '1.3.0',
        releaseDate: '2026-11-15',
        title: 'FormatPulse v1.3.0',
        highlights: ['New feature X', 'Performance boost'],
        mandatory: false,
        downloadUrl: 'https://github.com/formatpulse/releases/download/v1.3.0/setup.exe',
        sha256: 'a1b2c3d4e5f6',
      };

      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => mockManifest,
      } as unknown as Response);

      const result = await checkForUpdates('/mock-latest.json');
      expect(result.hasUpdate).toBe(true);
      expect(result.currentVersion).toBe(CURRENT_APP_VERSION);
      expect(result.latestVersion).toBe('1.3.0');
      expect(result.manifest?.highlights).toContain('New feature X');
    });

    it('reports no update when current version matches latest manifest', async () => {
      const mockManifest: ReleaseManifest = {
        version: CURRENT_APP_VERSION,
        releaseDate: '2026-11-01',
        title: `FormatPulse v${CURRENT_APP_VERSION}`,
        highlights: ['Current stable release'],
        mandatory: false,
        downloadUrl: 'https://github.com/formatpulse/releases/setup.exe',
        sha256: 'a1b2c3d4e5f6',
      };

      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => mockManifest,
      } as unknown as Response);

      const result = await checkForUpdates('/mock-latest.json');
      expect(result.hasUpdate).toBe(false);
      expect(result.latestVersion).toBe(CURRENT_APP_VERSION);
    });

    it('handles network failure offline gracefully without throwing', async () => {
      globalThis.fetch = vi.fn().mockRejectedValue(new Error('Connection refused (Offline)'));

      const result = await checkForUpdates('/mock-latest.json');
      expect(result.hasUpdate).toBe(false);
      expect(result.error).toContain('Connection refused');
    });

    it('handles non-200 HTTP responses gracefully', async () => {
      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 404,
      } as unknown as Response);

      const result = await checkForUpdates('/mock-latest.json');
      expect(result.hasUpdate).toBe(false);
      expect(result.error).toContain('404');
    });
  });
});
