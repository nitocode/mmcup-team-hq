export interface Team {
  /** Stable key, also used for i18n lookups (`teams.<id>.*`). */
  id: string
  name: string
  emoji: string
  /** Optional logo under `public/logos/`. */
  logo?: string
  /** [latitude, longitude] in degrees. */
  location: [number, number]
  /** The one team with a genuinely good HQ. */
  prime?: boolean
}

export const teams: Team[] = [
  {
    id: 'truffassons',
    name: 'Truffassons',
    emoji: '🐶',
    logo: 'logos/truffassons.png',
    location: [48.8566, 2.3522],
    prime: true,
  },
  {
    id: 'quichassons',
    name: 'Quichassons',
    emoji: '🥧',
    logo: 'logos/quichassons.png',
    location: [-48.8767, -123.3933],
  },
  {
    id: 'mouflassons',
    name: 'Mouflassons',
    emoji: '🧤',
    location: [-75.2509, -0.0713],
  },
  {
    id: 'boulassons',
    name: 'Boulassons',
    emoji: '🎳',
    location: [23.4162, 25.6628],
  },
  {
    id: 'crepassons',
    name: 'Crêpassons',
    emoji: '🥞',
    logo: 'logos/crepassons.png',
    location: [-16.25, 168.12],
  },
  {
    id: 'paillassons',
    name: 'Paillassons',
    emoji: '🚪',
    logo: 'logos/paillassons.png',
    location: [27.9881, 86.925],
  },
  {
    id: 'grospoissons',
    name: 'GrosPoissons',
    emoji: '🐟',
    location: [11.3493, 142.1996],
  },
  {
    id: 'cornissons',
    name: 'Cornissons',
    emoji: '🥒',
    location: [0.3833, -159.9833],
  },
]

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
