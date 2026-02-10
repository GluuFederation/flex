import React, { memo, useContext, useMemo } from 'react'
import { GluuSpinner } from '@/components/GluuSpinner'
import customColors, { hexToRgb } from '@/customColors'
import { ThemeContext } from '@/context/theme/themeContext'
import { THEME_DARK, DEFAULT_THEME } from '@/context/theme/constants'

const OVERLAY_BG_LIGHT = `rgba(${hexToRgb(customColors.black)}, 0.8)`
const OVERLAY_BG_DARK = `rgba(${hexToRgb(customColors.darkCardBg)}, 0.8)`

interface GluuLoaderProps {
  blocking: boolean
  children?: React.ReactNode
}

const GluuLoader: React.FC<GluuLoaderProps> = memo(({ blocking, children }) => {
  const themeContext = useContext(ThemeContext)
  const currentTheme = themeContext?.state.theme || DEFAULT_THEME
  const isDark = currentTheme === THEME_DARK

  const overlayStyle = useMemo<React.CSSProperties>(
    () => ({
      position: 'fixed' as const,
      inset: 0,
      zIndex: 9999,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: isDark ? OVERLAY_BG_DARK : OVERLAY_BG_LIGHT,
    }),
    [isDark],
  )

  return (
    <div aria-busy={blocking}>
      {children}
      {blocking && (
        <div style={overlayStyle}>
          <GluuSpinner size={80} aria-label="Loading" />
        </div>
      )}
    </div>
  )
})

GluuLoader.displayName = 'GluuLoader'

export default GluuLoader
