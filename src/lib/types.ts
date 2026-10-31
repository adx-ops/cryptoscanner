// Hand-written TypeScript mirror of data/schema/card.schema.json (schema 1.0.0).
// The JSON Schema is authoritative; keep both in sync (scripts/validate-data.ts enforces the schema at build time).

export type Verification = 'verified' | 'calculated' | 'hypothesis' | 'unknown' | 'stale' | 'contradictory';
export type RecordStatus = 'candidate' | 'validated' | 'needs_review' | 'published' | 'stale' | 'rejected' | 'retired';
export type ProductStatus = 'active' | 'waitlist' | 'suspended' | 'closed' | 'unknown';
export type Category = 'debit' | 'prepaid' | 'credit' | 'crypto_backed_credit';
export type Period = 'once' | 'month' | 'year' | 'per_transaction' | 'per_day';

export interface Money { amount: number; currency: string }

export interface Evidence {
  id: string;
  url: string;
  title: string;
  source_type: string;
  excerpt?: string;
  accessed_at: string;
  effective_from?: string | null;
  expires_at?: string | null;
  scope?: { countries?: string[]; currency?: string; note?: string };
  verification: Verification;
  contradiction_note?: string;
}

export type FeeType = 'issuance' | 'delivery' | 'renewal' | 'subscription' | 'topup' | 'conversion' | 'fx' | 'atm_withdrawal' | 'inactivity' | 'other';
export type FeeKind = 'none' | 'fixed' | 'percent' | 'fixed_plus_percent' | 'unknown';

export interface Fee {
  type: FeeType;
  kind: FeeKind;
  amount?: Money;
  percent?: number;
  min?: Money;
  max?: Money;
  period?: Period;
  free_allowance?: { amount?: Money; count?: number; period?: Period };
  conditions?: string;
  evidence?: string[];
  status: Verification;
}

export type RewardType = 'base' | 'conditional_max' | 'promotional' | 'signup_bonus' | 'non_monetary';
export type Requires = 'none' | 'subscription' | 'holding' | 'lock';

export interface Reward {
  type: RewardType;
  percent?: number;
  fixed?: Money;
  payout: { kind: 'fiat' | 'token' | 'points' | 'other'; code?: string };
  requires?: Requires;
  cap?: { amount: Money; period: Period; basis?: 'reward' | 'spend' };
  min_spend?: Money;
  excluded_categories?: string[];
  conditions?: string;
  valid_from?: string | null;
  valid_until?: string | null;
  description?: string;
  evidence?: string[];
  status: Verification;
}

export interface TierAccess {
  type: 'free' | 'subscription' | 'holding' | 'lock';
  amount?: Money;
  period?: Period;
  token?: string;
  token_amount?: number;
  lock_months?: number;
  note?: string;
  evidence?: string[];
  status: Verification;
}

export interface Tier {
  id: string;
  name: string;
  access: TierAccess;
  fees: Fee[];
  rewards: Reward[];
  limits?: { type: string; amount?: Money; period?: Period; note?: string; status: Verification }[];
  mobile_wallets?: string[];
  mobile_wallets_status?: Verification;
}

export interface Eligibility {
  residence_allowed: string[];
  residence_excluded: string[];
  default_for_unlisted: 'to_confirm' | 'ineligible';
  nationality_restrictions_note?: string;
  delivery_countries?: string[];
  usage_note?: string;
  evidence?: string[];
  status?: Verification;
}

export interface Kyc {
  initial_verification: 'required' | 'not_required_initially' | 'unknown';
  editorial_level: 'light' | 'standard' | 'enhanced' | 'unknown';
  requirements?: string[];
  thresholds_note?: string;
  stages_note?: string;
  evidence?: string[];
  status: Verification;
}

export interface Variant {
  id: string;
  region_label: string;
  currency: string;
  eligibility: Eligibility;
  kyc: Kyc;
  tiers: Tier[];
}

export interface CardRecord {
  schema_version: '1.0.0';
  id: string;
  slug: string;
  name: string;
  brand: string;
  provider_id: string;
  issuer?: { name?: string; status?: Verification; evidence?: string[] };
  network?: 'visa' | 'mastercard' | 'other' | 'unknown';
  category: Category;
  record_status: RecordStatus;
  product_status: ProductStatus;
  is_demo: boolean;
  form_factors: ('virtual' | 'physical')[];
  custody: 'custodial' | 'self_custodial' | 'hybrid' | 'unknown';
  funding?: Record<string, unknown>;
  credit_terms?: Record<string, unknown> | null;
  variants: Variant[];
  evidence: Evidence[];
  links: {
    official_url: string;
    affiliate: { program_id?: string | null; status: string; url?: string | null };
  };
  freshness: { last_content_verified_at: string | null; last_auto_check_at?: string | null };
  changelog: { date: string; field: string; from?: unknown; to?: unknown; reason: string; evidence?: string[]; actor?: string }[];
  editorial: { good_for?: string[]; not_for?: string[]; watch_outs?: string[]; summary?: string };
}
