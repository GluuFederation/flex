import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import { ThemeConsumer } from 'Components/Theme'

const logos = {
  'default': require('Images/logos/logo192.png'),
  'primary': require('Images/logos/logo192.png')
}

const getLogoUrl = () => {
  return logos['default']
}

// Check for background
const getLogoUrlBackground = (style, color) => {
  if (style === 'color') {
    return logos['default']
  } else {
    return getLogoUrl()
  }
}

const LogoThemed = ({ checkBackground, className, ...otherProps }) => (
  <ThemeConsumer>
    {
      ({ style, color }) => (
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
LogoThemed.propTypes = {
  checkBackground: PropTypes.bool,
  className: PropTypes.string,
}

export { LogoThemed }
