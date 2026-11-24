// Regenerates the data-derived part of docs/AFFILIATE-STATUS.md from data/affiliate/*.json and
// data/cards/*.json. Never reads the network, never changes a data file. The hand-written parts
// of the document (everything outside the <!-- affiliate-status:generated --> markers) are kept.
// Idempotent. Exit 0 when the document is up to date or was rewritten, 1 on error, 2 with --check
// when the generated block differs from the file (useful for CI).
// Usage: node --experimental-strip-types scripts/affiliate-status.ts [--check] [--today=YYYY-MM-DD]
import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { join, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import type { CardRecord } from '../src/lib/types.ts';

export interface AffiliateProgram {
  id: string;
  provider_id: string;
  type: string;
  our_status: string;
  is_demo: boolean;
  commission?: { status?: string };
  evidence?: { url: string; accessed_at: string }[];
}

export const START = '<!-- affiliate-status:generated -->';
export const END = '<!-- /affiliate-status:generated -->';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const args = new Map(process.argv.slice(2).map((a) => { const [k, v] = a.replace(/^--/, '').split('='); return [k, v ?? 'true']; }));

function readDir<T>(dir: string): T[] {
  return readdirSync(dir).filter((f) => f.endsWith('.json')).sort().map((f) => JSON.parse(readFileSync(join(dir, f), 'utf8')) as T);
}

export function lastRead(p: AffiliateProgram): string {
  const dates = (p.evidence ?? []).map((e) => e.accessed_at).filter(Boolean).sort();
  return dates.length ? dates[dates.length - 1].slice(0, 10) : '—';
}

export function renderMatrix(programs: AffiliateProgram[], cards: CardRecord[], today: string): string {
  const live = programs.filter((p) => !p.is_demo).sort((a, b) => a.id.localeCompare(b.id));
  const cardsByProgram = new Map<string, string[]>();
  for (const c of cards) {
    const pid = c.links?.affiliate?.program_id;
    if (!pid) continue;
    cardsByProgram.set(pid, [...(cardsByProgram.get(pid) ?? []), `${c.id} (${c.record_status})`]);
  }
  const rows = live.map((p) => `| ${p.id} | ${p.provider_id} | ${p.type} | ${p.our_status} | ${p.commission?.status ?? 'unknown'} | ${lastRead(p)} | ${(cardsByProgram.get(p.id) ?? ['—']).join(', ')} |`);
  const monetised = cards.filter((c) => c.links?.affiliate?.status === 'accepted' && c.links?.affiliate?.url).map((c) => c.id).sort();
  const without = cards.filter((c) => !c.links?.affiliate?.program_id && (c.record_status === 'published' || c.record_status === 'validated')).map((c) => `${c.id} (${c.record_status})`).sort();
  const lines = [
    START,
    `Matrix generated on ${today} from \`data/affiliate/*.json\` and \`data/cards/*.json\` (${live.length} programmes) by \`npm run affiliate-status\`.`,
    '',
    '| Programme | Provider | Type | our_status | Commission status | Last official read | Linked card(s) |',
    '|---|---|---|---|---|---|---|',
    ...rows,
    '',
    `Monetised links live (status \`accepted\`, URL present): ${monetised.length ? monetised.join(', ') : 'none'}. All other cards route to the official site, labelled "not an affiliate link".`,
    '',
    `Published or validated cards without any programme record: ${without.length ? without.join(', ') : 'none'}.`,
    END,
  ];
  return lines.join('\n');
}

export function splice(doc: string, block: string): string {
  const s = doc.indexOf(START);
  const e = doc.indexOf(END);
  if (s === -1 || e === -1 || e < s) throw new Error(`markers ${START} / ${END} not found in docs/AFFILIATE-STATUS.md`);
  return doc.slice(0, s) + block + doc.slice(e + END.length);
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const today = args.get('today') ?? new Date().toISOString().slice(0, 10);
  const programs = readDir<AffiliateProgram>(join(ROOT, 'data', 'affiliate'));
  const cards = readDir<CardRecord>(join(ROOT, 'data', 'cards'));
  const docPath = join(ROOT, 'docs', 'AFFILIATE-STATUS.md');
  const doc = readFileSync(docPath, 'utf8');
  let next: string;
  try {
    next = splice(doc, renderMatrix(programs, cards, today));
  } catch (err) {
    console.error((err as Error).message);
    process.exit(1);
  }
  const undated = (s: string) => s.replace(/Matrix generated on \d{4}-\d{2}-\d{2}/, 'Matrix generated on DATE');
  if (undated(next) === undated(doc)) {
    console.log(`affiliate-status: docs/AFFILIATE-STATUS.md up to date (${programs.length} programmes, ${cards.length} cards)`);
    process.exit(0);
  }
  if (args.get('check') === 'true') {
    console.error('affiliate-status: docs/AFFILIATE-STATUS.md is out of date — run `npm run affiliate-status`');
    process.exit(2);
  }
  writeFileSync(docPath, next);
  console.log(`affiliate-status: docs/AFFILIATE-STATUS.md regenerated (${programs.length} programmes, ${cards.length} cards)`);
}
