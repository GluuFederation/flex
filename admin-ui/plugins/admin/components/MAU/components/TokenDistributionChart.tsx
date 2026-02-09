import React, { useMemo } from 'react'
import { Card, CardBody } from 'Components'
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts'
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
        color: chartColors.pieClientCredentials,
      },
      {
        name: t('fields.authz_code_tokens'),
        value: summary.authCodeTokens,
        color: chartColors.pieAuthCodeAccess,
      },
    ],
    [summary, t, chartColors],
  )

  const hasData = summary.totalTokens > 0

  return (
    <Card className={`${classes.trendCard} h-100`}>
      <CardBody>
        <GluuText variant="div" className={classes.trendTitle}>
          {t('titles.token_distribution')}
        </GluuText>
        {hasData ? (
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={2}
                dataKey="value"
                label={({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
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
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                content={(props) => (
                  <TooltipDesign
                    {...(props as React.ComponentProps<typeof TooltipDesign>)}
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
          <div className="d-flex align-items-center justify-content-center" style={{ height: 250 }}>
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
