# Agents and automations

Two different things (brief §13):

**A. Build-time help** — what Claude does *during a working session* with David (research, code, checks). Nothing here runs by itself.

**B. Unattended runs** — scheduled Claude sessions (claude.ai scheduled tasks, no extra cost) that start fresh, attach the GitHub repo, follow one prompt file below, and leave a pull request. GitHub Actions (free) then validates, and merges automatically only when the rule-based conditions in `docs/PUBLICATION-POLICY.md` hold. A run is "active" only once a real scheduled firing has produced a PR (see `docs/RESUME-STATE.md` → Integrations).

| Run | Prompt file | Cadence | Output | Autonomy class |
|---|---|---|---|---|
| Discovery | `agents/discovery-run.md` | weekly | updates `data/candidates.json` (names, cross-listing count, affiliate hint); no card records | automatic (reversible data, no publication) |
| Research | `agents/research-run.md` | daily, 2 candidates per run | new `data/cards/*.json` with `record_status: validated`, affiliate entry, PR on `agent/research-<date>` | automatic under conditions (PR auto-merges when CI is green; nothing is published) |
| Second read | `agents/second-read-run.md` | daily | re-reads validated records ≥ 24 h old; publishes only when every material value is confirmed; otherwise `needs_review` | automatic under conditions (publication policy) |
| Expire promotions | `.github/workflows/expire-promos.yml` (no model) | daily 05:17 UTC | PR marking ended promotions stale | automatic |
| Deploy | `.github/workflows/deploy-pages.yml` (no model) | on merge to main | verified build to GitHub Pages | automatic (noindex until a domain exists) |

Hard limits every run obeys: official sources only; never invent a figure; unknown stays unknown; no affiliate URL without confirmed access; no outreach, no applications, no contracts; max 2 concurrent runs; stop at the step budget; report what was done, what is unknown and what needs a human.

Kill switch: disable the scheduled task in claude.ai (Scheduled tasks) and/or disable the workflow in GitHub → Actions. Rollback: revert the merge commit (`git revert -m 1 <sha>`); the site is rebuilt from `main`.
