import { describe, it, expect } from 'vitest';
import {
  PRICING_PLANS,
  buildCheckoutUrl,
  generateTestLicenseKey,
} from '../checkoutService';
import { isValidKeyFormat } from '../licenseService';

describe('Merchant of Record Checkout Service', () => {
  it('defines all 3 commercial pricing plans with accurate lifetime values', () => {
    expect(PRICING_PLANS.individual).toBeDefined();
    expect(PRICING_PLANS.individual.priceUSD).toBe(14);
    expect(PRICING_PLANS.individual.billingType).toBe('one-time');

    expect(PRICING_PLANS.team).toBeDefined();
    expect(PRICING_PLANS.team.priceUSD).toBe(79);

    expect(PRICING_PLANS.enterprise).toBeDefined();
    expect(PRICING_PLANS.enterprise.priceUSD).toBe(199);
  });

  it('builds a Polar.sh checkout URL with params', () => {
    const url = buildCheckoutUrl('individual', {
      email: 'dev@test.org',
      discountCode: 'EARLYBIRD',
      returnUrl: 'https://formatpulse.dev/success',
    });

    expect(url).toContain('https://buy.polar.sh/polar_prod_individual_lifetime');
    expect(url).toContain('customer_email=dev%40test.org');
    expect(url).toContain('discount=EARLYBIRD');
    expect(url).toContain('return_url=https%3A%2F%2Fformatpulse.dev%2Fsuccess');
  });

  it('builds a Lemon Squeezy checkout URL when provider is specified', () => {
    const url = buildCheckoutUrl('team', {
      email: 'team@agency.com',
      provider: 'lemonsqueezy',
    });

    expect(url).toContain('lemonsqueezy.com/checkout/buy/lemonsqueezy_variant_team');
    expect(url).toContain('checkout%5Bemail%5D=team%40agency.com');
  });

  it('generates offline test license keys that comply with FP-PRO-2026 format', () => {
    for (let i = 0; i < 5; i++) {
      const key = generateTestLicenseKey();
      expect(key).toMatch(/^FP-PRO-2026-[A-Z0-9]{4}-[A-Z0-9]{4}$/);
      expect(isValidKeyFormat(key)).toBe(true);
    }
  });
});
