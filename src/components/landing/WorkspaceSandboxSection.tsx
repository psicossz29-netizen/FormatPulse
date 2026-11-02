import React, { useState, useMemo } from 'react';
import {
  Terminal,
  ArrowRight,
  Copy,
  Check,
  Sparkles,
  ShieldCheck,
  Layers,
} from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { useSettingsStore } from '@/store/useSettingsStore';
import { createTranslator } from '@/core/i18n';
import { convert } from '@/core/converters';
import { sanitizePII } from '@/core/piiSanitizer';
import type { InputFormat, OutputFormat } from '@/types';

const SANDBOX_PRESETS = [
  {
    id: 'user',
    name: 'User Profile & Roles',
    nameKey: 'sandbox_preset_user' as const,
    inputFormat: 'json' as InputFormat,
    outputFormat: 'typescript' as OutputFormat,
    payload: `{\n  "userId": "usr_99824",\n  "username": "alex_dev",\n  "email": "alex@enterprise.corp",\n  "clearanceLevel": 4,\n  "is2FAEnabled": true,\n  "roles": ["admin", "infra_lead"],\n  "metadata": {\n    "lastLogin": "2026-11-02T18:40:00Z",\n    "ipAddress": "192.168.1.45"\n  }\n}`,
  },
  {
    id: 'ecommerce',
    name: 'E-Commerce CSV Orders',
    nameKey: 'sandbox_preset_ecom' as const,
    inputFormat: 'csv' as InputFormat,
    outputFormat: 'zod' as OutputFormat,
    payload: `orderId,customer,amount,currency,shipped\nORD-101,Acme Corp,149.50,USD,true\nORD-102,CyberLabs,899.00,USD,false\nORD-103,BioHealth,42.00,EUR,true`,
  },
  {
    id: 'pii',
    name: 'Sensitive Cloud Secrets',
    nameKey: 'sandbox_preset_pii' as const,
    inputFormat: 'json' as InputFormat,
    outputFormat: 'pii-sanitizer' as OutputFormat,
    payload: `{\n  "service": "production-cluster",\n  "awsAccessKey": "AKIAIOSFODNN7EXAMPLE",\n  "githubToken": "ghp_AbCdEfGhIjKlMnOpQrStUvWxYz123456",\n  "supportContact": "security@fintech.bank",\n  "creditCard": "4532-0150-1234-5678"\n}`,
  },
  {
    id: 'database',
    name: 'Prisma DB Model',
    nameKey: 'sandbox_preset_db' as const,
    inputFormat: 'json' as InputFormat,
    outputFormat: 'prisma' as OutputFormat,
    payload: `{\n  "productId": "prd_77",\n  "title": "Quantum SSD 2TB",\n  "price": 199.99,\n  "inStock": true,\n  "tags": ["hardware", "storage", "fast"]\n}`,
  },
];

