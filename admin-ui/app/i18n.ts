import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import type { InitOptions } from 'i18next'

import translationEn from './locales/en/translation.json'
import translationFr from './locales/fr/translation.json'
import translationPt from './locales/pt/translation.json'
import translationEs from './locales/es/translation.json'

const isDev = process.env.NODE_ENV === 'development'

const i18nConfig: InitOptions = {
  resources: {
    en: {
      translation: translationEn,
    },
    fr: {
      translation: translationFr,
    },
    pt: {
      translation: translationPt,
    },
    es: {
      translation: translationEs,
    },
  },
  fallbackLng: 'en',
  debug: false,
  ns: ['translation'],
  defaultNS: 'translation',
  keySeparator: '.',
  react: {
    useSuspense: false,
  },
  interpolation: {
    escapeValue: false, // React already escapes HTML for XSS protection, so we don't need i18next to escape
    // This prevents double-escaping which causes &#39; to appear instead of '
  },

  parseMissingKeyHandler: isDev
    ? (key: string, defaultValue?: string) => {
        console.warn(`[i18n] Missing translation key: "${key}"`)
        return defaultValue ?? key
      }
    : undefined,
}

i18n.use(initReactI18next).init(i18nConfig)

export default i18n
