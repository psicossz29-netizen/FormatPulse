// ── FormatPulse Structural Schema & Payload Diff Engine ─────────────────────

export type DiffChangeType = 'added' | 'removed' | 'modified' | 'type_changed' | 'unchanged';

export interface DiffEntry {
  path: string;
  type: DiffChangeType;
  oldValue?: unknown;
  newValue?: unknown;
  oldType?: string;
  newType?: string;
  isBreaking: boolean;
}

export interface DiffReport {
  entries: DiffEntry[];
  summary: {
    totalChanges: number;
    addedCount: number;
    removedCount: number;
    modifiedCount: number;
    breakingChangesCount: number;
  };
  unifiedText: string;
}

function getType(val: unknown): string {
  if (val === null) return 'null';
  if (Array.isArray(val)) return 'array';
  return typeof val;
}

function formatVal(val: unknown): string {
  if (val === undefined) return '<undefined>';
  if (typeof val === 'string') return `"${val}"`;
  if (typeof val === 'object') return JSON.stringify(val);
  return String(val);
}

/**
 * Deeply compares two data structures and generates structural diff entries.
 */
export function compareStructures(
  original: unknown,
  modified: unknown,
  currentPath = '',
  entries: DiffEntry[] = [],
): DiffEntry[] {
  const origType = getType(original);
  const modType = getType(modified);

  if (origType !== modType) {
    entries.push({
      path: currentPath || 'root',
      type: 'type_changed',
      oldValue: original,
      newValue: modified,
      oldType: origType,
      newType: modType,
      isBreaking: true,
    });
    return entries;
  }

  // Primitive comparison
  if (origType !== 'object' && origType !== 'array') {
    if (original !== modified) {
      entries.push({
        path: currentPath || 'root',
        type: 'modified',
        oldValue: original,
        newValue: modified,
        oldType: origType,
        newType: modType,
        isBreaking: false,
      });
    }
    return entries;
  }

  // Object comparison
  if (origType === 'object' && original !== null && modified !== null) {
    const origObj = original as Record<string, unknown>;
    const modObj = modified as Record<string, unknown>;

    const allKeys = Array.from(new Set([...Object.keys(origObj), ...Object.keys(modObj)]));

    for (const key of allKeys) {
      const childPath = currentPath ? `${currentPath}.${key}` : key;
      const inOrig = Object.prototype.hasOwnProperty.call(origObj, key);
      const inMod = Object.prototype.hasOwnProperty.call(modObj, key);

      if (inOrig && !inMod) {
        entries.push({
          path: childPath,
          type: 'removed',
          oldValue: origObj[key],
          oldType: getType(origObj[key]),
          isBreaking: true, // Key removal is considered breaking in schema design
        });
      } else if (!inOrig && inMod) {
        entries.push({
          path: childPath,
          type: 'added',
          newValue: modObj[key],
          newType: getType(modObj[key]),
          isBreaking: false,
        });
      } else {
        compareStructures(origObj[key], modObj[key], childPath, entries);
      }
    }
    return entries;
  }

  // Array comparison
  if (origType === 'array' && Array.isArray(original) && Array.isArray(modified)) {
    const maxLen = Math.max(original.length, modified.length);
    for (let i = 0; i < maxLen; i++) {
      const childPath = `${currentPath || 'items'}[${i}]`;
      if (i >= original.length) {
        entries.push({
          path: childPath,
          type: 'added',
          newValue: modified[i],
          newType: getType(modified[i]),
          isBreaking: false,
        });
      } else if (i >= modified.length) {
        entries.push({
          path: childPath,
          type: 'removed',
          oldValue: original[i],
          oldType: getType(original[i]),
          isBreaking: true,
        });
      } else {
        compareStructures(original[i], modified[i], childPath, entries);
      }
    }
  }

  return entries;
}

/**
 * Builds a unified Git-style text representation from diff entries.
 */
export function generateUnifiedDiff(entries: DiffEntry[]): string {
  if (entries.length === 0) {
    return '--- Original\n+++ Modified\n\nNo structural changes detected (Identical payloads).';
  }

  const lines: string[] = ['--- Original', '+++ Modified', ''];

  for (const entry of entries) {
    switch (entry.type) {
      case 'added':
        lines.push(`+ [${entry.path}] (${entry.newType}): ${formatVal(entry.newValue)}`);
        break;
      case 'removed':
        lines.push(`- [${entry.path}] (${entry.oldType}): ${formatVal(entry.oldValue)} [BREAKING]`);
        break;
      case 'modified':
        lines.push(`- [${entry.path}]: ${formatVal(entry.oldValue)}`);
        lines.push(`+ [${entry.path}]: ${formatVal(entry.newValue)}`);
        break;
      case 'type_changed':
        lines.push(
          `~ [${entry.path}] TYPE_CHANGED: ${entry.oldType} -> ${entry.newType} [BREAKING]`,
        );
        lines.push(`- [${entry.path}]: ${formatVal(entry.oldValue)}`);
        lines.push(`+ [${entry.path}]: ${formatVal(entry.newValue)}`);
        break;
      case 'unchanged':
        break;
    }
  }

  return lines.join('\n');
}

/**
 * High-level orchestration function to compare two JSON/YAML payloads.
 */
export function createDiffReport(original: unknown, modified: unknown): DiffReport {
  const entries = compareStructures(original, modified);

  const addedCount = entries.filter((e) => e.type === 'added').length;
  const removedCount = entries.filter((e) => e.type === 'removed').length;
  const modifiedCount = entries.filter((e) => e.type === 'modified' || e.type === 'type_changed').length;
  const breakingChangesCount = entries.filter((e) => e.isBreaking).length;

  return {
    entries,
    summary: {
      totalChanges: entries.length,
      addedCount,
      removedCount,
      modifiedCount,
      breakingChangesCount,
    },
    unifiedText: generateUnifiedDiff(entries),
  };
}
