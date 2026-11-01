import React, { useState } from 'react';
import { ShieldCheck, Cpu, CheckCircle2, Lock } from 'lucide-react';
import { computeHash } from '@/core/security/checksum';

export const SecurityAuditSection: React.FC = () => {
  const [hashInput, setHashInput] = useState('FormatPulse Zero-Server Payload Verification Test 2026');
  const [computedHash, setComputedHash] = useState('');
  const [isHashing, setIsHashing] = useState(false);

  const handleComputeHash = async () => {
    setIsHashing(true);
    try {
      const hash = await computeHash(hashInput, 'SHA-256');
      setComputedHash(hash);
    } finally {
      setIsHashing(false);
    }
  };

  return (
    <section id="security" className="w-full border-b border-zinc-800 bg-surface-base px-4 py-16 md:py-24">
      <div className="max-w-6xl mx-auto">
        <div className="text-left mb-12">
          <div className="text-2xs font-mono uppercase tracking-widest text-emerald-400 mb-2">
            // Zero-Data Verification Protocol
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-zinc-100 font-sans uppercase">
            Don't trust our words. Audit the network yourself.
          </h2>
          <p className="mt-2 text-sm text-zinc-400 font-mono max-w-2xl">
            FormatPulse is provably Zero-Server. Here is the exact reproduction procedure to verify with standard browser developer tools.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
          {/* Step 1 */}
          <div className="p-6 bg-surface-raised border border-zinc-800 flex flex-col justify-between">
            <div>
              <div className="text-2xs font-mono text-accent mb-2">STEP 01 // INSPECT</div>
              <h3 className="text-sm font-bold font-mono text-zinc-100 mb-2">Open Browser DevTools</h3>
              <p className="text-xs text-zinc-400 font-mono leading-relaxed">
                Press <kbd className="px-1 py-0.5 bg-zinc-900 border border-zinc-700 text-zinc-300">F12</kbd> or right-click Inspect. Navigate to the <strong>Network</strong> tab and toggle the <strong>Fetch/XHR</strong> filter.
              </p>
            </div>
            <div className="mt-4 pt-4 border-t border-zinc-800/80 text-2xs font-mono text-zinc-500">
              FILTER: Fetch / XHR / WebSockets
            </div>
          </div>

          {/* Step 2 */}
          <div className="p-6 bg-surface-raised border border-zinc-800 flex flex-col justify-between">
            <div>
              <div className="text-2xs font-mono text-accent mb-2">STEP 02 // STRESS TEST</div>
              <h3 className="text-sm font-bold font-mono text-zinc-100 mb-2">Convert & Sanitize</h3>
              <p className="text-xs text-zinc-400 font-mono leading-relaxed">
                Paste massive production databases (CSV/JSON), sanitize AWS tokens, infer TypeScript or Zod schemas, or run structural diffs.
              </p>
            </div>
            <div className="mt-4 pt-4 border-t border-zinc-800/80 text-2xs font-mono text-zinc-500">
              PAYLOAD: Up to 50MB in RAM
            </div>
          </div>

          {/* Step 3 */}
          <div className="p-6 bg-surface-raised border border-zinc-800 flex flex-col justify-between">
            <div>
              <div className="text-2xs font-mono text-emerald-400 mb-2">STEP 03 // VERIFY</div>
              <h3 className="text-sm font-bold font-mono text-zinc-100 mb-2">0 Requests Recorded</h3>
              <p className="text-xs text-zinc-400 font-mono leading-relaxed">
                Watch the Network log remain completely empty. Exactly zero packets, headers, or telemetry metrics ever reach external servers.
              </p>
            </div>
            <div className="mt-4 pt-4 border-t border-zinc-800/80 text-2xs font-mono text-emerald-400 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>OUTBOUND TRAFFIC: 0 BYTES</span>
            </div>
          </div>
        </div>

        {/* Live Web Crypto SHA-256 Proof Box */}
        <div className="border border-zinc-800 bg-zinc-950 p-6 rounded-none">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-zinc-800">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span className="text-xs font-mono font-bold text-zinc-200">
                LIVE WEB CRYPTO INTEGRITY HASH TEST
              </span>
            </div>
            <span className="text-2xs font-mono text-zinc-500">
              SubtleCrypto native API (RFC 6234)
            </span>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 items-stretch">
            <input
              type="text"
              value={hashInput}
              onChange={(e) => setHashInput(e.target.value)}
              className="flex-1 bg-surface-raised border border-zinc-800 px-3 py-2 text-xs font-mono text-zinc-200 focus:outline-none focus:border-accent"
              placeholder="Type test payload to hash..."
            />
            <button
              onClick={handleComputeHash}
              disabled={isHashing}
              className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-100 text-xs font-mono font-medium transition-colors flex items-center gap-1.5 justify-center flex-none"
            >
              <Cpu className="w-3.5 h-3.5 text-accent" />
              <span>{isHashing ? 'Hashing in CPU…' : 'Compute SHA-256'}</span>
            </button>
          </div>

          {computedHash && (
            <div className="mt-4 p-3 bg-zinc-900 border border-zinc-800 text-2xs font-mono text-zinc-300 break-all">
              <div className="text-zinc-500 mb-1">// SHA-256 Checksum Computed Locally:</div>
              <div className="text-emerald-400 font-bold">{computedHash}</div>
            </div>
          )}

          <div className="mt-4 flex items-center gap-2 text-2xs font-mono text-zinc-500">
            <Lock className="w-3 h-3 text-zinc-500" />
            <span>Processed 100% in local memory via window.crypto.subtle. Zero HTTP calls.</span>
          </div>
        </div>
      </div>
    </section>
  );
};
