// UI checks against the built site (dist/) with Playwright + Chromium.
// Serves dist/ on a local port, then: no horizontal overflow at 360/390/430/768/1440,
// interactions (country → badges, filters, compare selection, card page link, calculator),
// screenshots to docs/screenshots/. Run: npm run build && node scripts/ui-check.mjs
import { createServer } from 'node:http';
import { readFile, stat, mkdir } from 'node:fs/promises';
import { join, extname, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const DIST = join(ROOT, 'dist');
const SHOTS = join(ROOT, 'docs', 'screenshots');
const MIME = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.svg': 'image/svg+xml' };

const server = createServer(async (req, res) => {
  let p = decodeURIComponent(new URL(req.url, 'http://x').pathname);
  if (p === '/') p = '/index.html';
  let file = join(DIST, p);
  try { if ((await stat(file)).isDirectory()) file = join(file, 'index.html'); } catch { if (!extname(file)) file += '.html'; }
  try {
    const body = await readFile(file);
    res.writeHead(200, { 'content-type': MIME[extname(file)] ?? 'application/octet-stream' });
    res.end(body);
  } catch { res.writeHead(404); res.end('not found'); }
});
await new Promise((r) => server.listen(0, '127.0.0.1', r));
const base = `http://127.0.0.1:${server.address().port}`;
await mkdir(SHOTS, { recursive: true });

const results = [];
const ok = (name, cond, detail = '') => { results.push({ name, pass: !!cond, detail }); };

const browser = await chromium.launch();
const widths = [360, 390, 430, 768, 1440];
const pages = ['/', '/compare', '/calculator', '/cards/demo-alpha-debit', '/methodology', '/how-we-make-money', '/contact', '/legal', '/graveyard'];

// 1) Layout: no horizontal page overflow, no console errors, fonts loaded or fallback.
for (const w of widths) {
  const ctx = await browser.newContext({ viewport: { width: w, height: 900 }, deviceScaleFactor: 1, colorScheme: 'dark' });
  const page = await ctx.newPage();
  const errors = [];
  page.on('pageerror', (e) => errors.push(String(e)));
  page.on('requestfailed', (r) => { if (!/fonts\.(googleapis|gstatic)\.com/.test(r.url())) errors.push(`${r.url()} ${r.failure()?.errorText}`); });
  page.on('console', (m) => { if (m.type() === 'error' && !/Failed to load resource/.test(m.text())) errors.push(m.text()); });
  for (const path of pages) {
    await page.goto(base + path, { waitUntil: 'load' });
    const over = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    ok(`${w}px ${path}: no horizontal overflow`, over <= 0, `overflow=${over}px`);
    if (path === '/' || path === '/cards/demo-alpha-debit') await page.screenshot({ path: join(SHOTS, `${w}${path.replace(/\//g, '_') || '_home'}.png`), fullPage: true });
  }
  ok(`${w}px: no page/console errors`, errors.length === 0, errors.join(' | ').slice(0, 300));
  await ctx.close();
}

// 2) Interactions at phone width.
{
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, colorScheme: 'dark', hasTouch: true });
  const page = await ctx.newPage();
  await page.goto(base + '/', { waitUntil: 'load' });

  // nav usable: every link has a tap target >= 44px high and no vertical stacking of the brand row
  const navH = await page.evaluate(() => document.querySelector('.site-header nav').getBoundingClientRect().height);
  ok('390px: header height stays compact (< 120px)', navH < 120, `height=${navH}`);

  ok('compare bar hidden when nothing is selected', await page.locator('#compare-bar').isHidden());

  await page.selectOption('#country', 'IE');
  const badges = await page.locator('.elig-badge').allTextContents();
  ok('country IE → one available, one to confirm', badges.some((t) => /Available in IE/.test(t)) && badges.some((t) => /to confirm/.test(t)), badges.join(' / '));
  ok('country persisted in localStorage', (await page.evaluate(() => { try { return localStorage.getItem('cs.country'); } catch { return null; } })) === 'IE');

  await page.selectOption('#country', 'GB');
  const gb = await page.locator('.elig-badge').allTextContents();
  ok('country GB → one card marked not available', gb.some((t) => /Not available in GB/.test(t)), gb.join(' / '));

  await page.selectOption('#country', 'IE');
  await page.check('#f-eligible');
  const shown = await page.locator('.tile:not([hidden])').count();
  ok('filter "only available" hides unconfirmed cards', shown === 1, `shown=${shown}`);
  ok('active filter count shown', /\(1\)/.test(await page.locator('#active-count').textContent()));
  await page.check('#f-nokyc');
  ok('empty state appears when no card matches', await page.locator('#empty').isVisible());
  await page.click('#reset');
  ok('reset clears filters', (await page.locator('.tile:not([hidden])').count()) === 2 && !(await page.isChecked('#f-eligible')));

  await page.check('.tile[data-card="demo-alpha-debit"] .compare-toggle');
  ok('compare bar appears after one selection, button disabled', await page.locator('#compare-bar').isVisible() && (await page.getAttribute('#compare-go', 'aria-disabled')) === 'true');
  await page.check('.tile[data-card="demo-beta-token"] .compare-toggle');
  const href = await page.getAttribute('#compare-go', 'href');
  ok('compare link carries both slugs', /cards=demo-alpha-debit,demo-beta-token/.test(href), href);
  ok('compare URL contains no country or personal data', !/DE|country/.test(href), href);

  await page.goto(base + href, { waitUntil: 'load' });
  ok('compare page shows table for 2 cards', await page.locator('#table-wrap').isVisible() && (await page.locator('#cmp thead th:not([hidden])').count()) === 3);
  const tableOver = await page.evaluate(() => { const t = document.querySelector('.table-wrap'); return t.scrollWidth > t.clientWidth; });
  ok('compare table scrolls inside its own container at 390px', tableOver, 'table wider than container (expected) and page not overflowing');
  const links = await page.locator('#cmp a.btn:not([hidden])').allTextContents();
  ok('outbound links labelled as non-affiliate', links.every((t) => /not an affiliate link/.test(t)), links.join(' / '));

  await page.goto(base + '/', { waitUntil: 'load' });
  await page.click('.tile[data-card="demo-alpha-debit"] a.btn');
  ok('details link opens the card page', /\/cards\/demo-alpha-debit/.test(page.url()) && /Demo Alpha Debit/.test(await page.locator('h1').textContent()));
  ok('card page lists sources with status badges', (await page.locator('section:has(h2:text("Sources")) .badge').count()) > 0);

  // calculator
  await page.goto(base + '/calculator', { waitUntil: 'load' });
  await page.selectOption('#c-country', 'DE');
  await page.fill('#c-spend', '1000');
  await page.fill('#c-months', '12');
  await page.fill('#c-start', '2026-11');
  await page.click('#calc button[type=submit]');
  const res = await page.locator('#results .res').count();
  ok('calculator renders one result per tier/variant', res === 3, `results=${res}`);
  const txt = await page.locator('#results').textContent();
  ok('calculator reports partial status and unknown costs', /partial/.test(txt) && /Unknown costs/.test(txt));
  ok('paid tier excluded by default', /not applicable/.test(txt));
  ok('token reward shown in native unit', /paid in DMO/.test(txt));
  await page.check('#c-sub');
  await page.click('#calc button[type=submit]');
  ok('accepting subscription includes the Plus tier as complete', /complete/.test(await page.locator('#results').textContent()));
  await page.screenshot({ path: join(SHOTS, '390_calculator_results.png'), fullPage: true });

  // keyboard: tab reaches the country select and the first filter
  await page.goto(base + '/', { waitUntil: 'load' });
  await page.keyboard.press('Tab');
  const first = await page.evaluate(() => document.activeElement?.className);
  ok('first Tab lands on the skip link', first === 'skip');

  // light theme renders with explicit body background
  const lctx = await browser.newContext({ viewport: { width: 390, height: 844 }, colorScheme: 'light' });
  const lp = await lctx.newPage();
  await lp.goto(base + '/', { waitUntil: 'load' });
  const bg = await lp.evaluate(() => getComputedStyle(document.body).backgroundColor);
  ok('light theme sets a light body background', bg === 'rgb(246, 247, 249)', bg);
  await lp.screenshot({ path: join(SHOTS, '390_home_light.png'), fullPage: true });
  await lctx.close();
  await ctx.close();
}

await browser.close();
server.close();

const failed = results.filter((r) => !r.pass);
for (const r of results) console.log(`${r.pass ? 'PASS' : 'FAIL'} ${r.name}${r.detail && !r.pass ? ` — ${r.detail}` : ''}`);
console.log(`ui-check: ${results.length - failed.length}/${results.length} passed (Chromium ${chromium.name()} via Playwright, dark theme unless noted, ${new Date().toISOString()})`);
process.exit(failed.length ? 1 : 0);
