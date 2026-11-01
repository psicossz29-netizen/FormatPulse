import { describe, it, expect } from 'vitest';
import {
  getSyntheticName,
  getSyntheticEmail,
  getSyntheticPhone,
  getSyntheticIP,
  sanitizeWithSynthetics,
  applyCustomRules,
} from '../syntheticSanitizer';

describe('Synthetic Sanitizer & Custom Rules Engine', () => {
  it('generates deterministic synthetic names', () => {
    const name1 = getSyntheticName('John Doe');
    const name2 = getSyntheticName('John Doe');
    const name3 = getSyntheticName('Jane Smith');

    expect(name1).toBe(name2);
    expect(typeof name1).toBe('string');
    expect(name1.length).toBeGreaterThan(3);
    expect(name1).not.toBe(name3);
  });

  it('generates deterministic synthetic emails', () => {
    const email1 = getSyntheticEmail('real.user@company.com');
    const email2 = getSyntheticEmail('real.user@company.com');

    expect(email1).toBe(email2);
    expect(email1).toContain('@');
    expect(email1).not.toContain('company.com');
  });

  it('generates deterministic synthetic phones', () => {
    const phone1 = getSyntheticPhone('+1-555-019-2834');
    const phone2 = getSyntheticPhone('+1-555-019-2834');

    expect(phone1).toBe(phone2);
    expect(phone1).toMatch(/^\+1-\d{3}-\d{3}-\d{4}$/);
  });

  it('generates deterministic synthetic IPs', () => {
    const ip1 = getSyntheticIP('192.168.1.150');
    const ip2 = getSyntheticIP('192.168.1.150');

    expect(ip1).toBe(ip2);
    expect(ip1).toMatch(/^10\.\d{1,3}\.\d{1,3}\.\d{1,3}$/);
  });

  it('sanitizes text blocks with synthetic replacements', () => {
    const input = 'Contact alice@secret.corp or call 555-014-9988 at server 192.168.10.50';
    const result = sanitizeWithSynthetics(input);

    expect(result).not.toContain('alice@secret.corp');
    expect(result).not.toContain('555-014-9988');
    expect(result).not.toContain('192.168.10.50');
    expect(result).toContain('@');
    expect(result).toContain('+1-');
    expect(result).toContain('10.');
  });

  it('applies custom enterprise redaction rules correctly', () => {
    const text = 'Invoice INV-2026-9901 processed by AGENT-402 with secret token CORP-SEC-8819';
    const rules = [
      {
        id: 'rule-invoice',
        pattern: 'INV-\\d{4}-\\d{4}',
        mask: '[REDACTED-INVOICE]',
      },
      {
        id: 'rule-corp-sec',
        pattern: 'CORP-SEC-\\d{4}',
        mask: '[REDACTED-CORP-SECRET]',
      },
    ];

    const sanitized = applyCustomRules(text, rules);
    expect(sanitized).toBe('Invoice [REDACTED-INVOICE] processed by AGENT-402 with secret token [REDACTED-CORP-SECRET]');
  });

  it('gracefully ignores invalid custom regex without throwing', () => {
    const text = 'Normal text without changes';
    const rules = [
      {
        id: 'rule-bad',
        pattern: '[invalid(regex',
        mask: 'MASK',
      },
    ];

    expect(() => applyCustomRules(text, rules)).not.toThrow();
    expect(applyCustomRules(text, rules)).toBe(text);
  });
});
