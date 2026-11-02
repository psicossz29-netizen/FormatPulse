// ── FormatPulse Canonical Version & Metadata ─────────────────────────────────

export const APP_VERSION = '1.2.2';
export const APP_BUILD_DATE = '2026-11-02';
export const APP_CODENAME = 'Swiss Industrial Tactical';
export const REPOSITORY_URL = 'https://github.com/psicossz29-netizen/FormatPulse';
export const PRODUCTION_WEB_URL = 'https://formatpulse.vercel.app';
export const SUPPORT_EMAIL = 'formatpulse.app@gmail.com';
export const LATEST_RELEASE_API = 'https://formatpulse.vercel.app/latest.json';
export const OFFICIAL_SHA256 = '7b9751df5dcd672c8a226a3006fca18d342739a3df037631e6b59eaf13777a69';

/**
 * Checks whether the application is running inside a Tauri native desktop window.
 */
export const isDesktopEnvironment = (): boolean => {
  if (typeof window === 'undefined') return false;
  return '__TAURI_INTERNALS__' in window || '__TAURI__' in window;
};
