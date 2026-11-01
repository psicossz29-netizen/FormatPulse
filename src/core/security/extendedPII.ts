// ── FormatPulse Extended PII, Cloud Secrets & Data Health Inspector ─────────

export interface DetectedThreat {
  id: string;
  category: 'cloud-secret' | 'pii' | 'banking' | 'injection' | 'data-quality';
  severity: 'critical' | 'high' | 'medium' | 'low';
  title: string;
  count: number;
  samplePlaceholder: string;
}

export interface DataHealthReport {
  overallScore: number; // 0 to 100
  securityGrade: 'A+' | 'A' | 'B' | 'C' | 'F';
  threats: DetectedThreat[];
  totalThreats: number;
  criticalSecretsCount: number;
  piiCount: number;
  dataHygiene: {
    nullFields: number;
    emptyStrings: number;
    totalFieldsScanned: number;
  };
  recommendations: string[];
}

export interface SecurityPattern {
  id: string;
  name: string;
  category: 'cloud-secret' | 'pii' | 'banking';
  severity: 'critical' | 'high' | 'medium';
  regex: RegExp;
  replacement: string | ((match: string, idx: number) => string);
  description: string;
}

export const EXTENDED_SECURITY_PATTERNS: SecurityPattern[] = [
  // ── Cloud & DevOps Secrets (Critical Severity) ───────────────────────────
  {
    id: 'aws-access-key',
    name: 'AWS Access Key ID',
    category: 'cloud-secret',
    severity: 'critical',
    regex: /\bAKIA[0-9A-Z]{16}\b/g,
    replacement: '[REDACTED-AWS-KEY]',
    description: 'Amazon Web Services IAM User / System Access Key',
  },
  {
    id: 'github-fine-grained-pat',
    name: 'GitHub Fine-Grained Token',
    category: 'cloud-secret',
    severity: 'critical',
    regex: /\bgithub_pat_[a-zA-Z0-9_]{82}\b/g,
    replacement: '[REDACTED-GITHUB-PAT]',
    description: 'Fine-grained Personal Access Token for GitHub repositories',
  },
  {
    id: 'private-crypto-key',
    name: 'Cryptographic Private Key Block',
    category: 'cloud-secret',
    severity: 'critical',
    regex: /-----BEGIN (?:RSA |EC |OPENSSH |DSA )?PRIVATE KEY-----[\s\S]*?-----END (?:RSA |EC |OPENSSH |DSA )?PRIVATE KEY-----/g,
    replacement: '[REDACTED-PRIVATE-KEY]',
    description: 'Unencrypted asymmetric private key block (RSA / EC / OpenSSH)',
  },
  {
    id: 'google-api-key',
    name: 'Google Cloud API Key',
    category: 'cloud-secret',
    severity: 'critical',
    regex: /\bAIzaSy[A-Za-z0-9_-]{30,35}\b/g,
    replacement: '[REDACTED-GCP-KEY]',
    description: 'Google Cloud Platform API key with public/internal service access',
  },
  {
    id: 'slack-webhook',
    name: 'Slack Incoming Webhook URL',
    category: 'cloud-secret',
    severity: 'high',
    regex: /https:\/\/hooks\.slack\.com\/services\/T[a-zA-Z0-9_]+\/B[a-zA-Z0-9_]+\/[a-zA-Z0-9_]+/g,
    replacement: 'https://hooks.slack.com/services/[REDACTED-SLACK-HOOK]',
    description: 'Direct posting endpoint for internal Slack workspaces',
  },

  // ── Regional Identity & Banking (High Severity) ──────────────────────────
  {
    id: 'iban',
    name: 'IBAN Bank Account',
    category: 'banking',
    severity: 'high',
    // Basic structural check for 15-34 alphanumeric characters starting with 2-letter country code
    regex: /\b[A-Z]{2}[0-9]{2}[A-Z0-9]{4}[0-9]{7,26}\b/g,
    replacement: '[REDACTED-IBAN]',
    description: 'International Bank Account Number',
  },
  {
    id: 'spanish-dni-nie',
    name: 'Spanish DNI / NIE',
    category: 'pii',
    severity: 'high',
    regex: /\b(?:[XYZxyz][0-9]{7}[A-Za-z]|[0-9]{8}[A-Za-z])\b/g,
    replacement: '[REDACTED-DNI]',
    description: 'Spanish National Identity Document or Foreigner Identity Number',
  },
  {
    id: 'us-ssn',
    name: 'US Social Security Number',
    category: 'pii',
    severity: 'critical',
    regex: /\b(?!000|666|9\d{2})\d{3}-(?!00)\d{2}-(?!0000)\d{4}\b/g,
    replacement: '[REDACTED-SSN]',
    description: 'United States 9-digit Social Security Number',
  },
];

