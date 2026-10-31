# Resume state

Updated: 2026-10-31 19:30 (Europe/Berlin). Keep this file short; it is the hand-off between sessions.

## Environment (verified 2026-10-26)
- Claude cloud workspace (Linux), Node 22.23.4, npm 10.9.9, Python 3.13, git 2.43. Files/shell/web search/web fetch available.
- Shell network: npm registry and GitHub only (allowlist). Other sites unreachable from the shell; WebFetch works for public pages.
- Playwright 1.63 + Chromium ARE available in the cloud workspace (pre-installed under /opt/npm-tools; pinned as devDependency). `npm run ui-check` runs layout + interaction checks: 69/69 on 2026-10-27.
- David's Mac is linked; folder ~/webdev connected; project copied to ~/webdev/cryptoscanner (npm install, validate, test pass there; `astro build` fails there only because file deletion is disabled in connected folders). Built-in browser pane is signed in to claude.ai and can open the preview artifact (navigation shim in launcher.html); native <select> menus do not respond to the pane's clicks/keys, so interaction tests run in headless Chromium instead.
- GitHub: adx-ops/cryptoscanner (PUBLIC — David's choice; switching to private is one click in Settings → Danger Zone), main pushed 2026-10-28. CI workflow ran green on GitHub (run 40680995442). Expire-promos workflow scheduled daily 05:17 UTC, opens a PR when something expires — not yet fired. Scheduled tasks: none exist. Connectors: Google Drive connected; Gmail, Calendar not connected.
- Claude Projects "cryptoscanner": empty (no docs).

## Repository
- Path: /home/claude/cryptoscanner (cloud workspace) = origin https://github.com/adx-ops/cryptoscanner, branch main.
- See `git log`. Preview artifact (demo dataset) published and republished with the dark theme.

## Done with proof (2026-10-26)
- Schema 1.0.0 for cards and affiliate programmes; validator with business rules → `npm run validate`: 2 records, 0 errors.
- Calculator engine 1.0.0 → `npm test`: 13/13 passing (country verdicts, caps, dated promo in 12-month projection, paid tier gating, token without price, unknown costs → partial, suspended product, rounding, determinism).
- Astro static site, 9 pages → `npm run build`: Complete; `npm run check`: 0 errors. Demo build carries noindex + banner.

## Feature status
| Feature | Status | Proof |
|---|---|---|
| Data schema + validation | tested | `npm run validate` output |
| Calculator engine | tested; reward caps can be stated on spend (`cap.basis: spend`, 2026-10-31) | `npm test` 18/18 |
| Home: country select, filters, sort, compare selection | tested | ui-check 69/69, docs/screenshots |
| /compare side-by-side (2–3 cards, slugs in URL) | tested | ui-check |
| /cards/[slug] with sources, statuses, changelog | tested | ui-check |
| /calculator (client-side engine) | tested | ui-check + engine tests |
| /methodology, /how-we-make-money, /legal, /contact | implemented | build only |
| Mobile rendering 360–1440 | verified | ui-check: no horizontal overflow on 8 pages × 5 widths; screenshots |
| Verified card records | 3 `published` (Bitpanda, Gnosis Pay, Nexo), 5 `validated` (Crypto.com EEA — spend caps + fees from the Europe fee schedule since PR #6, Bybit EU, RedotPay, Wirex EEA, MetaMask), 2 `needs_review` (KAST 2026-10-30; Coinbase 2026-10-31, KYC article differs between reads) | `npm run validate` 12 records 0 errors; verified build = 3 card pages |
| Visual identity v2 (ink & brass, card faces, self-hosted Archivo) | tested | ui-check 74/74 on 2026-10-30; screenshots in docs/screenshots |
| Official logos with provenance | 8 providers recorded (data/logos/manifest.json, public/logos/*.svg), validator enforces source+date | `npm run validate` |
| Candidates list (discovery) | seeded: 55 entries with priority formula | data/candidates.json |
| Agent run prompts + publication policy | written | agents/*.md, docs/PUBLICATION-POLICY.md |
| Auto-merge of agent PRs | ACTIVE — PR #1 and #2 merged automatically 2026-10-29 after green CI | .github/workflows/auto-merge.yml; now also triggers deploy + CI on main |
| GitHub Pages deploy (verified build, noindex, base path /cryptoscanner) | active | run 40742521004 green; page fetched: title, noindex, 2 cards, links under /cryptoscanner/ |
| Affiliate matrix | 6 programmes recorded (3 terms_verified, 2 identified, 1 not_applicable), none applied | data/affiliate/*.json |
| Promotion expiry (date-based) | tested | scripts/expire-promos.ts, 4 tests, dry-run shows demo promo expiring 2027-01-01 |
| Graveyard page | tested | /graveyard, empty state, ui-check |
| Sitemap | implemented | @astrojs/sitemap only when PUBLIC_SITE_URL set and dataset=verified; verified with a test URL |
| Structured data, analytics | not started | — |

## Integrations
GitHub repo: active · CI: tested (green on GitHub, run 40735738785 incl. ui-check in Chromium) · scheduled expiry: configured · auto-merge: configured · Pages: ACTIVE — David enabled it 2026-10-28 19:10; manual run 40742521004 green; https://adx-ops.github.io/cryptoscanner/ serves the verified build (2 cards, noindex, links under /cryptoscanner/) — verified by fetch · scheduled Claude runs CREATED 2026-10-28 with David's explicit authorisation (permission mode auto): research trig_01K3xU7cbJTPcQDM5FsYDrJn (weekdays 06:41 Berlin, first run 2026-10-29), second-read trig_014y1sqpUccM2ArRRaAALQqe (daily 07:23), discovery trig_017W5QY5f3CRgK4Y1Vvvgybt (Mondays 05:49). Research run fired 2026-10-29 06:01 → PR #1 (Wirex validated, 4 no-KYC candidates blocked with reasons), auto-merged; second-read run fired 06:30 → PR #2 (Crypto.com reconfirmed, Nexo/Bybit needs_review), auto-merged; expire-promos scheduled run green. Status: ACTIVE. Known limits learned: gh token invalid in scheduled sessions (GitHub connector used), client-rendered help centres unreadable by the fetcher (needs_browser_read), fetch provenance requires search-first · analytics: planned · affiliate dashboards: none.

## Decisions awaited from David
1. (done 2026-10-28) three scheduled tasks created.
1b. (done 2026-10-28) GitHub Pages enabled by David; repo is public again (Pages on the free plan needs a public repo).
2. No paid services (confirmed 2026-10-27).
3. Publishing entity chosen 2026-10-27 (name in private project notes). Missing: country, legal form, registration, contact mailbox.
4. Priority launch country within Europe — assumed none (EEA-wide, DE/FR first for verification).
5. Notification channel for exceptions — assumed this chat.

## Next work (in order)
1. Browser second reads (needs_browser_read): Bybit EU card landing page https://www.bybit.eu/en-EU/cards/ (cashback, VIP, welcome, issuer — FAQ + fee schedule already re-read by the fetcher 2026-10-31), RedotPay fee image, Crypto.com help centre (fees + country list). Wirex: wirex.one (2026-10-30 browser visit) still advertises a 'Wirex Card / Debit Card' as principal Visa and Mastercard member — the EEA product pages must be re-read on wirex.one before publishing. KAST: needs_review since the 2026-10-30 second read (see Project doc claude/second-read-run-2026-10-30.md). Coinbase: needs_review since 2026-10-31 — research run to read the EU KYC article (id-doc-verification-eu). Crypto.com: second read of the Europe fee schedule (help.crypto.com/en/articles/5977463…) ≥ 2026-11-01, then still needs an official country list + KYC article.
1b. Logos: Coinbase and MetaMask marks not yet sourced (monogram fallback); fetch from their official pages in a browser session and record in data/logos/manifest.json.
2. New records: Wirex, Coinbase, MetaMask, Kraken (Krak), Deblock, Plutus — official sources only, validated → published after a second read.
3. Hosting: done (GitHub Pages, noindex). Next: move brief + internal affiliate scores out of the public repo if David wants; domain later.
4. Freshness policy document (per field type); founder dashboard (5 questions) as a static page built from data + CI state.
