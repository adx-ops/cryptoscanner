// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// Static output: every page is pre-rendered HTML (indexable, no server needed, free hosting).
// PUBLIC_SITE_URL must be set at build time for canonicals/sitemap once a domain exists.
const site = process.env.PUBLIC_SITE_URL;
const isDemo = (process.env.PUBLIC_DATASET || 'demo') !== 'verified';

export default defineConfig({
  output: 'static',
  site: site || 'https://example.invalid',
  trailingSlash: 'never',
  build: { format: 'file' },
  // Sitemap only for a verified build with a real site URL; demo builds are noindex and get none.
  integrations: site && !isDemo ? [sitemap({ filter: (p) => !/\/(compare|legal)\.html$/.test(p) && !/\/(compare|legal)$/.test(p) })] : [],
});
