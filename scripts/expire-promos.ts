// Date-based expiry of time-limited rewards and evidence. Never reads the network.
// For every card record (verified and demo): a reward whose valid_until is before `today`
// and whose status is not already stale/contradictory gets status 'stale' and a changelog
// entry; evidence with expires_at in the past is marked 'stale' too. Idempotent: running
// twice changes nothing the second time. Exit code 2 when something changed (useful for CI),
// 0 when nothing changed, 1 on error.
// Usage: node --experimental-strip-types scripts/expire-promos.ts [--today=YYYY-MM-DD] [--dry-run]
import { readFileSync, writeFileSync, readdirSync, existsSync } from 'node:fs';
import { join, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import type { CardRecord } from '../src/lib/types.ts';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const args = new Map(process.argv.slice(2).map((a) => { const [k, v] = a.replace(/^--/, '').split('='); return [k, v ?? 'true']; }));
const today = args.get('today') ?? new Date().toISOString().slice(0, 10);
const dry = args.get('dry-run') === 'true';
if (!/^\d{4}-\d{2}-\d{2}$/.test(today)) { console.error('bad --today'); process.exit(1); }

export function expireRecord(card: CardRecord, today: string): string[] {
  const changes: string[] = [];
  const stamp = `${today}T00:00:00Z`;
  for (const v of card.variants) for (const t of v.tiers) for (const r of t.rewards) {
    if (r.valid_until && r.valid_until < today && r.status !== 'stale' && r.status !== 'contradictory') {
      const from = r.status;
      r.status = 'stale';
      card.changelog.push({ date: stamp, field: `variants.${v.id}.tiers.${t.id}.rewards.${r.type}.status`, from, to: 'stale', reason: `Promotion ended on ${r.valid_until} (date-based expiry, no page read).`, evidence: r.evidence ?? [], actor: 'expire-promos' });
      changes.push(`${card.id}: ${v.id}/${t.id} ${r.type} expired ${r.valid_until}`);
    }
  }
  for (const e of card.evidence) {
    if (e.expires_at && e.expires_at < today && e.verification !== 'stale' && e.verification !== 'contradictory') {
      const from = e.verification;
      e.verification = 'stale';
      card.changelog.push({ date: stamp, field: `evidence.${e.id}.verification`, from, to: 'stale', reason: `Evidence expired on ${e.expires_at}.`, evidence: [e.id], actor: 'expire-promos' });
      changes.push(`${card.id}: evidence ${e.id} expired ${e.expires_at}`);
    }
  }
  return changes;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  let total = 0;
  for (const dir of ['data/cards', 'data/demo/cards']) {
    const abs = join(ROOT, dir);
    if (!existsSync(abs)) continue;
    for (const f of readdirSync(abs).filter((x) => x.endsWith('.json'))) {
      const p = join(abs, f);
      const card = JSON.parse(readFileSync(p, 'utf8')) as CardRecord;
      const changes = expireRecord(card, today);
      if (changes.length) {
        total += changes.length;
        for (const c of changes) console.log((dry ? 'WOULD ' : '') + c);
        if (!dry) writeFileSync(p, JSON.stringify(card, null, 2) + '\n');
      }
    }
  }
  console.log(`expire-promos: ${total} change(s) as of ${today}${dry ? ' (dry run)' : ''}`);
  process.exit(total ? 2 : 0);
}
