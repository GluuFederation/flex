import type { ReactElement } from 'react'
import type { TooltipContentProps } from 'recharts'
import type { ThemeConfig } from '@/context/theme/config'
import type { JsonValue } from '@/routes/Apps/Gluu/types/common'

export type ChartTooltipFormatter = (value: JsonValue) => string

export type ChartTooltipProps = Pick<TooltipContentProps, 'payload' | 'active'>

export type ChartTheme = {
  themeColors: ThemeConfig
  isDark: boolean
  cardBg: string
  gridProps: {
    strokeDasharray: string
    stroke: string
  }
  axisTick: {
    fill: string
    fontSize: number
  }
  renderTooltip: (props: ChartTooltipProps, formatter?: ChartTooltipFormatter) => ReactElement
}
