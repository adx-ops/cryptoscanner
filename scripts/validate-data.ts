// Validates every data record against its JSON Schema and applies business rules
// that a schema alone cannot express. Exit code 1 on any error. Run: npm run validate
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import Ajv2020 from 'ajv/dist/2020.js';
import addFormats from 'ajv-formats';
import type { CardRecord } from '../src/lib/types.ts';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const ajv = new Ajv2020({ allErrors: true, strict: true });
addFormats(ajv);

function loadJson(p: string) { return JSON.parse(readFileSync(p, 'utf8')); }
function listJson(dir: string): string[] {
  if (!existsSync(dir)) return [];
  return readdirSync(dir).filter((f) => f.endsWith('.json')).map((f) => join(dir, f));
}

const cardSchema = loadJson(join(ROOT, 'data/schema/card.schema.json'));
const programSchema = loadJson(join(ROOT, 'data/schema/affiliate-program.schema.json'));
const validateCard = ajv.compile(cardSchema);
const validateProgram = ajv.compile(programSchema);

const errors: string[] = [];
const warnings: string[] = [];
const seenIds = new Set<string>();

type Check = { file: string; demo: boolean };
const cardFiles: Check[] = [
  ...listJson(join(ROOT, 'data/cards')).map((file) => ({ file, demo: false })),
  ...listJson(join(ROOT, 'data/demo/cards')).map((file) => ({ file, demo: true })),
];

const MATERIAL_STATUSES_OK_FOR_PUBLISH = new Set(['verified', 'calculated']);

for (const { file, demo } of cardFiles) {
  const rel = file.replace(ROOT + '/', '');
  let card: CardRecord;
  try { card = loadJson(file); } catch (e) { errors.push(`${rel}: invalid JSON (${(e as Error).message})`); continue; }

  if (!validateCard(card)) {
    for (const e of validateCard.errors ?? []) errors.push(`${rel}: ${e.instancePath || '/'} ${e.message}`);
    continue;
  }

  // --- business rules ---
  if (seenIds.has(card.id)) errors.push(`${rel}: duplicate id ${card.id}`);
  seenIds.add(card.id);
  if (card.id !== card.slug) errors.push(`${rel}: id and slug must match`);
  if (demo && card.is_demo !== true) errors.push(`${rel}: files under data/demo must have is_demo=true`);
  if (!demo && card.is_demo === true) errors.push(`${rel}: demo records are not allowed under data/cards`);
  if (card.is_demo && card.record_status === 'published') errors.push(`${rel}: a demo record can never be 'published'`);

  const evidenceIds = new Set<string>((card.evidence ?? []).map((e: any) => e.id));
  const refCheck = (refs: string[] | undefined, where: string) => {
    for (const r of refs ?? []) if (!evidenceIds.has(r)) errors.push(`${rel}: ${where} references unknown evidence ${r}`);
  };

  if (card.category.includes('credit') && !card.credit_terms) errors.push(`${rel}: credit products need credit_terms`);
  if (!card.category.includes('credit') && card.credit_terms) warnings.push(`${rel}: credit_terms set on a non-credit product`);

  if (card.links.affiliate.url && !['tracking_tested', 'payment_observed', 'accepted'].includes(card.links.affiliate.status)) {
    errors.push(`${rel}: affiliate url present but status '${card.links.affiliate.status}' does not confirm access`);
  }

  for (const v of card.variants) {
    refCheck(v.eligibility.evidence, `variant ${v.id} eligibility`);
    refCheck(v.kyc.evidence, `variant ${v.id} kyc`);
    const overlap = v.eligibility.residence_allowed.filter((c: string) => v.eligibility.residence_excluded.includes(c));
    if (overlap.length) errors.push(`${rel}: variant ${v.id} lists ${overlap.join(',')} as both allowed and excluded`);

    for (const t of v.tiers) {
      refCheck(t.access.evidence, `tier ${t.id} access`);
      if (t.access.type === 'subscription' && !t.access.amount) errors.push(`${rel}: tier ${t.id} subscription without amount`);
      if ((t.access.type === 'holding' || t.access.type === 'lock') && !t.access.token) errors.push(`${rel}: tier ${t.id} holding/lock without token`);

      const feeTypes = new Set<string>();
      for (const f of t.fees) {
        refCheck(f.evidence, `tier ${t.id} fee ${f.type}`);
        if (feeTypes.has(f.type)) errors.push(`${rel}: tier ${t.id} has duplicate fee type ${f.type}`);
        feeTypes.add(f.type);
        if (f.kind === 'unknown' && f.status !== 'unknown') errors.push(`${rel}: tier ${t.id} fee ${f.type}: kind=unknown requires status=unknown`);
        if ((f.kind === 'fixed' || f.kind === 'fixed_plus_percent') && !f.amount) errors.push(`${rel}: tier ${t.id} fee ${f.type}: fixed fee without amount`);
        if ((f.kind === 'percent' || f.kind === 'fixed_plus_percent') && f.percent === undefined) errors.push(`${rel}: tier ${t.id} fee ${f.type}: percent fee without percent`);
        if (f.amount && f.amount.currency !== v.currency) warnings.push(`${rel}: tier ${t.id} fee ${f.type} currency ${f.amount.currency} differs from variant currency ${v.currency}`);
        if (f.kind !== 'none' && f.kind !== 'unknown' && f.type !== 'issuance' && f.type !== 'delivery' && !f.period) errors.push(`${rel}: tier ${t.id} fee ${f.type}: recurring/variable fee needs a period`);
      }
      // Fee types the calculator needs an answer for. Absence = unknown (never free).
      for (const required of ['subscription', 'fx', 'atm_withdrawal', 'topup']) {
        if (!feeTypes.has(required)) warnings.push(`${rel}: tier ${t.id} has no '${required}' fee entry → treated as unknown by the calculator`);
      }
      if (t.access.type === 'subscription' && !feeTypes.has('subscription')) errors.push(`${rel}: tier ${t.id} is subscription-gated but lists no subscription fee`);

      for (const r of t.rewards) {
        refCheck(r.evidence, `tier ${t.id} reward ${r.type}`);
        if (r.type !== 'non_monetary' && r.type !== 'signup_bonus' && r.percent === undefined) errors.push(`${rel}: tier ${t.id} reward ${r.type} needs a percent`);
        if (r.type === 'signup_bonus' && !r.fixed) errors.push(`${rel}: tier ${t.id} signup_bonus needs a fixed amount`);
        if (r.type === 'promotional' && !r.valid_until) errors.push(`${rel}: tier ${t.id} promotional reward needs valid_until (expiry is applied by date)`);
        if (r.type === 'conditional_max' && (!r.requires || r.requires === 'none') && !r.conditions) errors.push(`${rel}: tier ${t.id} conditional_max must state its condition`);
        if (r.payout.kind === 'fiat' && r.payout.code && r.payout.code !== v.currency) warnings.push(`${rel}: tier ${t.id} reward paid in ${r.payout.code}, variant currency ${v.currency}`);
      }
    }
  }

  if (card.record_status === 'published') {
    if (!card.freshness.last_content_verified_at) errors.push(`${rel}: published record without last_content_verified_at`);
    if (card.product_status !== 'active' && card.product_status !== 'waitlist') errors.push(`${rel}: published record with product_status ${card.product_status}`);
    for (const e of card.evidence) if (e.source_type === 'demo' || e.source_type === 'third_party') errors.push(`${rel}: published record relies on ${e.source_type} evidence ${e.id}`);
    for (const v of card.variants) {
      if (!MATERIAL_STATUSES_OK_FOR_PUBLISH.has(v.eligibility.status ?? 'unknown')) errors.push(`${rel}: published variant ${v.id} eligibility not verified`);
      if (!MATERIAL_STATUSES_OK_FOR_PUBLISH.has(v.kyc.status)) errors.push(`${rel}: published variant ${v.id} kyc not verified`);
      for (const t of v.tiers) for (const r of t.rewards) if (r.type === 'base' && !MATERIAL_STATUSES_OK_FOR_PUBLISH.has(r.status)) errors.push(`${rel}: published tier ${t.id} base reward not verified`);
    }
  }
}

