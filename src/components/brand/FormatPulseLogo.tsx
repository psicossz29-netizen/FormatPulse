import React from 'react';

interface FormatPulseLogoProps {
  size?: number;
  className?: string;
  showText?: boolean;
  animate?: boolean;
  version?: string;
}

export const FormatPulseLogo: React.FC<FormatPulseLogoProps> = ({
  size = 24,
  className = '',
  showText = false,
  animate = true,
  version = 'v1.2',
}) => {
  return (
    <div className={`inline-flex items-center gap-2 select-none group ${className}`}>
      {/* ── Geometric Logo Mark ────────────────────────────────────────── */}
      <div
        className="relative flex-none rounded-[22%] transition-transform duration-200 group-hover:scale-105"
        style={{ width: size, height: size }}
      >
        <svg
          viewBox="0 0 512 512"
          width="100%"
          height="100%"
          className="w-full h-full drop-shadow-[0_0_12px_rgba(255,79,0,0.25)]"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="l-bg" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#1c1c20" />
              <stop offset="100%" stopColor="#09090b" />
            </linearGradient>
            <linearGradient id="l-pulse" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#ff4f00" />
              <stop offset="70%" stopColor="#ff6a20" />
              <stop offset="100%" stopColor="#10b981" />
            </linearGradient>
            <filter id="l-glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="8" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Outer Industrial Bezel */}
          <rect
            x="32"
            y="32"
            width="448"
            height="448"
            rx="104"
            fill="url(#l-bg)"
            stroke="#27272a"
            strokeWidth="10"
          />
          <rect
            x="52"
            y="52"
            width="408"
            height="408"
            rx="88"
            fill="none"
            stroke="#ff4f00"
            strokeOpacity="0.18"
            strokeWidth="3"
            strokeDasharray="14 10"
          />

          {/* Corner Precision Calibrators */}
          <path
            d="M68 96 V68 H96 M416 68 H444 V96 M444 416 V444 H416 M96 444 H68 V416"
            stroke="#3f3f46"
            strokeWidth="4"
            strokeLinecap="round"
          />

          {/* Left Syntax Bracket */}
          <path
            d="M192 152 L124 256 L192 360"
            stroke="#ff4f00"
            strokeWidth="34"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Right Syntax Bracket */}
          <path
            d="M320 152 L388 256 L320 360"
            stroke="#ff4f00"
            strokeWidth="34"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Electric Telemetry Pulse Wave */}
          <path
            d="M148 256 H206 L236 168 L276 344 L306 256 H364"
            stroke="#ffffff"
            strokeWidth="24"
            strokeLinecap="round"
            strokeLinejoin="round"
            filter="url(#l-glow)"
          />
          <path
            d="M148 256 H206 L236 168 L276 344 L306 256 H364"
            stroke="url(#l-pulse)"
            strokeWidth="14"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Sentinel Status Node */}
          <circle cx="364" cy="256" r="26" fill="#10b981" fillOpacity="0.25" />
          <circle cx="364" cy="256" r="14" fill="#10b981" stroke="#09090b" strokeWidth="3" />
          <circle cx="364" cy="256" r="5" fill="#ffffff" />
        </svg>

        {/* Live Pulse Glow Animation */}
        {animate && (
          <span className="absolute -top-0.5 -right-0.5 flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
          </span>
        )}
      </div>

      {/* ── Typographic Wordmark ───────────────────────────────────────── */}
      {showText && (
        <div className="flex items-baseline gap-1.5 font-mono">
          <span className="text-xs font-bold tracking-tight text-zinc-100 flex items-center">
            FORMAT<span className="text-accent font-extrabold">PULSE</span>
          </span>
          {version && (
            <span className="text-2xs font-mono text-zinc-500 font-normal tracking-wider">
              // {version}
            </span>
          )}
        </div>
      )}
    </div>
  );
};
