import { describe, it, expect } from 'vitest';
import {
  processBatchFiles,
  deriveOutputFilename,
  getFileExtensionForFormat,
  type BatchInputFile,
} from '../batchProcessor';

describe('FormatPulse Batch Processing Engine', () => {
  describe('File Extension & Naming Logic', () => {
    it('derives correct file extensions for each output format', () => {
      expect(getFileExtensionForFormat('typescript')).toBe('.ts');
      expect(getFileExtensionForFormat('zod')).toBe('.zod.ts');
      expect(getFileExtensionForFormat('sql-ddl')).toBe('.sql');
      expect(getFileExtensionForFormat('json')).toBe('.json');
      expect(getFileExtensionForFormat('csv')).toBe('.csv');
      expect(getFileExtensionForFormat('yaml')).toBe('.yaml');
      expect(getFileExtensionForFormat('pii-sanitizer')).toBe('.sanitized.json');
      expect(getFileExtensionForFormat('rust')).toBe('.rs');
      expect(getFileExtensionForFormat('go')).toBe('.go');
    });

    it('derives correct output filenames replacing original extensions', () => {
      expect(deriveOutputFilename('users.json', 'typescript')).toBe('users.ts');
      expect(deriveOutputFilename('data.csv', 'sql-ddl')).toBe('data.sql');
      expect(deriveOutputFilename('customers.yaml', 'pii-sanitizer')).toBe('customers.sanitized.json');
    });
  });

  describe('processBatchFiles', () => {
    it('batch converts valid JSON and CSV files to TypeScript interfaces', async () => {
      const inputs: BatchInputFile[] = [
        {
          id: '1',
          name: 'users.json',
          content: JSON.stringify([{ id: 1, name: 'John Doe', active: true }]),
          format: 'json',
          sizeBytes: 45,
        },
        {
          id: '2',
          name: 'products.csv',
          content: 'sku,price,stock\nA1,19.99,10\nB2,29.99,5',
          format: 'csv',
          sizeBytes: 40,
        },
      ];

      const report = await processBatchFiles(inputs, 'typescript');

      expect(report.totalFiles).toBe(2);
      expect(report.successfulFiles).toBe(2);
      expect(report.failedFiles).toBe(0);
      expect(report.files.length).toBe(2);

      const first = report.files[0]!;
      expect(first.success).toBe(true);
      expect(first.outputName).toBe('users.ts');
      expect(first.content).toContain('interface');

      const second = report.files[1]!;
      expect(second.success).toBe(true);
      expect(second.outputName).toBe('products.ts');
      expect(second.content).toContain('interface');
    });

    it('batch sanitizes PII across multiple files', async () => {
      const inputs: BatchInputFile[] = [
        {
          id: '1',
          name: 'customers.json',
          content: JSON.stringify({ email: 'ceo@target.com', ssn: '123-45-6789' }),
          format: 'json',
          sizeBytes: 50,
        },
      ];

      const report = await processBatchFiles(inputs, 'pii-sanitizer');
      expect(report.successfulFiles).toBe(1);
      expect(report.files[0]?.content).toContain('@redacted.local');
    });

    it('gracefully handles invalid/corrupted files without crashing batch', async () => {
      const inputs: BatchInputFile[] = [
        {
          id: '1',
          name: 'valid.json',
          content: '{"status":"ok"}',
          format: 'json',
          sizeBytes: 15,
        },
        {
          id: '2',
          name: 'corrupted.json',
          content: '{"unclosed_json',
          format: 'json',
          sizeBytes: 16,
        },
      ];

      const report = await processBatchFiles(inputs, 'typescript');
      expect(report.totalFiles).toBe(2);
      expect(report.successfulFiles).toBe(1);
      expect(report.failedFiles).toBe(1);

      const failed = report.files.find((f) => f.id === '2');
      expect(failed?.success).toBe(false);
      expect(failed?.error).toBeDefined();
    });
  });
});
