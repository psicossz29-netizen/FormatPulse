import React from 'react';
import { Check, X, ShieldCheck } from 'lucide-react';

const COMPARISON_ROWS = [
  {
    feature: 'Network I/O & Telemetry',
    formatpulse: '0 Bytes (100% In-Browser)',
    transformtools: 'Client-only (basic)',
    cloudformatters: 'Transmitted to Remote Server',
    genericai: 'Logged & Retained for AI Training',
    highlight: true,
  },
  {
    feature: 'Enterprise Compliance (SOC2/GDPR)',
    formatpulse: 'Inherently Compliant (Art. 25)',
    transformtools: 'Unverified liability',
    cloudformatters: 'Severe Compliance Violation',
    genericai: 'Data Leakage Risk',
    highlight: true,
  },
  {
    feature: 'Offline & Air-Gapped Operation',
    formatpulse: '100% Offline PWA & Local Worker',
    transformtools: 'Partial / Cache dependent',
    cloudformatters: 'Fails without Internet',
    genericai: 'Requires Active Cloud Connection',
    highlight: false,
  },
  {
    feature: 'Cloud Secrets & Regional PII Engine',
    formatpulse: 'AWS, GitHub, GCP, DNI, SSN, IBAN',
    transformtools: 'None',
    cloudformatters: 'None / Exposed to Logs',
    genericai: 'None / Exposed to LLM',
    highlight: true,
  },
  {
    feature: 'Large Dataset Capacity (>10MB)',
    formatpulse: 'Web Worker Non-Blocking Thread',
    transformtools: 'UI Freezes / Crashes Tab',
    cloudformatters: 'Hard Gateway Timeouts (504)',
    genericai: 'Token Window Truncation',
    highlight: false,
  },
  {
    feature: 'Multi-Target Schema Inference',
    formatpulse: '10 Targets (TS, Zod, OpenAPI, Prisma, etc.)',
    transformtools: '3-4 Languages only',
    cloudformatters: 'Simple JSON ⇄ CSV only',
    genericai: 'Hallucinated non-deterministic types',
    highlight: false,
  },
  {
    feature: 'Pricing & Monetization',
    formatpulse: '$14 USD Lifetime (0% Subscription)',
    transformtools: 'Free (unsupported)',
    cloudformatters: 'Ad-heavy trackers',
    genericai: '$20 / Month Recurring Subscription',
    highlight: true,
  },
];

export const ComparisonMatrix: React.FC = () => {
  return (
    <section id="comparison" className="w-full border-b border-zinc-800 bg-zinc-950 px-4 py-16 md:py-24">
      <div className="max-w-6xl mx-auto">
        <div className="text-left mb-12">
          <div className="text-2xs font-mono uppercase tracking-widest text-emerald-400 mb-2">
            // Competitive Audit
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-zinc-100 font-sans uppercase">
            FormatPulse vs Cloud & Web Converters
          </h2>
          <p className="mt-2 text-sm text-zinc-400 font-mono max-w-2xl">
            Why security-conscious companies and senior software engineers refuse to use generic online utilities.
          </p>
        </div>

        <div className="border border-zinc-800 bg-surface-base overflow-x-auto">
          <table className="w-full text-left border-collapse font-mono text-xs min-w-[700px]">
            <thead>
              <tr className="border-b border-zinc-800 bg-zinc-900/80 text-2xs text-zinc-400 uppercase tracking-wider">
                <th className="py-3 px-4 font-semibold">Capability</th>
                <th className="py-3 px-4 font-semibold text-accent bg-accent/5 border-x border-accent/20">
                  <div className="flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-accent" />
                    <span>FormatPulse</span>
                  </div>
                </th>
                <th className="py-3 px-4 font-semibold text-zinc-400">transform.tools</th>
                <th className="py-3 px-4 font-semibold text-zinc-400">Online Converters</th>
                <th className="py-3 px-4 font-semibold text-zinc-400">Generic AI Apps</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/80">
              {COMPARISON_ROWS.map((row, idx) => (
                <tr
                  key={idx}
                  className={`hover:bg-zinc-900/40 transition-colors ${
                    row.highlight ? 'bg-zinc-900/20' : ''
                  }`}
                >
                  <td className="py-3 px-4 text-zinc-200 font-medium">{row.feature}</td>
                  <td className="py-3 px-4 text-emerald-400 font-semibold bg-accent/5 border-x border-accent/20 flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-emerald-400 flex-none" strokeWidth={2.5} />
                    <span>{row.formatpulse}</span>
                  </td>
                  <td className="py-3 px-4 text-zinc-400">{row.transformtools}</td>
                  <td className="py-3 px-4 text-red-400/80 flex items-center gap-1">
                    <X className="w-3 h-3 text-red-500/80 flex-none" />
                    <span>{row.cloudformatters}</span>
                  </td>
                  <td className="py-3 px-4 text-zinc-500">{row.genericai}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};
