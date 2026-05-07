import React, { useMemo } from 'react'
import { Card, CardBody } from 'Components'
import { PieChart, Pie, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import type { TooltipContentProps } from 'recharts'
import { useTranslation } from 'react-i18next'
import { useTheme } from '@/context/theme/themeContext'
import getThemeColor from '@/context/theme/config'
import { THEME_DARK } from '@/context/theme/constants'
import GluuText from 'Routes/Apps/Gluu/GluuText'
import { useMauStyles } from '../MauPage.style'
import type { MauSummary } from '../types'
import TooltipDesign from '@/routes/Dashboards/Chart/TooltipDesign'
import { getChartColors } from '../constants'

interface TokenDistributionChartProps {
  summary: MauSummary
}

const TokenDistributionChart: React.FC<TokenDistributionChartProps> = ({ summary }) => {
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

  const data = useMemo(
    () => [
      {
        name: t('fields.cc_tokens'),
        value: summary.clientCredentialsTokens,
        fill: chartColors.pieClientCredentials,
      },
      {
        name: t('fields.authz_code_tokens'),
        value: summary.authCodeTokens,
        fill: chartColors.pieAuthCodeAccess,
      },
    ],
    [summary, t, chartColors],
  )

  const hasData = summary.totalTokens > 0

  return (
    <Card className={classes.trendCard}>
      <CardBody>
        <GluuText variant="div" className={classes.trendTitle}>
          {t('titles.token_distribution')}
        </GluuText>
        {hasData ? (
          <ResponsiveContainer width="100%" height={250} minHeight={250}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={2}
                dataKey="value"
                label={({
                  cx = 0,
                  cy = 0,
                  midAngle = 0,
                  innerRadius = 0,
                  outerRadius = 0,
                  percent = 0,
                }) => {
                  const RADIAN = Math.PI / 180
                  const radius = innerRadius + (outerRadius - innerRadius) * 0.5
                  const x = cx + radius * Math.cos(-midAngle * RADIAN)
                  const y = cy + radius * Math.sin(-midAngle * RADIAN)
                  return (
                    <text
                      x={x}
                      y={y}
                      fill={themeColors.fontColor}
                      textAnchor="middle"
                      dominantBaseline="central"
                    >
                      {`${(percent * 100).toFixed(0)}%`}
                    </text>
                  )
                }}
              ></Pie>
              <Tooltip
                content={(props: TooltipContentProps) => (
                  <TooltipDesign
                    payload={props.payload}
                    active={props.active}
                    backgroundColor={
                      themeColors.dashboard.supportCard ?? themeColors.menu.background
                    }
                    textColor={themeColors.fontColor}
                    isDark={isDark}
                  />
                )}
              />
              <Legend wrapperStyle={{ color: themeColors.fontColor }} />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <div className={classes.emptyState} style={{ height: 250 }}>
            <GluuText variant="span" secondary>
              {t('messages.no_mau_data')}
            </GluuText>
          </div>
        )}
      </CardBody>
    </Card>
  )
}

export default TokenDistributionChart
