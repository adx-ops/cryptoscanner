import { test } from 'node:test';
import assert from 'node:assert/strict';
import { renderMatrix, splice, lastRead, START, END, type AffiliateProgram } from './affiliate-status.ts';
import type { CardRecord } from '../src/lib/types.ts';

const program = (over: Partial<AffiliateProgram>): AffiliateProgram => ({
  id: 'acme-affiliate', provider_id: 'acme', type: 'cpa', our_status: 'identified', is_demo: false,
  commission: { status: 'verified' },
  evidence: [{ url: 'https://acme.example/a', accessed_at: '2026-11-01T00:00:00Z' }, { url: 'https://acme.example/b', accessed_at: '2026-11-20T05:00:00Z' }],
  ...over,
});
const card = (id: string, record_status: string, affiliate: { program_id?: string | null; status: string; url?: string | null }) =>
  ({ id, record_status, links: { affiliate } }) as unknown as CardRecord;

test('lastRead picks the newest accessed_at, or a dash without evidence', () => {
  assert.equal(lastRead(program({})), '2026-11-20');
  assert.equal(lastRead(program({ evidence: [] })), '—');
});

test('renderMatrix lists live programmes, linked cards, monetised links and cards without a programme', () => {
  const out = renderMatrix(
    [program({}), program({ id: 'demo-affiliate', is_demo: true })],
    [card('acme-card', 'published', { program_id: 'acme-affiliate', status: 'accepted', url: 'https://acme.example/?ref=x' }), card('lonely-card', 'validated', { program_id: null, status: 'none', url: null }), card('draft-card', 'candidate', { program_id: null, status: 'none', url: null })],
    '2026-11-24',
  );
  assert.ok(out.startsWith(START) && out.endsWith(END));
  assert.match(out, /\(1 programmes\)/);
  assert.match(out, /\| acme-affiliate \| acme \| cpa \| identified \| verified \| 2026-11-20 \| acme-card \(published\) \|/);
  assert.doesNotMatch(out, /demo-affiliate/);
  assert.match(out, /Monetised links live \(status `accepted`, URL present\): acme-card\./);
  assert.match(out, /without any programme record: lonely-card \(validated\)\./);
  assert.doesNotMatch(out, /draft-card/);
});

test('splice replaces only the marked block and rejects a document without markers', () => {
  const doc = `# Title\n\nintro\n\n${START}\nold\n${END}\n\n## Run log\nkept\n`;
  const next = splice(doc, `${START}\nnew\n${END}`);
  assert.equal(next, `# Title\n\nintro\n\n${START}\nnew\n${END}\n\n## Run log\nkept\n`);
  assert.throws(() => splice('# no markers', `${START}\nx\n${END}`), /markers/);
});
