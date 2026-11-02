import { describe, it, expect, beforeEach } from 'vitest';
import {
  detectLanguage,
  t,
  createTranslator,
  translations,
  persistLanguage,
} from '@/core/i18n';

// Mock localStorage in JSDOM
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (k: string) => store[k] ?? null,
    setItem: (k: string, v: string) => { store[k] = v; },
    removeItem: (k: string) => { delete store[k]; },
    clear: () => { store = {}; },
  };
})();

Object.defineProperty(globalThis, 'localStorage', { value: localStorageMock });

describe('i18n — detectLanguage()', () => {
  beforeEach(() => localStorageMock.clear());

  it('returns persisted language from localStorage', () => {
    localStorageMock.setItem('formatpulse_language_v1', 'en');
    expect(detectLanguage()).toBe('en');
  });

  it('returns "es" for Spanish navigator.language', () => {
    localStorageMock.clear();
    Object.defineProperty(navigator, 'language', { value: 'es-AR', configurable: true });
    expect(detectLanguage()).toBe('es');
  });

  it('returns "en" for English navigator.language', () => {
    localStorageMock.clear();
    Object.defineProperty(navigator, 'language', { value: 'en-US', configurable: true });
    expect(detectLanguage()).toBe('en');
  });
});

describe('i18n — t()', () => {
  it('translates hero_h1 to Spanish', () => {
    const result = t('hero_h1', 'es');
    expect(result).toContain('Convierte');
    expect(result).toContain('máquina');
  });

  it('translates hero_h1 to English', () => {
    const result = t('hero_h1', 'en');
    expect(result).toContain('Convert');
    expect(result).toContain('machine');
  });

  it('translates nav_launch to Spanish', () => {
    expect(t('nav_launch', 'es')).toBe('Abrir Workspace');
  });

  it('translates nav_launch to English', () => {
    expect(t('nav_launch', 'en')).toBe('Launch Workspace');
  });
});

describe('i18n — createTranslator()', () => {
  it('creates a bound translator for ES', () => {
    const tr = createTranslator('es');
    expect(tr('guided_title')).toBe('¿Qué quieres hacer hoy?');
  });

  it('creates a bound translator for EN', () => {
    const tr = createTranslator('en');
    expect(tr('guided_title')).toBe('What do you want to do today?');
  });
});

describe('i18n — all translation keys have ES and EN', () => {
  it('every key has both es and en strings', () => {
    const keys = Object.keys(translations) as (keyof typeof translations)[];
    for (const key of keys) {
      const entry = translations[key];
      expect(typeof entry.es, `key "${key}" missing es`).toBe('string');
      expect(typeof entry.en, `key "${key}" missing en`).toBe('string');
      expect(entry.es.length, `key "${key}" es is empty`).toBeGreaterThan(0);
      expect(entry.en.length, `key "${key}" en is empty`).toBeGreaterThan(0);
    }
  });
});

describe('i18n — persistLanguage()', () => {
  beforeEach(() => localStorageMock.clear());

  it('stores "es" in localStorage', () => {
    persistLanguage('es');
    expect(localStorageMock.getItem('formatpulse_language_v1')).toBe('es');
  });

  it('stores "en" in localStorage', () => {
    persistLanguage('en');
    expect(localStorageMock.getItem('formatpulse_language_v1')).toBe('en');
  });
});
