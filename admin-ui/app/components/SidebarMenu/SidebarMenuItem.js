import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import classNames from 'classnames'
import uuid from 'uuid/v4'

import { MenuContext } from './MenuContext'

/**
 * Renders a collapse trigger or a ReactRouter Link
 */
const SidebarMenuItemLink = (props) =>
  props.to || props.href ? (
    props.to ? (
      <Link
        to={props.to}
        style={props.textStyle}
        className={`${props.classBase}__entry__link`}
      >
        {props.children}
      </Link>
    ) : (
      <a
        href={props.href}
        target="_blank"
        rel="noopener noreferrer"
        className={`${props.classBase}__entry__link`}
        style={props.textStyle}
      >
        {props.children}
      </a>
    )
  ) : (
    <a
      className={`${props.classBase}__entry__link`}
      onClick={() => props.onToggle()}
      style={props.textStyle}
    >
      {props.children}
    </a>
  )
SidebarMenuItemLink.propTypes = {
  to: PropTypes.string,
  href: PropTypes.string,
  active: PropTypes.bool,
  onToggle: PropTypes.func,
  children: PropTypes.node,
  classBase: PropTypes.string,
  textStyle: PropTypes.object,
}

/**
 * The main menu entry component
 */
export class SidebarMenuItem extends React.Component {
  static propTypes = {
    // MenuContext props
    addEntry: PropTypes.func,
    updateEntry: PropTypes.func,
    removeEntry: PropTypes.func,
    entries: PropTypes.object,
    // Provided props
    parentId: PropTypes.string,
    children: PropTypes.node,
    isSubNode: PropTypes.bool,
    currentUrl: PropTypes.string,
    slim: PropTypes.bool,
    // User props
    icon: PropTypes.node,
    title: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
    to: PropTypes.string,
    href: PropTypes.string,
    exact: PropTypes.bool,
    noCaret: PropTypes.bool,
    textStyle: PropTypes.object,
  }

  static defaultProps = {
    exact: true,
    isEmptyNode: false,
  }

  constructor(props) {
    super(props)

    this.id = uuid()
  }

  componentDidMount() {
    const entry = {
      id: this.id,
      parentId: this.props.parentId,
      exact: !!this.props.exact,
    }

    if (this.props.to) {
      entry.url = this.props.to
    }

    this.props.addEntry(entry)
  }

  componentWillUnmount() {
    this.props.removeEntry(this.id)
  }

  getEntry() {
    return this.props.entries[this.id]
  }

  toggleNode() {
    const entry = this.getEntry()

    this.props.updateEntry(this.id, { open: !entry.open })
  }

  render() {
    const entry = this.getEntry()
    const classBase = this.props.isSubNode ? 'sidebar-submenu' : 'sidebar-menu'
    const itemClass = classNames(`${classBase}__entry cursor-pointer`, {
      [`${classBase}__entry--nested`]: !!this.props.children,
      open: entry && entry.open,
      active: entry && entry.active,
    })
    const activeMenu = {
      color: '#323b47',
    }
    const nonaActiveMenu = {}

    function getStyle(itemClass) {
      if (
        itemClass.includes('active', 0) &&
        itemClass.includes('submenu__entry', 0) &&
        !itemClass.includes('open', 0)
      ) {
        return activeMenu
      }
      return nonaActiveMenu
    }

    function getTextStyle(itemClass) {
      if (
        itemClass.includes('active', 0) &&
        itemClass.includes('submenu__entry', 0) &&
        !itemClass.includes('open', 0)
      ) {
        return { color: 'white', fontWeight: 'bold' }
      }
      return null
    }
    return (
      <li
        style={getStyle(itemClass)}
        className={classNames(itemClass, {
          'sidebar-menu__entry--no-caret': this.props.noCaret,
          'mb-20': !!this.props.icon,
        })}
      >
        {!this.props.isEmptyNode && (
          <SidebarMenuItemLink
            to={this.props.to || null}
            href={this.props.href || null}
            onToggle={this.toggleNode.bind(this)}
            classBase={classBase}
            textStyle={getTextStyle(itemClass) || this.props.textStyle}
          >
            {this.props.icon &&
              React.cloneElement(this.props.icon, {
                className: classNames(
                  this.props.icon.props.className,
                  `${classBase}__entry__icon`,
                ),
              })}
            {typeof this.props.title === 'string' ? (
              <span style={this.props.textStyle}>{this.props.title}</span>
            ) : (
              this.props.title
            )}
          </SidebarMenuItemLink>
        )}
        {this.props.children && (
          <ul className="sidebar-submenu">
            {React.Children.map(this.props.children, (child) => (
              <MenuContext.Consumer>
                {(ctx) =>
                  React.cloneElement(child, {
                    isSubNode: true,
                    parentId: this.id,
                    currentUrl: this.props.currentUrl,
                    slim: this.props.slim,
                    ...ctx,
                  })
                }
              </MenuContext.Consumer>
            ))}
          </ul>
        )}
      </li>
    )
  }
}
