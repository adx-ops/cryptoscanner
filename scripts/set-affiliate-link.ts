// Wires a confirmed affiliate access into the data: the card's outbound link and the
// programme's status, both with provenance. This is the ONLY way an affiliate URL enters a
// card record. It never invents a code: the URL and the confirmation source come from the
// person who holds the programme account (David), after acceptance.
//
// Usage:
//   node --experimental-strip-types scripts/set-affiliate-link.ts \
//     --card=nexo-card --status=accepted --url=https://... \
//     --source=https://app.impact.com/... --note="Accepted 2026-11-10, link from Impact dashboard" [--program=nexo-affiliate] [--actor=david] [--dry-run]
//
// Statuses: application_prepared | application_sent | accepted | tracking_tested | payment_observed | declined.
// A URL is required from 'accepted' onwards and forbidden before. 'declined' clears the URL.
// The build exposes the link only when status ∈ {accepted, tracking_tested, payment_observed} (src/lib/data.ts).
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import type { CardRecord } from '../src/lib/types.ts';
import { MONETISABLE, type ProgramRecord } from './affiliate-status.ts';

const DEFAULT_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');

export const CARD_STATUSES = new Set(['application_prepared', 'application_sent', 'accepted', 'tracking_tested', 'payment_observed']);
export const PROGRAM_STATUSES = new Set([...CARD_STATUSES, 'declined']);

export interface LinkChange {
  status: string;
  url?: string | null;
  source: string;
  note: string;
  actor?: string;
}

function assertHttpsUrl(u: string, what: string) {
  let parsed: URL;
  try { parsed = new URL(u); } catch { throw new Error(`${what} is not a valid URL: ${u}`); }
  if (parsed.protocol !== 'https:') throw new Error(`${what} must use https: ${u}`);
  if (/[<>{}]|xxx|placeholder|your[-_]?code/i.test(u)) throw new Error(`${what} looks like a placeholder, not a real link: ${u}`);
}

/** Pure update of a card record and its programme record. Returns a human-readable summary. */
export function applyAffiliateLink(card: CardRecord, program: ProgramRecord, change: LinkChange, now: string): string[] {
  if (!PROGRAM_STATUSES.has(change.status)) throw new Error(`unknown status '${change.status}'`);
  if (!change.source) throw new Error('--source (URL of the confirmation: dashboard, email, contract) is required');
  if (!change.note) throw new Error('--note (what was confirmed, by whom, when) is required');
  assertHttpsUrl(change.source, 'source');
  const monetised = MONETISABLE.has(change.status);
  if (monetised && !change.url) throw new Error(`status '${change.status}' requires --url (the tracking link issued by the programme)`);
  if (!monetised && change.url) throw new Error(`status '${change.status}' does not confirm access: no --url allowed yet`);
  if (change.url) assertHttpsUrl(change.url, 'affiliate url');
  if (card.links.affiliate.program_id && card.links.affiliate.program_id !== program.id) throw new Error(`card ${card.slug} is linked to programme ${card.links.affiliate.program_id}, not ${program.id}`);

  const actor = change.actor ?? 'david';
  const out: string[] = [];
  const before = { ...card.links.affiliate };
  const cardStatus = change.status === 'declined' ? 'terms_verified' : change.status;
  card.links.affiliate = { program_id: program.id, status: cardStatus, url: monetised ? change.url! : null };
  card.changelog.push({
    date: now,
    field: 'links.affiliate',
    from: before,
    to: { ...card.links.affiliate },
    reason: `${change.status === 'declined' ? 'Programme declined' : `Affiliate access ${change.status}`}: ${change.note} Source: ${change.source}`,
    actor,
  });
  out.push(`${card.slug}: links.affiliate ${before.status}${before.url ? ' (url)' : ''} -> ${cardStatus}${card.links.affiliate.url ? ' (url set)' : ''}`);

  const prevProg = program.our_status;
  program.our_status = change.status;
  program.evidence = program.evidence ?? [];
  program.evidence.push({ url: change.source, title: `Our account: ${change.status}`, accessed_at: now, excerpt: change.note });
  out.push(`${program.id}: our_status ${prevProg} -> ${change.status}`);
  return out;
}

function main() {
  const args = new Map(process.argv.slice(2).map((a) => { const i = a.indexOf('='); return i === -1 ? [a.replace(/^--/, ''), 'true'] : [a.slice(2, i), a.slice(i + 1)]; }));
  const root = args.get('root') ? resolve(args.get('root')!) : DEFAULT_ROOT;
  const slug = args.get('card');
  if (!slug) { console.error('--card=<slug> is required'); process.exit(1); }
  const cardFile = join(root, 'data/cards', `${slug}.json`);
  if (!existsSync(cardFile)) { console.error(`no record ${cardFile}`); process.exit(1); }
  const card: CardRecord = JSON.parse(readFileSync(cardFile, 'utf8'));
  const programId = args.get('program') ?? card.links.affiliate.program_id;
  if (!programId) { console.error('the card has no program_id; pass --program=<id> (file under data/affiliate/)'); process.exit(1); }
  const programFile = join(root, 'data/affiliate', `${programId}.json`);
  if (!existsSync(programFile)) { console.error(`no programme file ${programFile}`); process.exit(1); }
  const program: ProgramRecord = JSON.parse(readFileSync(programFile, 'utf8'));
  const now = new Date().toISOString().replace(/\.\d{3}Z$/, 'Z');
  let summary: string[];
  try {
    summary = applyAffiliateLink(card, program, { status: args.get('status') ?? '', url: args.get('url') ?? null, source: args.get('source') ?? '', note: args.get('note') ?? '', actor: args.get('actor') }, now);
  } catch (e) { console.error((e as Error).message); process.exit(1); }
  if (args.get('dry-run') === 'true') { console.log('[dry-run]', summary.join('\n[dry-run] ')); return; }
  writeFileSync(cardFile, JSON.stringify(card, null, 2) + '\n');
  writeFileSync(programFile, JSON.stringify(program, null, 2) + '\n');
  console.log(summary.join('\n'));
  console.log('Now run: npm run validate && npm run affiliate-status && npm run build');
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) main();
