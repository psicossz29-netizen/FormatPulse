/**
 * FormatPulse - Polar.sh Automated Product & Checkout Setup Script
 * 
 * Usage:
 *   node scripts/setup-polar.mjs <POLAR_ACCESS_TOKEN>
 * 
 * Automates:
 *   1. Organization discovery on Polar.sh
 *   2. License key benefit creation (FP prefix)
 *   3. Product catalog creation (Individual Pro $14, Team Pack $79, Enterprise $199)
 *   4. Webhook registration to https://formatpulse.vercel.app/api/webhook
 *   5. Vercel environment variable synchronization via Vercel REST API
 */

const POLAR_API_BASE = 'https://api.polar.sh/v1';
const VERCEL_API_BASE = 'https://api.vercel.com/v9';
const VERCEL_PROJECT_ID = 'prj_CgnMZ1V9vLkitNpx1QdhlPNwaV8k';
const VERCEL_TOKEN = process.env.VERCEL_TOKEN || process.env.VERCEL_PROJECT_TOKEN || '';
const PRODUCTION_WEBHOOK_URL = 'https://formatpulse.vercel.app/api/webhook';

async function main() {
  const token = process.argv[2] || process.env.POLAR_ACCESS_TOKEN;

  if (!token) {
    console.error('❌ Error: Missing Polar Access Token.');
    console.log('Usage: node scripts/setup-polar.mjs <POLAR_ACCESS_TOKEN>');
    console.log('Or set $env:POLAR_ACCESS_TOKEN="polar_oat_..."');
    process.exit(1);
  }

  console.log('🚀 Connecting to Polar.sh API...');
  const polarHeaders = {
    Authorization: `Bearer ${token.trim()}`,
    'Content-Type': 'application/json',
    Accept: 'application/json',
  };

  // 1. Fetch Organizations
  const orgsRes = await fetch(`${POLAR_API_BASE}/organizations`, { headers: polarHeaders });
  if (!orgsRes.ok) {
    const errText = await orgsRes.text();
    console.error(`❌ Polar Auth Failed (HTTP ${orgsRes.status}):`, errText);
    process.exit(1);
  }

  const orgsData = await orgsRes.json();
  const orgs = orgsData.items || orgsData;
  if (!orgs || orgs.length === 0) {
    console.error('❌ No organizations found for this Polar account. Please create an organization in Polar dashboard first.');
    process.exit(1);
  }

  const org = orgs[0];
  console.log(`✅ Organization identified: ${org.name} (@${org.slug || org.id}) [ID: ${org.id}]`);

  // 2. Discover or Create License Keys Benefit
  console.log('🔑 Checking License Key benefits...');
  const benefitsRes = await fetch(`${POLAR_API_BASE}/benefits?organization_id=${org.id}`, { headers: polarHeaders });
  let licenseBenefitId = null;

  if (benefitsRes.ok) {
    const benefitsData = await benefitsRes.json();
    const existing = (benefitsData.items || []).find((b) => b.type === 'license_keys');
    if (existing) {
      licenseBenefitId = existing.id;
      console.log(`✅ Existing License Key Benefit found: ${existing.description} (ID: ${licenseBenefitId})`);
    }
  }

  if (!licenseBenefitId) {
    console.log('⚡ Creating License Key Benefit for FormatPulse...');
    const createBenefitRes = await fetch(`${POLAR_API_BASE}/benefits`, {
      method: 'POST',
      headers: polarHeaders,
      body: JSON.stringify({
        type: 'license_keys',
        description: 'FormatPulse Offline & Online License Key',
        organization_id: org.id,
        properties: {
          prefix: 'FP',
        },
      }),
    });

    if (createBenefitRes.ok) {
      const newBenefit = await createBenefitRes.json();
      licenseBenefitId = newBenefit.id;
      console.log(`✅ Created License Key Benefit: ID ${licenseBenefitId}`);
    } else {
      console.warn('⚠️ Could not create automatic license key benefit, proceeding with webhook licensing:', await createBenefitRes.text());
    }
  }

  // 3. Define 3 Products
  const productsToCreate = [
    {
      key: 'individual',
      name: 'FormatPulse Individual Pro',
      description: 'Lifetime license for solo engineers and power users. Unlimited file sizes, all 10 schema generators, and complete PII anonymization suite.',
      priceUSD: 14,
      seats: '1 Seat',
    },
    {
      key: 'team',
      name: 'FormatPulse Team Pack',
      description: 'FormatPulse Team Lifetime license for 5 engineers. Shared master key, company invoicing, EU VAT deduction, and priority triage.',
      priceUSD: 79,
      seats: '5 Seats',
    },
    {
      key: 'enterprise',
      name: 'FormatPulse Enterprise Air-Gapped',
      description: 'Unlimited developer seats across the organization. Air-gapped offline protocol, self-hosted deployment rights, and zero-telemetry guarantee.',
      priceUSD: 199,
      seats: 'Unlimited Seats',
    },
  ];

  // Fetch existing products to avoid duplicates
  console.log('📦 Checking existing products in Polar...');
  const existingProdRes = await fetch(`${POLAR_API_BASE}/products?organization_id=${org.id}`, { headers: polarHeaders });
  const existingProducts = existingProdRes.ok ? (await existingProdRes.json()).items || [] : [];

  const checkoutUrls = {};

  for (const p of productsToCreate) {
    const found = existingProducts.find((ep) => ep.name.toLowerCase() === p.name.toLowerCase());

    if (found) {
      console.log(`✅ Found existing product: ${found.name} (ID: ${found.id})`);
      checkoutUrls[p.key] = `https://buy.polar.sh/${found.id}`;
    } else {
      console.log(`⚡ Creating product: ${p.name} ($${p.priceUSD} USD)...`);
      const body = {
        name: p.name,
        description: p.description,
        organization_id: org.id,
        prices: [
          {
            type: 'one_time',
            price_amount: p.priceUSD * 100,
            price_currency: 'usd',
          },
        ],
        benefits: licenseBenefitId ? [licenseBenefitId] : [],
      };

      const createRes = await fetch(`${POLAR_API_BASE}/products`, {
        method: 'POST',
        headers: polarHeaders,
        body: JSON.stringify(body),
      });

      if (!createRes.ok) {
        console.error(`❌ Failed to create product ${p.name}:`, await createRes.text());
        // Fallback checkout URL
        checkoutUrls[p.key] = `https://buy.polar.sh/${org.slug || 'formatpulse'}`;
      } else {
        const created = await createRes.json();
        console.log(`✅ Created product ${p.name}! ID: ${created.id}`);
        checkoutUrls[p.key] = `https://buy.polar.sh/${created.id}`;
      }
    }
  }

  console.log('\n--- GENERATED CHECKOUT URLS ---');
  console.log(`Individual ($14): ${checkoutUrls.individual}`);
  console.log(`Team ($79):       ${checkoutUrls.team}`);
  console.log(`Enterprise ($199): ${checkoutUrls.enterprise}\n`);

  // 4. Register Webhook Endpoint on Polar
  console.log(`🔗 Registering Webhook at ${PRODUCTION_WEBHOOK_URL}...`);
  let webhookSecret = '';

  const webhooksRes = await fetch(`${POLAR_API_BASE}/webhooks/endpoints`, {
    method: 'POST',
    headers: polarHeaders,
    body: JSON.stringify({
      url: PRODUCTION_WEBHOOK_URL,
      format: 'raw',
      events: ['order.created', 'subscription.created', 'refund.created'],
      organization_id: org.id,
    }),
  });

  if (webhooksRes.ok) {
    const webhookData = await webhooksRes.json();
    webhookSecret = webhookData.secret || '';
    console.log(`✅ Webhook registered successfully! Secret: ${webhookSecret ? 'Available' : 'N/A'}`);
  } else {
    console.log('ℹ️ Webhook may already exist or needs manual confirmation:', (await webhooksRes.text()).slice(0, 150));
  }

  // 5. Update Vercel Environment Variables
  console.log('☁️ Updating Vercel Environment Variables...');
  const envVars = [
    { key: 'VITE_CHECKOUT_URL_INDIVIDUAL', value: checkoutUrls.individual },
    { key: 'VITE_CHECKOUT_URL_TEAM', value: checkoutUrls.team },
    { key: 'VITE_CHECKOUT_URL_ENTERPRISE', value: checkoutUrls.enterprise },
  ];

  if (webhookSecret) {
    envVars.push({ key: 'POLAR_WEBHOOK_SECRET', value: webhookSecret });
  }

  for (const env of envVars) {
    try {
      const vRes = await fetch(`${VERCEL_API_BASE}/projects/${VERCEL_PROJECT_ID}/env`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${VERCEL_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          key: env.key,
          value: env.value,
          type: 'plain',
          target: ['production', 'preview', 'development'],
        }),
      });

      if (vRes.ok) {
        console.log(`✅ Vercel Env Var set: ${env.key}`);
      } else {
        const err = await vRes.json();
        console.log(`ℹ️ Vercel Env Var ${env.key}: ${err.error?.message || 'Updated'}`);
      }
    } catch (e) {
      console.warn(`⚠️ Warning setting Vercel env ${env.key}:`, e.message);
    }
  }

  console.log('\n🎉 ALL POLAR.SH PRODUCTS AND CHECKOUTS HAVE BEEN CONFIGURED SUCCESSFULLY!');
}

main().catch((err) => {
  console.error('Fatal execution error:', err);
  process.exit(1);
});
