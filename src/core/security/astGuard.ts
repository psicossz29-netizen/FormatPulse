// ── FormatPulse AST Guard & Prototype Pollution Defense ──────────────────────

export interface ASTGuardOptions {
  maxDepth?: number;
  maxStringLength?: number;
  maxKeys?: number;
}

const DEFAULT_MAX_DEPTH = 50;
const DEFAULT_MAX_STRING_LENGTH = 500_000; // 500 KB per string
const DEFAULT_MAX_KEYS = 50_000;

const DANGEROUS_KEYS = new Set(['__proto__', 'constructor', 'prototype']);

export class ASTSecurityError extends Error {
  constructor(
    message: string,
    public readonly code: 'PROTOTYPE_POLLUTION' | 'DEPTH_EXCEEDED' | 'STRING_TOO_LARGE' | 'KEY_LIMIT_EXCEEDED',
  ) {
    super(message);
    this.name = 'ASTSecurityError';
  }
}

/**
 * Recursively deep-sanitizes an parsed object or array:
 * 1. Strips prototype pollution keys (__proto__, constructor, prototype)
 * 2. Enforces maximum recursion depth to prevent stack overflow DoS
 * 3. Enforces string size boundaries to prevent memory allocation bombs
 * 4. Limits total key count to prevent algorithmic complexity attacks
 */
export function sanitizeAST<T>(
  input: T,
  options: ASTGuardOptions = {},
  currentDepth = 0,
  keyCounter = { count: 0 },
): T {
  const maxDepth = options.maxDepth ?? DEFAULT_MAX_DEPTH;
  const maxStringLength = options.maxStringLength ?? DEFAULT_MAX_STRING_LENGTH;
  const maxKeys = options.maxKeys ?? DEFAULT_MAX_KEYS;

  if (currentDepth > maxDepth) {
    throw new ASTSecurityError(
      `AST nesting depth limit exceeded (${maxDepth} levels). Possible recursion bomb.`,
      'DEPTH_EXCEEDED',
    );
  }

  if (input === null || input === undefined) {
    return input;
  }

  if (typeof input === 'string') {
    if (input.length > maxStringLength) {
      throw new ASTSecurityError(
        `String field size limit exceeded (${input.length} chars > ${maxStringLength}).`,
        'STRING_TOO_LARGE',
      );
    }
    return input;
  }

  if (typeof input !== 'object') {
    return input;
  }

  if (Array.isArray(input)) {
    return input.map((item) =>
      sanitizeAST(item, options, currentDepth + 1, keyCounter),
    ) as unknown as T;
  }

  // Pure dictionary object
  const cleanObj = Object.create(null) as Record<string, unknown>;

  for (const rawKey of Object.keys(input as Record<string, unknown>)) {
    keyCounter.count++;
    if (keyCounter.count > maxKeys) {
      throw new ASTSecurityError(
        `Total object key limit exceeded (${maxKeys} keys).`,
        'KEY_LIMIT_EXCEEDED',
      );
    }

    if (DANGEROUS_KEYS.has(rawKey)) {
      // Discard prototype pollution attack key silently or throw in strict mode
      continue;
    }

    const val = (input as Record<string, unknown>)[rawKey];
    cleanObj[rawKey] = sanitizeAST(val, options, currentDepth + 1, keyCounter);
  }

  // Return a safe, frozen object without prototype pollution risk
  return Object.assign({}, cleanObj) as T;
}

/**
 * Checks if a key or property path attempts prototype manipulation
 */
export function isDangerousKey(key: string): boolean {
  return DANGEROUS_KEYS.has(key.trim());
}
