# CryptoScanner

Independent comparator of crypto cards (debit, prepaid, credit, crypto-backed credit), funded by affiliate links. Public site in English; project discussion in French. Mobile first. Europe first.

Status: **pre-launch scaffold**. The catalogue currently contains fictional demo records only. Nothing is published, no domain, no entity, no affiliate account.

## Stack (decided 2026-10-26, see docs/DECISIONS.md)

- **Astro 7 (static output)** + TypeScript — every page is pre-rendered HTML; no server, free hosting on any static host.
- **JSON records validated by JSON Schema (Ajv)** — one file per card under `data/cards/` (verified) or `data/demo/cards/` (fictional). The schema is the single source of truth.
- **Deterministic calculator** in `src/lib/calc/engine.ts`, tested with `node:test`, bundled unchanged into the browser for `/calculator`. No model, no network in the user path.
- No database, no backend, no AI chat, no analytics in this build.

## Commands (all run successfully on 2026-10-26, Node 22.23, npm 10.9)

```bash
cp .env.example .env     # PUBLIC_DATASET=demo by default
npm install              # package-lock.json committed
npm run validate         # JSON Schema + business rules on every record (exit 1 on error)
npm test                 # calculator business tests (13 passing)
npm run check            # astro check: 0 errors
npm run build            # validate + static build → dist/ (9 pages)
npm run preview          # serve dist/ locally
npm run dev              # dev server
```

`npm run build` refuses to build if any record fails validation.

## Layout

```
data/schema/        card.schema.json, affiliate-program.schema.json  (versioned 1.0.0)
data/cards/         verified records only; only record_status=published is built on the verified dataset
data/demo/cards/    fictional records (is_demo=true, never publishable, noindex banner)
data/affiliate/     affiliate programme matrix (kept apart from product data)
scripts/            validate-data.ts, (planned) expire-promos.ts
src/lib/types.ts    TS mirror of the schema
src/lib/calc/       engine.ts + engine.test.ts
src/lib/data.ts     the only data access layer
src/pages/          /, /compare, /calculator, /cards/[slug], /methodology, /how-we-make-money, /contact, /legal
docs/               BRIEF, DECISIONS, RESUME-STATE
```

## Datasets

`PUBLIC_DATASET=demo` (default) builds from fictional records with a visible banner and `noindex`.
`PUBLIC_DATASET=verified` builds only `record_status: published` records from `data/cards/`. This is the only dataset allowed on a public domain.

## Deployment

Not deployed. `dist/` is a plain static folder; any static host works (candidates to verify for cost/terms: Cloudflare Pages, GitHub Pages, Netlify). Set `PUBLIC_SITE_URL` at build time for canonicals; a sitemap is not generated yet.
