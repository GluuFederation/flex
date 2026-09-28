import React, { useMemo } from 'react'
import { GluuBadge } from '@/components/GluuBadge'
import { getBadgeBackground, getBadgeTextColor } from '../utils'
import SecurityInfoTooltip from './SecurityInfoTooltip'
import { useSecurityTheme } from '../hooks'
import { useSecurityStyles } from '../SecurityMonitorPage.style'
import type { SecurityChartCardProps } from '../types'
import { ChartCard, ChartLegend } from 'Plugins/fido/shared/charts'

const renderLegendHint = (hint: React.ReactNode, content: React.ReactNode) => (
  <SecurityInfoTooltip title={hint}>{content}</SecurityInfoTooltip>
)

const SecurityChartCard: React.FC<SecurityChartCardProps> = ({
  title,
  subtitle,
  statusLabel,
  statusColor,
  legend,
  isEmpty,
  emptyLabel,
  emptyInset,
  accentColor,
  headerExtra,
  children,
}) => {
  const { themeColors, isDark } = useSecurityTheme()
  const { classes } = useSecurityStyles({ isDark, themeColors })
  const statusTone = statusColor ?? themeColors.badges.statusInactive
  const statusBackground = getBadgeBackground(
    statusTone,
    isDark,
    themeColors.badges.statusInactiveBg,
  )

  const statusText = getBadgeTextColor(statusTone, isDark)

  const legendItems = useMemo(
    () =>
      (legend ?? []).map((item) => ({
        key: item.label,
        color: item.color,
        label: item.label,
        labelColor: item.color,
        hint: item.hint,
      })),
    [legend],
  )

  const statusBadge = statusLabel ? (
    <GluuBadge pill backgroundColor={statusBackground} textColor={statusText}>
      {statusLabel}
    </GluuBadge>
  ) : null

  const extras =
    headerExtra || statusBadge ? (
      <>
        {headerExtra}
        {statusBadge}
      </>
    ) : undefined

  return (
    <ChartCard
      title={title}
      caption={subtitle}
      accentColor={accentColor}
      headerExtra={extras}
      cardClassName="h-100"
      bodyClassName={classes.chartCardBody}
      zoomable
      isEmpty={isEmpty}
    >
      {(isFullscreen, zoom) => (
        <>
          <div className={classes.chartBody}>
            {children(isFullscreen, zoom)}
            {isEmpty ? (
              <div className={classes.emptyState} style={emptyInset}>
                {emptyLabel}
              </div>
            ) : null}
          </div>
          {legendItems.length ? (
            <ChartLegend renderHint={renderLegendHint} items={legendItems} />
          ) : null}
        </>
      )}
    </ChartCard>
  )
}

export default React.memo(SecurityChartCard)
