import { describe, it, expect } from 'vitest';
import {
  convert,
  parseJSON,
  parseCSV,
  parseYAML,
  toJSON,
  toCSV,
  toYAML,
  toTypeScript,
  toZodSchema,
  toSQLDDL,
} from '../converters';

// ═══════════════════════════════════════════════════════════════════════════════
// PARSERS
// ═══════════════════════════════════════════════════════════════════════════════

describe('parseJSON', () => {
  it('parses a valid JSON object', () => {
    expect(parseJSON('{"a":1}')).toEqual({ a: 1 });
  });

  it('parses a valid JSON array', () => {
    expect(parseJSON('[1,2,3]')).toEqual([1, 2, 3]);
  });

  it('throws on invalid JSON', () => {
    expect(() => parseJSON('{bad}')).toThrow();
  });
});

describe('parseCSV', () => {
  it('parses simple CSV with headers', () => {
    const result = parseCSV('name,age\nAlice,30\nBob,25');
    expect(result).toEqual([
      { name: 'Alice', age: 30 },
      { name: 'Bob', age: 25 },
    ]);
  });

  it('handles quoted fields with commas', () => {
    const result = parseCSV('name,note\n"Smith, John","a ""quoted"" value"');
    expect(result).toEqual([
      { name: 'Smith, John', note: 'a "quoted" value' },
    ]);
  });

  it('infers booleans and nulls', () => {
    const result = parseCSV('active,deleted\ntrue,false\nnull,true');
    expect(result).toEqual([
      { active: true, deleted: false },
      { active: null, deleted: true },
    ]);
  });

  it('throws on empty input', () => {
    expect(() => parseCSV('')).toThrow('Empty CSV');
  });

  it('throws on headers-only CSV', () => {
    expect(() => parseCSV('name,age')).toThrow('no data rows');
  });
});

