# Affiliate status

Maintained by the unattended affiliate run (prompt: scheduled task "affiliate run"; the prompt file `agents/affiliate-run.md` does not exist yet — the run follows the hard rules embedded in the task). Source of truth is `data/affiliate/*.json`; this page is a derived summary. Commissions never touch ranking (CLAUDE.md). The run never applies, never creates accounts, never contacts anyone, never accepts terms, never invents codes or links, never changes `our_status`.

Last run: 2026-11-10 (branch `agent/affiliate-2026-11-10`).

## Matrix

| Programme | Provider | Type | our_status | Commission status | Last official read | Linked card(s) |
|---|---|---|---|---|---|---|
| bitget-wallet-affiliate | bitget-wallet | hybrid | identified | hypothesis | 2026-11-10 | bitget-wallet-card (validated) |
| bitpanda-affiliate | bitpanda | hybrid | identified | unknown | 2026-11-10 | bitpanda-card (published) |
| bleap-ambassador | bleap | unknown | identified | unknown | 2026-11-05 | bleap-card (validated) |
| bybit-affiliate | bybit | revenue_share | terms_verified | verified | 2026-11-10 | bybit-card-eu (validated) |
| coca-referral | coca | personal_referral | identified | verified | 2026-11-04 | coca-card (published) |
| coinbase-affiliate | coinbase | revenue_share | identified | verified | 2026-10-30 | coinbase-card (needs_review) |
| crypto-com-affiliate | crypto-com | hybrid | terms_verified | verified | 2026-11-10 | crypto-com-visa-card (validated) |
| ether-fi-affiliate | ether-fi | hybrid | accepted | verified | 2026-11-02 | ether-fi-cash (published) |
| gemini-affiliate | gemini | cpa | identified | verified | 2026-11-02 | gemini-credit-card (published) |
| gnosis-pay-referral | gnosis-pay | unknown | not_applicable | unknown | 2026-11-10 | — (direct programme ended 2025-04-22) |
| kast-referral | kast | personal_referral | identified | unknown | 2026-10-28 | kast-card (needs_review) |
| kraken-affiliate | kraken | hybrid | identified | verified | 2026-11-04 | krak-card (validated) |
| nexo-affiliate | nexo | revenue_share | terms_verified | verified | 2026-11-10 | nexo-card (published) |
| oobit-referral | oobit | personal_referral | identified | contradictory | 2026-11-06 | oobit-crypto-card (validated) |
| plasma-one-referral | plasma | personal_referral | accepted | contradictory | 2026-11-03 | plasma-one-card (published) |
| redotpay-affiliate | redotpay | hybrid | terms_verified | hypothesis | 2026-10-28 | redotpay-card (published) |
| tria-ambassador | tria | hybrid | identified | hypothesis | 2026-11-09 | tria-card (validated) |
| wirex-referral | wirex | publisher_affiliate | identified | contradictory | 2026-11-10 | wirex-card (published) |

Monetised links live (status `accepted`, URL present): ether-fi-cash, plasma-one-card. All other cards route to the official site, labelled "not an affiliate link".

Cards without any programme record: avalanche-card (validated — no referral or affiliate page found, searched 2026-11-09 and 2026-11-10), xplace-card (validated — none found, 2026-11-06 and 2026-11-10), gnosis-pay-card (published — direct programme ended), metamask-card (needs_review — out of scope for the run).

## Programmes that pay on card activity (relevant to a card comparator)

ether.fi (accepted, live), Bitget Wallet (identified 2026-11-10: 2–5 USDT per first card payment, 20–50 % physical-card activation, 0.10–0.30 % of card spend), Tria (identified, commission base undefined), Nexo (card transactions commissionable, rate unpublished), RedotPay (terms_verified), Plasma One (personal referral, live). Crypto.com, Bybit, Coinbase and Kraken pay on trading activity, not on cards. Wirex's publisher programme (Impact) pays "up to $50 per customer" per the 2023 launch post, including debit-card transactions — current figures not public.

## Run log

### 2026-11-10
- Re-read (search-first, official pages) of the six programmes whose evidence dated from 2026-10-26: Bitpanda, Bybit, Crypto.com, Gnosis Pay, Nexo, Wirex. Bybit, Crypto.com, Nexo, Gnosis Pay: every recorded value confirmed, evidence dated. Bitpanda: programme page now at `/en/affiliate-programme`; the official Terms & Conditions for Affiliates (updated May 2024) read for the first time — contractual framework recorded, rates still only inside Impact, Annex I (permitted territories incl. a "Bitpanda Card" column) not extracted by the fetcher. Wirex: the help centre documents a publisher Affiliates Program on Impact open to individuals and businesses (type changed from personal_referral to publisher_affiliate; commission figures not public; `our_status` unchanged).
- New: `data/affiliate/bitget-wallet-affiliate.json` (identified) from the official Bitget Wallet Affiliate Program article; bitget-wallet-card linked.
- Card records bitpanda-card and crypto-com-visa-card now reference their existing programme records (metadata only; no URL, outbound links unchanged).
- Not done: the two live affiliate URLs (ether.fi `/@6fe89e3c`, plasma.org `/download/RPQNUY`) could not be fetched by the unattended fetcher (provenance rule — URLs not surfaced by search); their resolution was NOT verified this run. `npm run affiliate-status` does not exist in package.json; this file was written by hand from the data.
