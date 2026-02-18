import React, { useMemo, useState, useCallback } from 'react'
import { fontFamily } from '@/styles/fonts'
import { useTheme } from '@/context/theme/themeContext'
import getThemeColor from '@/context/theme/config'
import { THEME_DARK } from '@/context/theme/constants'
import { OPACITY } from '@/constants'
import { resolveBackgroundColor } from '@/utils/buttonUtils'
import type { GluuButtonProps } from './types'

const SIZES = {
  sm: { fontSize: '12px', padding: '6px 12px', minHeight: '30px' },
  md: { fontSize: '14px', padding: '8px 16px', minHeight: '38px' },
  lg: { fontSize: '16px', padding: '10px 24px', minHeight: '46px' },
}

const GluuButton: React.FC<GluuButtonProps> = (props) => {
  const {
    children,
    size = 'md',
    outlined = false,
    disabled = false,
    loading = false,
    block = false,
    'theme': themeProp,
    backgroundColor,
    textColor,
    borderColor,
    borderRadius,
    fontSize,
    fontWeight,
    padding,
    minHeight,
    style,
    className,
    useOpacityOnHover = false,
    hoverOpacity,
    disableHoverStyles = false,
    onClick,
    type = 'button',
    title,
    'aria-expanded': ariaExpanded,
    'aria-label': ariaLabel,
  } = props

  const [isHovered, setIsHovered] = useState(false)
  const { state } = useTheme()
  const activeTheme = themeProp || state.theme
  const themeColors = getThemeColor(activeTheme)
  const isDark = activeTheme === THEME_DARK
  const sizeConfig = SIZES[size]
  const isDisabled = disabled || loading

  const buttonStyle = useMemo<React.CSSProperties>(() => {
    const bg = backgroundColor ?? themeColors.background
    const text = textColor ?? themeColors.fontColor
    const border = borderColor ?? (isDark ? 'transparent' : themeColors.borderColor)
    const hoverBg = isDark ? themeColors.lightBackground : themeColors.borderColor
    const keepBgOnHover = !disableHoverStyles && useOpacityOnHover && isHovered && !isDisabled
    const opacityOnHover = hoverOpacity ?? OPACITY.DIMMED

    return {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '8px',
      fontFamily,
      fontSize: fontSize ?? sizeConfig.fontSize,
      fontWeight: fontWeight ?? 500,
      lineHeight: 1.4,
      padding: padding ?? sizeConfig.padding,
      minHeight: minHeight ?? sizeConfig.minHeight,
      borderRadius: borderRadius ?? '6px',
      border: `1px solid ${border}`,
      backgroundColor: resolveBackgroundColor(
        disableHoverStyles,
        keepBgOnHover,
        outlined,
        isHovered,
        isDisabled,
        bg,
        hoverBg,
      ),
      color: outlined ? (textColor ?? themeColors.fontColor) : text,
      cursor: isDisabled ? 'not-allowed' : 'pointer',
      opacity: isDisabled ? OPACITY.DIMMED : keepBgOnHover ? opacityOnHover : 1,
      width: block ? '100%' : 'auto',
      transition: 'background-color 0.15s ease-in-out, opacity 0.15s ease-in-out',
      ...style,
    }
  }, [
    sizeConfig,
    outlined,
    isHovered,
    isDisabled,
    block,
    themeColors,
    isDark,
    backgroundColor,
    textColor,
    borderColor,
    borderRadius,
    fontSize,
    fontWeight,
    padding,
    minHeight,
    useOpacityOnHover,
    hoverOpacity,
    style,
  ])

  const handleClick = useCallback(() => {
    if (!isDisabled && onClick) onClick()
  }, [isDisabled, onClick])

  return (
    <button
      type={type}
      className={className}
      style={buttonStyle}
      onClick={handleClick}
      disabled={isDisabled}
      title={title}
      aria-expanded={ariaExpanded}
      aria-label={ariaLabel}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {loading && (
        <span
          style={{
            width: 14,
            height: 14,
            border: '2px solid transparent',
            borderTopColor: themeColors.fontColor,
            borderRadius: '50%',
            animation: 'spin 0.6s linear infinite',
          }}
        />
      )}
      {children}
    </button>
  )
}

export default GluuButton
