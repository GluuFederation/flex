import React, { useMemo } from 'react'
import useMediaQuery from '@mui/material/useMediaQuery'
import { Card, CardBody } from 'Components'
import { OPACITY, MOBILE_MEDIA_QUERY } from '@/constants'
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
import type { TooltipContentProps } from 'recharts'
import { useTranslation } from 'react-i18next'
import { useTheme } from '@/context/theme/themeContext'
import getThemeColor from '@/context/theme/config'
import { THEME_DARK } from '@/context/theme/constants'
import GluuText from 'Routes/Apps/Gluu/GluuText'
import { useMauStyles, getLegendWrapperStyle } from '../MauPage.style'
import type { MauChartProps } from '../types'
import TooltipDesign from '@/routes/Dashboards/Chart/TooltipDesign'
import { getChartColors, CHART_MARGIN, MOBILE_CHART_MARGIN } from '../constants'
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
  const isMobile = useMediaQuery(MOBILE_MEDIA_QUERY)

  const chartData = data.map((entry) => ({
    monthLabel: formatMonth(entry.month),
    clientCredentials: entry.client_credentials_access_token_count,
    authzCodeAccess: entry.authz_code_access_token_count,
    authzCodeId: entry.authz_code_idtoken_count,
  }))

  return (
    <Card className={classes.trendCard}>
      <CardBody>
        <GluuText variant="div" className={classes.trendTitle}>
          {t('titles.token_trends')}
        </GluuText>
        <ResponsiveContainer width="100%" height={250} minHeight={250}>
          <AreaChart data={chartData} margin={isMobile ? MOBILE_CHART_MARGIN : CHART_MARGIN}>
            <CartesianGrid strokeDasharray="3 3" stroke={themeColors.borderColor} />
            <XAxis dataKey="monthLabel" tick={{ fill: themeColors.fontColor, fontSize: 12 }} />
            <YAxis
              tick={{ fill: themeColors.fontColor, fontSize: 12 }}
              tickFormatter={formatNumber}
            />
            <Tooltip
              content={(props: TooltipContentProps) => (
                <TooltipDesign
                  payload={props.payload}
                  active={props.active}
                  backgroundColor={themeColors.dashboard.supportCard ?? themeColors.menu.background}
                  textColor={themeColors.fontColor}
                  isDark={isDark}
                />
              )}
            />
            <Legend wrapperStyle={getLegendWrapperStyle(themeColors.fontColor)} />
            <Area
              type="monotone"
              dataKey="clientCredentials"
              name={t('fields.cc_tokens')}
              stackId="1"
              stroke={chartColors.trendClientCredentials}
              fill={chartColors.trendClientCredentials}
              fillOpacity={OPACITY.PLACEHOLDER}
            />
            <Area
              type="monotone"
              dataKey="authzCodeAccess"
              name={t('dashboard.authorization_code_access_token')}
              stackId="1"
              stroke={chartColors.trendAuthCodeAccess}
              fill={chartColors.trendAuthCodeAccess}
              fillOpacity={OPACITY.PLACEHOLDER}
            />
            <Area
              type="monotone"
              dataKey="authzCodeId"
              name={t('dashboard.authorization_code_id_token')}
              stackId="1"
              stroke={chartColors.trendAuthCodeId}
              fill={chartColors.trendAuthCodeId}
              fillOpacity={OPACITY.PLACEHOLDER}
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardBody>
    </Card>
  )
}

export default TokenTrendChart
