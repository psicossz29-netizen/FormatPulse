import React, { useState, useCallback, useRef } from 'react';
import {
  X,
  Layers,
  UploadCloud,
  FileText,
  Trash2,
  Play,
  CheckCircle2,
  AlertCircle,
  Download,
  Archive,
  Loader2,
  Lock,
} from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import {
  processBatchFiles,
  type BatchInputFile,
  type BatchProcessingReport,
} from '@/core/batchProcessor';
import { createZipArchive, downloadZipArchive } from '@/core/zipEncoder';
import {
  OUTPUT_FORMATS,
  FORMAT_LABELS,
  type OutputFormat,
  type InputFormat,
} from '@/types';
import { cn } from '@/lib/utils';

export const BatchProcessingModal: React.FC = () => {
  const showBatchModal = useAppStore((s) => s.showBatchModal);
  const setShowBatchModal = useAppStore((s) => s.setShowBatchModal);
  const setShowLicenseModal = useAppStore((s) => s.setShowLicenseModal);
  const licenseTier = useAppStore((s) => s.licenseTier);

  const [files, setFiles] = useState<BatchInputFile[]>([]);
  const [targetFormat, setTargetFormat] = useState<OutputFormat>('typescript');
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState({ completed: 0, total: 0 });
  const [report, setReport] = useState<BatchProcessingReport | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const isFree = licenseTier === 'free';
  const MAX_FREE_FILES = 3;

  const handleFileDrop = useCallback((droppedFiles: FileList | null) => {
    if (!droppedFiles || droppedFiles.length === 0) return;

    const newEntries: BatchInputFile[] = [];
    const readers: Promise<void>[] = [];

    Array.from(droppedFiles).forEach((file) => {
      let format: InputFormat = 'json';
      const nameLower = file.name.toLowerCase();
      if (nameLower.endsWith('.csv')) format = 'csv';
      else if (nameLower.endsWith('.yaml') || nameLower.endsWith('.yml')) format = 'yaml';

      const promise = new Promise<void>((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          const content = e.target?.result;
          if (typeof content === 'string') {
            newEntries.push({
              id: crypto.randomUUID(),
              name: file.name,
              content,
              format,
              sizeBytes: file.size,
            });
          }
          resolve();
        };
        reader.onerror = () => resolve();
        reader.readAsText(file);
      });
      readers.push(promise);
    });

    void Promise.all(readers).then(() => {
      setFiles((prev) => [...prev, ...newEntries]);
      setReport(null);
    });
  }, []);

  const handleRemoveFile = useCallback((id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  }, []);

  const handleClearAll = useCallback(() => {
    setFiles([]);
    setReport(null);
    setProgress({ completed: 0, total: 0 });
  }, []);

  const handleRunBatch = useCallback(async () => {
    if (files.length === 0) return;

    const filesToProcess = isFree ? files.slice(0, MAX_FREE_FILES) : files;

    setIsProcessing(true);
    setProgress({ completed: 0, total: filesToProcess.length });
    setReport(null);

    try {
      const res = await processBatchFiles(filesToProcess, targetFormat, (c, t) => {
        setProgress({ completed: c, total: t });
      });
      setReport(res);
    } finally {
      setIsProcessing(false);
    }
  }, [files, targetFormat, isFree]);

  const handleDownloadZip = useCallback(() => {
    if (!report || report.files.length === 0) return;

    const successfulFiles = report.files.filter((f) => f.success);
    if (successfulFiles.length === 0) return;

    const zipInputs = successfulFiles.map((f) => ({
      name: f.outputName,
      content: f.content,
    }));

    const zipBytes = createZipArchive(zipInputs);
    downloadZipArchive(`formatpulse-batch-${targetFormat}.zip`, zipBytes);
  }, [report, targetFormat]);

  const handleDownloadSingle = useCallback((name: string, content: string) => {
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = name;
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
    URL.revokeObjectURL(url);
  }, []);

  if (!showBatchModal) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-label="FormatPulse Batch Processing Engine"
    >
      {/* ── Backdrop ────────────────────────────────────────────────── */}
      <div
        className="fixed inset-0 bg-zinc-950/85 backdrop-blur-sm transition-opacity"
        onClick={() => setShowBatchModal(false)}
      />

      {/* ── Modal Window ────────────────────────────────────────────── */}
      <div className="relative w-full max-w-2xl bg-zinc-900 border border-zinc-800 shadow-2xl rounded-xs overflow-hidden my-auto flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between h-10 px-4 border-b border-zinc-800 bg-zinc-950 shrink-0">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-accent" strokeWidth={2} />
            <span className="text-xs font-semibold text-zinc-200 tracking-tight">
              Batch Processing & Multi-File Engine
            </span>
            <span className="text-2xs font-mono px-1.5 py-0.5 rounded-xs bg-zinc-800 text-zinc-400">
              {files.length} FILES
            </span>
          </div>
          <button
            onClick={() => setShowBatchModal(false)}
            className="w-6 h-6 flex items-center justify-center text-zinc-500 hover:text-zinc-200 hover:bg-zinc-800 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent rounded-xs"
            aria-label="Close"
          >
            <X className="w-4 h-4" strokeWidth={2} />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 space-y-4 overflow-y-auto flex-1">
          {/* Controls Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-zinc-950 border border-zinc-800 rounded-xs">
            <div className="flex items-center gap-2">
              <span className="text-2xs font-mono text-zinc-400 uppercase">Target:</span>
              <select
                value={targetFormat}
                onChange={(e) => setTargetFormat(e.target.value as OutputFormat)}
                disabled={isProcessing}
                className="h-7 px-2 bg-zinc-900 border border-zinc-700 text-xs font-mono text-zinc-200 rounded-xs focus:outline-none focus:ring-1 focus:ring-accent"
              >
                {OUTPUT_FORMATS.map((fmt) => (
                  <option key={fmt} value={fmt}>
                    {FORMAT_LABELS[fmt]}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2">
              {files.length > 0 && (
                <button
                  type="button"
                  onClick={handleClearAll}
                  disabled={isProcessing}
                  className="h-7 px-2.5 text-2xs font-mono text-zinc-400 hover:text-red-400 transition-colors"
                >
                  Clear List
                </button>
              )}
              <button
                type="button"
                onClick={() => void handleRunBatch()}
                disabled={isProcessing || files.length === 0}
                className="flex items-center gap-1.5 h-7 px-3 bg-accent hover:bg-accent-hover text-white text-xs font-semibold rounded-xs transition-colors disabled:opacity-50"
              >
                {isProcessing ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Play className="w-3.5 h-3.5 fill-current" />
                )}
                <span>Run Batch Conversion</span>
              </button>
            </div>
          </div>

          {/* Free Tier Notice */}
          {isFree && files.length > MAX_FREE_FILES && (
            <div className="flex items-center justify-between p-2.5 bg-amber-950/40 border border-amber-800/80 rounded-xs text-2xs font-mono text-amber-300">
              <div className="flex items-center gap-2">
                <Lock className="w-3.5 h-3.5 text-amber-400" />
                <span>Free Tier converts up to {MAX_FREE_FILES} files. Upgrade to PRO for unlimited batch processing.</span>
              </div>
              <button
                type="button"
                onClick={() => {
                  setShowBatchModal(false);
                  setShowLicenseModal(true);
                }}
                className="text-accent underline font-semibold hover:text-accent-hover ml-2"
              >
                Upgrade ($14)
              </button>
            </div>
          )}

          {/* Drag & Drop Area */}
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={(e) => {
              e.preventDefault();
              setIsDragging(false);
              handleFileDrop(e.dataTransfer.files);
            }}
            onClick={() => fileInputRef.current?.click()}
            className={cn(
              'border-2 border-dashed rounded-xs p-6 text-center cursor-pointer transition-colors',
              isDragging
                ? 'border-accent bg-accent/5'
                : 'border-zinc-800 hover:border-zinc-700 bg-zinc-950/50',
            )}
          >
            <input
              type="file"
              ref={fileInputRef}
              multiple
              accept=".json,.csv,.yaml,.yml,.txt"
              className="hidden"
              onChange={(e) => handleFileDrop(e.target.files)}
            />
            <UploadCloud className="w-8 h-8 text-zinc-500 mx-auto mb-2" />
            <p className="text-xs font-medium text-zinc-300">
              Drag & drop files here, or <span className="text-accent underline">browse</span>
            </p>
            <p className="text-2xs text-zinc-500 font-mono mt-1">
              Supports JSON, CSV, YAML files simultaneously (Air-Gapped Local Execution)
            </p>
          </div>

          {/* Progress Indicator */}
          {isProcessing && (
            <div className="space-y-1.5 p-3 bg-zinc-950 border border-zinc-800 rounded-xs font-mono text-2xs">
              <div className="flex justify-between text-zinc-400">
                <span>Processing batch files...</span>
                <span className="text-accent">
                  {progress.completed} / {progress.total}
                </span>
              </div>
              <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-accent transition-all duration-200"
                  style={{
                    width: `${progress.total > 0 ? (progress.completed / progress.total) * 100 : 0}%`,
                  }}
                />
              </div>
            </div>
          )}

          {/* Results Summary & ZIP Action */}
          {report && (
            <div className="p-3 bg-emerald-950/30 border border-emerald-900/60 rounded-xs space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span className="text-xs font-semibold text-emerald-300">
                    Batch Completed: {report.successfulFiles} / {report.totalFiles} Success
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleDownloadZip}
                  className="flex items-center gap-1.5 h-7 px-3 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-xs transition-colors"
                >
                  <Archive className="w-3.5 h-3.5" />
                  <span>Download All as .ZIP</span>
                </button>
              </div>

              <div className="flex gap-4 text-3xs font-mono text-zinc-400 pt-1 border-t border-emerald-900/40">
                <span>Duration: {report.totalDurationMs.toFixed(1)} ms</span>
                <span>Output: {(report.totalOutputBytes / 1024).toFixed(1)} KB</span>
                {report.failedFiles > 0 && (
                  <span className="text-red-400">{report.failedFiles} Failed</span>
                )}
              </div>
            </div>
          )}

          {/* Files List Table */}
          {files.length > 0 && (
            <div className="border border-zinc-800 divide-y divide-zinc-800 rounded-xs bg-zinc-950/50 max-h-60 overflow-y-auto font-mono text-2xs">
              {files.map((file) => {
                const fileReport = report?.files.find((f) => f.id === file.id);

                return (
                  <div
                    key={file.id}
                    className="flex items-center justify-between p-2.5 hover:bg-zinc-900/50 transition-colors"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <FileText className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
                      <span className="text-zinc-200 truncate">{file.name}</span>
                      <span className="text-zinc-600">({(file.sizeBytes / 1024).toFixed(1)} KB)</span>
                      <span className="text-3xs uppercase px-1 py-0.5 bg-zinc-800 text-zinc-400 rounded-xs">
                        {file.format}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {fileReport ? (
                        fileReport.success ? (
                          <div className="flex items-center gap-2">
                            <span className="text-emerald-400 flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3" />
                              OK
                            </span>
                            <button
                              type="button"
                              onClick={() => handleDownloadSingle(fileReport.outputName, fileReport.content)}
                              className="text-zinc-400 hover:text-white p-1"
                              title="Download single output"
                            >
                              <Download className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ) : (
                          <span className="text-red-400 flex items-center gap-1" title={fileReport.error}>
                            <AlertCircle className="w-3 h-3" />
                            Error
                          </span>
                        )
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleRemoveFile(file.id)}
                          disabled={isProcessing}
                          className="text-zinc-600 hover:text-red-400 p-1 transition-colors"
                          title="Remove file"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
