# Competitor benchmark (text extraction only, 2026-10-26)

Method: pages read with a text fetcher; mobile rendering NOT audited; no traffic figures (none available without a paid tool, none invented). Competitors are discovery sources, never data sources.

| Site | What it is | Listing | Filters | Freshness / sources shown | Monetisation signals | Notes |
|---|---|---|---|---|---|---|
| todey.xyz | Directory of crypto payments ("intelligence layer"): cards, stablecoins, neobanks, QR, infra. 467 "projects tracked". | Homepage has no card list; cards page not fetchable (client error). Tools: card comparison, "smart card finder", tier-list maker, world map. "Top picks" by category (overall, cashback, free, travel, USA, EU…). | Search with category dropdown. | None visible on homepage. | No affiliate disclosure visible on homepage; "Claim project" portal for issuers; user reviews (0 reviews shown). | Broad scope, bold dark uppercase style. Model looks listing/portal-driven rather than purely affiliate. |
| cryptocardhub.com | Card directory, 121 cards, numeric score. | Featured editorial pick + summary cards (logo, network, availability, score) + A–Z + country index (incl. US states). | Network, custody, KYC level (none/limited/full), material, top-up assets, mobile pay, no annual fee, cashback. | No per-card date or source; general "official sources, regularly updated"; editorial policy page. | "Get [card]" links via tracked path; commission disclosure; sponsor banners for a sister product. | Score scale and weighting not explained on the list page. |
| opencryptocards.com | Comparator, ~86 cards, "compare up to 4", Match, Graveyard (dead cards). | Logo/name/issuer grid; collections (metal, high-limit, self-custodial, cashback, Europe, US, mobile wallets, travel, staking). | Collections and debit/credit split. | "Data updated regularly", no date, no sources. | Footer: affiliate links may earn commission; crowdfunding link. | Simplest UX; reference for clarity per the brief. Graveyard is a good idea (we have product_status + retired). |

## What nobody shows (our opening)
- A per-value verification status and a dated source excerpt.
- Availability judged on published residence rules per variant, with "to confirm" as an explicit state.
- Base reward separated from conditional maximum, promotion and sign-up bonus.
- A deterministic net-value calculator that refuses to print a full net figure when costs are unknown.
- A ranking without an opaque score.

## What they do that we should borrow
- Collections / "best for" entry points (free, no initial KYC, self-custodial, travel) — only once enough verified records exist (brief §9).
- A "graveyard" of closed cards (we already keep retired/closed statuses; a page can list them).
- Country index pages — only for countries with real verified availability data.
- Match / finder flow — our country → need → selection path covers it without a quiz.
