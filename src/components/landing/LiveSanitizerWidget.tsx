import React, { useState } from 'react';
import { ShieldCheck, Copy, Check, Terminal, Sparkles, Lock } from 'lucide-react';
import { sanitizePII } from '@/core/piiSanitizer';
import { sanitizeWithSynthetics } from '@/core/security/syntheticSanitizer';
import { useAppStore } from '@/store/useAppStore';

const SAMPLE_PAYLOAD = JSON.stringify(
  {
    transaction_id: 'tx_8819024',
    customer_name: 'Johnathan Miller',
    contact_email: 'j.miller@acme-corp.com',
    phone: '+1-555-019-2834',
    credit_card: '4532-8891-2304-9912',
    server_ip: '192.168.1.150',
    aws_access_key: 'AKIAIOSFODNN7EXAMPLE',
    github_token: 'ghp_aBcDeFgHiJkLmNoPqRsTuVwXyZ123456',
  },
  null,
  2,
);

export const LiveSanitizerWidget: React.FC = () => {
  const setViewMode = useAppStore((s) => s.setViewMode);
  const setInputValue = useAppStore((s) => s.setInputValue);
  const setOutputFormat = useAppStore((s) => s.setOutputFormat);

  const [input, setInput] = useState(SAMPLE_PAYLOAD);
  const [mode, setMode] = useState<'redact' | 'synthetic'>('redact');
  const [output, setOutput] = useState('');
  const [copied, setCopied] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSanitize = () => {
    setIsProcessing(true);
    setTimeout(() => {
      if (mode === 'synthetic') {
        const result = sanitizeWithSynthetics(input);
        setOutput(result);
      } else {
        const result = sanitizePII(input, 'json');
        setOutput(result.success ? result.output : '// Parsing error in input JSON');
      }
      setIsProcessing(false);
    }, 120);
  };

  const handleCopy = async () => {
    if (!output) return;
    await navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const handleOpenInWorkspace = () => {
    setInputValue(input);
    setOutputFormat('pii-sanitizer');
    setViewMode('workspace');
  };

  return (
    <section className="w-full border-b border-zinc-800 bg-zinc-950 px-4 py-16 md:py-24">
      <div className="max-w-6xl mx-auto">
        <div className="text-left mb-10">
          <div className="text-2xs font-mono uppercase tracking-widest text-emerald-400 mb-2">
            // Live Interactive Sandbox
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-zinc-100 font-sans uppercase">
            Test the PII & Secrets Engine in your browser right now
          </h2>
          <p className="mt-2 text-sm text-zinc-400 font-mono max-w-2xl">
            Edit the data below or click Sanitize. Everything runs locally in memory — no bytes leave your device.
          </p>
        </div>

        {/* Sandbox Container */}
        <div className="border border-zinc-800 bg-surface-base shadow-2xl">
          {/* Toolbar */}
          <div className="h-10 border-b border-zinc-800 bg-zinc-900/90 px-3 flex items-center justify-between gap-3 flex-wrap">
            <div className="flex items-center gap-2">
              <span className="text-2xs font-mono text-zinc-500 uppercase tracking-wider">
                Mode:
              </span>
              <div className="flex items-center border border-zinc-700/80 rounded-sm overflow-hidden p-0.5 bg-zinc-950">
                <button
                  onClick={() => setMode('redact')}
                  className={`h-5 px-2 text-2xs font-mono transition-colors rounded-xs ${
                    mode === 'redact'
                      ? 'bg-zinc-800 text-accent font-semibold'
                      : 'text-zinc-500 hover:text-zinc-300'
                  }`}
                >
                  [REDACTED MASK]
                </button>
                <button
                  onClick={() => setMode('synthetic')}
                  className={`h-5 px-2 text-2xs font-mono transition-colors rounded-xs ${
                    mode === 'synthetic'
                      ? 'bg-zinc-800 text-emerald-400 font-semibold'
                      : 'text-zinc-500 hover:text-zinc-300'
                  }`}
                >
                  SYNTHETIC FAKER
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleSanitize}
                disabled={isProcessing}
                className="h-7 px-3 bg-accent hover:bg-accent-hover text-white text-2xs font-mono font-semibold transition-colors flex items-center gap-1.5 rounded-sm"
              >
                <Sparkles className="w-3 h-3" />
                <span>{isProcessing ? 'Processing…' : 'Sanitize In-Memory'}</span>
              </button>

              <button
                onClick={handleOpenInWorkspace}
                className="hidden sm:flex items-center gap-1 h-7 px-2.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-2xs font-mono rounded-sm transition-colors"
                title="Transfer payload to full IDE workspace"
              >
                <Terminal className="w-3 h-3 text-accent" />
                <span>Open in Workspace</span>
              </button>
            </div>
          </div>

          {/* Editors Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-zinc-800 font-mono text-xs">
            {/* Input Editor */}
            <div className="p-3 bg-zinc-950/60 flex flex-col">
              <div className="text-2xs uppercase tracking-wider text-zinc-500 mb-2 flex items-center justify-between">
                <span>Payload With Confidential Data</span>
                <span className="text-red-400/80">8 Sensitive Secrets</span>
              </div>
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                spellCheck={false}
                rows={12}
                className="w-full bg-zinc-900/50 border border-zinc-800 p-2 text-2xs font-mono text-zinc-300 focus:outline-none focus:border-zinc-700 resize-none leading-relaxed"
              />
            </div>

            {/* Output Panel */}
            <div className="p-3 bg-zinc-950 flex flex-col">
              <div className="text-2xs uppercase tracking-wider text-emerald-400 mb-2 flex items-center justify-between">
                <span>Sanitized Output</span>
                {output && (
                  <button
                    onClick={handleCopy}
                    className="flex items-center gap-1 text-2xs text-zinc-400 hover:text-zinc-200"
                  >
                    {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copied ? 'Copied' : 'Copy'}</span>
                  </button>
                )}
              </div>
              <pre className="flex-1 min-h-[160px] bg-zinc-900/80 border border-zinc-800/80 p-2 text-2xs font-mono text-emerald-300/90 overflow-x-auto leading-relaxed">
                {output || (
                  <span className="text-zinc-600 italic">
                    Click "Sanitize In-Memory" above to view clean output...
                  </span>
                )}
              </pre>
            </div>
          </div>

          {/* Verification Bar */}
          <div className="h-8 border-t border-zinc-800 bg-surface-raised px-3 flex items-center justify-between text-2xs font-mono text-zinc-500">
            <div className="flex items-center gap-1.5 text-emerald-400">
              <Lock className="w-3 h-3" />
              <span>CONFIRMED: ZERO BYTES TRANSMITTED TO NETWORK</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-3 h-3 text-accent" />
              <span>FNV-1a / Regex Engine Active</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
