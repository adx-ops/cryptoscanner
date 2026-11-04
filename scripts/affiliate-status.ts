// Affiliate pipeline status: one line per card record, joining the card's outbound link
// state with its affiliate programme record. Never reads the network. Exit 1 when the two
// sides disagree (a card claims an access the programme file does not confirm, or vice
// versa), so the check can run in CI and in unattended runs.
// Usage: node --experimental-strip-types scripts/affiliate-status.ts [--json] [--root=<dir>]
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import type { CardRecord } from '../src/lib/types.ts';

const DEFAULT_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');

/** Statuses under which a monetised link may be exposed (mirrors src/lib/data.ts outboundLink). */
export const MONETISABLE = new Set(['accepted', 'tracking_tested', 'payment_observed']);

/** Rank of each status along the pipeline; -1 for statuses that mean "no programme". */
const RANK: Record<string, number> = {
  none: -1, not_applicable: -1, declined: -1,
  identified: 0, terms_verified: 1, application_prepared: 2, application_sent: 3,
  accepted: 4, tracking_tested: 5, payment_observed: 6,
};

export interface ProgramRecord {
  id: string;
  provider_id: string;
  program_name: string;
  type: string;
  our_status: string;
  program_url?: string;
  application_conditions?: string;
  commission?: { model_note?: string; status?: string };
  evidence?: { url: string; title?: string; accessed_at: string; excerpt?: string }[];
  [k: string]: unknown;
}

export interface StatusRow {
  card: string;
  record_status: string;
  program_id: string | null;
  program_name: string | null;
  program_type: string | null;
  card_link_status: string;
  program_status: string | null;
  url_present: boolean;
  monetised: boolean;
  problems: string[];
}

function loadJson<T>(p: string): T { return JSON.parse(readFileSync(p, 'utf8')); }
function listJson(dir: string): string[] {
  if (!existsSync(dir)) return [];
  return readdirSync(dir).filter((f) => f.endsWith('.json')).sort().map((f) => join(dir, f));
}

export function loadPrograms(root: string): Map<string, ProgramRecord> {
  const m = new Map<string, ProgramRecord>();
  for (const f of listJson(join(root, 'data/affiliate'))) { const p = loadJson<ProgramRecord>(f); m.set(p.id, p); }
  return m;
}

export function statusRows(cards: CardRecord[], programs: Map<string, ProgramRecord>): StatusRow[] {
  const rows: StatusRow[] = [];
  for (const c of cards) {
    const a = c.links.affiliate;
    const p = a.program_id ? programs.get(a.program_id) ?? null : null;
    const problems: string[] = [];
    if (a.program_id && !p) problems.push(`program_id ${a.program_id} has no file under data/affiliate/`);
    if (a.url && !MONETISABLE.has(a.status)) problems.push(`affiliate url present but card status '${a.status}' does not confirm access`);
    if (MONETISABLE.has(a.status) && !a.url) problems.push(`card status '${a.status}' without an affiliate url`);
    if (p) {
      const cardRank = RANK[a.status] ?? -2;
      const progRank = RANK[p.our_status] ?? -2;
      // The card may lag behind the programme (e.g. programme accepted, link not yet wired) but never run ahead of it.
      if (cardRank > progRank) problems.push(`card status '${a.status}' is ahead of programme status '${p.our_status}'`);
      if (MONETISABLE.has(p.our_status) && !(p.evidence ?? []).length) problems.push(`programme '${p.id}' is ${p.our_status} without any evidence entry`);
    }
    if (!a.program_id && a.status !== 'none') problems.push(`card status '${a.status}' without a program_id`);
    rows.push({
      card: c.slug,
      record_status: c.record_status,
      program_id: a.program_id ?? null,
      program_name: p?.program_name ?? null,
      program_type: p?.type ?? null,
      card_link_status: a.status,
      program_status: p?.our_status ?? null,
      url_present: Boolean(a.url),
      monetised: Boolean(a.url) && MONETISABLE.has(a.status),
      problems,
    });
  }
  return rows;
}

export function summarize(rows: StatusRow[]) {
  const published = rows.filter((r) => r.record_status === 'published');
  return {
    cards: rows.length,
    published: published.length,
    published_monetised: published.filter((r) => r.monetised).length,
    programs_by_status: rows.reduce<Record<string, number>>((acc, r) => { const k = r.program_status ?? 'no programme'; acc[k] = (acc[k] ?? 0) + 1; return acc; }, {}),
    problems: rows.reduce((n, r) => n + r.problems.length, 0),
  };
}

function main() {
  const args = new Map(process.argv.slice(2).map((a) => { const [k, v] = a.replace(/^--/, '').split('='); return [k, v ?? 'true']; }));
  const root = args.get('root') ? resolve(args.get('root')!) : DEFAULT_ROOT;
  const cards = listJson(join(root, 'data/cards')).map((f) => loadJson<CardRecord>(f));
  const rows = statusRows(cards, loadPrograms(root));
  const summary = summarize(rows);
  if (args.get('json') === 'true') {
    console.log(JSON.stringify({ generated_at: new Date().toISOString(), summary, rows }, null, 2));
  } else {
    const pad = (s: string | null | boolean, n: number) => String(s ?? '-').padEnd(n);
    console.log(`${pad('card', 26)}${pad('record', 13)}${pad('programme', 24)}${pad('type', 18)}${pad('card link', 20)}${pad('programme status', 22)}monetised`);
    for (const r of rows) {
      console.log(`${pad(r.card, 26)}${pad(r.record_status, 13)}${pad(r.program_id, 24)}${pad(r.program_type, 18)}${pad(r.card_link_status, 20)}${pad(r.program_status, 22)}${r.monetised ? 'YES' : 'no'}`);
      for (const p of r.problems) console.log(`  PROBLEM ${p}`);
    }
    console.log(`\n${summary.cards} cards, ${summary.published} published, ${summary.published_monetised} published with a monetised link; programme statuses: ${JSON.stringify(summary.programs_by_status)}; ${summary.problems} problem(s).`);
  }
  process.exit(summary.problems ? 1 : 0);
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) main();
