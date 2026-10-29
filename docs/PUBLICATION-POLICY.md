# Publication policy (rule-based, versioned)

Policy version 1.0.0 — 2026-10-28. Applies to humans and unattended runs alike.

## States
candidate → validated → published, with needs_review, stale, rejected, retired as exits. Only `published` records appear in the public build. `data/demo/` never publishes.

## A record may become `published` only when ALL of these hold
1. Two independent reads of the official sources, at least 24 hours apart, agree on every material value: eligibility wording / country list, each fee the calculator uses (subscription, fx, atm_withdrawal, topup), each reward (rate, cap, conditions, payout asset, dates), KYC stage, issuer, product status.
2. Every evidence entry is an official source (`official_terms`, `pricing_page`, `eligibility_page`, `issuer_doc`, `help_center`, `affiliate_program`) or an official `reference` (e.g. a central bank's member list used only to expand a stated scope). No `third_party`, no `demo`.
3. `product_status` is `active` or `waitlist`.
4. The validator passes (`npm run validate`) — it enforces: unknown never modelled as free, promo dates present, credit products carry credit terms, affiliate URL only with confirmed access.
5. Contradictions between official pages are allowed only if the record models the governing value and states the contradiction in `contradiction_note` (shown on the card page). Governing value: the dedicated, dated fee schedule or terms document beats a marketing/landing page; when neither is dated or dedicated, the value least favourable to the user is modelled.
6. A page that returns an empty shell to the fetcher is *unreadable*, not *unchanged*: it does not count as a read, and it does not trigger `needs_review` by itself. Such records carry `needs_browser_read` in the research list and wait for a session with a browser.

## What unattended runs may do without a human
- Add `validated` records (never published) — merged automatically when CI is green.
- Publish a record that meets rules 1–5 — merged automatically when CI is green.
- Mark promotions/evidence `stale` on their published end date.
- Update the discovery list.
- Downgrade: set `needs_review` when a re-read differs; set `stale` when a source is unreachable twice.

## What always needs David
- Any `needs_review` record (material difference between reads).
- Any change of issuer, product status to suspended/closed, or a new regulatory statement.
- Any affiliate application, contract, payout destination, or outreach.
- Any spend, any new integration, any change to this policy.
- Deleting or rewriting a published value (runs may only downgrade, never overwrite).

## Freshness (per field type; re-read cadence for published records)
| Field type | Volatility | Re-read every | On failure to read |
|---|---|---|---|
| promotional rewards | high | expiry date (no read) + 14 days | keep, mark stale at expiry |
| base rewards, caps | medium | 30 days | mark stale after 2 failures |
| fees | medium | 30 days | mark stale after 2 failures |
| eligibility lists, KYC | low | 60 days | mark stale after 2 failures |
| issuer, product status | low | 90 days, or on any news | needs_review |
A `stale` value is shown as stale on the card page and excluded from the calculator; the card stays listed but drops below cards with current data in any sort.

## Auto-merge rule (GitHub)
Pull requests from branches `agent/*` carrying the label `auto-merge` are merged by `.github/workflows/auto-merge.yml` when the CI workflow succeeds. Any other PR waits for a human. Disabling the workflow stops all automatic merges.
