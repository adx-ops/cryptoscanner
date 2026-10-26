import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { calculate, eligibilityFor, toMinor, type Scenario } from './engine.ts';
import type { CardRecord } from '../types.ts';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '../../..');
const load = (slug: string): CardRecord => JSON.parse(readFileSync(resolve(ROOT, `data/demo/cards/${slug}.json`), 'utf8'));
const clone = <T,>(x: T): T => JSON.parse(JSON.stringify(x));

const alpha = load('demo-alpha-debit');
const beta = load('demo-beta-token');

const baseScenario: Scenario = {
  country: 'DE', currency: 'EUR', monthlySpend: 1000, eligibleShare: 0.9, foreignCurrencyShare: 0.1,
  atmWithdrawals: { count: 2, totalAmount: 300 }, acceptsSubscription: false, acceptsHolding: false, acceptsLock: false,
  startDate: '2026-11-01', months: 1,
};

test('country accepted / excluded / unknown', () => {
  const v = alpha.variants[0];
  assert.equal(eligibilityFor(v, 'DE'), 'eligible');
  assert.equal(eligibilityFor(v, 'GB'), 'ineligible');
  assert.equal(eligibilityFor(v, 'PL'), 'to_confirm');
  const r = calculate(alpha, v, v.tiers[0], { ...baseScenario, country: 'GB' });
  assert.equal(r.status, 'not_applicable');
});

test('unknown country yields partial, never a full result', () => {
  const v = alpha.variants[0];
  const r = calculate(alpha, v, v.tiers[0], { ...baseScenario, country: 'PL' });
  assert.equal(r.eligibility, 'to_confirm');
  assert.equal(r.status, 'partial');
});

test('base cashback with cap, promotion active in month, fx and atm variable fees', () => {
  const v = alpha.variants[0];
  const r = calculate(alpha, v, v.tiers[0], baseScenario);
  // eligible spend 900 → base 1% = 9.00 (cap 20) ; promo 3% = 27.00 (cap 30) → 36.00
  // fx: 10% of 1000 = 100 → 2% = 2.00 ; atm: 300 - 200 allowance = 100 → 2×2.00 fixed + 1% of 100 = 5.00 → total variable 7.00
  const m = r.months[0];
  assert.equal(m.rewards, toMinor(36));
  assert.equal(m.recurringFees, 0);
  assert.equal(m.variableFees, toMinor(7));
  assert.equal(m.net, toMinor(29));
  assert.equal(r.oneOff.fees.find((f) => f.type === 'delivery')?.amount, toMinor(9.9));
  // inactivity fee is 'unknown' in the demo → partial
  assert.equal(r.status, 'partial');
  assert.ok(r.unknownCosts.some((u) => u.includes('inactivity')));
});

test('promotion expires by date: 12-month projection does not multiply the promo by 12', () => {
  const v = alpha.variants[0];
  const r = calculate(alpha, v, v.tiers[0], { ...baseScenario, months: 12 });
  const nov = r.months.find((m) => m.month === '2026-11')!;
  const dec = r.months.find((m) => m.month === '2026-12')!;
  const jan = r.months.find((m) => m.month === '2027-01')!;
  assert.equal(nov.rewards, toMinor(36));
  assert.equal(dec.rewards, toMinor(36));
  assert.equal(jan.rewards, toMinor(9)); // promo gone, base only
  assert.equal(r.totals!.rewards, toMinor(36 * 2 + 9 * 10));
});

test('cap is applied before summing: large spend hits the monthly cap', () => {
  const v = alpha.variants[0];
  const r = calculate(alpha, v, v.tiers[0], { ...baseScenario, monthlySpend: 10000, eligibleShare: 1, startDate: '2027-02-01' });
  assert.equal(r.months[0].rewards, toMinor(20)); // 1% of 10000 = 100 → capped at 20
});

