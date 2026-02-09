import type { CSSProperties, ReactNode } from 'react'

export type ButtonSize = 'sm' | 'md' | 'lg'
export type ButtonTheme = 'light' | 'dark'

export interface GluuButtonProps {
  children: ReactNode
  size?: ButtonSize
  outlined?: boolean
  disabled?: boolean
  loading?: boolean
  block?: boolean
  theme?: ButtonTheme
  backgroundColor?: string
  textColor?: string
  borderColor?: string
  borderRadius?: string | number
  fontSize?: string | number
  fontWeight?: number
  padding?: string
  minHeight?: string | number
  style?: CSSProperties
  className?: string
  useOpacityOnHover?: boolean
  hoverOpacity?: number
  disableHoverStyles?: boolean
  onClick?: () => void
  type?: 'button' | 'submit' | 'reset'
  title?: string
}
