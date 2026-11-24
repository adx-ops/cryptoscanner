# Affiliate status

Maintained by the unattended affiliate run (prompt: scheduled task "affiliate run"; the prompt file `agents/affiliate-run.md` does not exist yet — the run follows the hard rules embedded in the task). Source of truth is `data/affiliate/*.json`; this page is a derived summary: the block between the `affiliate-status:generated` markers is rewritten by `npm run affiliate-status` (`scripts/affiliate-status.ts`, no network), the rest is written by the run. Commissions never touch ranking (CLAUDE.md). The run never applies, never creates accounts, never contacts anyone, never accepts terms, never invents codes or links, never changes `our_status`.

Last run: 2026-11-24 (branch `agent/affiliate-2026-11-24`).

## Matrix

<!-- affiliate-status:generated -->
Matrix generated on 2026-11-24 from `data/affiliate/*.json` and `data/cards/*.json` (37 programmes) by `npm run affiliate-status`.

| Programme | Provider | Type | our_status | Commission status | Last official read | Linked card(s) |
|---|---|---|---|---|---|---|
| bitget-wallet-affiliate | bitget-wallet | hybrid | identified | hypothesis | 2026-11-10 | bitget-wallet-card (validated) |
| bitpanda-affiliate | bitpanda | hybrid | identified | unknown | 2026-11-10 | bitpanda-card (published) |
| bleap-ambassador | bleap | unknown | identified | unknown | 2026-11-24 | bleap-card (validated) |
| bybit-affiliate | bybit | revenue_share | terms_verified | verified | 2026-11-10 | bybit-card-eu (validated) |
| coca-referral | coca | personal_referral | identified | verified | 2026-11-24 | coca-card (published) |
| coinbase-affiliate | coinbase | revenue_share | identified | verified | 2026-11-17 | coinbase-card (needs_review) |
| coinjar-affiliate | coinjar | revenue_share | identified | verified | 2026-11-19 | coinjar-card (published) |
| coinspot-affiliate | coinspot | revenue_share | identified | verified | 2026-11-20 | coinspot-card (needs_review) |
| crypto-com-affiliate | crypto-com | hybrid | terms_verified | verified | 2026-11-10 | crypto-com-visa-card (validated), crypto-com-visa-credit-card-us (published) |
| cryptomus-affiliate | cryptomus | revenue_share | identified | verified | 2026-11-18 | — |
| ether-fi-affiliate | ether-fi | hybrid | accepted | verified | 2026-11-17 | ether-fi-cash (published) |
| exactly-referral | exactly | personal_referral | identified | verified | 2026-11-11 | exa-card (needs_review) |
| fold-affiliate | fold | cpa | identified | hypothesis | 2026-11-19 | fold-bitcoin-credit-card (validated) |
| gate-affiliate | gate | revenue_share | identified | hypothesis | 2026-11-17 | gate-card (validated) |
| gemini-affiliate | gemini | cpa | identified | verified | 2026-11-17 | gemini-credit-card (published) |
| gnosis-pay-referral | gnosis-pay | unknown | not_applicable | unknown | 2026-11-10 | — |
| jupiter-referral | jupiter | personal_referral | identified | verified | 2026-11-11 | jupiter-global-card (needs_review) |
| kast-referral | kast | publisher_affiliate | identified | verified | 2026-11-17 | kast-card (needs_review) |
| kraken-affiliate | kraken | hybrid | identified | verified | 2026-11-24 | krak-card (validated) |
| kripicard-affiliate | kripicard | unknown | identified | unknown | 2026-11-16 | kripicard (validated) |
| kucoin-affiliate | kucoin | revenue_share | identified | hypothesis | 2026-11-16 | kucard (validated) |
| mexc-affiliate | mexc | revenue_share | identified | hypothesis | 2026-11-23 | mexc-card (validated) |
| netcoins-affiliate | netcoins | cpa | identified | verified | 2026-11-20 | netcoins-prepaid-mastercard (validated) |
| nexo-affiliate | nexo | revenue_share | terms_verified | verified | 2026-11-10 | nexo-card (published) |
| okx-affiliate | okx | revenue_share | terms_verified | verified | 2026-11-16 | okx-card (validated) |
| oobit-referral | oobit | personal_referral | identified | contradictory | 2026-11-24 | oobit-crypto-card (validated) |
| plasma-one-referral | plasma | personal_referral | accepted | contradictory | 2026-11-24 | plasma-one-card (published) |
| redotpay-affiliate | redotpay | hybrid | terms_verified | hypothesis | 2026-11-17 | redotpay-card (published) |
| revolut-affiliate | revolut | publisher_affiliate | identified | unknown | 2026-11-13 | revolut-crypto-card (needs_review) |
| shakepay-referral | shakepay | personal_referral | identified | verified | 2026-11-17 | shakepay-card (published) |
| solcard-referral | solcard | revenue_share | identified | verified | 2026-11-10 | solcard (published) |
| tangem-referral | tangem | hybrid | identified | unknown | 2026-11-23 | tangem-pay-card (validated) |
| tria-ambassador | tria | hybrid | identified | hypothesis | 2026-11-24 | tria-card (validated) |
| tuyo-ambassador | tuyo | personal_referral | identified | hypothesis | 2026-11-12 | tuyo-card (validated) |
| uphold-affiliate | uphold | publisher_affiliate | identified | unknown | 2026-11-17 | uphold-card (validated) |
| wirex-referral | wirex | publisher_affiliate | identified | contradictory | 2026-11-10 | wirex-card (published) |
| xapo-bank-referral | xapo-bank | personal_referral | identified | verified | 2026-11-10 | xapo-bank-card (validated) |

