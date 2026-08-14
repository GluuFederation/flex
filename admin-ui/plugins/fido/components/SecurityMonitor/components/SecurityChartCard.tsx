import React from 'react'
import { Card, CardBody } from 'Components'
import { GluuBadge } from '@/components/GluuBadge'
import GluuText from 'Routes/Apps/Gluu/GluuText'
import { getBadgeBackground, getBadgeTextColor } from '../utils'
import { useSecurityTheme } from '../hooks'
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
  emptyInset,
  emptyCompact,
  accentColor,
  headerExtra,
  children,
}) => {
  const { themeColors, isDark } = useSecurityTheme()
  const { classes, cx } = useSecurityStyles({ isDark, themeColors })
  const statusTone = statusColor ?? themeColors.badges.statusInactive
  const statusBackground = getBadgeBackground(
    statusTone,
    isDark,
    themeColors.badges.statusInactiveBg,
  )

  const statusText = getBadgeTextColor(statusTone, isDark)

  return (
    <Card
      className={`${classes.chartCard} h-100`}
      style={accentColor ? { borderColor: accentColor } : undefined}
    >
      <CardBody className={classes.chartCardBody}>
        <div className={classes.chartHeader}>
          <div>
            <GluuText variant="div" className={classes.chartTitle}>
              {title}
            </GluuText>
            {subtitle ? <div className={classes.chartSubtitle}>{subtitle}</div> : null}
          </div>
          <div className={classes.chartHeaderRight}>
            {headerExtra}
            {statusLabel ? (
              <GluuBadge pill backgroundColor={statusBackground} textColor={statusText}>
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
        <div className={classes.chartBody}>
          {children}
          {isEmpty ? (
            <div
              className={cx(classes.emptyState, emptyCompact && classes.emptyStateCompact)}
              style={emptyInset}
            >
              {emptyLabel}
            </div>
          ) : null}
        </div>
      </CardBody>
    </Card>
  )
}

export default React.memo(SecurityChartCard)
