// ── FormatPulse Auto-Updater & Version Engine ────────────────────────────────
// Zero-telemetry semver version comparison and release manifest checker.

export const CURRENT_APP_VERSION = '1.2.0';
export const DEFAULT_MANIFEST_URL = '/latest.json';

// ── Types ────────────────────────────────────────────────────────────────────

export interface ReleaseManifest {
  version: string;
  releaseDate: string;
  title: string;
  highlights: string[];
  mandatory: boolean;
  downloadUrl: string;
  sha256: string;
  assetSize?: string;
}

export interface UpdateCheckResult {
  hasUpdate: boolean;
  currentVersion: string;
  latestVersion: string;
  manifest: ReleaseManifest | null;
  error?: string;
  checkedAt: number;
}

// ── Semver Comparison ────────────────────────────────────────────────────────

/**
 * Compares two semantic version strings (e.g., "1.2.0" and "1.3.1").
 * Returns:
 *   1 if a > b (a is newer)
 *  -1 if a < b (b is newer)
 *   0 if a === b
 */
export function compareSemver(versionA: string, versionB: string): number {
  const cleanA = versionA.replace(/^v/i, '').trim();
  const cleanB = versionB.replace(/^v/i, '').trim();

  const partsA = cleanA.split('.').map((p) => Number.parseInt(p, 10) || 0);
  const partsB = cleanB.split('.').map((p) => Number.parseInt(p, 10) || 0);

  const maxLength = Math.max(partsA.length, partsB.length, 3);

  for (let i = 0; i < maxLength; i++) {
    const numA = partsA[i] ?? 0;
    const numB = partsB[i] ?? 0;

    if (numA > numB) return 1;
    if (numA < numB) return -1;
  }

  return 0;
}

// ── Update Checker ───────────────────────────────────────────────────────────

/**
 * Checks remote or local release manifest to verify if a newer FormatPulse release is available.
 * Designed to be completely non-intrusive and offline-safe.
 */
export async function checkForUpdates(
  manifestUrl: string = DEFAULT_MANIFEST_URL,
): Promise<UpdateCheckResult> {
  const checkedAt = Date.now();

  try {
    const response = await fetch(manifestUrl, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
      // Avoid cached manifest responses
      cache: 'no-cache',
    });

    if (!response.ok) {
      return {
        hasUpdate: false,
        currentVersion: CURRENT_APP_VERSION,
        latestVersion: CURRENT_APP_VERSION,
        manifest: null,
        error: `Could not fetch update manifest (HTTP ${response.status})`,
        checkedAt,
      };
    }

    const manifest = (await response.json()) as ReleaseManifest;

    if (!manifest.version || typeof manifest.version !== 'string') {
      return {
        hasUpdate: false,
        currentVersion: CURRENT_APP_VERSION,
        latestVersion: CURRENT_APP_VERSION,
        manifest: null,
        error: 'Invalid manifest format received from update server',
        checkedAt,
      };
    }

    const comparison = compareSemver(manifest.version, CURRENT_APP_VERSION);
    const hasUpdate = comparison > 0;

    return {
      hasUpdate,
      currentVersion: CURRENT_APP_VERSION,
      latestVersion: manifest.version,
      manifest,
      checkedAt,
    };
  } catch (err) {
    return {
      hasUpdate: false,
      currentVersion: CURRENT_APP_VERSION,
      latestVersion: CURRENT_APP_VERSION,
      manifest: null,
      error: err instanceof Error ? err.message : 'Network error checking for updates (Offline)',
      checkedAt,
    };
  }
}

// ── Storage Cache for Update Checks ──────────────────────────────────────────

const LAST_CHECK_KEY = 'formatpulse_last_update_check';

export function getCachedUpdateCheckTime(): number | null {
  try {
    const val = localStorage.getItem(LAST_CHECK_KEY);
    return val ? Number.parseInt(val, 10) : null;
  } catch {
    return null;
  }
}

export function saveCachedUpdateCheckTime(timestamp: number): void {
  try {
    localStorage.setItem(LAST_CHECK_KEY, timestamp.toString());
  } catch {
    // silent fail
  }
}
