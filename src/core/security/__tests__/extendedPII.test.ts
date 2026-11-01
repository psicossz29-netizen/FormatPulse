import { describe, it, expect } from 'vitest';
import {
  inspectDataHealth,
  sanitizeExtendedSecrets,
} from '../extendedPII';

describe('Extended PII, Cloud Secrets & Data Health Inspector', () => {
  it('detects AWS Access Key ID in text or records', () => {
    const data = {
      credentials: {
        access_key: 'AKIAIOSFODNN7EXAMPLE',
        region: 'us-east-1',
      },
    };

    const report = inspectDataHealth(data);
    const awsThreat = report.threats.find((t) => t.id === 'aws-access-key');

    expect(awsThreat).toBeDefined();
    expect(awsThreat?.count).toBe(1);
    expect(report.criticalSecretsCount).toBe(1);
    expect(report.overallScore).toBeLessThan(100);
  });

  it('detects GitHub fine-grained personal access tokens', () => {
    const pat = ['github', '_pat_', '11AAAAAAA0123456789012345678901234567890123456789012345678901234567890123456789012'].join('');
    const data = { token: pat };

    const report = inspectDataHealth(data);
    const ghThreat = report.threats.find((t) => t.id === 'github-fine-grained-pat');

    expect(ghThreat).toBeDefined();
    expect(report.criticalSecretsCount).toBeGreaterThanOrEqual(1);
  });

  it('detects asymmetric cryptographic private key blocks', () => {
    const pem = `-----BEGIN RSA PRIVATE KEY-----
MIIEowIBAAKCAQEA0Y1+examplekeyexamplekeyexamplekey
-----END RSA PRIVATE KEY-----`;
    const data = { privateKey: pem };

    const report = inspectDataHealth(data);
    const keyThreat = report.threats.find((t) => t.id === 'private-crypto-key');

    expect(keyThreat).toBeDefined();
    expect(report.criticalSecretsCount).toBe(1);
  });

  it('detects Google Cloud API keys', () => {
    const data = { apiKey: ['AIza', 'SyD-exampleKey0123456789012345678'].join('') };
    const report = inspectDataHealth(data);

    expect(report.threats.some((t) => t.id === 'google-api-key')).toBe(true);
  });

  it('detects Slack webhook URLs', () => {
    const data = {
      webhook: ['https://hooks.', 'slack.com/services/T00000000/B00000000/XXXXXXXXXXXXXXXXXXXXXXXX'].join(''),
    };
    const report = inspectDataHealth(data);

    expect(report.threats.some((t) => t.id === 'slack-webhook')).toBe(true);
  });

  it('detects IBAN, Spanish DNI/NIE and US SSN', () => {
    const data = {
      user: {
        dni: '12345678Z',
        iban: 'ES9121000418450200051332',
        ssn: '123-45-6789',
      },
    };

    const report = inspectDataHealth(data);

    expect(report.threats.some((t) => t.id === 'spanish-dni-nie')).toBe(true);
    expect(report.threats.some((t) => t.id === 'iban')).toBe(true);
    expect(report.threats.some((t) => t.id === 'us-ssn')).toBe(true);
    expect(report.piiCount).toBeGreaterThanOrEqual(2);
  });

  it('grades clean data as A+ with 100/100 score', () => {
    const cleanData = {
      product: 'Precision Lathe Chuck',
      sku: 'SKU-8491',
      dimensions: { width: 120, height: 85 },
      in_stock: true,
    };

    const report = inspectDataHealth(cleanData);
    expect(report.overallScore).toBe(100);
    expect(report.securityGrade).toBe('A+');
    expect(report.criticalSecretsCount).toBe(0);
    expect(report.totalThreats).toBe(0);
  });

  it('replaces all extended secrets and regional PII using sanitizeExtendedSecrets', () => {
    const text = 'AWS: AKIAIOSFODNN7EXAMPLE and DNI: 12345678Z and IBAN: ES9121000418450200051332';
    const sanitized = sanitizeExtendedSecrets(text);

    expect(sanitized).toContain('[REDACTED-AWS-KEY]');
    expect(sanitized).toContain('[REDACTED-DNI]');
    expect(sanitized).toContain('[REDACTED-IBAN]');
    expect(sanitized).not.toContain('AKIAIOSFODNN7EXAMPLE');
    expect(sanitized).not.toContain('12345678Z');
    expect(sanitized).not.toContain('ES9121000418450200051332');
  });
});
