import { useEffect, useRef } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { convert } from '@/core/converters';
import { sanitizePII } from '@/core/piiSanitizer';
import { isProFormat } from '@/types';
import { FREE_TIER_MAX_BYTES, PRO_PREVIEW_LINES } from '@/services/licenseService';

// ── Size threshold for offloading to Web Worker ──────────────────────────────
const WORKER_THRESHOLD_BYTES = 512 * 1024; // 512 KB

// ── Preview truncation ───────────────────────────────────────────────────────

function truncateToPreview(output: string): string {
  const lines = output.split('\n');
  if (lines.length <= PRO_PREVIEW_LINES) return output;
  return lines.slice(0, PRO_PREVIEW_LINES).join('\n');
}

export function useConversion(): void {
  const inputValue = useAppStore((s) => s.inputValue);
  const inputFormat = useAppStore((s) => s.inputFormat);
  const outputFormat = useAppStore((s) => s.outputFormat);
  const licenseTier = useAppStore((s) => s.licenseTier);
  const setProcessingResult = useAppStore((s) => s.setProcessingResult);
  const setError = useAppStore((s) => s.setError);
  const setIsProcessing = useAppStore((s) => s.setIsProcessing);
  const setWorkerStatus = useAppStore((s) => s.setWorkerStatus);
  const setIsPreviewMode = useAppStore((s) => s.setIsPreviewMode);
  const setShowLicenseModal = useAppStore((s) => s.setShowLicenseModal);
  const clearWorkspace = useAppStore((s) => s.clearWorkspace);

  const workerRef = useRef<Worker | null>(null);

  // Initialize Web Worker once
  useEffect(() => {
    try {
      const worker = new Worker(
        new URL('../workers/conversion.worker.ts', import.meta.url),
        { type: 'module' },
      );
      workerRef.current = worker;
      setWorkerStatus('ready');

      worker.onmessage = (event: MessageEvent) => {
        const data = event.data as {
          type: string;
          output?: string;
          timeMs?: number;
          outputBytes?: number;
          outputLines?: number;
          error?: { message: string; line: number | null; column: number | null };
        };
        if (data.type === 'result' && data.output != null) {
          setProcessingResult({
            output: data.output,
            timeMs: data.timeMs ?? 0,
            outputBytes: data.outputBytes ?? 0,
            outputLines: data.outputLines ?? 0,
          });
          setWorkerStatus('ready');
        } else if (data.type === 'error' && data.error) {
          setError(data.error);
          setWorkerStatus('ready');
        }
      };

      worker.onerror = () => {
        setWorkerStatus('idle');
      };

      return () => {
        worker.terminate();
        workerRef.current = null;
      };
    } catch {
      setWorkerStatus('idle');
      return undefined;
    }
  }, [setWorkerStatus, setProcessingResult, setError]);

  // Run conversion on input change (debounced)
  useEffect(() => {
    if (!inputValue.trim()) {
      clearWorkspace();
      return;
    }

    const timer = setTimeout(() => {
      setIsProcessing(true);

      const inputBytes = new TextEncoder().encode(inputValue).byteLength;

      // ── Free Tier: 1 MB limit ────────────────────────────────────────
      if (licenseTier === 'free' && inputBytes > FREE_TIER_MAX_BYTES) {
        setError({
          message: `File size (${(inputBytes / 1024 / 1024).toFixed(1)} MB) exceeds the Free Tier limit of 1 MB. Activate a PRO license for unlimited processing.`,
          line: null,
          column: null,
        });
        setShowLicenseModal(true);
        return;
      }

      const useWorker = inputBytes > WORKER_THRESHOLD_BYTES && workerRef.current;

      if (useWorker) {
        setWorkerStatus('processing');
        workerRef.current!.postMessage({
          type: 'convert',
          id: crypto.randomUUID(),
          input: inputValue,
          inputFormat,
          outputFormat,
        });
        return;
      }

      // Main thread conversion
      try {
        if (outputFormat === 'pii-sanitizer') {
          const start = performance.now();
          const result = sanitizePII(inputValue, inputFormat);
          const elapsed = performance.now() - start;

          if (result.success) {
            const encoder = new TextEncoder();
            const output = result.output;

            // ── PRO paywall: preview mode ──────────────────────────────
            if (licenseTier === 'free') {
              const preview = truncateToPreview(output);
              setProcessingResult({
                output: preview,
                timeMs: elapsed,
                outputBytes: encoder.encode(output).byteLength,
                outputLines: output.split('\n').length,
              });
              // Store full output for unlock
              useAppStore.setState({ fullOutputValue: output });
              setIsPreviewMode(true);
              return;
            }

            setProcessingResult({
              output,
              timeMs: elapsed,
              outputBytes: encoder.encode(output).byteLength,
              outputLines: output.split('\n').length,
            });
            setIsPreviewMode(false);
          } else {
            setError({ message: result.error, line: null, column: null });
          }
          return;
        }

        const result = convert(inputValue, inputFormat, outputFormat);
        if (result.success) {
          // ── PRO paywall: Try-Before-You-Buy ────────────────────────
          if (licenseTier === 'free' && isProFormat(outputFormat)) {
            const preview = truncateToPreview(result.output);
            setProcessingResult({
              output: preview,
              timeMs: result.timeMs,
              outputBytes: result.outputBytes,
              outputLines: result.outputLines,
            });
            useAppStore.setState({ fullOutputValue: result.output });
            setIsPreviewMode(true);
          } else {
            setProcessingResult({
              output: result.output,
              timeMs: result.timeMs,
              outputBytes: result.outputBytes,
              outputLines: result.outputLines,
            });
            setIsPreviewMode(false);
          }
        } else {
          setError(result.error);
        }
      } catch (err) {
        setError({
          message: err instanceof Error ? err.message : String(err),
          line: null,
          column: null,
        });
      }
    }, 150);

    return () => clearTimeout(timer);
  }, [inputValue, inputFormat, outputFormat, licenseTier, setIsProcessing, setProcessingResult, setError, setWorkerStatus, setIsPreviewMode, setShowLicenseModal, clearWorkspace]);
}
