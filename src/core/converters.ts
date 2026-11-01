import * as yaml from 'js-yaml';
import type { InputFormat, OutputFormat, ParseError } from '@/types';
import { sanitizeAST } from '@/core/security/astGuard';
import { sanitizeCSVField } from '@/core/security/formulaGuard';
import {
  toJSONSchema,
  toOpenAPI,
  toPrisma,
  toPydantic,
  toRustSerde,
  toGoStruct,
} from '@/core/generators/schemaGenerators';

export {
  toJSONSchema,
  toOpenAPI,
  toPrisma,
  toPydantic,
  toRustSerde,
  toGoStruct,
};

// ── Result Type ──────────────────────────────────────────────────────────────

export type ConversionResult =
  | { success: true; output: string; timeMs: number; outputBytes: number; outputLines: number }
  | { success: false; error: ParseError; timeMs: number };

// ── CSV Parser (zero-dependency, RFC 4180 compliant) ─────────────────────────

function parseCSVRaw(input: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = '';
  let inQuotes = false;

  for (let i = 0; i < input.length; i++) {
    const ch = input[i]!;
    if (inQuotes) {
      if (ch === '"') {
        if (input[i + 1] === '"') {
          field += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        field += ch;
      }
    } else if (ch === '"') {
      inQuotes = true;
    } else if (ch === ',') {
      row.push(field);
      field = '';
    } else if (ch === '\n') {
      row.push(field);
      field = '';
      if (row.length > 1 || row[0] !== '') rows.push(row);
      row = [];
    } else if (ch !== '\r') {
      field += ch;
    }
  }
  if (field || row.length > 0) {
    row.push(field);
    if (row.length > 1 || row[0] !== '') rows.push(row);
  }
  return rows;
}

function csvRowsToRecords(rows: string[][]): Record<string, unknown>[] {
  if (rows.length < 2) return [];
  const headers = rows[0]!;
  const records: Record<string, unknown>[] = [];
  for (let r = 1; r < rows.length; r++) {
    const row = rows[r]!;
    const record: Record<string, unknown> = {};
    for (let c = 0; c < headers.length; c++) {
      const key = headers[c]!;
      const raw = row[c] ?? '';
      record[key] = inferPrimitive(raw);
    }
    records.push(record);
  }
  return records;
}

function inferPrimitive(value: string): unknown {
  if (value === '') return null;
  if (value === 'true') return true;
  if (value === 'false') return false;
  if (value === 'null') return null;
  const num = Number(value);
  if (!Number.isNaN(num) && value.trim() !== '') return num;
  return value;
}

// ── CSV Serializer ───────────────────────────────────────────────────────────

function escapeCSVField(value: string): string {
  if (value.includes(',') || value.includes('"') || value.includes('\n')) {
    return '"' + value.replace(/"/g, '""') + '"';
  }
  return value;
}

function valueToCSVString(value: unknown): string {
  if (value === null || value === undefined) return '';
  if (typeof value === 'object') return sanitizeCSVField(JSON.stringify(value));
  return sanitizeCSVField(String(value));
}

// ── Flatten / Unflatten ──────────────────────────────────────────────────────

function flattenObject(
  obj: Record<string, unknown>,
  prefix = '',
): Record<string, unknown> {
  const result: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(obj)) {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
      Object.assign(result, flattenObject(value as Record<string, unknown>, fullKey));
    } else {
      result[fullKey] = value;
    }
  }
  return result;
}

function normalizeToArray(data: unknown): Record<string, unknown>[] {
  if (Array.isArray(data)) {
    return data.map((item) => {
      if (item !== null && typeof item === 'object' && !Array.isArray(item)) {
        return item as Record<string, unknown>;
      }
      return { value: item };
    });
  }
  if (data !== null && typeof data === 'object') {
    return [data as Record<string, unknown>];
  }
  return [{ value: data }];
}

// ── Parsers ──────────────────────────────────────────────────────────────────

export function parseJSON(input: string): unknown {
  return JSON.parse(input);
}

