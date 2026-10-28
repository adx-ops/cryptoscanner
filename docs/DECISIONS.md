# Decisions

Format: date — decision — why — cost — limit / revisit when.

## 2026-10-26 — Stack: Astro 7 static + TypeScript, JSON + JSON Schema, node:test
Why: SEO needs real HTML; free static hosting; one repo; no server to run or pay; the calculator must work with no model and no backend. JSON files + Ajv are enough for ≤50 records edited by one person; a database would add cost and ops for nothing at this stage.
Cost: €0 (open-source, no API).
Limit: no server-side features (no form backend, no postback receiver). Revisit when an affiliate postback or an authenticated import needs a server — then a tiny serverless function, not a backend.

## 2026-10-26 — Money arithmetic in integer minor units, half-up rounding at each component
Why: deterministic, testable, no float drift. Engine version is shown next to every result.
Limit: single currency per variant; the user's reference currency is not converted (stated as an assumption in the result).

## 2026-10-26 — Four fee types must be answered per tier: subscription, fx, atm_withdrawal, topup
Why: these drive most real cost. An absent entry is treated as unknown → result "partial". The validator warns on absence.

## 2026-10-26 — Eligibility: residence lists + explicit default for unlisted countries (to_confirm | ineligible)
Why: never infer availability from the card network or "global" claims.

## 2026-10-26 — Editorial KYC grid (light / standard / enhanced) stored next to concrete requirements
Why: comparability; explained on /methodology as editorial, not official.

## 2026-10-26 — Outbound link policy
A monetised link is exposed only when `links.affiliate.status` ∈ {accepted, tracking_tested, payment_observed} and a URL exists; otherwise the official URL, labelled "not an affiliate link". Validator rejects a URL without such a status.

## 2026-10-26 — No analytics, no form backend, no sitemap in this build
Why: no entity, no domain, no consent design yet. Contact page drafts a mailto; disabled until PUBLIC_CONTACT_EMAIL exists.

## 2026-10-26 — Demo records are fictional brands, not real card names
Why: unverified figures attached to real brands would be misinformation even in a demo.

## 2026-10-27 — Scope stays "cards only" until the affiliate matrix says otherwise
David: "where affiliate income is most likely". Nobody can know that without the matrix; the six programmes read so far pay on referred users' *trading/fee activity*, not on card orders (Crypto.com, Nexo, Bybit), or are personal-referral only (Wirex), or have no publisher programme (Gnosis Pay), or publish no rates (Bitpanda). Revisit after 15 records.

## 2026-10-27 — Affiliation only (no claim portal, no sponsored placements, no user reviews)
David's choice. Keeps the site static and operations near zero.

## 2026-10-27 — Dark-first visual identity, bold uppercase display type, single mint accent
David's choice ("sombre, bold, fintech"). Light theme kept as system/explicit option. Fonts: Archivo (display), IBM Plex Sans (body), IBM Plex Mono (badges/figures) via Google Fonts with system fallbacks.

## 2026-10-27 — Worldwide country selector, Europe-first verification
David asked for "whole world from the start". The data model is worldwide (variants per region, 'to_confirm' default), so the selector lists all ICU regions, grouped by "has at least one listed card". Verification capacity stays Europe-first; non-European variants are added only when a provider publishes its own country list (e.g. Gnosis Pay AR/BR/CO). Country pages only when ≥5 verified cards are available there.

## 2026-10-27 — Publishing entity: EOTM (David's structure); budget 0 €; no domain yet
David: entity will be "EOTM". Country, legal form, registration and contact mailbox not yet provided → /legal keeps the "publisher not yet designated" notice and PUBLIC_PUBLISHER_NAME stays empty until verified facts arrive. Budget confirmed at 0 € (no domain, no paid hosting, no API). Domain: none for now; "CryptoScanner" remains a working name. GitHub: David agreed to a repo under adx-ops (to be created by him: adx-ops/cryptoscanner, private, empty).

## 2026-10-28 — Scale and autonomy: discovery → research → second read → auto-merge → deploy
David: many more cards, selection by popularity and affiliate quality, maximum automation, site growing without intervention. Reality check recorded: public directories list 86–137 cards (not thousands); "popularity" at 0 € = cross-listing count across directories, labelled as such. Design: three scheduled Claude sessions (agents/*.md, 0 € extra on David's plan) + GitHub Actions (free): agent PRs on `agent/*` with label `auto-merge` are merged when CI is green; publication follows docs/PUBLICATION-POLICY.md (two independent reads ≥ 24 h apart, official sources only). Affiliate quality steers research order and application order only — never the public ranking. GitHub Pages deploy of the verified build with noindex until a domain exists (requires David to enable Pages once).
