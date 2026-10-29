# Second-read run — standalone instructions for a scheduled Claude session

You are working on CryptoScanner (repo adx-ops/cryptoscanner). You start with no memory. Setup: `add_repo` (owner adx-ops, repo cryptoscanner, access push) → clone → `register_repo_root` → read `CLAUDE.md` and `docs/PUBLICATION-POLICY.md` → `npm ci && npm run validate && npm test` (stop and report if they fail).

## Task
For every `data/cards/*.json` with `record_status: "validated"` whose `freshness.last_content_verified_at` is more than 24 hours old (process at most 3 per run, oldest first):
1. Re-read every evidence URL in the record with WebFetch, asking it to report the exact figures for: eligibility wording / country list, each fee, each reward (rate, cap, conditions, payout asset, dates), KYC requirements, issuer, product status.
2. Compare with the record field by field.
   - **All material values confirmed** (fees, rewards, eligibility, KYC stage, issuer, status): set `record_status: "published"`, set `freshness.last_content_verified_at` to now, update `accessed_at` on the re-read evidence, append a changelog entry `{"field":"record_status","from":"validated","to":"published","reason":"Second independent read on <date>: all material values confirmed.","actor":"second-read-run"}`.
   - **Any material value differs or a page is unreachable**: do not publish. Set `record_status: "needs_review"`, append a changelog entry describing exactly which field differs (old vs new, with the URL) and keep the old value in place. Never overwrite a verified value with a new one in this run.
   - Pages that contradict themselves stay recorded as `contradictory` with the note; that alone does not block publication if the record already models the conservative value and says so.
3. Update `data/research-list.json` statuses accordingly.

## Checks and hand-off
Run `npm run validate`, `npm test`, `npm run check`, `npm run build` (both `PUBLIC_DATASET=demo` default and `PUBLIC_DATASET=verified npx astro build`). Branch `agent/second-read-<YYYYMMDD-HHMM>`, commit, push, `gh pr create --label automated --label auto-merge --title "Second read <date>: <slugs>" --body "<per record: published / needs_review and why>"`. Do not merge. Report: what got published, what needs review and the exact differences, anything needing David.

## Known environment limits (learned from the first runs)
- If `gh` reports an invalid token, open the pull request and add labels through the GitHub connector tools; say so in the report.
- A client-rendered page that returns an empty shell is "unreadable", not "unchanged": keep the record `validated`, add `"needs_browser_read": true` to its entry in `data/research-list.json`, and list the URLs in the report. Use `needs_review` only when a value actually differs between reads.
- WebFetch only accepts URLs that appeared in the conversation through WebSearch or a previous WebFetch; a URL copied from a repository file triggers a permission request that nobody answers in an unattended run. Always reach a stored evidence URL by first running a WebSearch restricted to its domain (e.g. `site:help.gnosispay.com fees`) and fetching the URL the search returns.
