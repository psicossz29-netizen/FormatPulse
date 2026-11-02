// ── FormatPulse Canonical Version & Metadata ─────────────────────────────────

export const APP_VERSION = '1.2.3';
export const APP_BUILD_DATE = '2026-11-02';
export const APP_CODENAME = 'Swiss Industrial Tactical';
export const REPOSITORY_URL = 'https://github.com/psicossz29-netizen/FormatPulse';
export const PRODUCTION_WEB_URL = 'https://formatpulse.vercel.app';
export const SUPPORT_EMAIL = 'formatpulse.app@gmail.com';
export const LATEST_RELEASE_API = 'https://formatpulse.vercel.app/latest.json';
export const OFFICIAL_SHA256 = '40106498a2b456b655d26478a8a4e3f4590fa04cb3111c14cd9e5dde51c9ea4a';

/**
 * Checks whether the application is running inside a Tauri native desktop window.
 */
export const isDesktopEnvironment = (): boolean => {
  if (typeof window === 'undefined') return false;
  return '__TAURI_INTERNALS__' in window || '__TAURI__' in window;
};
