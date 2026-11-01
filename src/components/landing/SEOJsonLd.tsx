import React from 'react';

export const SEOJsonLd: React.FC = () => {
  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'SoftwareApplication',
        '@id': 'https://formatpulse.dev/#software',
        name: 'FormatPulse',
        url: 'https://formatpulse.dev',
        applicationCategory: 'DeveloperApplication',
        operatingSystem: 'Any (Web Browser, PWA, macOS, Windows, Linux)',
        softwareVersion: '1.2.0',
        description:
          'Local-first data conversion, multi-language schema inference (TypeScript, Zod, OpenAPI, Prisma, Pydantic, Rust, Go), and PII anonymization engine running 100% in-browser with zero server telemetry.',
        offers: {
          '@type': 'Offer',
          price: '14.00',
          priceCurrency: 'USD',
          availability: 'https://schema.org/InStock',
          priceValidUntil: '2027-12-31',
          url: 'https://formatpulse.dev/#pricing',
        },
        aggregateRating: {
          '@type': 'AggregateRating',
          ratingValue: '4.95',
          ratingCount: '312',
          bestRating: '5',
          worstRating: '1',
        },
        featureList: [
          '100% Client-Side Processing (Zero Network I/O)',
          'TypeScript Interface Inference',
          'Zod Schema Generator',
          'OpenAPI 3.1 Spec Component Inference',
          'Prisma ORM Schema Generator',
          'Python Pydantic v2 Model Inference',
          'Rust Serde Struct Generation',
          'Go Struct Generation with JSON Tags',
          'Cloud Secrets Detection (AWS, GitHub, GCP, PEM Keys)',
          'Structural AST Schema Diff with Breaking Change Detection',
          'OWASP CSV Formula Injection Defense',
          'Prototype Pollution AST Protection',
          'Web Worker Accelerated Processing for Datasets >10MB',
          'Offline PWA Support and In-Browser Gzip Compression',
        ],
      },
      {
        '@type': 'FAQPage',
        '@id': 'https://formatpulse.dev/#faq',
        mainEntity: [
          {
            '@type': 'Question',
            name: 'Does FormatPulse transmit data to any remote server or AI service?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'No. FormatPulse is architected 100% client-side. All parsing, schema generation, AST checks, and PII anonymization execute directly within your browser runtime using pure JavaScript and isolated Web Workers. Zero bytes are uploaded.',
            },
          },
          {
            '@type': 'Question',
            name: 'Can FormatPulse be used under strict enterprise compliance (SOC2, GDPR, HIPAA)?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Yes. Because no data ever leaves the user workstation RAM, FormatPulse eliminates data retention and processor liability, complying inherently with GDPR Art. 25 (Privacy by Design) and enterprise confidentiality policies.',
            },
          },
          {
            '@type': 'Question',
            name: 'How does the Lifetime License work?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'You pay once ($14 USD early-bird) and own the license key forever. There are zero monthly or recurring subscription fees. The key works offline for air-gapped environments and includes all future updates.',
            },
          },
        ],
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
};