export const WorkspaceSandboxSection: React.FC = () => {
  const setViewMode = useAppStore((s) => s.setViewMode);
  const setInputValue = useAppStore((s) => s.setInputValue);
  const setOutputFormatStore = useAppStore((s) => s.setOutputFormat);
  const setInputFormatStore = useAppStore((s) => s.setInputFormat);
  const language = useSettingsStore((s) => s.language);
  const tr = createTranslator(language);

  const [inputFormat, setInputFormat] = useState<InputFormat>('json');
  const [outputFormat, setOutputFormat] = useState<OutputFormat>('typescript');
  const [inputValue, setLocalInputValue] = useState(SANDBOX_PRESETS[0]!.payload);
  const [copied, setCopied] = useState(false);

  // Live conversion execution in browser memory
  const conversionResult = useMemo(() => {
    if (!inputValue.trim()) {
      return { output: '', timeMs: 0, lines: 0, error: null };
    }
    const start = performance.now();
    try {
      if (outputFormat === 'pii-sanitizer') {
        const sanitized = sanitizePII(inputValue, inputFormat);
        const elapsed = performance.now() - start;
        if (sanitized.success) {
          return {
            output: sanitized.output,
            timeMs: elapsed,
            lines: sanitized.output.split('\n').length,
            error: null,
          };
        } else {
          return {
            output: '',
            timeMs: elapsed,
            lines: 0,
            error: sanitized.error,
          };
        }
      }

      const res = convert(inputValue, inputFormat, outputFormat);
      if (res.success) {
        return { output: res.output, timeMs: res.timeMs, lines: res.outputLines, error: null };
      } else {
        return { output: '', timeMs: res.timeMs, lines: 0, error: res.error.message };
      }
    } catch (e) {
      return {
        output: '',
        timeMs: performance.now() - start,
        lines: 0,
        error: e instanceof Error ? e.message : String(e),
      };
    }
  }, [inputValue, inputFormat, outputFormat]);

  const handleCopy = async () => {
    if (!conversionResult.output) return;
    await navigator.clipboard.writeText(conversionResult.output);
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  };

  const handleOpenInFullWorkspace = () => {
    setInputValue(inputValue);
    setInputFormatStore(inputFormat);
    setOutputFormatStore(outputFormat);
    setViewMode('workspace');
  };

  const handleLoadPreset = (preset: typeof SANDBOX_PRESETS[0]) => {
    setInputFormat(preset.inputFormat);
    setOutputFormat(preset.outputFormat);
    setLocalInputValue(preset.payload);
  };

  return (
    <section id="workspace-sandbox" className="relative w-full border-b border-zinc-800/80 bg-[#06070b] px-4 py-20 md:py-28 overflow-hidden">
      {/* Background radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-accent/10 blur-[130px] rounded-full pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-white/10 text-2xs font-mono text-zinc-300 mb-4 backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-accent" />
            <span className="tracking-widest uppercase text-accent font-semibold">{tr('sandbox_badge')}</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-white font-sans uppercase">
            {tr('sandbox_title')}
          </h2>
          <p className="mt-4 text-sm sm:text-base text-zinc-400 font-mono max-w-2xl mx-auto leading-relaxed">
            {tr('sandbox_subtitle')}
          </p>
        </div>

        {/* Quick Sample Selector */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-6">
          <span className="text-2xs font-mono text-zinc-500 mr-2 flex items-center gap-1">
            <Layers className="w-3.5 h-3.5" />
            <span>Presets:</span>
          </span>
          {SANDBOX_PRESETS.map((p) => (
            <button
              key={p.id}
              onClick={() => handleLoadPreset(p)}
              className="px-3 py-1 rounded-full text-2xs font-mono bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 hover:border-white/20 text-zinc-300 transition-all"
            >
              {tr(p.nameKey)}
            </button>
          ))}
        </div>

        {/* Interactive Sandbox Card */}
        <div className="rounded-3xl border border-white/10 bg-zinc-900/50 backdrop-blur-2xl shadow-2xl overflow-hidden">
          {/* Controls Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-4 border-b border-white/[0.08] bg-zinc-950/70 select-none">
            {/* Input Format buttons */}
            <div className="flex items-center gap-1.5">
              <span className="text-2xs font-mono text-zinc-500 uppercase mr-1">In:</span>
              {(['json', 'csv', 'yaml'] as InputFormat[]).map((fmt) => (
                <button
                  key={fmt}
                  onClick={() => setInputFormat(fmt)}
                  className={`px-2.5 py-1 text-2xs font-mono rounded-lg transition-all ${
                    inputFormat === fmt
                      ? 'bg-white/15 text-white font-semibold border border-white/20'
                      : 'text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  {fmt.toUpperCase()}
                </button>
              ))}
            </div>

            <span className="hidden sm:inline text-zinc-600 font-mono">→</span>

            {/* Output Format buttons with helpful tooltips */}
            <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none py-1">
              <span className="text-2xs font-mono text-zinc-500 uppercase mr-1 flex-none">Out:</span>
              {[
                { id: 'typescript', label: 'TypeScript', tip: 'Genera interfaces y tipos TypeScript' },
                { id: 'zod', label: 'Zod', tip: 'Genera esquemas de validación Zod runtime' },
                { id: 'openapi', label: 'OpenAPI 3.1', tip: 'Genera especificación OpenAPI YAML' },
                { id: 'prisma', label: 'Prisma', tip: 'Genera esquemas de modelo para base de datos Prisma' },
                { id: 'sql-ddl', label: 'SQL DDL', tip: 'Genera sentencias CREATE TABLE y esquemas SQL' },
                { id: 'pii-sanitizer', label: 'PII Scrubber', tip: 'Oculta y enmascara tokens, contraseñas y datos sensibles' },
              ].map((t) => (
                <button
                  key={t.id}
                  onClick={() => setOutputFormat(t.id as OutputFormat)}
                  title={t.tip}
                  className={`px-2.5 py-1 text-2xs font-mono rounded-lg transition-all whitespace-nowrap flex-none ${
                    outputFormat === t.id
                      ? 'bg-accent text-white font-semibold shadow-[0_0_15px_rgba(255,79,0,0.3)]'
                      : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.04]'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            {/* Expand to full workspace */}
            <button
              onClick={handleOpenInFullWorkspace}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white text-zinc-950 font-mono text-2xs font-bold hover:bg-zinc-100 transition-all shadow-sm hover:scale-[1.02]"
            >
              <Terminal className="w-3 h-3" />
              <span>{tr('open_workspace')}</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          {/* Dual Textareas / Editors */}
          <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-white/[0.08] min-h-[340px]">
            {/* Input Canvas */}
            <div className="p-4 flex flex-col justify-between bg-zinc-950/40">
              <div className="flex items-center justify-between mb-2 text-2xs font-mono text-zinc-500">
                <span>{tr('sandbox_input_hdr')}</span>
                <span>{inputValue.length} chars</span>
              </div>
              <textarea
                value={inputValue}
                onChange={(e) => setLocalInputValue(e.target.value)}
                spellCheck={false}
                className="w-full flex-1 min-h-[260px] bg-zinc-950/80 border border-white/[0.06] rounded-xl p-3 font-mono text-xs text-zinc-200 resize-none focus:outline-none focus:border-accent/40 selection:bg-accent selection:text-white"
                placeholder="Type or paste payload here..."
              />
            </div>

            {/* Synthesized Output Canvas */}
            <div className="p-4 flex flex-col justify-between bg-zinc-950/70">
              <div className="flex items-center justify-between mb-2 text-2xs font-mono text-zinc-500">
                <div className="flex items-center gap-2">
                  <span className="text-accent font-semibold">{tr('sandbox_output_hdr')}</span>
                  <span className="text-emerald-400 tabular-nums">
                    {conversionResult.timeMs > 0 ? `${conversionResult.timeMs.toFixed(2)} ms` : '< 0.1 ms'}
                  </span>
                </div>
                <button
                  onClick={handleCopy}
                  disabled={!conversionResult.output}
                  className="flex items-center gap-1 text-2xs text-zinc-400 hover:text-white px-2 py-0.5 rounded-md hover:bg-white/[0.06] transition-colors"
                >
                  {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copied ? tr('copied') : tr('copy')}</span>
                </button>
              </div>

              {conversionResult.error ? (
                <div className="flex-1 min-h-[260px] p-4 rounded-xl bg-red-950/30 border border-red-900/50 text-red-400 font-mono text-xs">
                  Error parsing input: {conversionResult.error}
                </div>
              ) : (
                <pre className="w-full flex-1 min-h-[260px] bg-zinc-950/90 border border-white/[0.06] rounded-xl p-3 font-mono text-xs text-emerald-300/90 overflow-auto select-text">
                  {conversionResult.output || '// Output will appear here...'}
                </pre>
              )}
            </div>
          </div>

          {/* Footer Bar */}
          <div className="p-3.5 bg-zinc-950/90 border-t border-white/[0.08] flex flex-wrap items-center justify-between gap-3 text-2xs font-mono text-zinc-400">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>100% Client-Side Memory Execution · Zero Telemetry Sent</span>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={handleOpenInFullWorkspace}
                className="text-white hover:text-accent flex items-center gap-1 transition-colors"
              >
                <span>{tr('sandbox_full_ide')}</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
