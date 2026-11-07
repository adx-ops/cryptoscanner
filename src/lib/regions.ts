// World regions used for the "Best crypto cards in <region>" pages. A region page is built only when at
// least one published card names at least one of its countries as an allowed residence — pages appear
// by themselves as the agents publish cards, and never exist empty.
import type { CardRecord } from './types.ts';
import { defaultVariantAndTier } from './data.ts';

export interface Region { slug: string; name: string; short: string; countries: string[] }

const EEA = ['AT','BE','BG','HR','CY','CZ','DK','EE','FI','FR','DE','GR','HU','IS','IE','IT','LV','LI','LT','LU','MT','NL','NO','PL','PT','RO','SK','SI','ES','SE'];

export const REGIONS: Region[] = [
  { slug: 'europe', name: 'Europe', short: 'Europe', countries: [...EEA, 'GB', 'CH', 'AD', 'MC', 'SM', 'VA', 'AL', 'BA', 'ME', 'MK', 'RS', 'MD', 'UA', 'GE', 'AM', 'TR', 'XK'] },
  { slug: 'united-kingdom', name: 'the United Kingdom', short: 'UK', countries: ['GB'] },
  { slug: 'usa', name: 'the United States', short: 'USA', countries: ['US'] },
  { slug: 'canada', name: 'Canada', short: 'Canada', countries: ['CA'] },
  { slug: 'latin-america', name: 'Latin America', short: 'LatAm', countries: ['MX','GT','BZ','SV','HN','NI','CR','PA','CO','VE','EC','PE','BO','BR','PY','UY','AR','CL','DO','PR','JM','TT','BS','BB','HT','CU','GY','SR'] },
  { slug: 'asia-pacific', name: 'Asia-Pacific', short: 'APAC', countries: ['AU','NZ','JP','KR','SG','HK','TW','MY','TH','VN','PH','ID','IN','PK','BD','LK','NP','KH','LA','MN','BN','MO','FJ','PG'] },
  { slug: 'middle-east-africa', name: 'the Middle East and Africa', short: 'MEA', countries: ['AE','SA','QA','KW','BH','OM','JO','LB','IL','EG','MA','TN','DZ','NG','KE','ZA','GH','TZ','UG','RW','ET','SN','CI','CM','ZM','ZW','BW','NA','MU','AO','MZ'] },
];

/** Countries of a region in which the card's default variant explicitly lists residents as allowed (excluded ones removed). */
export function allowedIn(card: CardRecord, region: Region): string[] {
  const { variant } = defaultVariantAndTier(card);
  const allowed = new Set(variant.eligibility.residence_allowed);
  const excluded = new Set(variant.eligibility.residence_excluded);
  return region.countries.filter((c) => allowed.has(c) && !excluded.has(c));
}

export function regionsWithCards(cards: CardRecord[]): { region: Region; cards: CardRecord[] }[] {
  return REGIONS.map((region) => ({ region, cards: cards.filter((c) => allowedIn(c, region).length > 0) }))
    .filter((r) => r.cards.length > 0);
}
