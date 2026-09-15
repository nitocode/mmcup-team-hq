export interface Team {
  /** Stable key, also used for i18n lookups (`teams.<id>.*`). */
  id: string
  name: string
  /** Logo under `public/logos/`. A team without one is not shown. */
  logo: string
  /** [latitude, longitude] in degrees. */
  location: [number, number]
  /** The one team with a genuinely good HQ. */
  prime?: boolean
}

type RosterEntry = Omit<Team, 'logo'> & { logo?: string }

/**
 * Every team of the competition. Drop a `<id>.png` file in `public/logos/` and
 * point `logo` at it to make the team appear on the globe.
 */
const roster: RosterEntry[] = [
  {
    id: 'truffassons',
    name: 'Truffassons',
    logo: 'logos/truffassons.png',
    location: [48.8566, 2.3522],
    prime: true,
  },
  {
    id: 'quichassons',
    name: 'Quichassons',
    logo: 'logos/quichassons.png',
    location: [-48.8767, -123.3933],
  },
  {
    id: 'mouflassons',
    name: 'Mouflassons',
    location: [-75.2509, -0.0713],
  },
  {
    id: 'boulassons',
    name: 'Boulassons',
    location: [23.4162, 25.6628],
  },
  {
    id: 'crepassons',
    name: 'Crêpassons',
    logo: 'logos/crepassons.png',
    location: [-16.25, 168.12],
  },
  {
    id: 'paillassons',
    name: 'Paillassons',
    logo: 'logos/paillassons.png',
    location: [27.9881, 86.925],
  },
  {
    id: 'grospoissons',
    name: 'GrosPoissons',
    location: [11.3493, 142.1996],
  },
  {
    id: 'cornissons',
    name: 'Cornissons',
    location: [0.3833, -159.9833],
  },
]

/** Teams placed on the globe: only those whose logo is available. */
export const teams: Team[] = roster.filter((team): team is Team => Boolean(team.logo))

/** Formats a coordinate pair as e.g. `48.86° N, 2.35° E`. */
export function formatCoordinates([lat, lng]: [number, number]): string {
  const ns = lat >= 0 ? 'N' : 'S'
  const ew = lng >= 0 ? 'E' : 'W'
  return `${Math.abs(lat).toFixed(2)}° ${ns}, ${Math.abs(lng).toFixed(2)}° ${ew}`
}

/** Resolves a `public/` asset path against the configured Vite base URL. */
export function assetUrl(path: string): string {
  return `${import.meta.env.BASE_URL}${path}`
}
