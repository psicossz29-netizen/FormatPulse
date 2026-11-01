import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';

const FAQS = [
  {
    q: 'How do you technically guarantee that no data touches a remote server?',
    a: 'FormatPulse compiles to a purely static web application with zero backend servers. All parsing (JSON, CSV conforming to RFC 4180, YAML), type inference, AST safety checks, and PII anonymization execute directly inside your browser runtime. You can verify this live: press F12, switch to the Network tab, filter by Fetch/XHR, and convert any dataset — 0 requests are transmitted.',
  },
  {
    q: 'How does the Web Worker process large files without freezing the UI?',
    a: 'Files over 512KB automatically spawn a dedicated background Web Worker thread (conversion.worker.ts). This executes AST traversals and string transformations in a separate OS thread without blocking the browser main thread or UI rendering, benchmarked at over 10MB under 500ms.',
  },
  {
    q: 'Does the license key validation work in air-gapped networks without internet?',
    a: 'Yes. While online users can validate directly via our Merchant of Record API, FormatPulse features an offline-first deterministic cryptographic license check (FP-PRO-2026-XXXX-XXXX). If no internet connection is detected, the app validates locally without blocking or degrading functionality.',
  },
  {
    q: 'How does the Cloud Secrets & Regional PII sanitizer work?',
    a: 'Our sanitizer combines regex boundary checks for cloud provider tokens (AWS AKIA keys, GitHub fine-grained PATs, GCP API keys, Slack webhooks, PEM private keys) with format-validated regional identifiers (IBAN, Spanish DNI/NIE, US SSN). You can choose between full redaction ([REDACTED]) or deterministic synthetic values (FNV-1a hash replacement) to preserve referential integrity.',
  },
  {
    q: 'What Merchant of Record handles payments and tax deduction invoices?',
    a: 'We use Polar.sh and Lemon Squeezy as our Merchants of Record. They calculate, collect, and remit all global sales tax, VAT, and GST automatically, delivering an immediate tax-compliant invoice for business expense deduction.',
  },
  {
    q: 'Can our organization deploy FormatPulse on an internal intranet or private cloud?',
    a: 'Yes. With the Enterprise Air-Gapped license, you receive deployment artifacts that can be hosted on internal S3 buckets, Nginx, or Docker environments with zero outbound network access required.',
  },
];

export const DeveloperFAQ: React.FC = () => {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const toggle = (idx: number) => {
    setOpenIdx(openIdx === idx ? null : idx);
  };

  return (
    <section id="faq" className="w-full border-b border-zinc-800 bg-surface-base px-4 py-16 md:py-24">
      <div className="max-w-4xl mx-auto">
        <div className="text-left mb-12">
          <div className="text-2xs font-mono uppercase tracking-widest text-accent mb-2">
            // Engineering FAQ
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-zinc-100 font-sans uppercase">
            Frequently Asked Technical Questions
          </h2>
          <p className="mt-2 text-sm text-zinc-400 font-mono">
            Direct answers to compliance, licensing, and implementation questions.
          </p>
        </div>

        <div className="divide-y divide-zinc-800 border border-zinc-800 bg-surface-raised">
          {FAQS.map((item, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div key={idx} className="transition-colors">
                <button
                  onClick={() => toggle(idx)}
                  className="w-full py-4 px-6 text-left flex items-center justify-between gap-4 focus:outline-none focus-visible:bg-zinc-900"
                >
                  <span className="text-xs sm:text-sm font-bold font-mono text-zinc-100 flex items-center gap-2">
                    <HelpCircle className="w-3.5 h-3.5 text-accent flex-none" />
                    <span>{item.q}</span>
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-zinc-500 transition-transform duration-200 flex-none ${
                      isOpen ? 'rotate-180 text-accent' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-6 pb-5 pt-1 text-xs text-zinc-400 font-mono leading-relaxed border-t border-zinc-800/40 bg-zinc-950/40">
                    {item.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
