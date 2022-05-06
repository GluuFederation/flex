import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import omit from 'lodash/omit'
import { NavLink } from 'reactstrap'

import { Consumer } from './context'

const UncontrolledTabsNavLink = (props) => (
  <Consumer>
    {
      (value) => (
        <NavLink
          { ...omit(props, ['tabId']) }
          onClick={ () => { value.setActiveTabId(props.tabId) } }
          className={ classNames({ active: props.tabId === value.activeTabId }) }
          href="#"
        />
      )
    }
  </Consumer>
)
UncontrolledTabsNavLink.propTypes = {
  tabId: PropTypes.string.isRequired
}

export { UncontrolledTabsNavLink }
