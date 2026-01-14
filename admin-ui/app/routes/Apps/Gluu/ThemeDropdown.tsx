import React, { useContext, useMemo, useCallback, memo } from 'react'
import { useTranslation } from 'react-i18next'
import Box from '@mui/material/Box'
import { GluuDropdown, type GluuDropdownOption } from 'Components'
import { ThemeContext } from 'Context/theme/themeContext'
import { useStyles } from './styles/ThemeDropdown.style'
import type { ThemeDropdownComponentProps } from './types'

export const ThemeDropdownComponent = memo<ThemeDropdownComponentProps>(({ userInfo }) => {
  const { t } = useTranslation()
  const themeContext = useContext(ThemeContext)
  const { state, dispatch } = themeContext || { state: { theme: 'light' }, dispatch: undefined }
  const currentTheme = useMemo(() => {
    return state?.theme || 'light'
  }, [state?.theme])
  const isDark = currentTheme === 'dark'
  const { classes } = useStyles({ isDark })

  const onChangeTheme = useCallback(
    (value: string) => {
      if (!dispatch) {
        console.warn('Theme dispatch is not available')
        return
      }

      if (!userInfo) {
        dispatch({ type: value })
        return
      }

      const { inum } = userInfo
      if (!inum) {
        dispatch({ type: value })
        return
      }

      try {
        const existingConfigStr = localStorage.getItem('userConfig')
        const existingConfig = existingConfigStr ? JSON.parse(existingConfigStr) : {}

        const updatedTheme = {
          ...(existingConfig.theme || {}),
          [inum]: value,
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
          theme: { [inum]: value },
        }
        localStorage.setItem('userConfig', JSON.stringify(newConfig))
      }

      dispatch({ type: value })
    },
    [userInfo, dispatch],
  )

  const options: GluuDropdownOption<string>[] = useMemo(
    () => [
      {
        value: 'light',
        label: <span className={classes.optionLabel}>{t('themes.light')}</span>,
      },
      {
        value: 'dark',
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
      onSelect={(value) => onChangeTheme(value as string)}
      minWidth={120}
      showArrow={true}
    />
  )
})

ThemeDropdownComponent.displayName = 'ThemeDropdownComponent'
