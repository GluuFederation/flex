import React, { useContext } from 'react'
import PropTypes from 'prop-types'
import getThemeColor from '../../context/theme/config'
import { ThemeContext } from '../../context/theme/themeContext'

const HeaderMain = ({ title, subTitle, className }: any) => {
  const theme: any = useContext(ThemeContext)
  const themeColors = getThemeColor(theme.state.theme)

  return (
    <React.Fragment>
      {/* START H1 Header */}
      <div className={` d-flex ${className}`}>
        <h1
          className="display-4 me-3 mb-0 align-self-start"
          style={{ color: themeColors.fontColor ?? '#000' }}
        >
          {title}
        </h1>
      </div>
      {/* END H1 Header */}
    </React.Fragment>
  )
}
HeaderMain.propTypes = {
  title: PropTypes.string,
  subTitle: PropTypes.node,
  className: PropTypes.string,
}
HeaderMain.defaultProps = {
  title: 'Waiting for Data...',
  subTitle: 'Waiting for Data...',
  className: 'my-4',
}

export { HeaderMain }
