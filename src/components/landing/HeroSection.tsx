import React, { useState } from 'react';
import { Terminal, Shield, ArrowRight, Activity, Lock, Cpu, Check, Copy, Download, Sparkles } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { FormatPulseLogo } from '@/components/brand/FormatPulseLogo';
import { APP_VERSION } from '@/constants/version';

const HERO_EXAMPLES = [
  {
    id: 'ts',
    title: 'TypeScript Interface',
    inputLang: 'JSON',
    outputLang: 'TypeScript',
    input: `{\n  "id": "usr_9912",\n  "email": "sarah@cyberdyne.io",\n  "role": "security_lead",\n  "active": true,\n  "clearance": 5\n}`,
    output: `// Inferred in 0.38ms (Zero Network)\nexport interface UserRecord {\n  id: string;\n  email: string;\n  role: string;\n  active: boolean;\n  clearance: number;\n}`,
  },
  {
    id: 'openapi',
    title: 'OpenAPI 3.1 Spec',
    inputLang: 'JSON',
    outputLang: 'OpenAPI YAML',
    input: `{\n  "event_id": 401,\n  "service": "auth-gateway",\n  "ip": "10.0.4.1",\n  "timestamp": "2026-03-12T14:00:00Z"\n}`,
    output: `components:\n  schemas:\n    EventModel:\n      type: object\n      required: [event_id, service]\n      properties:\n        event_id: { type: integer }\n        service: { type: string }`,
  },
  {
    id: 'pii',
    title: 'Secrets & PII Redaction',
    inputLang: 'JSON with Secrets',
    outputLang: 'Sanitized JSON',
    input: `{\n  "aws_key": "AKIAIOSFODNN7EXAMPLE",\n  "pat": "ghp_AbCdEfGhIjKlMnOpQrStUvWxYz123456",\n  "phone": "+1-555-019-2834"\n}`,
    output: `{\n  "aws_key": "[REDACTED-AWS-KEY]",\n  "pat": "[REDACTED-SECRET]",\n  "phone": "+00-000-000-0000"\n}`,
  },
  {
    id: 'sql',
    title: 'CSV to SQL DDL + Seed',
    inputLang: 'CSV',
    outputLang: 'PostgreSQL DDL',
    input: `id,sku,price,in_stock\n1,PROD-901,49.99,true\n2,PROD-902,12.50,false`,
    output: `CREATE TABLE records (\n  id INTEGER PRIMARY KEY,\n  sku VARCHAR(255) NOT NULL,\n  price NUMERIC NOT NULL,\n  in_stock BOOLEAN NOT NULL\n);`,
  },
];