export function parseCSV(input: string): Record<string, unknown>[] {
  const rows = parseCSVRaw(input);
  if (rows.length === 0) throw new Error('Empty CSV input');
  if (rows.length === 1) throw new Error('CSV has headers but no data rows');
  return csvRowsToRecords(rows);
}

export function parseYAML(input: string): unknown {
  if (!input.trim()) throw new Error('Empty YAML input');
  const result = yaml.load(input);
  if (result === undefined) throw new Error('Empty YAML input');
  return result;
}

export function parseInput(input: string, format: InputFormat): unknown {
  let raw: unknown;
  switch (format) {
    case 'json':
      raw = parseJSON(input);
      break;
    case 'csv':
      raw = parseCSV(input);
      break;
    case 'yaml':
      raw = parseYAML(input);
      break;
  }
  // Deep-sanitize AST against Prototype Pollution and memory recursion attacks
  return sanitizeAST(raw);
}

// ── Free Tier Serializers ────────────────────────────────────────────────────

export function toJSON(data: unknown): string {
  return JSON.stringify(data, null, 2);
}

export function toCSV(data: unknown): string {
  const records = normalizeToArray(data);
  if (records.length === 0) return '';

  const flattened = records.map((r) => flattenObject(r));
  const headerSet = new Set<string>();
  for (const row of flattened) {
    for (const key of Object.keys(row)) {
      headerSet.add(key);
    }
  }
  const headers = [...headerSet];
  const lines = [headers.map(escapeCSVField).join(',')];
  for (const row of flattened) {
    const values = headers.map((h) => escapeCSVField(valueToCSVString(row[h])));
    lines.push(values.join(','));
  }
  return lines.join('\n');
}

export function toYAML(data: unknown): string {
  return yaml.dump(data, { indent: 2, lineWidth: 120, noRefs: true });
}

// ── Type Inference Engine ────────────────────────────────────────────────────

export type TSType =
  | { kind: 'string'; format?: 'email' | 'url' | 'datetime' }
  | { kind: 'number'; isInteger: boolean }
  | { kind: 'boolean' }
  | { kind: 'null' }
  | { kind: 'array'; element: TSType }
  | { kind: 'object'; fields: Map<string, { type: TSType; optional: boolean }> }
  | { kind: 'union'; members: TSType[] }
  | { kind: 'unknown' };

const EMAIL_RE = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const URL_RE = /^https?:\/\/.+/;
const ISO_DATE_RE = /^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}:\d{2})?/;

export function detectStringFormat(value: string): 'email' | 'url' | 'datetime' | undefined {
  if (EMAIL_RE.test(value)) return 'email';
  if (URL_RE.test(value)) return 'url';
  if (ISO_DATE_RE.test(value)) return 'datetime';
  return undefined;
}

export function inferType(value: unknown): TSType {
  if (value === null) return { kind: 'null' };
  if (typeof value === 'string') return { kind: 'string', format: detectStringFormat(value) };
  if (typeof value === 'number') return { kind: 'number', isInteger: Number.isInteger(value) };
  if (typeof value === 'boolean') return { kind: 'boolean' };
  if (Array.isArray(value)) {
    if (value.length === 0) return { kind: 'array', element: { kind: 'unknown' } };
    let merged = inferType(value[0]);
    for (let i = 1; i < value.length; i++) {
      merged = mergeTypes(merged, inferType(value[i]));
    }
    return { kind: 'array', element: merged };
  }
  if (typeof value === 'object') {
    const fields = new Map<string, { type: TSType; optional: boolean }>();
    for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
      fields.set(k, { type: inferType(v), optional: false });
    }
    return { kind: 'object', fields };
  }
  return { kind: 'unknown' };
}

