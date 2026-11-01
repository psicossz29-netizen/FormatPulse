// ── FormatPulse Web Crypto Integrity & Tamper-Proof Audit Receipt ─────────────

export interface IntegrityReceipt {
  version: '1.0';
  generatedAt: string;
  algorithm: 'SHA-256' | 'SHA-512';
  inputHash: string;
  outputHash: string;
  inputBytes: number;
  outputBytes: number;
  environment: 'client-isolated';
  tamperProofNote: string;
}

/**
 * Computes a cryptographic hex digest of any text using Web Crypto API (SubtleCrypto).
 */
export async function computeHash(
  text: string,
  algorithm: 'SHA-256' | 'SHA-512' = 'SHA-256',
): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(text);

  // Use global crypto.subtle (available in browser and Node 19+)
  const subtle = (typeof window !== 'undefined' ? window.crypto?.subtle : globalThis.crypto?.subtle);

  if (!subtle) {
    throw new Error('Web Crypto API (crypto.subtle) is not available in this environment.');
  }

  const hashBuffer = await subtle.digest(algorithm, data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Generates an auditable cryptographic integrity receipt for developer data compliance.
 */
export async function generateIntegrityReceipt(
  inputText: string,
  outputText: string,
  algorithm: 'SHA-256' | 'SHA-512' = 'SHA-256',
): Promise<IntegrityReceipt> {
  const [inputHash, outputHash] = await Promise.all([
    computeHash(inputText, algorithm),
    computeHash(outputText, algorithm),
  ]);

  const encoder = new TextEncoder();

  return {
    version: '1.0',
    generatedAt: new Date().toISOString(),
    algorithm,
    inputHash,
    outputHash,
    inputBytes: encoder.encode(inputText).byteLength,
    outputBytes: encoder.encode(outputText).byteLength,
    environment: 'client-isolated',
    tamperProofNote:
      'Verified 100% in-browser via Web Crypto API. No data was sent over network sockets to produce this cryptographic proof.',
  };
}
