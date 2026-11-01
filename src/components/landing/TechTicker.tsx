import React from 'react';
import { Shield, Zap, Lock, Cpu, CheckCircle2 } from 'lucide-react';

const TICKER_ITEMS = [
  { label: 'ZERO NETWORK IO AUDITED', icon: <Lock className="w-3 h-3 text-emerald-400" /> },
  { label: 'WEB WORKER ENGINE (>10MB NON-BLOCKING)', icon: <Cpu className="w-3 h-3 text-accent" /> },
  { label: 'PROTOTYPE POLLUTION IMMUNE', icon: <Shield className="w-3 h-3 text-emerald-400" /> },
  { label: 'OWASP FORMULA INJECTION DEFENSE', icon: <CheckCircle2 className="w-3 h-3 text-emerald-400" /> },
  { label: 'JSON SCHEMA DRAFT 2020-12', icon: <Zap className="w-3 h-3 text-accent" /> },
  { label: 'OPENAPI 3.1 SPEC COMPONENT ENGINE', icon: <Zap className="w-3 h-3 text-accent" /> },
  { label: 'PRISMA ORM & DRIZZLE READY', icon: <Zap className="w-3 h-3 text-accent" /> },
  { label: 'PYTHON PYDANTIC V2 BASEMODEL', icon: <Zap className="w-3 h-3 text-accent" /> },
  { label: 'RUST SERDE AUTO-DERIVE STRUCTS', icon: <Zap className="w-3 h-3 text-accent" /> },
  { label: 'GO STRUCT JSON TAG INFERENCE', icon: <Zap className="w-3 h-3 text-accent" /> },
  { label: 'AIR-GAPPED PWA OFFLINE ENGINE', icon: <Lock className="w-3 h-3 text-emerald-400" /> },
  { label: 'GDPR ART. 25 PRIVACY BY DESIGN', icon: <Shield className="w-3 h-3 text-emerald-400" /> },
  { label: 'TAMPER-PROOF SHA-256 RECEIPTS', icon: <CheckCircle2 className="w-3 h-3 text-emerald-400" /> },
];

export const TechTicker: React.FC = () => {
  return (
    <div className="w-full bg-zinc-950 border-y border-zinc-800/80 overflow-hidden py-2.5 select-none relative">
      {/* Edge gradient masks */}
      <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-zinc-950 to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-zinc-950 to-transparent z-10 pointer-events-none" />

      <div className="flex w-max animate-marquee space-x-8">
        {[...TICKER_ITEMS, ...TICKER_ITEMS].map((item, idx) => (
          <div
            key={idx}
            className="flex items-center gap-2 text-2xs font-mono font-medium text-zinc-400 tracking-wider uppercase whitespace-nowrap"
          >
            {item.icon}
            <span>{item.label}</span>
            <span className="text-zinc-700 ml-4">//</span>
          </div>
        ))}
      </div>
    </div>
  );
};
