// Deterministic reward / cost engine. CALC_VERSION is surfaced next to every result.
// All money arithmetic is done in integer minor units (cents) with half-up rounding at
// the point of each component; the engine never reads the network or the clock.
//
// Core formula (per period, usually a month):
//   estimated net recurring value = calculable recurring rewards
//                                  - recurring fees
//                                  - calculable variable fees
// One-off fees and one-off bonuses are reported separately and never netted into the
// recurring figure. Unknown costs make the result 'partial' (never zero).
import type { Fee, Reward, Tier, Variant, CardRecord } from '../types.ts';

export const CALC_VERSION = '1.0.0';

export interface Scenario {
  country: string;                 // ISO-3166 alpha-2 residence
  currency: string;                // reference currency the user thinks in (ISO 4217)
  monthlySpend: number;            // total card spend per month, in `currency`
  eligibleShare: number;           // 0..1 share of spend that earns rewards (excludes cash-like etc.)
  foreignCurrencyShare: number;    // 0..1 share of spend in a foreign currency (FX fee base)
  atmWithdrawals: { count: number; totalAmount: number }; // per month
  monthlyTopup?: number;           // if omitted, assumed = monthlySpend + atm total
  acceptsSubscription: boolean;
  acceptsHolding: boolean;
  acceptsLock: boolean;
  startDate: string;               // YYYY-MM-DD, first day of the projection
  months: number;                  // projection length (1..12)
  tokenPrices?: Record<string, { price: number; currency: string; asOf: string }>; // optional, dated
}

export type EligibilityVerdict = 'eligible' | 'ineligible' | 'to_confirm';

export interface MonthResult {
  month: string;       // YYYY-MM
  rewards: number;     // minor units
  recurringFees: number;
  variableFees: number;
  net: number;
}

export interface Component {
  label: string;
  type: string;
  amount: number | null; // minor units; null = not calculable
  unit: string;          // currency code or token ticker
  note?: string;
  status: 'calculated' | 'unknown' | 'excluded' | 'native_unit';
}

export interface CalcResult {
  calcVersion: string;
  cardId: string;
  variantId: string;
  tierId: string;
  currency: string;
  status: 'complete' | 'partial' | 'insufficient_data' | 'not_applicable';
  reasons: string[];                // why partial / not applicable
  eligibility: EligibilityVerdict;
  months: MonthResult[];
  totals: { rewards: number; recurringFees: number; variableFees: number; net: number } | null;
  oneOff: { fees: Component[]; bonuses: Component[] };
  nativeUnitRewards: Component[];   // token/points rewards with no dated conversion
  unknownCosts: string[];
  assumptions: string[];
  dataVerifiedAt: string | null;
}

