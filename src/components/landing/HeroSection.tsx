import React, { useState } from 'react';
import { Terminal, Shield, ArrowRight, Activity, Lock, Cpu, Check, Copy, Download } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';

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
    <section className="relative w-full border-b border-zinc-800 bg-zinc-950 px-4 py-16 md:py-24 overflow-hidden">
      {/* Background technical grid pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#18181b_1px,transparent_1px),linear-gradient(to_bottom,#18181b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-25 pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10 flex flex-col items-center text-center">
        {/* ── Status Pill ──────────────────────────────────────────────── */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-sm bg-zinc-900 border border-zinc-800 text-xs font-mono text-zinc-300 mb-6">
          <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
          <span className="text-accent font-semibold">SWISS PRECISION ARCHITECTURE</span>
          <span className="text-zinc-600">//</span>
          <span className="text-zinc-400">ZERO SERVER TELEMETRY</span>
        </div>

        {/* ── Main Heading ─────────────────────────────────────────────── */}
        <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight text-zinc-50 max-w-4xl font-sans uppercase">
          Stop pasting confidential payloads into cloud converters.
        </h1>

        {/* ── Subtitle ─────────────────────────────────────────────────── */}
        <p className="mt-6 text-sm sm:text-base md:text-lg text-zinc-400 max-w-2xl font-mono leading-relaxed">
          Transform JSON, CSV & YAML, infer contracts across 10 modern languages (TypeScript, Zod, OpenAPI, Prisma, Pydantic, Rust, Go), and sanitize sensitive secrets 100% locally on your machine.
        </p>

        {/* ── CTAs ─────────────────────────────────────────────────────── */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={() => setViewMode('workspace')}
            className="flex items-center gap-2 h-10 px-5 bg-accent hover:bg-accent-hover text-white font-mono text-xs font-semibold tracking-tight transition-all rounded-sm shadow-[0_0_20px_rgba(255,79,0,0.25)] focus:outline-none"
          >
            <Terminal className="w-4 h-4" />
            <span>Launch Web App [⌘K]</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <a
            href="https://github.com/psicossz29-netizen/FormatPulse/releases/download/v1.2.0/FormatPulse-Setup-1.2.0.exe"
            download="FormatPulse-Setup-1.2.0.exe"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 h-10 px-4 bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-zinc-200 font-mono text-xs transition-colors rounded-sm"
            title="Direct download of FormatPulse native Windows x64 executable"
          >
            <Download className="w-3.5 h-3.5 text-accent" />
            <span>Download Windows .exe</span>
          </a>

          <a
            href="#security"
            className="flex items-center gap-2 h-10 px-4 bg-zinc-950 hover:bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-zinc-300 font-mono text-xs transition-colors rounded-sm"
          >
            <Shield className="w-3.5 h-3.5 text-emerald-400" />
            <span>Security Audit</span>
          </a>
        </div>

        {/* ── Technical Proof Badges ───────────────────────────────────── */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4 text-2xs font-mono text-zinc-400 border-y border-zinc-800/80 py-2.5 w-full max-w-3xl">
          <div className="flex items-center gap-1.5">
            <Lock className="w-3 h-3 text-emerald-400" />
            <span>GDPR Art. 25 & SOC2 Safe</span>
          </div>
          <span className="text-zinc-700">·</span>
          <div className="flex items-center gap-1.5">
            <Cpu className="w-3 h-3 text-accent" />
            <span>Web Worker Parallel Engine</span>
          </div>
          <span className="text-zinc-700">·</span>
          <div className="flex items-center gap-1.5">
            <Activity className="w-3 h-3 text-zinc-400" />
            <span>0.38ms In-Memory Latency</span>
          </div>
          <span className="text-zinc-700">·</span>
          <div className="flex items-center gap-1.5">
            <Check className="w-3 h-3 text-emerald-400" />
            <span>Air-Gapped PWA Ready</span>
          </div>
        </div>

        {/* ── Interactive Hero Playground ──────────────────────────────── */}
        <div className="mt-12 w-full max-w-4xl border border-zinc-800 bg-surface-base rounded-none shadow-2xl text-left overflow-hidden">
          {/* Playground Header Tabs */}
          <div className="h-9 flex items-center justify-between border-b border-zinc-800 bg-zinc-900/90 px-3 select-none">
            <div className="flex items-center gap-1 overflow-x-auto scrollbar-none">
              {HERO_EXAMPLES.map((ex, i) => (
                <button
                  key={ex.id}
                  onClick={() => setActiveTab(i)}
                  className={`h-6 px-2.5 text-2xs font-mono font-medium rounded-sm transition-colors flex items-center gap-1.5 ${
                    activeTab === i
                      ? 'bg-zinc-800 text-accent border border-zinc-700/80'
                      : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/40'
                  }`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${activeTab === i ? 'bg-accent' : 'bg-zinc-600'}`} />
                  {ex.title}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-2 text-2xs font-mono text-zinc-500">
              <span className="hidden sm:inline text-emerald-400">● CLIENT IO</span>
              <button
                onClick={handleTestInWorkspace}
                className="flex items-center gap-1 text-2xs font-mono text-accent hover:text-white px-2 py-0.5 bg-accent/10 border border-accent/30 rounded-xs transition-colors"
                title="Load into full editor"
              >
                <span>Edit in Workspace</span>
                <ArrowRight className="w-2.5 h-2.5" />
              </button>
            </div>
          </div>

          {/* Playground Body: Side by Side */}
          <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-zinc-800 font-mono text-xs relative">
            {/* Input Side */}
            <div className="p-3 bg-zinc-950/60">
              <div className="text-2xs uppercase tracking-wider text-zinc-500 mb-2 flex items-center justify-between">
                <span>Input [{currentExample.inputLang}]</span>
                <button
                  onClick={handleCopyInput}
                  className="flex items-center gap-1 text-2xs text-zinc-500 hover:text-zinc-300 transition-colors"
                >
                  {copiedInput ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedInput ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
              <pre className="p-2.5 rounded-sm bg-zinc-900/50 border border-zinc-800/60 text-zinc-300 overflow-x-auto leading-relaxed text-2xs">
                {currentExample.input}
              </pre>
            </div>

            {/* Output Side */}
            <div className="p-3 bg-zinc-950">
              <div className="text-2xs uppercase tracking-wider text-accent mb-2 flex items-center justify-between">
                <span>Output [{currentExample.outputLang}]</span>
                <button
                  onClick={handleCopyOutput}
                  className="flex items-center gap-1 text-2xs text-zinc-500 hover:text-zinc-300 transition-colors"
                >
                  {copiedOutput ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedOutput ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
              <pre className="p-2.5 rounded-sm bg-zinc-900/80 border border-accent/20 text-emerald-300/90 overflow-x-auto leading-relaxed text-2xs">
                {currentExample.output}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
