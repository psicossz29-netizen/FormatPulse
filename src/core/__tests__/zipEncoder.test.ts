import { describe, it, expect, vi } from 'vitest';
import {
  computeCRC32,
  createZipArchive,
  downloadZipArchive,
} from '../zipEncoder';

describe('FormatPulse Zero-Dependency ZIP Archive Encoder', () => {
  describe('computeCRC32', () => {
    it('computes standard CRC32 accurately', () => {
      const data = new TextEncoder().encode('123456789');
      // Standard CRC32 of ASCII "123456789" is 0xcbf43926
      const crc = computeCRC32(data);
      expect(crc).toBe(0xcbf43926);
    });

    it('computes CRC32 for empty byte array as 0', () => {
      const data = new Uint8Array(0);
      expect(computeCRC32(data)).toBe(0);
    });
  });

  describe('createZipArchive', () => {
    it('creates a valid ZIP archive containing multiple files', () => {
      const files = [
        { name: 'users.json', content: '{"name":"Alice"}' },
        { name: 'schema.ts', content: 'export interface User { name: string; }' },
      ];

      const zipBytes = createZipArchive(files);
      expect(zipBytes).toBeInstanceOf(Uint8Array);
      expect(zipBytes.length).toBeGreaterThan(100);

      const view = new DataView(zipBytes.buffer);

      // 1. Verify Local File Header Signature: PK\x03\x04 (0x04034b50 in little endian)
      expect(view.getUint32(0, true)).toBe(0x04034b50);

      // 2. Verify that EOCD signature is present near end: PK\x05\x06 (0x06054b50)
      const eocdSignatureOffset = zipBytes.length - 22;
      expect(view.getUint32(eocdSignatureOffset, true)).toBe(0x06054b50);

      // 3. Verify total entries count is 2 in EOCD
      expect(view.getUint16(eocdSignatureOffset + 8, true)).toBe(2);
      expect(view.getUint16(eocdSignatureOffset + 10, true)).toBe(2);
    });
  });

  describe('downloadZipArchive', () => {
    it('triggers in-browser blob download without throwing', () => {
      const clickSpy = vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {});
      const appendChildSpy = vi.spyOn(document.body, 'appendChild');
      const removeChildSpy = vi.spyOn(document.body, 'removeChild');

      const mockZip = new Uint8Array([0x50, 0x4b, 0x05, 0x06]);
      downloadZipArchive('test.zip', mockZip);

      expect(appendChildSpy).toHaveBeenCalled();
      expect(clickSpy).toHaveBeenCalled();
      expect(removeChildSpy).toHaveBeenCalled();

      clickSpy.mockRestore();
    });
  });
});
