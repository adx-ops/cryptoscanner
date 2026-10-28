# Research run — standalone instructions for a scheduled Claude session

You are working on CryptoScanner, an independent crypto-card comparator (repo adx-ops/cryptoscanner). You start with no memory of previous sessions. Everything you need is in the repository.

## Setup (do all, in order)
1. Attach the repository with push access: call `add_repo` with owner `adx-ops`, repo `cryptoscanner`, access `push`, then clone it as the tool instructs and call `register_repo_root`.
2. Read `CLAUDE.md`, `docs/PUBLICATION-POLICY.md`, `data/schema/card.schema.json`, one existing record such as `data/cards/gnosis-pay-card.json` (as a worked example), `data/research-list.json` and `data/candidates.json`.
3. Run `npm ci` then `npm run validate` and `npm test`; if either fails, stop and report — do not "fix" data to make them pass.

## Task
Pick the **two** highest-priority candidates that have no record yet (`data/candidates.json`, field `priority`, skip entries with `status` other than `identified`; skip any provider that already has a file in `data/cards/`). For each candidate, in ≤ 25 tool calls:
- Find the provider's **official** pages only: product page, fee schedule / pricing, eligibility or supported-countries page, help-centre KYC article, affiliate/partner page. Use WebSearch to find them, WebFetch to read them. Competitor comparison sites are discovery only and must never be cited as evidence.
- Write `data/cards/<slug>.json` following the schema exactly, with `record_status: "validated"`, `is_demo: false`, one evidence entry per page read (URL, title, short probative excerpt ≤ 400 chars, accessed_at = now in UTC, scope). Every fee the calculator needs (subscription, fx, atm_withdrawal, topup) must be present: a fee you could not establish is `kind: "unknown", status: "unknown"` — never "none". Eligibility: list countries only when the provider names them; otherwise leave the list empty with `default_for_unlisted: "to_confirm"` and explain in `usage_note`. Record contradictions between official pages in `contradiction_note` instead of resolving them.
- Write `data/affiliate/<provider>-<type>.json` from the official affiliate/referral page if one exists (status `identified` or `terms_verified`), or note in the research list that none was found. Never apply, never contact anyone.
- Update the candidate's entry in `data/research-list.json` (status `validated`, record path, one-line note) and `data/candidates.json` (`status: "validated"`).
If a candidate cannot be documented from official sources (no fee page, issuer undisclosed, product status unclear), do NOT write a record: set its status to `blocked` with the reason, and move to the next candidate (max 4 attempts per run).

## Checks and hand-off
4. Run `npm run validate`, `npm test`, `npm run check`, `npm run build` — all must pass.
5. Create a branch `agent/research-<YYYYMMDD-HHMM>`, commit with a message listing the records added/blocked, push, and open a pull request with `gh pr create --label automated --label auto-merge --title "Research run <date>: <providers>" --body "<what was read, what is unknown, contradictions, anything needing a human>"`. Do not merge it yourself.
6. Finish with a short report: records written (with their main unknowns), candidates blocked and why, and anything that needs David's decision. No invented figures anywhere.
