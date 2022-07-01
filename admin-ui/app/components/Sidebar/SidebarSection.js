import React, { useContext } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { makeStyles } from '@material-ui/core/styles'
import Wave from 'Components/SVG/SidebarWave'
import { ThemeContext } from 'Context/theme/themeContext'
import getThemeColor from 'Context/theme/config'

const useStyles = makeStyles(() => ({
  waveContainer: {
    position: 'absolute',
    bottom: 93,
    left: 0,
    height: 70,
    width: 250,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  wave: {
    width: 250,
    position: 'relative',
    top: -80
  },
  powered: {
    color: '#fff',
    textAlign: 'center',
    position: 'relative',
    top: -130,
    fontWeight: 500,
  }
}))

const SidebarSection = (props) => {
  const sectionClass = classNames("sidebar__section", {
    'sidebar__section--fluid': props.fluid,
    'sidebar__section--cover': props.cover
  }, props.className)
  const classes = useStyles()
  const theme = useContext(ThemeContext)
  const selectedTheme = theme.state.theme
  const themeColors = getThemeColor(selectedTheme)

  return (
    <div className={ sectionClass }>
      { props.children }
      <div className={classes.waveContainer}>
        <Wave className={classes.wave} fill={themeColors.menu.background} />
        <div className={classes.powered}>
          Powered by Gluu
        </div>
      </div>
    </div>
  )
}

SidebarSection.propTypes = {
  children: PropTypes.node,
  fluid: PropTypes.bool,
  cover: PropTypes.bool,
  className: PropTypes.string
}

export {
  SidebarSection
}
