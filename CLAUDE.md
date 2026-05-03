# teaching-apis (learning-apis)

Interactive educational web app about APIs. From concept to practice, with live data.

## Tech Stack

- **Framework**: Next.js 16.2.4 (App Router, Turbopack)
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS v4 (`@tailwindcss/postcss`)
- **Animation**: Framer Motion
- **Charts**: Recharts
- **i18n**: next-intl (EN default, ES translation)
- **State**: Zustand (call history store)
- **Diff**: json-diff-kit (debugger diff view)
- **Testing**: Vitest + @testing-library/react
- **Deploy target**: Vercel (needs serverless for proxy routes)

## Project Structure

```
src/
  app/
    layout.tsx              # Root layout (Geist fonts)
    page.tsx                # Redirect to /en
    [locale]/
      layout.tsx            # i18n provider, navbar, footer
      page.tsx              # Main page (4 sections)
      advanced/
        page.tsx            # Advanced labs (9 interactive labs)
    api/
      proxy/
        fred/route.ts       # FRED proxy (injects API key)
        banxico/route.ts    # Banxico proxy (injects Bmx-Token)
        worldbank/route.ts  # World Bank proxy
      mortality/route.ts    # Custom mortality table API
      chaos/route.ts        # Fault injection endpoint for chaos lab
      mock/[...path]/route.ts # Dynamic mock endpoint for contract lab
  components/
    layout/                 # Navbar, Footer, ThemeProvider
    sections/               # Main page sections (Hero, WhatIsApi, etc.)
    animation/              # RequestResponseFlow, ScrollReveal
    playground/             # ApiPlayground (4 tabs)
    visualizations/         # Recharts charts (InterestRate, ExchangeRate, etc.)
    race/                   # Latency Race lab
    chaos/                  # Break It On Purpose lab
    debugger/               # Time-Travel Debugger lab
    heartbeat/              # API Heartbeat Monitor lab
    reverse/                # Reverse Engineer Mode lab
    xray/                   # Packet Anatomy X-Ray lab
    mashup/                 # Data Mashup Builder lab
    whatif/                 # What If Sandbox lab
    contract/               # Contract Negotiation lab
  hooks/
    useApiCall.ts           # Fetch wrapper with loading/error/latency state
    useCallHistory.ts       # Zustand store for debugger (persists to localStorage)
    useRace.ts              # Race orchestrator (fires 4 APIs in parallel)
    useScrollSection.ts     # IntersectionObserver for nav highlighting
  lib/
    api-registry.ts         # API definitions, params, quick fills
    chaos-catalog.ts        # 12 HTTP error challenges
    i18n.ts                 # Locale config (en/es)
    mock-registry.ts        # In-memory contract store for mock endpoints
  messages/
    en.json                 # English translations
    es.json                 # Spanish translations
  data/samples/             # Fallback JSON for when API keys are missing
  test/                     # Vitest test files
```

## Architecture Decisions

- **Proxy routes** hide API keys server-side. FRED and Banxico need keys; World Bank is open. When keys are missing, proxy routes serve sample data with `_sample: true` flag.
- **Custom mortality API** (`/api/mortality`) is a real working endpoint built in the project. It demonstrates the consumer-to-producer loop.
- **Two-page structure**: main page teaches fundamentals, advanced page (`/advanced`) has 9 interactive labs. Separated to avoid overwhelming newcomers.
- **Navbar detects page**: shows section anchors on main page, lab anchors on advanced page.
- **Theme**: manual dark/light toggle via `data-theme` attribute on html element. Dark mode uses pure black (#000000). No gradients in dark mode.
- **No "--" dashes** in user-facing content. Use "/" for badges, "|" for separators, commas elsewhere.

## API Keys

Stored in `.env.local` (gitignored). Required for live data:

```
FRED_API_KEY=       # Free: https://fred.stlouisfed.org/docs/api/api_key.html
BANXICO_TOKEN=      # Free: https://www.banxico.org.mx/SieAPIRest/service/v1/token
```

World Bank API needs no key. Without keys, FRED and Banxico serve sample/fallback data.

For deployment (Vercel/Cloud Run), set these as environment variables in the service config.

## Commands

```bash
npm run dev          # Start dev server
npm run build        # Production build
npm test             # Run all tests (vitest)
npm run test:watch   # Watch mode
```

## Content Rules

- English first, Spanish translation. Both must stay in sync.
- All new i18n keys go in both en.json and es.json.
- Every advanced lab section must have "The problem" + "What you will learn" context cards.
- Chart annotations should name the specific API source, not generic "from an API".
- Code examples use Python (requests library) for API calls.
- Section padding: `py-16 sm:py-20` (not larger).
- Mobile: 2-col grid for chaos cards, horizontal scroll for API tabs.

## Testing

44 tests across 3 files:
- `api-registry.test.ts` - Registry structure, param validation, quick fills
- `proxy-routes.test.ts` - Route security (SSRF prevention, key injection) + data extraction from real response structures
- `useApiCall.test.ts` - Hook lifecycle (idle/loading/success/error/reset)

Run `npm test` before pushing.