/**
 * Scans an AST or structured data representation to produce a Data Health & Security Report.
 */
export function inspectDataHealth(data: unknown): DataHealthReport {
  let nullFields = 0;
  let emptyStrings = 0;
  let totalFields = 0;
  const threatCounts = new Map<string, number>();

  function scanValue(val: unknown) {
    totalFields++;
    if (val === null || val === undefined) {
      nullFields++;
      return;
    }

    if (typeof val === 'string') {
      if (val.trim() === '') {
        emptyStrings++;
        return;
      }

      // Check extended security patterns
      for (const pattern of EXTENDED_SECURITY_PATTERNS) {
        pattern.regex.lastIndex = 0;
        const matches = val.match(pattern.regex);
        if (matches && matches.length > 0) {
          const prev = threatCounts.get(pattern.id) ?? 0;
          threatCounts.set(pattern.id, prev + matches.length);
        }
      }
      return;
    }

    if (Array.isArray(val)) {
      for (const item of val) {
        scanValue(item);
      }
      return;
    }

    if (typeof val === 'object') {
      for (const [k, v] of Object.entries(val as Record<string, unknown>)) {
        scanValue(k);
        scanValue(v);
      }
    }
  }

  scanValue(data);

  // Build threats list
  const threats: DetectedThreat[] = [];
  let criticalSecretsCount = 0;
  let piiCount = 0;
  let scoreDeduction = 0;

  for (const pattern of EXTENDED_SECURITY_PATTERNS) {
    const count = threatCounts.get(pattern.id);
    if (count && count > 0) {
      threats.push({
        id: pattern.id,
        category: pattern.category,
        severity: pattern.severity,
        title: pattern.name,
        count,
        samplePlaceholder:
          typeof pattern.replacement === 'string'
            ? pattern.replacement
            : '[REDACTED]',
      });

      if (pattern.severity === 'critical') {
        criticalSecretsCount += count;
        scoreDeduction += count * 25;
      } else if (pattern.severity === 'high') {
        piiCount += count;
        scoreDeduction += count * 15;
      } else {
        scoreDeduction += count * 5;
      }
    }
  }

  // Deduct small amount for poor data hygiene (empty strings & excessive nulls)
  if (totalFields > 0) {
    const emptyRatio = (nullFields + emptyStrings) / totalFields;
    if (emptyRatio > 0.3) {
      scoreDeduction += 10;
    }
  }

  const overallScore = Math.max(0, Math.min(100, 100 - scoreDeduction));

  let securityGrade: 'A+' | 'A' | 'B' | 'C' | 'F' = 'A+';
  if (overallScore === 100) securityGrade = 'A+';
  else if (overallScore >= 85) securityGrade = 'A';
  else if (overallScore >= 70) securityGrade = 'B';
  else if (overallScore >= 50) securityGrade = 'C';
  else securityGrade = 'F';

  const recommendations: string[] = [];
  if (criticalSecretsCount > 0) {
    recommendations.push(
      `CRITICAL: Found ${criticalSecretsCount} live infrastructure secrets (AWS, Private Keys, or GCP Keys). Sanitize immediately before sharing or saving.`,
    );
  }
  if (piiCount > 0) {
    recommendations.push(
      `HIGH: Found ${piiCount} regional PII records (IBAN, SSN, DNI/NIE). Apply PII Sanitizer to comply with GDPR/CCPA.`,
    );
  }
  if (nullFields > 5) {
    recommendations.push(
      `Data Quality: Detected ${nullFields} null fields. Consider filling default values or filtering empty keys.`,
    );
  }
  if (recommendations.length === 0) {
    recommendations.push(
      'Clean & Secure: No secrets or raw PII detected. Dataset is safe for production inference.',
    );
  }

  return {
    overallScore,
    securityGrade,
    threats,
    totalThreats: threats.reduce((acc, t) => acc + t.count, 0),
    criticalSecretsCount,
    piiCount,
    dataHygiene: {
      nullFields,
      emptyStrings,
      totalFieldsScanned: totalFields,
    },
    recommendations,
  };
}

/**
 * Sanitizes all extended cloud secrets and regional PII patterns from text or structured objects.
 */
export function sanitizeExtendedSecrets(value: string): string {
  let result = value;
  for (const pattern of EXTENDED_SECURITY_PATTERNS) {
    pattern.regex.lastIndex = 0;
    if (typeof pattern.replacement === 'string') {
      result = result.replace(pattern.regex, pattern.replacement);
    } else {
      let idx = 0;
      result = result.replace(pattern.regex, (m) => {
        idx++;
        return (pattern.replacement as (match: string, i: number) => string)(m, idx);
      });
    }
  }
  return result;
}