function mergeTypes(a: TSType, b: TSType): TSType {
  if (a.kind === 'unknown') return b;
  if (b.kind === 'unknown') return a;
  if (a.kind === b.kind) {
    if (a.kind === 'string' && b.kind === 'string') {
      return { kind: 'string', format: a.format === b.format ? a.format : undefined };
    }
    if (a.kind === 'number' && b.kind === 'number') {
      return { kind: 'number', isInteger: a.isInteger && b.isInteger };
    }
    if (a.kind === 'array' && b.kind === 'array') {
      return { kind: 'array', element: mergeTypes(a.element, b.element) };
    }
    if (a.kind === 'object' && b.kind === 'object') {
      return mergeObjectTypes(a, b);
    }
    return a;
  }
  if (a.kind === 'null') return makeNullable(b);
  if (b.kind === 'null') return makeNullable(a);
  return { kind: 'union', members: [a, b] };
}

function mergeObjectTypes(
  a: Extract<TSType, { kind: 'object' }>,
  b: Extract<TSType, { kind: 'object' }>,
): TSType {
  const merged = new Map<string, { type: TSType; optional: boolean }>();
  const allKeys = new Set([...a.fields.keys(), ...b.fields.keys()]);
  for (const key of allKeys) {
    const fa = a.fields.get(key);
    const fb = b.fields.get(key);
    if (fa && fb) {
      merged.set(key, { type: mergeTypes(fa.type, fb.type), optional: fa.optional || fb.optional });
    } else if (fa) {
      merged.set(key, { type: fa.type, optional: true });
    } else if (fb) {
      merged.set(key, { type: fb.type, optional: true });
    }
  }
  return { kind: 'object', fields: merged };
}

function makeNullable(t: TSType): TSType {
  if (t.kind === 'null') return t;
  if (t.kind === 'union') {
    const hasNull = t.members.some((m) => m.kind === 'null');
    if (hasNull) return t;
    return { kind: 'union', members: [...t.members, { kind: 'null' }] };
  }
  return { kind: 'union', members: [t, { kind: 'null' }] };
}

export function inferFromArray(arr: unknown[]): TSType {
  if (arr.length === 0) return { kind: 'object', fields: new Map() };
  let merged = inferType(arr[0]);
  for (let i = 1; i < arr.length; i++) {
    merged = mergeTypes(merged, inferType(arr[i]));
  }
  return merged;
}

// ── PRO: TypeScript Interface Generator ──────────────────────────────────────

function tsTypeName(t: TSType): string {
  switch (t.kind) {
    case 'string':
      return 'string';
    case 'number':
      return 'number';
    case 'boolean':
      return 'boolean';
    case 'null':
      return 'null';
    case 'unknown':
      return 'unknown';
    case 'array':
      return `${tsTypeName(t.element)}[]`;
    case 'union':
      return t.members.map(tsTypeName).join(' | ');
    case 'object':
      return 'Record<string, unknown>';
  }
}

export function capitalize(s: string): string {
  const clean = s.replace(/[^a-zA-Z0-9]/g, '_');
  return clean.charAt(0).toUpperCase() + clean.slice(1);
}

export function toTypeScript(data: unknown): string {
  const records = Array.isArray(data) ? data : [data];
  const rootType = inferFromArray(records);

  const interfaces: string[] = [];
  const rootName = 'Root';

  function emitInterface(name: string, type: TSType): string {
    if (type.kind !== 'object') return tsTypeName(type);

    const lines: string[] = [];
    lines.push(`export interface ${name} {`);
    for (const [key, field] of type.fields) {
      const safeName = /^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(key) ? key : `'${key}'`;
      const opt = field.optional ? '?' : '';

      let typeName: string;
      if (field.type.kind === 'object') {
        const nestedName = capitalize(key);
        typeName = emitInterface(nestedName, field.type);
      } else if (field.type.kind === 'array' && field.type.element.kind === 'object') {
        const nestedName = capitalize(key) + 'Item';
        const itemType = emitInterface(nestedName, field.type.element);
        typeName = `${itemType}[]`;
      } else {
        typeName = tsTypeName(field.type);
      }

      lines.push(`  ${safeName}${opt}: ${typeName};`);
    }
    lines.push('}');
    interfaces.push(lines.join('\n'));
    return name;
  }

  emitInterface(rootName, rootType);

  const header = '// Generated by FormatPulse — TypeScript Interface Generator';
  return [header, '', ...interfaces].join('\n');
}

