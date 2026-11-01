import React, { useState } from 'react';
import { Calculator, Clock, DollarSign, ArrowRight } from 'lucide-react';

export const RoiCalculator: React.FC = () => {
  const [teamSize, setTeamSize] = useState<number>(3);
  const [weeklyPayloads, setWeeklyPayloads] = useState<number>(40);

  // Math models
  // Average developer spends ~6 minutes manually writing types/schemas or fixing CSV formatting
  // 6 min = 0.1 hours
  const hoursSavedPerMonth = Math.round(weeklyPayloads * 0.1 * 4.3);
  const saasSavedAnnual = teamSize * 240; // $20/month per seat on typical cloud tool
  const formatPulseCost = teamSize <= 1 ? 14 : teamSize <= 5 ? 79 : 199;
  const netSavingsYearOne = saasSavedAnnual - formatPulseCost;

  return (
    <section className="w-full border-b border-zinc-800 bg-surface-base px-4 py-16 md:py-24">
      <div className="max-w-6xl mx-auto">
        <div className="text-left mb-10">
          <div className="text-2xs font-mono uppercase tracking-widest text-accent mb-2">
            // Value & Compliance Calculator
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-zinc-100 font-sans uppercase">
            Estimate Engineering Hours & SaaS Costs Saved
          </h2>
          <p className="mt-2 text-sm text-zinc-400 font-mono max-w-2xl">
            See how much time your team reclaims and how many compliance liabilities are avoided by switching to an offline data engine.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 border border-zinc-800 bg-surface-raised p-6 md:p-8">
          {/* Controls Column */}
          <div className="lg:col-span-6 flex flex-col justify-between space-y-6">
            <div>
              <div className="flex items-center justify-between mb-2 font-mono text-xs">
                <span className="text-zinc-300 font-semibold">Active Developers / Users:</span>
                <span className="text-accent font-bold px-2 py-0.5 bg-zinc-900 border border-zinc-800 rounded-sm">
                  {teamSize} {teamSize === 1 ? 'Engineer' : 'Engineers'}
                </span>
              </div>
              <input
                type="range"
                min="1"
                max="25"
                value={teamSize}
                onChange={(e) => setTeamSize(Number(e.target.value))}
                className="w-full accent-accent bg-zinc-900 h-1.5 rounded-none cursor-pointer"
              />
              <div className="flex justify-between text-2xs font-mono text-zinc-600 mt-1">
                <span>1 solo dev</span>
                <span>5 team</span>
                <span>10+ scale</span>
                <span>25 enterprise</span>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2 font-mono text-xs">
                <span className="text-zinc-300 font-semibold">Weekly Payloads / Files Processed:</span>
                <span className="text-emerald-400 font-bold px-2 py-0.5 bg-zinc-900 border border-zinc-800 rounded-sm">
                  {weeklyPayloads} conversions / wk
                </span>
              </div>
              <input
                type="range"
                min="5"
                max="200"
                step="5"
                value={weeklyPayloads}
                onChange={(e) => setWeeklyPayloads(Number(e.target.value))}
                className="w-full accent-emerald-500 bg-zinc-900 h-1.5 rounded-none cursor-pointer"
              />
              <div className="flex justify-between text-2xs font-mono text-zinc-600 mt-1">
                <span>5 / wk</span>
                <span>50 / wk</span>
                <span>100 / wk</span>
                <span>200+ / wk</span>
              </div>
            </div>

            <div className="p-3 bg-zinc-950 border border-zinc-800 text-2xs font-mono text-zinc-400 leading-relaxed">
              <span className="text-emerald-400 font-bold">Zero-Liability Guarantee:</span> By processing data exclusively on developer endpoints, your organization completely eliminates third-party data processor agreements (DPA) and data retention risk under GDPR & SOC2.
            </div>
          </div>

          {/* Results Column */}
          <div className="lg:col-span-6 grid grid-cols-2 gap-4">
            <div className="p-4 bg-zinc-950 border border-zinc-800 flex flex-col justify-between">
              <div className="flex items-center gap-1.5 text-accent text-2xs font-mono mb-2">
                <Clock className="w-3.5 h-3.5" />
                <span>DEV TIME SAVED</span>
              </div>
              <div className="text-2xl sm:text-3xl font-bold font-mono text-zinc-100">
                ~{hoursSavedPerMonth}h
              </div>
              <div className="text-2xs font-mono text-zinc-500 mt-1">
                hours reclaimed per month across your team
              </div>
            </div>

            <div className="p-4 bg-zinc-950 border border-zinc-800 flex flex-col justify-between">
              <div className="flex items-center gap-1.5 text-emerald-400 text-2xs font-mono mb-2">
                <DollarSign className="w-3.5 h-3.5" />
                <span>NET SAVINGS YR 1</span>
              </div>
              <div className="text-2xl sm:text-3xl font-bold font-mono text-emerald-400">
                ${netSavingsYearOne > 0 ? netSavingsYearOne : 0}
              </div>
              <div className="text-2xs font-mono text-zinc-500 mt-1">
                vs $20/mo recurring cloud subscription per seat
              </div>
            </div>

            <div className="p-4 bg-zinc-950 border border-zinc-800 flex flex-col justify-between col-span-2">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-1.5 text-zinc-400 text-2xs font-mono mb-1">
                    <Calculator className="w-3.5 h-3.5 text-accent" />
                    <span>RECOMMENDED PLAN</span>
                  </div>
                  <div className="text-base font-bold font-mono text-zinc-100">
                    {teamSize <= 1 ? 'Individual Pro ($14 Lifetime)' : teamSize <= 5 ? 'Team Pack ($79 Lifetime)' : 'Enterprise Air-Gapped ($199 Lifetime)'}
                  </div>
                </div>

                <a
                  href="#pricing"
                  className="px-3 py-2 bg-accent hover:bg-accent-hover text-white text-xs font-mono font-semibold flex items-center gap-1.5 transition-colors rounded-sm flex-none"
                >
                  <span>Select Plan</span>
                  <ArrowRight className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
