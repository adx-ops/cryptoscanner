import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { expireRecord } from './expire-promos.ts';
import type { CardRecord } from '../src/lib/types.ts';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const load = (): CardRecord => JSON.parse(readFileSync(resolve(ROOT, 'data/demo/cards/demo-alpha-debit.json'), 'utf8'));

test('promotion is still active before its end date', () => {
  const c = load();
  assert.deepEqual(expireRecord(c, '2026-12-31'), []);
  assert.equal(c.variants[0].tiers[0].rewards[1].status, 'hypothesis');
});

test('promotion becomes stale the day after valid_until, with a changelog entry, without any page read', () => {
  const c = load();
  const changes = expireRecord(c, '2027-01-01');
  assert.equal(changes.length, 1);
  assert.equal(c.variants[0].tiers[0].rewards[1].status, 'stale');
  assert.equal(c.changelog.at(-1)?.actor, 'expire-promos');
  assert.match(c.changelog.at(-1)?.reason ?? '', /2026-12-31/);
});

test('running twice is idempotent', () => {
  const c = load();
  expireRecord(c, '2027-01-01');
  assert.deepEqual(expireRecord(c, '2027-01-01'), []);
  assert.equal(c.changelog.length, 1);
});

test('a stale promotion is excluded from the calculator', async () => {
  const { calculate } = await import('../src/lib/calc/engine.ts');
  const c = load();
  expireRecord(c, '2027-01-01');
  const v = c.variants[0];
  const r = calculate(c, v, v.tiers[0], { country: 'DE', currency: 'EUR', monthlySpend: 1000, eligibleShare: 0.9, foreignCurrencyShare: 0, atmWithdrawals: { count: 0, totalAmount: 0 }, acceptsSubscription: false, acceptsHolding: false, acceptsLock: false, startDate: '2026-11-01', months: 1 });
  assert.equal(r.months[0].rewards, 900); // base 1% only, promo no longer counted even for a November scenario
});
