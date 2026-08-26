/**
 * Country reference data for form phone fields.
 *
 * `min`/`max` are the digit counts of the *national* number — what's left after
 * the international dial code and any trunk prefix are stripped. Ranges are
 * deliberately a little generous: rejecting a real customer's number is far
 * worse than accepting a malformed one, since the row still reaches the sheet
 * either way.
 *
 * `prefix` pins the first digit(s) where a country has a firm rule worth
 * enforcing (India's mobile range, Singapore's 6/8/9, and so on).
 */

export type Country = {
  /** ISO 3166-1 alpha-2. */
  code: string;
  name: string;
  /** International dial code, including the leading "+". */
  dial: string;
  /** National number length, in digits. */
  min: number;
  max: number;
  /** Optional constraint on how the national number starts. */
  prefix?: RegExp;
  /** Shown when `prefix` fails — says what a valid number looks like instead of
   *  just declaring the input wrong. */
  prefixHint?: string;
};

export const COUNTRIES: Country[] = [
  {
    code: "IN",
    name: "India",
    dial: "+91",
    min: 10,
    max: 10,
    prefix: /^[6-9]/,
    prefixHint: "Indian mobile numbers start with 6, 7, 8 or 9.",
  },
  {
    code: "US",
    name: "United States",
    dial: "+1",
    min: 10,
    max: 10,
    prefix: /^[2-9]/,
    prefixHint: "A US area code can't start with 0 or 1.",
  },
  {
    code: "CA",
    name: "Canada",
    dial: "+1",
    min: 10,
    max: 10,
    prefix: /^[2-9]/,
    prefixHint: "A Canadian area code can't start with 0 or 1.",
  },
  { code: "GB", name: "United Kingdom", dial: "+44", min: 9, max: 10 },
  { code: "AE", name: "United Arab Emirates", dial: "+971", min: 8, max: 9 },
  { code: "AU", name: "Australia", dial: "+61", min: 9, max: 9 },
  { code: "AT", name: "Austria", dial: "+43", min: 7, max: 13 },
  { code: "BH", name: "Bahrain", dial: "+973", min: 8, max: 8 },
  { code: "BD", name: "Bangladesh", dial: "+880", min: 10, max: 10 },
  { code: "BE", name: "Belgium", dial: "+32", min: 8, max: 9 },
  { code: "BR", name: "Brazil", dial: "+55", min: 10, max: 11 },
  { code: "CL", name: "Chile", dial: "+56", min: 9, max: 9 },
  {
    code: "CN",
    name: "China",
    dial: "+86",
    min: 11,
    max: 11,
    prefix: /^1/,
    prefixHint: "Chinese mobile numbers start with 1.",
  },
  { code: "CO", name: "Colombia", dial: "+57", min: 10, max: 10 },
  { code: "CZ", name: "Czechia", dial: "+420", min: 9, max: 9 },
  { code: "DK", name: "Denmark", dial: "+45", min: 8, max: 8 },
  { code: "EG", name: "Egypt", dial: "+20", min: 9, max: 10 },
  { code: "FI", name: "Finland", dial: "+358", min: 9, max: 10 },
  { code: "FR", name: "France", dial: "+33", min: 9, max: 9 },
  { code: "DE", name: "Germany", dial: "+49", min: 6, max: 11 },
  { code: "GR", name: "Greece", dial: "+30", min: 10, max: 10 },
  { code: "HK", name: "Hong Kong", dial: "+852", min: 8, max: 8 },
  { code: "HU", name: "Hungary", dial: "+36", min: 9, max: 9 },
  { code: "ID", name: "Indonesia", dial: "+62", min: 9, max: 12 },
  { code: "IE", name: "Ireland", dial: "+353", min: 9, max: 9 },
  { code: "IL", name: "Israel", dial: "+972", min: 9, max: 9 },
  { code: "IT", name: "Italy", dial: "+39", min: 9, max: 11 },
  { code: "JP", name: "Japan", dial: "+81", min: 9, max: 10 },
  { code: "KE", name: "Kenya", dial: "+254", min: 9, max: 9 },
  { code: "KW", name: "Kuwait", dial: "+965", min: 8, max: 8 },
  { code: "MY", name: "Malaysia", dial: "+60", min: 9, max: 10 },
  { code: "MX", name: "Mexico", dial: "+52", min: 10, max: 10 },
  { code: "NP", name: "Nepal", dial: "+977", min: 10, max: 10 },
  { code: "NL", name: "Netherlands", dial: "+31", min: 9, max: 9 },
  { code: "NZ", name: "New Zealand", dial: "+64", min: 8, max: 10 },
  { code: "NG", name: "Nigeria", dial: "+234", min: 10, max: 10 },
  { code: "NO", name: "Norway", dial: "+47", min: 8, max: 8 },
  { code: "OM", name: "Oman", dial: "+968", min: 8, max: 8 },
  { code: "PK", name: "Pakistan", dial: "+92", min: 10, max: 10 },
  { code: "PH", name: "Philippines", dial: "+63", min: 10, max: 10 },
  { code: "PL", name: "Poland", dial: "+48", min: 9, max: 9 },
  { code: "PT", name: "Portugal", dial: "+351", min: 9, max: 9 },
  { code: "QA", name: "Qatar", dial: "+974", min: 8, max: 8 },
  { code: "RO", name: "Romania", dial: "+40", min: 9, max: 9 },
  { code: "RU", name: "Russia", dial: "+7", min: 10, max: 10 },
  { code: "SA", name: "Saudi Arabia", dial: "+966", min: 9, max: 9 },
  {
    code: "SG",
    name: "Singapore",
    dial: "+65",
    min: 8,
    max: 8,
    prefix: /^[689]/,
    prefixHint: "Singapore numbers start with 6, 8 or 9.",
  },
  { code: "ZA", name: "South Africa", dial: "+27", min: 9, max: 9 },
  { code: "KR", name: "South Korea", dial: "+82", min: 9, max: 10 },
  { code: "ES", name: "Spain", dial: "+34", min: 9, max: 9 },
  { code: "LK", name: "Sri Lanka", dial: "+94", min: 9, max: 9 },
  { code: "SE", name: "Sweden", dial: "+46", min: 7, max: 9 },
  { code: "CH", name: "Switzerland", dial: "+41", min: 9, max: 9 },
  { code: "TW", name: "Taiwan", dial: "+886", min: 9, max: 9 },
  { code: "TH", name: "Thailand", dial: "+66", min: 9, max: 9 },
  { code: "TR", name: "Turkey", dial: "+90", min: 10, max: 10 },
  { code: "VN", name: "Vietnam", dial: "+84", min: 9, max: 10 },
];

/** The form default. */
export const DEFAULT_COUNTRY = "IN";

const BY_CODE = new Map(COUNTRIES.map((c) => [c.code, c]));

export function getCountry(code: string): Country | undefined {
  return BY_CODE.get(code);
}

/**
 * Country names for a plain "which country are you in" select. `Other` is kept
 * as an escape hatch — the list is broad but not exhaustive, and a lead from an
 * unlisted country shouldn't be blocked from submitting.
 */
export const OTHER_COUNTRY = "Other";

export const COUNTRY_NAMES = [...COUNTRIES.map((c) => c.name), OTHER_COUNTRY];

/** Maps a country *name* back to its entry, for keeping a dial code in sync. */
export function findByName(name: string): Country | undefined {
  return COUNTRIES.find((c) => c.name === name);
}
