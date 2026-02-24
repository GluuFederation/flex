import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import type { InitOptions } from 'i18next'

import translationEn from './locales/en/translation.json'
import translationFr from './locales/fr/translation.json'
import translationPt from './locales/pt/translation.json'
import translationEs from './locales/es/translation.json'
import { isDevelopment } from './utils/env'

const handleMissingKey = (key: string, defaultValue?: string): string => {
  if (isDevelopment) {
    console.warn(
      `[i18n] Missing translation key: "${key}"`,
      defaultValue !== undefined ? `(default: "${defaultValue}")` : '',
    )
    // eslint-disable-next-line @typescript-eslint/no-require-imports -- use require for react-toastify
    const { toast } = require('react-toastify')
    toast.warning(`[i18n] Missing translation key: "${key}"`, {
      autoClose: 5000,
      toastId: `i18n-missing-${key}`,
    })
  }
  return defaultValue ?? key
}

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
    escapeValue: false,
  },

  parseMissingKeyHandler: isDevelopment ? handleMissingKey : undefined,
}

i18n.use(initReactI18next).init(i18nConfig)

export default i18n
