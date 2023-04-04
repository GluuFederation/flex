import React, { useContext } from 'react'
import PropTypes from 'prop-types'
import getThemeColor from '../../context/theme/config'
import { ThemeContext } from '../../context/theme/themeContext'

const HeaderMain = (props) => {
  const theme = useContext(ThemeContext)
  const themeColors = getThemeColor(theme.state.theme)

  return (
    <React.Fragment>
      { /* START H1 Header */}
      <div className={` d-flex ${props.className}`}>
        <h1 className="display-4 mr-3 mb-0 align-self-start" style={{ color: themeColors.fontColor ?? "#000" }}>
          {props.title}
        </h1>
      </div>
      { /* END H1 Header */}
    </React.Fragment>
  )
}
HeaderMain.propTypes = {
  title: PropTypes.string,
  subTitle: PropTypes.node,
  className: PropTypes.string
}
HeaderMain.defaultProps = {
  title: "Waiting for Data...",
  subTitle: "Waiting for Data...",
  className: "my-4"
}

export { HeaderMain }
