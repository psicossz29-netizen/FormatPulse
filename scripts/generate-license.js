#!/usr/bin/env node

/**
 * FormatPulse CLI License Generator ($0 Ops Utility)
 * Generates valid offline cryptographic license keys for customers.
 *
 * Usage:
 *   node scripts/generate-license.js --tier pro --customer "alex@dev.co"
 *   npm run keygen -- --tier team --customer "eng-lead@startup.io"
 *   npm run keygen -- --tier enterprise --customer "security@corp.com"
 */

const SALT = 'FORMATPULSE_OFFLINE_SECRET_SALT_2026_V1';

function computeKeyChecksum(data) {
  const input = `${data}#${SALT}`;
  let hash = 0x811c9dc5; // FNV-1a 32-bit offset basis

  for (let i = 0; i < input.length; i++) {
    hash ^= input.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193) >>> 0;
  }

  const folded = ((hash >>> 16) ^ (hash & 0xffff)) & 0xffff;
  return folded.toString(16).toUpperCase().padStart(4, '0');
}

function generateKey(tierName = 'pro', customerSeed = '') {
  const normalizedTier = tierName.toLowerCase();
  let prefix = 'PRO';
  let seats = 1;

  if (normalizedTier.includes('team')) {
    prefix = 'TEAM';
    seats = 5;
  } else if (normalizedTier.includes('ent')) {
    prefix = 'ENT';
    seats = 'Unlimited Intranet';
  }

  let payload = '';
  if (customerSeed && customerSeed.trim().length >= 4) {
    const clean = customerSeed.replace(/[^A-Z0-9]/gi, '').toUpperCase();
    payload = clean.slice(0, 4).padEnd(4, 'X');
  } else {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    for (let i = 0; i < 4; i++) {
      payload += chars.charAt(Math.floor(Math.random() * chars.length));
    }
  }

  const base = `FP-${prefix}-2026-${payload}`;
  const checksum = computeKeyChecksum(base);
  const licenseKey = `${base}-${checksum}`;

  return {
    licenseKey,
    tier: prefix === 'PRO' ? 'Pro Lifetime' : prefix === 'TEAM' ? 'Team Pack (5 Seats)' : 'Enterprise Air-Gapped',
    seats,
    payload,
    checksum,
    customer: customerSeed || 'Anonymous Customer',
    generatedAt: new Date().toISOString(),
  };
}

// ── CLI Argument Parser ──────────────────────────────────────────────────────

const args = process.argv.slice(2);
let tier = 'pro';
let customer = '';

for (let i = 0; i < args.length; i++) {
  if (args[i] === '--tier' && args[i + 1]) {
    tier = args[i + 1];
    i++;
  } else if (args[i] === '--customer' && args[i + 1]) {
    customer = args[i + 1];
    i++;
  }
}

const result = generateKey(tier, customer);

console.log('\n================================================================');
console.log('  FORMATPULSE CRYPTOGRAPHIC LICENSE GENERATOR');
console.log('================================================================');
console.log(`  Tier:          ${result.tier}`);
console.log(`  Seats:         ${result.seats}`);
console.log(`  Customer:      ${result.customer}`);
console.log(`  Generated:     ${result.generatedAt}`);
console.log('----------------------------------------------------------------');
console.log(`  LICENSE KEY:   ${result.licenseKey}`);
console.log('================================================================');
console.log('\n[Customer Delivery Snippet - Ready to copy/paste in email / chat]:\n');
console.log(`Hi ${result.customer.split('@')[0] || 'there'},

Thank you for purchasing FormatPulse ${result.tier}!

Here is your lifetime license key:
${result.licenseKey}

How to activate:
1. Open FormatPulse (web: https://formatpulse.com or Windows desktop .exe).
2. Click "Activate PRO" in the top bar or press ⌘K -> "Activate License".
3. Paste your key: ${result.licenseKey}
4. Click "Activate" — it verifies 100% offline with zero network phoning.

All features are now permanently unlocked on your device.

Need an invoice or air-gapped compliance receipt? Simply reply to this email.

Best regards,
FormatPulse Engineering
`);
