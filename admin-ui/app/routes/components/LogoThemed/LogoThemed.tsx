import React, { useContext, useMemo } from 'react'
import classNames from 'classnames'
import { ThemeContext } from '@/context/theme/themeContext'
import { THEME_DARK, THEME_LIGHT, DEFAULT_THEME } from '@/context/theme/constants'
import logoImage from '../../../images/logos/logo192.png'

interface LogoThemedProps {
  className?: string
  width?: string | number
  height?: string | number
  [key: string]: unknown
}

const LOGO_FILTERS = {
  [THEME_DARK]: 'brightness(0) invert(1)',
  [THEME_LIGHT]:
    'brightness(0) saturate(100%) invert(48%) sepia(79%) saturate(2476%) hue-rotate(130deg) brightness(95%) contrast(101%)',
} as const

const LogoThemed: React.FC<LogoThemedProps> = ({ className, width, height, ...otherProps }) => {
  const themeContext = useContext(ThemeContext)
  const currentTheme = themeContext?.state.theme || DEFAULT_THEME

  const logoStyle: React.CSSProperties = useMemo(() => {
    const widthValue = width != null ? (typeof width === 'number' ? `${width}px` : width) : '130px'
    const heightValue =
      height != null ? (typeof height === 'number' ? `${height}px` : height) : '51px'
    return {
      width: widthValue,
      height: heightValue,
      filter: LOGO_FILTERS[currentTheme] || LOGO_FILTERS[DEFAULT_THEME],
    }
  }, [currentTheme, width, height])

  return (
    <div style={{ display: 'flex', justifyContent: 'center' }}>
      <img
        style={logoStyle}
        src={logoImage}
        className={classNames('d-block', className)}
        alt="Jans Admin UI Logo"
        {...otherProps}
      />
    </div>
  )
}

export { LogoThemed }
