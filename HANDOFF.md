# Session Handoff

## Current State

The beginner API storytelling redesign is implemented. The landing page now
opens with a weekly-report story for non-developers, gives a plain-language API
definition, explains useful and unsuitable cases, and provides questions for a
development-team conversation before introducing requests, JSON, code, or API
keys.

The existing formal curriculum remains available after the beginner opening.
History and code are optional disclosures. Detailed security follows the first
guided request.

## Visual System

The final illustration set is under `public/images/api-story/`:

- `hero-report.jpg`: Nano Banana Pro primary hook
- `manual-to-api.jpg`: Nano Banana Flash process comparison
- `use-marketing.jpg`, `use-hr.jpg`, `use-accounting.jpg`, and
  `use-finance.jpg`: Nano Banana Lite department vignettes

All images are wordless JPEG files. Nearby HTML carries the instructional
meaning, and only the hero image is loaded with priority.

## Other Completed Work

- English and Spanish message structures are synchronized and tested.
- Navigation uses shared section definitions and outcome-oriented labels.
- The playground displays default inputs, clears stale responses when changing
  providers, and includes a localized recommended first request.
- The build section now describes an LLM-assisted collaboration workflow.
- Proxy, request lifecycle, contract-preview, CORS, heartbeat, theme, and
  analytics-provider correctness fixes were completed earlier in the session.

## Verification

Verified on 2026-08-09:

- `npm test`: 67 tests passed across 6 files
- `npm run lint`: passed
- `npm run build`: passed
- English and Spanish openings checked at desktop and mobile widths
- Light and dark opening layouts checked with headless Chrome
- Generated images inspected for text, logos, hand defects, and crop behavior
- Essential landing content remains visible before JavaScript animation runs

The production build still reports Next.js's existing warning that
`src/middleware.ts` should migrate to the `proxy.ts` convention.

## Deployment Migration

Cloudflare Workers migration work is tracked in
`docs/plans/cloudflare-workers-deployment.md`. Local configuration and CI are
implemented and locally verified. Credential rotation, Secret Manager setup,
deployment, custom-domain creation, and git actions still require explicit user
approval.

## Preview

The local production preview runs on port 3000. If it is not running, rebuild
with `npm run build` and start it with `npm start -- --hostname 0.0.0.0 --port
3000`.
