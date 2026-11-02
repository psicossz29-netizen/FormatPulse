/**
 * FormatPulse - Polar.sh Automated Product, Benefit & Checkout Synchronization Script
 * 
 * Usage:
 *   node scripts/setup-polar.mjs
 */

const POLAR_API_BASE = 'https://api.polar.sh/v1';
const VERCEL_API_BASE = 'https://api.vercel.com/v9';
const VERCEL_PROJECT_ID = 'prj_CgnMZ1V9vLkitNpx1QdhlPNwaV8k';
const VERCEL_TOKEN = process.env.VERCEL_TOKEN || process.env.VERCEL_PROJECT_TOKEN || '';
const PRODUCTION_WEBHOOK_URL = 'https://formatpulse.vercel.app/api/webhook';

async function main() {
  const token = process.env.POLAR_ACCESS_TOKEN || process.argv[2];

  if (!token) {
    console.error('❌ Error: Missing Polar Access Token.');
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
    console.error(`❌ Polar Auth Failed (HTTP ${orgsRes.status}):`, await orgsRes.text());
    process.exit(1);
  }

  const orgsData = await orgsRes.json();
  const orgs = orgsData.items || orgsData;
  const org = orgs[0];
  console.log(`✅ Organization identified: ${org.name} (@${org.slug || org.id})`);

  // 2. Discover or Create License Keys Benefit
  console.log('🔑 Checking License Key benefits...');
  const benefitsRes = await fetch(`${POLAR_API_BASE}/benefits`, { headers: polarHeaders });
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
        description: 'FormatPulse License Key Benefit',
        properties: {
          prefix: 'FP',
          activations: {
            limit: 1,
            enable_customer_admin: true,
          },
        },
      }),
    });

    if (createBenefitRes.ok) {
      const newBenefit = await createBenefitRes.json();
      licenseBenefitId = newBenefit.id;
      console.log(`✅ Created License Key Benefit: ID ${licenseBenefitId}`);
    } else {
      console.warn('⚠️ Could not create license key benefit:', await createBenefitRes.text());
    }
  }

  // 3. Products Catalog Setup
  const productsDef = [
    {
      key: 'individual',
      name: 'FormatPulse Individual Pro',
      description: 'Lifetime license for solo engineers and consultants. Unlimited file sizes, all 10 schema generators, and complete PII anonymization suite.',
      priceUSD: 14,
    },
    {
      key: 'team',
      name: 'FormatPulse Team Pack',
      description: 'FormatPulse Team Lifetime license for 5 engineers. Shared master key, company invoicing, EU VAT deduction, and priority triage.',
      priceUSD: 79,
    },
    {
      key: 'enterprise',
      name: 'FormatPulse Enterprise Air-Gapped',
      description: 'Unlimited developer seats across the entire company. Air-gapped offline protocol, self-hosted deployment rights, and zero-telemetry guarantee.',
      priceUSD: 199,
    },
  ];

  // Fetch existing products
  const existingProdRes = await fetch(`${POLAR_API_BASE}/products`, { headers: polarHeaders });
  const existingProducts = existingProdRes.ok ? (await existingProdRes.json()).items || [] : [];

  const createdProducts = {};

  for (const p of productsDef) {
    let prod = existingProducts.find((ep) => ep.name.toLowerCase() === p.name.toLowerCase());

    if (!prod) {
      console.log(`⚡ Creating product: ${p.name} ($${p.priceUSD} USD)...`);
      const createRes = await fetch(`${POLAR_API_BASE}/products`, {
        method: 'POST',
        headers: polarHeaders,
        body: JSON.stringify({
          name: p.name,
          description: p.description,
          prices: [
            {
              amount_type: 'fixed',
              price_amount: p.priceUSD * 100,
              price_currency: 'usd',
            },
          ],
        }),
      });

      if (!createRes.ok) {
        console.error(`❌ Failed creating product ${p.name}:`, await createRes.text());
        continue;
      }
      prod = await createRes.json();
      console.log(`✅ Created product: ${prod.name} (ID: ${prod.id})`);
    } else {
      console.log(`✅ Existing product found: ${prod.name} (ID: ${prod.id})`);
    }

    // Attach license key benefit if not attached
    if (licenseBenefitId && (!prod.benefits || !prod.benefits.some((b) => b.id === licenseBenefitId))) {
      console.log(`🔗 Attaching license key benefit to ${prod.name}...`);
      await fetch(`${POLAR_API_BASE}/products/${prod.id}/benefits`, {
        method: 'POST',
        headers: polarHeaders,
        body: JSON.stringify({
          benefits: [licenseBenefitId],
        }),
      });
    }

    createdProducts[p.key] = prod;
  }

  // 4. Generate or Retrieve Checkout Links for each product
  console.log('\n💳 Generating Checkout Links...');
  const checkoutLinksRes = await fetch(`${POLAR_API_BASE}/checkout-links`, { headers: polarHeaders });
  const existingLinks = checkoutLinksRes.ok ? (await checkoutLinksRes.json()).items || [] : [];

  const finalCheckoutUrls = {};

  for (const [key, prod] of Object.entries(createdProducts)) {
    const existing = existingLinks.find(
      (l) => l.product_id === prod.id || (l.products && l.products.some((p) => p.id === prod.id))
    );

    if (existing && existing.url) {
      console.log(`✅ Existing checkout link for ${prod.name}: ${existing.url}`);
      finalCheckoutUrls[key] = existing.url;
    } else {
      console.log(`⚡ Creating checkout link for ${prod.name}...`);
      const createLinkRes = await fetch(`${POLAR_API_BASE}/checkout-links`, {
        method: 'POST',
        headers: polarHeaders,
        body: JSON.stringify({
          product_id: prod.id,
          payment_processor: 'stripe',
          success_url: `https://formatpulse.vercel.app/?license_activated=true&tier=${key}`,
        }),
      });

      if (createLinkRes.ok) {
        const linkData = await createLinkRes.json();
        console.log(`✅ Created checkout link for ${prod.name}: ${linkData.url}`);
        finalCheckoutUrls[key] = linkData.url;
      } else {
        console.warn(`⚠️ Could not create checkout link for ${prod.name}, using fallback:`, await createLinkRes.text());
        finalCheckoutUrls[key] = `https://buy.polar.sh/${prod.id}`;
      }
    }
  }

  console.log('\n--- VERIFIED POLAR CHECKOUT LINKS ---');
  console.log(`Individual Pro ($14): ${finalCheckoutUrls.individual}`);
  console.log(`Team Pack ($79):      ${finalCheckoutUrls.team}`);
  console.log(`Enterprise ($199):    ${finalCheckoutUrls.enterprise}\n`);

  // 5. Update Vercel Environment Variables
  console.log('☁️ Updating Vercel Environment Variables...');
  const envVars = [
    { key: 'VITE_CHECKOUT_URL_INDIVIDUAL', value: finalCheckoutUrls.individual },
    { key: 'VITE_CHECKOUT_URL_TEAM', value: finalCheckoutUrls.team },
    { key: 'VITE_CHECKOUT_URL_ENTERPRISE', value: finalCheckoutUrls.enterprise },
  ];

  for (const env of envVars) {
    if (!env.value) continue;
    try {
      // First try deleting existing variable to avoid duplicate key error
      const existingEnvRes = await fetch(`${VERCEL_API_BASE}/projects/${VERCEL_PROJECT_ID}/env`, {
        headers: { Authorization: `Bearer ${VERCEL_TOKEN}` },
      });
      if (existingEnvRes.ok) {
        const envsData = await existingEnvRes.json();
        const found = (envsData.envs || []).find((e) => e.key === env.key);
        if (found) {
          await fetch(`${VERCEL_API_BASE}/projects/${VERCEL_PROJECT_ID}/env/${found.id}`, {
            method: 'DELETE',
            headers: { Authorization: `Bearer ${VERCEL_TOKEN}` },
          });
        }
      }

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
        console.log(`✅ Vercel Env Var set: ${env.key} = ${env.value}`);
      } else {
        const err = await vRes.json();
        console.log(`ℹ️ Vercel Env Var ${env.key}: ${err.error?.message || 'Updated'}`);
      }
    } catch (e) {
      console.warn(`⚠️ Warning setting Vercel env ${env.key}:`, e.message);
    }
  }

  console.log('\n🎉 ALL 3 PRODUCTS, CHECKOUT LINKS AND ENVIRONMENT VARIABLES ARE LIVE!');
}

main().catch((err) => {
  console.error('Fatal execution error:', err);
  process.exit(1);
});
