import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import type { InitOptions } from 'i18next'

import translationEn from './locales/en/translation.json'
import translationFr from './locales/fr/translation.json'
import translationPt from './locales/pt/translation.json'

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
  },
  fallbackLng: 'en',
  debug: false,
  ns: ['translation'],
  defaultNS: 'translation',
  keySeparator: '.',
  react: {
    useSuspense: false
  },
}

i18n
  .use(initReactI18next)
  .init(i18nConfig)

export default i18n
