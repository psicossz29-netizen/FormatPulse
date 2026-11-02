import { create } from 'zustand';
import type { InputFormat, OutputFormat } from '@/types';
import { type Language, detectLanguage, persistLanguage } from '@/core/i18n';

// ── Types ────────────────────────────────────────────────────────────────────

export type ThemeAccent = 'orange' | 'emerald' | 'cyan' | 'zinc';
export type IndentSize = 2 | 4 | 'tab';
export type EditorFontSize = 12 | 13 | 14 | 16;
export type PiiMaskingMode = 'redact' | 'mask' | 'fake';

export interface UserSettings {
  // ── General ────────────────────────────────────────────────────────────────
  autoFormatOnPaste: boolean;
  autoDetectFormat: boolean;
  defaultInputFormat: InputFormat;
  defaultOutputFormat: OutputFormat;
  indentSize: IndentSize;
  trimWhitespace: boolean;

  // ── Editor & Appearance ────────────────────────────────────────────────────
  themeAccent: ThemeAccent;
  fontSize: EditorFontSize;
  fontFamily: 'jetbrains' | 'fira' | 'mono';
  lineNumbers: boolean;
  wordWrap: boolean;
  showMinimap: boolean;

  // ── Security & Privacy ─────────────────────────────────────────────────────
  piiMaskingMode: PiiMaskingMode;
  customRedactionRules: string;
  formulaGuard: boolean;
  airGappedMode: boolean;

  // ── Performance & Workers ──────────────────────────────────────────────────
  workerThresholdBytes: number;
  streamOutput: boolean;
  maxHistoryItems: number;

  // ── Application ────────────────────────────────────────────────────────────
  autoCheckUpdates: boolean;
  confirmClearWorkspace: boolean;

  // ── Localisation ───────────────────────────────────────────────────────────
  language: Language;
}

export interface SettingsStore extends UserSettings {
  updateSettings: (partial: Partial<UserSettings>) => void;
  resetToDefaults: () => void;
  setLanguage: (lang: Language) => void;
}

// ── Default Settings ─────────────────────────────────────────────────────────

export const DEFAULT_SETTINGS: UserSettings = {
  autoFormatOnPaste: true,
  autoDetectFormat: true,
  defaultInputFormat: 'json',
  defaultOutputFormat: 'typescript',
  indentSize: 2,
  trimWhitespace: true,

  themeAccent: 'orange',
  fontSize: 13,
  fontFamily: 'jetbrains',
  lineNumbers: true,
  wordWrap: true,
  showMinimap: false,

  piiMaskingMode: 'mask',
  customRedactionRules: '',
  formulaGuard: true,
  airGappedMode: false,

  workerThresholdBytes: 102400, // 100 KB
  streamOutput: true,
  maxHistoryItems: 25,

  autoCheckUpdates: true,
  confirmClearWorkspace: true,

  language: 'en', // Will be overridden by detectLanguage() at load time
};

const STORAGE_KEY = 'formatpulse_user_settings_v1';

function loadPersistedSettings(): UserSettings {
  if (typeof window === 'undefined') return { ...DEFAULT_SETTINGS, language: 'en' };
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...DEFAULT_SETTINGS, language: detectLanguage() };
    const parsed = JSON.parse(raw);
    return { ...DEFAULT_SETTINGS, language: detectLanguage(), ...parsed };
  } catch {
    return { ...DEFAULT_SETTINGS, language: detectLanguage() };
  }
}

function persistSettings(settings: UserSettings): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  } catch {
    // Ignore quota or private browsing errors
  }
}

// ── Store ────────────────────────────────────────────────────────────────────

export const useSettingsStore = create<SettingsStore>((set) => ({
  ...loadPersistedSettings(),

  updateSettings: (partial) => {
    set((state) => {
      const updated = { ...state, ...partial };
      // Save data values
      const dataToSave: UserSettings = {
        autoFormatOnPaste: updated.autoFormatOnPaste,
        autoDetectFormat: updated.autoDetectFormat,
        defaultInputFormat: updated.defaultInputFormat,
        defaultOutputFormat: updated.defaultOutputFormat,
        indentSize: updated.indentSize,
        trimWhitespace: updated.trimWhitespace,
        themeAccent: updated.themeAccent,
        fontSize: updated.fontSize,
        fontFamily: updated.fontFamily,
        lineNumbers: updated.lineNumbers,
        wordWrap: updated.wordWrap,
        showMinimap: updated.showMinimap,
        piiMaskingMode: updated.piiMaskingMode,
        customRedactionRules: updated.customRedactionRules,
        formulaGuard: updated.formulaGuard,
        airGappedMode: updated.airGappedMode,
        workerThresholdBytes: updated.workerThresholdBytes,
        streamOutput: updated.streamOutput,
        maxHistoryItems: updated.maxHistoryItems,
        autoCheckUpdates: updated.autoCheckUpdates,
        confirmClearWorkspace: updated.confirmClearWorkspace,
        language: updated.language,
      };
      persistSettings(dataToSave);
      return partial;
    });
  },

  setLanguage: (lang: Language) => {
    persistLanguage(lang);
    set({ language: lang });
  },

  resetToDefaults: () => {
    persistSettings({ ...DEFAULT_SETTINGS, language: detectLanguage() });
    set({ ...DEFAULT_SETTINGS, language: detectLanguage() });
  },
}));
