import React from 'react';
import { Zap, Check, Shield, ExternalLink, Key, Building2, Users } from 'lucide-react';
import { PRICING_PLANS, buildCheckoutUrl } from '@/services/checkoutService';
import { openExternalUrl } from '@/core/desktopBridge';
import { useAppStore } from '@/store/useAppStore';

export const PricingSection: React.FC = () => {
  const setShowLicenseModal = useAppStore((s) => s.setShowLicenseModal);
  const setShowLegalModal = useAppStore((s) => s.setShowLegalModal);

  return (
    <section id="pricing" className="relative w-full border-b border-zinc-800/80 bg-[#06070b] px-4 py-20 md:py-28 overflow-hidden">
      {/* Background radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-accent/10 blur-[140px] rounded-full pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-white/10 text-2xs font-mono text-zinc-300 mb-4 backdrop-blur-md">
            <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
            <span className="uppercase tracking-widest text-accent font-semibold">// Transparent Pricing</span>
            <span className="text-zinc-600">//</span>
            <span>Zero Subscription Traps</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-white font-sans uppercase">
            One-time purchase. Lifetime ownership.
          </h2>
          <p className="mt-4 text-sm sm:text-base text-zinc-400 font-mono max-w-xl mx-auto leading-relaxed">
            No recurring monthly subscriptions. Buy once, validate offline, and use forever across your machines.
          </p>
        </div>

        {/* Spaceship Fleet Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-14 items-stretch">
          {/* Individual Pro */}
          <div className="p-8 rounded-3xl bg-zinc-900/50 border-2 border-accent relative flex flex-col justify-between shadow-[0_0_50px_rgba(255,79,0,0.18)] backdrop-blur-xl group hover:scale-[1.01] transition-all duration-300">
            {/* Top Badge */}
            <div className="absolute -top-3.5 left-8 px-3.5 py-1 bg-accent text-white text-3xs font-mono font-bold uppercase tracking-wider rounded-full shadow-md">
              {PRICING_PLANS.individual.badge}
            </div>

            <div>
              <div className="flex items-center justify-between mb-3 mt-1">
                <h3 className="text-lg font-bold font-sans text-white">
                  {PRICING_PLANS.individual.name}
                </h3>
                <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center">
                  <Zap className="w-4 h-4 text-accent" />
                </div>
              </div>
              <p className="text-xs text-zinc-400 font-mono mb-6 leading-relaxed">
                {PRICING_PLANS.individual.description}
              </p>

              <div className="mb-6 flex items-baseline gap-2.5 pb-6 border-b border-white/[0.08]">
                <span className="text-4xl font-extrabold font-mono text-white">
                  ${PRICING_PLANS.individual.priceUSD}
                </span>
                <span className="text-sm font-mono text-zinc-500 line-through">
                  ${PRICING_PLANS.individual.regularPriceUSD}
                </span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-950/60 border border-emerald-800/80 text-emerald-400 text-3xs font-mono font-semibold uppercase">
                  USD · One-Time
                </span>
              </div>

              <div className="space-y-3 mb-8">
                {PRICING_PLANS.individual.features.map((feat, i) => (
                  <div key={i} className="flex items-start gap-2.5 text-xs font-mono text-zinc-300">
                    <div className="w-4 h-4 rounded-full bg-accent/20 flex items-center justify-center flex-none mt-0.5">
                      <Check className="w-2.5 h-2.5 text-accent" strokeWidth={3} />
                    </div>
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
                onClick={(e) => {
                  e.preventDefault();
                  void openExternalUrl(buildCheckoutUrl('individual'));
                }}
                className="w-full h-12 bg-accent hover:bg-accent-hover text-white font-mono text-xs font-bold flex items-center justify-center gap-2 transition-all rounded-full shadow-[0_0_25px_rgba(255,79,0,0.35)] hover:scale-[1.01]"
              >
                <span>Get Pro License ($14 USD)</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
              <div className="mt-3 text-center text-3xs font-mono text-zinc-500">
                Delivered instantly via Polar.sh Merchant of Record
              </div>
            </div>
          </div>

          {/* Team Pack */}
          <div className="p-8 rounded-3xl bg-zinc-900/30 border border-white/10 relative flex flex-col justify-between backdrop-blur-xl group hover:border-white/20 transition-all duration-300">
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-bold font-sans text-white">
                  {PRICING_PLANS.team.name}
                </h3>
                <div className="w-8 h-8 rounded-full bg-white/[0.05] flex items-center justify-center">
                  <Users className="w-4 h-4 text-zinc-300" />
                </div>
              </div>
              <p className="text-xs text-zinc-400 font-mono mb-6 leading-relaxed">
                {PRICING_PLANS.team.description}
              </p>

              <div className="mb-6 flex items-baseline gap-2.5 pb-6 border-b border-white/[0.08]">
                <span className="text-4xl font-extrabold font-mono text-white">
                  ${PRICING_PLANS.team.priceUSD}
                </span>
                <span className="text-sm font-mono text-zinc-500 line-through">
                  ${PRICING_PLANS.team.regularPriceUSD}
                </span>
                <span className="px-2 py-0.5 rounded-full bg-white/[0.05] border border-white/10 text-zinc-300 text-3xs font-mono font-semibold uppercase">
                  USD · 5 Seats
                </span>
              </div>

              <div className="space-y-3 mb-8">
                {PRICING_PLANS.team.features.map((feat, i) => (
                  <div key={i} className="flex items-start gap-2.5 text-xs font-mono text-zinc-300">
                    <div className="w-4 h-4 rounded-full bg-emerald-500/20 flex items-center justify-center flex-none mt-0.5">
                      <Check className="w-2.5 h-2.5 text-emerald-400" strokeWidth={3} />
                    </div>
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
                onClick={(e) => {
                  e.preventDefault();
                  void openExternalUrl(buildCheckoutUrl('team'));
                }}
                className="w-full h-12 bg-zinc-800 hover:bg-zinc-700 text-white font-mono text-xs font-bold flex items-center justify-center gap-2 transition-all rounded-full border border-white/10 hover:border-white/20 hover:scale-[1.01]"
              >
                <span>Purchase Team Pack ($79 USD)</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
              <div className="mt-3 text-center text-3xs font-mono text-zinc-500">
                Includes Company VAT / Tax deductible invoice
              </div>
            </div>
          </div>

          {/* Enterprise Air-Gapped */}
          <div className="p-8 rounded-3xl bg-zinc-900/30 border border-white/10 relative flex flex-col justify-between backdrop-blur-xl group hover:border-white/20 transition-all duration-300">
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-bold font-sans text-white">
                  {PRICING_PLANS.enterprise.name}
                </h3>
                <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center">
                  <Building2 className="w-4 h-4 text-emerald-400" />
                </div>
              </div>
              <p className="text-xs text-zinc-400 font-mono mb-6 leading-relaxed">
                {PRICING_PLANS.enterprise.description}
              </p>

              <div className="mb-6 flex items-baseline gap-2.5 pb-6 border-b border-white/[0.08]">
                <span className="text-4xl font-extrabold font-mono text-white">
                  ${PRICING_PLANS.enterprise.priceUSD}
                </span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-950/60 border border-emerald-800/80 text-emerald-400 text-3xs font-mono font-semibold uppercase">
                  USD · Unlimited Seats
                </span>
              </div>

              <div className="space-y-3 mb-8">
                {PRICING_PLANS.enterprise.features.map((feat, i) => (
                  <div key={i} className="flex items-start gap-2.5 text-xs font-mono text-zinc-300">
                    <div className="w-4 h-4 rounded-full bg-emerald-500/20 flex items-center justify-center flex-none mt-0.5">
                      <Check className="w-2.5 h-2.5 text-emerald-400" strokeWidth={3} />
                    </div>
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
                onClick={(e) => {
                  e.preventDefault();
                  void openExternalUrl(buildCheckoutUrl('enterprise'));
                }}
                className="w-full h-12 bg-white hover:bg-zinc-100 text-zinc-950 font-mono text-xs font-bold flex items-center justify-center gap-2 transition-all rounded-full shadow-lg hover:scale-[1.01]"
              >
                <span>Deploy Enterprise ($199 USD)</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
              <div className="mt-3 text-center text-3xs font-mono text-zinc-500">
                Internal Intranet / Air-Gapped License Package
              </div>
            </div>
          </div>
        </div>

        {/* Spaceship Guarantee Capsule */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-6 rounded-2xl bg-zinc-900/40 border border-white/10 backdrop-blur-xl">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center flex-none">
              <Shield className="w-5 h-5 text-emerald-400" />
            </div>
            <div className="text-left text-xs font-mono text-zinc-400">
              <span className="text-white font-bold">14-Day Full Money-Back Guarantee:</span> If FormatPulse doesn&apos;t fit your compliance or developer workflow, get an instant 100% refund without questions.
            </div>
          </div>

          <button
            onClick={() => setShowLicenseModal(true)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 text-white text-xs font-mono transition-all flex-none hover:scale-[1.02]"
          >
            <Key className="w-3.5 h-3.5 text-accent" />
            <span>Already bought? Activate Key</span>
          </button>
        </div>

        <div className="mt-8 text-center text-2xs font-mono text-zinc-500">
          <button
            onClick={() => setShowLegalModal(true)}
            className="underline hover:text-zinc-300 transition-colors"
          >
            Review Terms of Service &amp; EULA
          </button>
          {' · '}
          <button
            onClick={() => setShowLegalModal(true)}
            className="underline hover:text-zinc-300 transition-colors"
          >
            Zero-Data Privacy Policy
          </button>
        </div>
      </div>
    </section>
  );
};
