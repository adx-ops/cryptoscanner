// Downloads the official card images recorded in data/images/manifest.json into public/card-images/,
// resized to at most 1400px on the long side and encoded as WebP. Only entries whose file is missing
// (or --force) are fetched. Runs in GitHub Actions (the cloud workspace has no outbound web access).
import { readFileSync, existsSync, writeFileSync, mkdirSync } from 'node:fs';
import { join, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const OUT = join(ROOT, 'public/card-images');
const force = process.argv.includes('--force');
const manifest = JSON.parse(readFileSync(join(ROOT, 'data/images/manifest.json'), 'utf8'));
mkdirSync(OUT, { recursive: true });
let changed = 0, failed = 0;
for (const [slug, m] of Object.entries(manifest.images)) {
  const target = join(OUT, m.file);
  if (existsSync(target) && !force) continue;
  if (!m.asset_url || !m.source_page || !m.accessed_at) { console.error(`${slug}: entry incomplete, skipped`); failed++; continue; }
  try {
    const res = await fetch(m.asset_url, { headers: { 'user-agent': 'cryptoscanner-image-fetch/1.0 (+https://github.com/adx-ops/cryptoscanner)' } });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const buf = Buffer.from(await res.arrayBuffer());
    const out = await sharp(buf).resize({ width: 1400, height: 1400, fit: 'inside', withoutEnlargement: true }).webp({ quality: 82 }).toBuffer();
    writeFileSync(target, out);
    console.log(`${slug}: ${m.asset_url} → public/card-images/${m.file} (${Math.round(out.length / 1024)} KB)`);
    changed++;
  } catch (e) { console.error(`${slug}: failed — ${e.message}`); failed++; }
}
console.log(`fetch-card-images: ${changed} written, ${failed} failed`);
process.exit(failed && !changed ? 1 : 0);
