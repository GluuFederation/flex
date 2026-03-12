import { memo, useMemo } from 'react'
import Tooltip from '@mui/material/Tooltip'
import GluuText from 'Routes/Apps/Gluu/GluuText'
import { STATUS_LABEL_KEYS } from '@/constants'
import { useTheme } from '@/context/theme/themeContext'
import { THEME_DARK, THEME_LIGHT } from '@/context/theme/constants'
import getThemeColor from '@/context/theme/config'
import type { ServiceStatusValue } from '@/constants'

type ClassesType = Record<string, string>

interface StatusIndicatorProps {
  label: string
  status: ServiceStatusValue
  classes: ClassesType
  t: (key: string) => string
}

export const StatusIndicator = memo<StatusIndicatorProps>(({ label, status, classes, t }) => {
  const isUp = status === 'up'
  const serverName = t(label)
  const translationKey = STATUS_LABEL_KEYS[status]
  const tooltipTitle = `${serverName} - ${t(translationKey)}`
  const { state: themeState } = useTheme()
  const isDark = themeState?.theme === THEME_DARK

  const tooltipStyles = useMemo(() => {
    const lightTheme = getThemeColor(THEME_LIGHT)
    const bg = isDark ? lightTheme.menu.background : lightTheme.fontColor
    const fg = isDark ? lightTheme.fontColor : lightTheme.card.background
    return {
      tooltip: { backgroundColor: bg, color: fg, maxWidth: '45vw', fontSize: '0.875rem' },
      arrow: { color: bg },
    }
  }, [isDark])

  return (
    <Tooltip
      title={tooltipTitle}
      arrow
      slotProps={{
        tooltip: { sx: tooltipStyles.tooltip },
        arrow: { sx: tooltipStyles.arrow },
      }}
    >
      <div className={classes.statusIndicator}>
        <div
          className={`${classes.statusDot} ${
            isUp ? classes.statusDotActive : classes.statusDotInactive
          }`}
        />
        <GluuText variant="span" className={classes.statusTitle}>
          {serverName}
        </GluuText>
      </div>
    </Tooltip>
  )
})

StatusIndicator.displayName = 'StatusIndicator'
