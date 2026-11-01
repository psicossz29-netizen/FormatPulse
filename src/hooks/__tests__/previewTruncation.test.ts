import { describe, it, expect } from 'vitest';
import { PRO_PREVIEW_LINES } from '../../services/licenseService';

// Test the preview truncation logic directly (same logic used in useConversion)
function truncateToPreview(output: string): string {
  const lines = output.split('\n');
  if (lines.length <= PRO_PREVIEW_LINES) return output;
  return lines.slice(0, PRO_PREVIEW_LINES).join('\n');
}

describe('PRO Preview Truncation', () => {
  it('does not truncate output with fewer lines than the limit', () => {
    const input = Array.from({ length: 5 }, (_, i) => `line ${i + 1}`).join('\n');
    expect(truncateToPreview(input)).toBe(input);
  });

  it('does not truncate output with exactly PRO_PREVIEW_LINES lines', () => {
    const input = Array.from({ length: PRO_PREVIEW_LINES }, (_, i) => `line ${i + 1}`).join('\n');
    expect(truncateToPreview(input)).toBe(input);
  });

  it('truncates output exceeding PRO_PREVIEW_LINES to exactly that many lines', () => {
    const totalLines = 50;
    const input = Array.from({ length: totalLines }, (_, i) => `line ${i + 1}`).join('\n');
    const result = truncateToPreview(input);
    const resultLines = result.split('\n');
    expect(resultLines.length).toBe(PRO_PREVIEW_LINES);
    expect(resultLines[0]).toBe('line 1');
    expect(resultLines[PRO_PREVIEW_LINES - 1]).toBe(`line ${PRO_PREVIEW_LINES}`);
  });

  it('preserves content of visible lines exactly', () => {
    const lines = [
      'export interface Root {',
      '  id: number;',
      '  name: string;',
      '  email: string;',
      '  phone?: string;',
      '  address: Address;',
      '  tags: string[];',
      '  active: boolean;',
      '  score: number;',
      '  created: string;',
      '  updated: string;',
      '  meta: Record<string, unknown>;',
      '  // This line should be hidden',
      '  // And this one too',
      '}',
    ];
    const input = lines.join('\n');
    const result = truncateToPreview(input);
    expect(result).toBe(lines.slice(0, PRO_PREVIEW_LINES).join('\n'));
  });

  it('PRO_PREVIEW_LINES constant is 12', () => {
    expect(PRO_PREVIEW_LINES).toBe(12);
  });
});
