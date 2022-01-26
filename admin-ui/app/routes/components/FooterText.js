import React from 'react'
import PropTypes from 'prop-types'

const FooterText = (props) => (
  <React.Fragment>
    (C) {props.year} All Rights Reserved. This is the &quot;{props.name}&quot;
    designed and implemented by{' '}
    <a
      href="https://www.gluu.org"
      target="_blank"
      rel="noopener noreferrer"
      className="sidebar__link"
    >
      Gluu Inc.
    </a>
  </React.Fragment>
)
FooterText.propTypes = {
  year: PropTypes.node,
  name: PropTypes.node,
  desc: PropTypes.node,
}
FooterText.defaultProps = {
  year: '2021',
  name: 'Admin UI for Jans OAuth Server',
  desc: null,
}

export { FooterText }
