// Presentation helpers: the few facts a visitor scans on a tile or a ranked row, each with its
// verification status so "unknown" is never dressed up as a value. Ranking is deterministic and
// uses verified data only — affiliate status never enters it.
import type { CardRecord, Fee, Tier } from './types.ts';
import { defaultVariantAndTier, isAvailableOption, payoutLabel, recurringCostSummary } from './data.ts';

export interface Fact { label: string; value: string; status: string; known: boolean }

function money(m?: { amount: number; currency: string }) { return m ? `${m.amount} ${m.currency}` : ''; }

function feeFact(tier: Tier, type: Fee['type'], label: string): Fact {
  const f = tier.fees.find((x) => x.type === type);
  if (!f || f.kind === 'unknown' || f.status === 'unknown') return { label, value: 'unknown', status: 'unknown', known: false };
  if (f.status === 'stale' || f.status === 'contradictory') return { label, value: 'under review', status: f.status, known: false };
  if (f.kind === 'none') return { label, value: type === 'subscription' ? 'free' : '0%', status: f.status, known: true };
  const parts = [f.percent !== undefined ? `${f.percent}%` : '', f.amount ? money(f.amount) : ''].filter(Boolean).join(' + ');
  const allowance = f.free_allowance?.amount ? ` after ${money(f.free_allowance.amount)}/mo` : f.free_allowance?.count !== undefined ? ` after ${f.free_allowance.count}/mo` : '';
  const period = type === 'subscription' && f.period ? `/${f.period.replace('per_', '').replace('month', 'mo').replace('year', 'yr')}` : '';
  return { label, value: `${parts}${period}${allowance}`, status: f.status, known: true };
}

export function cashbackFact(tier: Tier): Fact & { percent: number | null; payout: string } {
  const live = tier.rewards.filter((r) => r.status !== 'stale' && r.status !== 'contradictory');
  const base = live.find((r) => r.type === 'base');
  const max = Math.max(0, ...live.filter((r) => r.type === 'conditional_max').map((r) => r.percent ?? 0));
  if (!base) {
    const contradictory = tier.rewards.some((r) => r.status === 'contradictory');
    if (contradictory) return { label: 'Cashback', value: 'under review', status: 'contradictory', known: false, percent: null, payout: '' };
    // No current base reward: either none documented, or only an expired (stale) programme.
    return { label: 'Cashback', value: tier.rewards.length ? 'none current' : 'none', status: 'verified', known: true, percent: 0, payout: '' };
  }
  if (base.percent === undefined) return { label: 'Cashback', value: 'rate not stated', status: base.status, known: false, percent: null, payout: payoutLabel(base.payout) };
  const upTo = max > base.percent ? ` (up to ${max}%)` : '';
  return { label: 'Cashback', value: `${base.percent}%${upTo}`, status: base.status, known: base.status === 'verified' || base.status === 'calculated', percent: base.percent, payout: payoutLabel(base.payout) };
}

export interface KeyFacts {
  cashback: ReturnType<typeof cashbackFact>;
  fx: Fact; atm: Fact; cost: Fact; kyc: Fact;
  region: string; verified: string | null; available: boolean; countries: number;
}

export function keyFacts(card: CardRecord): KeyFacts {
  const { variant, tier } = defaultVariantAndTier(card);
  const sub = tier.fees.find((f) => f.type === 'subscription');
  const costText = recurringCostSummary(tier);
  const cost: Fact = { label: 'Monthly cost', value: costText === 'No subscription' ? 'free' : costText, status: sub?.status ?? 'unknown', known: costText !== 'unknown' };
  const kycMap = { required: 'ID check required', not_required_initially: 'No initial ID check', unknown: 'ID check: unknown' } as const;
  const kyc: Fact = { label: 'Identity', value: kycMap[variant.kyc.initial_verification], status: variant.kyc.status, known: variant.kyc.initial_verification !== 'unknown' };
  return {
    cashback: cashbackFact(tier),
    fx: feeFact(tier, 'fx', 'FX fee'),
    atm: feeFact(tier, 'atm_withdrawal', 'ATM'),
    cost, kyc,
    region: variant.region_label,
    verified: card.freshness.last_content_verified_at?.slice(0, 10) ?? null,
    available: isAvailableOption(card),
    countries: variant.eligibility.residence_allowed.length,
  };
}

/** Short region for chips: "Euro area", "Europe +", "EEA +". */
export function shortRegion(label: string): string {
  const cut = label.search(/[(,+]/);
  return cut > 0 ? `${label.slice(0, cut).trim()} +` : label;
}

/** Deterministic ranking: available first, then verified base cashback (desc), then free before paid/unknown cost, then name. */
export function rankCards(cards: CardRecord[]): { card: CardRecord; facts: KeyFacts }[] {
  const rows = cards.map((card) => ({ card, facts: keyFacts(card) }));
  const costRank = (f: Fact) => (f.known && f.value === 'free' ? 0 : f.known ? 1 : 2);
  return rows.sort((a, b) =>
    Number(b.facts.available) - Number(a.facts.available) ||
    (b.facts.cashback.known ? b.facts.cashback.percent ?? 0 : -1) - (a.facts.cashback.known ? a.facts.cashback.percent ?? 0 : -1) ||
    costRank(a.facts.cost) - costRank(b.facts.cost) ||
    a.card.name.localeCompare(b.card.name));
}

/** "Best for" picks computed from verified facts only; a pick is omitted when no card qualifies. */
export function bestFor(rows: { card: CardRecord; facts: KeyFacts }[]): { label: string; card: CardRecord; figure: string; why: string }[] {
  const avail = rows.filter((r) => r.facts.available);
  const out: { label: string; card: CardRecord; figure: string; why: string }[] = [];
  const cb = avail.filter((r) => r.facts.cashback.known && (r.facts.cashback.percent ?? 0) > 0).sort((a, b) => (b.facts.cashback.percent ?? 0) - (a.facts.cashback.percent ?? 0))[0];
  if (cb) out.push({ label: 'Best cashback', card: cb.card, figure: cb.facts.cashback.value, why: `paid in ${cb.facts.cashback.payout}` });
  const fx = avail.filter((r) => r.facts.fx.known && r.facts.fx.value === '0%' && r.facts.cost.known && r.facts.cost.value === 'free')[0];
  if (fx) out.push({ label: 'No FX fee, no subscription', card: fx.card, figure: '0%', why: 'foreign-currency fee on the free tier' });
  const sc = avail.filter((r) => r.card.custody === 'self_custodial')[0];
  if (sc) out.push({ label: 'Self-custody', card: sc.card, figure: 'Your keys', why: 'funds stay in your own wallet' });
  const nk = avail.filter((r) => r.facts.kyc.value === 'No initial ID check')[0];
  if (nk) out.push({ label: 'No initial ID check', card: nk.card, figure: 'No ID', why: 'to order; checks may apply later' });
  const wide = avail.filter((r) => r.facts.countries > 0).sort((a, b) => b.facts.countries - a.facts.countries)[0];
  if (wide) out.push({ label: 'Widest availability', card: wide.card, figure: `${wide.facts.countries} countries`, why: 'listed by the provider' });
  return out.slice(0, 4);
}
