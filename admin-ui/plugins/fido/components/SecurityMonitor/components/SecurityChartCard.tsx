import React, { useMemo } from 'react'
import { Card, CardBody } from 'Components'
import { GluuBadge } from '@/components/GluuBadge'
import GluuText from 'Routes/Apps/Gluu/GluuText'
import { useTheme } from '@/context/theme/themeContext'
import getThemeColor from '@/context/theme/config'
import { THEME_DARK } from '@/context/theme/constants'
import { useSecurityStyles } from '../SecurityMonitorPage.style'
import type { SecurityChartCardProps } from '../types'

const SecurityChartCard: React.FC<SecurityChartCardProps> = ({
  title,
  subtitle,
  statusLabel,
  statusColor,
  legend,
  isEmpty,
  emptyLabel,
  accentColor,
  headerExtra,
  children,
}) => {
  const { state } = useTheme()
  const themeColors = useMemo(() => getThemeColor(state.theme), [state.theme])
  const isDark = state.theme === THEME_DARK
  const { classes } = useSecurityStyles({ isDark, themeColors })

  return (
    <Card
      className={`${classes.chartCard} h-100`}
      style={accentColor ? { borderColor: accentColor } : undefined}
    >
      <CardBody style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        <div className={classes.chartHeader}>
          <div>
            <GluuText variant="div" className={classes.chartTitle} style={{ margin: 0 }}>
              {title}
            </GluuText>
            {subtitle ? <div className={classes.chartSubtitle}>{subtitle}</div> : null}
          </div>
          <div className={classes.chartHeaderRight}>
            {headerExtra}
            {statusLabel ? (
              <GluuBadge
                pill
                backgroundColor={themeColors.badges.statusInactiveBg}
                textColor={statusColor ?? themeColors.badges.statusInactive}
              >
                {statusLabel}
              </GluuBadge>
            ) : null}
          </div>
        </div>
        {legend?.length ? (
          <div className={classes.legendRow}>
            {legend.map((item) => (
              <span key={item.label} className={classes.legendItem}>
                <span className={classes.legendDot} style={{ backgroundColor: item.color }} />
                {item.label}
              </span>
            ))}
          </div>
        ) : null}
        {isEmpty ? <div className={classes.emptyState}>{emptyLabel}</div> : children}
      </CardBody>
    </Card>
  )
}

export default React.memo(SecurityChartCard)