// ---------- helpers ----------
export function toMinor(amount: number): number { return Math.round(amount * 100); }
export function fromMinor(minor: number): number { return minor / 100; }
function pct(baseMinor: number, percent: number): number { return Math.round((baseMinor * percent) / 100); }
function monthKey(start: string, offset: number): string {
  const [y, m] = start.split('-').map(Number);
  const d = new Date(Date.UTC(y, m - 1 + offset, 1));
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, '0')}`;
}
function monthlyEquivalent(amountMinor: number, period: Fee['period']): number | null {
  switch (period) {
    case 'month': return amountMinor;
    case 'year': return Math.round(amountMinor / 12);
    default: return null;
  }
}
function isActiveInMonth(r: Reward, month: string): boolean {
  const first = `${month}-01`;
  if (r.valid_from && r.valid_from > `${month}-31`) return false;
  if (r.valid_until && r.valid_until < first) return false;
  return true;
}
function capAmountForMonth(r: Reward): number | null {
  if (!r.cap) return null;
  if (r.cap.period === 'month') return toMinor(r.cap.amount.amount);
  if (r.cap.period === 'year') return null; // handled cumulatively
  return null;
}

export function eligibilityFor(variant: Variant, country: string): EligibilityVerdict {
  if (variant.eligibility.residence_excluded.includes(country)) return 'ineligible';
  if (variant.eligibility.residence_allowed.includes(country)) return 'eligible';
  return variant.eligibility.default_for_unlisted === 'ineligible' ? 'ineligible' : 'to_confirm';
}

export function tierAccessible(tier: Tier, s: Scenario): { ok: boolean; reason?: string } {
  switch (tier.access.type) {
    case 'free': return { ok: true };
    case 'subscription': return s.acceptsSubscription ? { ok: true } : { ok: false, reason: 'Tier requires a paid subscription (excluded by your settings).' };
    case 'holding': return s.acceptsHolding ? { ok: true } : { ok: false, reason: 'Tier requires holding tokens (excluded by your settings).' };
    case 'lock': return s.acceptsLock ? { ok: true } : { ok: false, reason: 'Tier requires locking/staking tokens (excluded by your settings).' };
  }
}

function rewardAccepted(r: Reward, s: Scenario): boolean {
  const req = r.requires ?? 'none';
  if (req === 'subscription') return s.acceptsSubscription;
  if (req === 'holding') return s.acceptsHolding;
  if (req === 'lock') return s.acceptsLock;
  return true;
}

// ---------- main ----------
export function calculate(card: CardRecord, variant: Variant, tier: Tier, s: Scenario): CalcResult {
  const base: CalcResult = {
    calcVersion: CALC_VERSION, cardId: card.id, variantId: variant.id, tierId: tier.id,
    currency: variant.currency, status: 'complete', reasons: [], eligibility: eligibilityFor(variant, s.country),
    months: [], totals: null, oneOff: { fees: [], bonuses: [] }, nativeUnitRewards: [], unknownCosts: [],
    assumptions: [], dataVerifiedAt: card.freshness.last_content_verified_at ?? null,
  };

  if (card.product_status !== 'active' && card.product_status !== 'waitlist') {
    return { ...base, status: 'not_applicable', reasons: [`Product status is '${card.product_status}'.`] };
  }
  if (base.eligibility === 'ineligible') {
    return { ...base, status: 'not_applicable', reasons: [`Residents of ${s.country} are excluded by the published conditions.`] };
  }
  const access = tierAccessible(tier, s);
  if (!access.ok) return { ...base, status: 'not_applicable', reasons: [access.reason!] };

  if (variant.currency !== s.currency) {
    base.assumptions.push(`Amounts are computed in ${variant.currency}; your reference currency is ${s.currency}. No FX conversion of the result is applied.`);
  }
  if (base.eligibility === 'to_confirm') base.reasons.push('Eligibility for your country is not confirmed by the published conditions.');

  const months = Math.max(1, Math.min(12, Math.floor(s.months)));
  const spend = toMinor(s.monthlySpend);
  const eligibleSpend = Math.round(spend * Math.min(1, Math.max(0, s.eligibleShare)));
  const fxSpend = Math.round(spend * Math.min(1, Math.max(0, s.foreignCurrencyShare)));
  const atmTotal = toMinor(s.atmWithdrawals.totalAmount);
  const topup = s.monthlyTopup !== undefined ? toMinor(s.monthlyTopup) : spend + atmTotal;
  if (s.monthlyTopup === undefined) base.assumptions.push('Monthly top-up assumed equal to spend plus ATM withdrawals.');
  base.assumptions.push(`${Math.round(s.eligibleShare * 100)}% of spend assumed reward-eligible; ${Math.round(s.foreignCurrencyShare * 100)}% assumed in foreign currency.`);

  // ---- recurring fees (per month) ----
  let recurringFees = 0;
  const variableParts: Record<string, number> = {};
  const feeByType = new Map<string, Fee>();
  for (const f of tier.fees) feeByType.set(f.type, f);

  const needsAnswer: Fee['type'][] = ['subscription', 'fx', 'atm_withdrawal', 'topup'];
  for (const t of needsAnswer) if (!feeByType.has(t)) base.unknownCosts.push(`${t} fee not documented`);

  for (const f of tier.fees) {
    if (f.kind === 'unknown') { base.unknownCosts.push(`${f.type} fee unknown`); continue; }
    if (f.kind === 'none') continue;
    switch (f.type) {
      case 'issuance':
      case 'delivery':
        base.oneOff.fees.push({ label: `${f.type} fee`, type: f.type, amount: f.amount ? toMinor(f.amount.amount) : null, unit: variant.currency, status: f.amount ? 'calculated' : 'unknown' });
        break;
      case 'subscription':
      case 'renewal':
      case 'inactivity': {
        const m = f.amount ? monthlyEquivalent(toMinor(f.amount.amount), f.period) : null;
        if (m === null) base.unknownCosts.push(`${f.type} fee has no monthly equivalent`); else recurringFees += m;
        break;
      }
      case 'fx': {
        const v = variableFee(f, fxSpend, 1, variant.currency);
        if (v === null) base.unknownCosts.push('fx fee not calculable'); else variableParts.fx = v;
        break;
      }
      case 'atm_withdrawal': {
        const v = variableFee(f, atmTotal, s.atmWithdrawals.count, variant.currency);
        if (v === null) base.unknownCosts.push('atm fee not calculable'); else variableParts.atm = v;
        break;
      }
      case 'topup':
      case 'conversion': {
        const v = variableFee(f, topup, 1, variant.currency);
        if (v === null) base.unknownCosts.push(`${f.type} fee not calculable`); else variableParts[f.type] = v;
        break;
      }
      default:
        base.unknownCosts.push(`${f.type} fee not modelled`);
    }
  }
  const variableFees = Object.values(variableParts).reduce((a, b) => a + b, 0);

  // ---- rewards, month by month ----
  const yearlyCapUsed = new Map<Reward, number>();
  const monthResults: MonthResult[] = [];
  for (let i = 0; i < months; i++) {
    const mk = monthKey(s.startDate, i);
    let rewards = 0;
    for (const r of tier.rewards) {
      if (r.type === 'non_monetary' || r.type === 'signup_bonus') continue;
      if (!rewardAccepted(r, s)) continue;
      if (r.status === 'unknown' || r.status === 'stale' || r.status === 'contradictory') { base.reasons.push(`Reward '${r.type}' excluded: status ${r.status}.`); continue; }
      if (!isActiveInMonth(r, mk)) continue;
      if (r.percent === undefined) continue;
      if (r.min_spend && spend < toMinor(r.min_spend.amount)) continue;

      let earned = pct(eligibleSpend, r.percent);
      const monthCap = capAmountForMonth(r);
      if (monthCap !== null) {
        earned = Math.min(earned, monthCap);
        if (r.cap && r.cap.amount.currency !== variant.currency && i === 0) base.assumptions.push(`Reward cap stated in ${r.cap.amount.currency} applied 1:1 in ${variant.currency} (no FX conversion).`);
      }
      if (r.cap && r.cap.period === 'year') {
        const used = yearlyCapUsed.get(r) ?? 0;
        const room = Math.max(0, toMinor(r.cap.amount.amount) - used);
        earned = Math.min(earned, room);
        yearlyCapUsed.set(r, used + earned);
      }

      if (r.payout.kind === 'fiat') {
        rewards += earned;
      } else {
        const code = r.payout.code ?? r.payout.kind;
        const price = s.tokenPrices?.[code];
        if (price && price.currency === variant.currency) {
          rewards += earned; // reward value expressed in fiat-equivalent at spend time; token amount = earned / price
          if (i === 0) base.assumptions.push(`${code} rewards valued at ${price.price} ${price.currency} (as of ${price.asOf}); result moves 1:1 with the token price. No appreciation assumed.`);
        } else {
          if (i === 0) {
            base.nativeUnitRewards.push({ label: `${r.type} reward paid in ${code}`, type: r.type, amount: earned, unit: code, status: 'native_unit', note: 'No dated conversion rate supplied; shown as fiat-equivalent earned at spend time, payout value depends on token price.' });
            base.reasons.push(`Reward paid in ${code} has no dated conversion; excluded from the net total.`);
          }
        }
      }
    }
    const net = rewards - recurringFees - variableFees;
    monthResults.push({ month: mk, rewards, recurringFees, variableFees, net });
  }
  base.months = monthResults;

  // ---- one-off bonuses ----
  for (const r of tier.rewards) {
    if (r.type === 'signup_bonus' && r.fixed) {
      const cond = r.min_spend ? ` after ${r.min_spend.amount} ${r.min_spend.currency} spend` : '';
      base.oneOff.bonuses.push({ label: `Sign-up bonus${cond}`, type: 'signup_bonus', amount: r.payout.kind === 'fiat' ? toMinor(r.fixed.amount) : null, unit: r.payout.code ?? r.fixed.currency, status: r.payout.kind === 'fiat' ? 'calculated' : 'native_unit', note: r.conditions });
    }
    if (r.type === 'non_monetary') base.oneOff.bonuses.push({ label: r.description ?? 'Non-monetary perk', type: 'non_monetary', amount: null, unit: '', status: 'excluded' });
  }

  base.totals = monthResults.reduce((acc, m) => ({
    rewards: acc.rewards + m.rewards, recurringFees: acc.recurringFees + m.recurringFees,
    variableFees: acc.variableFees + m.variableFees, net: acc.net + m.net,
  }), { rewards: 0, recurringFees: 0, variableFees: 0, net: 0 });

  base.reasons = [...new Set(base.reasons)];
  base.unknownCosts = [...new Set(base.unknownCosts)];
  if (base.unknownCosts.length || base.nativeUnitRewards.length || base.eligibility === 'to_confirm') base.status = 'partial';
  const nothingVerified = tier.rewards.every((r) => r.status !== 'verified' && r.status !== 'calculated') && !card.is_demo;
  if (nothingVerified && card.record_status === 'published') base.status = 'insufficient_data';
  return base;
}

function variableFee(f: Fee, baseMinor: number, count: number, currency: string): number | null {
  if (f.kind === 'none') return 0;
  if (f.kind === 'unknown') return null;
  // free allowance by amount per month reduces the fee base; by count reduces the fixed part
  let chargeable = baseMinor;
  let chargeableCount = count;
  if (f.free_allowance?.amount && (f.free_allowance.period === 'month' || !f.free_allowance.period)) chargeable = Math.max(0, baseMinor - toMinor(f.free_allowance.amount.amount));
  if (f.free_allowance?.count !== undefined) chargeableCount = Math.max(0, count - f.free_allowance.count);
  if (chargeable === 0 && (f.kind === 'percent')) return 0;
  let fee = 0;
  if ((f.kind === 'fixed' || f.kind === 'fixed_plus_percent') && f.amount) {
    if (f.period === 'per_transaction') fee += toMinor(f.amount.amount) * (chargeable > 0 ? chargeableCount : 0);
    else if (f.period === 'month') fee += toMinor(f.amount.amount);
    else return null;
  }
  if ((f.kind === 'percent' || f.kind === 'fixed_plus_percent') && f.percent !== undefined) fee += pct(chargeable, f.percent);
  if (f.min && fee > 0 && chargeableCount > 0) fee = Math.max(fee, toMinor(f.min.amount) * (f.period === 'per_transaction' ? chargeableCount : 1));
  if (f.max) fee = Math.min(fee, toMinor(f.max.amount) * (f.period === 'per_transaction' ? Math.max(1, chargeableCount) : 1));
  void currency;
  return fee;
}
