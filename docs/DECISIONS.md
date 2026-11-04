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

## 2026-10-27 — Publishing entity chosen (name kept in the private project notes); no paid services; no domain yet
Entity details (country, legal form, registration, contact mailbox) not yet provided → /legal keeps the "publisher not yet designated" notice and PUBLIC_PUBLISHER_NAME stays empty until verified facts arrive. No paid service is engaged (no domain, no paid hosting, no API). "CryptoScanner" remains a working name.

## 2026-10-28 — Scale and autonomy: discovery → research → second read → auto-merge → deploy
David: many more cards, selection by popularity and affiliate quality, maximum automation, site growing without intervention. Reality check recorded: public directories list 86–137 cards (not thousands); "popularity" without paid tools = cross-listing count across directories, labelled as such. Design: three scheduled Claude sessions (agents/*.md, no extra cost) + GitHub Actions (free): agent PRs on `agent/*` with label `auto-merge` are merged when CI is green; publication follows docs/PUBLICATION-POLICY.md (two independent reads ≥ 24 h apart, official sources only). Affiliate quality steers research order and application order only — never the public ranking. GitHub Pages deploy of the verified build with noindex until a domain exists (requires David to enable Pages once).

## 2026-10-29 — Visual identity v2: "ink & brass", cards rendered as cards, official logos with provenance
David: the site was "fade"; act as UX lead + art director, make it "sexy", show the companies' logos. Replaces the 2026-10-27 identity (near-black + single mint accent, uppercase display, mono labels — the generic AI-dark look). Now: ink-navy surfaces, brass accent for actions, semantic colours only for statuses (mint verified, dashed unknown, coral contradiction), sentence case, one self-hosted variable typeface (Archivo weight+width via @fontsource — no Google Fonts request, which also removes a third-party call the privacy page would otherwise have to disclose). The memorable element is the card face: each record is drawn at ISO 7810 proportions with the brand mark, the base cashback set large, network and region; faces appear in the catalogue, fanned in the hero, on the card page and in the compare header. Logos: `data/logos/manifest.json` records, per provider, the official page the mark was taken from, the asset URL, the access date and the brand colour observed there; `scripts/validate-data.ts` refuses a logo file without that record and any unrecorded file. Logos are shown as served (white versions from dark headers; Gnosis Pay's dark mark set to white, Wirex's W kept from the "W | ONE" lockup) and stay the owners' trademarks — nominative use stated on /legal, removal requests honoured. Without a sourced logo the face shows a monogram, never an invented mark.

## 2026-11-02 — US-only products out of scope; Wirex unblocked; second-read rotation skips blocked records
David's four choices (asked after the 2026-11-02 runs):
1. **US-only products are not listed.** The catalogue targets the EEA. `gemini-credit-card` → `record_status: rejected` (record kept for history, `data/affiliate/gemini-affiliate.json` untouched). Directories alone do not reject a candidate: the research run rejects it once the official eligibility page confirms US-only (BitPay, Uphold still `identified`).
2. **Wirex Premium base Cryptoback: the dedicated X-tras pricing page governs (1%)** under policy rule 5; the 3% on the undated benefits article stays in `contradiction_note` and is shown on the card page. Status `contradictory` → `verified`, value unchanged.
3. **Wirex product status stays `active`, with a note**: the EEA issuer terms and the card order flow are still online even though wirexapp.com/personal redirects to wirex.one. Every read re-checks it.
4. **Second-read rotation skips records flagged `needs_browser_read` or `awaiting_decision`** in `data/research-list.json` (agents/second-read-run.md), so that unblocked records (MetaMask, Crypto.com, ether.fi, Wirex) get read.

## 2026-11-02 — ether.fi: FX from the dated agreement, LTV as a range, USDC payout accepted; borrowing terms shown on card pages
David's three choices:
1. **FX fee: the dated cardholder agreement governs** (1.5% Core, 1.25% Luxe, 1% Pinnacle and VIP) under policy rule 5; the help-centre figures (0.5% / 0.25% / none) stay in `ev-etherfi-fx.contradiction_note`, shown on the card page. Status `contradictory` → `verified`, values unchanged.
2. **LTV shown as a range**: new optional schema field `credit_terms.ltv_min_percent`; ether.fi = 20–81% depending on the collateral asset (`ltv_percent` stays the maximum).
3. **Affiliate payout in USDC to an ether.fi Cash Vault: accepted**, account in David's own name, opened by David. No application is filed without David's explicit go-ahead.
Also: the card page had no section for `credit_terms`. Credit and crypto-backed credit cards now show a "Borrowing terms" block (APR, maximum LTV, liquidation risk) above the regional details, so cashback never hides interest or liquidation risk.

## 2026-11-03 — ether.fi eligibility: least favourable reading governs
David chose the same mechanism as Wirex: `eligibility.status` `contradictory` → `verified`, modelling the least favourable reading of the two official lists (Malaysia, South Africa excluded; Colombia — eligible but "spending unsupported" — moved to excluded; Puerto Rico and US states out of scope). The contradictions stay in the evidence `contradiction_note` and are shown on the card page. With this, the validator accepts the record as publishable; publication stays with the second-read run.

## 2026-11-04 — Affiliate pipeline tooling and a weekly affiliate run; applications stay with David
Why: David asked to automate affiliation. What can be automated honestly: keeping programme terms current, finding programmes for new cards, wiring a confirmed link with provenance (`scripts/set-affiliate-link.ts`, the only entry point for an affiliate URL), checking that monetised links still resolve, and reporting (`npm run affiliate-status`, `docs/AFFILIATE-STATUS.md`). What cannot: applying, accepting terms, giving a payout destination, passing a programme's identity check — these require David's accounts and signature (brief §10, policy "What always needs David"). The run never applies and never invents a code.
Cost: €0. Limit: a link goes live only after David runs `npm run affiliate-link` with the tracking link and a confirmation source; CI fails when a card claims an access its programme file does not confirm.
