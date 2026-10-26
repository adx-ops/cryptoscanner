# CLAUDE.md — CryptoScanner

Read first: `docs/RESUME-STATE.md` (where we are), then `docs/DECISIONS.md`. The full brief is `docs/BRIEF-2026-10-26.txt`; do not paste it into agents.

Rules that override convenience:
- Unknown is never zero, free, available, no-KYC or risk-free. The schema and `scripts/validate-data.ts` enforce this; keep them that way.
- Only `data/cards/*.json` with `record_status: published` and official-source evidence may reach a public build. Demo data stays under `data/demo/`.
- Commissions never touch ranking. Affiliate data lives in `data/affiliate/`, never in card records beyond `links.affiliate`.
- Never fabricate: figures, sources, referral codes, testimonials, traffic, commissions.
- Before claiming built/tested/deployed/automated: show the command and its output.
- Commands: `npm run validate`, `npm test`, `npm run check`, `npm run build` must all pass before a commit.
- Public site in English; talk to the founder in French.
