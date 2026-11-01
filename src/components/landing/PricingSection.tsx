import React from 'react';
import { Zap, Check, Shield, ExternalLink, Key, Building2, Users } from 'lucide-react';
import { PRICING_PLANS, buildCheckoutUrl } from '@/services/checkoutService';
import { useAppStore } from '@/store/useAppStore';

export const PricingSection: React.FC = () => {
  const setShowLicenseModal = useAppStore((s) => s.setShowLicenseModal);
  const setShowLegalModal = useAppStore((s) => s.setShowLegalModal);

  return (
    <section id="pricing" className="w-full border-b border-zinc-800 bg-zinc-950 px-4 py-16 md:py-24">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-block text-2xs font-mono uppercase tracking-widest text-accent mb-2">
            // Transparent Pricing
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-zinc-100 font-sans uppercase">
            One-time purchase. Lifetime ownership.
          </h2>
          <p className="mt-3 text-sm text-zinc-400 font-mono max-w-xl mx-auto">
            No recurring monthly subscriptions. Buy once, validate offline, and use forever across your machines.
          </p>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {/* Individual Pro */}
          <div className="p-6 bg-surface-raised border-2 border-accent relative flex flex-col justify-between shadow-[0_0_30px_rgba(255,79,0,0.1)]">
            <div className="absolute -top-3 left-6 px-2 py-0.5 bg-accent text-white text-2xs font-mono font-bold uppercase tracking-wider">
              {PRICING_PLANS.individual.badge}
            </div>

            <div>
              <div className="flex items-center justify-between mb-2 mt-2">
                <h3 className="text-base font-bold font-mono text-zinc-100">
                  {PRICING_PLANS.individual.name}
                </h3>
                <Zap className="w-4 h-4 text-accent" />
              </div>
              <p className="text-xs text-zinc-400 font-mono mb-4">
                {PRICING_PLANS.individual.description}
              </p>

              <div className="mb-6 flex items-baseline gap-2">
                <span className="text-3xl font-bold font-mono text-zinc-50">
                  ${PRICING_PLANS.individual.priceUSD}
                </span>
                <span className="text-xs font-mono text-zinc-500 line-through">
                  ${PRICING_PLANS.individual.regularPriceUSD}
                </span>
                <span className="text-2xs font-mono text-emerald-400 uppercase">
                  USD · One-Time
                </span>
              </div>

              <div className="space-y-2 mb-8 pt-4 border-t border-zinc-800">
                {PRICING_PLANS.individual.features.map((feat, i) => (
                  <div key={i} className="flex items-start gap-2 text-xs font-mono text-zinc-300">
                    <Check className="w-3.5 h-3.5 text-accent flex-none mt-0.5" strokeWidth={2.5} />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <a
                href={buildCheckoutUrl('individual')}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full h-10 bg-accent hover:bg-accent-hover text-white font-mono text-xs font-bold flex items-center justify-center gap-2 transition-colors rounded-sm"
              >
                <span>Get Pro License ($14 USD)</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
              <div className="mt-2 text-center text-2xs font-mono text-zinc-500">
                Delivered instantly via Polar.sh Merchant of Record
              </div>
            </div>
          </div>

          {/* Team Pack */}
          <div className="p-6 bg-surface-base border border-zinc-800 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-base font-bold font-mono text-zinc-100">
                  {PRICING_PLANS.team.name}
                </h3>
                <Users className="w-4 h-4 text-zinc-400" />
              </div>
              <p className="text-xs text-zinc-400 font-mono mb-4">
                {PRICING_PLANS.team.description}
              </p>

              <div className="mb-6 flex items-baseline gap-2">
                <span className="text-3xl font-bold font-mono text-zinc-50">
                  ${PRICING_PLANS.team.priceUSD}
                </span>
                <span className="text-xs font-mono text-zinc-500 line-through">
                  ${PRICING_PLANS.team.regularPriceUSD}
                </span>
                <span className="text-2xs font-mono text-zinc-400 uppercase">
                  USD · 5 Seats
                </span>
              </div>

              <div className="space-y-2 mb-8 pt-4 border-t border-zinc-800">
                {PRICING_PLANS.team.features.map((feat, i) => (
                  <div key={i} className="flex items-start gap-2 text-xs font-mono text-zinc-300">
                    <Check className="w-3.5 h-3.5 text-emerald-400 flex-none mt-0.5" strokeWidth={2.5} />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <a
                href={buildCheckoutUrl('team')}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full h-10 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-zinc-100 font-mono text-xs font-bold flex items-center justify-center gap-2 transition-colors rounded-sm"
              >
                <span>Purchase Team Pack ($79 USD)</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
              <div className="mt-2 text-center text-2xs font-mono text-zinc-500">
                Includes Company VAT / Tax deductible invoice
              </div>
            </div>
          </div>

          {/* Enterprise Air-Gapped */}
          <div className="p-6 bg-surface-base border border-zinc-800 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-base font-bold font-mono text-zinc-100">
                  {PRICING_PLANS.enterprise.name}
                </h3>
                <Building2 className="w-4 h-4 text-emerald-400" />
              </div>
              <p className="text-xs text-zinc-400 font-mono mb-4">
                {PRICING_PLANS.enterprise.description}
              </p>

              <div className="mb-6 flex items-baseline gap-2">
                <span className="text-3xl font-bold font-mono text-zinc-50">
                  ${PRICING_PLANS.enterprise.priceUSD}
                </span>
                <span className="text-2xs font-mono text-emerald-400 uppercase">
                  USD · Unlimited Seats
                </span>
              </div>

              <div className="space-y-2 mb-8 pt-4 border-t border-zinc-800">
                {PRICING_PLANS.enterprise.features.map((feat, i) => (
                  <div key={i} className="flex items-start gap-2 text-xs font-mono text-zinc-300">
                    <Check className="w-3.5 h-3.5 text-emerald-400 flex-none mt-0.5" strokeWidth={2.5} />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <a
                href={buildCheckoutUrl('enterprise')}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full h-10 bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-emerald-400 font-mono text-xs font-bold flex items-center justify-center gap-2 transition-colors rounded-sm"
              >
                <span>Deploy Enterprise ($199 USD)</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
              <div className="mt-2 text-center text-2xs font-mono text-zinc-500">
                Internal Intranet / Air-Gapped License Package
              </div>
            </div>
          </div>
        </div>

        {/* Activation Trigger & Guarantee */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-zinc-900/60 border border-zinc-800 rounded-sm">
          <div className="flex items-center gap-3">
            <Shield className="w-4 h-4 text-emerald-400 flex-none" />
            <div className="text-left text-2xs font-mono text-zinc-400">
              <span className="text-zinc-200 font-bold">14-Day Full Money-Back Guarantee:</span> If FormatPulse doesn't fit your compliance or developer workflow, get an instant 100% refund without questions.
            </div>
          </div>

          <button
            onClick={() => setShowLicenseModal(true)}
            className="flex items-center gap-2 px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-2xs font-mono rounded-sm transition-colors flex-none"
          >
            <Key className="w-3 h-3 text-accent" />
            <span>Already bought? Activate Key</span>
          </button>
        </div>

        <div className="mt-6 text-center text-2xs font-mono text-zinc-600">
          <button
            onClick={() => setShowLegalModal(true)}
            className="underline hover:text-zinc-400 transition-colors"
          >
            Review Terms of Service & EULA
          </button>
          {' · '}
          <button
            onClick={() => setShowLegalModal(true)}
            className="underline hover:text-zinc-400 transition-colors"
          >
            Zero-Data Privacy Policy
          </button>
        </div>
      </div>
    </section>
  );
};
