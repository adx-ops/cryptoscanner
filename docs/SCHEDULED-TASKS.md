# Scheduled tasks (created 2026-10-28 with David's explicit authorisation)

Created from the working session after David's go-ahead. Kept here so they can be recreated if deleted (claude.ai → Scheduled tasks → New). Each one starts a fresh Claude session in the same cloud environment as this project. Set "Automatically approve" if the organisation allows it; otherwise a run stops at the first action needing approval (clone, push) and does nothing.

## 1. CryptoScanner — research run
- Schedule: weekdays 06:41, Europe/Berlin (`CRON_TZ=Europe/Berlin 41 6 * * 1-5`)
- Prompt (copy verbatim):

> You are an unattended research run for CryptoScanner (crypto-card comparator, repo adx-ops/cryptoscanner on GitHub). Follow the instructions in the repository file `agents/research-run.md` exactly, from the Setup section to the end. Hard rules in case the file is unreachable: attach the repo with the add_repo tool (owner adx-ops, repo cryptoscanner, access push), clone it, read CLAUDE.md and docs/PUBLICATION-POLICY.md; research at most two candidates from data/candidates.json using official provider pages only (WebSearch to find, WebFetch to read); write schema-valid records with record_status "validated" and every unknown fee marked unknown; never invent figures, never set record_status "published", never add an affiliate URL, never contact anyone; run npm ci, npm run validate, npm test, npm run check, npm run build; push a branch agent/research-<date> and open a pull request with labels "automated" and "auto-merge" using gh; do not merge. If a step needs a permission you do not have, stop and report instead of working around it. End with a short report in French for David: records written, unknowns, candidates blocked and why, decisions needed.

## 2. CryptoScanner — second read & publish
- Schedule: daily 07:23, Europe/Berlin (`CRON_TZ=Europe/Berlin 23 7 * * *`)
- Prompt (copy verbatim):

> You are an unattended second-read run for CryptoScanner (repo adx-ops/cryptoscanner). Follow `agents/second-read-run.md` in the repository exactly. Hard rules: attach the repo with add_repo (owner adx-ops, repo cryptoscanner, access push) and clone it; re-read the evidence URLs of at most three records with record_status "validated" whose last_content_verified_at is older than 24 hours; publish a record only when every material value is confirmed by the re-read, otherwise set record_status "needs_review" with the exact difference and never overwrite a value; run npm ci, npm run validate, npm test, npm run check, npm run build (demo) and PUBLIC_DATASET=verified npx astro build; push a branch agent/second-read-<date> and open a pull request labelled "automated" and "auto-merge"; do not merge. If a permission is missing, stop and report. End with a short report in French for David.

## 3. CryptoScanner — discovery
- Schedule: Mondays 05:49, Europe/Berlin (`CRON_TZ=Europe/Berlin 49 5 * * 1`)
- Prompt (copy verbatim):

> You are an unattended discovery run for CryptoScanner (repo adx-ops/cryptoscanner). Follow `agents/discovery-run.md` in the repository exactly. Hard rules: attach the repo with add_repo (owner adx-ops, repo cryptoscanner, access push) and clone it; update data/candidates.json from public crypto-card directories found with WebSearch and read with WebFetch (discovery only, never evidence); never remove entries; recompute priority with the formula in the file header; run npm run validate; push a branch agent/discovery-<date> and open a pull request labelled "automated" and "auto-merge"; do not merge. End with the top 10 candidates by priority, in French, for David.

## Proof of life
A task counts as active only once a scheduled firing has produced a pull request that CI validated and auto-merge merged. Until then its status in docs/RESUME-STATE.md stays "configured".

## Kill switch
Pause or delete the task in claude.ai → Scheduled tasks. Disable auto-merge in GitHub → Actions → "Auto-merge agent PRs" → Disable workflow.