// ── PRO: Zod Schema Generator ────────────────────────────────────────────────

function zodTypeName(t: TSType, schemaName?: string): string {
  switch (t.kind) {
    case 'string':
      if (t.format === 'email') return 'z.string().email()';
      if (t.format === 'url') return 'z.string().url()';
      if (t.format === 'datetime') return 'z.string().datetime()';
      return 'z.string()';
    case 'number':
      return t.isInteger ? 'z.number().int()' : 'z.number()';
    case 'boolean':
      return 'z.boolean()';
    case 'null':
      return 'z.null()';
    case 'unknown':
      return 'z.unknown()';
    case 'array':
      return `z.array(${zodTypeName(t.element)})`;
    case 'union':
      return `z.union([${t.members.map((m) => zodTypeName(m)).join(', ')}])`;
    case 'object':
      return schemaName ?? 'z.record(z.unknown())';
  }
}

export function toZodSchema(data: unknown): string {
  const records = Array.isArray(data) ? data : [data];
  const rootType = inferFromArray(records);

  const schemas: string[] = [];

  function emitSchema(name: string, type: TSType): string {
    if (type.kind !== 'object') return zodTypeName(type);

    const lines: string[] = [];
    const schemaName = `${name}Schema`;
    lines.push(`export const ${schemaName} = z.object({`);
    for (const [key, field] of type.fields) {
      const safeName = /^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(key) ? key : `'${key}'`;

      let zodType: string;
      if (field.type.kind === 'object') {
        const nestedName = capitalize(key);
        zodType = emitSchema(nestedName, field.type);
      } else if (field.type.kind === 'array' && field.type.element.kind === 'object') {
        const nestedName = capitalize(key) + 'Item';
        const nestedSchema = emitSchema(nestedName, field.type.element);
        zodType = `z.array(${nestedSchema})`;
      } else {
        zodType = zodTypeName(field.type);
      }

      if (field.optional) zodType += '.optional()';
      lines.push(`  ${safeName}: ${zodType},`);
    }
    lines.push('});');
    schemas.push(lines.join('\n'));
    return schemaName;
  }

  const rootSchemaName = emitSchema('Data', rootType);

  const header = "// Generated by FormatPulse — Zod Schema Generator\nimport { z } from 'zod';";
  const typeExport = `\nexport type Data = z.infer<typeof ${rootSchemaName}>;`;
  return [header, '', ...schemas, typeExport].join('\n');
}

// ── PRO: SQL DDL + Seed Generator ────────────────────────────────────────────

function sqlType(t: TSType): string {
  switch (t.kind) {
    case 'string':
      if (t.format === 'datetime') return 'TIMESTAMP';
      return 'VARCHAR(255)';
    case 'number':
      return t.isInteger ? 'INTEGER' : 'NUMERIC';
    case 'boolean':
      return 'BOOLEAN';
    case 'null':
      return 'VARCHAR(255)';
    case 'array':
    case 'object':
      return 'JSONB';
    case 'union': {
      const nonNull = t.members.filter((m) => m.kind !== 'null');
      if (nonNull.length === 1 && nonNull[0]) return sqlType(nonNull[0]);
      return 'VARCHAR(255)';
    }
    case 'unknown':
      return 'TEXT';
  }
}

function sqlEscape(value: unknown): string {
  if (value === null || value === undefined) return 'NULL';
  if (typeof value === 'boolean') return value ? 'TRUE' : 'FALSE';
  if (typeof value === 'number') return String(value);
  if (typeof value === 'object') {
    const json = JSON.stringify(value);
    return `'${json.replace(/'/g, "''")}'`;
  }
  return `'${String(value).replace(/'/g, "''")}'`;
}

function isNullable(t: TSType): boolean {
  if (t.kind === 'null') return true;
  if (t.kind === 'union') return t.members.some((m) => m.kind === 'null');
  return false;
}

