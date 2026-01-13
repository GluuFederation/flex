import React, { useContext } from 'react'
import classNames from 'classnames'
import { ThemeContext } from 'Context/theme/themeContext'
import logoImage from '../../../images/logos/logo192.png'

interface LogoThemedProps {
  checkBackground?: boolean
  className?: string
  [key: string]: unknown
}

const getLogoUrl = (): string => {
  return logoImage
}

const getLogoUrlBackground = (style: string): string => {
  if (style === 'color') {
    return logoImage
  } else {
    return getLogoUrl()
  }
}

const LogoThemed: React.FC<LogoThemedProps> = ({ checkBackground, className, ...otherProps }) => {
  const themeContext = useContext(ThemeContext)
  const currentTheme = themeContext?.state.theme || 'light'
  const isDark = currentTheme === 'dark'

  const logoStyle: React.CSSProperties = {
    width: '130px',
    height: '51px',
    filter: isDark
      ? 'brightness(0) invert(1)'
      : `brightness(0) saturate(100%) invert(48%) sepia(79%) saturate(2476%) hue-rotate(130deg) brightness(95%) contrast(101%)`,
  }

  return (
    <div style={{ display: 'flex', justifyContent: 'center' }}>
      <img
        style={logoStyle}
        src={checkBackground ? getLogoUrlBackground('default') : getLogoUrl()}
        className={classNames('d-block', className)}
        alt="Jans admin ui Logo"
        {...otherProps}
      />
    </div>
  )
}

export { LogoThemed }
