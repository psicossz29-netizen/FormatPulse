import React, { useId } from 'react';

interface FormatPulseLogoProps {
  size?: number;
  className?: string;
  showText?: boolean;
  animate?: boolean;
  variant?: 'mark' | 'tile';
  version?: string;
}

export const FormatPulseLogo: React.FC<FormatPulseLogoProps> = ({
  size = 28,
  className = '',
  showText = false,
  variant = 'mark',
  version,
}) => {
  const clipId = useId();

  return (
    <div className={`inline-flex items-center gap-2.5 select-none group ${className}`}>
      {/* ── Official FormatPulse Disc & Mosaic Emblem ──────────────────── */}
      <div
        className="relative flex-none transition-transform duration-200 group-hover:scale-105"
        style={{ width: size, height: size }}
      >
        {variant === 'tile' ? (
          /* Squircle App Tile (Orange or Dark Background) */
          <svg
            viewBox="0 0 48 48"
            width="100%"
            height="100%"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-full drop-shadow-[0_4px_12px_rgba(255,79,0,0.3)]"
          >
            <rect width="48" height="48" rx="13" fill="#FF4F00" />
            <clipPath id={`${clipId}-tile`}>
              <circle cx="24" cy="24" r="17" />
            </clipPath>
            {/* Left solid hemisphere */}
            <path d="M24 7a17 17 0 0 0 0 34z" fill="#FFFFFF" />
            {/* Right mosaic grid */}
            <g clipPath={`url(#${clipId}-tile)`}>
              <path
                fill="#FFFFFF"
                d="M25.5 7.75h7v7h-7zM25.5 16.25h7v7h-7zM25.5 24.75h7v7h-7zM25.5 33.25h7v7h-7zM34 7.75h7v7h-7zM34 24.75h7v7h-7zM34 33.25h7v7h-7z"
              />
              {/* Highlighted protected tile */}
              <rect fill="#09090B" x="34" y="16.25" width="7" height="7" />
            </g>
          </svg>
        ) : (
          /* Standalone Vector Mark (Exact Brand Emblem) */
          <svg
            viewBox="0 0 48 48"
            width="100%"
            height="100%"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-full drop-shadow-[0_0_12px_rgba(255,79,0,0.25)]"
          >
            <title>FormatPulse</title>
            <clipPath id={clipId}>
              <circle cx="24" cy="24" r="21" />
            </clipPath>
            {/* Left solid hemisphere (raw data) */}
            <path d="M24 3a21 21 0 0 0 0 42z" fill="#F4F4F5" />
            {/* Right mosaic grid (structured schema & masking) */}
            <g clipPath={`url(#${clipId})`}>
              <path
                fill="#F4F4F5"
                d="M25.5 3.75h9v9h-9zM25.5 14.25h9v9h-9zM25.5 24.75h9v9h-9zM25.5 35.25h9v9h-9zM36 3.75h9v9h-9zM36 24.75h9v9h-9zM36 35.25h9v9h-9z"
              />
              {/* Tactical Orange Protected Tile (FormatPulse pulse heartbeat) */}
              <rect fill="#FF4F00" x="36" y="14.25" width="9" height="9" />
            </g>
          </svg>
        )}
      </div>

      {/* ── Typographic Wordmark in Bricolage Grotesque ───────────────── */}
      {showText && (
        <div className="flex items-center gap-2">
          <span className="font-display font-bold text-base tracking-[-0.035em] text-[#F4F4F5] leading-none">
            FormatPulse
          </span>
          {version && (
            <span className="font-geist-mono text-[10px] text-[#9A9AA5] px-1.5 py-0.5 rounded border border-[#26262C] bg-[#111114] leading-none">
              {version}
            </span>
          )}
        </div>
      )}
    </div>
  );
};
