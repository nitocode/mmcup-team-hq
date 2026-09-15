import { createI18n } from 'vue-i18n'
import en from './en'
import fr from './fr'

export type Locale = 'en' | 'fr'
export const SUPPORTED_LOCALES: Locale[] = ['en', 'fr']
const STORAGE_KEY = 'mmcup-locale'

function detectLocale(): Locale {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved === 'en' || saved === 'fr') return saved
  } catch {
    /* storage unavailable */
  }
  const nav = (navigator.language || 'en').toLowerCase()
  return nav.startsWith('fr') ? 'fr' : 'en'
}

export const i18n = createI18n({
  legacy: false,
  locale: detectLocale(),
  fallbackLocale: 'en',
  messages: { en, fr },
})

export function setLocale(locale: Locale) {
  i18n.global.locale.value = locale
  document.documentElement.lang = locale
  try {
    localStorage.setItem(STORAGE_KEY, locale)
  } catch {
    /* storage unavailable */
  }
}

document.documentElement.lang = i18n.global.locale.value
