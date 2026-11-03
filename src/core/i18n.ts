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
  nav_product:        { es: 'Producto',       en: 'Product' },
  nav_solutions:      { es: 'Soluciones',     en: 'Solutions' },
  nav_resources:      { es: 'Recursos',       en: 'Resources' },
  nav_how_it_works:   { es: 'Cómo funciona',  en: 'How it works' },
  nav_privacy:        { es: 'Privacidad',     en: 'Privacy' },
  nav_pricing:        { es: 'Precios',        en: 'Pricing' },
  nav_download:       { es: 'Descargar .exe', en: 'Download .exe' },
  nav_launch:         { es: 'Abrir Workspace', en: 'Launch Workspace' },
  nav_open_studio:    { es: 'Abrir estudio',  en: 'Launch Studio' },
  nav_pro_active:     { es: 'PRO ACTIVO',     en: 'PRO ACTIVE' },
  nav_lifetime:       { es: 'Lifetime $14',   en: 'Lifetime $14' },
  nav_search:         { es: 'Buscar',         en: 'Search' },

  // ── Spaceship Mega Menu Sub-items ───────────────────────────────────────────
  nav_p_converter:    { es: 'Conversor de formatos', en: 'Format Converter' },
  nav_p_converter_sub:{ es: 'JSON, CSV y YAML en cualquier dirección.', en: 'JSON, CSV and YAML in any direction.' },
  nav_p_schema:       { es: 'Generador de esquemas', en: 'Schema Generator' },
  nav_p_schema_sub:   { es: 'TypeScript, Zod, OpenAPI y SQL desde tus datos.', en: 'TypeScript, Zod, OpenAPI and SQL from data.' },
  nav_p_mask:         { es: 'Enmascarado de PII', en: 'PII Sanitizer' },
  nav_p_mask_sub:     { es: 'Oculta correos, teléfonos y secretos antes de exportar.', en: 'Hide emails, phones and secrets before export.' },
  nav_p_flow:         { es: 'Flujo de trabajo', en: 'Workflow' },
  nav_p_flow_sub:     { es: 'De pegar los datos a copiar el resultado.', en: 'From pasting data to copying the result.' },

  nav_s_api:          { es: 'Desarrollo de APIs', en: 'API Development' },
  nav_s_api_sub:      { es: 'Genera tipos y contratos desde respuestas reales.', en: 'Generate types and contracts from responses.' },
  nav_s_data:         { es: 'Equipos de datos', en: 'Data Engineering' },
  nav_s_data_sub:     { es: 'Limpia y convierte archivos sin subirlos a ningún sitio.', en: 'Clean and convert files without uploading.' },
  nav_s_reg:          { es: 'Sectores regulados', en: 'Regulated Sectors' },
  nav_s_reg_sub:      { es: 'Salud, finanzas y legal: nada sale del equipo.', en: 'Health, finance & legal: zero outbound data.' },

  nav_r_verify:       { es: 'Verifica la privacidad', en: 'Verify Privacy' },
  nav_r_verify_sub:   { es: 'Compruébalo en la pestaña Network de tu navegador.', en: 'Inspect in your browser Network tab.' },
  nav_r_faq:          { es: 'Preguntas frecuentes', en: 'FAQ' },
  nav_r_faq_sub:      { es: 'Formatos, privacidad y cumplimiento.', en: 'Formats, privacy and compliance.' },
  nav_r_studio:       { es: 'Abrir el estudio', en: 'Launch Studio' },
  nav_r_studio_sub:   { es: 'Empieza a transformar ahora mismo.', en: 'Start transforming right now.' },
  faq_title:          { es: 'Preguntas frecuentes', en: 'Frequently asked questions' },

  // ── Hero & Studio ────────────────────────────────────────────────────────────
  hero_badge_label:   { es: 'ARQUITECTURA SWISS PRECISION', en: 'SWISS PRECISION ARCHITECTURE' },
  hero_badge_sub:     { es: 'CERO TELEMETRÍA DE SERVIDOR',  en: 'ZERO SERVER TELEMETRY' },
  hero_h1:            {
    es: 'Convierte, tipa y limpia tus datos sin enviarlos a nadie',
    en: 'Convert, type and sanitize your data without sending it to anyone',
  },
  hero_subtitle:      {
    es: 'FormatPulse transforma JSON, CSV y YAML, genera TypeScript, Zod, OpenAPI y SQL, y enmascara datos personales. Todo ocurre dentro de tu navegador.',
    en: 'FormatPulse transforms JSON, CSV & YAML, generates TypeScript, Zod, OpenAPI & SQL, and scrubs personal data. Everything runs inside your browser.',
  },
  hero_cta_primary:   { es: 'Abrir el estudio', en: 'Launch Studio' },
  hero_cta_secondary: { es: 'Descargar para Windows (.exe)', en: 'Download for Windows (.exe)' },
  hero_cta_verify:    { es: 'Cómo comprobarlo', en: 'How to verify' },
  hero_badge_gdpr:    { es: 'GDPR Art.25 & SOC2 Seguro',   en: 'GDPR Art.25 & SOC2 Safe' },
  hero_badge_worker:  { es: 'Motor Web Worker Paralelo',   en: 'Web Worker Parallel Engine' },
  hero_badge_latency: { es: 'Latencia 0.38ms en Memoria',  en: '0.38ms In-Memory Latency' },
  hero_badge_air:     { es: 'Modo Air-Gap Listo',           en: 'Air-Gapped Ready' },
  studio_mask_label:  { es: 'Enmascarar datos personales', en: 'Mask personal data' },
  studio_footer_note: { es: 'Demostración procesada en esta pestaña. Nada se envía a un servidor.', en: 'Demo processed in this tab. Nothing is ever sent to a server.' },

  // ── Trio Section (Todo ocurre en tu navegador) ──────────────────────────────
  trio_title:         { es: 'Todo ocurre en tu navegador', en: 'Everything happens in your browser' },
  trio_1_title:       { es: 'Sin servidor de por medio', en: 'Zero servers involved' },
  trio_1_desc:        { es: 'La conversión corre en tu equipo. No hay subidas de archivos ni enlaces compartidos que puedan filtrarse.', en: 'Conversion runs on your machine. No file uploads or shared links that can leak.' },
  trio_2_title:       { es: 'Esquemas desde datos reales', en: 'Schemas from real data' },
  trio_2_desc:        { es: 'Pega una respuesta de API y obtén tipos, validadores y tablas listos para tu proyecto.', en: 'Paste an API response and get types, validators and tables ready for your project.' },
  trio_3_title:       { es: 'Datos personales fuera de vista', en: 'Personal data kept private' },
  trio_3_desc:        { es: 'Enmascara correos, teléfonos y nombres antes de copiar o compartir el resultado.', en: 'Mask emails, phone numbers and names before copying or sharing.' },

  // ── Bento Section (Tres herramientas en una sola mesa) ──────────────────────
  bento_title:        { es: 'Tres herramientas en una sola mesa de trabajo', en: 'Three tools in a single workbench' },
  bento_1_title:      { es: 'Conversor de formatos', en: 'Format converter' },
  bento_1_desc:       { es: 'Cambia entre JSON, CSV y YAML sin abrir otra pestaña ni pegar tus datos en un sitio ajeno.', en: 'Convert between JSON, CSV and YAML without opening third-party tabs or pasting into foreign servers.' },
  bento_2_title:      { es: 'Generador de esquemas', en: 'Schema generator' },
  bento_2_desc:       { es: 'TypeScript, Zod, OpenAPI y SQL construidos a partir de la estructura de tus datos.', en: 'TypeScript, Zod, OpenAPI and SQL built directly from your data structure.' },
  bento_3_title:      { es: 'Enmascarado de datos personales', en: 'PII & Secrets scrubber' },
  bento_3_desc:       { es: 'Sustituye valores sensibles por versiones ocultas y comparte el resultado con tranquilidad.', en: 'Replace sensitive values with masked representations and share with confidence.' },

  // ── Scroll Flow (De pegar a copiar, sin pasos de más) ────────────────────────
  flow_title:         { es: 'De pegar a copiar, sin pasos de más', en: 'From paste to copy, with zero friction' },
  flow_1_title:       { es: 'Pega tus datos', en: 'Paste your data' },
  flow_1_desc:        { es: 'JSON, CSV o YAML directamente en el editor.', en: 'JSON, CSV or YAML directly in the editor.' },
  flow_2_title:       { es: 'Elige la salida', en: 'Choose output' },
  flow_2_desc:        { es: 'Otro formato, o código: TypeScript, Zod, OpenAPI o SQL.', en: 'Another format or code: TypeScript, Zod, OpenAPI or SQL.' },
  flow_3_title:       { es: 'Enmascara lo sensible', en: 'Mask sensitive values' },
  flow_3_desc:        { es: 'Activa el enmascarado para ocultar datos personales antes de exportar.', en: 'Toggle masking to hide confidential data before exporting.' },
  flow_4_title:       { es: 'Copia el resultado', en: 'Copy the result' },
  flow_4_desc:        { es: 'Llévalo a tu proyecto. Tus datos originales no salieron de la pestaña.', en: 'Paste into your project. Original data never left your browser tab.' },

  // ── Security Verification & Comparison ──────────────────────────────────────
  sec_title:          { es: 'No tienes que creernos: compruébalo en 20 segundos', en: "Don't trust our words: verify it in 20 seconds" },
  sec_desc:           {
    es: 'Abre las herramientas de desarrollo de tu navegador, entra en la pestaña Network y convierte un archivo en FormatPulse. No verás ninguna petición con tus datos, porque el procesamiento ocurre en tu equipo.',
    en: 'Open your browser DevTools, switch to the Network tab and convert any payload in FormatPulse. You will see 0 outbound requests with your data.',
  },
  sec_net_empty:      { es: 'Sin peticiones con tus datos mientras conviertes.', en: 'Zero network requests with your data while converting.' },
  sec_net_badge:      { es: '0 peticiones con tus datos', en: '0 network requests with your data' },
  sec_cmp_th1:        { es: 'En muchos formateadores en línea', en: 'In common online converters' },
  sec_cmp_th2:        { es: 'En FormatPulse', en: 'In FormatPulse' },
  sec_cmp_r1_title:   { es: 'Dónde se procesa', en: 'Where it runs' },
  sec_cmp_r1_c1:      { es: 'En un servidor ajeno', en: 'On a remote third-party server' },
  sec_cmp_r1_c2:      { es: 'En tu navegador / PC', en: 'Inside your local browser / PC' },
  sec_cmp_r2_title:   { es: 'Qué pasa con lo que pegas', en: 'What happens to your input' },
  sec_cmp_r2_c1:      { es: 'Puede guardarse o compartirse por enlace', en: 'Can be logged, retained or shared via link' },
  sec_cmp_r2_c2:      { es: 'Se queda en tu pestaña', en: 'Stays private inside your tab memory' },
  sec_cmp_r3_title:   { es: 'Datos personales y claves', en: 'Personal data & secrets' },
  sec_cmp_r3_c1:      { es: 'Los copias tal cual están expuestos', en: 'Exposed as plaintext' },
  sec_cmp_r3_c2:      { es: 'Los enmascaras antes de exportar', en: 'Sanitized and masked before export' },

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
  sandbox_preset_clean: { es: 'Limpiar & Formatear JSON',   en: 'Clean & Indent JSON' },
  sandbox_preset_user: { es: 'Perfil de Usuario',            en: 'User Profile & Roles' },
  sandbox_preset_ecom: { es: 'Pedidos E-Commerce CSV',      en: 'E-Commerce CSV Orders' },
  sandbox_preset_pii:  { es: 'Secretos en la Nube',          en: 'Sensitive Cloud Secrets' },
  sandbox_preset_db:   { es: 'Modelo de Base de Datos',      en: 'Prisma DB Model' },
  // ── Features Showcase ─────────────────────────────────────────────────────────
  features_badge:        { es: '// Ventajas Principales', en: '// Key Advantages' },
  features_title:        { es: 'Rendimiento Máximo. Privacidad Inquebrantable.', en: 'Maximum Performance. Uncompromising Privacy.' },
  features_subtitle:     {
    es: 'Diseñado para desarrolladores y equipos exigentes. El 100% de las operaciones suceden en tu memoria local.',
    en: 'Built for developers and security teams. 100% of operations execute inside your local machine memory.',
  },
  feature_priv_title:    { es: 'Privacidad Absoluta (Cero Red)', en: 'Absolute Privacy (Zero Network)' },
  feature_priv_desc:     {
    es: 'Ni un solo byte sale de tu ordenador. Cumple por diseño con normativas como GDPR Art. 25 y SOC2.',
    en: 'Not a single byte ever leaves your machine. Complies by design with GDPR Art. 25 and SOC2.',
  },
  feature_worker_title:  { es: 'Motor Multihilo Web Worker', en: 'Multithreaded Web Worker Engine' },
  feature_worker_desc:   {
    es: 'Transforma archivos pesados de más de 50MB sin congelar la interfaz ni agotar la memoria de tu navegador.',
    en: 'Transforms large 50MB+ datasets without freezing your browser tab or exhausting browser memory.',
  },
  feature_owasp_title:   { es: 'Escudo contra Inyección CSV (OWASP)', en: 'OWASP CSV Injection Defense' },
  feature_owasp_desc:    {
    es: 'Detecta y neutraliza comandos maliciosos al exportar a Excel, bloqueando ataques de ejecución remota.',
    en: 'Detects and neutralizes malicious formula triggers in spreadsheet exports, preventing remote exploits.',
  },
  feature_types_title:   { es: 'Inferencia Estricta en 10 Lenguajes', en: 'Strict Inference across 10 Languages' },
  feature_types_desc:    {
    es: 'Genera tipos exactos para TypeScript, Zod, OpenAPI 3.1, Prisma, Rust y Go sin alucinaciones de IA.',
    en: 'Generates deterministic types for TypeScript, Zod, OpenAPI, Prisma, Rust, and Go with zero AI hallucination.',
  },
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
