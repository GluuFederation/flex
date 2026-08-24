import React, { useMemo } from 'react'
import { useTheme } from '@/context/theme/themeContext'
import getThemeColor from '@/context/theme/config'
import { THEME_DARK } from '@/context/theme/constants'
import { CHART_AXIS } from '@/constants'
import TooltipDesign from '@/routes/Dashboards/Chart/TooltipDesign'
import type { ChartTheme, ChartTooltipFormatter, ChartTooltipProps } from './types'

const useChartTheme = (): ChartTheme => {
  const { state } = useTheme()

  return useMemo(() => {
    const themeColors = getThemeColor(state.theme)
    const isDark = state.theme === THEME_DARK
    const cardBg = themeColors.settings?.cardBackground ?? themeColors.card?.background

    const renderTooltip = (props: ChartTooltipProps, formatter?: ChartTooltipFormatter) => (
      <TooltipDesign
        payload={props.payload}
        active={props.active}
        backgroundColor={cardBg}
        textColor={themeColors.fontColor}
        isDark={isDark}
        formatter={formatter}
      />
    )

    return {
      themeColors,
      isDark,
      cardBg,
      gridProps: {
        strokeDasharray: CHART_AXIS.GRID_DASH,
        stroke: themeColors.borderColor,
      },
      axisTick: {
        fill: themeColors.fontColor,
        fontSize: CHART_AXIS.TICK_FONT_SIZE,
      },
      renderTooltip,
    }
  }, [state.theme])
}

export { useChartTheme }
