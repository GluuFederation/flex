import React, { use, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import Box from '@mui/material/Box'
import { OPACITY } from '@/constants'
import { ThemeContext } from 'Context/theme/themeContext'
import { THEME_DARK, DEFAULT_THEME } from '@/context/theme/constants'
import { GluuDropdown } from '../GluuDropdown'
import type { GluuDropdownOption } from '../GluuDropdown/types'
import notificationIcon from 'Images/svg/notification-icon.svg'
import { useStyles } from './Notifications.style'

const DARK_ICON_FILTER = 'brightness(0) invert(1)'
const LIGHT_ICON_FILTER =
  'brightness(0) saturate(100%) invert(26%) sepia(9%) saturate(1234%) hue-rotate(182deg) brightness(96%) contrast(89%)'

const Notifications = () => {
  const { t } = useTranslation()
  const themeContext = use(ThemeContext)

  const currentTheme = useMemo(() => {
    return themeContext?.state?.theme || DEFAULT_THEME
  }, [themeContext?.state?.theme])

  const isDark = currentTheme === THEME_DARK
  const { classes } = useStyles()

  const notificationOptions: GluuDropdownOption[] = useMemo(
    () => [
      {
        value: 'no-notifications',
        label: <span className={classes.optionLabel}>{t('notifications.no_notifications')}</span>,
      },
    ],
    [t, classes.optionLabel],
  )

  const iconFilter = useMemo(() => {
    return isDark ? DARK_ICON_FILTER : LIGHT_ICON_FILTER
  }, [isDark])

  const trigger = (
    <Box
      component="button"
      sx={{
        'position': 'relative',
        'textTransform': 'none',
        'padding': '2px',
        'cursor': 'pointer',
        'border': 'none',
        'background': 'none',
        'display': 'flex',
        'alignItems': 'center',
        'justifyContent': 'center',
        '&:hover': {
          opacity: OPACITY.OVERLAY,
        },
      }}
      onMouseDown={(e) => {
        e.preventDefault()
      }}
    >
      <img
        src={notificationIcon}
        alt="Notifications"
        className={classes.icon}
        style={{ filter: iconFilter }}
      />
    </Box>
  )

  return (
    <GluuDropdown
      trigger={trigger}
      options={notificationOptions}
      position="bottom"
      closeOnSelect={false}
      centerText={true}
    />
  )
}

export default Notifications
