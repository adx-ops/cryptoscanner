// @ts-check
import { defineConfig } from 'astro/config';

// Static output: every page is pre-rendered HTML (indexable, no server needed, free hosting).
// PUBLIC_SITE_URL must be set at build time for canonicals/sitemap once a domain exists.
export default defineConfig({
  output: 'static',
  site: process.env.PUBLIC_SITE_URL || 'https://example.invalid',
  trailingSlash: 'never',
  build: { format: 'file' },
});