Monetised links live (status `accepted`, URL present): ether-fi-cash, plasma-one-card. All other cards route to the official site, labelled "not an affiliate link".

Published or validated cards without any programme record: avalanche-card (validated), gnosis-pay-card (published), utorg-card (validated), xplace-card (validated).
<!-- /affiliate-status:generated -->

## Programmes that pay on card activity (relevant to a card comparator)

ether.fi (accepted, live; official Affiliate Program Terms effective 2026-04-23 read on 2026-11-17 — paid ads need authorisation, 90-day link window, > $1 monthly threshold), RedotPay (terms_verified; card-order commission + payment commission + 10 % secondary, rates still only in images), KAST (identified 2026-11-17: an approval-based Affiliate Program now exists under official terms effective 2026-05-08; rates on product pages after approval; the personal Referral Program pays $50 + $50 on $600 / +$1,000 spend milestones within 45 days, $100 Premium / $1,000 Private), Bitget Wallet (identified: 2–5 USDT per first card payment, 20–50 % physical-card activation, 0.10–0.30 % of card spend), Tria (identified; portal read 2026-11-24: card sales + card spend + futures fees, stablecoin payouts weekly/monthly, Season-3 Silver-1 tier = 25 % on membership sales + 0.10 % on card spend + 10 % of futures fees, other tiers in images; help centre says second-level 10 %, the Season-3 article says direct only), Nexo (card transactions commissionable, rate unpublished), Plasma One (personal referral, live; Addendum now at plasma.org/plasma-one-rewards, tiers marketed as Standard/Premium/Platinum while the Addendum says Lite/Core/Platinum), Solcard, Xapo Bank, Exactly, Jupiter, Tuyo, COCA ($20 + $10, but mass distribution via public forums or paid ads prohibited), Oobit (new Referral Terms effective 2026-11-08: USD 15 per qualified invitee, cap USD 1,500, personal and non-commercial — 'Authorized Partners' only under a separate written agreement, no public route), Bleap (Referrals T&Cs 2026-05-25: no commercial referral activity without express permission; Ambassador page moved to old.bleap.finance, still unread) — personal referral records, see matrix. Crypto.com, Bybit, Coinbase (50 % of trading fees for 3 months; EU/EEA MiFID traffic "different commission structures" by arrangement), Kraken (Krak card still 'coming soon' for commissions on 2026-11-24; Affiliate Agreement: Payward, Inc., clawbacks, no cookie window), KuCoin, OKX pay on trading activity, not on cards. Gemini pays $25 per trading account and explicitly excludes marketing affiliates from its credit-card referral offer. Uphold's personal Referral Program (US/LatAm only, "Not available in Europe") pays on funding + conversion, not on the card; its Affiliate Program page is still unreadable to the fetcher. Wirex's publisher programme (Impact) pays "up to $50 per customer" per the 2023 launch post — current figures not public.

