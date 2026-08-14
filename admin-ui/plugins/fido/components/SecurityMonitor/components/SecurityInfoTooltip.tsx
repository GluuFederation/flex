import React from 'react'
import Tooltip from '@mui/material/Tooltip'
import { useChartTheme } from '@/hooks/useChartTheme'
import { useSecurityStyles } from '../SecurityMonitorPage.style'
import type { SecurityInfoTooltipProps } from '../types'

// Wraps the shared chart tooltip look so the KPI captions read the same as the tooltips the
// graphs below them render, instead of the dark pill the generic Gluu tooltip paints.
const SecurityInfoTooltip: React.FC<SecurityInfoTooltipProps> = ({
  title,
  placement = 'top',
  children,
}) => {
  const { themeColors, isDark, cardBg } = useChartTheme()
  const { classes } = useSecurityStyles({ isDark, themeColors })

  if (!title) return <>{children}</>

  return (
    <Tooltip
      title={title}
      placement={placement}
      classes={{ tooltip: classes.infoTooltip }}
      slotProps={{
        tooltip: { style: { backgroundColor: cardBg, color: themeColors.fontColor } },
      }}
    >
      <span className={classes.infoTooltipAnchor}>{children}</span>
    </Tooltip>
  )
}

export default React.memo(SecurityInfoTooltip)
