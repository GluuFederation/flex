import React, { useContext, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { ThemeContext } from 'Context/theme/themeContext'
import { GluuDropdown, type GluuDropdownOption } from 'Components'
import notificationIcon from 'Images/svg/notification-icon.svg'
import Box from '@mui/material/Box'

const Notifications = () => {
  const { t } = useTranslation()
  const themeContext = useContext(ThemeContext)

  const currentTheme = useMemo(() => {
    return themeContext?.state?.theme || 'light'
  }, [themeContext?.state?.theme])

  const isDark = currentTheme === 'dark'

  const notificationOptions: GluuDropdownOption[] = useMemo(
    () => [
      {
        value: 'no-notifications',
        label: <span style={{ whiteSpace: 'nowrap' }}>{t('notifications.no_notifications')}</span>,
      },
    ],
    [t],
  )

  const iconFilter = useMemo(() => {
    if (isDark) {
      return 'brightness(0) invert(1)'
    }
    return 'brightness(0) saturate(100%) invert(26%) sepia(9%) saturate(1234%) hue-rotate(182deg) brightness(96%) contrast(89%)'
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
          opacity: 0.8,
        },
      }}
      onMouseDown={(e) => {
        e.preventDefault()
      }}
    >
      <img
        src={notificationIcon}
        alt="Notifications"
        style={{
          width: '26px',
          height: '26px',
          display: 'block',
          filter: iconFilter,
        }}
      />
    </Box>
  )

  return (
    <GluuDropdown
      trigger={trigger}
      options={notificationOptions}
      position="bottom"
      closeOnSelect={false}
    />
  )
}

export default Notifications
