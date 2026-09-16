import React, { useMemo } from 'react'
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

  const tooltipClasses = useMemo(() => ({ tooltip: classes.infoTooltip }), [classes.infoTooltip])
  const slotProps = useMemo(
    () => ({ tooltip: { style: { backgroundColor: cardBg, color: themeColors.fontColor } } }),
    [cardBg, themeColors.fontColor],
  )

  if (!title) return <>{children}</>

  return (
    <Tooltip title={title} placement={placement} classes={tooltipClasses} slotProps={slotProps}>
      <span className={classes.infoTooltipAnchor}>{children}</span>
    </Tooltip>
  )
}

export default React.memo(SecurityInfoTooltip)
