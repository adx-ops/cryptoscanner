# Discovery run — standalone instructions for a scheduled Claude session

You are working on CryptoScanner (repo adx-ops/cryptoscanner). Setup: `add_repo` (owner adx-ops, repo cryptoscanner, access push) → clone → `register_repo_root` → read `CLAUDE.md` and `data/candidates.json`.

## Task (≤ 40 tool calls)
Goal: keep `data/candidates.json` current. It is a discovery list, never evidence.
1. Use WebSearch to find current public directories/lists of crypto cards (for example "crypto card comparison 2026", "best crypto cards Europe", "no-KYC crypto card list") and read 3–5 of them with WebFetch, extracting card names and providers.
2. For each card seen, upsert an entry: `{ "provider", "product", "slug", "seen_in": [source URLs], "cross_listing_count": n, "no_kyc_claim": bool, "affiliate_hint": "publisher programme | referral only | none seen | unknown", "status": "identified|validated|published|blocked|rejected", "priority": number, "first_seen", "last_seen" }`. Increase `cross_listing_count` only for new distinct sources. Never remove an entry; set `status: "rejected"` with a reason only if the product is clearly closed or out of scope (not a payment card).
3. Recompute `priority` with the documented formula in the file header (cross-listing count ×2, +3 if an official publisher affiliate programme is known, +1 if a referral programme is known, +1 if a no-KYC-initial claim exists AND the operator is named, −5 if the issuer/operator is undisclosed). Existing validated/published entries keep priority 0.
4. Run `npm run validate` (must still pass). Branch `agent/discovery-<YYYYMMDD>`, commit, push, `gh pr create --label automated --label auto-merge --title "Discovery <date>: <n> new candidates"`. Report the top 10 candidates by priority and any provider that looks closed.
