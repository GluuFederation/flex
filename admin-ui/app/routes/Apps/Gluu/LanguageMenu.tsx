import { useState, useEffect, useContext, useMemo, useCallback, memo, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import Box from '@mui/material/Box'
import { GluuDropdown, type GluuDropdownOption, ChevronIcon } from 'Components'
import GluuText from 'Routes/Apps/Gluu/GluuText'
import { ThemeContext } from 'Context/theme/themeContext'
import { THEME_DARK, DEFAULT_THEME } from '@/context/theme/constants'
import { devLogger } from '@/utils/devLogger'
import { useStyles } from './styles/LanguageMenu.style'
import type { LanguageMenuProps } from './types'

interface UserConfig {
  lang?: Record<string, string>
  theme?: Record<string, string>
}

const DEFAULT_LANG = 'en'

const safeParseUserConfig = (): UserConfig => {
  try {
    return JSON.parse(localStorage.getItem('userConfig') || '{}') || {}
  } catch (error) {
    devLogger.warn('Failed to parse userConfig:', error)
    return {}
  }
}

const getInitialLang = (inum?: string): string => {
  const initLang = localStorage.getItem('initLang') || DEFAULT_LANG
  const config = safeParseUserConfig()
  return config?.lang?.[inum || ''] || initLang
}

const LanguageMenu = memo<LanguageMenuProps>(({ userInfo }) => {
  const { t, i18n } = useTranslation()
  const { inum } = userInfo
  const themeContext = useContext(ThemeContext)
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
      i18n.changeLanguage(userLang)
      setLang(userLang)
    }

    hasInitializedRef.current = true
  }, [i18n, inum])

  const changeLanguage = useCallback(
    (code: string) => {
      i18n.changeLanguage(code)
      setLang(code)

      const config = safeParseUserConfig()
      const langConfig = { ...(config?.lang || {}) }
      if (inum) {
        langConfig[inum] = code
      }
      const newConfig = { ...config, lang: langConfig }
      localStorage.setItem('userConfig', JSON.stringify(newConfig))
    },
    [i18n, inum],
  )

  const options: GluuDropdownOption<string>[] = useMemo(
    () => [
      { value: 'en', label: t('languages.english') },
      { value: 'fr', label: t('languages.french') },
      { value: 'pt', label: t('languages.portuguese') },
      { value: 'es', label: t('languages.spanish') },
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
