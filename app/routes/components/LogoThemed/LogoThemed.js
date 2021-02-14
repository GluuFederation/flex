import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import { ThemeConsumer } from '../../../components/Theme';

const logos = {
  'default': require('./../../../images/logos/logo.png'),
  'primary': require('./../../../images/logos/logo.png')
};

const getLogoUrl = () => {
  //return logos[color];
  return logos['default'];
};

// Check for background
const getLogoUrlBackground = (style, color) => {
  if (style === 'color') {
    return logos['default'];
  } else {
    return getLogoUrl(style, color);
  }
};

const LogoThemed = ({ checkBackground, className, ...otherProps }) => (
  <ThemeConsumer>
    {
      ({ style, color }) => (
        <img style={{ width:'110px', height:'30px' }}
          src={
            checkBackground ?
              getLogoUrlBackground(style, color) :
              getLogoUrl(style, color)
          }
          className={ classNames('d-block', className) }
          alt="Jans admin ui Logo"
          { ...otherProps }
        />
      )
    }
  </ThemeConsumer>
);
LogoThemed.propTypes = {
  checkBackground: PropTypes.bool,
  className: PropTypes.string,
};

export { LogoThemed };