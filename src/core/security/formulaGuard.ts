// ── FormatPulse CSV Formula Injection / DDE Guard (OWASP Compliant) ────────

const FORMULA_TRIGGER_CHARS = new Set(['=', '+', '-', '@', '\t', '\r']);

/**
 * Checks if a string value begins with a formula trigger character
 * that could be executed by spreadsheet software (Excel, Calc, Google Sheets).
 */
export function isFormulaInjectionRisk(value: string): boolean {
  if (!value || typeof value !== 'string') return false;
  if (value.length === 0) return false;

  // Check raw first char (handles tabs and raw formula starters)
  const firstChar = value[0]!;
  if (FORMULA_TRIGGER_CHARS.has(firstChar)) {
    if (firstChar === '-' || firstChar === '+') {
      const rest = value.slice(1).trim();
      if (!Number.isNaN(Number(rest)) && rest.length > 0) {
        return false;
      }
    }
    return true;
  }

  // Also check trimmed first char in case of leading spaces
  const trimmed = value.trim();
  if (trimmed.length > 0) {
    const trimmedFirst = trimmed[0]!;
    if (FORMULA_TRIGGER_CHARS.has(trimmedFirst)) {
      if (trimmedFirst === '-' || trimmedFirst === '+') {
        const rest = trimmed.slice(1).trim();
        if (!Number.isNaN(Number(rest)) && rest.length > 0) {
          return false;
        }
      }
      return true;
    }
  }

  return false;
}

/**
 * Neutralizes a field for safe CSV export by prepending a single quote (')
 * if it begins with an executable formula character.
 */
export function sanitizeCSVField(value: string): string {
  if (isFormulaInjectionRisk(value)) {
    // OWASP recommendation: prepend tab or single quote to force text rendering
    return `'${value}`;
  }
  return value;
}

/**
 * Scans an entire record array for formula injection threats.
 * Returns count of sanitized fields and the sanitized records.
 */
export function auditAndSanitizeRecords<T extends Record<string, unknown>>(
  records: T[],
): { sanitizedRecords: T[]; threatsNeutralized: number } {
  let threatsNeutralized = 0;

  const sanitizedRecords = records.map((record) => {
    const clean: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(record)) {
      if (typeof v === 'string' && isFormulaInjectionRisk(v)) {
        clean[k] = sanitizeCSVField(v);
        threatsNeutralized++;
      } else {
        clean[k] = v;
      }
    }
    return clean as T;
  });

  return { sanitizedRecords, threatsNeutralized };
}
