// ── Client-Side Gzip Compression & Export Utilities ──────────────────────────

/**
 * Compresses string content to Gzip (RFC 1952) using native Web Streams CompressionStream.
 * Supported in Chrome 80+, Safari 16.4+, Firefox 113+, Edge 80+.
 */
export async function compressToGzip(text: string): Promise<Uint8Array> {
  const bytes = new TextEncoder().encode(text);
  if (typeof CompressionStream === 'undefined' || typeof Response === 'undefined') {
    return bytes;
  }

  try {
    const stream = new Response(bytes).body;
    if (!stream || typeof stream.pipeThrough !== 'function') {
      return bytes;
    }
    const compressionStream = new CompressionStream('gzip');
    const compressedStream = stream.pipeThrough(compressionStream);
    const response = new Response(compressedStream);
    const arrayBuffer = await response.arrayBuffer();
    return new Uint8Array(arrayBuffer);
  } catch {
    return bytes;
  }
}

/**
 * Triggers a client-side direct download of a binary or text payload.
 */
export function downloadFile(
  content: string | Uint8Array,
  filename: string,
  mimeType = 'application/octet-stream',
): void {
  const blob =
    content instanceof Uint8Array
      ? new Blob([content], { type: mimeType })
      : new Blob([content], { type: mimeType });

  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(url);
}

/**
 * Downloads the current output payload as a compressed .gz archive.
 */
export async function downloadGzippedOutput(
  text: string,
  baseFilename = 'formatpulse-output',
): Promise<{ originalBytes: number; compressedBytes: number }> {
  const originalBytes = new TextEncoder().encode(text).byteLength;
  const compressed = await compressToGzip(text);
  downloadFile(compressed, `${baseFilename}.gz`, 'application/gzip');
  return {
    originalBytes,
    compressedBytes: compressed.byteLength,
  };
}
