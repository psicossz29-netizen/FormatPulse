import React from 'react';
import { Code2, ShieldAlert, FileSpreadsheet, KeyRound, GitCompare, FileCheck, ArrowUpRight } from 'lucide-react';

const FEATURES = [
  {
    icon: <Code2 className="w-5 h-5 text-accent" />,
    title: 'Multi-Target Contract Inference',
    badge: '10 TARGETS',
    description:
      'Infers strict types, optionality, datetime formats, emails, and nested structures into TypeScript, Zod Schema, OpenAPI 3.1, Prisma ORM, Python Pydantic v2, Rust Serde, and Go Structs.',
    metric: 'Zero-Any Strict Inference',
    colSpan: 'md:col-span-8',
    highlight: true,
  },
  {
    icon: <ShieldAlert className="w-5 h-5 text-emerald-400" />,
    title: 'Zero-Trust AST & Prototype Defense',
    badge: 'ANTI-EXPLOIT',
    description:
      'Neutralizes __proto__, constructor, and prototype injection attempts. Enforces 50-level recursion limits, 500KB string caps, and circular reference handling to block DoS exploits.',
    metric: 'Safe Parser Sandbox',
    colSpan: 'md:col-span-4',
  },
  {
    icon: <FileSpreadsheet className="w-5 h-5 text-accent" />,
    title: 'OWASP CSV Formula Injection Shield',
    badge: 'OWASP TOP 10',
    description:
      'Detects execution trigger prefixes (=, +, -, @, \\t, \\r) in spreadsheet exports while intelligently preserving legitimate negative and positive numbers, neutralizing remote command execution.',
    metric: 'Excel / Calc Safe',
    colSpan: 'md:col-span-4',
  },
  {
    icon: <KeyRound className="w-5 h-5 text-emerald-400" />,
    title: 'Cloud Secrets & Regional PII Engine',
    badge: 'SOC2 / GDPR',
    description:
      'Detects and redacts AWS Keys (AKIA), GitHub PATs, Google API keys, PEM Private Keys, Slack webhooks, alongside regional credentials: IBAN, Spanish DNI/NIE, and US SSNs.',
    metric: 'A+ to F Health Audit',
    colSpan: 'md:col-span-4',
  },
  {
    icon: <GitCompare className="w-5 h-5 text-blue-400" />,
    title: 'Structural AST Schema Diff',
    badge: 'BREAKING CHANGE ALERT',
    description:
      'Deep recursive structural comparison across payloads. Automatically flags schema breaking changes (removed fields, mutated primitive types) and emits Git-formatted unified diffs.',
    metric: 'API Contract Guard',
    colSpan: 'md:col-span-4',
  },
  {
    icon: <FileCheck className="w-5 h-5 text-emerald-400" />,
    title: 'Web Crypto Integrity Receipts',
    badge: 'SHA-256 / SHA-512',
    description:
      'Generates browser-native SHA-256 and SHA-512 cryptographic digests. Issues audit-ready integrity certificates proving payloads were processed purely client-side without tampering.',
    metric: 'SubtleCrypto Certified',
    colSpan: 'md:col-span-12',
    horizontal: true,
  },
];

export const TechnicalShowcase: React.FC = () => {
  return (
    <section id="features" className="relative w-full border-b border-zinc-800/80 bg-[#06070b] px-4 py-20 md:py-28 overflow-hidden">
      {/* Background radial glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-blue-600/10 blur-[130px] rounded-full pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="text-left mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.04] border border-white/10 text-2xs font-mono text-zinc-300 mb-3 backdrop-blur-md">
            <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
            <span className="uppercase tracking-widest text-accent font-semibold">// Core Architecture</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white font-sans uppercase">
            Built for security teams. Loved by developers.
          </h2>
          <p className="mt-3 text-sm sm:text-base text-zinc-400 font-mono max-w-2xl leading-relaxed">
            Every feature runs with zero server dependencies, zero external HTTP calls, and strict memory containment.
          </p>
        </div>

        {/* Spaceship Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {FEATURES.map((feat, i) => (
            <div
              key={i}
              className={`${feat.colSpan} p-7 md:p-8 rounded-3xl bg-zinc-900/40 border border-white/10 backdrop-blur-xl hover:border-accent/40 hover:bg-zinc-900/60 transition-all duration-300 flex flex-col justify-between group shadow-xl hover:-translate-y-1`}
            >
              <div>
                <div className="flex items-center justify-between mb-5">
                  <div className="w-11 h-11 rounded-2xl bg-white/[0.05] border border-white/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                    {feat.icon}
                  </div>
                  <span className="px-3 py-1 rounded-full text-3xs font-mono font-semibold tracking-wider text-zinc-300 bg-white/[0.05] border border-white/10">
                    {feat.badge}
                  </span>
                </div>

                <h3 className="text-lg md:text-xl font-bold text-white font-sans tracking-tight mb-2.5">
                  {feat.title}
                </h3>
                <p className="text-xs sm:text-sm text-zinc-400 font-mono leading-relaxed mb-6">
                  {feat.description}
                </p>
              </div>

              <div className="pt-4 border-t border-white/[0.06] flex items-center justify-between text-2xs font-mono text-zinc-400">
                <span className="text-accent font-semibold flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                  {feat.metric}
                </span>
                <ArrowUpRight className="w-3.5 h-3.5 text-zinc-600 group-hover:text-white transition-colors" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
