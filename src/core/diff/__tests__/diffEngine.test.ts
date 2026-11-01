import { describe, it, expect } from 'vitest';
import { createDiffReport } from '../diffEngine';

describe('Structural Schema & Payload Diff Engine', () => {
  it('reports zero changes for identical payloads', () => {
    const a = { id: 1, name: 'Alice', tags: ['admin'] };
    const b = { id: 1, name: 'Alice', tags: ['admin'] };

    const report = createDiffReport(a, b);
    expect(report.summary.totalChanges).toBe(0);
    expect(report.summary.breakingChangesCount).toBe(0);
    expect(report.unifiedText).toContain('No structural changes detected');
  });

  it('detects added and removed fields with breaking change flag on removal', () => {
    const original = { id: 1, name: 'Alice', legacyField: 'to_be_deleted' };
    const modified = { id: 1, name: 'Alice', newField: 'added_recently' };

    const report = createDiffReport(original, modified);

    expect(report.summary.addedCount).toBe(1);
    expect(report.summary.removedCount).toBe(1);
    expect(report.summary.breakingChangesCount).toBe(1); // legacyField removed

    const removedEntry = report.entries.find((e) => e.path === 'legacyField');
    expect(removedEntry?.type).toBe('removed');
    expect(removedEntry?.isBreaking).toBe(true);

    const addedEntry = report.entries.find((e) => e.path === 'newField');
    expect(addedEntry?.type).toBe('added');
    expect(addedEntry?.isBreaking).toBe(false);

    expect(report.unifiedText).toContain('+ [newField]');
    expect(report.unifiedText).toContain('- [legacyField]');
  });

  it('detects type mutations as breaking changes (e.g. number to string)', () => {
    const original = { id: 100, active: true };
    const modified = { id: '100', active: true }; // string instead of number

    const report = createDiffReport(original, modified);

    expect(report.summary.breakingChangesCount).toBe(1);
    const typeEntry = report.entries.find((e) => e.path === 'id');
    expect(typeEntry?.type).toBe('type_changed');
    expect(typeEntry?.oldType).toBe('number');
    expect(typeEntry?.newType).toBe('string');
    expect(typeEntry?.isBreaking).toBe(true);
    expect(report.unifiedText).toContain('TYPE_CHANGED: number -> string [BREAKING]');
  });

  it('compares nested objects and arrays accurately', () => {
    const original = {
      users: [{ id: 1, email: 'alice@example.com' }],
      config: { timeout: 5000 },
    };
    const modified = {
      users: [
        { id: 1, email: 'user_1@redacted.local' },
        { id: 2, email: 'user_2@redacted.local' },
      ],
      config: { timeout: 10000 },
    };

    const report = createDiffReport(original, modified);

    expect(report.summary.totalChanges).toBeGreaterThanOrEqual(3);
    expect(report.summary.addedCount).toBeGreaterThanOrEqual(1); // users[1] added
  });
});