describe('parseYAML', () => {
  it('parses a YAML object', () => {
    expect(parseYAML('name: Alice\nage: 30')).toEqual({ name: 'Alice', age: 30 });
  });

  it('parses a YAML array', () => {
    expect(parseYAML('- 1\n- 2\n- 3')).toEqual([1, 2, 3]);
  });

  it('throws on empty input', () => {
    expect(() => parseYAML('')).toThrow('Empty YAML');
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// FREE TIER SERIALIZERS
// ═══════════════════════════════════════════════════════════════════════════════

describe('toJSON', () => {
  it('pretty-prints an object', () => {
    expect(toJSON({ a: 1 })).toBe('{\n  "a": 1\n}');
  });

  it('pretty-prints an array', () => {
    expect(toJSON([1, 2])).toBe('[\n  1,\n  2\n]');
  });
});

describe('toCSV', () => {
  it('converts an array of objects to CSV', () => {
    const csv = toCSV([
      { name: 'Alice', age: 30 },
      { name: 'Bob', age: 25 },
    ]);
    expect(csv).toBe('name,age\nAlice,30\nBob,25');
  });

  it('flattens nested objects with dot notation', () => {
    const csv = toCSV([{ user: { name: 'Alice', city: 'NYC' } }]);
    expect(csv).toContain('user.name,user.city');
    expect(csv).toContain('Alice,NYC');
  });

  it('escapes fields with commas', () => {
    const csv = toCSV([{ note: 'hello, world' }]);
    expect(csv).toContain('"hello, world"');
  });

  it('handles a single object (wraps in array)', () => {
    const csv = toCSV({ name: 'Solo' });
    expect(csv).toContain('name');
    expect(csv).toContain('Solo');
  });
});

describe('toYAML', () => {
  it('serializes an object to YAML', () => {
    const result = toYAML({ name: 'Alice', age: 30 });
    expect(result).toContain('name: Alice');
    expect(result).toContain('age: 30');
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// CROSS-FORMAT CONVERSIONS (via convert())
// ═══════════════════════════════════════════════════════════════════════════════

describe('convert() — Free Tier', () => {
  const sampleJSON = JSON.stringify([
    { id: 1, name: 'Alice', active: true },
    { id: 2, name: 'Bob', active: false },
  ]);

  it('JSON → CSV', () => {
    const result = convert(sampleJSON, 'json', 'csv');
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.output).toContain('id,name,active');
      expect(result.output).toContain('1,Alice,true');
      expect(result.output).toContain('2,Bob,false');
      expect(result.timeMs).toBeGreaterThanOrEqual(0);
    }
  });

  it('JSON → YAML', () => {
    const result = convert('{"key":"value"}', 'json', 'yaml');
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.output).toContain('key: value');
    }
  });

  it('CSV → JSON', () => {
    const result = convert('name,age\nAlice,30', 'csv', 'json');
    expect(result.success).toBe(true);
    if (result.success) {
      const parsed = JSON.parse(result.output);
      expect(parsed).toEqual([{ name: 'Alice', age: 30 }]);
    }
  });

  it('YAML → JSON', () => {
    const result = convert('name: Alice\nage: 30', 'yaml', 'json');
    expect(result.success).toBe(true);
    if (result.success) {
      const parsed = JSON.parse(result.output);
      expect(parsed).toEqual({ name: 'Alice', age: 30 });
    }
  });

  it('YAML → CSV', () => {
    const yamlInput = '- name: Alice\n  age: 30\n- name: Bob\n  age: 25';
    const result = convert(yamlInput, 'yaml', 'csv');
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.output).toContain('name,age');
      expect(result.output).toContain('Alice,30');
    }
  });

  it('CSV → YAML', () => {
    const result = convert('name,age\nAlice,30', 'csv', 'yaml');
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.output).toContain('name: Alice');
      expect(result.output).toContain('age: 30');
    }
  });

  it('reports output telemetry', () => {
    const result = convert('{"a":1}', 'json', 'yaml');
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.outputBytes).toBeGreaterThan(0);
      expect(result.outputLines).toBeGreaterThanOrEqual(1);
    }
  });

  it('returns error for invalid JSON input', () => {
    const result = convert('{bad', 'json', 'csv');
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.message).toBeTruthy();
    }
  });

  it('returns error for empty CSV', () => {
    const result = convert('', 'csv', 'json');
    expect(result.success).toBe(false);
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// PRO: TypeScript Interface Generator
// ═══════════════════════════════════════════════════════════════════════════════

describe('toTypeScript', () => {
  it('generates an interface with primitive fields', () => {
    const ts = toTypeScript([{ name: 'Alice', age: 30, active: true }]);
    expect(ts).toContain('export interface Root');
    expect(ts).toContain('name: string');
    expect(ts).toContain('age: number');
    expect(ts).toContain('active: boolean');
  });

  it('detects nullable fields across array elements', () => {
    const ts = toTypeScript([
      { email: 'a@b.com' },
      { email: null },
    ]);
    expect(ts).toContain('string | null');
  });

  it('marks optional fields missing in some elements', () => {
    const ts = toTypeScript([
      { name: 'Alice', phone: '123' },
      { name: 'Bob' },
    ]);
    expect(ts).toContain('phone?:');
  });

  it('handles nested objects with separate interfaces', () => {
    const ts = toTypeScript([{ address: { city: 'NYC', zip: '10001' } }]);
    expect(ts).toContain('export interface Address');
    expect(ts).toContain('city: string');
    expect(ts).toContain('address: Address');
  });

  it('handles arrays of primitives', () => {
    const ts = toTypeScript([{ tags: ['a', 'b', 'c'] }]);
    expect(ts).toContain('tags: string[]');
  });

  it('generates from a single object (not array)', () => {
    const ts = toTypeScript({ id: 1 });
    expect(ts).toContain('id: number');
  });

  it('includes the FormatPulse header comment', () => {
    const ts = toTypeScript([{ x: 1 }]);
    expect(ts).toContain('Generated by FormatPulse');
  });
});

describe('convert() — TypeScript', () => {
  it('JSON → TypeScript via convert()', () => {
    const result = convert('[{"id": 1, "name": "test"}]', 'json', 'typescript');
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.output).toContain('export interface Root');
      expect(result.output).toContain('id: number');
      expect(result.output).toContain('name: string');
    }
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// PRO: Zod Schema Generator
// ═══════════════════════════════════════════════════════════════════════════════

describe('toZodSchema', () => {
  it('generates a basic Zod schema', () => {
    const zod = toZodSchema([{ name: 'Alice', count: 42 }]);
    expect(zod).toContain("import { z } from 'zod'");
    expect(zod).toContain('export const DataSchema = z.object(');
    expect(zod).toContain('name: z.string()');
    expect(zod).toContain('count: z.number().int()');
  });

  it('detects email format', () => {
    const zod = toZodSchema([{ email: 'test@example.com' }]);
    expect(zod).toContain('z.string().email()');
  });

  it('detects URL format', () => {
    const zod = toZodSchema([{ website: 'https://example.com' }]);
    expect(zod).toContain('z.string().url()');
  });

  it('detects ISO datetime format', () => {
    const zod = toZodSchema([{ createdAt: '2026-01-15T10:30:00' }]);
    expect(zod).toContain('z.string().datetime()');
  });

  it('detects floating point numbers', () => {
    const zod = toZodSchema([{ price: 19.99 }]);
    expect(zod).toContain('z.number()');
    expect(zod).not.toContain('z.number().int()');
  });

  it('generates type export', () => {
    const zod = toZodSchema([{ x: 1 }]);
    expect(zod).toContain('export type Data = z.infer<typeof DataSchema>');
  });

  it('marks optional fields', () => {
    const zod = toZodSchema([
      { a: 1, b: 'x' },
      { a: 2 },
    ]);
    expect(zod).toContain('.optional()');
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// PRO: SQL DDL + Seed Generator
// ═══════════════════════════════════════════════════════════════════════════════

describe('toSQLDDL', () => {
  it('generates CREATE TABLE with correct types', () => {
    const sql = toSQLDDL([
      { name: 'Alice', age: 30, active: true, created: '2026-01-01T00:00:00' },
    ]);
    expect(sql).toContain('CREATE TABLE data');
    expect(sql).toContain('name VARCHAR(255) NOT NULL');
    expect(sql).toContain('age INTEGER NOT NULL');
    expect(sql).toContain('active BOOLEAN NOT NULL');
    expect(sql).toContain('created TIMESTAMP NOT NULL');
  });

  it('generates INSERT INTO with values', () => {
    const sql = toSQLDDL([{ name: 'Alice', age: 30 }]);
    expect(sql).toContain('INSERT INTO data (name, age) VALUES');
    expect(sql).toContain("'Alice'");
    expect(sql).toContain('30');
  });

  it('escapes single quotes in string values (SQL injection prevention)', () => {
    const sql = toSQLDDL([{ note: "it's dangerous; DROP TABLE --" }]);
    expect(sql).toContain("'it''s dangerous; DROP TABLE --'");
    expect(sql).not.toContain("it's");
  });

  it('handles NULL values', () => {
    const sql = toSQLDDL([{ name: 'Alice', phone: null }]);
    expect(sql).toContain('NULL');
  });

  it('handles nested objects as JSONB', () => {
    const sql = toSQLDDL([{ meta: { key: 'value' } }]);
    expect(sql).toContain('JSONB');
  });

  it('marks nullable columns without NOT NULL', () => {
    const sql = toSQLDDL([
      { name: 'Alice', phone: '123' },
      { name: 'Bob' },
    ]);
    // phone is optional so should NOT have NOT NULL
    const lines = sql.split('\n');
    const phoneLine = lines.find((l) => l.includes('phone'));
    expect(phoneLine).toBeDefined();
    expect(phoneLine).not.toContain('NOT NULL');
  });

  it('includes the FormatPulse header comment', () => {
    const sql = toSQLDDL([{ x: 1 }]);
    expect(sql).toContain('Generated by FormatPulse');
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// EDGE CASES
// ═══════════════════════════════════════════════════════════════════════════════

describe('Edge cases', () => {
  it('handles deeply nested JSON → CSV (flattens with dots)', () => {
    const input = JSON.stringify([{ a: { b: { c: 'deep' } } }]);
    const result = convert(input, 'json', 'csv');
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.output).toContain('a.b.c');
      expect(result.output).toContain('deep');
    }
  });

  it('handles empty array in JSON → CSV', () => {
    const result = convert('[]', 'json', 'csv');
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.output).toBe('');
    }
  });

  it('handles CSV with mixed types inferred correctly', () => {
    const csv = 'val\n42\nhello\ntrue';
    const result = convert(csv, 'csv', 'json');
    expect(result.success).toBe(true);
    if (result.success) {
      const parsed = JSON.parse(result.output);
      expect(parsed[0].val).toBe(42);
      expect(parsed[1].val).toBe('hello');
      expect(parsed[2].val).toBe(true);
    }
  });

  it('round-trips JSON → YAML → JSON', () => {
    const original = { name: 'test', values: [1, 2, 3], nested: { key: true } };
    const yamlResult = convert(JSON.stringify(original), 'json', 'yaml');
    expect(yamlResult.success).toBe(true);
    if (yamlResult.success) {
      const jsonResult = convert(yamlResult.output, 'yaml', 'json');
      expect(jsonResult.success).toBe(true);
      if (jsonResult.success) {
        expect(JSON.parse(jsonResult.output)).toEqual(original);
      }
    }
  });

  it('converts to JSON Schema, OpenAPI, Prisma, Pydantic, Rust, and Go via convert()', () => {
    const sample = JSON.stringify({ id: 1, email: 'dev@test.org', active: true });
    
    const formats = ['json-schema', 'openapi', 'prisma', 'pydantic', 'rust', 'go'] as const;
    for (const fmt of formats) {
      const res = convert(sample, 'json', fmt);
      expect(res.success).toBe(true);
      if (res.success) {
        expect(res.output.length).toBeGreaterThan(20);
        expect(res.outputLines).toBeGreaterThan(1);
      }
    }
  });
});
