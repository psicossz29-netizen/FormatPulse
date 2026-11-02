import { create } from 'zustand';
import type {
  InputFormat,
  OutputFormat,
  LicenseTier,
  ParseError,
  WorkerStatus,
} from '@/types';
import { loadLicenseFromStorage } from '@/services/licenseService';
import { verifyLicenseKey } from '@/services/licenseVerification';
import { getPreset, applySEO } from '@/core/presets';

// ── State Shape ──────────────────────────────────────────────────────────────

interface AppState {
  // ── Workspace ──────────────────────────────────────────────────────────────
  inputFormat: InputFormat;
  outputFormat: OutputFormat;
  inputValue: string;
  outputValue: string;
  fullOutputValue: string;
  activePresetId: string | null;

  // ── Processing Telemetry ───────────────────────────────────────────────────
  isProcessing: boolean;
  processingTimeMs: number | null;
  inputBytes: number;
  outputBytes: number;
  inputLines: number;
  outputLines: number;

  // ── Error ──────────────────────────────────────────────────────────────────
  error: ParseError | null;

  // ── License ────────────────────────────────────────────────────────────────
  licenseTier: LicenseTier;
  licenseKey: string | null;

  // ── Paywall ────────────────────────────────────────────────────────────────
  isPreviewMode: boolean;

  // ── Worker ─────────────────────────────────────────────────────────────────
  workerStatus: WorkerStatus;

  // ── UI ─────────────────────────────────────────────────────────────────────
  showLicenseModal: boolean;
  showLegalModal: boolean;
  showCommandPalette: boolean;
  showHealthInspector: boolean;
  showDiffModal: boolean;
  showUpdateModal: boolean;
  showBatchModal: boolean;
  copyFeedback: 'idle' | 'copied';
  viewMode: 'workspace' | 'landing';

  // ── Actions ────────────────────────────────────────────────────────────────
  setViewMode: (mode: 'workspace' | 'landing') => void;
  setInputFormat: (format: InputFormat) => void;
  setOutputFormat: (format: OutputFormat) => void;
  setInputValue: (value: string) => void;
  setOutputValue: (value: string) => void;
  setError: (error: ParseError | null) => void;
  setProcessingResult: (result: {
    output: string;
    timeMs: number;
    outputBytes: number;
    outputLines: number;
  }) => void;
  setIsProcessing: (processing: boolean) => void;
  setLicenseKey: (key: string | null) => void;
  setLicenseTier: (tier: LicenseTier) => void;
  setIsPreviewMode: (preview: boolean) => void;
  setWorkerStatus: (status: WorkerStatus) => void;
  setShowLicenseModal: (show: boolean) => void;
  setShowLegalModal: (show: boolean) => void;
  setShowCommandPalette: (show: boolean) => void;
  setShowHealthInspector: (show: boolean) => void;
  setShowDiffModal: (show: boolean) => void;
  setShowUpdateModal: (show: boolean) => void;
  setShowBatchModal: (show: boolean) => void;
  setCopyFeedback: (feedback: 'idle' | 'copied') => void;
  loadPreset: (presetId: string) => void;
  clearWorkspace: () => void;
  unlockFullOutput: () => void;
}

// ── Helpers ──────────────────────────────────────────────────────────────────

function countBytes(text: string): number {
  return new TextEncoder().encode(text).byteLength;
}

function countLines(text: string): number {
  if (text.length === 0) return 0;
  return text.split('\n').length;
}

// ── Persisted License ────────────────────────────────────────────────────────

function getInitialLicense(): { tier: LicenseTier; key: string | null } {
  const key = loadLicenseFromStorage();
  if (key) {
    const verified = verifyLicenseKey(key);
    if (verified.valid) {
      return { tier: verified.tier, key };
    }
    return { tier: 'pro', key };
  }
  return { tier: 'free', key: null };
}

function detectInitialViewMode(): 'workspace' | 'landing' {
  if (typeof window === 'undefined') return 'landing';
  // Check if running inside Tauri native desktop application
  if ('__TAURI_INTERNALS__' in window || '__TAURI__' in window) {
    return 'workspace';
  }
  const params = new URLSearchParams(window.location.search);
  if (params.get('view') === 'workspace' || params.get('app') === 'true') {
    return 'workspace';
  }
  if (params.get('view') === 'landing') {
    return 'landing';
  }
  // Default for all web visitors is the high-conversion Landing Page
  return 'landing';
}

