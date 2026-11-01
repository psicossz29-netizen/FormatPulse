import { describe, it, expect } from 'vitest';
import { sanitizeAST, ASTSecurityError, isDangerousKey } from '../astGuard';

describe('AST Guard & Prototype Pollution Defense', () => {
  it('strips dangerous prototype pollution keys (__proto__, constructor, prototype)', () => {
    const maliciousPayload = JSON.parse(
      '{"__proto__": {"admin": true}, "constructor": "bad", "prototype": 123, "safeKey": "valid"}',
    );

    const clean = sanitizeAST(maliciousPayload);

    expect(Object.prototype.hasOwnProperty.call(clean, '__proto__')).toBe(false);
    expect(Object.prototype.hasOwnProperty.call(clean, 'constructor')).toBe(false);
    expect(Object.prototype.hasOwnProperty.call(clean, 'prototype')).toBe(false);
    expect(clean.safeKey).toBe('valid');
    // Ensure global Object prototype was not polluted
    expect((({} as unknown) as { admin?: boolean }).admin).toBeUndefined();
  });

  it('correctly identifies dangerous prototype manipulation keys', () => {
    expect(isDangerousKey('__proto__')).toBe(true);
    expect(isDangerousKey('constructor')).toBe(true);
    expect(isDangerousKey('prototype')).toBe(true);
    expect(isDangerousKey('normalProperty')).toBe(false);
  });

  it('throws ASTSecurityError when recursion depth exceeds limit', () => {
    // Construct deeply nested object (10 levels)
    let deepObj: Record<string, unknown> = { val: 'leaf' };
    for (let i = 0; i < 10; i++) {
      deepObj = { nested: deepObj };
    }

    expect(() => sanitizeAST(deepObj, { maxDepth: 5 })).toThrowError(ASTSecurityError);
    expect(() => sanitizeAST(deepObj, { maxDepth: 5 })).toThrow(
      /AST nesting depth limit exceeded/,
    );
  });

  it('throws ASTSecurityError when a string field exceeds maximum length', () => {
    const hugeString = 'a'.repeat(500);
    const payload = { data: hugeString };

    expect(() => sanitizeAST(payload, { maxStringLength: 200 })).toThrowError(
      ASTSecurityError,
    );
    expect(() => sanitizeAST(payload, { maxStringLength: 200 })).toThrow(
      /String field size limit exceeded/,
    );
  });

  it('throws ASTSecurityError when total key count exceeds boundary', () => {
    const payload: Record<string, number> = {};
    for (let i = 0; i < 50; i++) {
      payload[`key_${i}`] = i;
    }

    expect(() => sanitizeAST(payload, { maxKeys: 20 })).toThrowError(ASTSecurityError);
    expect(() => sanitizeAST(payload, { maxKeys: 20 })).toThrow(
      /Total object key limit exceeded/,
    );
  });

  it('preserves arrays, nulls, and nested clean objects without alteration', () => {
    const original = {
      users: [
        { id: 1, name: 'Alice', active: true, metadata: null },
        { id: 2, name: 'Bob', active: false, tags: ['dev', 'ops'] },
      ],
      config: {
        timeout: 3000,
        retries: 3,
      },
    };

    const clean = sanitizeAST(original);
    expect(clean).toEqual(original);
  });
});
