# Resume state

Updated: 2026-10-26 20:50 (Europe/Berlin). Keep this file short; it is the hand-off between sessions.

## Environment (verified 2026-10-26)
- Claude cloud workspace (Linux), Node 22.23.4, npm 10.9.9, Python 3.13, git 2.43. Files/shell/web search/web fetch available.
- Shell network: npm registry and GitHub only (allowlist). Other sites unreachable from the shell; WebFetch works for public pages.
- No headless browser in the workspace (Playwright CDN blocked) → layout checks at 360/390/430/768/1440 px NOT done yet.
- David's Mac (macOS arm64, Claude desktop app) is linked to the session; no folder connected yet. Built-in browser available on the Mac; it can open a server running on the Mac, not one in the cloud workspace.
- GitHub: no repository attached (list_repos empty). Scheduled tasks: none exist. Connectors: Google Drive connected; Gmail, Calendar not connected.
- Claude Projects "cryptoscanner": empty (no docs).

## Repository
- Path: /home/claude/cryptoscanner (cloud workspace). Git initialised; first commit pending at the time of writing (see git log).
- Uncommitted changes: none after commit.

## Done with proof (2026-10-26)
- Schema 1.0.0 for cards and affiliate programmes; validator with business rules → `npm run validate`: 2 records, 0 errors.
- Calculator engine 1.0.0 → `npm test`: 13/13 passing (country verdicts, caps, dated promo in 12-month projection, paid tier gating, token without price, unknown costs → partial, suspended product, rounding, determinism).
- Astro static site, 9 pages → `npm run build`: Complete; `npm run check`: 0 errors. Demo build carries noindex + banner.

## Feature status
| Feature | Status | Proof |
|---|---|---|
| Data schema + validation | tested | `npm run validate` output |
| Calculator engine | tested | `npm test` 13/13 |
| Home: country select, filters, sort, compare selection | implemented | build only; interactions not browser-tested |
| /compare side-by-side (2–3 cards, slugs in URL) | implemented | build only |
| /cards/[slug] with sources, statuses, changelog | implemented | build only |
| /calculator (client-side engine) | implemented | build only |
| /methodology, /how-we-make-money, /legal, /contact | implemented | build only |
| Mobile rendering 360–1440 | blocked in workspace | needs a browser (Mac) |
| Verified card records | not started | 0 of 15 target |
| Affiliate matrix | not started (schema ready) | — |
| Sitemap, structured data, analytics | not started | — |

## Integrations
GitHub repo: planned · hosting: planned · scheduled tasks: planned · analytics: planned · affiliate dashboards: none.

## Decisions awaited from David
1. Folder on the Mac to receive the project (proposed: ~/webdev/cryptoscanner) so the site can be run and browser-tested there.
2. Initial/monthly spend ceiling (tools, hosting, ads) — assumed €0 until stated.
3. Publishing entity (ADX or a new one) and its country — assumed none.
4. Priority launch country within Europe — assumed none (EEA-wide, DE/FR first for verification).
5. Notification channel for exceptions — assumed this chat.

## Next work (in order)
1. Push the repo to the Mac (or GitHub) and run the five-width layout + interaction check in the built-in browser; fix what breaks.
2. Research & verify the first 3 real card records from official sources (eligibility, KYC, fees, rewards, evidence with dates) → `data/cards/`, record_status validated → published only after a second read.
3. Affiliate matrix: identify programmes for those 3 providers, statuses `identified`/`terms_verified`, no application sent.
4. Freshness policy + `scripts/expire-promos.ts` (date-based expiry without re-reading pages) + sitemap.
