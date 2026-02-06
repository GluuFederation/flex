import React, { useMemo } from 'react'
import { Card, CardBody } from 'Components'
import {
  XAxis,
  YAxis,
  Tooltip,
  LineChart,
  Line,
  CartesianGrid,
  ResponsiveContainer,
} from 'recharts'
import { useTranslation } from 'react-i18next'
import { useTheme } from '@/context/theme/themeContext'
import getThemeColor from '@/context/theme/config'
import { THEME_DARK } from '@/context/theme/constants'
import GluuText from 'Routes/Apps/Gluu/GluuText'
import { useMauStyles } from '../MauPage.style'
import type { MauChartProps } from '../types'
import TooltipDesign from '@/routes/Dashboards/Chart/TooltipDesign'
import { getChartColors } from '../constants'
import { formatMonth, formatNumber } from '../utils'

const MauTrendChart: React.FC<MauChartProps> = ({ data }) => {
  const { t } = useTranslation()
  const { state } = useTheme()
  const themeColors = getThemeColor(state.theme)
  const isDark = state.theme === THEME_DARK
  const { classes } = useMauStyles({
    themeColors: {
      cardBg: themeColors.dashboard.supportCard ?? themeColors.menu.background,
      text: themeColors.fontColor,
    },
    isDark,
  })
  const chartColors = useMemo(() => getChartColors(state.theme), [state.theme])

  const chartData = data.map((entry) => ({
    ...entry,
    monthLabel: formatMonth(entry.month),
  }))

  return (
    <Card className={`${classes.trendCard} mb-4`}>
      <CardBody>
        <GluuText variant="div" className={classes.trendTitle}>
          {t('titles.mau_trend')}
        </GluuText>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={themeColors.borderColor} />
            <XAxis dataKey="monthLabel" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} tickFormatter={formatNumber} />
            <Tooltip
              content={(props) => (
                <TooltipDesign
                  {...(props as React.ComponentProps<typeof TooltipDesign>)}
                  backgroundColor={themeColors.dashboard.supportCard ?? themeColors.menu.background}
                  textColor={themeColors.fontColor}
                  isDark={isDark}
                  formatter={(value: unknown) =>
                    formatNumber(typeof value === 'number' && !Number.isNaN(value) ? value : 0)
                  }
                />
              )}
            />
            <Line
              type="monotone"
              dataKey="mau"
              stroke={chartColors.mau}
              strokeWidth={2}
              dot={{ fill: chartColors.mau, strokeWidth: 2 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardBody>
    </Card>
  )
}

export default MauTrendChart
