/**
 * Trivima installations by state, for the interactive map on /trivima.
 * `stateId` must match an id in `india-map-paths.ts`.
 *
 * Where the source list didn't name a city, the institution was placed by
 * its known campus location. Flag flag any correction to Marketing before the
 * next content pass.
 */

export type Installation = {
  name: string;
  city?: string;
  model: string;
};

export type StateInstallations = {
  stateId: string;
  installations: Installation[];
};

export const STATE_INSTALLATIONS: StateInstallations[] = [
  {
    stateId: "delhi",
    installations: [
      { name: "AIIMS", city: "Delhi", model: "Trivima Advanced" },
      { name: "IIT Delhi", model: "Trivima NP" },
      { name: "Reconstructive Healthcare", model: "Trivima NP" },
    ],
  },
  {
    stateId: "uttar-pradesh",
    installations: [
      { name: "Shiv Nadar University", model: "Trivima Dual Mini" },
      { name: "King George Medical University", city: "Lucknow", model: "Trivima One" },
    ],
  },
  {
    stateId: "rajasthan",
    installations: [
      { name: "Central University of Rajasthan", model: "Trivima Advanced" },
    ],
  },
  {
    stateId: "gujarat",
    installations: [
      { name: "NIPER, Ahmedabad", model: "Trivima Advanced" },
    ],
  },
  {
    stateId: "maharashtra",
    installations: [
      { name: "HiMedia Laboratories", model: "Two Trivima Bioprinters" },
      { name: "Somaiya Vidyavihar", model: "Trivima Basic" },
      { name: "KORE AMMR", model: "Two Trivima Bioprinters" },
      { name: "DY Patil", city: "Kolhapur", model: "Trivima Basic" },
      { name: "Agharkar Research Institute", city: "Pune", model: "Trivima Advanced" },
    ],
  },
  {
    stateId: "goa",
    installations: [{ name: "BITS Goa", model: "Trivima Basic" }],
  },
  {
    stateId: "karnataka",
    installations: [
      { name: "IIT Dharwad", model: "Trivima Advanced" },
      { name: "BMS College of Engineering", city: "Bengaluru", model: "Trivima Mini" },
      { name: "RV College of Engineering", city: "Bengaluru", model: "Trivima Advanced" },
      { name: "Manipal University", model: "Trivima NP" },
      { name: "University of Agricultural Sciences", city: "Raichur", model: "Trivima NP" },
    ],
  },
  {
    stateId: "kerala",
    installations: [
      { name: "Manipal University", city: "Mahe", model: "Trivima Advanced" },
      { name: "Moopens Medical College", city: "Wayanad", model: "Trivima Pro" },
      { name: "XL Additive Manufacturing", model: "Trivima Advanced" },
      { name: "Chinmaya Vidya Vishwapeetham", model: "Trivima NP" },
    ],
  },
  {
    // NIAB, IIT Hyderabad and BITS Hyderabad are all in Hyderabad, which is
    // Telangana (split from Andhra Pradesh in 2014): the map's state IDs
    // now follow that split too, see india-map-paths.ts.
    stateId: "telangana",
    installations: [
      { name: "NIAB", city: "Hyderabad", model: "Trivima Basic" },
      { name: "IIT Hyderabad", model: "Trivima NP" },
      { name: "BITS Hyderabad", model: "Trivima Advanced" },
    ],
  },
  {
    stateId: "tamil-nadu",
    installations: [
      { name: "SASTRA Deemed University", city: "Thanjavur", model: "Trivima Advanced" },
      { name: "IIT Madras", model: "Three Trivima Bioprinters" },
      { name: "Central Leather Research Institute", city: "Chennai", model: "Four Trivima Bioprinters" },
      { name: "Sathyabama University", city: "Chennai", model: "Trivima Pro" },
      { name: "Saveetha Medical College", city: "Chennai", model: "Trivima Basic" },
    ],
  },
  {
    stateId: "west-bengal",
    installations: [
      { name: "JIS University", city: "Kolkata", model: "Two Trivima Bioprinters" },
      { name: "IIT Kharagpur", model: "Trivima Advanced" },
      { name: "NIPER Kolkata", model: "Trivima Pro & Trivima Aura" },
    ],
  },
];

/** Not on the India map, shown as a separate international line beneath it. */
export const INTERNATIONAL_INSTALLATIONS: Installation[] = [
  { name: "Suwon University", city: "Incheon, South Korea", model: "Trivima Basic" },
];

export function getStateInstallations(stateId: string): Installation[] {
  return STATE_INSTALLATIONS.find((s) => s.stateId === stateId)?.installations ?? [];
}

export const INSTALLED_STATE_IDS = new Set(STATE_INSTALLATIONS.map((s) => s.stateId));

export const TOTAL_INSTALLATIONS = STATE_INSTALLATIONS.reduce(
  (sum, s) => sum + s.installations.length,
  0
);
