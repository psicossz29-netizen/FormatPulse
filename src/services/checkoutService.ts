// ── FormatPulse Merchant of Record (MoR) Checkout Integration ─────────────────
// Handles checkout session generation, coupon codes, and multi-tier licensing.

export type PricingTierId = 'individual' | 'team' | 'enterprise';

export interface PricingPlan {
  id: PricingTierId;
  name: string;
  badge?: string;
  priceUSD: number;
  regularPriceUSD: number;
  billingType: 'one-time';
  seats: string;
  description: string;
  features: string[];
  polarProductId?: string;
  lemonVariantId?: string;
}

export const PRICING_PLANS: Record<PricingTierId, PricingPlan> = {
  individual: {
    id: 'individual',
    name: 'Individual Pro',
    badge: 'EARLY-BIRD $14',
    priceUSD: 14,
    regularPriceUSD: 19,
    billingType: 'one-time',
    seats: '1 Developer',
    description: 'Lifetime access for solo engineers, consultants, and power users.',
    features: [
      'Unlimited payload sizes (Bypasses 1MB Free limit)',
      'High-throughput Web Worker (>10MB non-blocking)',
      'All 10 Enterprise schema generators (TypeScript, Zod, OpenAPI, Prisma, etc.)',
      'Full Cloud Secrets & PII Anonymization suite',
      'Structural AST Diff with Breaking Change alerts',
      'Tamper-proof Web Crypto integrity receipts',
      'Deterministic Synthetic Faker engine',
      '100% Offline license validation (Air-gapped ready)',
      'Lifetime updates with zero subscription fees',
    ],
    polarProductId: 'polar_prod_individual_lifetime',
    lemonVariantId: 'lemonsqueezy_variant_ind_pro',
  },
  team: {
    id: 'team',
    name: 'Team Pack',
    badge: 'MOST POPULAR',
    priceUSD: 79,
    regularPriceUSD: 99,
    billingType: 'one-time',
    seats: '5 Developers',
    description: 'Designed for engineering teams needing strict data compliance.',
    features: [
      'Everything in Individual Pro for 5 developers',
      'Shared corporate master license key',
      'Centralized compliance and security receipts',
      'Company invoice with EU VAT / Sales Tax ID deduction',
      'Custom regex rules for corporate token redaction',
      'Priority bug triage and GitHub issue escalation',
      'Lifetime team ownership with 0 monthly recurring costs',
    ],
    polarProductId: 'polar_prod_team_pack',
    lemonVariantId: 'lemonsqueezy_variant_team',
  },
  enterprise: {
    id: 'enterprise',
    name: 'Enterprise Air-Gapped',
    badge: 'UNLIMITED SEATS',
    priceUSD: 199,
    regularPriceUSD: 249,
    billingType: 'one-time',
    seats: 'Unlimited Engineers',
    description: 'For organizations with strict air-gapped or internal intranet requirements.',
    features: [
      'Unlimited developer seats across the entire company',
      'Self-hosted deployment on internal Docker/Kubernetes/S3 intranets',
      'Air-gapped zero-internet license activation protocol',
      'Custom SOC2 / HIPAA / GDPR compliance self-audit dossier',
      'Full source-code access for internal security auditing',
      'Direct Discord/Slack channel with core maintainers',
      'Perpetual enterprise deployment rights',
    ],
    polarProductId: 'polar_prod_enterprise_airgapped',
    lemonVariantId: 'lemonsqueezy_variant_enterprise',
  },
};

export interface CheckoutOptions {
  email?: string;
  discountCode?: string;
  returnUrl?: string;
  provider?: 'polar' | 'lemonsqueezy';
}

/**
 * Builds the external checkout URL for the selected tier.
 * Defaults to Polar.sh (the developer-first MoR), with Lemon Squeezy fallback.
 */
export function buildCheckoutUrl(
  tierId: PricingTierId,
  options: CheckoutOptions = {},
): string {
  const plan = PRICING_PLANS[tierId];
  const provider = options.provider || 'polar';

  // Configurable base URLs from environment variables
  const polarBase =
    (import.meta.env.VITE_POLAR_CHECKOUT_BASE as string | undefined) ||
    'https://buy.polar.sh';
  const lemonBase =
    (import.meta.env.VITE_LEMON_CHECKOUT_BASE as string | undefined) ||
    'https://formatpulse.lemonsqueezy.com/checkout/buy';

  const returnUrl =
    options.returnUrl ||
    (typeof window !== 'undefined' ? `${window.location.origin}/?license_activated=true` : 'https://formatpulse.dev/?license_activated=true');

  if (provider === 'lemonsqueezy') {
    const params = new URLSearchParams();
    if (options.email) params.set('checkout[email]', options.email);
    if (options.discountCode) params.set('checkout[discount_code]', options.discountCode);
    params.set('checkout[custom][tier]', tierId);
    params.set('checkout[custom][return_url]', returnUrl);

    const variantId = plan.lemonVariantId || tierId;
    return `${lemonBase}/${variantId}?${params.toString()}`;
  }

  // Polar.sh checkout
  const params = new URLSearchParams();
  if (options.email) params.set('customer_email', options.email);
  if (options.discountCode) params.set('discount', options.discountCode);
  params.set('tier', tierId);
  params.set('return_url', returnUrl);

  const productId = plan.polarProductId || tierId;
  return `${polarBase}/${productId}?${params.toString()}`;
}

/**
 * Generates an offline verifiable license key for automated fulfillment or manual testing.
 * Follows the pattern FP-PRO-2026-XXXX-XXXX.
 */
export function generateTestLicenseKey(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let p1 = '';
  let p2 = '';
  for (let i = 0; i < 4; i++) {
    p1 += chars[Math.floor(Math.random() * chars.length)];
    p2 += chars[Math.floor(Math.random() * chars.length)];
  }
  return `FP-PRO-2026-${p1}-${p2}`;
}
