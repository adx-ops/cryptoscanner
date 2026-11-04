import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { statusRows, summarize, loadPrograms, MONETISABLE, type ProgramRecord } from './affiliate-status.ts';
import { applyAffiliateLink } from './set-affiliate-link.ts';
import { outboundLink } from '../src/lib/data.ts';
import type { CardRecord } from '../src/lib/types.ts';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const loadCard = (slug: string): CardRecord => JSON.parse(readFileSync(resolve(ROOT, `data/cards/${slug}.json`), 'utf8'));
const loadProgram = (id: string): ProgramRecord => JSON.parse(readFileSync(resolve(ROOT, `data/affiliate/${id}.json`), 'utf8'));
const NOW = '2026-11-04T08:00:00Z';
const change = (status: string, url: string | null = null) => ({ status, url, source: 'https://app.impact.com/secure/mediapartner/home.ihtml', note: 'Test confirmation.' });

test('real data: every card is consistent with its programme and nothing is monetised yet', () => {
  const programs = loadPrograms(ROOT);
  const cards = ['nexo-card', 'wirex-card', 'bitpanda-card', 'redotpay-card'].map(loadCard);
  const rows = statusRows(cards, programs);
  assert.deepEqual(rows.flatMap((r) => r.problems), []);
  assert.equal(summarize(rows).published_monetised, 0);
});

test('accepted access wires the url, the changelog and the programme status; the build then exposes the link', () => {
  const card = loadCard('nexo-card');
  const program = loadProgram('nexo-affiliate');
  const url = 'https://nexo.sjv.io/c/0000000/0000000/00000';
  applyAffiliateLink(card, program, change('accepted', url), NOW);
  assert.equal(card.links.affiliate.status, 'accepted');
  assert.equal(card.links.affiliate.url, url);
  assert.equal(card.changelog.at(-1)?.field, 'links.affiliate');
  assert.equal(card.changelog.at(-1)?.actor, 'david');
  assert.equal(program.our_status, 'accepted');
  assert.equal(program.evidence?.at(-1)?.accessed_at, NOW);
  assert.deepEqual(outboundLink(card), { href: url, monetised: true });
  assert.deepEqual(statusRows([card], new Map([[program.id, program]]))[0].problems, []);
});

test('a url is refused before access is confirmed, and required once it is', () => {
  const card = loadCard('nexo-card');
  const program = loadProgram('nexo-affiliate');
  assert.throws(() => applyAffiliateLink(card, program, change('application_sent', 'https://nexo.sjv.io/c/1/1/1'), NOW), /no --url allowed yet/);
  assert.throws(() => applyAffiliateLink(card, program, change('accepted', null), NOW), /requires --url/);
  assert.equal(card.links.affiliate.url, null);
  assert.deepEqual(outboundLink(card), { href: card.links.official_url, monetised: false });
});

test('placeholders, http links and missing provenance are refused', () => {
  const card = loadCard('nexo-card');
  const program = loadProgram('nexo-affiliate');
  assert.throws(() => applyAffiliateLink(card, program, change('accepted', 'https://nexo.com/ref/YOUR-CODE'), NOW), /placeholder/);
  assert.throws(() => applyAffiliateLink(card, program, change('accepted', 'http://nexo.sjv.io/c/1/1/1'), NOW), /https/);
  assert.throws(() => applyAffiliateLink(card, program, { status: 'accepted', url: 'https://nexo.sjv.io/c/1/1/1', source: '', note: 'x' }, NOW), /--source/);
  assert.throws(() => applyAffiliateLink(card, program, { status: 'accepted', url: 'https://nexo.sjv.io/c/1/1/1', source: 'https://x.test', note: '' }, NOW), /--note/);
});

test('a programme and a card cannot be mixed up; a decline clears the link', () => {
  const card = loadCard('nexo-card');
  assert.throws(() => applyAffiliateLink(card, loadProgram('bybit-affiliate'), change('application_sent'), NOW), /linked to programme nexo-affiliate/);
  const program = loadProgram('nexo-affiliate');
  applyAffiliateLink(card, program, change('accepted', 'https://nexo.sjv.io/c/1/1/1'), NOW);
  applyAffiliateLink(card, program, change('declined'), NOW);
  assert.equal(card.links.affiliate.url, null);
  assert.equal(card.links.affiliate.status, 'terms_verified');
  assert.equal(program.our_status, 'declined');
  assert.equal(outboundLink(card).monetised, false);
});

test('status report flags a card that runs ahead of its programme or carries a url without access', () => {
  const card = loadCard('nexo-card');
  const program = loadProgram('nexo-affiliate');
  card.links.affiliate = { program_id: 'nexo-affiliate', status: 'tracking_tested', url: 'https://nexo.sjv.io/c/1/1/1' };
  const rows = statusRows([card], new Map([[program.id, program]]));
  assert.match(rows[0].problems.join(' '), /ahead of programme status/);
  card.links.affiliate = { program_id: 'nexo-affiliate', status: 'identified', url: 'https://nexo.sjv.io/c/1/1/1' };
  assert.match(statusRows([card], new Map([[program.id, program]]))[0].problems.join(' '), /does not confirm access/);
  assert.ok(MONETISABLE.has('accepted') && !MONETISABLE.has('application_sent'));
});
