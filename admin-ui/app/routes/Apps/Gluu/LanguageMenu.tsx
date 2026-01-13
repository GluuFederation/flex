import { useState, useEffect, useContext, useMemo, useCallback, memo } from 'react'
import { useTranslation } from 'react-i18next'
import Box from '@mui/material/Box'
import { GluuDropdown, type GluuDropdownOption } from 'Components'
import { ThemeContext } from 'Context/theme/themeContext'
import { useStyles } from './styles/LanguageMenu.style'
import type { LanguageMenuProps } from './types'

const ChevronIcon = memo(() => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true" focusable="false">
    <path
      d="M4.5 6.75L9 11.25L13.5 6.75"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
))
ChevronIcon.displayName = 'ChevronIcon'

const LanguageMenu = memo<LanguageMenuProps>(({ userInfo }) => {
  const initLang = useMemo(() => localStorage.getItem('initLang') || 'en', [])
  const initTheme = useMemo(() => localStorage.getItem('initTheme') || 'light', [])
  const safeParseUserConfig = useCallback(() => {
    try {
      return (
        (JSON.parse(localStorage.getItem('userConfig') || '{}') as {
          lang?: Record<string, string>
          theme?: Record<string, string>
        }) || {}
      )
    } catch (error) {
      console.warn('Failed to parse userConfig:', error)
      return {}
    }
  }, [])

  const userConfig = useMemo(() => safeParseUserConfig(), [safeParseUserConfig])
  const userConfigLang = useMemo(() => userConfig?.lang || {}, [userConfig])
  const userConfigTheme = useMemo(() => userConfig?.theme || {}, [userConfig])
  const [lang, setLang] = useState<string>('en')
  const [langUpdated, setLangUpdated] = useState(false)
  const [themeUpdated, setThemeUpdated] = useState(false)
  const { t, i18n } = useTranslation()
  const { inum } = userInfo
  const themeContext = useContext(ThemeContext)
  const currentTheme = themeContext?.state?.theme || 'light'
  const isDark = currentTheme === 'dark'
  const { classes } = useStyles({ isDark })

  const changeLanguage = useCallback(
    (code: string) => {
      i18n.changeLanguage(code)
      setLang(code)
      const langConfig = { ...userConfigLang }
      if (inum) {
        langConfig[inum] = code
      }
      const newConfig = { lang: langConfig, theme: userConfigTheme }
      localStorage.setItem('userConfig', JSON.stringify(newConfig))
    },
    [i18n, userConfigLang, userConfigTheme, inum],
  )

  useEffect(() => {
    const currentLang = userConfigLang[inum || ''] || initLang
    const currentThemeValue = userConfigTheme[inum || ''] || initTheme

    if (currentLang !== initLang && !langUpdated) {
      i18n.changeLanguage(currentLang)
      setLang(currentLang)
      setLangUpdated(true)
    }

    if (currentThemeValue !== initTheme && !themeUpdated && themeContext) {
      themeContext.dispatch({ type: currentThemeValue })
      setThemeUpdated(true)
    }
  }, [
    userConfigLang,
    userConfigTheme,
    langUpdated,
    themeUpdated,
    inum,
    initLang,
    initTheme,
    i18n,
    themeContext,
  ])

  const options: GluuDropdownOption<string>[] = useMemo(
    () => [
      {
        value: 'en',
        label: t('languages.english'),
        onClick: () => changeLanguage('en'),
      },
      {
        value: 'fr',
        label: t('languages.french'),
        onClick: () => changeLanguage('fr'),
      },
      {
        value: 'pt',
        label: t('languages.portuguese'),
        onClick: () => changeLanguage('pt'),
      },
      {
        value: 'es',
        label: t('languages.spanish'),
        onClick: () => changeLanguage('es'),
      },
    ],
    [t, changeLanguage],
  )

  return (
    <GluuDropdown
      renderTrigger={(isOpen) => (
        <Box className={classes.trigger} data-testid="ACTIVE_LANG">
          <span>{lang.toUpperCase()}</span>
          <Box className={`${classes.chevron} ${isOpen ? classes.chevronOpen : ''}`}>
            <ChevronIcon />
          </Box>
        </Box>
      )}
      options={options}
      position="bottom"
      selectedValue={lang}
      minWidth={67}
      showArrow={true}
    />
  )
})

LanguageMenu.displayName = 'LanguageMenu'

export { LanguageMenu }
