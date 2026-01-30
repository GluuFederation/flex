import type { CSSProperties, ReactNode } from 'react'

export type BadgeSize = 'sm' | 'md' | 'lg'
export type BadgeTheme = 'light' | 'dark'

export interface GluuBadgeProps {
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
