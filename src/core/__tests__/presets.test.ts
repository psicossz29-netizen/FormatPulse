import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { PRESETS, getPreset, detectPresetFromURL, applySEO } from '../presets';
import { parseJSON, parseCSV, parseYAML } from '../converters';

describe('SEO & Presets Engine', () => {
  const originalLocation = window.location;

  beforeEach(() => {
    // Reset document title and meta description
    document.title = 'Default Title';
    let meta = document.querySelector('meta[name="description"]');
    if (!meta) {
      meta = document.createElement('meta');
      meta.setAttribute('name', 'description');
      document.head.appendChild(meta);
    }
    meta.setAttribute('content', 'Default Description');
  });

  afterEach(() => {
    // Restore window.location
    window.location = originalLocation;
  });

  it('contains all required programmatic SEO presets', () => {
    const requiredKeys = [
      'json-to-typescript',
      'json-to-zod',
      'csv-to-sql',
      'pii-sanitizer',
      'json-to-csv',
      'csv-to-json',
      'json-to-yaml',
      'yaml-to-json',
      'json-to-jsonschema',
      'json-to-openapi',
      'json-to-prisma',
      'json-to-pydantic',
      'json-to-rust',
      'json-to-go',
    ];

    for (const key of requiredKeys) {
      expect(PRESETS[key]).toBeDefined();
      expect(PRESETS[key]!.id).toBe(key);
      expect(PRESETS[key]!.name).toBeTruthy();
      expect(PRESETS[key]!.pageTitle).toContain('FormatPulse');
      expect(PRESETS[key]!.metaDescription).toBeTruthy();
    }
  });

  it('guarantees every preset sample input is valid syntax for its declared inputFormat', () => {
    for (const preset of Object.values(PRESETS)) {
      if (preset.inputFormat === 'json') {
        expect(() => parseJSON(preset.sampleInput)).not.toThrow();
      } else if (preset.inputFormat === 'csv') {
        expect(() => parseCSV(preset.sampleInput)).not.toThrow();
      } else if (preset.inputFormat === 'yaml') {
        expect(() => parseYAML(preset.sampleInput)).not.toThrow();
      }
    }
  });

  it('getPreset returns matching preset or null for unknown ID', () => {
    expect(getPreset('json-to-typescript')?.name).toBe('JSON to TypeScript');
    expect(getPreset('unknown-preset-xyz')).toBeNull();
  });

  it('detectPresetFromURL correctly extracts tool parameter from window.location', () => {
    // Mock window.location.search
    delete (window as unknown as { location: unknown }).location;
    window.location = new URL('https://formatpulse.dev/?tool=json-to-zod') as unknown as Location;

    const detected = detectPresetFromURL();
    expect(detected).not.toBeNull();
    expect(detected?.id).toBe('json-to-zod');
    expect(detected?.outputFormat).toBe('zod');
  });

  it('detectPresetFromURL returns null when parameter is missing or invalid', () => {
    delete (window as unknown as { location: unknown }).location;
    window.location = new URL('https://formatpulse.dev/?tool=invalid-tool') as unknown as Location;

    expect(detectPresetFromURL()).toBeNull();
  });

  it('applySEO updates document.title and meta[name="description"] dynamically', () => {
    const preset = PRESETS['pii-sanitizer']!;
    applySEO(preset);

    expect(document.title).toBe(preset.pageTitle);
    const meta = document.querySelector('meta[name="description"]');
    expect(meta?.getAttribute('content')).toBe(preset.metaDescription);
  });
});
