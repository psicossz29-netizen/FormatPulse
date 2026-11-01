import { describe, it, expect } from 'vitest';
import { compressToGzip } from '../exportUtils';

describe('Export and Compression Utilities', () => {
  it('compresses text payload to Gzip bytes', async () => {
    const text = 'FormatPulse local-first data conversion engine payload for testing compression.';
    const compressed = await compressToGzip(text);

    expect(compressed).toBeInstanceOf(Uint8Array);
    expect(compressed.length).toBeGreaterThan(0);
    // Gzip magic number is 0x1F, 0x8B if CompressionStream is available in env
    if (typeof CompressionStream !== 'undefined') {
      expect(compressed[0]).toBe(0x1f);
      expect(compressed[1]).toBe(0x8b);
    }
  });

  it('handles empty string gracefully', async () => {
    const compressed = await compressToGzip('');
    expect(compressed).toBeInstanceOf(Uint8Array);
  });
});
