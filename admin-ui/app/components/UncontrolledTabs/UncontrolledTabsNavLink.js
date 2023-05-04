import React, { useContext } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import omit from 'lodash/omit'
import { NavLink } from 'reactstrap'

import { Consumer } from './context'
import { ThemeContext } from '../../context/theme/themeContext'
import getThemeColor from '../../context/theme/config'

const UncontrolledTabsNavLink = (props) => {
  const theme = useContext(ThemeContext)
  const themeColors = getThemeColor(theme.state.theme)

  return (
    <Consumer>
      {
        (value) => (
          <NavLink
            {...omit(props, ['tabId'])}
            onClick={() => { value.setActiveTabId(props.tabId) }}
            className={classNames({ active: props.tabId === value.activeTabId })}
            style={{ color: themeColors.fontColor }}
            href="#"
          />
        )
      }
    </Consumer>
  )
}
UncontrolledTabsNavLink.propTypes = {
  tabId: PropTypes.string.isRequired
}

export { UncontrolledTabsNavLink }
