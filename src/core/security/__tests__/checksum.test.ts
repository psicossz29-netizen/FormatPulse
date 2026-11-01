import { describe, it, expect } from 'vitest';
import { computeHash, generateIntegrityReceipt } from '../checksum';

describe('Web Crypto Checksum & Integrity Receipt', () => {
  it('computes deterministic SHA-256 hash', async () => {
    // SHA-256 for empty string: e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855
    const emptyHash = await computeHash('', 'SHA-256');
    expect(emptyHash).toBe('e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855');

    // SHA-256 for 'FormatPulse'
    const fpHash = await computeHash('FormatPulse', 'SHA-256');
    expect(fpHash.length).toBe(64);
  });

  it('computes deterministic SHA-512 hash', async () => {
    const hash512 = await computeHash('FormatPulse', 'SHA-512');
    expect(hash512.length).toBe(128);
  });

  it('generates an auditable integrity receipt with input/output metrics', async () => {
    const input = '{"name":"Alice","role":"admin"}';
    const output = 'export interface Root {\n  name: string;\n  role: string;\n}';

    const receipt = await generateIntegrityReceipt(input, output, 'SHA-256');

    expect(receipt.version).toBe('1.0');
    expect(receipt.algorithm).toBe('SHA-256');
    expect(receipt.inputHash).toHaveLength(64);
    expect(receipt.outputHash).toHaveLength(64);
    expect(receipt.inputBytes).toBeGreaterThan(0);
    expect(receipt.outputBytes).toBeGreaterThan(0);
    expect(receipt.environment).toBe('client-isolated');
    expect(receipt.tamperProofNote).toContain('100% in-browser via Web Crypto API');
    expect(receipt.generatedAt).toBeTruthy();
  });
});
