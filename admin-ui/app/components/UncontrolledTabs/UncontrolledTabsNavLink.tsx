import React, { useContext } from 'react'
import classNames from 'classnames'
import omit from 'lodash/omit'
import { NavLink } from 'reactstrap'

import { Consumer, UncontrolledTabsContextType } from './context'
import { ThemeContext } from '../../context/theme/themeContext'
import getThemeColor from '../../context/theme/config'

interface UncontrolledTabsNavLinkProps {
  tabId: string
  [key: string]: any
}

interface ThemeContextType {
  state: {
    theme: string
  }
  dispatch: React.Dispatch<any>
}

const UncontrolledTabsNavLink: React.FC<UncontrolledTabsNavLinkProps> = (props) => {
  const theme = useContext(ThemeContext) as ThemeContextType
  const themeColors = getThemeColor(theme.state.theme)

  return (
    <Consumer>
      {(value: UncontrolledTabsContextType) => (
        <NavLink
          {...omit(props, ['tabId'])}
          onClick={() => {
            value.setActiveTabId(props.tabId)
          }}
          className={classNames({ active: props.tabId === value.activeTabId })}
          style={{ color: themeColors.fontColor }}
          href="#"
        />
      )}
    </Consumer>
  )
}

export { UncontrolledTabsNavLink }
