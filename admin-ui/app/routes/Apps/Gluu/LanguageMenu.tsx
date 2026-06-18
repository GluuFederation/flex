import { useState, useEffect, use, useMemo, useCallback, memo, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import Box from '@mui/material/Box'
import { GluuDropdown, type GluuDropdownOption, ChevronIcon } from 'Components'
import GluuText from 'Routes/Apps/Gluu/GluuText'
import { ThemeContext } from 'Context/theme/themeContext'
import { THEME_DARK, DEFAULT_THEME } from '@/context/theme/constants'
import { storage } from '@/utils/storage'
import { ensureLocaleLoaded } from '@/i18n'
import { STORAGE_KEYS, LANG_CODES, DEFAULT_LANG } from '@/constants'
import { useStyles } from './styles/LanguageMenu.style'
import type { LanguageMenuProps } from './types'

interface UserConfig {
  lang?: Record<string, string>
  theme?: Record<string, string>
}

const safeParseUserConfig = (): UserConfig =>
  storage.getJSON<UserConfig>(STORAGE_KEYS.USER_CONFIG) ?? {}

const getInitialLang = (inum?: string): string => {
  const initLang = storage.get(STORAGE_KEYS.INIT_LANG) || DEFAULT_LANG
  const config = safeParseUserConfig()
  return config?.lang?.[inum || ''] || initLang
}

const LanguageMenu = memo<LanguageMenuProps>(({ userInfo }) => {
  const { t, i18n } = useTranslation()
  const { inum } = userInfo
  const themeContext = use(ThemeContext)
  const currentTheme = themeContext?.state?.theme || DEFAULT_THEME
  const isDark = currentTheme === THEME_DARK
  const { classes } = useStyles({ isDark })

  const hasInitializedRef = useRef(false)
  const prevInumRef = useRef<string | undefined>(inum)
  const [lang, setLang] = useState<string>(() => getInitialLang(inum))

  useEffect(() => {
    if (prevInumRef.current !== inum) {
      hasInitializedRef.current = false
      prevInumRef.current = inum
    }

    if (hasInitializedRef.current) return

    const userLang = getInitialLang(inum)
    if (userLang !== i18n.language) {
      setLang(userLang)
      void ensureLocaleLoaded(userLang).then(() => i18n.changeLanguage(userLang))
    }

    hasInitializedRef.current = true
  }, [i18n, inum])

  const changeLanguage = useCallback(
    (code: string) => {
      setLang(code)
      void ensureLocaleLoaded(code).then(() => i18n.changeLanguage(code))

      const config = safeParseUserConfig()
      const langConfig = { ...(config?.lang || {}) }
      if (inum) {
        langConfig[inum] = code
      }
      const newConfig = { ...config, lang: langConfig }
      storage.setJSON(STORAGE_KEYS.USER_CONFIG, newConfig)
      storage.set(STORAGE_KEYS.INIT_LANG, code)
    },
    [i18n, inum],
  )

  const options: GluuDropdownOption<string>[] = useMemo(
    () => [
      { value: LANG_CODES.EN, label: t('languages.english') },
      { value: LANG_CODES.FR, label: t('languages.french') },
      { value: LANG_CODES.PT, label: t('languages.portuguese') },
      { value: LANG_CODES.ES, label: t('languages.spanish') },
    ],
    [t],
  )

  return (
    <GluuDropdown
      renderTrigger={(isOpen) => (
        <Box className={classes.trigger} data-testid="ACTIVE_LANG">
          <GluuText variant="span" disableThemeColor>
            {lang.toUpperCase()}
          </GluuText>
          <Box className={`${classes.chevron} ${isOpen ? classes.chevronOpen : ''}`}>
            <ChevronIcon />
          </Box>
        </Box>
      )}
      options={options}
      position="bottom"
      selectedValue={lang}
      onSelect={changeLanguage}
      minWidth={67}
      showArrow={true}
    />
  )
})

LanguageMenu.displayName = 'LanguageMenu'

export { LanguageMenu }
