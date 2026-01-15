import React, { useMemo, useCallback, memo } from 'react'
import { useTranslation } from 'react-i18next'
import Box from '@mui/material/Box'
import { GluuDropdown, type GluuDropdownOption } from 'Components'
import { useTheme } from '@/context/theme/themeContext'
import { THEME_LIGHT, THEME_DARK, isValidTheme, type ThemeValue } from '@/context/theme/constants'
import { useStyles } from './styles/ThemeDropdown.style'
import type { ThemeDropdownComponentProps } from './types'

export const ThemeDropdownComponent = memo<ThemeDropdownComponentProps>(({ userInfo }) => {
  const { t } = useTranslation()
  const { state, dispatch } = useTheme()
  const currentTheme = state.theme
  const isDark = currentTheme === THEME_DARK
  const { classes } = useStyles({ isDark })

  const onChangeTheme = useCallback(
    (value: string) => {
      if (!isValidTheme(value)) {
        console.warn('Invalid theme value:', value)
        return
      }

      const themeValue: ThemeValue = value

      if (!userInfo) {
        dispatch({ type: themeValue })
        return
      }

      const { inum } = userInfo
      if (!inum) {
        dispatch({ type: themeValue })
        return
      }

      try {
        const existingConfigStr = localStorage.getItem('userConfig')
        const existingConfig = existingConfigStr
          ? (JSON.parse(existingConfigStr) as {
              theme?: Record<string, string>
              lang?: Record<string, string>
            })
          : {}

        const updatedTheme = {
          ...(existingConfig.theme || {}),
          [inum]: themeValue,
        }

        const newConfig = {
          ...existingConfig,
          lang: existingConfig.lang || {},
          theme: updatedTheme,
        }

        localStorage.setItem('userConfig', JSON.stringify(newConfig))
      } catch (e) {
        console.debug('Failed to parse userConfig:', e)
        const newConfig = {
          lang: {},
          theme: { [inum]: themeValue },
        }
        localStorage.setItem('userConfig', JSON.stringify(newConfig))
      }

      dispatch({ type: themeValue })
    },
    [userInfo, dispatch],
  )

  const options: GluuDropdownOption<string>[] = useMemo(
    () => [
      {
        value: THEME_LIGHT,
        label: <span className={classes.optionLabel}>{t('themes.light')}</span>,
      },
      {
        value: THEME_DARK,
        label: <span className={classes.optionLabel}>{t('themes.dark')}</span>,
      },
    ],
    [classes, t],
  )

  return (
    <GluuDropdown
      renderTrigger={(isOpen) => (
        <Box className={classes.trigger}>
          <span>{t('themes.theme')}</span>
          <i className={`fa ${isOpen ? 'fa-angle-up' : 'fa-angle-down'} ${classes.chevron}`} />
        </Box>
      )}
      options={options}
      position="bottom"
      selectedValue={currentTheme}
      onSelect={(value) => onChangeTheme(value)}
      minWidth={120}
      showArrow={true}
    />
  )
})

ThemeDropdownComponent.displayName = 'ThemeDropdownComponent'
