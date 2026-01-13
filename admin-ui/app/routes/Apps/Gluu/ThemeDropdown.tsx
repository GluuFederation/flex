import React, { useContext, useMemo, useCallback, memo } from 'react'
import { useTranslation } from 'react-i18next'
import { GluuDropdown, type GluuDropdownOption } from 'Components'
import { ThemeContext } from 'Context/theme/themeContext'
import Box from '@mui/material/Box'
import { useStyles } from './styles/ThemeDropdown.style'
import type { ThemeDropdownComponentProps } from './types'

const ChevronIcon = memo(() => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
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

export const ThemeDropdownComponent = memo<ThemeDropdownComponentProps>(({ userInfo }) => {
  const { t } = useTranslation()
  const themeContext = useContext(ThemeContext)
  const currentTheme = useMemo(() => {
    return themeContext?.state?.theme || 'light'
  }, [themeContext?.state?.theme])
  const isDark = currentTheme === 'dark'
  const { classes } = useStyles({ isDark })

  const onChangeTheme = useCallback(
    (value: string) => {
      const existingConfig = JSON.parse(localStorage.getItem('userConfig') || '{}')
      const lang = existingConfig?.lang || {}
      const theme = existingConfig?.theme || {}

      const { inum } = userInfo
      if (inum) {
        theme[inum] = value
      }

      const newConfig = { lang, theme }
      localStorage.setItem('userConfig', JSON.stringify(newConfig))

      themeContext?.dispatch({ type: value })
    },
    [userInfo, themeContext],
  )

  const options: GluuDropdownOption<string>[] = useMemo(
    () => [
      {
        value: 'light',
        label: <span className={classes.optionLabel}>{t('themes.light')}</span>,
        onClick: () => onChangeTheme('light'),
      },
      {
        value: 'dark',
        label: <span className={classes.optionLabel}>{t('themes.dark')}</span>,
        onClick: () => onChangeTheme('dark'),
      },
    ],
    [classes, t, onChangeTheme],
  )

  return (
    <GluuDropdown
      renderTrigger={(isOpen) => (
        <Box className={classes.trigger}>
          <span>{t('themes.theme')}</span>
          <Box className={`${classes.chevron} ${isOpen ? classes.chevronOpen : ''}`}>
            <ChevronIcon />
          </Box>
        </Box>
      )}
      options={options}
      position="bottom"
      selectedValue={currentTheme}
      minWidth={120}
      showArrow={true}
    />
  )
})

ThemeDropdownComponent.displayName = 'ThemeDropdownComponent'