## Run log

### 2026-11-24
- Re-read (search-first, official pages only) of the six programmes with the oldest *last official read*: Plasma One (2026-11-03), COCA (2026-11-04), Kraken (2026-11-04), Bleap (2026-11-05), Oobit (2026-11-06), Tria (2026-11-09). Ordering by last read rather than by oldest evidence entry, otherwise the 2026-10-26 group (already re-read on 2026-11-10) would be selected every week.
- **Oobit — material change**: official *Referral Program Terms & Conditions* (effective and last updated 2026-11-08) read for the first time: USD 15 per Qualified Invitee (USD 200 card spend within 60 days of code redemption), paid in USDT/USDC, cap USD 1,500 per inviter; invitee gets a fee waiver on the first USD 500 of card spend; §9.4 replaces the former "Invite 3, get $50"; personal and non-commercial, no advertising, paid channels or distribution "to the public at large" unless an *Authorized Partner* under a separate written agreement (§2.6). The undated support article still shows the 200,000-points scheme → commission stays `contradictory` (dated Terms govern). oobit.com/ambassador only returns the homepage.
- **Plasma One**: the Rewards Addendum (effective 2026-09-26) now lives at plasma.org/plasma-one-rewards (old URL not fetchable); two wording changes versus 2026-11-03 — qualifying referral no longer lists an eligible purchase (register + no prior account + ID verification + card activation), and the earning window "runs from registration" rather than from code redemption; §8 prohibitions confirmed. Tier names: Addendum Lite/Core/Platinum vs site Standard (free) / Premium ($600/yr) / Platinum ($2,500/yr); /compare still shows referral cashback 0.25 % / 1 % / 1 %. The site rename also concerns the published plasma-one-card product record (flagged for the second read). Help-centre referral article not fetchable.
- **Kraken**: /affiliate unchanged — Krak card still "Coming soon" for commissions. Affiliate Agreement read for the first time (Payward, Inc.; clawback/set-off; weekly payment wording that contradicts "monthly by default" on /affiliate and the 15th/29th cycle in the support centre; no cookie window, country list or brand-bidding rule). Krak Referrals (personal, $10 each) "ending soon", EEA only.
- **COCA**: help-centre T&Cs (updated 2026-10-26) unchanged, every value confirmed; prohibition of "mass distribution via public forums, paid advertising, or unsolicited messaging" recorded; the Sept-2025 and March-2026 blog promotions were time-limited and are over.
- **Bleap**: official Referrals T&Cs (updated 2026-05-25, German locale) read for the first time: minimum card payment €5 (help centre still says "five euros (€10)"), no commercial referral activity unless expressly permitted, no paid ads/spam. The Ambassador page is now only linked from the footer to old.bleap.finance (legacy host) and remains unread (needs_browser_read). No ambassador/affiliate agreement among the 14 legal documents.
- **Tria**: help-centre article not fetchable (provenance), but ambassador.tria.so and two official blog posts read for the first time: application by form reviewed personally or by sponsorship; streams card sales / card spend / futures fees; stablecoin payouts every Tuesday (sales, futures) and monthly (spend), minimum claim $5 USDC; Season-3 Silver-1 = 25 % membership sales + 0.10 % card spend + 10 % futures fees; pages disagree on second-level commissions. `our_status` unchanged, nothing submitted.
- Searched again for a programme for avalanche-card, xplace-card, utorg-card (validated): nothing official (only third-party listings) — fourth/third searches; not repeated next run unless a hint appears.
- Not done again: the two live affiliate URLs (ether.fi `/@6fe89e3c`, plasma.org `/download/RPQNUY`) could not be fetched by the unattended fetcher (provenance block, as on 2026-11-10 and 2026-11-17); their resolution was NOT verified.
- New: `npm run affiliate-status` (`scripts/affiliate-status.ts` + tests) now regenerates the matrix block of this file from the data; the 2026-11-17 matrix (28 programmes) was out of date (37 programme records).

