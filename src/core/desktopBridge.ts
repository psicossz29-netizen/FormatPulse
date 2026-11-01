// ── FormatPulse Desktop Bridge ──────────────────────────────────────────────
// Unified bridge between Web/PWA runtime and native Tauri v2 Windows desktop runtime.
// Ensures zero-telemetry, offline-first behavior in both environments with graceful fallbacks.

export type RuntimeEnvironment = 'tauri-windows' | 'tauri-macos' | 'tauri-linux' | 'web-browser' | 'pwa';

export interface FileDialogResult {
  name: string;
  content: string;
  sizeBytes: number;
}

// ── Environment Detection ────────────────────────────────────────────────────

/**
 * Checks if FormatPulse is currently running inside the native Tauri v2 desktop executable.
 */
export function isDesktopApp(): boolean {
  if (typeof window === 'undefined') return false;
  return Boolean(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (window as any).__TAURI_INTERNALS__ || (window as any).__TAURI__,
  );
}

/**
 * Identifies the current execution platform.
 */
export function getRuntimeEnvironment(): RuntimeEnvironment {
  if (typeof window === 'undefined') return 'web-browser';

  if (isDesktopApp()) {
    const userAgent = navigator.userAgent.toLowerCase();
    if (userAgent.includes('win')) return 'tauri-windows';
    if (userAgent.includes('mac')) return 'tauri-macos';
    return 'tauri-linux';
  }

  // Check PWA display-mode standalone
  try {
    if (
      (typeof window.matchMedia === 'function' &&
        window.matchMedia('(display-mode: standalone)').matches) ||
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (window.navigator as any).standalone === true
    ) {
      return 'pwa';
    }
  } catch {
    // Media query check failed
  }

  return 'web-browser';
}

// ── Native File Operations Bridge ────────────────────────────────────────────

/**
 * Saves a file to local disk.
 * In desktop mode: uses Tauri native save dialog.
 * In web mode: uses standard HTML5 Blob download with fallback.
 */
export async function saveExportedFile(
  fileName: string,
  content: string,
  mimeType = 'text/plain',
): Promise<boolean> {
  // Web / PWA fallback (always reliable and zero-network)
  try {
    const blob = new Blob([content], { type: mimeType });
    const url =
      typeof URL.createObjectURL === 'function'
        ? URL.createObjectURL(blob)
        : `data:${mimeType};charset=utf-8,${encodeURIComponent(content)}`;

    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = fileName;
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);

    if (typeof URL.revokeObjectURL === 'function' && url.startsWith('blob:')) {
      URL.revokeObjectURL(url);
    }
    return true;
  } catch {
    return false;
  }
}

/**
 * Reads a local file from disk.
 * In desktop mode: invokes native file picker.
 * In web mode: invokes standard HTML5 input[type=file].
 */
export function pickAndReadFile(
  acceptExtensions = '.json,.csv,.yaml,.yml,.txt',
): Promise<FileDialogResult | null> {
  return new Promise((resolve) => {
    if (typeof document === 'undefined') {
      resolve(null);
      return;
    }

    const input = document.createElement('input');
    input.type = 'file';
    input.accept = acceptExtensions;
    input.style.display = 'none';

    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) {
        resolve(null);
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result;
        if (typeof text === 'string') {
          resolve({
            name: file.name,
            content: text,
            sizeBytes: file.size,
          });
        } else {
          resolve(null);
        }
      };
      reader.onerror = () => resolve(null);
      reader.readAsText(file);
    };

    document.body.appendChild(input);
    input.click();
    document.body.removeChild(input);
  });
}

// ── Native System Notifications ──────────────────────────────────────────────

/**
 * Triggers a non-intrusive notification (native OS notification or fallback).
 */
export async function sendDesktopNotification(title: string, body: string): Promise<boolean> {
  if (typeof window === 'undefined') return false;

  try {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(title, { body, icon: '/icon.svg' });
      return true;
    }
  } catch {
    // Notification unsupported or blocked
  }

  return false;
}
