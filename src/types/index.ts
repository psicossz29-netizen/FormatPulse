// ── Format & Conversion Types ────────────────────────────────────────────────

export const INPUT_FORMATS = ['json', 'csv', 'yaml'] as const;
export type InputFormat = (typeof INPUT_FORMATS)[number];

export const FREE_OUTPUT_FORMATS = ['json', 'csv', 'yaml'] as const;
export const PRO_OUTPUT_FORMATS = [
  'typescript',
  'zod',
  'sql-ddl',
  'pii-sanitizer',
  'json-schema',
  'openapi',
  'prisma',
  'pydantic',
  'rust',
  'go',
] as const;
export const OUTPUT_FORMATS = [...FREE_OUTPUT_FORMATS, ...PRO_OUTPUT_FORMATS] as const;
export type OutputFormat = (typeof OUTPUT_FORMATS)[number];

export function isProFormat(format: OutputFormat): boolean {
  return (PRO_OUTPUT_FORMATS as readonly string[]).includes(format);
}

// ── Display Labels ───────────────────────────────────────────────────────────

export const FORMAT_LABELS: Record<InputFormat | OutputFormat, string> = {
  json: 'JSON',
  csv: 'CSV',
  yaml: 'YAML',
  typescript: 'TypeScript',
  zod: 'Zod Schema',
  'sql-ddl': 'SQL DDL',
  'pii-sanitizer': 'PII Sanitizer',
  'json-schema': 'JSON Schema',
  openapi: 'OpenAPI 3.1',
  prisma: 'Prisma',
  pydantic: 'Pydantic v2',
  rust: 'Rust Serde',
  go: 'Go Struct',
};

// ── License Types ────────────────────────────────────────────────────────────

export type LicenseTier = 'free' | 'pro' | 'team' | 'enterprise';

export interface LicenseDetails {
  tier: LicenseTier;
  key: string | null;
  seats: number;
  label: string;
  maxBytes: number;
  offlineVerified: boolean;
  validatedAt: number | null;
}

export interface LicenseState {
  tier: LicenseTier;
  key: string | null;
  validatedAt: number | null;
}

// ── Processing Telemetry ─────────────────────────────────────────────────────

export interface ProcessingTelemetry {
  inputBytes: number;
  outputBytes: number;
  inputLines: number;
  outputLines: number;
  processingTimeMs: number | null;
}

// ── Error Types ──────────────────────────────────────────────────────────────

export interface ParseError {
  message: string;
  line: number | null;
  column: number | null;
}

// ── Worker Types ─────────────────────────────────────────────────────────────

export type WorkerStatus = 'idle' | 'processing' | 'ready';
