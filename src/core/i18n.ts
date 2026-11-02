// ── FormatPulse i18n Engine ───────────────────────────────────────────────────
// Lightweight bilingual (ES/EN) translation system.
// Language is auto-detected from navigator.language on first load,
// then persisted in localStorage so it survives refreshes.
// ----------------------------------------------------------------------------------

export type Language = 'es' | 'en';

const STORAGE_KEY = 'formatpulse_language_v1';

// ── Language Detection ────────────────────────────────────────────────────────

/**
 * Detects the preferred language from the browser's navigator.language.
 * Falls back to 'es' for any Spanish / Latin-American locale, 'en' otherwise.
 */
export function detectLanguage(): Language {
  if (typeof window === 'undefined') return 'en';

  // Check persisted preference first
  try {
    const persisted = localStorage.getItem(STORAGE_KEY);
    if (persisted === 'es' || persisted === 'en') return persisted;
  } catch {
    // ignore storage errors
  }

  // Auto-detect from browser
  const lang = navigator.language?.toLowerCase() ?? 'en';
  const isSpanish =
    lang.startsWith('es') || // es, es-AR, es-MX, es-ES …
    lang.startsWith('ca') || // Catalan
    lang.startsWith('gl') || // Galician
    lang.startsWith('eu');   // Basque

  return isSpanish ? 'es' : 'en';
}

export function persistLanguage(lang: Language): void {
  try {
    localStorage.setItem(STORAGE_KEY, lang);
  } catch {
    // ignore
  }
}

// ── Translation Dictionary ────────────────────────────────────────────────────