export const HeroSection: React.FC = () => {
  const setViewMode = useAppStore((s) => s.setViewMode);
  const setInputValue = useAppStore((s) => s.setInputValue);
  const setOutputFormat = useAppStore((s) => s.setOutputFormat);
  const setShowDownloadModal = useAppStore((s) => s.setShowDownloadModal);

  const [activeTab, setActiveTab] = useState(0);
  const [copiedInput, setCopiedInput] = useState(false);
  const [copiedOutput, setCopiedOutput] = useState(false);

  const currentExample = HERO_EXAMPLES[activeTab] ?? HERO_EXAMPLES[0]!;

  const handleCopyInput = async () => {
    await navigator.clipboard.writeText(currentExample.input);
    setCopiedInput(true);
    setTimeout(() => setCopiedInput(false), 1200);
  };

  const handleCopyOutput = async () => {
    await navigator.clipboard.writeText(currentExample.output);
    setCopiedOutput(true);
    setTimeout(() => setCopiedOutput(false), 1200);
  };

  const handleTestInWorkspace = () => {
    setInputValue(currentExample.input);
    if (currentExample.id === 'ts') setOutputFormat('typescript');
    if (currentExample.id === 'openapi') setOutputFormat('openapi');
    if (currentExample.id === 'pii') setOutputFormat('pii-sanitizer');
    if (currentExample.id === 'sql') setOutputFormat('sql-ddl');
    setViewMode('workspace');
  };

  return (
    <section className="relative w-full border-b border-zinc-800/80 bg-[#06070b] px-4 pt-16 pb-20 md:pt-24 md:pb-32 overflow-hidden select-none">
      {/* Spaceship Ambient Gradients & Glow Mesh */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-gradient-to-b from-accent/20 via-blue-600/10 to-transparent blur-[140px] pointer-events-none rounded-full" />
      <div className="absolute top-1/3 left-1/4 w-[400px] h-[300px] bg-emerald-500/10 blur-[120px] pointer-events-none rounded-full" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:2.5rem_2.5rem] [mask-image:radial-gradient(ellipse_70%_60%_at_50%_20%,#000_70%,transparent_100%)] pointer-events-none opacity-40" />

      <div className="max-w-6xl mx-auto relative z-10 flex flex-col items-center text-center">
        {/* ── Spaceship Status Pill ────────────────────────────────────── */}
        <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-white/[0.04] border border-white/10 text-xs font-mono text-zinc-300 mb-8 backdrop-blur-md shadow-[0_4px_20px_rgba(0,0,0,0.5)]">
          <FormatPulseLogo size={16} animate={false} />
          <span className="text-accent font-semibold tracking-wider">SWISS PRECISION ARCHITECTURE</span>
          <span className="text-zinc-600">//</span>
          <span className="text-zinc-400">ZERO SERVER TELEMETRY</span>
        </div>

        {/* ── Spaceship Main Heading with High-Contrast Gradient ────── */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-white max-w-4xl font-sans uppercase leading-[1.08]">
          Stop pasting confidential payloads into cloud converters.
        </h1>

        {/* ── Subtitle ─────────────────────────────────────────────────── */}
        <p className="mt-6 text-sm sm:text-base md:text-lg text-zinc-400 max-w-2xl font-mono leading-relaxed">
          Transform JSON, CSV &amp; YAML, infer contracts across 10 modern languages (TypeScript, Zod, OpenAPI, Prisma, Pydantic, Rust, Go), and sanitize sensitive secrets 100% locally on your machine.
        </p>

        {/* ── Spaceship CTAs (Pill-shaped with ambient glow) ───────────── */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <button
            onClick={() => setViewMode('workspace')}
            className="flex items-center gap-2.5 h-12 px-7 bg-white hover:bg-zinc-100 text-zinc-950 font-mono text-xs font-bold tracking-tight transition-all rounded-full shadow-[0_0_35px_rgba(255,255,255,0.25)] hover:scale-[1.02] active:scale-[0.98] focus:outline-none"
          >
            <Terminal className="w-4 h-4 text-zinc-950" />
            <span>Launch Web App [⌘K]</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={() => setShowDownloadModal(true)}
            className="flex items-center gap-2.5 h-12 px-6 bg-zinc-900/80 hover:bg-zinc-800/90 border border-white/10 text-zinc-200 font-mono text-xs font-semibold transition-all rounded-full backdrop-blur-md hover:border-white/20 hover:scale-[1.01] active:scale-[0.99] focus:outline-none"
            title="Download FormatPulse native Windows x64 executable"
          >
            <Download className="w-4 h-4 text-accent" />
            <span>Download Windows .exe</span>
          </button>

          <a
            href="#security"
            className="flex items-center gap-2 h-12 px-5 bg-transparent hover:bg-white/[0.04] border border-white/[0.08] text-zinc-400 hover:text-zinc-200 font-mono text-xs transition-all rounded-full backdrop-blur-xs"
          >
            <Shield className="w-4 h-4 text-emerald-400" />
            <span>Security Audit</span>
          </a>
        </div>

        {/* ── Technical Proof Badges ───────────────────────────────────── */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4 text-2xs font-mono text-zinc-400 border-y border-white/[0.07] py-3.5 w-full max-w-3xl backdrop-blur-xs">
          <div className="flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5 text-emerald-400" />
            <span>GDPR Art. 25 &amp; SOC2 Safe</span>
          </div>
          <span className="text-zinc-700">·</span>
          <div className="flex items-center gap-1.5">
            <Cpu className="w-3.5 h-3.5 text-accent" />
            <span>Web Worker Parallel Engine</span>
          </div>
          <span className="text-zinc-700">·</span>
          <div className="flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5 text-blue-400" />
            <span>0.38ms In-Memory Latency</span>
          </div>
          <span className="text-zinc-700">·</span>
          <div className="flex items-center gap-1.5">
            <Check className="w-3.5 h-3.5 text-emerald-400" />
            <span>Air-Gapped Ready (v{APP_VERSION})</span>
          </div>
        </div>

        {/* ── Spaceship Interactive Hero Dock / Console ────────────────── */}
        <div className="mt-14 w-full max-w-5xl rounded-3xl border border-white/10 bg-zinc-900/40 backdrop-blur-2xl shadow-[0_30px_90px_rgba(0,0,0,0.85)] text-left overflow-hidden relative">
          {/* Ambient inner glow */}
          <div className="absolute top-0 right-0 w-80 h-40 bg-accent/10 rounded-full blur-3xl pointer-events-none" />

          {/* Window Chrome Header */}
          <div className="h-11 flex items-center justify-between border-b border-white/[0.08] bg-zinc-950/70 px-4 select-none">
            {/* macOS / Spaceship window dots */}
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-red-500/80 border border-red-600/40" />
              <span className="w-3 h-3 rounded-full bg-amber-500/80 border border-amber-600/40" />
              <span className="w-3 h-3 rounded-full bg-emerald-500/80 border border-emerald-600/40" />
              <span className="ml-2 text-3xs font-mono text-zinc-500 hidden sm:inline">
                formatpulse-engine://local-sandbox
              </span>
            </div>

            {/* Interactive Tab Switcher */}
            <div className="flex items-center gap-1 overflow-x-auto scrollbar-none py-1">
              {HERO_EXAMPLES.map((ex, i) => (
                <button
                  key={ex.id}
                  onClick={() => setActiveTab(i)}
                  className={`h-7 px-3 text-2xs font-mono font-medium rounded-full transition-all flex items-center gap-1.5 whitespace-nowrap ${
                    activeTab === i
                      ? 'bg-white/[0.12] text-white border border-white/20 shadow-xs'
                      : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.04]'
                  }`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${activeTab === i ? 'bg-accent' : 'bg-zinc-600'}`} />
                  {ex.title}
                </button>
              ))}
            </div>

            {/* Right Action */}
            <div className="flex items-center gap-2 text-2xs font-mono text-zinc-500">
              <button
                onClick={handleTestInWorkspace}
                className="flex items-center gap-1.5 text-2xs font-mono text-white hover:text-accent px-3 py-1 bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 rounded-full transition-all"
                title="Load into full editor"
              >
                <Sparkles className="w-3 h-3 text-accent" />
                <span className="hidden sm:inline">Open in Workspace</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>

          {/* Playground Code Canvas: Dual Split */}
          <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-white/[0.08] font-mono text-xs relative">
            {/* Input Side */}
            <div className="p-5 bg-zinc-950/40">
              <div className="text-2xs uppercase tracking-wider text-zinc-500 mb-3 flex items-center justify-between">
                <span className="flex items-center gap-1.5 font-semibold text-zinc-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                  Input [{currentExample.inputLang}]
                </span>
                <button
                  onClick={handleCopyInput}
                  className="flex items-center gap-1 text-2xs text-zinc-500 hover:text-zinc-300 transition-colors px-2 py-0.5 rounded-sm hover:bg-white/[0.04]"
                >
                  {copiedInput ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedInput ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
              <pre className="p-3.5 rounded-xl bg-zinc-950/70 border border-white/[0.06] text-zinc-300 overflow-x-auto leading-relaxed text-2xs select-text">
                {currentExample.input}
              </pre>
            </div>

            {/* Output Side */}
            <div className="p-5 bg-zinc-950/70">
              <div className="text-2xs uppercase tracking-wider text-accent mb-3 flex items-center justify-between">
                <span className="flex items-center gap-1.5 font-semibold text-accent">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                  Synthesized Output [{currentExample.outputLang}]
                </span>
                <button
                  onClick={handleCopyOutput}
                  className="flex items-center gap-1 text-2xs text-zinc-500 hover:text-zinc-300 transition-colors px-2 py-0.5 rounded-sm hover:bg-white/[0.04]"
                >
                  {copiedOutput ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedOutput ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
              <pre className="p-3.5 rounded-xl bg-zinc-950/90 border border-accent/25 text-emerald-300/90 overflow-x-auto leading-relaxed text-2xs select-text shadow-inner">
                {currentExample.output}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
