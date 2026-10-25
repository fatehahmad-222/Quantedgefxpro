# Quant Edge FX Pro

Premium landing page for a fully automated XAUUSD Expert Advisor built for MetaTrader 5.

The page is a Next.js App Router site with exact reference copy, responsive neon-gold/cyber-cyan styling, consent-gated Meta tracking, legal template pages, and automated content/visual QA.

## Stack

- Next.js 16 (App Router, Turbopack) and React 19
- Tailwind CSS 4
- CSS scroll-driven reveal animations with reduced-motion fallbacks
- Lenis smooth scrolling, dynamically imported after hydration
- Meta Pixel and Conversions API with shared event IDs
- Playwright Core, Chrome, and axe-core for QA

## Requirements

- Node.js 20.9 or newer
- npm
- Google Chrome at `C:\Program Files\Google\Chrome\Application\chrome.exe` for `npm run qa:visual`

## Local development

```powershell
npm install
Copy-Item .env.example .env.local
npm run dev
```

Open `http://localhost:3000`.

## Environment

| Variable | Required | Purpose |
| --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Production: yes | Canonical origin, sitemap entries, Open Graph URLs, and JSON-LD. No trailing slash. |
| `NEXT_PUBLIC_META_PIXEL_ID` | For browser tracking | Loads the Meta Pixel only after marketing consent. |
| `META_PIXEL_ID` | For CAPI | Server-side Pixel ID; falls back to `NEXT_PUBLIC_META_PIXEL_ID`. |
| `META_CAPI_ACCESS_TOKEN` | For CAPI | Conversions API access token. Without it, `/api/meta-capi` returns `204`. |
| `META_GRAPH_VERSION` | No | Graph API version, defaults to `v23.0`. |

See `docs/TRACKING.md` for the full event and consent contract.

## Scripts

```powershell
npm run dev               # Development server
npm run build             # Production build
npm run start             # Production server
npm run typecheck         # TypeScript
npm run lint              # ESLint
npm run verify:content    # Copy, contact, SEO, legal, and asset invariants
npm run qa:visual         # Chrome + Playwright + axe at five viewports
npm run generate:assets   # Regenerate PNG assets from SVG sources
```

## Structure

- `src/app/page.tsx`: homepage composition and homepage canonical
- `src/app/layout.tsx`: fonts, metadata, header/footer, background, analytics
- `src/content/content.ts`: typed page copy and SEO-only metadata
- `src/config/contact.ts`: WhatsApp, email, and phone constants
- `src/components/sections/`: landing sections
- `src/components/analytics/`: consent, Pixel, CAPI client, scroll tracking
- `src/lib/analytics.ts`: consent, attribution, event IDs, WhatsApp UTM handling
- `src/app/privacy/` and `src/app/terms/`: noindex legal templates
- `reference/original.html`: copy and layout source of truth
- `scripts/verify-content.ts`: content/invariant checker
- `scripts/qa-visual.mjs`: browser, accessibility, and funnel QA

## Content and compliance guardrails

- Preserve visible copy in `src/content/content.ts`; `npm run verify:content` compares it to the reference.
- Keep pricing at Starter `$149` and Pro `$349`.
- Keep the four performance values as `—` placeholders and retain the sample-layout notice.
- Do not add invented statistics, testimonials, or profit claims.
- Keep the `Illustrative` chart label and the risk disclosure.
- The primary WhatsApp link must remain exactly four times: `https://wa.me/14409909101?text=Hi%2C%20I%27m%20interested%20in%20Quant%20Edge%20FX%20Pro`.
- The footer WhatsApp link is separate and stays unchanged unless the business confirms otherwise.
- `src/config/contact.ts` still has `TODO: confirm which number is primary`.
- Privacy and Terms are templates marked `noindex`; replace placeholders and have counsel review before launch.

## Tracking and privacy

- Marketing scripts do not load until the visitor chooses **Accept all**.
- Consent is stored in `localStorage` under `qefp-consent-v1`.
- The Pixel and CAPI share an `event_id` for deduplication.
- First-touch UTM data is stored in `sessionStorage` under `qefp-attribution-v1`.
- WhatsApp links receive a `[ref: source/campaign]` suffix only when a base message exists.
- `ScrollDepth`, `FAQOpen`, and `GuaranteeViewed` are browser-only custom events.
- CAPI accepts only the standard allowlisted events and returns `204` when credentials are absent.
- Add edge rate limiting to `/api/meta-capi` before large paid campaigns.

## QA and performance

Repeated mobile Lighthouse runs on the build machine score approximately:

| Category | Score |
| --- | --- |
| Performance | 80-87 |
| Accessibility | 100 |
| Best Practices | 100 |
| SEO | 100 |

Core metrics: FCP `1.2-1.4s`, LCP `3.7-4.1s`, TBT `150-330ms`, CLS `0` under Lighthouse mobile simulation. Performance variance comes mostly from simulated main-thread work. Fonts use `font-display: optional` and CSS is inlined to avoid late text swaps and render-blocking CSS. The LCP text is server-rendered and is not opacity-animated. The LCP floor under Lighthouse's Lantern simulation is about `2.9s` even with JavaScript disabled.

`npm run qa:visual` covers 360, 390, 768, 1024, and 1440 px, reduced-motion-independent interactions, axe WCAG checks, consent and Pixel gating, legal pages, robots, sitemap, and the CAPI fallback.

## Deployment checklist

1. Set `NEXT_PUBLIC_SITE_URL` to the production HTTPS origin.
2. Add the Meta Pixel and CAPI credentials if tracking is approved.
3. Confirm the primary WhatsApp number and remove the TODO.
4. Replace legal template placeholders for entity, jurisdiction, and contact details.
5. Remove the legal template-review notices only after counsel approves the pages.
6. Run `npm run typecheck`, `npm run lint`, `npm run build`, `npm run verify:content`, and `npm run qa:visual`.
7. Re-run Lighthouse before launch and after any new third-party script.
