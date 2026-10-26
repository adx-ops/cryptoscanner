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
