import React, { useContext } from 'react'
import PropTypes from 'prop-types'
import { ThemeContext } from 'Context/theme/themeContext'
import getThemeColor from 'Context/theme/config'

const LayoutContent = (props) => {
  const theme = useContext(ThemeContext)
  const selectedTheme = theme.state.theme
  const themeColors = getThemeColor(selectedTheme)

  return (
    <div className="layout__content" style={{ background: themeColors.background }}>
      { props.children }
    </div>
  )
}

LayoutContent.propTypes = {
  children: PropTypes.node
}
LayoutContent.layoutPartName = "content"

export {
  LayoutContent
}
