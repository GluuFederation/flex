import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import translationEn from './locales/en/translation.json';
import translationFr from './locales/fr/translation.json';
import translationPt from './locales/pt/translation.json';

i18n
  .use(initReactI18next)
  .init({
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
      wait: true,
      useSuspense : false
    },
  });
export default i18n;
