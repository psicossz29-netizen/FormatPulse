import { describe, it, expect } from 'vitest';
import {
  isFormulaInjectionRisk,
  sanitizeCSVField,
  auditAndSanitizeRecords,
} from '../formulaGuard';

describe('CSV Formula Injection / DDE Defense', () => {
  it('detects formula injection triggers (=, +, -, @, \\t, \\r)', () => {
    expect(isFormulaInjectionRisk('=1+2')).toBe(true);
    expect(isFormulaInjectionRisk('=cmd|"/C calc"!A0')).toBe(true);
    expect(isFormulaInjectionRisk('@SUM(A1:A10)')).toBe(true);
    expect(isFormulaInjectionRisk('+HYPERLINK("http://attacker.com")')).toBe(true);
    expect(isFormulaInjectionRisk('-2+3+cmd|')).toBe(true);
    expect(isFormulaInjectionRisk('\tDDE("cmd";"/C calc")')).toBe(true);
  });

  it('allows legitimate negative and positive numeric values', () => {
    expect(isFormulaInjectionRisk('-42')).toBe(false);
    expect(isFormulaInjectionRisk('-3.14159')).toBe(false);
    expect(isFormulaInjectionRisk('+100')).toBe(false);
    expect(isFormulaInjectionRisk('Normal string without formulas')).toBe(false);
    expect(isFormulaInjectionRisk('')).toBe(false);
  });

  it('neutralizes dangerous formula values by prepending a single quote', () => {
    expect(sanitizeCSVField('=SUM(A1:A5)')).toBe("'=SUM(A1:A5)");
    expect(sanitizeCSVField('@HYPERLINK("evil.com")')).toBe("'@HYPERLINK(\"evil.com\")");
    expect(sanitizeCSVField('safe text')).toBe('safe text');
    expect(sanitizeCSVField('-100')).toBe('-100');
  });

  it('audits and sanitizes an array of records returning threat counts', () => {
    const rawRecords = [
      { name: 'John Doe', salary: '-500', formula: '=cmd|"/C calc"!A0' },
      { name: '@CEO_Malicious', salary: '+2500', note: 'Standard note' },
    ];

    const { sanitizedRecords, threatsNeutralized } = auditAndSanitizeRecords(rawRecords);

    expect(threatsNeutralized).toBe(2); // '=cmd...' and '@CEO_Malicious'
    expect(sanitizedRecords[0]!.formula).toBe("'=cmd|\"/C calc\"!A0");
    expect(sanitizedRecords[1]!.name).toBe("'@CEO_Malicious");
    // Numbers should be preserved
    expect(sanitizedRecords[0]!.salary).toBe('-500');
    expect(sanitizedRecords[1]!.salary).toBe('+2500');
  });
});
