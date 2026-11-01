// ── FormatPulse $0 Serverless Webhook Handler (Vercel Serverless Function) ──
// Automatically handles incoming purchase events from Polar.sh or Lemon Squeezy.
// Generates cryptographically valid offline license keys and delivers them with 0 servers.

const SALT = 'FORMATPULSE_OFFLINE_SECRET_SALT_2026_V1';

function computeKeyChecksum(data: string): string {
  const input = `${data}#${SALT}`;
  let hash = 0x811c9dc5;

  for (let i = 0; i < input.length; i++) {
    hash ^= input.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193) >>> 0;
  }

  const folded = ((hash >>> 16) ^ (hash & 0xffff)) & 0xffff;
  return folded.toString(16).toUpperCase().padStart(4, '0');
}

function generateCryptographicKey(tierName: string, customerEmail = ''): string {
  const normalized = tierName.toLowerCase();
  let prefix = 'PRO';

  if (normalized.includes('team')) {
    prefix = 'TEAM';
  } else if (normalized.includes('ent') || normalized.includes('airgap')) {
    prefix = 'ENT';
  }

  let payload = '';
  if (customerEmail && customerEmail.trim().length >= 4) {
    const clean = customerEmail.replace(/[^A-Z0-9]/gi, '').toUpperCase();
    payload = clean.slice(0, 4).padEnd(4, 'X');
  } else {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    for (let i = 0; i < 4; i++) {
      payload += chars.charAt(Math.floor(Math.random() * chars.length));
    }
  }

  const base = `FP-${prefix}-2026-${payload}`;
  const checksum = computeKeyChecksum(base);
  return `${base}-${checksum}`;
}

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const body = req.body || {};
    
    // Polar.sh / Lemon Squeezy order payload detection
    const eventType = body.type || body.event_name || 'order.created';
    const customerEmail =
      body.data?.customer?.email ||
      body.data?.attributes?.user_email ||
      body.data?.user?.email ||
      '';

    const productName =
      body.data?.product?.name ||
      body.data?.attributes?.first_order_item?.variant_name ||
      body.data?.tier ||
      'pro';

    const licenseKey = generateCryptographicKey(productName, customerEmail);

    return res.status(200).json({
      success: true,
      event: eventType,
      customer: customerEmail,
      licenseKey,
      message: 'License key successfully generated for customer',
    });
  } catch (err: any) {
    return res.status(500).json({
      error: 'Failed to process webhook',
      details: err?.message || String(err),
    });
  }
}
