import React from 'react';
import { useSettingsStore } from '@/store/useSettingsStore';
import { createTranslator } from '@/core/i18n';

export const DeveloperFAQ: React.FC = () => {
  const language = useSettingsStore((s) => s.language);
  const tr = createTranslator(language);

  const faqs = language === 'es' ? [
    {
      q: '¿Se envían mis datos a algún servidor?',
      a: 'No. La conversión, la generación de código y el enmascarado de PII se ejecutan exclusivamente en tu navegador o app de escritorio local. FormatPulse no envía telemetría de tus datos a ningún servidor externo. Puedes comprobarlo abriendo la pestaña Network en las herramientas de desarrollo de tu navegador.',
    },
    {
      q: '¿Qué formatos y salidas admite?',
      a: 'Convierte bidireccionalmente entre JSON, CSV y YAML, y genera interfaces de TypeScript, esquemas de Zod, especificaciones OpenAPI 3.1, DDL de SQL, modelos de Prisma, estructuras de Go y Rust.',
    },
    {
      q: '¿Cómo funciona el enmascarado de datos personales?',
      a: 'Reemplaza valores sensibles como correos electrónicos, números de teléfono, tarjetas de crédito, tokens de APIs (AWS, GitHub, Slack) y números de identificación por versiones ofuscadas antes de que copies o exportes el resultado.',
    },
    {
      q: '¿FormatPulse cumple con GDPR, SOC2 o HIPAA?',
      a: 'Está concebido con arquitectura Privacy-by-Design y Zero-Server: dado que los datos confidenciales nunca abandonan la máquina del usuario, se minimiza completamente el riesgo de fuga y se facilita el cumplimiento normativo en sectores financieros, legales y de salud.',
    },
    {
      q: '¿Funciona la aplicación sin conexión a internet (air-gapped)?',
      a: 'Sí. Tanto la versión web en caché como el instalador nativo de Windows (.exe) funcionan 100% desconectados de internet, incluyendo la validación criptográfica de licencias.',
    },
  ] : [
    {
      q: 'Does my data get sent to any remote server?',
      a: 'No. Format conversion, schema generation, and PII masking run entirely within your local browser or desktop app runtime. FormatPulse transmits zero payload telemetry. You can verify this live in your browser DevTools Network tab.',
    },
    {
      q: 'What formats and output targets are supported?',
      a: 'Convert bidirectionally between JSON, CSV, and YAML, and generate TypeScript interfaces, Zod validation schemas, OpenAPI 3.1 specs, SQL DDL, Prisma models, Go structs, and Rust types.',
    },
    {
      q: 'How does personal data & secrets masking work?',
      a: 'It scans for sensitive values (emails, phone numbers, credit cards, cloud credentials, tokens) and redacts or synthesizes them before export so you never leak confidential information.',
    },
    {
      q: 'Does FormatPulse help with GDPR, SOC2 or HIPAA compliance?',
      a: 'Yes. With local-only in-memory execution, sensitive customer payloads never transit third-party servers, drastically reducing compliance liability for teams in finance, legal, and healthcare.',
    },
    {
      q: 'Does the application work in air-gapped environments?',
      a: 'Yes. Both the offline web app and the native Windows .exe desktop app operate completely air-gapped without requiring an active internet connection.',
    },
  ];

  return (
    <section className="py-20 md:py-28" id="faq">
      <div className="max-w-[820px] mx-auto px-5">
        <h2 className="font-display font-bold text-3xl sm:text-4xl md:text-5xl text-[#F4F4F5] tracking-tight mb-12">
          {tr('faq_title')}
        </h2>

        <div className="divide-y divide-[#26262C] border-y border-[#26262C]">
          {faqs.map((item, idx) => (
            <details
              key={idx}
              className="group py-6 transition-colors cursor-pointer"
            >
              <summary className="flex items-center justify-between gap-4 font-display font-semibold text-lg sm:text-xl text-[#F4F4F5] list-none select-none">
                <span>{item.q}</span>
                <span className="text-2xl text-[#FF4F00] font-normal leading-none transition-transform duration-300 group-open:rotate-45 shrink-0">
                  +
                </span>
              </summary>
              <p className="mt-4 font-geist text-sm sm:text-base text-[#9A9AA5] leading-relaxed max-w-[64ch]">
                {item.a}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
};
