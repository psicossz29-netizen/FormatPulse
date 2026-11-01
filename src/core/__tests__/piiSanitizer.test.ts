import { describe, it, expect } from 'vitest';
import { sanitizePII } from '../piiSanitizer';

// ═══════════════════════════════════════════════════════════════════════════════
// EMAIL DETECTION
// ═══════════════════════════════════════════════════════════════════════════════

describe('PII Sanitizer — Emails', () => {
  it('replaces email addresses with redacted format', () => {
    const input = JSON.stringify({ email: 'john.doe@example.com' });
    const result = sanitizePII(input, 'json');
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.output).toContain('@redacted.local');
      expect(result.output).not.toContain('john.doe@example.com');
    }
  });

  it('replaces multiple emails with incrementing counters', () => {
    const input = JSON.stringify({
      primary: 'alice@test.com',
      secondary: 'bob@test.com',
    });
    const result = sanitizePII(input, 'json');
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.output).toContain('user_1@redacted.local');
      expect(result.output).toContain('user_2@redacted.local');
    }
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// PHONE DETECTION
// ═══════════════════════════════════════════════════════════════════════════════

describe('PII Sanitizer — Phone Numbers', () => {
  it('replaces US phone numbers', () => {
    const input = JSON.stringify({ phone: '555-123-4567' });
    const result = sanitizePII(input, 'json');
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.output).toContain('+00-000-000-0000');
      expect(result.output).not.toContain('555-123-4567');
    }
  });

  it('replaces phone with parentheses', () => {
    const input = JSON.stringify({ phone: '(555) 123-4567' });
    const result = sanitizePII(input, 'json');
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.output).not.toContain('555');
    }
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// IP ADDRESS DETECTION
// ═══════════════════════════════════════════════════════════════════════════════

describe('PII Sanitizer — IP Addresses', () => {
  it('replaces IPv4 addresses', () => {
    const input = JSON.stringify({ ip: '192.168.1.100' });
    const result = sanitizePII(input, 'json');
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.output).toContain('0.0.0.0');
      expect(result.output).not.toContain('192.168.1.100');
    }
  });

  it('replaces IPv6 addresses', () => {
    const input = JSON.stringify({ ip: '2001:0db8:85a3:0000:0000:8a2e:0370:7334' });
    const result = sanitizePII(input, 'json');
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.output).not.toContain('2001:0db8');
    }
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// CREDIT CARD DETECTION
// ═══════════════════════════════════════════════════════════════════════════════

describe('PII Sanitizer — Credit Cards', () => {
  it('replaces credit card numbers (spaced)', () => {
    const input = JSON.stringify({ card: '4111 1111 1111 1111' });
    const result = sanitizePII(input, 'json');
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.output).toContain('[REDACTED-CARD]');
      expect(result.output).not.toContain('4111');
    }
  });

  it('replaces credit card numbers (dashed)', () => {
    const input = JSON.stringify({ card: '4111-1111-1111-1111' });
    const result = sanitizePII(input, 'json');
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.output).toContain('[REDACTED-CARD]');
    }
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// SECRET / TOKEN DETECTION
// ═══════════════════════════════════════════════════════════════════════════════

describe('PII Sanitizer — Secrets & Tokens', () => {
  it('replaces OpenAI-style API keys (sk-...)', () => {
    const input = JSON.stringify({ key: 'sk-abc123def456ghi789jkl012mno345pqr678' });
    const result = sanitizePII(input, 'json');
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.output).toContain('[REDACTED-SECRET]');
      expect(result.output).not.toContain('sk-abc123');
    }
  });

  it('replaces GitHub PAT tokens (ghp_...)', () => {
    const input = JSON.stringify({ token: 'ghp_ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmn' });
    const result = sanitizePII(input, 'json');
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.output).toContain('[REDACTED-SECRET]');
      expect(result.output).not.toContain('ghp_');
    }
  });

  it('replaces JWT tokens (eyJ...)', () => {
    const jwt = 'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxMjM0NTY3ODkwIn0.dozjgNryP4J3jVmNHl0w5N_XgL0n3I9PlFUP0THsR8U';
    const input = JSON.stringify({ token: jwt });
    const result = sanitizePII(input, 'json');
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.output).toContain('[REDACTED-SECRET]');
      expect(result.output).not.toContain('eyJhbGci');
    }
  });

  it('replaces Bearer tokens', () => {
    const input = JSON.stringify({ auth: 'Bearer abcdefghijklmnopqrstuvwxyz0123456789' });
    const result = sanitizePII(input, 'json');
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.output).toContain('[REDACTED-SECRET]');
    }
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// MIXED PII & FORMAT PRESERVATION
// ═══════════════════════════════════════════════════════════════════════════════

describe('PII Sanitizer — Mixed & Format Preservation', () => {
  it('sanitizes multiple PII types in one JSON', () => {
    const input = JSON.stringify({
      name: 'John',
      email: 'john@example.com',
      phone: '555-867-5309',
      ip: '10.0.0.1',
      card: '4111 1111 1111 1111',
    });
    const result = sanitizePII(input, 'json');
    expect(result.success).toBe(true);
    if (result.success) {
      // Output should be valid JSON
      expect(() => JSON.parse(result.output)).not.toThrow();
      expect(result.output).toContain('@redacted.local');
      expect(result.output).toContain('+00-000-000-0000');
      expect(result.output).toContain('0.0.0.0');
      expect(result.output).toContain('[REDACTED-CARD]');
      expect(result.detections).toBeGreaterThanOrEqual(4);
    }
  });

  it('preserves valid JSON structure after sanitization', () => {
    const input = JSON.stringify({
      users: [
        { email: 'a@b.com', age: 25 },
        { email: 'c@d.com', age: 30 },
      ],
    });
    const result = sanitizePII(input, 'json');
    expect(result.success).toBe(true);
    if (result.success) {
      const parsed = JSON.parse(result.output);
      expect(parsed.users).toHaveLength(2);
      expect(parsed.users[0].age).toBe(25);
    }
  });

  it('works with CSV input format', () => {
    const input = 'name,email\nAlice,alice@secret.org';
    const result = sanitizePII(input, 'csv');
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.output).toContain('@redacted.local');
      expect(result.output).not.toContain('alice@secret.org');
    }
  });

  it('works with YAML input format', () => {
    const input = 'email: admin@corp.io\nip: 172.16.0.1';
    const result = sanitizePII(input, 'yaml');
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.output).toContain('@redacted.local');
      expect(result.output).toContain('0.0.0.0');
    }
  });

  it('leaves non-PII data untouched', () => {
    const input = JSON.stringify({ name: 'Alice', age: 30, city: 'New York' });
    const result = sanitizePII(input, 'json');
    expect(result.success).toBe(true);
    if (result.success) {
      const parsed = JSON.parse(result.output);
      expect(parsed.name).toBe('Alice');
      expect(parsed.age).toBe(30);
      expect(parsed.city).toBe('New York');
      expect(result.detections).toBe(0);
    }
  });

  it('returns error for invalid input', () => {
    const result = sanitizePII('{bad', 'json');
    expect(result.success).toBe(false);
  });
});
