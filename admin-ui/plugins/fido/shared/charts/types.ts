import type { ReactNode, RefObject } from 'react'
import type { ThemeConfig } from '@/context/theme/config'

export type ChartStylesParams = {
  isDark: boolean
  themeColors: ThemeConfig
}

type ChartLegendItem = {
  key: string
  color: string
  label: string
  labelColor?: string
  hint?: ReactNode
}

export type ChartLegendProps = {
  items: readonly ChartLegendItem[]
  marker?: 'dot' | 'dash'
  topGutter?: boolean
  renderHint?: (hint: ReactNode, content: ReactNode) => ReactNode
}

export type AxisStartTickProps = {
  y?: number
  payload?: { value: string | number }
  tickFormatter?: (value: never, index: number) => string
  index?: number
  fill?: string
  fontSize?: number
}

export type ChartScrollAnchor = {
  x: number
  y: number
}

export type ChartZoomControls = {
  zoom: number
  zoomIn: () => void
  zoomOut: () => void
  resetZoom: () => void
  surfaceRef: RefObject<HTMLDivElement | null>
}

export type ChartCardProps = {
  title: string
  caption?: string
  accentColor?: string
  headerExtra?: ReactNode
  cardClassName?: string
  bodyClassName?: string
  minHeight?: number
  showExpand?: boolean
  hideTitle?: boolean
  zoomable?: boolean
  isEmpty?: boolean
  children: (isFullscreen: boolean, zoom: number) => ReactNode
}

export type ChartTickProps = {
  x?: number | string
  y?: number | string
  payload?: { value: string }
}

export type MultiLineTickProps = ChartTickProps & {
  fill: string
  fontSize?: number
}
