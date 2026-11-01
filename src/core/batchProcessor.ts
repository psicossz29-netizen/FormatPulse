import { convert } from './converters';
import { sanitizePII } from './piiSanitizer';
import type { InputFormat, OutputFormat } from '@/types';

// ── Types ────────────────────────────────────────────────────────────────────

export interface BatchInputFile {
  id: string;
  name: string;
  content: string;
  format: InputFormat;
  sizeBytes: number;
}

export interface BatchOutputFile {
  id: string;
  sourceName: string;
  outputName: string;
  content: string;
  success: boolean;
  error?: string;
  outputFormat: OutputFormat;
  processingTimeMs: number;
  outputBytes: number;
}

export interface BatchProcessingReport {
  totalFiles: number;
  successfulFiles: number;
  failedFiles: number;
  totalInputBytes: number;
  totalOutputBytes: number;
  totalDurationMs: number;
  files: BatchOutputFile[];
}

// ── Extension Helper ─────────────────────────────────────────────────────────

export function getFileExtensionForFormat(format: OutputFormat): string {
  switch (format) {
    case 'json':
    case 'json-schema':
      return '.json';
    case 'csv':
      return '.csv';
    case 'yaml':
    case 'openapi':
      return '.yaml';
    case 'typescript':
      return '.ts';
    case 'zod':
      return '.zod.ts';
    case 'sql-ddl':
      return '.sql';
    case 'prisma':
      return '.prisma';
    case 'pydantic':
      return '.py';
    case 'rust':
      return '.rs';
    case 'go':
      return '.go';
    case 'pii-sanitizer':
      return '.sanitized.json';
    default:
      return '.txt';
  }
}

export function deriveOutputFilename(
  originalName: string,
  targetFormat: OutputFormat,
): string {
  const baseName = originalName.replace(/\.[^/.]+$/, '');
  const ext = getFileExtensionForFormat(targetFormat);
  return `${baseName}${ext}`;
}

// ── Batch Runner ─────────────────────────────────────────────────────────────

export async function processBatchFiles(
  inputFiles: BatchInputFile[],
  targetFormat: OutputFormat,
  onProgress?: (completed: number, total: number) => void,
): Promise<BatchProcessingReport> {
  const startTime = performance.now();
  const results: BatchOutputFile[] = [];

  let successfulFiles = 0;
  let failedFiles = 0;
  let totalInputBytes = 0;
  let totalOutputBytes = 0;

  for (let i = 0; i < inputFiles.length; i++) {
    const file = inputFiles[i]!;
    totalInputBytes += file.sizeBytes;
    const outputName = deriveOutputFilename(file.name, targetFormat);

    try {
      if (targetFormat === 'pii-sanitizer') {
        const itemStart = performance.now();
        const piiResult = sanitizePII(file.content, file.format);
        const itemElapsed = performance.now() - itemStart;

        if (piiResult.success) {
          const outBytes = new TextEncoder().encode(piiResult.output).byteLength;
          totalOutputBytes += outBytes;
          successfulFiles++;

          results.push({
            id: file.id,
            sourceName: file.name,
            outputName,
            content: piiResult.output,
            success: true,
            outputFormat: targetFormat,
            processingTimeMs: itemElapsed,
            outputBytes: outBytes,
          });
        } else {
          failedFiles++;
          results.push({
            id: file.id,
            sourceName: file.name,
            outputName,
            content: '',
            success: false,
            error: piiResult.error,
            outputFormat: targetFormat,
            processingTimeMs: itemElapsed,
            outputBytes: 0,
          });
        }
      } else {
        const convResult = convert(file.content, file.format, targetFormat);

        if (convResult.success) {
          totalOutputBytes += convResult.outputBytes;
          successfulFiles++;

          results.push({
            id: file.id,
            sourceName: file.name,
            outputName,
            content: convResult.output,
            success: true,
            outputFormat: targetFormat,
            processingTimeMs: convResult.timeMs,
            outputBytes: convResult.outputBytes,
          });
        } else {
          failedFiles++;
          results.push({
            id: file.id,
            sourceName: file.name,
            outputName,
            content: '',
            success: false,
            error: convResult.error.message,
            outputFormat: targetFormat,
            processingTimeMs: 0,
            outputBytes: 0,
          });
        }
      }
    } catch (err) {
      failedFiles++;
      results.push({
        id: file.id,
        sourceName: file.name,
        outputName,
        content: '',
        success: false,
        error: err instanceof Error ? err.message : String(err),
        outputFormat: targetFormat,
        processingTimeMs: 0,
        outputBytes: 0,
      });
    }

    if (onProgress) {
      onProgress(i + 1, inputFiles.length);
    }
  }

  const totalDurationMs = performance.now() - startTime;

  return {
    totalFiles: inputFiles.length,
    successfulFiles,
    failedFiles,
    totalInputBytes,
    totalOutputBytes,
    totalDurationMs,
    files: results,
  };
}