test('paid tier excluded unless the user accepts a subscription; included when accepted with fee netted', () => {
  const v = alpha.variants[0];
  const plus = v.tiers[1];
  const excluded = calculate(alpha, v, plus, baseScenario);
  assert.equal(excluded.status, 'not_applicable');
  const included = calculate(alpha, v, plus, { ...baseScenario, acceptsSubscription: true, startDate: '2027-02-01' });
  // base 2% of 900 = 18.00 ; subscription 9.99 ; fx none ; atm: 300-500 allowance → 0
  assert.equal(included.months[0].rewards, toMinor(18));
  assert.equal(included.months[0].recurringFees, toMinor(9.99));
  assert.equal(included.months[0].variableFees, 0);
  assert.equal(included.months[0].net, toMinor(8.01));
  assert.equal(included.status, 'complete');
});

test('token reward without a dated price stays in native unit and is excluded from the net total', () => {
  const v = beta.variants[0];
  const r = calculate(beta, v, v.tiers[0], { ...baseScenario, currency: 'USD', country: 'FR' });
  assert.equal(r.months[0].rewards, 0);
  assert.equal(r.nativeUnitRewards.length, 1);
  assert.equal(r.nativeUnitRewards[0].unit, 'DMO');
  assert.equal(r.status, 'partial');
  assert.ok(r.unknownCosts.some((u) => u.includes('atm')));
});

test('token reward with a dated price is valued and the assumption is stated', () => {
  const v = beta.variants[0];
  const r = calculate(beta, v, v.tiers[0], { ...baseScenario, currency: 'USD', tokenPrices: { DMO: { price: 0.5, currency: 'USD', asOf: '2026-10-26' } } });
  assert.equal(r.months[0].rewards, toMinor(18)); // 2% of 900
  assert.ok(r.assumptions.some((a) => a.includes('DMO rewards valued')));
  assert.equal(r.nativeUnitRewards.length, 0);
});

test('sign-up bonus is reported one-off, not in recurring net', () => {
  const v = beta.variants[0];
  const r = calculate(beta, v, v.tiers[0], { ...baseScenario, currency: 'USD', tokenPrices: { DMO: { price: 0.5, currency: 'USD', asOf: '2026-10-26' } } });
  const bonus = r.oneOff.bonuses.find((b) => b.type === 'signup_bonus');
  assert.equal(bonus?.amount, toMinor(15));
  assert.equal(r.months[0].net, toMinor(18) - (toMinor(1300) * 1.5) / 100 - toMinor(1)); // topup 1.5% of 1300 + fx 1% of 100
});

test('a suspended product is never an available option', () => {
  const c = clone(alpha); c.product_status = 'suspended';
  const v = c.variants[0];
  const r = calculate(c, v, v.tiers[0], baseScenario);
  assert.equal(r.status, 'not_applicable');
});

test('unknown costs never become zero: removing the fx entry makes the result partial', () => {
  const c = clone(alpha);
  const tier = c.variants[0].tiers[0];
  tier.fees = tier.fees.filter((f) => f.type !== 'fx' && f.type !== 'inactivity');
  const r = calculate(c, c.variants[0], tier, baseScenario);
  assert.equal(r.status, 'partial');
  assert.ok(r.unknownCosts.some((u) => u.includes('fx')));
});

test('rounding: half-up on minor units', () => {
  const c = clone(alpha);
  const v = c.variants[0];
  const tier = v.tiers[0];
  tier.rewards = [{ type: 'base', percent: 1.5, payout: { kind: 'fiat', code: 'EUR' }, status: 'hypothesis', evidence: ['ev-demo-alpha-1'] }];
  const r = calculate(c, v, tier, { ...baseScenario, monthlySpend: 33.33, eligibleShare: 1, foreignCurrencyShare: 0, atmWithdrawals: { count: 0, totalAmount: 0 } });
  // 1.5% of 3333 cents = 49.995 → 50
  assert.equal(r.months[0].rewards, 50);
});

test('result is deterministic and carries the calc version and data date', () => {
  const v = alpha.variants[0];
  const a = calculate(alpha, v, v.tiers[0], baseScenario);
  const b = calculate(alpha, v, v.tiers[0], baseScenario);
  assert.deepEqual(a, b);
  assert.equal(a.calcVersion, '1.0.0');
  assert.equal(a.dataVerifiedAt, null);
});