### 2026-11-17
- Re-read (search-first, official pages only) of the six programmes with the oldest evidence: Uphold (no evidence), KAST (2026-10-28), RedotPay (2026-10-28), Coinbase (2026-10-30), Gemini (2026-11-02), ether.fi (2026-11-02).
- **KAST**: the official *Affiliate & Referral Program Terms and Conditions* (effective 2026-05-08) exist at kast.xyz/legal — an approval-based Affiliate Program (rates "set out on the relevant product pages", sub-affiliates, clawbacks, no spam/third-party promotion) plus a personal Referral Program ($50 at $600 spend + $50 at +$1,000 within 45 days of KYC, $100 Premium / $1,000 Private bonuses, 14-day lock; blog 2026-05-05). Type changed personal_referral → publisher_affiliate; `our_status` unchanged (identified). David's personal link (2026-11-07) is a Referral-Program link, not an approved Affiliate link.
- **ether.fi**: dedicated *Affiliate Program Terms and Conditions* (effective 2026-04-23) read for the first time + help-centre article (legacy 1 % Referral Program ended 2026-10-15). All tier figures confirmed; new: 90-day link→sign-up window, 30 days activation→first purchase, > $1 monthly threshold, paid ads prohibited without authorisation, clawback rights. Verification → verified.
- **Gemini**: both official pages re-read, every value confirmed; Exchange Referral Rewards terms (2026-01-20) read — Recruit tier only, card excluded. Verification → verified.
- **Coinbase**: EN programme page not fetchable; JA locale of the same page read — 50 % / 3 months, Impact, PayPal/bank confirmed; new MiFID (EU/EEA) footnote: different commission structure by arrangement. Help-centre article still returns a client error.
- **RedotPay**: /affiliates landing page not fetchable (provenance); structure re-confirmed from the two official blogs and the help centre (2026-07-26: card-order commission paid instantly, payment commission every 30 days, 10 % secondary, no commission if a ≥ 50 % discount code is used); rates still only in images.
- **Uphold**: Affiliate Program page still unreadable (malformed search URL, provenance block) — needs a browser read; official Referral Program Terms (2025-08-05) read: personal, US (ex-NY) + LatAm only, "Not available in Europe", US$20 BTC each on funding + conversion, not on the card.
- Searched for a programme for utorg-card (validated): none on utorg.com / utorg.pro (only a single athlete ambassador announcement, 2026-08-24). avalanche-card and xplace-card: already searched twice, not repeated.
- Not done again: the two live affiliate URLs (ether.fi `/@6fe89e3c`, plasma.org `/download/RPQNUY`) could not be fetched by the unattended fetcher (provenance — URLs not surfaced by search); their resolution was NOT verified. `npm run affiliate-status` still does not exist; this file was regenerated by script from the data.
- Checks: `npm run validate` 35 records 0 errors; `npm test` 18/18; `npm run check` 0 errors; `npm run build` 13 pages.

### 2026-11-10
- Re-read (search-first, official pages) of the six programmes whose evidence dated from 2026-10-26: Bitpanda, Bybit, Crypto.com, Gnosis Pay, Nexo, Wirex. Bybit, Crypto.com, Nexo, Gnosis Pay: every recorded value confirmed, evidence dated. Bitpanda: programme page now at `/en/affiliate-programme`; the official Terms & Conditions for Affiliates (updated May 2024) read for the first time — contractual framework recorded, rates still only inside Impact, Annex I (permitted territories incl. a "Bitpanda Card" column) not extracted by the fetcher. Wirex: the help centre documents a publisher Affiliates Program on Impact open to individuals and businesses (type changed from personal_referral to publisher_affiliate; commission figures not public; `our_status` unchanged).
- New: `data/affiliate/bitget-wallet-affiliate.json` (identified) from the official Bitget Wallet Affiliate Program article; bitget-wallet-card linked.
- Card records bitpanda-card and crypto-com-visa-card now reference their existing programme records (metadata only; no URL, outbound links unchanged).
- Not done: the two live affiliate URLs (ether.fi `/@6fe89e3c`, plasma.org `/download/RPQNUY`) could not be fetched by the unattended fetcher (provenance rule — URLs not surfaced by search); their resolution was NOT verified this run. `npm run affiliate-status` does not exist in package.json; this file was written by hand from the data.
