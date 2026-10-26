// Single data access layer. Pages never read JSON files directly.
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import type { CardRecord, Variant, Tier, Fee } from './types.ts';

export const DATASET: 'verified' | 'demo' = (import.meta.env.PUBLIC_DATASET === 'verified') ? 'verified' : 'demo';
export const IS_DEMO = DATASET === 'demo';

const dir = IS_DEMO ? 'data/demo/cards' : 'data/cards';

let cache: CardRecord[] | null = null;
export function allCards(): CardRecord[] {
  if (cache) return cache;
  const abs = join(process.cwd(), dir);
  if (!existsSync(abs)) return (cache = []);
  cache = readdirSync(abs)
    .filter((f) => f.endsWith('.json'))
    .map((f) => JSON.parse(readFileSync(join(abs, f), 'utf8')) as CardRecord)
    .filter((c) => (IS_DEMO ? true : c.record_status === 'published'))
    .sort((a, b) => a.name.localeCompare(b.name));
  return cache;
}

export function cardBySlug(slug: string): CardRecord | undefined {
  return allCards().find((c) => c.slug === slug);
}

export function isAvailableOption(c: CardRecord): boolean {
  return c.product_status === 'active' || c.product_status === 'waitlist';
}

/** Countries referenced anywhere in eligibility lists — used for the country selector. */
export function knownCountries(): string[] {
  const s = new Set<string>();
  for (const c of allCards()) for (const v of c.variants) {
    v.eligibility.residence_allowed.forEach((x) => s.add(x));
    v.eligibility.residence_excluded.forEach((x) => s.add(x));
  }
  return [...s].sort();
}

/** Outbound link policy: a monetised link is exposed only when access is confirmed. */
export function outboundLink(c: CardRecord): { href: string; monetised: boolean } {
  const a = c.links.affiliate;
  if (a.url && (a.status === 'tracking_tested' || a.status === 'payment_observed' || a.status === 'accepted')) {
    return { href: a.url, monetised: true };
  }
  return { href: c.links.official_url, monetised: false };
}

export function defaultVariantAndTier(c: CardRecord): { variant: Variant; tier: Tier } {
  const variant = c.variants[0];
  const tier = variant.tiers.find((t) => t.access.type === 'free') ?? variant.tiers[0];
  return { variant, tier };
}

/** Human summary of the base reward for list cards: base % and conditional max %, kept separate. */
export function rewardSummary(tier: Tier): { base: string; max: string; promo: string } {
  const base = tier.rewards.find((r) => r.type === 'base');
  const maxes = tier.rewards.filter((r) => r.type === 'conditional_max');
  const promos = tier.rewards.filter((r) => r.type === 'promotional');
  const fmt = (r?: { percent?: number; payout: { kind: string; code?: string } }) =>
    r && r.percent !== undefined ? `${r.percent}% in ${r.payout.code ?? r.payout.kind}` : 'unknown';
  const maxPct = maxes.length ? Math.max(...maxes.map((r) => r.percent ?? 0)) : null;
  return {
    base: fmt(base),
    max: maxPct !== null ? `up to ${maxPct}% (conditions apply)` : '—',
    promo: promos.length ? `${promos[0].percent}% until ${promos[0].valid_until}` : '—',
  };
}

export function recurringCostSummary(tier: Tier): string {
  const sub = tier.fees.find((f) => f.type === 'subscription');
  if (!sub) return 'unknown';
  if (sub.kind === 'none') return `No subscription`;
  if (sub.kind === 'unknown') return 'unknown';
  if (sub.amount) return `${sub.amount.amount} ${sub.amount.currency}/${sub.period ?? 'period'}`;
  return 'unknown';
}

export function unknownFeeCount(tier: Tier): number {
  const required: Fee['type'][] = ['subscription', 'fx', 'atm_withdrawal', 'topup'];
  const present = new Map<Fee['type'], Fee['kind']>(tier.fees.map((f) => [f.type, f.kind]));
  let n = 0;
  for (const r of required) if (!present.has(r) || present.get(r) === 'unknown') n++;
  for (const f of tier.fees) if (f.kind === 'unknown' && !required.includes(f.type)) n++;
  return n;
}
