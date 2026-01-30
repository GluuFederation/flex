import React, { useContext, useMemo, CSSProperties, ReactNode } from 'react'
import { ThemeContext } from 'Context/theme/themeContext'
import getThemeColor from 'Context/theme/config'
import { DEFAULT_THEME, THEME_DARK } from '@/context/theme/constants'
import customColors from '@/customColors'

export type GluuTextVariant =
  | 'h1'
  | 'h2'
  | 'h3'
  | 'h4'
  | 'h5'
  | 'h6'
  | 'p'
  | 'span'
  | 'small'
  | 'div'

export interface GluuTextProps {
  /**
   * The text variant to render (h1-h6, p, span, small, div)
   * @default 'span'
   */
  variant?: GluuTextVariant
  /**
   * The text content to display
   */
  children: ReactNode
  /**
   * Custom CSS styles to apply
   */
  style?: CSSProperties
  /**
   * Custom CSS class name
   */
  className?: string
  /**
   * Whether to use secondary text color (muted/secondary)
   * @default false
   */
  secondary?: boolean
  /**
   * Whether to disable automatic theme color (use custom color from style prop)
   * @default false
   */
  disableThemeColor?: boolean
  /**
   * Use when text is rendered on a light surface (e.g. white cards) even in dark theme.
   * Forces readable dark text colors without changing any backgrounds.
   * @default false
   */
  onLightSurface?: boolean
}

const GluuText: React.FC<GluuTextProps> = ({
  variant = 'span',
  children,
  style,
  className,
  secondary = false,
  disableThemeColor = false,
  onLightSurface = false,
}) => {
  const theme = useContext(ThemeContext)
  const selectedTheme = theme?.state?.theme || DEFAULT_THEME
  const themeColors = useMemo(() => getThemeColor(selectedTheme), [selectedTheme])
  const isDark = useMemo(() => selectedTheme === THEME_DARK, [selectedTheme])

  const textColor = useMemo(() => {
    if (disableThemeColor) {
      return undefined
    }
    // For light (white) surfaces, force readable dark text even in dark theme.
    if (onLightSurface) {
      return secondary ? customColors.textSecondary : customColors.primaryDark
    }
    // Use secondary color if specified
    if (secondary) {
      return isDark ? customColors.textMutedDark : customColors.textSecondary
    }
    // Use primary font color
    return themeColors.fontColor
  }, [themeColors.fontColor, secondary, disableThemeColor, isDark, onLightSurface])

  const combinedStyle = useMemo<CSSProperties>(
    () => ({
      ...(textColor && !disableThemeColor ? { color: textColor } : {}),
      ...style,
    }),
    [textColor, style, disableThemeColor],
  )

  const Component = variant

  return (
    <Component className={className} style={combinedStyle}>
      {children}
    </Component>
  )
}

export default React.memo(GluuText)