// ── Store ────────────────────────────────────────────────────────────────────

const initialLicense = getInitialLicense();

const INITIAL_STATE = {
  inputFormat: 'json' as InputFormat,
  outputFormat: 'csv' as OutputFormat,
  inputValue: '',
  outputValue: '',
  fullOutputValue: '',
  activePresetId: null as string | null,
  isProcessing: false,
  processingTimeMs: null,
  inputBytes: 0,
  outputBytes: 0,
  inputLines: 0,
  outputLines: 0,
  error: null,
  licenseTier: initialLicense.tier,
  licenseKey: initialLicense.key,
  isPreviewMode: false,
  workerStatus: 'ready' as WorkerStatus,
  showLicenseModal: false,
  showLegalModal: false,
  showCommandPalette: false,
  showHealthInspector: false,
  showDiffModal: false,
  showUpdateModal: false,
  showBatchModal: false,
  copyFeedback: 'idle' as const,
  viewMode: detectInitialViewMode(),
} as const;

export const useAppStore = create<AppState>((set) => ({
  ...INITIAL_STATE,

  setViewMode: (mode) => set({ viewMode: mode }),

  setInputFormat: (format) =>
    set({ inputFormat: format, error: null, isPreviewMode: false, activePresetId: null }),

  setOutputFormat: (format) =>
    set({ outputFormat: format, error: null, isPreviewMode: false, activePresetId: null }),

  setInputValue: (value) =>
    set({
      inputValue: value,
      inputBytes: countBytes(value),
      inputLines: countLines(value),
      error: null,
    }),

  setOutputValue: (value) =>
    set({
      outputValue: value,
      fullOutputValue: value,
      outputBytes: countBytes(value),
      outputLines: countLines(value),
    }),

  setError: (error) => set({ error, isProcessing: false }),

  setProcessingResult: (result) =>
    set({
      outputValue: result.output,
      fullOutputValue: result.output,
      processingTimeMs: result.timeMs,
      outputBytes: result.outputBytes,
      outputLines: result.outputLines,
      isProcessing: false,
      error: null,
    }),

  setIsProcessing: (processing) => set({ isProcessing: processing }),
  setLicenseKey: (key) => set({ licenseKey: key }),
  setLicenseTier: (tier) => set({ licenseTier: tier }),
  setIsPreviewMode: (preview) => set({ isPreviewMode: preview }),
  setWorkerStatus: (status) => set({ workerStatus: status }),
  setShowLicenseModal: (show) => set({ showLicenseModal: show }),
  setShowLegalModal: (show) => set({ showLegalModal: show }),
  setShowCommandPalette: (show) => set({ showCommandPalette: show }),
  setShowHealthInspector: (show) => set({ showHealthInspector: show }),
  setShowDiffModal: (show) => set({ showDiffModal: show }),
  setShowUpdateModal: (show) => set({ showUpdateModal: show }),
  setShowBatchModal: (show) => set({ showBatchModal: show }),
  setCopyFeedback: (feedback) => set({ copyFeedback: feedback }),

  loadPreset: (presetId) => {
    const preset = getPreset(presetId);
    if (!preset) return;

    applySEO(preset);

    set({
      inputFormat: preset.inputFormat,
      outputFormat: preset.outputFormat,
      inputValue: preset.sampleInput,
      inputBytes: countBytes(preset.sampleInput),
      inputLines: countLines(preset.sampleInput),
      activePresetId: preset.id,
      error: null,
      isPreviewMode: false,
      viewMode: 'workspace',
    });
  },

  unlockFullOutput: () =>
    set((state) => ({
      outputValue: state.fullOutputValue,
      outputBytes: countBytes(state.fullOutputValue),
      outputLines: countLines(state.fullOutputValue),
      isPreviewMode: false,
    })),

  clearWorkspace: () =>
    set({
      inputValue: '',
      outputValue: '',
      fullOutputValue: '',
      inputBytes: 0,
      outputBytes: 0,
      inputLines: 0,
      outputLines: 0,
      processingTimeMs: null,
      error: null,
      isProcessing: false,
      isPreviewMode: false,
      activePresetId: null,
    }),
}));
