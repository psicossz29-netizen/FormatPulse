import React from 'react';

const FORMATS = [
  'JSON',
  'CSV',
  'YAML',
  'TypeScript',
  'Zod',
  'OpenAPI 3.1',
  'SQL DDL',
  'Prisma',
  'Rust',
  'Go',
  'PII Redaction',
];

export const FormatPillStrip: React.FC = () => {
  return (
    <div className="max-w-[1160px] mx-auto px-5 pt-8 pb-4" aria-label="Formatos soportados">
      <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-2.5">
        {FORMATS.map((fmt) => (
          <span
            key={fmt}
            className="px-4 py-2 rounded-full border border-[#26262C] bg-[#111114]/80 text-[#9A9AA5] text-xs font-geist font-medium hover:border-[#FF4F00]/50 hover:text-[#F4F4F5] transition-all select-none"
          >
            {fmt}
          </span>
        ))}
      </div>
    </div>
  );
};
