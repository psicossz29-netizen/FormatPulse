import type { InputFormat, OutputFormat } from '@/types';

export interface PresetDefinition {
  id: string;
  name: string;
  description: string;
  pageTitle: string;
  metaDescription: string;
  inputFormat: InputFormat;
  outputFormat: OutputFormat;
  sampleInput: string;
}

export const PRESETS: Record<string, PresetDefinition> = {
  'json-to-typescript': {
    id: 'json-to-typescript',
    name: 'JSON to TypeScript',
    description: 'Infer strictly typed TypeScript interfaces from JSON payloads.',
    pageTitle: 'FormatPulse — Convert JSON to TypeScript Interfaces (Zero-Data & Local)',
    metaDescription:
      'Generate clean, typed TypeScript interfaces from any JSON structure directly in your browser. 100% private, client-side execution with zero telemetry.',
    inputFormat: 'json',
    outputFormat: 'typescript',
    sampleInput: JSON.stringify(
      [
        {
          id: 'usr_849204',
          name: 'Sarah Connor',
          email: 'sarah.connor@cyberdyne.systems',
          role: 'security_lead',
          is_active: true,
          security_clearance: 5,
          contact: {
            primary_phone: '+1-555-0199',
            pager: null,
            emergency_contact: 'John Connor',
          },
          attributes: {
            department: 'Tactical Operations',
            location: 'Sector 4',
            badges: ['level_5', 'biometrics_verified'],
          },
          created_at: '2026-03-15T08:30:00Z',
          tags: ['alpha', 'defense', 'lead'],
        },
        {
          id: 'usr_849205',
          name: 'Kyle Reese',
          email: 'kyle.reese@tech-com.org',
          role: 'field_operative',
          is_active: true,
          security_clearance: 4,
          contact: {
            primary_phone: '+1-555-0142',
            pager: 'pager_8841',
            emergency_contact: null,
          },
          attributes: {
            department: 'Reconnaissance',
            location: 'Sector 2',
            badges: ['level_4'],
          },
          created_at: '2026-04-01T14:15:22Z',
          tags: ['recon', 'field'],
        },
      ],
      null,
      2,
    ),
  },

  'json-to-zod': {
    id: 'json-to-zod',
    name: 'JSON to Zod Schema',
    description: 'Generate runtime Zod schemas with automatic format detection.',
    pageTitle: 'FormatPulse — Generate Zod Schemas from JSON (Instant & Private)',
    metaDescription:
      'Instantly infer Zod validation schemas from JSON data. Detects emails, URLs, dates, integers, and optionals entirely in the browser.',
    inputFormat: 'json',
    outputFormat: 'zod',
    sampleInput: JSON.stringify(
      [
        {
          id: 1042,
          username: 'neo_anderson',
          email: 'thomas.anderson@metacortex.com',
          profile_url: 'https://matrix.net/agents/neo',
          registered_at: '2026-01-20T12:00:00Z',
          login_count: 142,
          is_premium: true,
          bio: 'Software engineer at Metacortex.',
          preferences: {
            theme: 'dark',
            notifications_enabled: true,
          },
        },
        {
          id: 1043,
          username: 'trinity_v',
          email: 'trinity@nebuchadnezzar.ship',
          profile_url: 'https://matrix.net/agents/trinity',
          registered_at: '2026-02-14T09:45:00Z',
          login_count: 289,
          is_premium: true,
          bio: null,
        },
      ],
      null,
      2,
    ),
  },

  'csv-to-sql': {
    id: 'csv-to-sql',
    name: 'CSV to SQL DDL & Seed',
    description: 'Transform tabular CSV data into CREATE TABLE DDL and INSERT statements.',
    pageTitle: 'FormatPulse — Convert CSV to SQL DDL & Seed Inserts Online',
    metaDescription:
      'Convert CSV spreadsheets into PostgreSQL/MySQL compatible CREATE TABLE schema and escaped INSERT statements. 100% offline-ready.',
    inputFormat: 'csv',
    outputFormat: 'sql-ddl',
    sampleInput: `account_id,company_name,tier,mrr_usd,is_active,contract_start,notes
AC-901,"Acme Corp, Inc.",enterprise,12500.50,true,2026-01-01T00:00:00Z,"Standard SLA; primary vendor"
AC-902,"Initech Global",growth,4200.00,true,2026-03-15T00:00:00Z,"Requested custom reporting"
AC-903,"Hooli Silicon",starter,1100.75,false,2026-04-10T00:00:00Z,"Pending renewal; contact CFO"
AC-904,"Umbrella Bio",enterprise,28400.00,true,2026-02-01T00:00:00Z,"High compliance requirements"`,
  },

  'pii-sanitizer': {
    id: 'pii-sanitizer',
    name: 'PII Data Sanitizer',
    description: 'Redact emails, phones, API keys, JWTs, and credit cards locally.',
    pageTitle: 'FormatPulse — Local PII Sanitizer & Developer Anonymization Engine',
    metaDescription:
      'Sanitize confidential customer datasets before testing or sharing with LLMs. Replaces emails, IPs, API secrets, and credit cards with deterministic tokens.',
    inputFormat: 'json',
    outputFormat: 'pii-sanitizer',
    sampleInput: JSON.stringify(
      {
        transaction_id: 'tx_884102941',
        client_session: {
          authenticated_user: 'charlie.root@fintech-corp.org',
          ip_address: '198.51.100.42',
          auth_header:
            'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIn0.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
          openai_key: 'sk-live_94819284019283019283019283019283',
        },
        billing_record: {
          card_number: '4532 8901 2345 6789',
          contact_phone: '+1 (555) 349-2810',
          secondary_email: 'charlie.billing@personal-mail.com',
          amount_cents: 1400,
        },
      },
      null,
      2,
    ),
  },

  'json-to-csv': {
    id: 'json-to-csv',
    name: 'JSON to CSV',
    description: 'Flatten nested JSON objects and arrays into structured RFC 4180 CSV.',
    pageTitle: 'FormatPulse — Convert JSON to CSV Spreadsheet Online',
    metaDescription:
      'Flatten nested JSON structures into RFC 4180 compliant CSV tables with dot-notation headers. Instant, browser-based, zero telemetry.',
    inputFormat: 'json',
    outputFormat: 'csv',
    sampleInput: JSON.stringify(
      [
        {
          order_id: 'ORD-1001',
          customer: { name: 'Ada Lovelace', email: 'ada@computing.org' },
          item_count: 3,
          total_usd: 149.99,
          status: 'fulfilled',
        },
        {
          order_id: 'ORD-1002',
          customer: { name: 'Alan Turing', email: 'alan@bletchley.ac.uk' },
          item_count: 1,
          total_usd: 49.5,
          status: 'processing',
        },
        {
          order_id: 'ORD-1003',
          customer: { name: 'Grace Hopper', email: 'grace@navy.mil' },
          item_count: 5,
          total_usd: 399.0,
          status: 'fulfilled',
        },
      ],
      null,
      2,
    ),
  },

  'csv-to-json': {
    id: 'csv-to-json',
    name: 'CSV to JSON',
    description: 'Parse CSV files into strongly typed JSON arrays with number & boolean inference.',
    pageTitle: 'FormatPulse — Convert CSV to JSON Online with Type Inference',
    metaDescription:
      'Parse CSV files into clean JSON objects with automatic type inference for numbers, booleans, and nulls. Works 100% in your browser.',
    inputFormat: 'csv',
    outputFormat: 'json',
    sampleInput: `id,sku,product_name,in_stock,unit_price,warehouse_location
101,PRD-ALPHA,"Precision Screwdriver Set",true,34.95,Bay-4A
102,PRD-BETA,"Hex Key Metric 9pc",true,18.50,Bay-2B
103,PRD-GAMMA,"Torx Industrial Kit",false,49.00,Bay-9C
104,PRD-DELTA,"ESD Anti-Static Mat",true,29.90,Bay-1A`,
  },

  'json-to-yaml': {
    id: 'json-to-yaml',
    name: 'JSON to YAML',
    description: 'Convert JSON payloads into clean, idiomatic YAML configurations.',
    pageTitle: 'FormatPulse — Convert JSON to YAML Online (Clean & Private)',
    metaDescription:
      'Convert JSON files into indented YAML syntax for Kubernetes, Docker, and CI/CD manifests. Private client-side execution.',
    inputFormat: 'json',
    outputFormat: 'yaml',
    sampleInput: JSON.stringify(
      {
        apiVersion: 'apps/v1',
        kind: 'Deployment',
        metadata: {
          name: 'formatpulse-worker',
          labels: { app: 'formatpulse', tier: 'frontend' },
        },
        spec: {
          replicas: 3,
          selector: { matchLabels: { app: 'formatpulse' } },
          template: {
            metadata: { labels: { app: 'formatpulse' } },
            spec: {
              containers: [
                {
                  name: 'engine',
                  image: 'formatpulse/engine:v1.0.0',
                  ports: [{ containerPort: 8080 }],
                  resources: { limits: { cpu: '500m', memory: '256Mi' } },
                },
              ],
            },
          },
        },
      },
      null,
      2,
    ),
  },

  'yaml-to-json': {
    id: 'yaml-to-json',
    name: 'YAML to JSON',
    description: 'Parse YAML configs and manifests into structured JSON documents.',
    pageTitle: 'FormatPulse — Convert YAML to JSON Online',
    metaDescription:
      'Convert YAML specifications into JSON representations without uploading files to any server. 100% private and fast.',
    inputFormat: 'yaml',
    outputFormat: 'json',
    sampleInput: `service:
  name: payment-orchestrator
  version: 2.4.0
  environment: production
  network:
    port: 9000
    ssl_enabled: true
    allowed_origins:
      - https://app.formatpulse.dev
      - https://formatpulse.dev
  database:
    max_connections: 50
    idle_timeout_seconds: 30
`,
  },
  'json-to-jsonschema': {
    id: 'json-to-jsonschema',
    name: 'JSON to JSON Schema',
    description: 'Infer standard JSON Schema Draft 2020-12 contracts from payloads.',
    pageTitle: 'FormatPulse — Convert JSON to JSON Schema 2020-12 (Local-First & Offline)',
    metaDescription:
      'Generate valid JSON Schema Draft 2020-12 validation contracts from any JSON payload in your browser with zero server telemetry.',
    inputFormat: 'json',
    outputFormat: 'json-schema',
    sampleInput: JSON.stringify(
      {
        id: 1042,
        name: 'Enterprise License Node',
        endpoint: 'https://api.formatpulse.dev/v1/auth',
        is_active: true,
        max_seats: 50,
        contact_email: 'compliance@corp.local',
        created_at: '2026-04-01T12:00:00Z',
        tags: ['enterprise', 'soc2', 'eu-west'],
      },
      null,
      2,
    ),
  },
  'json-to-openapi': {
    id: 'json-to-openapi',
    name: 'JSON to OpenAPI 3.1 Spec',
    description: 'Generate OpenAPI 3.1 schema components from response payloads.',
    pageTitle: 'FormatPulse — Generate OpenAPI 3.1 Schema from JSON (Zero-Data)',
    metaDescription:
      'Infer OpenAPI 3.1 schema components directly from API JSON payloads in your browser. Complete privacy without server leaks.',
    inputFormat: 'json',
    outputFormat: 'openapi',
    sampleInput: JSON.stringify(
      {
        user_id: 'usr_998124',
        email: 'dev@company.com',
        tier: 'enterprise',
        verified: true,
        balance: 1450.5,
        created_at: '2026-01-10T09:15:00Z',
      },
      null,
      2,
    ),
  },
  'json-to-prisma': {
    id: 'json-to-prisma',
    name: 'JSON to Prisma Schema',
    description: 'Create ready-to-use Prisma ORM models with relations and types.',
    pageTitle: 'FormatPulse — Convert JSON to Prisma Schema ORM Models (In-Browser)',
    metaDescription:
      'Generate Prisma schema models from JSON or CSV data in your browser. Zero server transfer, instant offline generation.',
    inputFormat: 'json',
    outputFormat: 'prisma',
    sampleInput: JSON.stringify(
      [
        {
          id: 'cm4a89fk1000109l5g6z4q8y1',
          email: 'admin@acme.com',
          name: 'Acme Admin',
          age: 34,
          isActive: true,
          createdAt: '2026-02-14T10:00:00Z',
        },
      ],
      null,
      2,
    ),
  },
  'json-to-pydantic': {
    id: 'json-to-pydantic',
    name: 'JSON to Python Pydantic v2',
    description: 'Generate Python Pydantic BaseModel classes with field validation.',
    pageTitle: 'FormatPulse — Generate Python Pydantic v2 Models from JSON (Local-First)',
    metaDescription:
      'Transform JSON data into Pydantic v2 BaseModel classes with EmailStr, datetime, and typing support directly in the client.',
    inputFormat: 'json',
    outputFormat: 'pydantic',
    sampleInput: JSON.stringify(
      {
        event_id: 8812,
        action: 'user.login',
        actor_email: 'security@cloud.net',
        website: 'https://cloud.net/audit',
        success: true,
        timestamp: '2026-03-20T14:45:00Z',
      },
      null,
      2,
    ),
  },
  'json-to-rust': {
    id: 'json-to-rust',
    name: 'JSON to Rust Serde Struct',
    description: 'Generate Rust structs with #[derive(Serialize, Deserialize)].',
    pageTitle: 'FormatPulse — Convert JSON to Rust Serde Structs (Zero Telemetry)',
    metaDescription:
      'Instantly generate Rust structs with Serde annotations and snake_case field mapping from JSON in your browser.',
    inputFormat: 'json',
    outputFormat: 'rust',
    sampleInput: JSON.stringify(
      {
        package_id: 'pkg_9918',
        version: '1.4.2',
        download_count: 82490,
        published: true,
        author: {
          name: 'Ferris',
          email: 'ferris@rust-lang.org',
        },
      },
      null,
      2,
    ),
  },
  'json-to-go': {
    id: 'json-to-go',
    name: 'JSON to Go Struct',
    description: 'Generate idiomatic Go structs with json struct tags.',
    pageTitle: 'FormatPulse — Generate Go Structs from JSON (Client-Side)',
    metaDescription:
      'Infer Go structs with idiomatic field names and JSON tags from any data payload directly in your browser.',
    inputFormat: 'json',
    outputFormat: 'go',
    sampleInput: JSON.stringify(
      {
        cluster_id: 'us-east-1a',
        node_count: 12,
        active: true,
        memory_usage_gb: 48.7,
        updated_at: '2026-04-10T18:00:00Z',
      },
      null,
      2,
    ),
  },
};

export function getPreset(presetId: string): PresetDefinition | null {
  return PRESETS[presetId] ?? null;
}

export function detectPresetFromURL(): PresetDefinition | null {
  if (typeof window === 'undefined') return null;
  const params = new URLSearchParams(window.location.search);
  const tool = params.get('tool');
  if (tool && PRESETS[tool]) {
    return PRESETS[tool];
  }
  return null;
}

export function applySEO(preset: PresetDefinition): void {
  if (typeof document === 'undefined') return;
  document.title = preset.pageTitle;
  const metaDesc = document.querySelector('meta[name="description"]');
  if (metaDesc) {
    metaDesc.setAttribute('content', preset.metaDescription);
  }
}
