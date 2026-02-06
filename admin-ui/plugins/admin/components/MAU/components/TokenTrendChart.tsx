import React, { useMemo } from 'react'
import { Card, CardBody } from 'Components'
import {
  XAxis,
  YAxis,
  Tooltip,
  AreaChart,
  Area,
  CartesianGrid,
  ResponsiveContainer,
  Legend,
} from 'recharts'
import { useTranslation } from 'react-i18next'
import { useTheme } from '@/context/theme/themeContext'
import getThemeColor from '@/context/theme/config'
import { THEME_DARK } from '@/context/theme/constants'
import GluuText from 'Routes/Apps/Gluu/GluuText'
import { useMauStyles } from '../MauPage.style'
import type { MauChartProps } from '../types'
import customColors from '@/customColors'
import TooltipDesign from '@/routes/Dashboards/Chart/TooltipDesign'
import { getChartColors } from '../constants'
import { formatMonth, formatNumber } from '../utils'

const TokenTrendChart: React.FC<MauChartProps> = ({ data }) => {
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
    monthLabel: formatMonth(entry.month),
    clientCredentials: entry.client_credentials_access_token_count,
    authzCodeAccess: entry.authz_code_access_token_count,
    authzCodeId: entry.authz_code_idtoken_count,
  }))

  return (
    <Card className={`${classes.trendCard} h-100`}>
      <CardBody>
        <GluuText variant="div" className={classes.trendTitle}>
          {t('titles.token_trends')}
        </GluuText>
        <ResponsiveContainer width="100%" height={250}>
          <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
            <XAxis dataKey="monthLabel" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} tickFormatter={formatNumber} />
            <Tooltip
              formatter={(value: number) => formatNumber(value)}
              content={(props) => (
                <TooltipDesign
                  {...(props as React.ComponentProps<typeof TooltipDesign>)}
                  backgroundColor={themeColors.dashboard.supportCard ?? themeColors.menu.background}
                  textColor={themeColors.fontColor}
                  isDark={isDark}
                />
              )}
            />
            <Legend />
            <Area
              type="monotone"
              dataKey="clientCredentials"
              name={t('fields.cc_tokens')}
              stackId="1"
              stroke={chartColors.trendClientCredentials}
              fill={chartColors.trendClientCredentials}
              fillOpacity={0.6}
            />
            <Area
              type="monotone"
              dataKey="authzCodeAccess"
              name={t('dashboard.authorization_code_access_token')}
              stackId="1"
              stroke={chartColors.trendAuthCodeAccess}
              fill={chartColors.trendAuthCodeAccess}
              fillOpacity={0.6}
            />
            <Area
              type="monotone"
              dataKey="authzCodeId"
              name={t('dashboard.authorization_code_id_token')}
              stackId="1"
              stroke={chartColors.trendAuthCodeId}
              fill={chartColors.trendAuthCodeId}
              fillOpacity={0.6}
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardBody>
    </Card>
  )
}

export default TokenTrendChart
