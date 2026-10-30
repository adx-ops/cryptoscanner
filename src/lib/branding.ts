import manifest from '../../data/logos/manifest.json';
import { url } from './data.ts';

export interface BrandMarkInfo { brand: string; logo: string | null; shape?: 'wordmark' | 'mark'; color: string | null; source_url: string | null; accessed_at: string | null }
const MARKS = (manifest as { marks: Record<string, BrandMarkInfo> }).marks;

/** Official logo path for a provider, or null when no sourced file is recorded (→ monogram). */
export function logoFor(providerId: string): string | null {
  const m = MARKS[providerId];
  return m?.logo && m.source_url && m.accessed_at ? url(`/logos/${m.logo}`) : null;
}

/** 'wordmark' (horizontal lockup, shown alone) or 'mark' (symbol, shown with the brand name). */
export function shapeFor(providerId: string): 'wordmark' | 'mark' {
  return MARKS[providerId]?.shape === 'mark' ? 'mark' : 'wordmark';
}

/** Brand colour recorded from an official source, or null. */
export function brandColorFor(providerId: string): string | null {
  return MARKS[providerId]?.color ?? null;
}

/** Up to two initials for the monogram fallback. "Crypto.com" → "C", "Gnosis Pay" → "GP". */
export function initialsFor(brand: string): string {
  const words = brand.replace(/\(.*?\)/g, '').replace(/[^A-Za-z0-9 ]/g, ' ').trim().split(/\s+/).filter(Boolean);
  return words.slice(0, 2).map((w) => w[0]).join('').toUpperCase() || '?';
}

/** Deterministic hue (0–359) from the provider id, so each card face gets its own tint without recording anything. */
export function tintHue(providerId: string): number {
  let h = 0;
  for (const ch of providerId) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
  return h % 360;
}
