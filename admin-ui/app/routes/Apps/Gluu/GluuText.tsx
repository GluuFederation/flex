import React, { useContext, useMemo, CSSProperties, ReactNode } from 'react'
import { ThemeContext } from 'Context/theme/themeContext'
import getThemeColor from 'Context/theme/config'
import { DEFAULT_THEME, THEME_DARK } from '@/context/theme/constants'
import customColors from '@/customColors'

type GluuTextVariant = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span' | 'small' | 'div'

interface GluuTextProps {
  variant?: GluuTextVariant
  children: ReactNode
  style?: CSSProperties
  className?: string
  secondary?: boolean
  disableThemeColor?: boolean
  onLightSurface?: boolean
  id?: string
}

const GluuText: React.FC<GluuTextProps> = ({
  variant = 'span',
  children,
  style,
  className,
  secondary = false,
  disableThemeColor = false,
  onLightSurface = false,
  id,
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
    <Component className={className} style={combinedStyle} id={id}>
      {children}
    </Component>
  )
}

export default React.memo(GluuText)
