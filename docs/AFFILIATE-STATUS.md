# Affiliate status

Maintained by the unattended affiliate run (prompt: scheduled task "affiliate run"; the prompt file `agents/affiliate-run.md` does not exist yet — the run follows the hard rules embedded in the task). Source of truth is `data/affiliate/*.json`; this page is a derived summary. Commissions never touch ranking (CLAUDE.md). The run never applies, never creates accounts, never contacts anyone, never accepts terms, never invents codes or links, never changes `our_status`.

Last run: 2026-11-17 (branch `agent/affiliate-2026-11-17`). Matrix regenerated from `data/affiliate/*.json` and `data/cards/*.json` (28 programmes).

## Matrix

| Programme | Provider | Type | our_status | Commission status | Last official read | Linked card(s) |
|---|---|---|---|---|---|---|
| bitget-wallet-affiliate | bitget-wallet | hybrid | identified | hypothesis | 2026-11-10 | bitget-wallet-card (validated) |
| bitpanda-affiliate | bitpanda | hybrid | identified | unknown | 2026-11-10 | bitpanda-card (published) |
| bleap-ambassador | bleap | unknown | identified | unknown | 2026-11-05 | bleap-card (validated) |
| bybit-affiliate | bybit | revenue_share | terms_verified | verified | 2026-11-10 | bybit-card-eu (validated) |
| coca-referral | coca | personal_referral | identified | verified | 2026-11-04 | coca-card (published) |
| coinbase-affiliate | coinbase | revenue_share | identified | verified | 2026-11-17 | coinbase-card (needs_review) |
| crypto-com-affiliate | crypto-com | hybrid | terms_verified | verified | 2026-11-10 | crypto-com-visa-card (validated), crypto-com-visa-credit-card-us (published) |
| ether-fi-affiliate | ether-fi | hybrid | accepted | verified | 2026-11-17 | ether-fi-cash (published) |
| exactly-referral | exactly | personal_referral | identified | verified | 2026-11-11 | exa-card (needs_review) |
| gemini-affiliate | gemini | cpa | identified | verified | 2026-11-17 | gemini-credit-card (published) |
| gnosis-pay-referral | gnosis-pay | unknown | not_applicable | unknown | 2026-11-10 | — |
| jupiter-referral | jupiter | personal_referral | identified | verified | 2026-11-11 | jupiter-global-card (needs_review) |
| kast-referral | kast | publisher_affiliate | identified | verified | 2026-11-17 | kast-card (needs_review) |
| kraken-affiliate | kraken | hybrid | identified | verified | 2026-11-04 | krak-card (validated) |
| kripicard-affiliate | kripicard | unknown | identified | unknown | 2026-11-16 | kripicard (validated) |
| kucoin-affiliate | kucoin | revenue_share | identified | hypothesis | 2026-11-16 | kucard (validated) |
| nexo-affiliate | nexo | revenue_share | terms_verified | verified | 2026-11-10 | nexo-card (published) |
| okx-affiliate | okx | revenue_share | terms_verified | verified | 2026-11-16 | okx-card (validated) |
| oobit-referral | oobit | personal_referral | identified | contradictory | 2026-11-06 | oobit-crypto-card (validated) |
| plasma-one-referral | plasma | personal_referral | accepted | contradictory | 2026-11-03 | plasma-one-card (published) |
| redotpay-affiliate | redotpay | hybrid | terms_verified | hypothesis | 2026-11-17 | redotpay-card (published) |
| revolut-affiliate | revolut | publisher_affiliate | identified | unknown | 2026-11-13 | revolut-crypto-card (needs_review) |
| solcard-referral | solcard | revenue_share | identified | verified | 2026-11-10 | solcard (published) |
| tria-ambassador | tria | hybrid | identified | hypothesis | 2026-11-09 | tria-card (validated) |
| tuyo-ambassador | tuyo | personal_referral | identified | hypothesis | 2026-11-12 | tuyo-card (validated) |
| uphold-affiliate | uphold | publisher_affiliate | identified | unknown | 2026-11-17 | uphold-card (validated) |
| wirex-referral | wirex | publisher_affiliate | identified | contradictory | 2026-11-10 | wirex-card (published) |
| xapo-bank-referral | xapo-bank | personal_referral | identified | verified | 2026-11-10 | xapo-bank-card (validated) |

Monetised links live (status `accepted`, URL present): ether-fi-cash, plasma-one-card. All other cards route to the official site, labelled "not an affiliate link".

Cards without any programme record: avalanche-card (validated — no referral or affiliate page found, searched 2026-11-09 and 2026-11-10), xplace-card (validated — none found, 2026-11-06 and 2026-11-10), utorg-card (validated — none found on utorg.com/utorg.pro, searched 2026-11-16 (research run) and 2026-11-17; only a single athlete ambassador), gnosis-pay-card (published — direct programme ended), metamask-card (needs_review — out of scope for the run).

## Programmes that pay on card activity (relevant to a card comparator)

ether.fi (accepted, live; official Affiliate Program Terms effective 2026-04-23 read on 2026-11-17 — paid ads need authorisation, 90-day link window, > $1 monthly threshold), RedotPay (terms_verified; card-order commission + payment commission + 10 % secondary, rates still only in images), KAST (identified 2026-11-17: an approval-based Affiliate Program now exists under official terms effective 2026-05-08; rates on product pages after approval; the personal Referral Program pays $50 + $50 on $600 / +$1,000 spend milestones within 45 days, $100 Premium / $1,000 Private), Bitget Wallet (identified: 2–5 USDT per first card payment, 20–50 % physical-card activation, 0.10–0.30 % of card spend), Tria (identified, commission base undefined), Nexo (card transactions commissionable, rate unpublished), Plasma One (personal referral, live), Solcard, Xapo Bank, Exactly, Jupiter, Tuyo (personal referral records, see matrix). Crypto.com, Bybit, Coinbase (50 % of trading fees for 3 months; EU/EEA MiFID traffic "different commission structures" by arrangement), Kraken, KuCoin, OKX pay on trading activity, not on cards. Gemini pays $25 per trading account and explicitly excludes marketing affiliates from its credit-card referral offer. Uphold's personal Referral Program (US/LatAm only, "Not available in Europe") pays on funding + conversion, not on the card; its Affiliate Program page is still unreadable to the fetcher. Wirex's publisher programme (Impact) pays "up to $50 per customer" per the 2023 launch post — current figures not public.

## Run log

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
