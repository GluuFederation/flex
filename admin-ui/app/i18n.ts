import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import type { InitOptions } from 'i18next'
import translationEn from './locales/en/translation.json'
import { isDevelopment } from './utils/env'
import { devLogger } from './utils/devLogger'
import { hmrAccept } from '@/utils/hmr'
import { toast } from 'react-toastify'

const LAZY_LOCALE_LOADERS: Record<string, () => Promise<{ default: typeof translationEn }>> = {
  es: () => import('./locales/es/translation.json'),
  fr: () => import('./locales/fr/translation.json'),
  pt: () => import('./locales/pt/translation.json'),
}

const handleMissingKey = (key: string, defaultValue?: string): string => {
  devLogger.warn(
    `[i18n] Missing translation key: "${key}"`,
    defaultValue !== undefined ? `(default: "${defaultValue}")` : '',
  )
  if (isDevelopment) {
    toast.warning(`[i18n] Missing translation key: "${key}"`, {
      autoClose: 5000,
      toastId: `i18n-missing-${key}`,
    })
  }
  return defaultValue ?? key
}

const getSavedLanguage = (): string => {
  try {
    const initLang = localStorage.getItem('initLang')
    if (initLang) return initLang
    const config = JSON.parse(localStorage.getItem('userConfig') || '{}')
    const langs = config?.lang
    if (langs && typeof langs === 'object') {
      const values = Object.values(langs) as string[]
      if (values.length > 0) return values[values.length - 1]
    }
  } catch (error) {
    devLogger.warn(
      'Failed to read saved language from localStorage:',
      error instanceof Error ? error : String(error),
    )
  }
  return 'en'
}

export const ensureLocaleLoaded = async (lng: string): Promise<void> => {
  const base = (lng || '').split('-')[0]
  if (!base || base === 'en' || i18n.hasResourceBundle(base, 'translation')) return
  const loader = LAZY_LOCALE_LOADERS[base]
  if (!loader) return
  try {
    const mod = await loader()
    i18n.addResourceBundle(base, 'translation', mod.default, true, true)
  } catch (error) {
    devLogger.warn(
      `[i18n] Failed to load "${base}" translations:`,
      error instanceof Error ? error : String(error),
    )
  }
}

const savedLanguage = getSavedLanguage()

const i18nConfig: InitOptions = {
  resources: {
    en: {
      translation: translationEn,
    },
  },
  lng: savedLanguage,
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

i18n.on('languageChanged', (lng: string) => {
  void ensureLocaleLoaded(lng)
})

void ensureLocaleLoaded(savedLanguage)

hmrAccept<{ default: typeof translationEn }>('./locales/en/translation.json', (m) => {
  if (m) i18n.addResourceBundle('en', 'translation', m.default, true, true)
})

export default i18n
