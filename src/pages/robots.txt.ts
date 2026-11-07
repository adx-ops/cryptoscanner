import type { APIRoute } from 'astro';
// Served at the site root once a custom domain is used; on github.io project pages it is informative only.
export const GET: APIRoute = () => {
  const base = (import.meta.env.BASE_URL ?? '/').replace(/\/$/, '');
  const noindex = import.meta.env.PUBLIC_NOINDEX === '1' || import.meta.env.PUBLIC_DATASET !== 'verified';
  const site = import.meta.env.PUBLIC_SITE_URL;
  const lines = noindex
    ? ['User-agent: *', 'Disallow: /']
    : ['User-agent: *', `Disallow: ${base}/go/`, ...(site ? [`Sitemap: ${new URL(`${base}/sitemap-index.xml`, site).toString()}`] : [])];
  return new Response(lines.join('\n') + '\n', { headers: { 'content-type': 'text/plain' } });
};
