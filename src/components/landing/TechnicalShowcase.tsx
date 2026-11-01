import React from 'react';
import { Code2, ShieldAlert, FileSpreadsheet, KeyRound, GitCompare, FileCheck } from 'lucide-react';

const FEATURES = [
  {
    icon: <Code2 className="w-5 h-5 text-accent" />,
    title: 'Multi-Target Contract Inference',
    badge: '10 TARGETS',
    description:
      'Infers strict types, optionality, datetime formats, emails, and nested structures into TypeScript, Zod Schema, OpenAPI 3.1, Prisma ORM, Python Pydantic v2, Rust Serde, and Go Structs.',
    metric: 'Zero-Any Strict Inference',
  },
  {
    icon: <ShieldAlert className="w-5 h-5 text-emerald-400" />,
    title: 'Zero-Trust AST & Prototype Defense',
    badge: 'ANTI-EXPLOIT',
    description:
      'Neutralizes __proto__, constructor, and prototype injection attempts. Enforces 50-level recursion limits, 500KB string caps, and circular reference handling to block DoS exploits.',
    metric: 'Safe Parser Sandbox',
  },
  {
    icon: <FileSpreadsheet className="w-5 h-5 text-accent" />,
    title: 'OWASP CSV Formula Injection Shield',
    badge: 'OWASP TOP 10',
    description:
      'Detects execution trigger prefixes (=, +, -, @, \\t, \\r) in spreadsheet exports while intelligently preserving legitimate negative and positive numbers, neutralizing remote command execution.',
    metric: 'Excel / Calc Safe',
  },
  {
    icon: <KeyRound className="w-5 h-5 text-emerald-400" />,
    title: 'Cloud Secrets & Regional PII Engine',
    badge: 'SOC2 / GDPR',
    description:
      'Detects and redacts AWS Keys (AKIA), GitHub PATs, Google API keys, PEM Private Keys, Slack webhooks, alongside regional credentials: IBAN, Spanish DNI/NIE, and US SSNs.',
    metric: 'A+ to F Health Audit',
  },
  {
    icon: <GitCompare className="w-5 h-5 text-accent" />,
    title: 'Structural AST Schema Diff',
    badge: 'BREAKING CHANGE ALERT',
    description:
      'Deep recursive structural comparison across payloads. Automatically flags schema breaking changes (removed fields, mutated primitive types) and emits Git-formatted unified diffs.',
    metric: 'API Contract Guard',
  },
  {
    icon: <FileCheck className="w-5 h-5 text-emerald-400" />,
    title: 'Web Crypto Integrity Receipts',
    badge: 'SHA-256 / SHA-512',
    description:
      'Generates browser-native SHA-256 and SHA-512 cryptographic digests. Issues audit-ready integrity certificates proving payloads were processed purely client-side without tampering.',
    metric: 'SubtleCrypto Certified',
  },
];

export const TechnicalShowcase: React.FC = () => {
  return (
    <section id="features" className="w-full border-b border-zinc-800 bg-surface-base px-4 py-16 md:py-24">
      <div className="max-w-6xl mx-auto">
        <div className="text-left mb-12">
          <div className="text-2xs font-mono uppercase tracking-widest text-accent mb-2">
            // Core Architecture
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-zinc-100 font-sans uppercase">
            Built for security teams. Loved by developers.
          </h2>
          <p className="mt-2 text-sm text-zinc-400 font-mono max-w-2xl">
            Every feature runs with zero server dependencies, zero external HTTP calls, and strict memory containment.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-zinc-800 border border-zinc-800">
          {FEATURES.map((f, i) => (
            <div
              key={i}
              className="p-6 bg-surface-raised hover:bg-zinc-900/90 transition-colors flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2 bg-zinc-900 border border-zinc-800 rounded-sm">
                    {f.icon}
                  </div>
                  <span className="text-2xs font-mono px-2 py-0.5 bg-zinc-900 border border-zinc-800 text-zinc-400">
                    {f.badge}
                  </span>
                </div>

                <h3 className="text-sm font-semibold tracking-tight text-zinc-100 font-mono mb-2">
                  {f.title}
                </h3>
                <p className="text-xs text-zinc-400 font-mono leading-relaxed mb-6">
                  {f.description}
                </p>
              </div>

              <div className="pt-3 border-t border-zinc-800/80 flex items-center justify-between text-2xs font-mono text-zinc-500">
                <span>STATUS: ACTIVE</span>
                <span className="text-emerald-400">{f.metric}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
