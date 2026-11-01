import type { InputFormat } from '@/types';
import { parseInput, toJSON, toCSV, toYAML } from './converters';

// ── PII Detection Patterns ───────────────────────────────────────────────────

const PII_PATTERNS: Array<{
  name: string;
  regex: RegExp;
  replace: (index: number) => string;
}> = [
  // JWT tokens (must be checked before generic secrets)
  {
    name: 'jwt',
    regex: /\beyJ[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}\b/g,
    replace: () => '[REDACTED-SECRET]',
  },
  // API keys with known prefixes
  {
    name: 'api-key-sk',
    regex: /\bsk-[a-zA-Z0-9]{20,}\b/g,
    replace: () => '[REDACTED-SECRET]',
  },
  {
    name: 'api-key-ghp',
    regex: /\bghp_[a-zA-Z0-9]{36,}\b/g,
    replace: () => '[REDACTED-SECRET]',
  },
  {
    name: 'api-key-gho',
    regex: /\bgho_[a-zA-Z0-9]{36,}\b/g,
    replace: () => '[REDACTED-SECRET]',
  },
  {
    name: 'bearer-token',
    regex: /Bearer\s+[A-Za-z0-9_\-.]{20,}/g,
    replace: () => 'Bearer [REDACTED-SECRET]',
  },
  // Credit/debit cards (13-19 digits, optionally grouped)
  {
    name: 'credit-card',
    regex: /\b(?:\d{4}[-\s]?){3,4}\d{1,4}\b/g,
    replace: () => '[REDACTED-CARD]',
  },
  // Emails
  {
    name: 'email',
    regex: /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g,
    replace: (i) => `user_${i}@redacted.local`,
  },
  // IPv6 (simplified: at least 3 colon-separated hex groups)
  {
    name: 'ipv6',
    regex: /\b(?:[0-9a-fA-F]{1,4}:){2,7}[0-9a-fA-F]{1,4}\b/g,
    replace: () => '0:0:0:0:0:0:0:0',
  },
  // IPv4
  {
    name: 'ipv4',
    regex: /\b(?:\d{1,3}\.){3}\d{1,3}\b/g,
    replace: () => '0.0.0.0',
  },
  // Phone numbers (international and domestic formats)
  {
    name: 'phone',
    regex: /(?:\+?1?[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}\b/g,
    replace: () => '+00-000-000-0000',
  },
  // AWS Access Key ID
  {
    name: 'aws-key',
    regex: /\bAKIA[0-9A-Z]{16}\b/g,
    replace: () => '[REDACTED-AWS-KEY]',
  },
  // GitHub Fine-grained PAT
  {
    name: 'gh-pat',
    regex: /\bgithub_pat_[a-zA-Z0-9_]{82}\b/g,
    replace: () => '[REDACTED-GITHUB-PAT]',
  },
  // Private Key Block
  {
    name: 'private-key',
    regex: /-----BEGIN (?:RSA |EC |OPENSSH |DSA )?PRIVATE KEY-----[\s\S]*?-----END (?:RSA |EC |OPENSSH |DSA )?PRIVATE KEY-----/g,
    replace: () => '[REDACTED-PRIVATE-KEY]',
  },
  // Google API Key
  {
    name: 'gcp-key',
    regex: /\bAIzaSy[A-Za-z0-9_-]{30,35}\b/g,
    replace: () => '[REDACTED-GCP-KEY]',
  },
  // Slack Webhook URL
  {
    name: 'slack-webhook',
    regex: /https:\/\/hooks\.slack\.com\/services\/T[a-zA-Z0-9_]+\/B[a-zA-Z0-9_]+\/[a-zA-Z0-9_]+/g,
    replace: () => 'https://hooks.slack.com/services/[REDACTED-SLACK-HOOK]',
  },
  // IBAN
  {
    name: 'iban',
    regex: /\b[A-Z]{2}[0-9]{2}[A-Z0-9]{4}[0-9]{7,26}\b/g,
    replace: () => '[REDACTED-IBAN]',
  },
  // Spanish DNI/NIE
  {
    name: 'dni-nie',
    regex: /\b(?:[XYZxyz][0-9]{7}[A-Za-z]|[0-9]{8}[A-Za-z])\b/g,
    replace: () => '[REDACTED-DNI]',
  },
  // US SSN
  {
    name: 'ssn',
    regex: /\b(?!000|666|9\d{2})\d{3}-(?!00)\d{2}-(?!0000)\d{4}\b/g,
    replace: () => '[REDACTED-SSN]',
  },
];

// ── Core Sanitization ────────────────────────────────────────────────────────

function sanitizeString(value: string, counters: Map<string, number>): string {
  let result = value;

  for (const pattern of PII_PATTERNS) {
    // Reset regex lastIndex since we reuse global regexes across calls
    pattern.regex.lastIndex = 0;
    result = result.replace(pattern.regex, () => {
      const current = (counters.get(pattern.name) ?? 0) + 1;
      counters.set(pattern.name, current);
      return pattern.replace(current);
    });
  }

  return result;
}

function walkAndSanitize(value: unknown, counters: Map<string, number>): unknown {
  if (typeof value === 'string') {
    return sanitizeString(value, counters);
  }
  if (Array.isArray(value)) {
    return value.map((item) => walkAndSanitize(item, counters));
  }
  if (value !== null && typeof value === 'object') {
    const result: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
      result[sanitizeString(k, counters)] = walkAndSanitize(v, counters);
    }
    return result;
  }
  return value;
}

// ── Public API ───────────────────────────────────────────────────────────────

export interface SanitizeResult {
  success: true;
  output: string;
  detections: number;
}

export interface SanitizeError {
  success: false;
  error: string;
}

export function sanitizePII(
  input: string,
  inputFormat: InputFormat,
): SanitizeResult | SanitizeError {
  try {
    const parsed = parseInput(input, inputFormat);
    const counters = new Map<string, number>();
    const sanitized = walkAndSanitize(parsed, counters);

    // Count how many substitutions were made by comparing
    const originalStr = JSON.stringify(parsed);
    const sanitizedStr = JSON.stringify(sanitized);
    const detections = countDifferences(originalStr, sanitizedStr);

    // Serialize back to the original format
    let output: string;
    switch (inputFormat) {
      case 'json':
        output = toJSON(sanitized);
        break;
      case 'csv':
        output = toCSV(sanitized);
        break;
      case 'yaml':
        output = toYAML(sanitized);
        break;
    }

    return { success: true, output, detections };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : String(err),
    };
  }
}

function countDifferences(a: string, b: string): number {
  if (a === b) return 0;
  // Rough heuristic: count unique redaction markers in the sanitized output
  let count = 0;
  const markers = [
    '@redacted.local',
    '[REDACTED-SECRET]',
    '[REDACTED-CARD]',
    '[REDACTED-AWS-KEY]',
    '[REDACTED-GITHUB-PAT]',
    '[REDACTED-PRIVATE-KEY]',
    '[REDACTED-GCP-KEY]',
    '[REDACTED-SLACK-HOOK]',
    '[REDACTED-IBAN]',
    '[REDACTED-DNI]',
    '[REDACTED-SSN]',
    '0.0.0.0',
    '0:0:0:0:0:0:0:0',
    '+00-000-000-0000',
  ];
  for (const marker of markers) {
    let idx = 0;
    while ((idx = b.indexOf(marker, idx)) !== -1) {
      count++;
      idx += marker.length;
    }
  }
  return count;
}
