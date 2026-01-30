import React, { useMemo, useCallback } from 'react'
import { fontFamily } from '@/styles/fonts'
import { useTheme } from '@/context/theme/themeContext'
import getThemeColor from '@/context/theme/config'
import { THEME_DARK } from '@/context/theme/constants'
import type { GluuBadgeProps } from './types'

const SIZES = {
  sm: { fontSize: '11px', padding: '3px 6px' },
  md: { fontSize: '12px', padding: '4px 8px' },
  lg: { fontSize: '14px', padding: '6px 12px' },
}

const GluuBadge: React.FC<GluuBadgeProps> = (props) => {
  const {
    children,
    size = 'md',
    outlined = false,
    pill = false,
    theme: themeProp,
    backgroundColor,
    textColor,
    borderColor,
    borderRadius,
    fontSize,
    fontWeight,
    padding,
    style,
    className,
    onClick,
    title,
  } = props

  const { state } = useTheme()
  const activeTheme = themeProp || state.theme
  const themeColors = getThemeColor(activeTheme)
  const isDark = activeTheme === THEME_DARK
  const sizeConfig = SIZES[size]

  const badgeStyle = useMemo<React.CSSProperties>(() => {
    const bg = backgroundColor ?? themeColors.background
    const text = textColor ?? themeColors.fontColor
    const border = borderColor ?? (isDark ? 'transparent' : themeColors.borderColor)

    return {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily,
      fontSize: fontSize ?? sizeConfig.fontSize,
      fontWeight: fontWeight ?? 500,
      lineHeight: 1.4,
      padding: padding ?? sizeConfig.padding,
      borderRadius: borderRadius ?? (pill ? '50px' : '4px'),
      backgroundColor: outlined ? 'transparent' : bg,
      color: outlined ? bg : text,
      border: outlined ? `1px solid ${bg}` : `1px solid ${border}`,
      whiteSpace: 'nowrap',
      cursor: onClick ? 'pointer' : 'default',
      ...style,
    }
  }, [
    sizeConfig,
    pill,
    outlined,
    themeColors,
    isDark,
    backgroundColor,
    textColor,
    borderColor,
    borderRadius,
    fontSize,
    fontWeight,
    padding,
    onClick,
    style,
  ])

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLSpanElement>) => {
      if (onClick && (e.key === 'Enter' || e.key === ' ')) {
        if (e.key === ' ') {
          e.preventDefault()
        }
        onClick()
      }
    },
    [onClick],
  )

  const isInteractive = !!onClick

  return (
    <span
      className={className}
      style={badgeStyle}
      onClick={onClick}
      onKeyDown={isInteractive ? handleKeyDown : undefined}
      role={isInteractive ? 'button' : undefined}
      tabIndex={isInteractive ? 0 : undefined}
      title={title}
    >
      {children}
    </span>
  )
}

export default GluuBadge