export function toSQLDDL(data: unknown): string {
  const records = normalizeToArray(data);
  if (records.length === 0) return '-- No data to generate SQL from';

  const flattened = records.map((r) => flattenObject(r));
  const rootType = inferFromArray(records);

  if (rootType.kind !== 'object') {
    return '-- Input must be an object or array of objects for SQL generation';
  }

  const tableName = 'data';
  const lines: string[] = ['-- Generated by FormatPulse — SQL DDL + Seed Generator', ''];

  // CREATE TABLE
  lines.push(`CREATE TABLE ${tableName} (`);
  const columns: string[] = [];
  for (const [key, field] of rootType.fields) {
    const colName = key.replace(/[^a-zA-Z0-9_]/g, '_');
    const type = sqlType(field.type);
    const nullable = field.optional || isNullable(field.type) ? '' : ' NOT NULL';
    columns.push(`  ${colName} ${type}${nullable}`);
  }
  lines.push(columns.join(',\n'));
  lines.push(');');
  lines.push('');

  // INSERT INTO
  const fieldNames = [...rootType.fields.keys()];
  const colNames = fieldNames.map((k) => k.replace(/[^a-zA-Z0-9_]/g, '_'));
  lines.push(`INSERT INTO ${tableName} (${colNames.join(', ')}) VALUES`);

  const valueRows: string[] = [];
  for (const row of flattened) {
    const vals = fieldNames.map((k) => sqlEscape(row[k]));
    valueRows.push(`  (${vals.join(', ')})`);
  }
  lines.push(valueRows.join(',\n') + ';');

  return lines.join('\n');
}

// ── Main Conversion Orchestrator ─────────────────────────────────────────────

export function convert(
  input: string,
  inputFormat: InputFormat,
  outputFormat: OutputFormat,
): ConversionResult {
  const start = performance.now();

  try {
    const parsed = parseInput(input, inputFormat);

    let output: string;
    switch (outputFormat) {
      case 'json':
        output = toJSON(parsed);
        break;
      case 'csv':
        output = toCSV(parsed);
        break;
      case 'yaml':
        output = toYAML(parsed);
        break;
      case 'typescript':
        output = toTypeScript(parsed);
        break;
      case 'zod':
        output = toZodSchema(parsed);
        break;
      case 'sql-ddl':
        output = toSQLDDL(parsed);
        break;
      case 'json-schema':
        output = toJSONSchema(parsed);
        break;
      case 'openapi':
        output = toOpenAPI(parsed);
        break;
      case 'prisma':
        output = toPrisma(parsed);
        break;
      case 'pydantic':
        output = toPydantic(parsed);
        break;
      case 'rust':
        output = toRustSerde(parsed);
        break;
      case 'go':
        output = toGoStruct(parsed);
        break;
      case 'pii-sanitizer':
        // PII sanitizer is handled separately via piiSanitizer.ts
        output = '// PII Sanitizer — see piiSanitizer module';
        break;
    }

    const elapsed = performance.now() - start;
    const encoder = new TextEncoder();
    return {
      success: true,
      output,
      timeMs: elapsed,
      outputBytes: encoder.encode(output).byteLength,
      outputLines: output.split('\n').length,
    };
  } catch (err) {
    const elapsed = performance.now() - start;
    const message = err instanceof Error ? err.message : String(err);

    // Extract line number from common parse error formats
    let line: number | null = null;
    let column: number | null = null;
    const posMatch = message.match(/position\s+(\d+)/i);
    const lineMatch = message.match(/line\s+(\d+)/i);
    const colMatch = message.match(/column\s+(\d+)/i);
    if (lineMatch?.[1]) line = parseInt(lineMatch[1], 10);
    if (colMatch?.[1]) column = parseInt(colMatch[1], 10);
    if (!line && posMatch?.[1]) {
      const pos = parseInt(posMatch[1], 10);
      line = input.substring(0, pos).split('\n').length;
    }

    return {
      success: false,
      error: { message, line, column },
      timeMs: elapsed,
    };
  }
}