// Affiliate programs
for (const file of [...listJson(join(ROOT, 'data/affiliate')), ...listJson(join(ROOT, 'data/demo/affiliate'))]) {
  const rel = file.replace(ROOT + '/', '');
  let p: unknown;
  try { p = loadJson(file); } catch (e) { errors.push(`${rel}: invalid JSON`); continue; }
  if (!validateProgram(p)) for (const e of validateProgram.errors ?? []) errors.push(`${rel}: ${e.instancePath || '/'} ${e.message}`);
}

// Brand marks: a logo file may only be used with a recorded official source and date; every recorded file must exist.
{
  const manifestFile = join(ROOT, 'data/logos/manifest.json');
  if (existsSync(manifestFile)) {
    const marks = (loadJson(manifestFile) as { marks: Record<string, { logo?: string | null; source_url?: string | null; accessed_at?: string | null; color?: string | null }> }).marks;
    for (const [id, m] of Object.entries(marks)) {
      if (!m.logo) continue;
      if (!m.source_url || !m.accessed_at) errors.push(`data/logos/manifest.json: ${id} has a logo file without source_url/accessed_at`);
      if (!existsSync(join(ROOT, 'public/logos', m.logo))) errors.push(`data/logos/manifest.json: ${id} references missing file public/logos/${m.logo}`);
      if (m.color && !/^#[0-9a-f]{6}$/i.test(m.color)) errors.push(`data/logos/manifest.json: ${id} color must be a 6-digit hex`);
    }
    for (const f of readdirSync(join(ROOT, 'public/logos'))) if (f.endsWith('.svg') && !Object.values(marks).some((m) => m.logo === f)) errors.push(`public/logos/${f} is not recorded in data/logos/manifest.json`);
  }
}

for (const w of warnings) console.warn('WARN ', w);
for (const e of errors) console.error('ERROR', e);
console.log(`validate-data: ${cardFiles.length} card record(s) checked, ${errors.length} error(s), ${warnings.length} warning(s)`);
process.exit(errors.length ? 1 : 0);
