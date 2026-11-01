// ── FormatPulse Pure TypeScript Zero-Dependency ZIP Encoder ───────────────────
// Generates standard PKZip 2.0 archives completely client-side with zero external packages.

export interface ZipFileInput {
  name: string;
  content: string | Uint8Array;
}

// ── CRC32 Table Generator ────────────────────────────────────────────────────

const CRC_TABLE = new Uint32Array(256);
for (let i = 0; i < 256; i++) {
  let c = i;
  for (let k = 0; k < 8; k++) {
    c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  }
  CRC_TABLE[i] = c >>> 0;
}

export function computeCRC32(data: Uint8Array): number {
  let crc = 0xffffffff;
  for (let i = 0; i < data.length; i++) {
    crc = (crc >>> 8) ^ CRC_TABLE[(crc ^ (data[i] ?? 0)) & 0xff]!;
  }
  return (crc ^ 0xffffffff) >>> 0;
}

// ── Helper to write 16-bit and 32-bit little endian numbers ──────────────────

function writeUint16LE(view: DataView, offset: number, value: number): void {
  view.setUint16(offset, value, true);
}

function writeUint32LE(view: DataView, offset: number, value: number): void {
  view.setUint32(offset, value, true);
}

// ── Main ZIP Builder ─────────────────────────────────────────────────────────

export function createZipArchive(files: ZipFileInput[]): Uint8Array {
  const encoder = new TextEncoder();
  const fileEntries: {
    nameBytes: Uint8Array;
    dataBytes: Uint8Array;
    crc: number;
    offset: number;
  }[] = [];

  const localHeadersAndData: Uint8Array[] = [];
  let currentOffset = 0;

  // 1. Process and assemble local file records
  for (const file of files) {
    const nameBytes = encoder.encode(file.name);
    const dataBytes =
      typeof file.content === 'string' ? encoder.encode(file.content) : file.content;
    const crc = computeCRC32(dataBytes);

    const localHeader = new Uint8Array(30);
    const view = new DataView(localHeader.buffer);

    writeUint32LE(view, 0, 0x04034b50); // Local file header signature (PK\x03\x04)
    writeUint16LE(view, 4, 20); // Version needed to extract (2.0)
    writeUint16LE(view, 6, 0); // General purpose bit flag
    writeUint16LE(view, 8, 0); // Compression method (0 = Store / Uncompressed)
    writeUint16LE(view, 10, 0); // File last mod time
    writeUint16LE(view, 12, 0); // File last mod date
    writeUint32LE(view, 14, crc); // CRC-32
    writeUint32LE(view, 18, dataBytes.length); // Compressed size
    writeUint32LE(view, 22, dataBytes.length); // Uncompressed size
    writeUint16LE(view, 26, nameBytes.length); // File name length
    writeUint16LE(view, 28, 0); // Extra field length

    fileEntries.push({
      nameBytes,
      dataBytes,
      crc,
      offset: currentOffset,
    });

    localHeadersAndData.push(localHeader, nameBytes, dataBytes);
    currentOffset += localHeader.length + nameBytes.length + dataBytes.length;
  }

  // 2. Build Central Directory headers
  const centralDirectoryHeaders: Uint8Array[] = [];
  const cdStartOffset = currentOffset;

  for (const entry of fileEntries) {
    const cdHeader = new Uint8Array(46);
    const view = new DataView(cdHeader.buffer);

    writeUint32LE(view, 0, 0x02014b50); // Central directory header signature (PK\x01\x02)
    writeUint16LE(view, 4, 20); // Version made by
    writeUint16LE(view, 6, 20); // Version needed to extract
    writeUint16LE(view, 8, 0); // General purpose bit flag
    writeUint16LE(view, 10, 0); // Compression method (0 = Store)
    writeUint16LE(view, 12, 0); // File last mod time
    writeUint16LE(view, 14, 0); // File last mod date
    writeUint32LE(view, 16, entry.crc); // CRC-32
    writeUint32LE(view, 20, entry.dataBytes.length); // Compressed size
    writeUint32LE(view, 24, entry.dataBytes.length); // Uncompressed size
    writeUint16LE(view, 28, entry.nameBytes.length); // File name length
    writeUint16LE(view, 30, 0); // Extra field length
    writeUint16LE(view, 32, 0); // File comment length
    writeUint16LE(view, 34, 0); // Disk number start
    writeUint16LE(view, 36, 0); // Internal file attributes
    writeUint32LE(view, 38, 0); // External file attributes
    writeUint32LE(view, 42, entry.offset); // Relative offset of local header

    centralDirectoryHeaders.push(cdHeader, entry.nameBytes);
    currentOffset += cdHeader.length + entry.nameBytes.length;
  }

  const cdSize = currentOffset - cdStartOffset;

  // 3. Build End of Central Directory record (EOCD)
  const eocd = new Uint8Array(22);
  const eocdView = new DataView(eocd.buffer);

  writeUint32LE(eocdView, 0, 0x06054b50); // End of central dir signature (PK\x05\x06)
  writeUint16LE(eocdView, 4, 0); // Number of this disk
  writeUint16LE(eocdView, 6, 0); // Disk with start of central directory
  writeUint16LE(eocdView, 8, fileEntries.length); // Total entries on this disk
  writeUint16LE(eocdView, 10, fileEntries.length); // Total entries in central directory
  writeUint32LE(eocdView, 12, cdSize); // Size of central directory
  writeUint32LE(eocdView, 16, cdStartOffset); // Offset of start of central directory
  writeUint16LE(eocdView, 20, 0); // ZIP file comment length

  // 4. Concatenate all segments into single Uint8Array
  const totalLength = currentOffset + eocd.length;
  const finalZip = new Uint8Array(totalLength);

  let writeCursor = 0;
  for (const chunk of [...localHeadersAndData, ...centralDirectoryHeaders, eocd]) {
    finalZip.set(chunk, writeCursor);
    writeCursor += chunk.length;
  }

  return finalZip;
}

/**
 * Downloads a ZIP archive directly in browser memory.
 */
export function downloadZipArchive(fileName: string, zipBytes: Uint8Array): void {
  const blob = new Blob([zipBytes], { type: 'application/zip' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = fileName;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(url);
}
