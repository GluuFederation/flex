import React from 'react'
import classNames from 'classnames'

import { ThemeConsumer } from '../../../components/Theme'

interface LogoThemedProps {
  checkBackground?: boolean;
  className?: string;
  [key: string]: any; // for otherProps
}

interface ThemeContext {
  style: string;
  color: string;
}

const logos: Record<string, string> = {
  'default': require('../../../images/logos/logo192.png'),
  'primary': require('../../../images/logos/logo192.png')
}

const getLogoUrl = (): string => {
  return logos['default']
}

// Check for background
const getLogoUrlBackground = (style: string, color: string): string => {
  if (style === 'color') {
    return logos['default']
  } else {
    return getLogoUrl()
  }
}

const LogoThemed: React.FC<LogoThemedProps> = ({ checkBackground, className, ...otherProps }) => (
  <ThemeConsumer>
    {
      ({ style, color }: ThemeContext) => (
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <img style={{ width:'130px', height:'51px' }}
            src={
              checkBackground ?
                getLogoUrlBackground(style, color) :
                getLogoUrl()
            }
            className={ classNames('d-block', className) }
            alt="Jans admin ui Logo"
            { ...otherProps }
          />
        </div>
      )
    }
  </ThemeConsumer>
)


export { LogoThemed }
