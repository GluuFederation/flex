import React, { useContext, useMemo } from 'react'
import classNames from 'classnames'
import { ThemeContext } from 'Context/theme/themeContext'
import logoImage from '../../../images/logos/logo192.png'

interface LogoThemedProps {
  className?: string
  [key: string]: unknown
}

const LOGO_FILTERS = {
  dark: 'brightness(0) invert(1)',
  light:
    'brightness(0) saturate(100%) invert(48%) sepia(79%) saturate(2476%) hue-rotate(130deg) brightness(95%) contrast(101%)',
} as const

const getLogoUrl = (): string => {
  return logoImage
}

const LogoThemed: React.FC<LogoThemedProps> = ({ className, ...otherProps }) => {
  const themeContext = useContext(ThemeContext)
  const currentTheme = themeContext?.state.theme || 'light'
  const isDark = currentTheme === 'dark'

  const logoStyle: React.CSSProperties = useMemo(
    () => ({
      width: '130px',
      height: '51px',
      filter: isDark ? LOGO_FILTERS.dark : LOGO_FILTERS.light,
    }),
    [isDark],
  )

  return (
    <div style={{ display: 'flex', justifyContent: 'center' }}>
      <img
        style={logoStyle}
        src={getLogoUrl()}
        className={classNames('d-block', className)}
        alt="Jans Admin UI Logo"
        {...otherProps}
      />
    </div>
  )
}

export { LogoThemed }
