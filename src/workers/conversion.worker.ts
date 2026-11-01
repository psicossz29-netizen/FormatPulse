import { convert } from '@/core/converters';
import { sanitizePII } from '@/core/piiSanitizer';
import type { InputFormat, OutputFormat } from '@/types';

// ── Worker Message Protocol ──────────────────────────────────────────────────

interface ConvertRequest {
  type: 'convert';
  id: string;
  input: string;
  inputFormat: InputFormat;
  outputFormat: OutputFormat;
}

interface ConvertResponse {
  type: 'result' | 'error';
  id: string;
  output?: string;
  timeMs?: number;
  outputBytes?: number;
  outputLines?: number;
  error?: { message: string; line: number | null; column: number | null };
}

// ── Worker Handler ───────────────────────────────────────────────────────────

self.onmessage = (event: MessageEvent<ConvertRequest>) => {
  const { id, input, inputFormat, outputFormat } = event.data;

  try {
    if (outputFormat === 'pii-sanitizer') {
      const start = performance.now();
      const result = sanitizePII(input, inputFormat);
      const elapsed = performance.now() - start;

      if (result.success) {
        const encoder = new TextEncoder();
        const response: ConvertResponse = {
          type: 'result',
          id,
          output: result.output,
          timeMs: elapsed,
          outputBytes: encoder.encode(result.output).byteLength,
          outputLines: result.output.split('\n').length,
        };
        self.postMessage(response);
      } else {
        const response: ConvertResponse = {
          type: 'error',
          id,
          error: { message: result.error, line: null, column: null },
        };
        self.postMessage(response);
      }
      return;
    }

    const result = convert(input, inputFormat, outputFormat);

    if (result.success) {
      const response: ConvertResponse = {
        type: 'result',
        id,
        output: result.output,
        timeMs: result.timeMs,
        outputBytes: result.outputBytes,
        outputLines: result.outputLines,
      };
      self.postMessage(response);
    } else {
      const response: ConvertResponse = {
        type: 'error',
        id,
        error: result.error,
      };
      self.postMessage(response);
    }
  } catch (err) {
    const response: ConvertResponse = {
      type: 'error',
      id,
      error: {
        message: err instanceof Error ? err.message : String(err),
        line: null,
        column: null,
      },
    };
    self.postMessage(response);
  }
};