export const translations = {
  // ── Navbar ──────────────────────────────────────────────────────────────────
  nav_how_it_works:   { es: 'Cómo funciona', en: 'How it works' },
  nav_privacy:        { es: 'Privacidad',     en: 'Privacy' },
  nav_pricing:        { es: 'Precios',        en: 'Pricing' },
  nav_download:       { es: 'Descargar .exe', en: 'Download .exe' },
  nav_launch:         { es: 'Abrir Workspace', en: 'Launch Workspace' },
  nav_pro_active:     { es: 'PRO ACTIVO',    en: 'PRO ACTIVE' },
  nav_lifetime:       { es: 'Lifetime $14',  en: 'Lifetime $14' },

  // ── Hero ─────────────────────────────────────────────────────────────────────
  hero_badge_label:   { es: 'ARQUITECTURA SWISS PRECISION', en: 'SWISS PRECISION ARCHITECTURE' },
  hero_badge_sub:     { es: 'CERO TELEMETRÍA DE SERVIDOR',  en: 'ZERO SERVER TELEMETRY' },
  hero_h1:            {
    es: 'Convierte, formatea y protege tus datos en tu propia máquina.',
    en: 'Convert, format and protect your data — entirely on your machine.',
  },
  hero_subtitle:      {
    es: 'Pega tu JSON, CSV o YAML. Obtén estructuras ordenadas, tipos para TypeScript y oculta datos sensibles. Sin registros, sin suscripciones y sin enviar datos a internet.',
    en: 'Paste your JSON, CSV or YAML. Get clean structures, TypeScript types and mask sensitive data. No accounts, no subscriptions, no data leaves your machine.',
  },
  hero_cta_primary:   { es: 'Abrir Workspace Gratis', en: 'Launch Free Workspace' },
  hero_cta_secondary: { es: 'Descargar para Windows (.exe)', en: 'Download for Windows (.exe)' },
  hero_badge_gdpr:    { es: 'GDPR Art.25 & SOC2 Seguro',   en: 'GDPR Art.25 & SOC2 Safe' },
  hero_badge_worker:  { es: 'Motor Web Worker Paralelo',   en: 'Web Worker Parallel Engine' },
  hero_badge_latency: { es: 'Latencia 0.38ms en Memoria',  en: '0.38ms In-Memory Latency' },
  hero_badge_air:     { es: 'Modo Air-Gap Listo',           en: 'Air-Gapped Ready' },

  // ── Guided Use Case Section ───────────────────────────────────────────────────
  guided_title:       { es: '¿Qué quieres hacer hoy?',          en: 'What do you want to do today?' },
  guided_subtitle:    { es: 'Elige tu caso de uso y empieza en segundos — sin registros, sin internet.', en: 'Pick your use case and start in seconds — no sign-up, no internet.' },
  guided_card1_title: { es: 'Limpiar y Formatear',              en: 'Clean & Format' },
  guided_card1_desc:  { es: 'JSON o CSV desordenado → estructuras perfectamente indentadas con 1 clic.', en: 'Messy JSON or CSV → perfectly indented structures with 1 click.' },
  guided_card1_cta:   { es: 'Probar ahora →',                   en: 'Try it now →' },
  guided_card2_title: { es: 'Convertir Formatos',               en: 'Convert Formats' },
  guided_card2_desc:  { es: 'JSON → CSV para Excel, YAML para CI/CD, SQL para tu base de datos.', en: 'JSON → CSV for Excel, YAML for CI/CD, SQL for your database.' },
  guided_card2_cta:   { es: 'Probar ahora →',                   en: 'Try it now →' },
  guided_card3_title: { es: 'Ocultar Datos Sensibles',          en: 'Mask Sensitive Data' },
  guided_card3_desc:  { es: 'Oculta contraseñas, tokens API y PII antes de compartir logs o JSON.', en: 'Hide passwords, API tokens and PII before sharing logs or JSON.' },
  guided_card3_cta:   { es: 'Probar ahora →',                   en: 'Try it now →' },
  guided_card4_title: { es: 'Generar Código',                   en: 'Generate Code' },
  guided_card4_desc:  { es: 'TypeScript interfaces, esquemas Zod, OpenAPI specs desde cualquier JSON.', en: 'TypeScript interfaces, Zod schemas, OpenAPI specs from any JSON.' },
  guided_card4_cta:   { es: 'Probar ahora →',                   en: 'Try it now →' },

  // ── Three Step Flow ───────────────────────────────────────────────────────────
  step1_label: { es: 'Pega tus datos',      en: 'Paste your data' },
  step1_desc:  { es: 'JSON, CSV o YAML',    en: 'JSON, CSV or YAML' },
  step2_label: { es: 'Elige la acción',     en: 'Choose an action' },
  step2_desc:  { es: 'Formatear, convertir, enmascarar o generar código', en: 'Format, convert, mask or generate code' },
  step3_label: { es: 'Copia el resultado',  en: 'Copy the result' },
  step3_desc:  { es: '100% local — nunca sale de tu máquina', en: '100% local — never leaves your machine' },

  // ── Generic UI ────────────────────────────────────────────────────────────────
  open_workspace: { es: 'Abrir en Workspace', en: 'Open in Workspace' },
  copied:         { es: 'Copiado',             en: 'Copied' },
  copy:           { es: 'Copiar',              en: 'Copy' },
  input_label:    { es: 'Entrada (Tus datos)', en: 'Input (Your data)' },
  output_label:   { es: 'Salida (Transformado en tu PC)', en: 'Output (Transformed on your PC)' },

  // ── Workspace Sandbox ─────────────────────────────────────────────────────────
  sandbox_badge:     { es: 'SANDBOX EN VIVO // MOTOR LOCAL CERO LATENCIA', en: 'LIVE IN-PAGE SANDBOX // ZERO LATENCY LOCAL ENGINE' },
  sandbox_title:     { es: 'PRUEBA EL MOTOR AHORA MISMO EN TU NAVEGADOR', en: 'TEST THE ENGINE RIGHT NOW IN YOUR BROWSER' },
  sandbox_subtitle:  {
    es: 'Sin registros, sin servidores en la nube y sin telemetría. Edita cualquier dato abajo o carga ejemplos para ver la transformación en tiempo real.',
    en: 'No sign-ups, no cloud servers, and no telemetry. Edit any payload below or load sample data to inspect real-time contract generation and secret redaction.',
  },
  sandbox_input_hdr:  { es: 'Entrada (Tus datos editables)', en: 'Input Payload (Editable)' },
  sandbox_output_hdr: { es: 'Salida Sintetizada',            en: 'Synthesized Output' },
  sandbox_full_ide:   { es: 'Abrir en IDE Completo',        en: 'Switch to Full IDE View' },
  sandbox_preset_user: { es: 'Perfil de Usuario',            en: 'User Profile & Roles' },
  sandbox_preset_ecom: { es: 'Pedidos E-Commerce CSV',      en: 'E-Commerce CSV Orders' },
  sandbox_preset_pii:  { es: 'Secretos en la Nube',          en: 'Sensitive Cloud Secrets' },
  sandbox_preset_db:   { es: 'Modelo de Base de Datos',      en: 'Prisma DB Model' },
} as const;

export type TranslationKey = keyof typeof translations;

// ── Translation Function ──────────────────────────────────────────────────────

/**
 * Returns a translation string for the given key and language.
 * Falls back to English if the key is missing.
 */
export function t(key: TranslationKey, lang: Language): string {
  const entry = translations[key];
  if (!entry) return key;
  return entry[lang] ?? entry['en'] ?? key;
}

/**
 * Creates a bound translator for a fixed language.
 * Usage: const tr = createTranslator('es'); tr('hero_h1')
 */
export function createTranslator(lang: Language) {
  return (key: TranslationKey): string => t(key, lang);
}
