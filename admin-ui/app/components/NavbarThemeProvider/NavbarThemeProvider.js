import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

const NavbarThemeProvider = ({ children, className }) => {
  const isSingleChild = React.Children.count(children) === 1

  if (isSingleChild) {
    const child = React.Children.only(children)

    return React.cloneElement(child, {
      className: classNames(
        child.props.className,
      ),
    })
  } else {
    return (
      <div className={ classNames(className) }>
        { children }
      </div>
    )
  }
}

NavbarThemeProvider.propTypes = {
  children: PropTypes.node.isRequired,
}

export { NavbarThemeProvider }
