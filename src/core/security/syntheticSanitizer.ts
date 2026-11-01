// ── Deterministic Synthetic Faker & Custom PII Masking Engine ──────────────────
// Preserves referential integrity across datasets using deterministic local hashing.

export interface CustomRedactionRule {
  id: string;
  pattern: string;
  mask: string;
  flags?: string;
  description?: string;
}

// ── Curated Synthetic Dictionaries ───────────────────────────────────────────

const SYNTHETIC_FIRST_NAMES = [
  'Alex', 'Jordan', 'Taylor', 'Morgan', 'Casey', 'Sam', 'Riley', 'Avery',
  'Cameron', 'Quinn', 'Dakota', 'Reese', 'Skyler', 'Finley', 'Rowan', 'Harper',
  'Elena', 'Lucas', 'Mateo', 'Sofia', 'Marcus', 'Chloe', 'Liam', 'Zoe',
];

const SYNTHETIC_LAST_NAMES = [
  'Vance', 'Sterling', 'Mercer', 'Hayes', 'Chen', 'Sinclair', 'Thorne', 'Alvarez',
  'Kowalski', 'Novak', 'Blackwood', 'Gallagher', 'Montague', 'Winters', 'Nakamura', 'O’Connor',
  'Dubois', 'Castillo', 'Lindqvist', 'Bauer',
];

const SYNTHETIC_COMPANIES = [
  'Apex Systems', 'Quantum Dynamic', 'Helios Logistics', 'Strata Cloud',
  'Pulse Technologies', 'Vector Analytics', 'Horizon Labs', 'CipherCore Corp',
  'Solstice Networks', 'Cobalt Energy',
];

const SYNTHETIC_DOMAINS = [
  'sandbox.local', 'staging-internal.net', 'synthetic-corp.io', 'dev-vault.test',
  'mock-enterprise.org', 'test-node.dev',
];

// ── Deterministic Hash (32-bit FNV-1a) ────────────────────────────────────────

function fnv1a(str: string): number {
  let hash = 0x811c9dc5;
  for (let i = 0; i < str.length; i++) {
    hash ^= str.charCodeAt(i);
    hash += (hash << 1) + (hash << 4) + (hash << 7) + (hash << 8) + (hash << 24);
  }
  return hash >>> 0;
}

// ── Synthetic Value Generators ───────────────────────────────────────────────

export function getSyntheticName(original: string): string {
  const hash = fnv1a(original);
  const first = SYNTHETIC_FIRST_NAMES[hash % SYNTHETIC_FIRST_NAMES.length] ?? 'Alex';
  const last = SYNTHETIC_LAST_NAMES[(hash >>> 8) % SYNTHETIC_LAST_NAMES.length] ?? 'Morgan';
  return `${first} ${last}`;
}

export function getSyntheticEmail(original: string): string {
  const hash = fnv1a(original);
  const user = (SYNTHETIC_FIRST_NAMES[hash % SYNTHETIC_FIRST_NAMES.length] ?? 'alex').toLowerCase();
  const domain = SYNTHETIC_DOMAINS[(hash >>> 4) % SYNTHETIC_DOMAINS.length] ?? 'sandbox.local';
  const num = (hash % 900) + 100;
  return `${user}.${num}@${domain}`;
}

export function getSyntheticCompany(original: string): string {
  const hash = fnv1a(original);
  return SYNTHETIC_COMPANIES[hash % SYNTHETIC_COMPANIES.length] ?? 'Acme Corp';
}

export function getSyntheticPhone(original: string): string {
  const hash = fnv1a(original);
  const area = 200 + (hash % 700);
  const mid = 100 + ((hash >>> 6) % 900);
  const end = 1000 + ((hash >>> 12) % 9000);
  return `+1-${area}-${mid}-${end}`;
}

export function getSyntheticIP(original: string): string {
  const hash = fnv1a(original);
  // Carrier-grade NAT or internal private range 10.x.x.x
  const b = (hash >>> 8) & 0xff;
  const c = (hash >>> 16) & 0xff;
  const d = ((hash >>> 24) & 0xfe) + 1;
  return `10.${b}.${c}.${d}`;
}

// ── Custom Rule Application ──────────────────────────────────────────────────

export function applyCustomRules(text: string, rules: CustomRedactionRule[]): string {
  let result = text;
  for (const rule of rules) {
    try {
      const regex = new RegExp(rule.pattern, rule.flags || 'g');
      result = result.replace(regex, rule.mask);
    } catch {
      // Invalid regex pattern supplied by user is safely skipped
      continue;
    }
  }
  return result;
}

// ── Synthetic Data Replacement Mode ──────────────────────────────────────────

export function sanitizeWithSynthetics(text: string): string {
  // Replace emails deterministically
  const emailRe = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
  let result = text.replace(emailRe, (match) => getSyntheticEmail(match));

  // Replace IPv4 deterministically
  const ipRe = /\b(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\b/g;
  result = result.replace(ipRe, (match) => {
    // Avoid redacting common zero-bases or local loops if desired, but sanitize remote IPs
    if (match === '0.0.0.0' || match === '127.0.0.1') return match;
    return getSyntheticIP(match);
  });

  // Replace phone numbers deterministically
  const phoneRe = /(?:\+?1?[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}\b/g;
  result = result.replace(phoneRe, (match) => getSyntheticPhone(match));

  return result;
}
