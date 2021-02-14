import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
i18n
  .use(initReactI18next)
  .use(LanguageDetector)
  .init({
    // we init with resources
    resources: {
      en: {
        translation: {
          french: 'French',
          english: 'English',
        },
      },
      fr: {
        translation: {
          french: 'Français',
          english: 'Anglais',
        },
      },
    },
    fallbackLng: 'en',
    debug: true,
    // have a common namespace used around the full app
    ns: ['translation'],
    defaultNS: 'translation',
    keySeparator: false, // we use content as keys
    interpolation: {},
    react: {
      wait: true,
    },
  })
export default i18n
