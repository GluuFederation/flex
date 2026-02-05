import React, { memo, useContext, useMemo } from 'react'
import { GluuSpinner } from '@/components/GluuSpinner'
import customColors, { hexToRgb } from '@/customColors'
import { ThemeContext } from '@/context/theme/themeContext'
import { THEME_DARK, DEFAULT_THEME } from '@/context/theme/constants'

const OVERLAY_BG_LIGHT = `rgba(${hexToRgb(customColors.black)}, 0.75)`
const OVERLAY_BG_DARK = `rgba(${hexToRgb(customColors.darkCardBg)}, 0.75)`

const SPINNER_SIZE = 80
const ARIA_LABEL_LOADING = 'Loading'

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

  const overlay = blocking ? (
    <div style={overlayStyle} aria-label={ARIA_LABEL_LOADING}>
      <GluuSpinner size={SPINNER_SIZE} aria-label={ARIA_LABEL_LOADING} />
    </div>
  ) : null

  if (children === undefined) {
    return <div aria-busy={blocking}>{overlay}</div>
  }

  return (
    <div aria-busy={blocking}>
      {children}
      {overlay}
    </div>
  )
})

GluuLoader.displayName = 'GluuLoader'

export default GluuLoader
