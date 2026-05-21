import type { CSSProperties, ReactNode } from 'react'

type BadgeSize = 'sm' | 'md' | 'lg'
type BadgeTheme = 'light' | 'dark'

export type GluuBadgeProps = {
  children: ReactNode
  size?: BadgeSize
  outlined?: boolean
  pill?: boolean
  theme?: BadgeTheme
  backgroundColor?: string
  textColor?: string
  borderColor?: string
  borderRadius?: string | number
  fontSize?: string | number
  fontWeight?: number
  padding?: string
  style?: CSSProperties
  className?: string
  onClick?: () => void
  title?: string
}
