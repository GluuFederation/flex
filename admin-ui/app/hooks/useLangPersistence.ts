import { useCallback, useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { i18n as I18n } from 'i18next'
import { ensureLocaleLoaded } from '@/i18n'
import { logger } from '@/utils/logger'
import { storage } from '@/utils/storage'
import { STORAGE_KEYS, DEFAULT_LANG } from '@/constants'
import { safeParseUserConfig } from '@/utils/userConfig'

const getInitialLang = (inum?: string): string => {
  const initLang = storage.get(STORAGE_KEYS.INIT_LANG) || DEFAULT_LANG
  const config = safeParseUserConfig()
  return config.lang?.[inum || ''] || initLang
}

const applyLanguage = (code: string, i18nInstance: I18n) => {
  void ensureLocaleLoaded(code)
    .then(() => i18nInstance.changeLanguage(code))
    .catch((error) => {
      logger.error(
        `Failed to switch language to "${code}":`,
        error instanceof Error ? error : String(error),
      )
    })
}

const useLangPersistence = (inum?: string) => {
  const { i18n } = useTranslation()
  const [lang, setLang] = useState<string>(() => getInitialLang(inum))
  const hasInitializedRef = useRef(false)
  const prevInumRef = useRef<string | undefined>(inum)

  useEffect(() => {
    if (prevInumRef.current !== inum) {
      hasInitializedRef.current = false
      prevInumRef.current = inum
    }

    if (hasInitializedRef.current) return

    const userLang = getInitialLang(inum)
    if (userLang !== i18n.language) {
      setLang(userLang)
      applyLanguage(userLang, i18n)
    }

    hasInitializedRef.current = true
  }, [i18n, inum])

  const changeLanguage = useCallback(
    (code: string) => {
      setLang(code)
      applyLanguage(code, i18n)

      const config = safeParseUserConfig()
      const langConfig = { ...(config.lang || {}) }
      if (inum) {
        langConfig[inum] = code
      }
      storage.setJSON(STORAGE_KEYS.USER_CONFIG, { ...config, lang: langConfig })
      storage.set(STORAGE_KEYS.INIT_LANG, code)
    },
    [i18n, inum],
  )

  return { lang, changeLanguage }
}

export { useLangPersistence, getInitialLang }
