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

## 2026-11-07 — Commercial redesign v3: black, product imagery, ranked picks, "Get card" first
David (2026-11-07): "rend le site commercial, il est moche et pas sexy du tout" — reference todey.xyz (black, big official card artwork, uppercase display, chips). v2 (ink & brass, drawn card faces) replaced. Now: pure black, white, one lime signal; Archivo expanded caps for display; the home page is a conversion page — hero with the #1 card's official image, trust strip, ranked "Top picks" rows with CASHBACK / FX / MONTHLY chips and a "Get card" button per row, "Best for" picks computed from verified facts only, image tiles, a "Being verified now" strip, FAQ. Ranking stays deterministic and documented on the page (available → verified base cashback → free before paid → name); affiliate status never enters it; every outbound button is labelled affiliate / not affiliate. Product imagery: `data/images/manifest.json` records the official page, asset URL and date per card; `.github/workflows/fetch-card-images.yml` downloads and resizes the files (the workspace has no outbound web), opens an auto-merged PR; `CardVisual` shows the image when the file exists, otherwise the drawn face. The validator refuses an image entry without provenance and any unrecorded file. Lesson recorded: binary files must not be transferred through the assistant's context (a 32 KB WebP transcribed from base64 arrived corrupted) — the workflow is the only path. "Being verified now" lists provider/product names from the public research list only (no figures, no card-record data), so the publication rule in CLAUDE.md is unchanged.

## 2026-11-07 — Global scope and affiliate plumbing
David (2026-11-07): "I want it global, not only Europe, and it's an affiliation business model, so make what is necessary." Replaces the 2026-10-27 "Europe-first verification" and the 2026-11-02 "US-only out of scope" decisions.
- Site: global copy; the country selector is pre-filled from the browser language (nothing sent, remembered only when the visitor picks); Top picks follow the country (cards whose provider excludes it are hidden, explicitly listed ones first, unlisted ones dimmed with "not listed — check before applying").
- Region pages `/best/<region>` (Europe, UK, USA, Canada, Latin America, Asia-Pacific, Middle East & Africa) are generated only when at least one published card lists a country of the region (`src/lib/regions.ts`) — they appear by themselves as cards are published, never empty.
- Agents: research runs pick at least one non-EEA/UK product per run when available and prefer products with a publisher programme (order of research only, never ranking); discovery rotates regional searches and tags `regions`; US-only candidates re-opened (Gemini record back to validated, second read required).
- Published in this session under the policy: ether.fi Cash (browser read of the Ltd. International agreement confirmed issuer and FX; 86 countries) and COCA (73 countries; issuance modelled from the dated Tier System Terms per rule 5, €50 initial top-up shown as contradiction, issuer shown as not disclosed). RedotPay: KYC first read recorded (required before card); second read due ≥ 2026-11-08 17:40 Berlin.
- Affiliate plumbing: every "Get card" button goes through `/go/<slug>` (noindex, excluded from the sitemap, robots Disallow), which redirects to the confirmed affiliate URL when `links.affiliate` passes the status gate, else to the official site. Switching a card to its affiliate link is a data change only. Labels "affiliate link" / "not an affiliate link" kept on every button.
