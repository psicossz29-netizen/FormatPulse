import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  isDesktopApp,
  getRuntimeEnvironment,
  saveExportedFile,
  sendDesktopNotification,
} from '../desktopBridge';

describe('FormatPulse Desktop Bridge', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    delete (window as any).__TAURI__;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    delete (window as any).__TAURI_INTERNALS__;
  });

  describe('Environment Detection', () => {
    it('detects web browser runtime when __TAURI__ is absent', () => {
      expect(isDesktopApp()).toBe(false);
      expect(getRuntimeEnvironment()).toBe('web-browser');
    });

    it('detects native Tauri desktop runtime when __TAURI__ is injected', () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (window as any).__TAURI__ = { invoke: vi.fn() };
      expect(isDesktopApp()).toBe(true);

      const env = getRuntimeEnvironment();
      expect(['tauri-windows', 'tauri-macos', 'tauri-linux']).toContain(env);
    });
  });

  describe('File Export Bridge', () => {
    it('executes client-side Blob download smoothly in web environment', async () => {
      const clickSpy = vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {});
      const appendChildSpy = vi.spyOn(document.body, 'appendChild');
      const removeChildSpy = vi.spyOn(document.body, 'removeChild');

      const success = await saveExportedFile('test.json', '{"status":"ok"}', 'application/json');
      expect(success).toBe(true);
      expect(appendChildSpy).toHaveBeenCalled();
      expect(clickSpy).toHaveBeenCalled();
      expect(removeChildSpy).toHaveBeenCalled();
      clickSpy.mockRestore();
    });
  });

  describe('Desktop Notifications', () => {
    it('returns false when Notification API is not permitted', async () => {
      const result = await sendDesktopNotification('Test Title', 'Test Message');
      expect(result).toBe(false);
    });
  });
});
