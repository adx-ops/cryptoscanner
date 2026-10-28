# Resume state

Updated: 2026-10-28 12:40 (Europe/Berlin). Keep this file short; it is the hand-off between sessions.

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
| Calculator engine | tested | `npm test` 13/13 |
| Home: country select, filters, sort, compare selection | tested | ui-check 69/69, docs/screenshots |
| /compare side-by-side (2–3 cards, slugs in URL) | tested | ui-check |
| /cards/[slug] with sources, statuses, changelog | tested | ui-check |
| /calculator (client-side engine) | tested | ui-check + engine tests |
| /methodology, /how-we-make-money, /legal, /contact | implemented | build only |
| Mobile rendering 360–1440 | verified | ui-check: no horizontal overflow on 8 pages × 5 widths; screenshots |
| Verified card records | 2 `published` (Bitpanda, Gnosis Pay: two independent reads each), 3 `validated` (Crypto.com EEA, Nexo, Bybit EU) | `npm run validate` 7 records 0 errors; verified build = 2 card pages |
| Affiliate matrix | 6 programmes recorded (3 terms_verified, 2 identified, 1 not_applicable), none applied | data/affiliate/*.json |
| Promotion expiry (date-based) | tested | scripts/expire-promos.ts, 4 tests, dry-run shows demo promo expiring 2027-01-01 |
| Graveyard page | tested | /graveyard, empty state, ui-check |
| Sitemap | implemented | @astrojs/sitemap only when PUBLIC_SITE_URL set and dataset=verified; verified with a test URL |
| Structured data, analytics | not started | — |

## Integrations
GitHub repo: active · CI: tested (green run on GitHub) · scheduled expiry: configured (first scheduled run pending) · hosting: planned · analytics: planned · affiliate dashboards: none.

## Decisions awaited from David
1. (done) GitHub repo created — public; consider private.
2. Budget: 0 € confirmed (2026-10-27).
3. Publishing entity: EOTM (2026-10-27). Missing: country, legal form, registration, contact mailbox.
4. Priority launch country within Europe — assumed none (EEA-wide, DE/FR first for verification).
5. Notification channel for exceptions — assumed this chat.

## Next work (in order)
1. Second reads for Crypto.com EEA (needs help-centre fees + country list), Nexo, Bybit EU (rewards/VIP page) → `published`.
2. New records: Wirex, Coinbase, MetaMask, Kraken (Krak), Deblock, Plutus — official sources only, validated → published after a second read.
3. Hosting: GitHub Pages (free) for a noindex preview on a github.io subdomain, or wait for a domain. Decision needed from David before anything public.
4. Freshness policy document (per field type); founder dashboard (5 questions) as a static page built from data + CI state.
