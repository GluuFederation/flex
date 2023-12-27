import React, { useContext } from 'react'
import PropTypes from 'prop-types'
import { ThemeContext } from 'Context/theme/themeContext'
import getThemeColor from 'Context/theme/config'

const LayoutNavbar = (props) => {
  const theme = useContext(ThemeContext)
  const selectedTheme = theme.state.theme
  const themeColors = getThemeColor(selectedTheme)
  const navbar = React.Children.only(props.children)

  return (
    <div className="layout__navbar" style={{ background: themeColors.background }}>
      {
        React.cloneElement(navbar, { fixed: null })
      }
    </div>
  )
}

LayoutNavbar.propTypes = {
  children: PropTypes.node
}
LayoutNavbar.layoutPartName = "navbar"

export {
  LayoutNavbar
}
